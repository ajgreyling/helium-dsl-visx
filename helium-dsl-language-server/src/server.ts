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
  Location,
  DefinitionParams,
  TypeDefinitionParams,
  ReferenceParams,
  DidChangeWatchedFilesNotification,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import * as path from "path";
import * as fs from "fs";
import { createDiagnostics } from "./diagnostics";
import { buildSymbolTable } from "./symbols/symbolTable";
import { provideCompletions } from "./completion/completionProvider";
import { runLints } from "./linter/engine";
import { WorkspaceIndex } from "./symbols/workspaceIndex";
import { initializeLogger, TraceLevel, logVerbose } from "./utils/logger";

// Log immediately when server module loads
console.error("[Server] ===== Language Server Module Loading =====");
console.error("[Server] Server process started");

const connection = createConnection();
const documents = new TextDocuments<TextDocument>(TextDocument);
const workspaceIndex = new WorkspaceIndex();

console.error("[Server] Connection and documents initialized");

const semanticLegend: SemanticTokensLegend = {
  tokenTypes: ["type", "function", "variable", "namespace"],
  tokenModifiers: [],
};

connection.onInitialize((params: InitializeParams): InitializeResult => {
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
  
  // Initialize workspace index with workspace folders
  console.error("[Server] Initializing workspace index...");
  workspaceIndex.initialize(params.workspaceFolders || null);
  console.error("[Server] Workspace index initialized");

  // After initializing the index, send a notification with all discovered user-defined types
  try {
    const debug = workspaceIndex.getDebugInfo();
    const types = debug.objects || [];
    logVerbose(`[Server] ===== Sending User Types Notification =====`);
    logVerbose(`[Server] Found ${types.length} user-defined types`);
    logVerbose(`[Server] Types: ${JSON.stringify(types, null, 2)}`);
    logVerbose(`[Server] Workspace roots: ${JSON.stringify(debug.workspaceRoots, null, 2)}`);
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
        resolveProvider: false,
        triggerCharacters: ['.']
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
      console.error("[Server] Workspace folders changed, re-initializing index...");
      // Re-initialize workspace index when folders change
      connection.workspace.getWorkspaceFolders().then((folders) => {
        workspaceIndex.initialize(folders);
        try {
          const types = workspaceIndex.getDebugInfo().objects || [];
          logVerbose(`[Server] Workspace folders changed - sending ${types.length} user-defined types to client`);
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
  // Update workspace index when model files change
  workspaceIndex.updateFile(change.document.uri);
});

documents.onDidOpen((change) => {
  validateDocument(change.document);
  // Update workspace index when model files are opened
  workspaceIndex.updateFile(change.document.uri);
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
  const syntaxDiagnostics = createDiagnostics(text);
  const lintDiagnostics = await runLints(text);
  const diagnostics = [...syntaxDiagnostics, ...lintDiagnostics];
  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

connection.onCompletion(async (params): Promise<CompletionItem[]> => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return [];
  const table = buildSymbolTable(doc.getText());
  return provideCompletions(params, table, doc, workspaceIndex);
});

connection.onHover((_params): Hover | null => {
  return null; // Placeholder; will be expanded with type info
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

connection.onDefinition((params: DefinitionParams): Location | Location[] | null => {
  console.log(`[Definition] onDefinition called for ${params.textDocument.uri} at line ${params.position.line}, char ${params.position.character}`);
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    console.log(`[Definition] Document not found: ${params.textDocument.uri}`);
    return null;
  }

  const position = params.position;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const line = lines[position.line] || "";
  console.log(`[Definition] Line content: "${line}"`);

  // Check if cursor is on or before a colon (for unit references like UnitName:functionName)
  // If cursor is on ':', look backwards for the unit name
  let checkPosition = position.character;
  if (checkPosition < line.length && line[checkPosition] === ':') {
    // Cursor is on the colon, check the word before it
    checkPosition = checkPosition - 1;
  }

  const beforeCursor = line.substring(0, checkPosition);
  const afterCursor = line.substring(checkPosition);
  console.log(`[Definition] Before cursor: "${beforeCursor}"`);
  console.log(`[Definition] After cursor: "${afterCursor}"`);
  
  // Try to match a complete identifier word at cursor position
  // First, try to find the start of the word by looking backwards
  let wordStart = checkPosition;
  while (wordStart > 0 && /[A-Za-z0-9_]/.test(line[wordStart - 1])) {
    wordStart--;
  }
  
  // Then find the end of the word by looking forwards
  let wordEnd = checkPosition;
  while (wordEnd < line.length && /[A-Za-z0-9_]/.test(line[wordEnd])) {
    wordEnd++;
  }
  
  const fullWord = line.substring(wordStart, wordEnd);
  console.log(`[Definition] Extracted word from position ${wordStart}-${wordEnd}: "${fullWord}"`);
  
  // Verify it's a valid identifier (starts with letter or underscore, followed by alphanumeric/underscore)
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(fullWord)) {
    console.log(`[Definition] Word "${fullWord}" doesn't match identifier pattern - returning null`);
    return null;
  }
  
  // Check if this looks like a unit reference (UnitName:)
  const charAfter = wordEnd < line.length ? line[wordEnd] : ' ';
  const looksLikeUnitRef = charAfter === ':';
  
  // Verify it's a complete word (has word boundaries on both sides, or is followed by ':')
  const charBefore = wordStart > 0 ? line[wordStart - 1] : ' ';
  const isWordBoundaryBefore = !/[A-Za-z0-9_]/.test(charBefore);
  const isWordBoundaryAfter = !/[A-Za-z0-9_]/.test(charAfter) || looksLikeUnitRef;
  
  console.log(`[Definition] Word boundaries: before="${charBefore}" (${isWordBoundaryBefore}), after="${charAfter}" (${isWordBoundaryAfter}), looksLikeUnitRef=${looksLikeUnitRef}`);
  
  if (!isWordBoundaryBefore || (!isWordBoundaryAfter && !looksLikeUnitRef)) {
    console.log(`[Definition] Word "${fullWord}" is not a complete word (missing word boundaries) - returning null`);
    return null;
  }
  
  console.log(`[Definition] Valid identifier word extracted: "${fullWord}"`);

  // First check if it's a unit (check before types since units can have same names as types)
  console.log(`[Definition] Checking if "${fullWord}" is a unit...`);
  const isUnit = workspaceIndex.isUnit(fullWord);
  console.log(`[Definition] isUnit("${fullWord}") = ${isUnit}`);
  
  if (isUnit) {
    const location = workspaceIndex.getUnitLocation(fullWord);
    console.log(`[Definition] SUCCESS: Found unit definition for "${fullWord}"`);
    console.log(`[Definition] Location:`, JSON.stringify(location, null, 2));
    if (location) {
      console.log(`[Definition] Returning location: ${location.uri} at line ${location.range.start.line + 1}`);
      return [location];
    } else {
      console.log(`[Definition] WARNING: isUnit returned true but getUnitLocation returned null`);
    }
  }

  // Then check if it's a user-defined type (preserve existing behavior)
  console.log(`[Definition] Checking if "${fullWord}" is a user-defined type...`);
  const isUserDefined = workspaceIndex.isUserDefinedType(fullWord);
  console.log(`[Definition] isUserDefinedType("${fullWord}") = ${isUserDefined}`);
  
  if (isUserDefined) {
    const location = workspaceIndex.getObjectLocation(fullWord);
    console.log(`[Definition] SUCCESS: Found type definition for "${fullWord}"`);
    console.log(`[Definition] Location:`, JSON.stringify(location, null, 2));
    if (location) {
      console.log(`[Definition] Returning location: ${location.uri} at line ${location.range.start.line + 1}`);
      return [location];
    } else {
      console.log(`[Definition] WARNING: isUserDefinedType returned true but getObjectLocation returned null`);
    }
  }

  // Check if this is a function name in a unit-qualified call (e.g., RoleDetails:getPermissionsTable)
  // Function names start with lowercase, so check if fullWord starts with lowercase
  const isFunctionName = /^[a-z]/.test(fullWord);
  
  if (isFunctionName) {
    console.log(`[Definition] "${fullWord}" looks like a function name, checking for unit qualifier...`);
    
    // Look backwards in the line to find a unit qualifier pattern (UnitName:)
    const beforeWord = line.substring(0, wordStart);
    const unitQualifierMatch = beforeWord.match(/\b([A-Z][A-Za-z0-9_]*)\s*:\s*$/);
    
    if (unitQualifierMatch) {
      const unitName = unitQualifierMatch[1];
      console.log(`[Definition] Found unit qualifier "${unitName}:" before function "${fullWord}"`);
      
      // Verify the unit exists
      if (workspaceIndex.isUnit(unitName)) {
        console.log(`[Definition] Unit "${unitName}" exists, searching for function "${fullWord}"...`);
        
        // Get the unit file location
        const unitLocation = workspaceIndex.getUnitLocation(unitName);
        if (!unitLocation) {
          console.log(`[Definition] WARNING: Unit "${unitName}" exists but getUnitLocation returned null`);
        } else {
          console.log(`[Definition] Unit file: ${unitLocation.uri}`);
          
          // Try to get the file content from open documents first
          let unitFileContent: string | null = null;
          const unitDoc = documents.get(unitLocation.uri);
          if (unitDoc) {
            unitFileContent = unitDoc.getText();
            console.log(`[Definition] Unit file is open in editor`);
          } else {
            // Read from disk
            try {
              const unitFilePath = URI.parse(unitLocation.uri).fsPath;
              unitFileContent = fs.readFileSync(unitFilePath, "utf8");
              console.log(`[Definition] Read unit file from disk: ${unitFilePath}`);
            } catch (err) {
              console.log(`[Definition] ERROR: Could not read unit file: ${err}`);
              unitFileContent = null;
            }
          }
          
          if (unitFileContent) {
            // Search for the function definition in the unit file
            const functionLocation = findFunctionDefinitionInFile(
              fullWord,
              unitFileContent,
              unitLocation.uri
            );
            
            if (functionLocation) {
              console.log(`[Definition] SUCCESS: Found function "${fullWord}" in unit "${unitName}"`);
              console.log(`[Definition] Location:`, JSON.stringify(functionLocation, null, 2));
              return [functionLocation];
            } else {
              console.log(`[Definition] Function "${fullWord}" not found in unit "${unitName}"`);
            }
          }
        }
      } else {
        console.log(`[Definition] Unit "${unitName}" does not exist in workspace index`);
      }
    }
  }

  // If not a type or unit-qualified function, check if it's a variable
  console.log(`[Definition] "${fullWord}" is not a user-defined type or unit-qualified function, checking for variable...`);
  const symbolTable = buildSymbolTable(text);
  
  // Find the most recent declaration of this variable before or at the cursor position
  const relevantSymbols = symbolTable.symbols
    .filter(
      (s) =>
        s.name === fullWord &&
        s.kind === "variable" &&
        s.location &&
        (s.location.line < position.line ||
          (s.location.line === position.line &&
            s.location.character <= position.character))
    )
    .sort((a, b) => {
      // Sort by line (most recent first), then by character
      if (a.location!.line !== b.location!.line) {
        return b.location!.line - a.location!.line;
      }
      return b.location!.character - a.location!.character;
    });

  if (relevantSymbols.length > 0) {
    const variableSymbol = relevantSymbols[0];
    const location: Location = {
      uri: doc.uri,
      range: {
        start: {
          line: variableSymbol.location!.line,
          character: variableSymbol.location!.character,
        },
        end: {
          line: variableSymbol.location!.line,
          character: variableSymbol.location!.character + fullWord.length,
        },
      },
    };
    console.log(`[Definition] SUCCESS: Found variable definition for "${fullWord}"`);
    console.log(`[Definition] Location:`, JSON.stringify(location, null, 2));
    return [location];
  }

  console.log(`[Definition] "${fullWord}" is not a type, unit-qualified function, or variable - returning null`);
  return null;
});

connection.onTypeDefinition((params: TypeDefinitionParams): Location | Location[] | null => {
  console.log(`[TypeDefinition] ===== onTypeDefinition called =====`);
  console.log(`[TypeDefinition] URI: ${params.textDocument.uri}`);
  console.log(`[TypeDefinition] Position: line ${params.position.line}, character ${params.position.character}`);
  
  // Log workspace index state
  const debugInfo = workspaceIndex.getDebugInfo();
  console.log(`[TypeDefinition] Workspace index state: ${debugInfo.objectCount} objects found`);
  if (debugInfo.objectCount > 0 && debugInfo.objectCount <= 20) {
    console.log(`[TypeDefinition] Available types: ${debugInfo.objects.join(", ")}`);
  }
  
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    console.log(`[TypeDefinition] ERROR: Document not found for URI: ${params.textDocument.uri}`);
    return null;
  }

  const position = params.position;
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const line = lines[position.line] || "";
  console.log(`[TypeDefinition] Line ${position.line + 1} content: "${line}"`);

  // Find the word at the cursor position (PascalCase for types)
  // Strategy: Find the complete word boundary around the cursor position
  const beforeCursor = line.substring(0, position.character);
  const afterCursor = line.substring(position.character);
  console.log(`[TypeDefinition] Before cursor: "${beforeCursor}"`);
  console.log(`[TypeDefinition] After cursor: "${afterCursor}"`);
  
  // Match PascalCase identifier (user-defined types start with uppercase)
  // Look for word boundary before: non-word character or start of line
  // Then match PascalCase identifier: [A-Z][A-Za-z0-9_]*
  // Then match continuation after cursor: [A-Za-z0-9_]*
  // Then ensure word boundary after: non-word character or end of line
  
  // Try to match a complete PascalCase word at cursor position
  // First, try to find the start of the word by looking backwards
  let wordStart = position.character;
  while (wordStart > 0 && /[A-Za-z0-9_]/.test(line[wordStart - 1])) {
    wordStart--;
  }
  
  // Then find the end of the word by looking forwards
  let wordEnd = position.character;
  while (wordEnd < line.length && /[A-Za-z0-9_]/.test(line[wordEnd])) {
    wordEnd++;
  }
  
  const fullWord = line.substring(wordStart, wordEnd);
  console.log(`[TypeDefinition] Extracted word from position ${wordStart}-${wordEnd}: "${fullWord}"`);
  
  // Verify it's a valid type identifier (starts with letter or underscore, followed by alphanumeric/underscore)
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(fullWord)) {
    console.log(`[TypeDefinition] Word "${fullWord}" doesn't match type identifier pattern - returning null`);
    return null;
  }
  
  // Verify it's a complete word (has word boundaries on both sides)
  const charBefore = wordStart > 0 ? line[wordStart - 1] : ' ';
  const charAfter = wordEnd < line.length ? line[wordEnd] : ' ';
  const isWordBoundaryBefore = !/[A-Za-z0-9_]/.test(charBefore);
  const isWordBoundaryAfter = !/[A-Za-z0-9_]/.test(charAfter);
  
  console.log(`[TypeDefinition] Word boundaries: before="${charBefore}" (${isWordBoundaryBefore}), after="${charAfter}" (${isWordBoundaryAfter})`);
  
  if (!isWordBoundaryBefore || !isWordBoundaryAfter) {
    console.log(`[TypeDefinition] Word "${fullWord}" is not a complete word (missing word boundaries) - returning null`);
    return null;
  }
  
  console.log(`[TypeDefinition] Valid PascalCase word extracted: "${fullWord}"`);

  // Check if it's a user-defined type
  console.log(`[TypeDefinition] Checking if "${fullWord}" is a user-defined type...`);
  const isUserDefined = workspaceIndex.isUserDefinedType(fullWord);
  console.log(`[TypeDefinition] isUserDefinedType("${fullWord}") = ${isUserDefined}`);
  
  if (isUserDefined) {
    const location = workspaceIndex.getObjectLocation(fullWord);
    console.log(`[TypeDefinition] SUCCESS: Found type definition for "${fullWord}"`);
    console.log(`[TypeDefinition] Location:`, JSON.stringify(location, null, 2));
    if (location) {
      console.log(`[TypeDefinition] Returning location: ${location.uri} at line ${location.range.start.line + 1}`);
      return [location];
    } else {
      console.log(`[TypeDefinition] WARNING: isUserDefinedType returned true but getObjectLocation returned null`);
      return null;
    }
  }

  console.log(`[TypeDefinition] "${fullWord}" is not a user-defined type - returning null`);
  return null;
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
  const definitionLocation = workspaceIndex.getObjectLocation(typeName);
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
  const definitionLocation = workspaceIndex.getUnitLocation(unitName);
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
  console.log(`[References] ===== onReferences called =====`);
  console.log(`[References] URI: ${params.textDocument.uri}`);
  console.log(`[References] Position: line ${params.position.line}, character ${params.position.character}`);
  console.log(`[References] Include declaration: ${params.context.includeDeclaration}`);

  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    console.log(`[References] Document not found: ${params.textDocument.uri}`);
    return [];
  }

  // Extract name at cursor position (could be type or unit)
  const name = extractTypeNameAtPosition(doc, params.position);
  if (!name) {
    console.log(`[References] Could not extract name at position`);
    return [];
  }

  console.log(`[References] Extracted name: "${name}"`);

  const excludeDefinition = !params.context.includeDeclaration;
  const references: Location[] = [];

  // Get all open document URIs to avoid duplicates
  const openDocumentUris = new Set<string>();
  documents.all().forEach((d) => openDocumentUris.add(d.uri));

  // Check if it's a unit first
  if (workspaceIndex.isUnit(name)) {
    console.log(`[References] "${name}" is a unit, searching for unit references...`);

    // Search all open documents
    console.log(`[References] Searching ${openDocumentUris.size} open documents for unit references...`);
    documents.all().forEach((document) => {
      const docRefs = findUnitReferencesInDocument(document, name, excludeDefinition);
      references.push(...docRefs);
      console.log(`[References] Found ${docRefs.length} unit references in ${document.uri}`);
    });

    // Search workspace files
    const debugInfo = workspaceIndex.getDebugInfo();
    console.log(`[References] Searching workspace files in ${debugInfo.workspaceRoots.length} root(s) for unit references...`);
    for (const root of debugInfo.workspaceRoots) {
      const workspaceRefs = scanDirectoryForUnitReferences(
        root,
        name,
        excludeDefinition,
        openDocumentUris
      );
      references.push(...workspaceRefs);
      console.log(`[References] Found ${workspaceRefs.length} unit references in workspace root: ${root}`);
    }

    console.log(`[References] ===== Found ${references.length} total unit references =====`);
    return references;
  }

  // Verify it's a user-defined type
  if (!workspaceIndex.isUserDefinedType(name)) {
    console.log(`[References] "${name}" is not a user-defined type or unit`);
    return [];
  }

  console.log(`[References] Searching for references to type "${name}"...`);

  // Search all open documents
  console.log(`[References] Searching ${openDocumentUris.size} open documents...`);
  documents.all().forEach((document) => {
    const docRefs = findReferencesInDocument(document, name, excludeDefinition);
    references.push(...docRefs);
    console.log(`[References] Found ${docRefs.length} references in ${document.uri}`);
  });

  // Search workspace files
  const debugInfo = workspaceIndex.getDebugInfo();
  console.log(`[References] Searching workspace files in ${debugInfo.workspaceRoots.length} root(s)...`);
  for (const root of debugInfo.workspaceRoots) {
    const workspaceRefs = scanDirectoryForReferences(
      root,
      name,
      excludeDefinition,
      openDocumentUris
    );
    references.push(...workspaceRefs);
    console.log(`[References] Found ${workspaceRefs.length} references in workspace root: ${root}`);
  }

  console.log(`[References] ===== Found ${references.length} total references =====`);
  return references;
});

connection.languages.semanticTokens.on((params: SemanticTokensParams) => {
  logVerbose(`[SemanticTokens] ===== Request Received =====`);
  logVerbose(`[SemanticTokens] URI: ${params.textDocument.uri}`);
  const doc = documents.get(params.textDocument.uri);
  const builder = new SemanticTokensBuilder();
  
  if (!doc) {
    console.error(`[SemanticTokens] ERROR: Document not found for ${params.textDocument.uri}`);
    return builder.build();
  }
  
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  logVerbose(`[SemanticTokens] Processing document with ${lines.length} lines`);
  
  // Build symbol table to identify local variables and parameters
  const symbolTable = buildSymbolTable(text);
  // Create a map of variable names to their declaration lines for scoping checks
  const variableDeclarations = new Map<string, number[]>();
  symbolTable.symbols.forEach(symbol => {
    if (symbol.kind === "variable" && symbol.location) {
      const existing = variableDeclarations.get(symbol.name) || [];
      existing.push(symbol.location.line);
      variableDeclarations.set(symbol.name, existing);
    }
  });
  logVerbose(`[SemanticTokens] Found ${variableDeclarations.size} variable/parameter declarations`);
  
  // Log workspace index state
  const debugInfo = workspaceIndex.getDebugInfo();
  logVerbose(`[SemanticTokens] Workspace index has ${debugInfo.objectCount} types`);

  // Keywords that should not be highlighted as types
  const keywords = new Set([
    "unit", "persistent", "object", "enum", "validator",
    "if", "else", "for", "foreach", "return"
  ]);

  // System/primitive types that should not be highlighted as user-defined types
  const systemTypes = new Set([
    "int", "decimal", "bigint", "uuid", "blob", "bool",
    "string", "void", "date", "datetime", "json", "jsonarray"
  ]);

  // Regex to match user-defined type identifiers (PascalCase or snake_case)
  const typeIdentifierRegex = /\b([A-Za-z_][A-Za-z0-9_]*)\b/g;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let match: RegExpExecArray | null;

    // Reset regex lastIndex for each line
    typeIdentifierRegex.lastIndex = 0;

    while ((match = typeIdentifierRegex.exec(line)) !== null) {
      const identifier = match[1];
      const startChar = match.index;
      const length = identifier.length;

      // Skip if it's a keyword or system type
      if (keywords.has(identifier.toLowerCase()) || systemTypes.has(identifier.toLowerCase())) {
        continue;
      }

      // Skip if it's part of an object definition (already handled by TextMate grammar)
      // Check if this identifier appears after "object" or "persistent object" keywords
      const beforeMatch = line.substring(0, startChar);
      if (/\b(persistent\s+)?object\s*$/.test(beforeMatch.trimEnd())) {
        continue;
      }

      // Skip if this identifier appears in a variable declaration position (after a type name)
      // Pattern: <type> <identifier> = or <type> <identifier>;
      // This prevents highlighting variable names as types
      const afterMatch = line.substring(startChar + length);
      const beforeIdentifier = beforeMatch.trimEnd();
      // Check if there's a type-like pattern before this identifier
      if (/^(=|;|,|\))/.test(afterMatch) && 
          /\b(?:int|void|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*)\s+$/.test(beforeIdentifier)) {
        // This looks like a variable declaration: <type> <identifier> = or <type> <identifier>;
        // Skip highlighting the identifier as a type
        continue;
      }

      // Check if this identifier is a local variable or parameter declared before this position
      // This handles scoping: if a variable is declared anywhere before this line, don't highlight as type
      const varDeclLines = variableDeclarations.get(identifier);
      if (varDeclLines && varDeclLines.some(declLine => declLine <= lineIndex)) {
        // This is a local variable or parameter, skip type highlighting
        logVerbose(`[SemanticTokens] Skipping "${identifier}" at line ${lineIndex + 1} - it's a local variable/parameter`);
        continue;
      }

      // Check if it's a unit first (units can have same names as types, but should be highlighted differently)
      // Check for unit references: UnitName: pattern or standalone unit name
      const charAfter = startChar + length < line.length ? line[startChar + length] : ' ';
      const isUnitRef = charAfter === ':';
      
      if (workspaceIndex.isUnit(identifier)) {
        // Skip semantic tokens for unit references (UnitName:identifier) - let TextMate grammar handle them
        // TextMate grammar provides entity.name.type scope for unit names in references
        if (isUnitRef) {
          logVerbose(`[SemanticTokens] Skipping unit reference "${identifier}" at line ${lineIndex + 1} - TextMate grammar handles it`);
          continue;
        }
        // Only highlight standalone unit names (not followed by ':') if they're not also types
        if (!workspaceIndex.isUserDefinedType(identifier)) {
          logVerbose(`[SemanticTokens] ✓ Found standalone unit "${identifier}" at line ${lineIndex + 1}, char ${startChar}`);
          // Token type index 3 corresponds to "namespace" in our legend (units are like namespaces/modules)
          builder.push(lineIndex, startChar, length, 3, 0);
          continue;
        }
      }

      // Check if it's a user-defined type using workspace index
      if (workspaceIndex.isUserDefinedType(identifier)) {
        logVerbose(`[SemanticTokens] ✓ Found user-defined type "${identifier}" at line ${lineIndex + 1}, char ${startChar}`);
        // Token type index 0 corresponds to "type" in our legend
        builder.push(lineIndex, startChar, length, 0, 0);
      }
    }
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

