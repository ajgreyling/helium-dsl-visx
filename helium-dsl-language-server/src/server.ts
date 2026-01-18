import {
  createConnection,
  TextDocuments,
  TextDocumentSyncKind,
  InitializeParams,
  InitializeResult,
  CompletionItem,
  CompletionItemKind,
  SemanticTokensBuilder,
  SemanticTokensLegend,
  SemanticTokensParams,
  Hover,
  HoverParams,
  Location,
  Range,
  DefinitionParams,
  TypeDefinitionParams,
  ReferenceParams,
  DidChangeWatchedFilesNotification,
  MarkupContent,
  MarkupKind,
  CodeAction,
  CodeActionParams,
  CodeActionKind,
  TextEdit,
  DocumentFormattingParams,
  DocumentRangeFormattingParams,
  DocumentOnTypeFormattingParams,
  FormattingOptions,
  RenameParams,
  WorkspaceEdit,
  DocumentSymbol,
  DocumentSymbolParams,
  SymbolKind,
  WorkspaceSymbolParams,
  SymbolInformation,
  FoldingRange,
  FoldingRangeParams,
  SelectionRange,
  SelectionRangeParams,
  CallHierarchyItem,
  CallHierarchyPrepareParams,
  CallHierarchyIncomingCallsParams,
  CallHierarchyIncomingCall,
  CallHierarchyOutgoingCallsParams,
  CallHierarchyOutgoingCall,
  InlayHint,
  InlayHintParams,
  DocumentLink,
  DocumentLinkParams,
  ColorInformation,
  ColorPresentationParams,
  Color,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import * as path from "path";
import * as fs from "fs";
import { createDiagnostics } from "./diagnostics.js";
import { buildFileAst } from "./ast/builder.js";
import { runLints } from "./linter/engine.js";
import { ProjectManager } from "./index/projectManager.js";
import { initializeLogger, TraceLevel, logVerbose } from "./utils/logger.js";
import {
  createNoVarInElseFix,
  createNamingConventionFix,
  createForbiddenOperatorFix,
} from "./codeActions/quickFixes.js";
import { getLanguageMetadataSync } from "./language/metadata.js";
import { formatDocument, formatOnType } from "./formatting/formatter.js";
import {
  findFunctionCalls,
  findFunctionDefinition,
} from "./callHierarchy/callHierarchy.js";

// Log immediately when server module loads
console.error("[Server] ===== Language Server Module Loading =====");
console.error("[Server] Server process started");

const connection = createConnection();
const documents = new TextDocuments<TextDocument>(TextDocument);
const projectManager = new ProjectManager();

console.error("[Server] Connection and documents initialized");

const semanticLegend: SemanticTokensLegend = {
  tokenTypes: ["type", "function", "variable", "namespace"],
  tokenModifiers: [],
};

connection.onInitialize(async (params: InitializeParams): Promise<InitializeResult> => {
  console.error("[Server] ===== onInitialize Called =====");
  console.error("[Server] Initializing language server...");
  console.error(`[Server] Workspace folders:`, JSON.stringify(params.workspaceFolders, null, 2));
  console.error(`[Server] Root URI: ${params.rootUri || 'null'}`);
  console.error(`[Server] Root path: ${params.rootPath || 'null'}`);
  
  // Initialize logger with trace level from client
  // Check params.trace first (set by client.setTrace()), then fall back to initializationOptions
  const traceLevel: TraceLevel = 
    (params.trace as TraceLevel) || 
    ((params.initializationOptions as { trace?: string })?.trace as TraceLevel) || 
    "off";
  initializeLogger(traceLevel);
  console.error(`[Server] Logger initialized with trace level: ${traceLevel}`);
  
  // Initialize project manager with workspace folders
  console.error("[Server] Initializing project manager...");
  await projectManager.initialize(params.workspaceFolders || null);
  console.error("[Server] Project manager initialized");

  // After initializing the index, send a notification with all discovered user-defined types
  try {
    const types = projectManager.getUserTypes();
    logVerbose(`[Server] ===== Sending User Types Notification =====`);
    logVerbose(`[Server] Found ${types.length} user-defined types`);
    logVerbose(`[Server] Types: ${JSON.stringify(types, null, 2)}`);
    logVerbose(`[Server] Project roots: ${JSON.stringify(projectManager.getProjectRoots(), null, 2)}`);
    connection.sendNotification("helium/userTypes", types);
    logVerbose(`[Server] Notification sent successfully`);
  } catch (err) {
    console.error("[Server] ERROR sending userTypes notification:", err);
    console.error("[Server] Error stack:", err instanceof Error ? err.stack : String(err));
  }

  // Note: File watcher registration moved to onInitialized callback

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: { 
        resolveProvider: true,
        triggerCharacters: ['.', ':']
      },
      hoverProvider: true,
      semanticTokensProvider: {
        legend: semanticLegend,
        range: false,
        full: true,
      },
      definitionProvider: true,
      typeDefinitionProvider: true,
      referencesProvider: true,
      codeActionProvider: {
        codeActionKinds: [
          CodeActionKind.QuickFix,
          CodeActionKind.Refactor,
          CodeActionKind.RefactorExtract,
        ],
        resolveProvider: false,
      },
      documentFormattingProvider: true,
      documentRangeFormattingProvider: true,
      documentOnTypeFormattingProvider: {
        firstTriggerCharacter: '}',
        moreTriggerCharacter: [';', '\n'],
      },
      renameProvider: {
        prepareProvider: false,
      },
      documentSymbolProvider: true,
      workspaceSymbolProvider: {
        resolveProvider: false,
      },
      foldingRangeProvider: true,
      selectionRangeProvider: true,
      callHierarchyProvider: true,
      inlayHintProvider: {},
      documentLinkProvider: {
        resolveProvider: false,
      },
      colorProvider: true,
      workspace: {
        workspaceFolders: {
          supported: true,
          changeNotifications: true,
        },
      },
    },
  };
  
  // Register workspace folder change handler AFTER initialization
  // This must be done after the initialize response is returned
  // Use connection.onInitialized to ensure client is ready
  connection.onInitialized(() => {
    console.error("[Server] ===== onInitialized Called =====");
    // Now it's safe to register workspace folder change handler
    connection.workspace.onDidChangeWorkspaceFolders((_event) => {
      console.error("[Server] Workspace folders changed, re-initializing project manager...");
      connection.workspace.getWorkspaceFolders().then(async (folders) => {
        await projectManager.initialize(folders);
        try {
          const types = projectManager.getUserTypes();
          logVerbose(
            `[Server] Workspace folders changed - sending ${types.length} user-defined types to client`
          );
          connection.sendNotification("helium/userTypes", types);
        } catch (err) {
          console.error("[Server] Error sending userTypes after workspace folder change:", err);
        }
      });
    });
    console.error("[Server] Workspace folder change handler registered");
  });
  
  return result;
});

