"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideCompletions = provideCompletions;
const vscode_languageserver_1 = require("vscode-languageserver");
const keywordCompletions_1 = require("./keywordCompletions");
const bifCompletions_1 = require("./bifCompletions");
const contextCompletions_1 = require("./contextCompletions");
async function provideCompletions(_params, symbolTable) {
    const items = [];
    keywordCompletions_1.keywords.forEach((kw) => items.push({ label: kw, kind: vscode_languageserver_1.CompletionItemKind.Keyword }));
    const bifs = await (0, bifCompletions_1.loadBifCompletions)();
    bifs.forEach((b) => items.push({
        label: b.label,
        kind: vscode_languageserver_1.CompletionItemKind.Function,
        detail: b.detail,
    }));
    const contextItems = (0, contextCompletions_1.buildContextCompletions)(symbolTable);
    items.push(...contextItems.map((c) => ({
        label: c.label,
        kind: vscode_languageserver_1.CompletionItemKind.Variable,
    })));
    return items;
}
