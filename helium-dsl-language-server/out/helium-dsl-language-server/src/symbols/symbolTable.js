"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSymbolTable = buildSymbolTable;
// Lightweight heuristic-based symbol extraction until full AST integration.
function buildSymbolTable(text) {
    const symbols = [];
    const lines = text.split(/\r?\n/);
    lines.forEach((line, idx) => {
        const unitMatch = line.match(/\bunit\s+([A-Za-z_][A-Za-z0-9_]*)/);
        if (unitMatch) {
            symbols.push({ name: unitMatch[1], kind: "unit", location: { line: idx, character: unitMatch.index ?? 0 } });
        }
        const funcMatch = line.match(/\b(?:int|void|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*)\s+([a-z][A-Za-z0-9_]*)\s*\(/);
        if (funcMatch) {
            symbols.push({ name: funcMatch[1], kind: "function", location: { line: idx, character: funcMatch.index ?? 0 } });
        }
        const varMatch = line.match(/\b(?:int|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*)\s+([a-z][A-Za-z0-9_]*)\s*(=|;)/);
        if (varMatch) {
            symbols.push({ name: varMatch[1], kind: "variable", location: { line: idx, character: varMatch.index ?? 0 } });
        }
    });
    return { symbols };
}
