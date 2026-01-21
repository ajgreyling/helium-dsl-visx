import {
  createConnection,
  TextDocuments,
  TextDocumentSyncKind,
  InitializeParams,
  InitializeResult,
  CompletionItem,
  CompletionItemKind,
  Diagnostic,
  DiagnosticSeverity,
  SemanticTokensBuilder,
  SemanticTokensLegend,
  SemanticTokensParams,
  SemanticTokensRangeParams,
  SignatureHelp,
  SignatureHelpParams,
  SignatureInformation,
  ParameterInformation,
  Hover,
  HoverParams,
  Location,
  Position,
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
  DocumentHighlight,
  DocumentHighlightKind,
  DocumentHighlightParams,
  FileChangeType,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import * as path from "path";
import * as fs from "fs";
import { createDiagnostics } from "./diagnostics.js";
import { rangeContains, buildFileAst } from "./ast/builder.js";
import { runLints } from "./linter/engine.js";
import { ProjectManager } from "./index/projectManager.js";
import { initializeLogger, TraceLevel, logVerbose } from "./utils/logger.js";
import { createSemanticDiagnostics } from "./semantic/diagnostics.js";
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
import { buildSignatureHelpFromLabel, findCallAtPosition } from "./utils/signatureHelp.js";
import { buildVxmlAst } from "./vxml/parser.js";
import { validateVxml, type VxmlDiagnostic } from "./vxml/validator.js";

// Log immediately when server module loads
console.error("[Server] ===== Language Server Module Loading =====");
console.error("[Server] Server process started");

const connection = createConnection();
const documents = new TextDocuments<TextDocument>(TextDocument);
const projectManager = new ProjectManager();

console.error("[Server] Connection and documents initialized");

const IGNORED_DIRS = new Set(["node_modules", ".git", ".idea", ".vscode"]);

// Debounce validation for disk-written files (AI writes often trigger bursts of events).
const validateDebounceTimers = new Map<string, NodeJS.Timeout>();
const vxmlRevalidateProjectTimers = new Map<string, NodeJS.Timeout>();

const semanticLegend: SemanticTokensLegend = {
  tokenTypes: ["type", "function", "variable", "namespace"],
  tokenModifiers: [],
};

type BifMetadata = {
  namespaces?: Record<
    string,
    Array<{
      name: string;
      signature?: string;
      description?: string;
    }>
  >;
};

let bifMetadataCache: BifMetadata | null = null;
function loadBifMetadata(): BifMetadata | null {
  if (bifMetadataCache) return bifMetadataCache;
  try {
    const bundledPath = path.join(process.cwd(), "generated", "bifs", "bif-metadata.json");
    const devPath = path.join(process.cwd(), "..", "generated", "bifs", "bif-metadata.json");
    let bifPath = bundledPath;
    if (!fs.existsSync(bifPath)) {
      bifPath = devPath;
    }
    if (!fs.existsSync(bifPath)) return null;
    const data = JSON.parse(fs.readFileSync(bifPath, "utf8")) as BifMetadata;
    bifMetadataCache = data;
    return data;
  } catch {
    return null;
  }
}

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
  // Background indexing makes initialization fast on large workspaces (I/O-bound).
  await projectManager.initialize(params.workspaceFolders || null, { mode: "background" });
  console.error("[Server] Project manager initialized");

  // Send user-defined types once background indexing completes.
  projectManager.whenIndexingComplete().then(() => {
    try {
      const types = projectManager.getUserTypes();
      logVerbose(`[Server] ===== Sending User Types Notification =====`);
      logVerbose(`[Server] Found ${types.length} user-defined types`);
      logVerbose(`[Server] Types: ${JSON.stringify(types, null, 2)}`);
      logVerbose(`[Server] Project roots: ${JSON.stringify(projectManager.getProjectRoots(), null, 2)}`);
      connection.sendNotification("helium/userTypes", types);
      logVerbose(`[Server] Notification sent successfully`);

      // Revalidate open documents now that semantic indexing is complete.
      // This ensures any gated semantic diagnostics appear without requiring an edit.
      for (const doc of documents.all()) {
        if (isMezDocument(doc)) {
          validateDocument(doc).catch(() => {});
        }
      }

      // One-time startup scan: publish diagnostics for unopened files too.
      // This is intentionally best-effort and runs in the background.
      startStartupDiagnosticsScan().catch(() => {});
    } catch (err) {
      console.error("[Server] ERROR sending userTypes notification:", err);
      console.error("[Server] Error stack:", err instanceof Error ? err.stack : String(err));
    }
  }).catch(() => {});

  // Note: File watcher registration moved to onInitialized callback

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: { 
        resolveProvider: true,
        triggerCharacters: ['.', ':']
      },
      signatureHelpProvider: {
        triggerCharacters: ["(", ","],
        retriggerCharacters: [","],
      },
      hoverProvider: true,
      semanticTokensProvider: {
        legend: semanticLegend,
        range: true,
        full: true,
      },
      definitionProvider: true,
      typeDefinitionProvider: true,
      referencesProvider: true,
      documentHighlightProvider: true,
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
  if (isMezDocument(change.document) || isVxmlDocument(change.document)) {
    projectManager.updateDocument(change.document);
  }
});