documents.onDidChangeContent((change) => {
  validateDocument(change.document);
  projectManager.updateDocument(change.document);
});

documents.onDidOpen((change) => {
  validateDocument(change.document);
  projectManager.updateDocument(change.document);
});

// Listen for watched file changes (add/remove) and refresh index as needed
// Note: File watcher registration is disabled because Cursor doesn't support client/registerCapability
// The registration would cause a server crash. Instead, we rely on document open/change events
// to update the workspace index when files are edited.
// 
// If file watching is needed in the future, we can implement it using a different approach
// that doesn't require client/registerCapability, such as polling or using the client's
// file system events directly.
//
// connection.onDidChangeWatchedFiles((params) => {
//   try {
//     for (const ch of params.changes) {
//       const fsPath = URI.parse(ch.uri).fsPath;
//       if (fsPath.endsWith('.mez') && fsPath.split(path.sep).includes('model')) {
//         workspaceIndex.updateFile(ch.uri);
//       }
//     }
//     const types = workspaceIndex.getDebugInfo().objects || [];
//     connection.sendNotification("helium/userTypes", types);
//   } catch (err) {
//     console.error('[Server] Error handling watched file changes:', err);
//   }
// });

async function validateDocument(document: TextDocument) {
  const text = document.getText();
  const syntaxDiagnostics = await createDiagnostics(text);
  const lintDiagnostics = await runLints(text);
  const diagnostics = [...syntaxDiagnostics, ...lintDiagnostics];
  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

connection.onCompletion(async (params): Promise<CompletionItem[]> => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return [];
  return projectManager.getCompletions(params, doc);
});

connection.onCompletionResolve(async (item: CompletionItem): Promise<CompletionItem> => {
  // Enhance completion item with documentation
  if (!item.documentation && item.detail) {
    item.documentation = {
      kind: MarkupKind.Markdown,
      value: item.detail,
    };
  }

  // Load BIF metadata for built-in functions
  if (item.label.includes(":")) {
    const [namespace, funcName] = item.label.split(":");
    try {
      // Try bundled path first, then development path
      const bundledPath = path.join(process.cwd(), "generated", "bifs", "bif-metadata.json");
      const devPath = path.join(process.cwd(), "..", "generated", "bifs", "bif-metadata.json");
      let bifPath = bundledPath;
      if (!fs.existsSync(bifPath)) {
        bifPath = devPath;
      }
      
      if (fs.existsSync(bifPath)) {
        const bifData = JSON.parse(fs.readFileSync(bifPath, "utf8"));
        const namespaces = bifData.namespaces || {};
        if (namespaces[namespace]) {
          const bif = namespaces[namespace].find((f: any) => f.name === funcName);
          if (bif) {
            item.detail = bif.signature || item.detail;
            if (bif.description) {
              item.documentation = {
                kind: MarkupKind.Markdown,
                value: `${bif.description}\n\n\`\`\`mez\n${bif.signature || item.label}\n\`\`\``,
              };
            }
          }
        }
      }
    } catch (err) {
      // Ignore errors loading BIF metadata
    }
  }

  // Enhance function completions with signatures
  if (item.kind === CompletionItemKind.Function && !item.documentation) {
    item.documentation = {
      kind: MarkupKind.Markdown,
      value: `Function: \`${item.label}()\``,
    };
  }

  // Enhance variable completions with type info
  if (item.kind === CompletionItemKind.Variable && !item.documentation) {
    item.documentation = {
      kind: MarkupKind.Markdown,
      value: `Variable: \`${item.label}\``,
    };
  }

  return item;
});

/**
 * Extract function signature from a line containing a function definition
 */
function extractFunctionSignature(line: string, functionName: string): string | null {
  // Match function definition: returnType functionName(params)
  const funcPattern = new RegExp(
    `\\b((?:int|void|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*))\\s+${functionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(([^)]*)\\)`,
    "g"
  );
  const match = funcPattern.exec(line);
  if (match) {
    const returnType = match[1];
    const params = match[2] || "";
    return `${returnType} ${functionName}(${params})`;
  }
  return null;
}

/**
 * Get function signature from file content
 */
function getFunctionSignature(
  functionName: string,
  fileContent: string,
  unitName?: string
): string | null {
  const lines = fileContent.split(/\r?\n/);
  let inUnit = !unitName;
  let braceDepth = 0;

  for (const line of lines) {
    // Check if we're entering the unit
    if (unitName) {
      const unitMatch = line.match(new RegExp(`\\bunit\\s+${unitName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*;`));
      if (unitMatch) {
        inUnit = true;
        continue;
      }
    }

    if (!inUnit) continue;

    // Track brace depth
    for (const char of line) {
      if (char === "{") braceDepth++;
      if (char === "}") braceDepth--;
    }

    // Look for function definition at top level (braceDepth === 0 or 1)
    if (braceDepth <= 1) {
      const signature = extractFunctionSignature(line, functionName);
      if (signature) {
        return signature;
      }
    }
  }
  return null;
}

