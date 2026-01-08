"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideCompletions = provideCompletions;
const vscode_languageserver_1 = require("vscode-languageserver");
const keywordCompletions_1 = require("./keywordCompletions");
const bifCompletions_1 = require("./bifCompletions");
const contextCompletions_1 = require("./contextCompletions");
/**
 * Get the type of a variable at a given position
 */
function getVariableType(variableName, position, symbolTable, doc) {
    // Find the most recent declaration of this variable before or at the cursor position
    const relevantSymbols = symbolTable.symbols
        .filter((s) => s.name === variableName &&
        s.kind === "variable" &&
        s.location &&
        s.type &&
        (s.location.line < position.line ||
            (s.location.line === position.line &&
                s.location.character <= position.character)))
        .sort((a, b) => {
        // Sort by line (most recent first), then by character
        if (a.location.line !== b.location.line) {
            return b.location.line - a.location.line;
        }
        return b.location.character - a.location.character;
    });
    if (relevantSymbols.length > 0) {
        return relevantSymbols[0].type || null;
    }
    return null;
}
async function provideCompletions(params, symbolTable, doc, workspaceIndex) {
    const items = [];
    const position = params.position;
    // Check if this is a dot-triggered completion
    const isDotTriggered = params.context?.triggerCharacter === ".";
    if (isDotTriggered) {
        // Extract the variable name before the dot
        const line = doc.getText().split(/\r?\n/)[position.line] || "";
        const beforeCursor = line.substring(0, position.character);
        // Match pattern: identifier. (where identifier is a variable name)
        // Look backwards from cursor to find the identifier before the dot
        const dotIndex = beforeCursor.lastIndexOf(".");
        if (dotIndex !== -1) {
            const beforeDot = beforeCursor.substring(0, dotIndex).trim();
            // Extract the last identifier (variable name)
            const identifierMatch = beforeDot.match(/([a-z][A-Za-z0-9_]*)\s*$/);
            if (identifierMatch && identifierMatch[1]) {
                const variableName = identifierMatch[1];
                // Get the type of this variable
                const variableType = getVariableType(variableName, position, symbolTable, doc);
                if (variableType) {
                    // Remove array brackets for type lookup
                    const baseType = variableType.replace(/\[\]$/, "");
                    // Check if it's a user-defined type
                    if (workspaceIndex.isUserDefinedType(baseType)) {
                        // Get properties for this type
                        const properties = (0, contextCompletions_1.getObjectProperties)(baseType, workspaceIndex);
                        properties.forEach((prop) => {
                            items.push({
                                label: prop,
                                kind: vscode_languageserver_1.CompletionItemKind.Property,
                            });
                        });
                        // Return early with just the properties (don't show keywords/BIFs when dot-triggered)
                        return items;
                    }
                }
            }
        }
    }
    // Default completions (keywords, BIFs, etc.) - only show when not dot-triggered
    if (!isDotTriggered) {
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
    }
    return items;
}
