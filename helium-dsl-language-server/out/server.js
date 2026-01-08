"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const diagnostics_1 = require("./diagnostics");
const symbolTable_1 = require("./symbols/symbolTable");
const completionProvider_1 = require("./completion/completionProvider");
const engine_1 = require("./linter/engine");
const connection = (0, vscode_languageserver_1.createConnection)(vscode_languageserver_1.ProposedFeatures.all);
const documents = new vscode_languageserver_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
const semanticLegend = {
    tokenTypes: ["type", "function", "variable"],
    tokenModifiers: [],
};
connection.onInitialize((_params) => {
    return {
        capabilities: {
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Incremental,
            completionProvider: { resolveProvider: false },
            hoverProvider: true,
            semanticTokensProvider: {
                legend: semanticLegend,
                range: false,
                full: true,
            },
            definitionProvider: true,
            referencesProvider: true,
        },
    };
});
documents.onDidChangeContent((change) => {
    validateDocument(change.document);
});
documents.onDidOpen((change) => {
    validateDocument(change.document);
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
connection.onDefinition((_params) => {
    return [];
});
connection.onReferences((_params) => {
    return [];
});
connection.languages.semanticTokens.on((_params) => {
    const builder = new vscode_languageserver_1.SemanticTokensBuilder(semanticLegend);
    // Placeholder: no semantic tokens yet.
    return builder.build();
});
documents.listen(connection);
connection.listen();