documents.onDidOpen((change) => {
  validateDocument(change.document);
  if (isMezDocument(change.document) || isVxmlDocument(change.document) || isLangDocument(change.document)) {
    projectManager.updateDocument(change.document);
  }
});

// Handle client-side file watcher notifications.
// This does NOT rely on client/registerCapability (which Cursor may not support).
// The VS Code/Cursor client sends `workspace/didChangeWatchedFiles` based on
// clientOptions.synchronize.fileEvents.
connection.onDidChangeWatchedFiles((params) => {
  try {
    for (const ch of params.changes) {
      const uri = ch.uri;
      const fsPath = safeFsPath(uri);

      // We only validate these file types from disk.
      const isMez = fsPath.endsWith(".mez");
      const isVxml = fsPath.endsWith(".vxml");
      const isLang = fsPath.endsWith(".lang");
      if (!isMez && !isVxml && !isLang) continue;

      // Prefer open-document validation (avoids stomping over unsaved edits).
      if ((isMez || isVxml) && documents.get(uri)) {
        continue;
      }

      if (ch.type === FileChangeType.Deleted) {
        // Clear any pending validations and clear diagnostics.
        const t = validateDebounceTimers.get(uri);
        if (t) {
          clearTimeout(t);
          validateDebounceTimers.delete(uri);
        }

        projectManager.removeDocument(uri);
        connection.sendDiagnostics({ uri, diagnostics: [] });
        continue;
      }

      // Created or Changed
      if (isLang) {
        // Update language key index, then revalidate VXML files in the same project root.
        scheduleUpdateLangFromDisk(uri);
        continue;
      }

      scheduleValidateFromDisk(uri);
    }
  } catch (err) {
    console.error("[Server] Error handling watched file changes:", err);
  }
});