connection.onHover(async (params: HoverParams): Promise<Hover | null> => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return null;
  }

  const position = params.position;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const line = lines[position.line] || "";

  // Extract word at cursor position (similar to onDefinition logic)
  let checkPosition = position.character;
  if (checkPosition < line.length && line[checkPosition] === ':') {
    checkPosition = checkPosition - 1;
  }

  let wordStart = checkPosition;
  while (wordStart > 0 && /[A-Za-z0-9_]/.test(line[wordStart - 1])) {
    wordStart--;
  }

  let wordEnd = checkPosition;
  while (wordEnd < line.length && /[A-Za-z0-9_]/.test(line[wordEnd])) {
    wordEnd++;
  }

  const fullWord = line.substring(wordStart, wordEnd);

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(fullWord)) {
    return null;
  }

  const charAfter = wordEnd < line.length ? line[wordEnd] : ' ';
  const looksLikeUnitRef = charAfter === ':';
  const charBefore = wordStart > 0 ? line[wordStart - 1] : ' ';
  const isWordBoundaryBefore = !/[A-Za-z0-9_]/.test(charBefore);
  const isWordBoundaryAfter = !/[A-Za-z0-9_]/.test(charAfter) || looksLikeUnitRef;

  if (!isWordBoundaryBefore || (!isWordBoundaryAfter && !looksLikeUnitRef)) {
    return null;
  }

  const content: string[] = [];
  
  const formatFunctionSignatureFromAst = (fn: any): string => {
    const params = (fn.params || [])
      .map((p: any) => `${p.typeName} ${p.name}`.trim())
      .join(", ");
    return `${fn.returnType} ${fn.name}(${params})`;
  };

  const isBeforeOrAt = (a: Position, b: Position): boolean => {
    if (a.line !== b.line) return a.line < b.line;
    return a.character <= b.character;
  };

  const findLocalVariable = (ast: any, name: string, pos: Position): { typeName: string; decl: any } | null => {
    const containingUnit = (ast.units || []).find((unit: any) =>
      (unit.functions || []).some(
        (fn: any) =>
          fn.bodyRange &&
          pos &&
          fn.bodyRange.start &&
          fn.bodyRange.end &&
          (pos.line > fn.bodyRange.start.line ||
            (pos.line === fn.bodyRange.start.line && pos.character >= fn.bodyRange.start.character)) &&
          (pos.line < fn.bodyRange.end.line ||
            (pos.line === fn.bodyRange.end.line && pos.character <= fn.bodyRange.end.character))
      )
    );
    const containingFn = containingUnit?.functions?.find(
      (fn: any) =>
        fn.bodyRange &&
        (pos.line > fn.bodyRange.start.line ||
          (pos.line === fn.bodyRange.start.line && pos.character >= fn.bodyRange.start.character)) &&
        (pos.line < fn.bodyRange.end.line ||
          (pos.line === fn.bodyRange.end.line && pos.character <= fn.bodyRange.end.character))
    );
    if (containingFn) {
      const param = (containingFn.params || []).find((p: any) => p.name === name);
      if (param) return { typeName: param.typeName, decl: param };
      const locals = (containingFn.locals || [])
        .filter((v: any) => v.name === name && v.nameRange?.start && isBeforeOrAt(v.nameRange.start, pos))
        .sort((a: any, b: any) => {
          if (a.nameRange.start.line !== b.nameRange.start.line) {
            return b.nameRange.start.line - a.nameRange.start.line;
          }
          return b.nameRange.start.character - a.nameRange.start.character;
        });
      if (locals.length > 0) return { typeName: locals[0].typeName, decl: locals[0] };
    }
    if (containingUnit) {
      const unitVar = (containingUnit.variables || []).find((v: any) => v.name === name);
      if (unitVar) return { typeName: unitVar.typeName, decl: unitVar };
    }
    return null;
  };

  const findFunctionDecl = (ast: any, name: string, unitName?: string): any | null => {
    const units = ast.units || [];
    if (unitName) {
      const unit = units.find((u: any) => u.name === unitName);
      const fn = unit?.functions?.find((f: any) => f.name === name);
      return fn || null;
    }
    for (const unit of units) {
      const fn = (unit.functions || []).find((f: any) => f.name === name);
      if (fn) return fn;
    }
    return null;
  };

  // Check if it's a unit reference
  if (looksLikeUnitRef) {
    const afterColon = line.substring(wordEnd + 1).trimStart();
    const methodMatch = afterColon.match(/^([a-z][A-Za-z0-9_]*)\s*\(/);
    
    if (methodMatch) {
      const methodName = methodMatch[1];
      
      if (isModelBif(methodName)) {
        // BIF on model type
        if (projectManager.isUserDefinedType(fullWord)) {
          const location = projectManager.getObjectLocation(fullWord);
          content.push(`**Type**: \`${fullWord}\``);
          content.push(`**BIF**: \`${methodName}()\``);
          content.push(`\nModel Built-In Function for type \`${fullWord}\`.`);
        }
      } else {
        // Unit method
        if (projectManager.isUnit(fullWord)) {
          const unitLocation = projectManager.getUnitLocation(fullWord);
          if (unitLocation) {
            try {
              const unitFilePath = URI.parse(unitLocation.uri).fsPath;
              const unitFileContent = fs.readFileSync(unitFilePath, "utf8");
              const unitAst = await buildFileAst(unitFileContent, unitLocation.uri);
              const fn = findFunctionDecl(unitAst, methodName, fullWord);
              if (fn) {
                const signature = formatFunctionSignatureFromAst(fn);
                content.push(`\`\`\`mez\n${signature}\n\`\`\``);
                content.push(`\nFunction in unit \`${fullWord}\`.`);
              } else {
                content.push(`**Unit**: \`${fullWord}\``);
                content.push(`**Method**: \`${methodName}()\``);
              }
            } catch (err) {
              content.push(`**Unit**: \`${fullWord}\``);
              content.push(`**Method**: \`${methodName}()\``);
            }
          }
        }
      }
    } else {
      // Just unit name
      if (projectManager.isUnit(fullWord)) {
        const unitLocation = projectManager.getUnitLocation(fullWord);
        content.push(`**Unit**: \`${fullWord}\``);
        if (unitLocation) {
          content.push(`\nDefined at line ${unitLocation.range.start.line + 1}.`);
        }
      }
    }
  } else {
    // Check if it's a user-defined type
    if (projectManager.isUserDefinedType(fullWord)) {
      const location = projectManager.getObjectLocation(fullWord);
      content.push(`**Type**: \`${fullWord}\``);
      if (location) {
        content.push(`\nDefined at line ${location.range.start.line + 1}.`);
      }
    } else if (projectManager.isUnit(fullWord)) {
      const unitLocation = projectManager.getUnitLocation(fullWord);
      content.push(`**Unit**: \`${fullWord}\``);
      if (unitLocation) {
        content.push(`\nDefined at line ${unitLocation.range.start.line + 1}.`);
      }
    } else {
      // Variable / function hover from AST (no heuristic symbol table).
      try {
        const ast = await buildFileAst(text, doc.uri);
        const localVar = findLocalVariable(ast, fullWord, position);
        if (localVar) {
          content.push(`**Variable**: \`${fullWord}\``);
          content.push(`**Type**: \`${localVar.typeName}\``);
          const declLine = localVar.decl?.nameRange?.start?.line;
          if (typeof declLine === "number") {
            content.push(`\nDeclared at line ${declLine + 1}.`);
          }
        } else {
          const fn = findFunctionDecl(ast, fullWord);
          if (fn) {
            const signature = formatFunctionSignatureFromAst(fn);
            content.push(`\`\`\`mez\n${signature}\n\`\`\``);
            const defLine = fn.nameRange?.start?.line;
            if (typeof defLine === "number") {
              content.push(`\nDefined at line ${defLine + 1}.`);
            }
          }
        }
      } catch {
        // Ignore parse errors for hover.
      }
    }
  }

  if (content.length === 0) {
    return null;
  }

  const markupContent: MarkupContent = {
    kind: MarkupKind.Markdown,
    value: content.join("\n\n"),
  };

  return {
    contents: markupContent,
  };
});

connection.onCodeAction((params: CodeActionParams): CodeAction[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }

  const text = doc.getText();
  const actions: CodeAction[] = [];

  // Process each diagnostic to create quick fixes
  for (const diagnostic of params.context.diagnostics) {
    const message = diagnostic.message.toLowerCase();

    if (message.includes("variable") && message.includes("else")) {
      // no-var-in-else rule
      const fix = createNoVarInElseFix(doc, diagnostic, text);
      if (fix) {
        actions.push(fix);
      }
    } else if (message.includes("naming") || message.includes("convention")) {
      // naming-conventions rule
      const fix = createNamingConventionFix(doc, diagnostic, text);
      if (fix) {
        actions.push(fix);
      }
    } else if (
      message.includes("forbidden") ||
      message.includes("operator") ||
      message.includes("negation") ||
      message.includes("ternary") ||
      message.includes("compound") ||
      message.includes("boolean")
    ) {
      // forbidden-operators rule
      const fix = createForbiddenOperatorFix(doc, diagnostic, text);
      if (fix) {
        actions.push(fix);
      }
    }
  }

  return actions;
});

