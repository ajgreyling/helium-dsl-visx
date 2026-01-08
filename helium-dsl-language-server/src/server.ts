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
  Hover,
  Location,
  DefinitionParams,
  TypeDefinitionParams,
  DidChangeWatchedFilesNotification,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import * as path from "path";
import { createDiagnostics } from "./diagnostics";
import { buildSymbolTable } from "./symbols/symbolTable";
import { provideCompletions } from "./completion/completionProvider";
import { runLints } from "./linter/engine";
import { WorkspaceIndex } from "./symbols/workspaceIndex";

const connection = createConnection();
const documents = new TextDocuments<TextDocument>(TextDocument);
const workspaceIndex = new WorkspaceIndex();

const semanticLegend: SemanticTokensLegend = {
  tokenTypes: ["type", "function", "variable"],
  tokenModifiers: [],
};

connection.onInitialize((params: InitializeParams): InitializeResult => {
  console.log("[Server] Initializing language server...");
  console.log(`[Server] Workspace folders:`, params.workspaceFolders);
  // Initialize workspace index with workspace folders
  workspaceIndex.initialize(params.workspaceFolders || null);

  // After initializing the index, send a notification with all discovered user-defined types
  try {
    const debug = workspaceIndex.getDebugInfo();
    const types = debug.objects || [];
    console.log(`[Server] Sending ${types.length} discovered user-defined types to client`);
    connection.sendNotification("helium/userTypes", types);
  } catch (err) {
    console.error("[Server] Error sending userTypes notification:", err);
  }

  // Register a file watcher for .mez files under any `model` directory so the client
  // notifies us when .mez files are created/changed/deleted.
  try {
    connection.client.register(DidChangeWatchedFilesNotification.type, {
      watchers: [
        { globPattern: "**/model/**/*.mez" },
        { globPattern: "**/model/*.mez" },
      ],
    });
  } catch (err) {
    console.log("[Server] Warning: failed to register file watchers:", err);
  }

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: { resolveProvider: false },
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
connection.onDidChangeWatchedFiles((params) => {
  try {
    for (const ch of params.changes) {
      const fsPath = URI.parse(ch.uri).fsPath;
      // Only care about .mez files in model folders
      if (fsPath.endsWith('.mez') && fsPath.split(path.sep).includes('model')) {
        console.log(`[Server] Watched file change: ${ch.type} -> ${fsPath}`);
        // For create/delete/change, update the file entry in the index
        workspaceIndex.updateFile(ch.uri);
      }
    }
    // After processing watched changes, send updated list of types
    try {
      const types = workspaceIndex.getDebugInfo().objects || [];
      console.log(`[Server] Watched files processed - sending ${types.length} user-defined types to client`);
      connection.sendNotification("helium/userTypes", types);
    } catch (err) {
      console.error("[Server] Error sending userTypes after watched files processed:", err);
    }
  } catch (err) {
    console.error('[Server] Error handling watched file changes:', err);
  }
});

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
  return provideCompletions(params, table);
});

connection.onHover((_params): Hover | null => {
  return null; // Placeholder; will be expanded with type info
});

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

  // Find the word at the cursor position (PascalCase for types)
  const beforeCursor = line.substring(0, position.character);
  const afterCursor = line.substring(position.character);
  
  // Match PascalCase identifier (user-defined types start with uppercase)
  const beforeMatch = beforeCursor.match(/([A-Z][A-Za-z0-9_]*)$/);
  const afterMatch = afterCursor.match(/^([A-Za-z0-9_]*)/);
  
  if (!beforeMatch) {
    console.log(`[Definition] No PascalCase match before cursor`);
    return null;
  }
  
  const fullWord = beforeMatch[1] + (afterMatch ? afterMatch[1] : "");
  console.log(`[Definition] Extracted word: "${fullWord}"`);
  
  // Only match if it's a complete word (not part of a larger identifier)
  if (!/^[A-Z][A-Za-z0-9_]*$/.test(fullWord)) {
    console.log(`[Definition] Word "${fullWord}" doesn't match PascalCase pattern`);
    return null;
  }

  // Check if it's a user-defined type
  if (workspaceIndex.isUserDefinedType(fullWord)) {
    const location = workspaceIndex.getObjectLocation(fullWord);
    console.log(`[Definition] Found definition for "${fullWord}":`, location);
    return location ? [location] : null;
  }

  console.log(`[Definition] "${fullWord}" is not a user-defined type`);
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
  
  // Verify it's PascalCase (starts with uppercase, followed by alphanumeric/underscore)
  if (!/^[A-Z][A-Za-z0-9_]*$/.test(fullWord)) {
    console.log(`[TypeDefinition] Word "${fullWord}" doesn't match PascalCase pattern (must start with uppercase) - returning null`);
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

connection.onReferences((_params): Location[] => {
  return [];
});

connection.languages.semanticTokens.on((_params) => {
  const builder = new SemanticTokensBuilder();
  // Placeholder: no semantic tokens yet.
  return builder.build();
});

// Handle workspace folder changes
connection.workspace.onDidChangeWorkspaceFolders((_event) => {
  // Re-initialize workspace index when folders change
  connection.workspace.getWorkspaceFolders().then((folders) => {
    workspaceIndex.initialize(folders);
    try {
      const types = workspaceIndex.getDebugInfo().objects || [];
      console.log(`[Server] Workspace folders changed - sending ${types.length} user-defined types to client`);
      connection.sendNotification("helium/userTypes", types);
    } catch (err) {
      console.error("[Server] Error sending userTypes after workspace folder change:", err);
    }
  });
});

documents.listen(connection);
connection.listen();

