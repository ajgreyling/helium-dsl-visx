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
const fs = __importStar(require("fs"));
const diagnostics_1 = require("./diagnostics");
const symbolTable_1 = require("./symbols/symbolTable");
const completionProvider_1 = require("./completion/completionProvider");
const engine_1 = require("./linter/engine");
const workspaceIndex_1 = require("./symbols/workspaceIndex");
// Log immediately when server module loads
console.error("[Server] ===== Language Server Module Loading =====");
console.error("[Server] Server process started");
const connection = (0, node_1.createConnection)();
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
const workspaceIndex = new workspaceIndex_1.WorkspaceIndex();
console.error("[Server] Connection and documents initialized");
const semanticLegend = {
    tokenTypes: ["type", "function", "variable"],
    tokenModifiers: [],
};
connection.onInitialize((params) => {
    console.error("[Server] ===== onInitialize Called =====");
    console.error("[Server] Initializing language server...");
    console.error(`[Server] Workspace folders:`, JSON.stringify(params.workspaceFolders, null, 2));
    console.error(`[Server] Root URI: ${params.rootUri || 'null'}`);
    console.error(`[Server] Root path: ${params.rootPath || 'null'}`);
    // Initialize workspace index with workspace folders
    console.error("[Server] Initializing workspace index...");
    workspaceIndex.initialize(params.workspaceFolders || null);
    console.error("[Server] Workspace index initialized");
    // After initializing the index, send a notification with all discovered user-defined types
    try {
        const debug = workspaceIndex.getDebugInfo();
        const types = debug.objects || [];
        console.error(`[Server] ===== Sending User Types Notification =====`);
        console.error(`[Server] Found ${types.length} user-defined types`);
        console.error(`[Server] Types: ${JSON.stringify(types, null, 2)}`);
        console.error(`[Server] Workspace roots: ${JSON.stringify(debug.workspaceRoots, null, 2)}`);
        connection.sendNotification("helium/userTypes", types);
        console.error(`[Server] Notification sent successfully`);
    }
    catch (err) {
        console.error("[Server] ERROR sending userTypes notification:", err);
        console.error("[Server] Error stack:", err instanceof Error ? err.stack : String(err));
    }
    // Note: File watcher registration moved to onInitialized callback
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
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
                    console.error(`[Server] Workspace folders changed - sending ${types.length} user-defined types to client`);
                    connection.sendNotification("helium/userTypes", types);
                }
                catch (err) {
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
    return (0, completionProvider_1.provideCompletions)(params, table, doc, workspaceIndex);
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
        }
        else {
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
function extractTypeNameAtPosition(doc, position) {
    const text = doc.getText();
    const lines = text.split(/\r?\n/);
    const line = lines[position.line] || "";
    // Find the word boundaries around the cursor position
    let wordStart = position.character;
    while (wordStart > 0 && /[A-Za-z0-9_]/.test(line[wordStart - 1])) {
        wordStart--;
    }
    let wordEnd = position.character;
    while (wordEnd < line.length && /[A-Za-z0-9_]/.test(line[wordEnd])) {
        wordEnd++;
    }
    const fullWord = line.substring(wordStart, wordEnd);
    // Verify it's a valid type identifier
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(fullWord)) {
        return null;
    }
    // Verify it's a complete word (has word boundaries on both sides)
    const charBefore = wordStart > 0 ? line[wordStart - 1] : " ";
    const charAfter = wordEnd < line.length ? line[wordEnd] : " ";
    const isWordBoundaryBefore = !/[A-Za-z0-9_]/.test(charBefore);
    const isWordBoundaryAfter = !/[A-Za-z0-9_]/.test(charAfter);
    if (!isWordBoundaryBefore || !isWordBoundaryAfter) {
        return null;
    }
    return fullWord;
}
/**
 * Check if a match is in a comment
 */
function isInComment(line, matchIndex) {
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
function isObjectDefinition(line, matchIndex, typeName) {
    const beforeMatch = line.substring(0, matchIndex).trimEnd();
    // Check if this appears after "object" or "persistent object"
    return /\b(persistent\s+)?object\s*$/.test(beforeMatch);
}
/**
 * Check if a match is a variable declaration (not a type reference)
 */
function isVariableDeclaration(line, matchIndex, lineIndex, typeName, symbolTable) {
    const afterMatch = line.substring(matchIndex + typeName.length);
    const beforeMatch = line.substring(0, matchIndex).trimEnd();
    // Check if there's a type-like pattern before this identifier
    // Pattern: <type> <identifier> = or <type> <identifier>;
    if (/^(=|;|,|\))/.test(afterMatch) &&
        /\b(?:int|void|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*)\s+$/.test(beforeMatch)) {
        // This looks like a variable declaration: <type> <identifier> = or <type> <identifier>;
        return true;
    }
    // Check if this identifier is a local variable or parameter
    const varDeclLines = symbolTable.symbols
        .filter((s) => s.kind === "variable" && s.name === typeName && s.location)
        .map((s) => s.location.line);
    // If there's a variable declaration before this line, it's likely a variable reference
    if (varDeclLines.some((declLine) => declLine <= lineIndex)) {
        return true;
    }
    return false;
}
/**
 * Search a document for references to a type name
 */
function findReferencesInDocument(doc, typeName, excludeDefinition) {
    const text = doc.getText();
    const lines = text.split(/\r?\n/);
    const uri = doc.uri;
    const references = [];
    const symbolTable = (0, symbolTable_1.buildSymbolTable)(text);
    // Get the definition location to exclude it if needed
    const definitionLocation = workspaceIndex.getObjectLocation(typeName);
    const definitionUri = definitionLocation?.uri;
    const definitionLine = definitionLocation?.range.start.line;
    // Create regex with word boundaries to match the type name
    const regex = new RegExp(`\\b${typeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        let match;
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
            const location = {
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
 * Recursively scan directory for .mez files
 */
function scanDirectoryForReferences(dir, typeName, excludeDefinition, openDocumentUris) {
    const references = [];
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
                    const subRefs = scanDirectoryForReferences(fullPath, typeName, excludeDefinition, openDocumentUris);
                    references.push(...subRefs);
                }
            }
            else if (entry.isFile() && entry.name.endsWith(".mez")) {
                // Check if this file is in a model directory
                const parts = fullPath.split(path.sep);
                if (parts.includes("model")) {
                    const uri = vscode_uri_1.URI.file(fullPath).toString();
                    // Skip if already processed as an open document
                    if (openDocumentUris.has(uri)) {
                        continue;
                    }
                    try {
                        const content = fs.readFileSync(fullPath, "utf8");
                        const doc = vscode_languageserver_textdocument_1.TextDocument.create(uri, "mez", 1, content);
                        const fileRefs = findReferencesInDocument(doc, typeName, excludeDefinition);
                        references.push(...fileRefs);
                    }
                    catch (err) {
                        // Silently ignore errors reading files
                        console.error(`[References] Error reading file ${fullPath}:`, err);
                    }
                }
            }
        }
    }
    catch (err) {
        // Silently ignore errors (permissions, etc.)
    }
    return references;
}
connection.onReferences((params) => {
    console.log(`[References] ===== onReferences called =====`);
    console.log(`[References] URI: ${params.textDocument.uri}`);
    console.log(`[References] Position: line ${params.position.line}, character ${params.position.character}`);
    console.log(`[References] Include declaration: ${params.context.includeDeclaration}`);
    const doc = documents.get(params.textDocument.uri);
    if (!doc) {
        console.log(`[References] Document not found: ${params.textDocument.uri}`);
        return [];
    }
    // Extract type name at cursor position
    const typeName = extractTypeNameAtPosition(doc, params.position);
    if (!typeName) {
        console.log(`[References] Could not extract type name at position`);
        return [];
    }
    console.log(`[References] Extracted type name: "${typeName}"`);
    // Verify it's a user-defined type
    if (!workspaceIndex.isUserDefinedType(typeName)) {
        console.log(`[References] "${typeName}" is not a user-defined type`);
        return [];
    }
    console.log(`[References] Searching for references to "${typeName}"...`);
    const excludeDefinition = !params.context.includeDeclaration;
    const references = [];
    // Get all open document URIs to avoid duplicates
    const openDocumentUris = new Set();
    documents.all().forEach((d) => openDocumentUris.add(d.uri));
    // Search all open documents
    console.log(`[References] Searching ${openDocumentUris.size} open documents...`);
    documents.all().forEach((document) => {
        const docRefs = findReferencesInDocument(document, typeName, excludeDefinition);
        references.push(...docRefs);
        console.log(`[References] Found ${docRefs.length} references in ${document.uri}`);
    });
    // Search workspace files
    const debugInfo = workspaceIndex.getDebugInfo();
    console.log(`[References] Searching workspace files in ${debugInfo.workspaceRoots.length} root(s)...`);
    for (const root of debugInfo.workspaceRoots) {
        const workspaceRefs = scanDirectoryForReferences(root, typeName, excludeDefinition, openDocumentUris);
        references.push(...workspaceRefs);
        console.log(`[References] Found ${workspaceRefs.length} references in workspace root: ${root}`);
    }
    console.log(`[References] ===== Found ${references.length} total references =====`);
    return references;
});
connection.languages.semanticTokens.on((params) => {
    console.error(`[SemanticTokens] ===== Request Received =====`);
    console.error(`[SemanticTokens] URI: ${params.textDocument.uri}`);
    const doc = documents.get(params.textDocument.uri);
    const builder = new node_1.SemanticTokensBuilder();
    if (!doc) {
        console.error(`[SemanticTokens] ERROR: Document not found for ${params.textDocument.uri}`);
        return builder.build();
    }
    const text = doc.getText();
    const lines = text.split(/\r?\n/);
    console.error(`[SemanticTokens] Processing document with ${lines.length} lines`);
    // Build symbol table to identify local variables and parameters
    const symbolTable = (0, symbolTable_1.buildSymbolTable)(text);
    // Create a map of variable names to their declaration lines for scoping checks
    const variableDeclarations = new Map();
    symbolTable.symbols.forEach(symbol => {
        if (symbol.kind === "variable" && symbol.location) {
            const existing = variableDeclarations.get(symbol.name) || [];
            existing.push(symbol.location.line);
            variableDeclarations.set(symbol.name, existing);
        }
    });
    console.error(`[SemanticTokens] Found ${variableDeclarations.size} variable/parameter declarations`);
    // Log workspace index state
    const debugInfo = workspaceIndex.getDebugInfo();
    console.error(`[SemanticTokens] Workspace index has ${debugInfo.objectCount} types`);
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
        let match;
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
                console.error(`[SemanticTokens] Skipping "${identifier}" at line ${lineIndex + 1} - it's a local variable/parameter`);
                continue;
            }
            // Check if it's a user-defined type using workspace index
            if (workspaceIndex.isUserDefinedType(identifier)) {
                console.error(`[SemanticTokens] ✓ Found user-defined type "${identifier}" at line ${lineIndex + 1}, char ${startChar}`);
                // Token type index 0 corresponds to "type" in our legend
                builder.push(lineIndex, startChar, length, 0, 0);
            }
        }
    }
    const result = builder.build();
    const tokenCount = result.data.length / 5;
    console.error(`[SemanticTokens] ===== Returning ${tokenCount} tokens =====`);
    return result;
});
// Note: Workspace folder change handler is now registered in onInitialized callback
// to ensure the client supports workspace folder change notifications
console.error("[Server] Starting to listen for connections...");
documents.listen(connection);
connection.listen();
console.error("[Server] ===== Server listening, ready to receive requests =====");