connection.onDocumentFormatting((params: DocumentFormattingParams): TextEdit[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }
  return formatDocument(doc, params.options);
});

connection.onDocumentRangeFormatting((params: DocumentRangeFormattingParams): TextEdit[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }
  return formatDocument(doc, params.options, params.range);
});

connection.onDocumentOnTypeFormatting((params: DocumentOnTypeFormattingParams): TextEdit[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }
  return formatOnType(doc, params.position, params.ch, params.options);
});

connection.onRenameRequest((params: RenameParams): WorkspaceEdit | null => {
  return projectManager.getRenameEdits(params);
});

connection.onDocumentSymbol((params: DocumentSymbolParams): DocumentSymbol[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }
  return projectManager.getDocumentSymbols(doc);
});

/**
 * Check if a symbol is already in a unit
 */
function isInUnit(symbol: DocumentSymbol, unitSymbols: Map<string, DocumentSymbol>): boolean {
  for (const unitSymbol of unitSymbols.values()) {
    if (unitSymbol.children && unitSymbol.children.includes(symbol)) {
      return true;
    }
  }
  return false;
}

/**
 * Map internal symbol kind to LSP SymbolKind
 */
function mapSymbolKind(kind: string): SymbolKind {
  switch (kind) {
    case "unit":
      return SymbolKind.Namespace;
    case "function":
      return SymbolKind.Function;
    case "variable":
      return SymbolKind.Variable;
    case "object":
      return SymbolKind.Class;
    case "enum":
      return SymbolKind.Enum;
    case "attribute":
      return SymbolKind.Property;
    default:
      return SymbolKind.Variable;
  }
}

connection.onWorkspaceSymbol((params: WorkspaceSymbolParams): SymbolInformation[] => {
  return projectManager.getWorkspaceSymbols(params.query);
});

connection.onFoldingRanges((params: FoldingRangeParams): FoldingRange[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }

  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const ranges: FoldingRange[] = [];

  let braceDepth = 0;
  let inString = false;
  let stringChar: string | null = null;
  let inComment = false;
  let inBlockComment = false;
  let blockStartLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || "";
    let newInString: boolean = inString;
    let newStringChar: string | null = stringChar;
    let newInComment: boolean = inComment;
    let newInBlockComment: boolean = inBlockComment;

    // Track string and comment state
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = j + 1 < line.length ? line[j + 1] : null;

      if (!newInString && !newInComment && char === "/" && nextChar === "*") {
        newInBlockComment = true;
        blockStartLine = i;
        j++;
        continue;
      }
      if (newInBlockComment && char === "*" && nextChar === "/") {
        newInBlockComment = false;
        if (blockStartLine !== -1 && i > blockStartLine) {
          ranges.push({
            startLine: blockStartLine,
            endLine: i,
            kind: "comment",
          });
        }
        blockStartLine = -1;
        j++;
        continue;
      }
      if (!newInString && char === "/" && nextChar === "/") {
        newInComment = true;
        break;
      }
      if (!newInComment && (char === '"' || char === "'")) {
        if (!newInString) {
          newInString = true;
          newStringChar = char;
        } else if (char === newStringChar) {
          let escaped = false;
          let backslashCount = 0;
          for (let k = j - 1; k >= 0 && line[k] === "\\"; k--) {
            backslashCount++;
          }
          if (backslashCount % 2 === 0) {
            newInString = false;
            newStringChar = null;
          }
        }
      }
    }

    // Track brace depth for code blocks
    if (!newInString && !newInComment && !newInBlockComment) {
      let blockStart = -1;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === "{") {
          if (braceDepth === 0) {
            blockStart = i;
          }
          braceDepth++;
        }
        if (char === "}") {
          braceDepth--;
          if (braceDepth === 0 && blockStart !== -1 && i > blockStart) {
            ranges.push({
              startLine: blockStart,
              endLine: i,
            });
            blockStart = -1;
          }
        }
      }
    }

    inString = newInString;
    stringChar = newStringChar;
    inComment = false; // Reset at end of line
    inBlockComment = newInBlockComment;
  }

  return ranges;
});

connection.onSelectionRanges((params: SelectionRangeParams): SelectionRange[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }

  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const ranges: SelectionRange[] = [];

  for (const position of params.positions) {
    const line = lines[position.line] || "";
    const nestedRanges: SelectionRange[] = [];

    // Word selection
    let wordStart = position.character;
    while (wordStart > 0 && /[A-Za-z0-9_]/.test(line[wordStart - 1])) {
      wordStart--;
    }
    let wordEnd = position.character;
    while (wordEnd < line.length && /[A-Za-z0-9_]/.test(line[wordEnd])) {
      wordEnd++;
    }

    if (wordStart < wordEnd) {
      nestedRanges.push({
        range: {
          start: { line: position.line, character: wordStart },
          end: { line: position.line, character: wordEnd },
        },
      });
    }

    // Expression selection (until next operator or delimiter)
    let exprStart = wordStart;
    let exprEnd = wordEnd;
    while (exprStart > 0 && !/[+\-*/%=<>!&|,;()\[\]{}]/.test(line[exprStart - 1])) {
      exprStart--;
    }
    while (exprEnd < line.length && !/[+\-*/%=<>!&|,;()\[\]{}]/.test(line[exprEnd])) {
      exprEnd++;
    }

    if (exprStart < exprEnd && (exprStart !== wordStart || exprEnd !== wordEnd)) {
      nestedRanges.push({
        range: {
          start: { line: position.line, character: exprStart },
          end: { line: position.line, character: exprEnd },
        },
        parent: nestedRanges.length > 0 ? nestedRanges[nestedRanges.length - 1] : undefined,
      });
    }

    // Statement selection (until semicolon or newline)
    let stmtStart = exprStart;
    let stmtEnd = exprEnd;
    while (stmtStart > 0 && line[stmtStart - 1] !== ";" && stmtStart > 0) {
      stmtStart--;
    }
    while (stmtEnd < line.length && line[stmtEnd] !== ";") {
      stmtEnd++;
    }

    if (stmtStart < stmtEnd && (stmtStart !== exprStart || stmtEnd !== exprEnd)) {
      nestedRanges.push({
        range: {
          start: { line: position.line, character: stmtStart },
          end: { line: position.line, character: stmtEnd },
        },
        parent: nestedRanges.length > 0 ? nestedRanges[nestedRanges.length - 1] : undefined,
      });
    }

    // Block selection (find matching braces)
    let braceDepth = 0;
    let blockStartLine = position.line;
    let blockStartChar = position.character;
    let blockEndLine = position.line;
    let blockEndChar = position.character;

    // Find opening brace
    for (let i = position.line; i >= 0; i--) {
      const l = lines[i] || "";
      const startChar = i === position.line ? position.character : l.length;
      for (let j = startChar - 1; j >= 0; j--) {
        if (l[j] === "}") braceDepth++;
        if (l[j] === "{") {
          braceDepth--;
          if (braceDepth < 0) {
            blockStartLine = i;
            blockStartChar = j;
            braceDepth = 0;
            break;
          }
        }
      }
      if (braceDepth < 0) break;
    }

    // Find closing brace
    braceDepth = 0;
    for (let i = position.line; i < lines.length; i++) {
      const l = lines[i] || "";
      const startChar = i === position.line ? position.character : 0;
      for (let j = startChar; j < l.length; j++) {
        if (l[j] === "{") braceDepth++;
        if (l[j] === "}") {
          braceDepth--;
          if (braceDepth < 0) {
            blockEndLine = i;
            blockEndChar = j + 1;
            break;
          }
        }
      }
      if (braceDepth < 0) break;
    }

    if (blockStartLine !== blockEndLine || blockStartChar !== blockEndChar) {
      nestedRanges.push({
        range: {
          start: { line: blockStartLine, character: blockStartChar },
          end: { line: blockEndLine, character: blockEndChar },
        },
        parent: nestedRanges.length > 0 ? nestedRanges[nestedRanges.length - 1] : undefined,
      });
    }

    if (nestedRanges.length > 0) {
      ranges.push(nestedRanges[nestedRanges.length - 1]);
    }
  }

  return ranges;
});

