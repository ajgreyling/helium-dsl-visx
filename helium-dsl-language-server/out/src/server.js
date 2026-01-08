"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const vscode_uri_1 = require("vscode-uri");
const path = __importStar(require("path"));
const diagnostics_1 = require("./diagnostics");
const symbolTable_1 = require("./symbols/symbolTable");
const completionProvider_1 = require("./completion/completionProvider");
const engine_1 = require("./linter/engine");
const workspaceIndex_1 = require("./symbols/workspaceIndex");
const connection = (0, node_1.createConnection)();
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
const workspaceIndex = new workspaceIndex_1.WorkspaceIndex();
const semanticLegend = {
    tokenTypes: ["type", "function", "variable"],
    tokenModifiers: [],
};
connection.onInitialize((params) => {
    console.log("[Server] Initializing language server...");
    console.log(`[Server] Workspace folders:`, params.workspaceFolders);
    // Initialize workspace index with workspace folders
    workspaceIndex.initialize(params.workspaceFolders || null);
    // Register a file watcher for .mez files under any `model` directory so the client
    // notifies us when .mez files are created/changed/deleted.
    try {
        connection.client.register(node_1.DidChangeWatchedFilesNotification.type, {
            watchers: [
                { globPattern: "**/model/**/*.mez" },
                { globPattern: "**/model/*.mez" },
            ],
        });
    }
    catch (err) {
        console.log("[Server] Warning: failed to register file watchers:", err);
    }
    return {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
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
            const fsPath = vscode_uri_1.URI.parse(ch.uri).fsPath;
            // Only care about .mez files in model folders
            if (fsPath.endsWith('.mez') && fsPath.split(path.sep).includes('model')) {
                console.log(`[Server] Watched file change: ${ch.type} -> ${fsPath}`);
                // For create/delete/change, update the file entry in the index
                workspaceIndex.updateFile(ch.uri);
            }
        }
    }
    catch (err) {
        console.error('[Server] Error handling watched file changes:', err);
    }
});
async function validateDocument(document) {
    const text = document.getText();
    const syntaxDiagnostics = (0, diagnostics_1.createDiagnostics)(text);
    const lintDiagnostics = await (0, engine_1.runLints)(text);
    const diagnostics = [...syntaxDiagnostics, ...lintDiagnostics];
    connection.sendDiagnostics({ uri: document.uri, diagnostics });
}
connection.onCompletion(async (params) => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc)
        return [];
    const table = (0, symbolTable_1.buildSymbolTable)(doc.getText());
    return (0, completionProvider_1.provideCompletions)(params, table);
});
connection.onHover((_params) => {
    return null; // Placeholder; will be expanded with type info
});
connection.onDefinition((params) => {
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
connection.onTypeDefinition((params) => {
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
        }
        else {
            console.log(`[TypeDefinition] WARNING: isUserDefinedType returned true but getObjectLocation returned null`);
            return null;
        }
    }
    console.log(`[TypeDefinition] "${fullWord}" is not a user-defined type - returning null`);
    return null;
});
connection.onReferences((_params) => {
    return [];
});
connection.languages.semanticTokens.on((_params) => {
    const builder = new node_1.SemanticTokensBuilder();
    // Placeholder: no semantic tokens yet.
    return builder.build();
});
// Handle workspace folder changes
connection.workspace.onDidChangeWorkspaceFolders((_event) => {
    // Re-initialize workspace index when folders change
    connection.workspace.getWorkspaceFolders().then((folders) => {
        workspaceIndex.initialize(folders);
    });
});
documents.listen(connection);
connection.listen();
