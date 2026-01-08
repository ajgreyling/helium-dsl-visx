"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDotNotationLimit = applyDotNotationLimit;
const engine_1 = require("../engine");
function applyDotNotationLimit(ctx) {
    if (!ctx.rules["dot-notation-limit"])
        return;
    const lines = ctx.text.split(/\r?\n/);
    lines.forEach((line, idx) => {
        // Match chained dot notation: identifier.identifier.identifier (2+ dots in sequence)
        // Pattern: word.word.word (not separated by whitespace/operators)
        const chainedDots = /\b[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*/;
        const match = line.match(chainedDots);
        if (match) {
            const col = match.index ?? 0;
            (0, engine_1.pushDiagnostic)(ctx, "dot-notation-limit", idx, col, match[0].length, ctx.rules["dot-notation-limit"].message);
        }
    });
}