connection.languages.callHierarchy.onPrepare(async (params: CallHierarchyPrepareParams): Promise<CallHierarchyItem[] | null> => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return null;
  }

  const position = params.position;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const line = lines[position.line] || "";

  // Extract function name at cursor
  let wordStart = position.character;
  while (wordStart > 0 && /[A-Za-z0-9_]/.test(line[wordStart - 1])) {
    wordStart--;
  }
  let wordEnd = position.character;
  while (wordEnd < line.length && /[A-Za-z0-9_]/.test(line[wordEnd])) {
    wordEnd++;
  }

  const functionName = line.substring(wordStart, wordEnd);
  if (!/^[a-z][A-Za-z0-9_]*$/.test(functionName)) {
    return null; // Function names start with lowercase
  }

  const definition = await findFunctionDefinition(doc, functionName);
  if (!definition) {
    return null;
  }

  return [
    {
      name: functionName,
      kind: SymbolKind.Function,
      uri: definition.uri,
      range: definition.range,
      selectionRange: definition.range,
    },
  ];
});

connection.languages.callHierarchy.onIncomingCalls(async (params: CallHierarchyIncomingCallsParams): Promise<CallHierarchyIncomingCall[]> => {
  const item = params.item;
  const functionName = item.name;
  const calls: CallHierarchyIncomingCall[] = [];

  // Search all open documents
  const allDocs = documents.all();
  const perDocCalls = await Promise.all(allDocs.map((d) => findFunctionCalls(d, functionName)));
  for (const docCalls of perDocCalls) {
    for (const call of docCalls) {
      calls.push({ from: item, fromRanges: [call.range] });
    }
  }

  return calls;
});

connection.languages.callHierarchy.onOutgoingCalls(async (params: CallHierarchyOutgoingCallsParams): Promise<CallHierarchyOutgoingCall[]> => {
  const doc = documents.get(params.item.uri);
  if (!doc) {
    return [];
  }

  const text = doc.getText();
  const calls: CallHierarchyOutgoingCall[] = [];

  // Find all function calls in the function body (AST-based)
  const functionName = params.item.name;
  let ast: any;
  try {
    ast = await buildFileAst(text, doc.uri);
  } catch {
    return [];
  }

  const decl = (ast.units || [])
    .flatMap((u: any) => u.functions || [])
    .find((fn: any) => fn.name === functionName);
  if (!decl?.bodyRange) return [];

  const resolveCalledFunction = (name: string, unitName?: string): any | null => {
    const units = ast.units || [];
    if (unitName) {
      const unit = units.find((u: any) => u.name === unitName);
      return unit?.functions?.find((f: any) => f.name === name) || null;
    }
    for (const unit of units) {
      const fn = (unit.functions || []).find((f: any) => f.name === name);
      if (fn) return fn;
    }
    return null;
  };

  const inBody = (range: any): boolean => {
    const s = decl.bodyRange.start;
    const e = decl.bodyRange.end;
    const p = range.start;
    if (p.line < s.line || (p.line === s.line && p.character < s.character)) return false;
    if (p.line > e.line || (p.line === e.line && p.character > e.character)) return false;
    return true;
  };

  for (const call of ast.functionCalls || []) {
    if (!call?.nameRange || !inBody(call.nameRange)) continue;
    if (call.name === functionName) continue;
    const called = resolveCalledFunction(call.name, call.unitName);
    if (!called?.nameRange) continue;
    const toItem: CallHierarchyItem = {
      name: called.name,
      kind: SymbolKind.Function,
      uri: doc.uri,
      range: called.nameRange,
      selectionRange: called.nameRange,
    };
    calls.push({ to: toItem, fromRanges: [call.nameRange] });
  }

  return calls;
});

connection.languages.inlayHint.on(async (params: InlayHintParams): Promise<InlayHint[]> => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }

  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const hints: InlayHint[] = [];

  let ast: any;
  try {
    ast = await buildFileAst(text, doc.uri);
  } catch {
    return [];
  }

  const findFunctionDecl = (name: string, unitName?: string): any | null => {
    const units = ast.units || [];
    if (unitName) {
      const unit = units.find((u: any) => u.name === unitName);
      return unit?.functions?.find((f: any) => f.name === name) || null;
    }
    for (const unit of units) {
      const fn = (unit.functions || []).find((f: any) => f.name === name);
      if (fn) return fn;
    }
    return null;
  };

  for (const call of ast.functionCalls || []) {
    const fn = findFunctionDecl(call.name, call.unitName);
    const firstParam = fn?.params?.[0];
    if (!firstParam?.name) continue;

    const lineIndex = call.nameRange?.start?.line;
    if (typeof lineIndex !== "number") continue;
    const line = lines[lineIndex] || "";
    const searchFrom = call.nameRange?.end?.character ?? 0;
    const openParenIndex = line.indexOf("(", searchFrom);
    if (openParenIndex === -1) continue;

    hints.push({
      position: { line: lineIndex, character: openParenIndex + 1 },
      label: `${firstParam.name}:`,
      kind: 1, // Parameter
    });
  }

  return hints;
});