async function validateDocument(document: TextDocument) {
  const text = document.getText();
  if (isVxmlDocument(document)) {
    // VXML is XML, not Helium DSL: avoid ANTLR parser/lints and validate via VXML rules.
    const ast = buildVxmlAst(text, document.uri);
    const vxmlDiagnostics = validateVxml(ast, projectManager);
    connection.sendDiagnostics({
      uri: document.uri,
      diagnostics: vxmlDiagnostics.map(toLspDiagnostic),
    });
    return;
  }

  const syntaxDiagnostics = await createDiagnostics(text);
  const lintDiagnostics = await runLints(text);
  const indexingComplete = (projectManager as any)?.isIndexingComplete?.() === true;
  // Gate semantic diagnostics until project indexing completes to avoid transient false positives
  // (e.g. unknown unit/type while the index is empty).
  let semanticDiagnostics: Diagnostic[] = [];
  if (indexingComplete) {
    semanticDiagnostics = await createSemanticDiagnostics(text, document.uri, projectManager);
  } else {
  }
  const diagnostics = [...syntaxDiagnostics, ...lintDiagnostics, ...semanticDiagnostics];
  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

function isVxmlDocument(document: TextDocument): boolean {
  const fsPath = safeFsPath(document.uri);
  return fsPath.endsWith(".vxml");
}

function isMezDocument(document: TextDocument): boolean {
  const fsPath = safeFsPath(document.uri);
  return fsPath.endsWith(".mez");
}

function isLangDocument(document: TextDocument): boolean {
  const fsPath = safeFsPath(document.uri);
  return fsPath.endsWith(".lang");
}

function safeFsPath(uri: string): string {
  try {
    return URI.parse(uri).fsPath;
  } catch {
    // Best-effort fallback: the URI itself might be a path-like string.
    return uri;
  }
}

function toLspDiagnostic(d: VxmlDiagnostic): Diagnostic {
  return {
    message: d.message,
    range: {
      start: { line: d.range.start.line, character: d.range.start.character },
      end: { line: d.range.end.line, character: d.range.end.character },
    },
    severity: (d.severity ?? DiagnosticSeverity.Error) as DiagnosticSeverity,
    source: d.source ?? "helium-vxml",
  };
}

function scheduleValidateFromDisk(uri: string, debounceMs = 250) {
  const existing = validateDebounceTimers.get(uri);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    validateDebounceTimers.delete(uri);
    validateFromDisk(uri).catch(() => {});
  }, debounceMs);
  validateDebounceTimers.set(uri, timer);
}

function scheduleUpdateLangFromDisk(uri: string, debounceMs = 250) {
  const existing = validateDebounceTimers.get(uri);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    validateDebounceTimers.delete(uri);
    updateLangFromDisk(uri).catch(() => {});
  }, debounceMs);
  validateDebounceTimers.set(uri, timer);
}

async function validateFromDisk(uri: string): Promise<void> {
  // Skip if open (open document has the source of truth).
  if (documents.get(uri)) return;

  const fsPath = safeFsPath(uri);
  if (!fsPath) return;
  if (!fs.existsSync(fsPath)) return;

  const isVxml = fsPath.endsWith(".vxml");
  const isMez = fsPath.endsWith(".mez");
  if (!isVxml && !isMez) return;

  try {
    const text = await fs.promises.readFile(fsPath, "utf8");
    const languageId = isVxml ? "helium-vxml" : "helium-dsl";
    const doc = TextDocument.create(uri, languageId, 1, text);

    // Keep the project index up-to-date even for unopened files.
    projectManager.updateDocument(doc);

    await validateDocument(doc);
  } catch (err) {
    // Best-effort: on read/parse failures we avoid crashing the server.
    console.error(`[Server] Failed to validate from disk: ${fsPath}`, err);
  }
}

async function updateLangFromDisk(uri: string): Promise<void> {
  const fsPath = safeFsPath(uri);
  if (!fsPath) return;
  if (!fs.existsSync(fsPath)) return;
  if (!fsPath.endsWith(".lang")) return;

  try {
    const text = await fs.promises.readFile(fsPath, "utf8");
    const doc = TextDocument.create(uri, "helium-lang", 1, text);
    projectManager.updateDocument(doc);

    // Revalidate open VXML documents immediately (fast feedback).
    for (const d of documents.all()) {
      if (isVxmlDocument(d)) {
        validateDocument(d).catch(() => {});
      }
    }

    const projectRoot = findOwningProjectRoot(fsPath);
    if (projectRoot) {
      scheduleRevalidateVxmlInProject(projectRoot);
    }
  } catch (err) {
    console.error(`[Server] Failed to update lang index from disk: ${fsPath}`, err);
  }
}

function scheduleRevalidateVxmlInProject(projectRoot: string, debounceMs = 500) {
  const existing = vxmlRevalidateProjectTimers.get(projectRoot);
  if (existing) clearTimeout(existing);
  const timer = setTimeout(() => {
    vxmlRevalidateProjectTimers.delete(projectRoot);
    revalidateAllVxmlInProject(projectRoot).catch(() => {});
  }, debounceMs);
  vxmlRevalidateProjectTimers.set(projectRoot, timer);
}

