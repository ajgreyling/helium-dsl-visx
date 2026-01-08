"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyForbiddenOperators = applyForbiddenOperators;
const engine_1 = require("../engine");
function applyForbiddenOperators(ctx) {
    if (!ctx.rules["forbidden-operators"])
        return;
    const lines = ctx.text.split(/\r?\n/);
    lines.forEach((line, idx) => {
        // Skip lines that are in comments
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*/')) {
            return;
        }
        // Skip if line contains SQL block markers or regex patterns
        if (line.includes('/%') || line.includes('%/')) {
            return;
        }
        // Skip string literals (both single and double quoted, and block strings)
        const inStringLiteral = (text, pos) => {
            let inDouble = false;
            let inSingle = false;
            let inBlock = false;
            let escapeNext = false;
            for (let i = 0; i < pos && i < text.length; i++) {
                const char = text[i];
                if (escapeNext) {
                    escapeNext = false;
                    continue;
                }
                if (char === '\\') {
                    escapeNext = true;
                    continue;
                }
                if (text.substring(i, i + 2) === '/%') {
                    inBlock = true;
                    i++;
                    continue;
                }
                if (text.substring(i, i + 2) === '%/') {
                    inBlock = false;
                    i++;
                    continue;
                }
                if (!inBlock) {
                    if (char === '"' && !inSingle)
                        inDouble = !inDouble;
                    if (char === "'" && !inDouble)
                        inSingle = !inSingle;
                }
            }
            return inDouble || inSingle || inBlock;
        };
        const ops = [
            {
                regex: /\+=|-=|\*=|\/=|%=/,
                msg: "Compound assignment is not allowed. Use explicit assignment.",
                checkString: false
            },
            {
                // Ternary operator: condition ? value1 : value2
                // Must be outside string literals and not part of SQL/regex
                regex: /\b[A-Za-z_][A-Za-z0-9_]*\s*\?\s*[^:]*\s*:/,
                msg: "Ternary operator is not allowed. Use if/else.",
                checkString: true
            },
            {
                regex: /!\s*[A-Za-z_][A-Za-z0-9_]*/,
                msg: "Use '== false' instead of '!var'.",
                checkString: true
            },
        ];
        ops.forEach(({ regex, msg, checkString }) => {
            let match;
            while ((match = regex.exec(line)) !== null) {
                if (checkString && inStringLiteral(line, match.index)) {
                    continue;
                }
                (0, engine_1.pushDiagnostic)(ctx, "forbidden-operators", idx, match.index, match[0].length, msg);
                // Prevent infinite loop on zero-length matches
                if (match[0].length === 0) {
                    regex.lastIndex++;
                }
            }
        });
    });
}