connection.onDocumentLinks((params: DocumentLinkParams): DocumentLink[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }

  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const links: DocumentLink[] = [];

  // Find URLs
  const urlPattern = /https?:\/\/[^\s)]+/g;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let match: RegExpExecArray | null;

    urlPattern.lastIndex = 0;
    while ((match = urlPattern.exec(line)) !== null) {
      links.push({
        range: {
          start: { line: lineIndex, character: match.index },
          end: { line: lineIndex, character: match.index + match[0].length },
        },
        target: match[0],
      });
    }
  }

  return links;
});

connection.onDocumentColor((params: { textDocument: { uri: string } }): ColorInformation[] => {
  // Helium Rapid DSL (ANTLR4) doesn't have color literals, return empty array
  return [];
});

connection.onColorPresentation((params: ColorPresentationParams): { label: string }[] => {
  // Helium Rapid DSL (ANTLR4) doesn't have color literals, return empty array
  return [];
});

/**
 * Find a function definition in a file's content
 * Returns the location of the function definition, or null if not found
 */
function findFunctionDefinitionInFile(
  functionName: string,
  fileContent: string,
  fileUri: string
): Location | null {
  const lines = fileContent.split(/\r?\n/);
  
  // Pattern to match function definitions: returnType functionName(
  // Same pattern as used in buildSymbolTable
  const functionPattern = new RegExp(
    `\\b(?:int|void|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*)\\s+${functionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`,
    "g"
  );

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let match: RegExpExecArray | null;
    
    // Reset regex lastIndex for each line
    functionPattern.lastIndex = 0;
    
    while ((match = functionPattern.exec(line)) !== null) {
      const matchIndex = match.index;
      
      // Skip if in comment
      const beforeMatch = line.substring(0, matchIndex);
      const commentIndex = beforeMatch.indexOf("//");
      if (commentIndex !== -1) {
        // Check if it's not inside a string
        const beforeComment = beforeMatch.substring(0, commentIndex);
        const singleQuotes = (beforeComment.match(/'/g) || []).length;
        const doubleQuotes = (beforeComment.match(/"/g) || []).length;
        if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0) {
          continue; // It's in a comment
        }
      }
      
      // Found the function definition
      // Find the start of the function name (after the return type)
      const returnTypeMatch = beforeMatch.match(/\b(?:int|void|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*)\s+$/);
      const functionNameStart = returnTypeMatch 
        ? returnTypeMatch.index! + returnTypeMatch[0].length
        : matchIndex;
      
      const location: Location = {
        uri: fileUri,
        range: {
          start: {
            line: lineIndex,
            character: functionNameStart,
          },
          end: {
            line: lineIndex,
            character: functionNameStart + functionName.length,
          },
        },
      };
      
      console.log(`[Definition] Found function "${functionName}" in file at line ${lineIndex + 1}, character ${functionNameStart}`);
      return location;
    }
  }
  
  return null;
}

/**
 * Find the current unit context by scanning backwards from the cursor position
 * Returns the unit name if we're inside a unit, or null if not
 */
function findCurrentUnitContext(
  lines: string[],
  cursorLine: number,
  cursorCharacter: number
): string | null {
  let braceDepth = 0;
  let foundUnit: string | null = null;
  
  // Scan backwards from cursor position
  for (let lineIndex = cursorLine; lineIndex >= 0; lineIndex--) {
    const line = lines[lineIndex];
    
    // On the cursor line, only count braces before the cursor position
    // On previous lines, count all braces
    const endIndex = lineIndex === cursorLine ? cursorCharacter : line.length;
    const lineSegment = line.substring(0, endIndex);
    
    // Track brace depth
    for (let i = 0; i < lineSegment.length; i++) {
      if (lineSegment[i] === '{') {
        braceDepth++;
      } else if (lineSegment[i] === '}') {
        braceDepth--;
        // If brace depth goes negative, we've gone outside the unit scope
        if (braceDepth < 0) {
          return foundUnit;
        }
      }
    }
    
    // Look for unit declaration: unit UnitName;
    const unitMatch = line.match(/\bunit\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/);
    if (unitMatch) {
      const unitName = unitMatch[1];
      // If we found a unit and brace depth is >= 0, we're inside this unit
      if (braceDepth >= 0) {
        foundUnit = unitName;
        console.log(`[Definition] Found unit context: "${unitName}" at line ${lineIndex + 1}, braceDepth=${braceDepth}`);
        return unitName;
      }
      // If brace depth is negative, we've passed outside this unit's scope
      return foundUnit;
    }
  }
  
  return foundUnit;
}

/**
 * Check if a method name is a Built-In Function (BIF) that operates on model types
 * BIFs like :all(), :read(), :delete(), :new(), :equals() operate on persistent objects (models), not units
 */
function isModelBif(methodName: string): boolean {
  const metadata = getLanguageMetadataSync();
  return (metadata.modelBifs || []).includes(methodName);
}

connection.onDefinition((params: DefinitionParams): Location | Location[] | null => {
  const doc = documents.get(params.textDocument.uri);
  if (doc && params.textDocument.uri.includes("GbvChatClient.mez")) {
    const line = doc.getText().split(/\r?\n/)[params.position.line] || "";
    const wordAtPos = extractTypeNameAtPosition(doc, params.position);
    console.error(`[DEBUG] onDefinition: uri=${params.textDocument.uri}, position=(${params.position.line},${params.position.character}), word="${wordAtPos}", line="${line.substring(0, 80)}"`);
  }
  return projectManager.getDefinition(params);
});

connection.onTypeDefinition((params: TypeDefinitionParams): Location | Location[] | null => {
  const doc = documents.get(params.textDocument.uri);
  if (doc && params.textDocument.uri.includes("GbvChatClient.mez")) {
    const line = doc.getText().split(/\r?\n/)[params.position.line] || "";
    const wordAtPos = extractTypeNameAtPosition(doc, params.position);
    console.error(`[DEBUG] onTypeDefinition: uri=${params.textDocument.uri}, position=(${params.position.line},${params.position.character}), word="${wordAtPos}", line="${line.substring(0, 80)}"`);
  }
  return projectManager.getDefinition(params);
});

/**
 * Extract the type name at the cursor position
 */
function extractTypeNameAtPosition(
  doc: TextDocument,
  position: { line: number; character: number }
): string | null {
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const line = lines[position.line] || "";

  // Check if cursor is on or before a colon (for unit references like UnitName:functionName)
  let checkPosition = position.character;
  if (checkPosition < line.length && line[checkPosition] === ':') {
    checkPosition = checkPosition - 1;
  }

  // Find the word boundaries around the cursor position
  let wordStart = checkPosition;
  while (wordStart > 0 && /[A-Za-z0-9_]/.test(line[wordStart - 1])) {
    wordStart--;
  }

  let wordEnd = checkPosition;
  while (wordEnd < line.length && /[A-Za-z0-9_]/.test(line[wordEnd])) {
    wordEnd++;
  }

  const fullWord = line.substring(wordStart, wordEnd);

  // Verify it's a valid type identifier
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(fullWord)) {
    return null;
  }

  // Verify it's a complete word (has word boundaries on both sides, or is followed by ':')
  const charBefore = wordStart > 0 ? line[wordStart - 1] : " ";
  const charAfter = wordEnd < line.length ? line[wordEnd] : " ";
  const isWordBoundaryBefore = !/[A-Za-z0-9_]/.test(charBefore);
  const isWordBoundaryAfter = !/[A-Za-z0-9_]/.test(charAfter) || charAfter === ':';

  if (!isWordBoundaryBefore || (!isWordBoundaryAfter && charAfter !== ':')) {
    return null;
  }

  return fullWord;
}

/**
 * Check if a match is in a comment
 */
function isInComment(line: string, matchIndex: number): boolean {
  // Simple heuristic: check if there's a // before the match on the same line
  const beforeMatch = line.substring(0, matchIndex);
  // Check for // comments (but not in strings)
  const commentIndex = beforeMatch.indexOf("//");
  if (commentIndex !== -1) {
    // Check if it's not inside a string
    const beforeComment = beforeMatch.substring(0, commentIndex);
    const singleQuotes = (beforeComment.match(/'/g) || []).length;
    const doubleQuotes = (beforeComment.match(/"/g) || []).length;
    // If even number of quotes before comment, comment is valid
    if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a match is part of an object definition line
 */
function isObjectDefinition(line: string, matchIndex: number, typeName: string): boolean {
  const beforeMatch = line.substring(0, matchIndex).trimEnd();
  // Check if this appears after "object" or "persistent object"
  return /\b(persistent\s+)?object\s*$/.test(beforeMatch);
}

/**
 * Check if a match is a variable declaration (not a type reference)
 */
function isVariableDeclaration(
  line: string,
  matchIndex: number,
  lineIndex: number,
  typeName: string,
  symbolTable: ReturnType<typeof buildSymbolTable>
): boolean {
  const afterMatch = line.substring(matchIndex + typeName.length);
  const beforeMatch = line.substring(0, matchIndex).trimEnd();

  // Check if there's a type-like pattern before this identifier
  // Pattern: <type> <identifier> = or <type> <identifier>;
  if (
    /^(=|;|,|\))/.test(afterMatch) &&
    /\b(?:int|void|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*)\s+$/.test(
      beforeMatch
    )
  ) {
    // This looks like a variable declaration: <type> <identifier> = or <type> <identifier>;
    return true;
  }

  // Check if this identifier is a local variable or parameter
  const varDeclLines = symbolTable.symbols
    .filter((s) => s.kind === "variable" && s.name === typeName && s.location)
    .map((s) => s.location!.line);
  // If there's a variable declaration before this line, it's likely a variable reference
  if (varDeclLines.some((declLine) => declLine <= lineIndex)) {
    return true;
  }

  return false;
}

/**
 * Search a document for references to a type name
 */
function findReferencesInDocument(
  doc: TextDocument,
  typeName: string,
  excludeDefinition: boolean
): Location[] {
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const uri = doc.uri;
  const references: Location[] = [];
  const symbolTable = buildSymbolTable(text);

  // Get the definition location to exclude it if needed
  const definitionLocation = projectManager.getObjectLocation(typeName);
  const definitionUri = definitionLocation?.uri;
  const definitionLine = definitionLocation?.range.start.line;

  // Create regex with word boundaries to match the type name
  const regex = new RegExp(`\\b${typeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let match: RegExpExecArray | null;

    // Reset regex lastIndex for each line
    regex.lastIndex = 0;

    while ((match = regex.exec(line)) !== null) {
      const matchIndex = match.index;

      // Skip if in comment
      if (isInComment(line, matchIndex)) {
        continue;
      }

      // Skip if it's part of an object definition line
      if (isObjectDefinition(line, matchIndex, typeName)) {
        // Include definition only if includeDeclaration is true
        if (excludeDefinition && uri === definitionUri && lineIndex === definitionLine) {
          continue;
        }
        // Otherwise include it as a reference
      }

      // Skip if it's a variable declaration (not a type reference)
      if (isVariableDeclaration(line, matchIndex, lineIndex, typeName, symbolTable)) {
        continue;
      }

      // Skip the definition if excludeDefinition is true
      if (excludeDefinition && uri === definitionUri && lineIndex === definitionLine) {
        continue;
      }

      // Create location for this reference
      const location: Location = {
        uri,
        range: {
          start: { line: lineIndex, character: matchIndex },
          end: { line: lineIndex, character: matchIndex + typeName.length },
        },
      };
      references.push(location);
    }
  }

  return references;
}

/**
 * Search a document for references to a unit name
 */
function findUnitReferencesInDocument(
  doc: TextDocument,
  unitName: string,
  excludeDefinition: boolean
): Location[] {
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const uri = doc.uri;
  const references: Location[] = [];

  // Get the definition location to exclude it if needed
  const definitionLocation = projectManager.getUnitLocation(unitName);
  const definitionUri = definitionLocation?.uri;
  const definitionLine = definitionLocation?.range.start.line;

  // Create regex to match unit references: UnitName: or standalone UnitName
  // Pattern: \bUnitName\b(?=\s*:) or \bUnitName\b (with word boundaries)
  const escapedUnitName = unitName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const unitRefRegex = new RegExp(`\\b${escapedUnitName}\\b(?=\\s*:)|\\b${escapedUnitName}\\b`, "g");

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let match: RegExpExecArray | null;

    // Reset regex lastIndex for each line
    unitRefRegex.lastIndex = 0;

    while ((match = unitRefRegex.exec(line)) !== null) {
      const matchIndex = match.index;

      // Skip if in comment
      if (isInComment(line, matchIndex)) {
        continue;
      }

      // Check if this is a unit definition (unit UnitName;)
      const beforeMatch = line.substring(0, matchIndex).trimEnd();
      const isUnitDefinition = /\bunit\s*$/.test(beforeMatch);
      
      // Skip the definition if excludeDefinition is true
      if (excludeDefinition && isUnitDefinition && uri === definitionUri && lineIndex === definitionLine) {
        continue;
      }

      // Verify it's followed by ':' or has word boundaries (to avoid matching parts of other words)
      const charAfter = matchIndex + unitName.length < line.length ? line[matchIndex + unitName.length] : ' ';
      const isUnitRef = charAfter === ':' || !/[A-Za-z0-9_]/.test(charAfter);
      
      if (!isUnitRef) {
        continue;
      }

      // Create location for this reference
      const location: Location = {
        uri,
        range: {
          start: { line: lineIndex, character: matchIndex },
          end: { line: lineIndex, character: matchIndex + unitName.length },
        },
      };
      references.push(location);
    }
  }

  return references;
}

/**
 * Recursively scan directory for .mez files
 */
function scanDirectoryForReferences(
  dir: string,
  typeName: string,
  excludeDefinition: boolean,
  openDocumentUris: Set<string>
): Location[] {
  const references: Location[] = [];

  try {
    if (!fs.existsSync(dir)) {
      return references;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Scan model directories and subdirectories
        if (entry.name === "model" || !entry.name.startsWith(".")) {
          const subRefs = scanDirectoryForReferences(
            fullPath,
            typeName,
            excludeDefinition,
            openDocumentUris
          );
          references.push(...subRefs);
        }
      } else if (entry.isFile() && entry.name.endsWith(".mez")) {
        // Check if this file is in a model directory
        const parts = fullPath.split(path.sep);
        if (parts.includes("model")) {
          const uri = URI.file(fullPath).toString();
          // Skip if already processed as an open document
          if (openDocumentUris.has(uri)) {
            continue;
          }

          try {
            const content = fs.readFileSync(fullPath, "utf8");
            const doc = TextDocument.create(uri, "mez", 1, content);
            const fileRefs = findReferencesInDocument(doc, typeName, excludeDefinition);
            references.push(...fileRefs);
          } catch (err) {
            // Silently ignore errors reading files
            console.error(`[References] Error reading file ${fullPath}:`, err);
          }
        }
      }
    }
  } catch (err) {
    // Silently ignore errors (permissions, etc.)
  }

  return references;
}

/**
 * Recursively scan directory for .mez files (for unit references)
 */
function scanDirectoryForUnitReferences(
  dir: string,
  unitName: string,
  excludeDefinition: boolean,
  openDocumentUris: Set<string>
): Location[] {
  const references: Location[] = [];

  try {
    if (!fs.existsSync(dir)) {
      return references;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Scan service directories (services, utilities, web-app) and subdirectories
        if (entry.name === "services" || entry.name === "utilities" || entry.name === "web-app" || !entry.name.startsWith(".")) {
          const subRefs = scanDirectoryForUnitReferences(
            fullPath,
            unitName,
            excludeDefinition,
            openDocumentUris
          );
          references.push(...subRefs);
        }
      } else if (entry.isFile() && entry.name.endsWith(".mez")) {
        // Check if this file is in a service directory
        const parts = fullPath.split(path.sep);
        if (parts.includes("services") || parts.includes("utilities") || parts.includes("web-app")) {
          const uri = URI.file(fullPath).toString();
          // Skip if already processed as an open document
          if (openDocumentUris.has(uri)) {
            continue;
          }

          try {
            const content = fs.readFileSync(fullPath, "utf8");
            const doc = TextDocument.create(uri, "mez", 1, content);
            const fileRefs = findUnitReferencesInDocument(doc, unitName, excludeDefinition);
            references.push(...fileRefs);
          } catch (err) {
            // Silently ignore errors reading files
            console.error(`[References] Error reading file ${fullPath}:`, err);
          }
        }
        // Also search in model directories for unit references (units can be referenced from anywhere)
        else if (parts.includes("model")) {
          const uri = URI.file(fullPath).toString();
          if (openDocumentUris.has(uri)) {
            continue;
          }

          try {
            const content = fs.readFileSync(fullPath, "utf8");
            const doc = TextDocument.create(uri, "mez", 1, content);
            const fileRefs = findUnitReferencesInDocument(doc, unitName, excludeDefinition);
            references.push(...fileRefs);
          } catch (err) {
            console.error(`[References] Error reading file ${fullPath}:`, err);
          }
        }
      }
    }
  } catch (err) {
    // Silently ignore errors (permissions, etc.)
  }

  return references;
}

connection.onReferences((params: ReferenceParams): Location[] => {
  return projectManager.getReferences(params);
});

connection.languages.semanticTokens.on(async (params: SemanticTokensParams) => {
  logVerbose(`[SemanticTokens] ===== Request Received =====`);
  logVerbose(`[SemanticTokens] URI: ${params.textDocument.uri}`);
  const doc = documents.get(params.textDocument.uri);
  const builder = new SemanticTokensBuilder();
  
  if (!doc) {
    console.error(`[SemanticTokens] ERROR: Document not found for ${params.textDocument.uri}`);
    return builder.build();
  }
  
  const text = doc.getText();
  const userTypes = new Set(projectManager.getUserTypes());

  const pushRange = (range: { start: { line: number; character: number }; end: { line: number; character: number } }, tokenTypeIndex: number) => {
    // SemanticTokensBuilder.push expects a single-line token span.
    // Our AST ranges for identifiers are token-based and should be single-line.
    if (range.start.line !== range.end.line) return;
    const length = range.end.character - range.start.character;
    if (length <= 0) return;
    builder.push(range.start.line, range.start.character, length, tokenTypeIndex, 0);
  };

  const isUserType = (name: string): boolean => {
    const base = name.replace(/\[\]$/, "");
    return userTypes.has(base);
  };

  try {
    // Parse the current document text for accurate, up-to-date ranges.
    const ast = await buildFileAst(text, params.textDocument.uri);

    // Highlight user-defined types based on structural type references.
    for (const ref of ast.typeReferences) {
      if (isUserType(ref.name)) {
        pushRange(ref.nameRange, 0); // 0 = "type"
      }
    }

    // Highlight user-defined types in declarations (attributes, relationships, variables, params, return types).
    // These are fully parsed spans and avoid heuristic token scanning.
    for (const obj of ast.objects) {
      for (const attr of obj.attributes) {
        if (isUserType(attr.typeName)) pushRange(attr.typeRange, 0);
      }
      for (const rel of obj.relationships) {
        if (isUserType(rel.targetType)) pushRange(rel.targetRange, 0);
      }
    }
    for (const unit of ast.units) {
      for (const v of unit.variables) {
        if (isUserType(v.typeName)) pushRange(v.typeRange, 0);
      }
      for (const fn of unit.functions) {
        if (isUserType(fn.returnType)) pushRange(fn.returnTypeRange, 0);
        for (const p of fn.params) {
          if (isUserType(p.typeName)) pushRange(p.typeRange, 0);
        }
        for (const local of fn.locals) {
          if (isUserType(local.typeName)) pushRange(local.typeRange, 0);
        }
      }
    }

    // Highlight model-BIF type names in `TypeName:method()` calls (these are unitReferences in the AST).
    // We intentionally do NOT highlight unit references as namespaces here (TextMate handles `UnitName:` references).
    for (const ref of ast.unitReferences) {
      if (isUserType(ref.name)) {
        pushRange(ref.nameRange, 0); // 0 = "type"
      }
    }
  } catch (err) {
    // Fail closed: return no semantic tokens if parsing fails.
    console.error(
      `[SemanticTokens] ERROR: Failed to build AST for ${params.textDocument.uri}: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  const result = builder.build();
  const tokenCount = result.data.length / 5;
  logVerbose(`[SemanticTokens] ===== Returning ${tokenCount} tokens =====`);
  return result;
});

// Note: Workspace folder change handler is now registered in onInitialized callback
// to ensure the client supports workspace folder change notifications

console.error("[Server] Starting to listen for connections...");
documents.listen(connection);
connection.listen();
console.error("[Server] ===== Server listening, ready to receive requests =====");