async function revalidateAllVxmlInProject(projectRoot: string): Promise<void> {
  const vxmlPaths: string[] = [];
  collectFilesByExt(projectRoot, new Set([".vxml"]), vxmlPaths);

  // Concurrency-limited worker pool.
  const concurrency = 6;
  let idx = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (idx < vxmlPaths.length) {
      const i = idx++;
      const filePath = vxmlPaths[i];
      const uri = URI.file(filePath).toString();
      // Skip open docs (unsaved edits).
      if (documents.get(uri)) continue;
      await validateFromDisk(uri);
    }
  });
  await Promise.all(workers);
}

async function startStartupDiagnosticsScan(): Promise<void> {
  const roots = projectManager.getProjectRoots();
  if (!roots || roots.length === 0) return;

  const filePaths: string[] = [];
  for (const root of roots) {
    collectFilesByExt(root, new Set([".mez", ".vxml"]), filePaths);
  }

  const concurrency = 6;
  let idx = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (idx < filePaths.length) {
      const i = idx++;
      const filePath = filePaths[i];
      const uri = URI.file(filePath).toString();
      if (documents.get(uri)) continue;
      await validateFromDisk(uri);
    }
  });
  await Promise.all(workers);
}

function collectFilesByExt(dir: string, exts: Set<string>, out: string[]) {
  if (!dir) return;
  if (!fs.existsSync(dir)) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || IGNORED_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectFilesByExt(fullPath, exts, out);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name);
      if (exts.has(ext)) out.push(fullPath);
    }
  } catch {
    // ignore
  }
}

function findOwningProjectRoot(fsPath: string): string | null {
  const roots = projectManager.getProjectRoots();
  if (!roots || roots.length === 0) return null;
  const normalized = path.resolve(fsPath);
  const candidates = roots.filter((r) => normalized.startsWith(path.resolve(r)));
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.length - a.length)[0];
}

connection.onCompletion(async (params): Promise<CompletionItem[]> => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return [];
  if (isVxmlDocument(doc)) return [];
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

connection.onHover(async (params: HoverParams): Promise<Hover | null> => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return null;
  }
  // VXML is XML; disable Helium-DSL hover logic to avoid ANTLR lexer noise.
  if (isVxmlDocument(doc) || !isMezDocument(doc)) {
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

connection.onSignatureHelp(async (params: SignatureHelpParams): Promise<SignatureHelp | null> => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return null;

  const text = doc.getText();
  const call = findCallAtPosition(text, params.position);
  if (!call) return null;

  // 1) Namespaced call: BIF namespace, Unit:method, or ModelType:modelBif
  if (call.namespace) {
    const bifMeta = loadBifMetadata();
    const bif = bifMeta?.namespaces?.[call.namespace]?.find((f) => f.name === call.callee);
    if (bif?.signature) {
      return buildSignatureHelpFromLabel(
        bif.signature,
        call.activeParameter,
        bif.description
      );
    }

    // Unit method signature (workspace index)
    if (projectManager.isUnit(call.namespace)) {
      const decl = (projectManager as any).getFunctionDeclForSignatureHelp(
        params.textDocument.uri,
        params.position,
        call.callee,
        call.namespace
      );
      if (decl) {
        const label =
          `${decl.returnType} ${call.namespace}:${decl.name}(` +
          (decl.params || [])
            .map((p: { typeName: string; name: string }) => `${p.typeName} ${p.name}`.trim())
            .join(", ") +
          ")";
        return buildSignatureHelpFromLabel(label, call.activeParameter);
      }
    }

    // Model BIF (TypeName:method()) – we don’t have full parameter metadata here.
    if (projectManager.isUserDefinedType(call.namespace) && isModelBif(call.callee)) {
      const label = `${call.namespace}:${call.callee}()`;
      return buildSignatureHelpFromLabel(label, call.activeParameter);
    }
  }

  // 2) Unqualified call: function in current unit or unique in project.
  const decl = (projectManager as any).getFunctionDeclForSignatureHelp(
    params.textDocument.uri,
    params.position,
    call.callee
  );
  if (!decl) return null;
  const label =
    `${decl.returnType} ${decl.name}(` +
    (decl.params || [])
      .map((p: { typeName: string; name: string }) => `${p.typeName} ${p.name}`.trim())
      .join(", ") +
    ")";
  return buildSignatureHelpFromLabel(label, call.activeParameter);
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
  if (isVxmlDocument(doc) || !isMezDocument(doc)) {
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
  if (isVxmlDocument(doc) || !isMezDocument(doc)) {
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

connection.onDefinition(async (params: DefinitionParams): Promise<Location | Location[] | null> => {
  const doc = documents.get(params.textDocument.uri);
  if (doc && isVxmlDocument(doc)) {
    const ast = buildVxmlAst(doc.getText(), doc.uri);
    const viewUnitName = ast.view?.unitName;

    const refAtPos = ast.references.find((r) =>
      rangeContains(r.range as any, params.position.line, params.position.character)
    );
    if (!refAtPos) return null;

    if (refAtPos.kind === "unit") {
      const loc = projectManager.getUnitLocation(refAtPos.name);
      return loc ? [loc] : null;
    }

    if (refAtPos.kind === "function" || refAtPos.kind === "variable") {
      const resolved = resolveVxmlQualified(refAtPos.name, viewUnitName);
      if (!resolved?.unitName || !resolved?.memberName) return null;

      const unitLoc = projectManager.getUnitLocation(resolved.unitName);
      if (!unitLoc) return null;

      try {
        const unitFilePath = URI.parse(unitLoc.uri).fsPath;
        const unitFileContent = fs.readFileSync(unitFilePath, "utf8");
        const unitAst = await buildFileAst(unitFileContent, unitLoc.uri);
        const unitDecl = (unitAst.units || []).find((u: any) => u.name === resolved.unitName);
        if (!unitDecl) return null;

        if (refAtPos.kind === "function") {
          const fn = (unitDecl.functions || []).find((f: any) => f.name === resolved.memberName);
          return fn?.nameRange ? [{ uri: unitLoc.uri, range: fn.nameRange }] : null;
        }

        const v = (unitDecl.variables || []).find((vv: any) => vv.name === resolved.memberName);
        return v?.nameRange ? [{ uri: unitLoc.uri, range: v.nameRange }] : null;
      } catch {
        return unitLoc ? [unitLoc] : null;
      }
    }

    return null;
  }
  if (doc && params.textDocument.uri.includes("GbvChatClient.mez")) {
    const line = doc.getText().split(/\r?\n/)[params.position.line] || "";
    const wordAtPos = extractTypeNameAtPosition(doc, params.position);
    console.error(`[DEBUG] onDefinition: uri=${params.textDocument.uri}, position=(${params.position.line},${params.position.character}), word="${wordAtPos}", line="${line.substring(0, 80)}"`);
  }
  return projectManager.getDefinition(params);
});

function resolveVxmlQualified(
  raw: string,
  fallbackUnitName: string | undefined
): { unitName: string | null; memberName: string | null } | null {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return null;
  const colon = trimmed.indexOf(":");
  if (colon !== -1) {
    const unitName = trimmed.slice(0, colon).trim();
    const memberName = trimmed.slice(colon + 1).trim();
    return {
      unitName: unitName || null,
      memberName: memberName || null,
    };
  }
  return {
    unitName: fallbackUnitName ?? null,
    memberName: trimmed,
  };
}

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

  // Important: semantic tokens are only supported for Helium DSL (.mez).
  // VXML is XML and must not go through the ANTLR lexer/parser (it produces noisy lexer errors).
  if (isVxmlDocument(doc) || !isMezDocument(doc)) {
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

    // Also highlight enum declaration identifiers (helps when TextMate scopes don't theme them well).
    for (const enm of ast.enums) {
      pushRange(enm.nameRange, 0); // 0 = "type"
    }

    // Highlight function declarations and function call sites.
    for (const unit of ast.units) {
      for (const fn of unit.functions) {
        pushRange(fn.nameRange, 1); // 1 = "function"
      }
    }
    for (const call of ast.functionCalls) {
      pushRange(call.nameRange, 1); // 1 = "function"
    }

    // Highlight variable declarations (unit vars, params, locals) and variable references.
    for (const unit of ast.units) {
      for (const v of unit.variables) pushRange(v.nameRange, 2); // 2 = "variable"
      for (const fn of unit.functions) {
        for (const p of fn.params) pushRange(p.nameRange, 2);
        for (const local of fn.locals) pushRange(local.nameRange, 2);
      }
    }
    for (const vr of ast.variableReferences) {
      pushRange(vr.nameRange, 2);
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

connection.languages.semanticTokens.onRange(async (params: SemanticTokensRangeParams) => {
  // Reuse the full-token code path by filtering to the requested range.
  logVerbose(`[SemanticTokensRange] URI: ${params.textDocument.uri}`);
  const doc = documents.get(params.textDocument.uri);
  const builder = new SemanticTokensBuilder();
  if (!doc) return builder.build();

  // Important: semantic tokens are only supported for Helium DSL (.mez).
  // VXML is XML and must not go through the ANTLR lexer/parser.
  if (isVxmlDocument(doc) || !isMezDocument(doc)) {
    return builder.build();
  }

  const text = doc.getText();
  const userTypes = new Set(projectManager.getUserTypes());

  const rangeIntersects = (
    token: { start: Position; end: Position },
    requested: Range
  ): boolean => {
    if (token.end.line < requested.start.line || token.start.line > requested.end.line) return false;
    if (token.start.line === requested.start.line && token.end.character < requested.start.character)
      return false;
    if (token.end.line === requested.end.line && token.start.character > requested.end.character)
      return false;
    return true;
  };

  const pushRange = (
    range: { start: Position; end: Position },
    tokenTypeIndex: number
  ) => {
    if (!rangeIntersects(range, params.range)) return;
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
    const ast = await buildFileAst(text, params.textDocument.uri);
    for (const ref of ast.typeReferences) {
      if (isUserType(ref.name)) pushRange(ref.nameRange, 0);
    }

    for (const enm of ast.enums) {
      pushRange(enm.nameRange, 0);
    }

    for (const unit of ast.units) {
      for (const fn of unit.functions) pushRange(fn.nameRange, 1); // function decl
    }
    for (const call of ast.functionCalls) pushRange(call.nameRange, 1); // call site

    for (const unit of ast.units) {
      for (const v of unit.variables) pushRange(v.nameRange, 2);
      for (const fn of unit.functions) {
        for (const p of fn.params) pushRange(p.nameRange, 2);
        for (const local of fn.locals) pushRange(local.nameRange, 2);
      }
    }
    for (const vr of ast.variableReferences) pushRange(vr.nameRange, 2);

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
        for (const p of fn.params) if (isUserType(p.typeName)) pushRange(p.typeRange, 0);
        for (const local of fn.locals) if (isUserType(local.typeName)) pushRange(local.typeRange, 0);
      }
    }
    for (const ref of ast.unitReferences) {
      if (isUserType(ref.name)) pushRange(ref.nameRange, 0);
    }
  } catch {
    return builder.build();
  }

  return builder.build();
});

connection.onDocumentHighlight((params: DocumentHighlightParams): DocumentHighlight[] => {
  const locations = projectManager.getReferences({
    textDocument: params.textDocument,
    position: params.position,
    context: { includeDeclaration: true },
  } as any);
  return locations
    .filter((loc) => loc.uri === params.textDocument.uri)
    .map((loc) => ({
      range: loc.range,
      kind: DocumentHighlightKind.Read,
    }));
});

// Note: Workspace folder change handler is now registered in onInitialized callback
// to ensure the client supports workspace folder change notifications

console.error("[Server] Starting to listen for connections...");
documents.listen(connection);
connection.listen();
console.error("[Server] ===== Server listening, ready to receive requests =====");

