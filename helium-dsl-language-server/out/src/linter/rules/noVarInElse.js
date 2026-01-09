"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyNoVarInElse = applyNoVarInElse;
const engine_1 = require("../engine");
function applyNoVarInElse(ctx) {
    if (!ctx.rules["no-var-in-else"])
        return;
    const lines = ctx.text.split(/\r?\n/);
    let inElse = false;
    let braceDepth = 0;
    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        // Only flag plain "else" blocks, not "else if" blocks
        // The rule applies to: } else { but not } else if (...) {
        // Check for "else" that is NOT followed by "if"
        // Pattern 1: } else { on the same line
        if (/}\s*else\s*{/.test(trimmed)) {
            // This is a plain else block
            inElse = true;
            braceDepth = (trimmed.match(/{/g) || []).length - (trimmed.match(/}/g) || []).length;
            return;
        }
        // Pattern 2: } else at end of line (check next line for if)
        if (/}\s*else\s*$/.test(trimmed)) {
            // Check next line to see if it's "if" - if so, skip it
            const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : '';
            if (!nextLine.startsWith('if')) {
                inElse = true;
                braceDepth = (trimmed.match(/{/g) || []).length - (trimmed.match(/}/g) || []).length;
                return;
            }
        }
        // Pattern 3: Line starts with "else {" - this is an else block (not "else if")
        // This handles: } \n else { or if (...) { \n ... \n else {
        if (/^else\s*{/.test(trimmed)) {
            // Make sure it's not "else if" by checking what follows "else"
            // The pattern already ensures it's "else {" not "else if", but double-check next line
            const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : '';
            if (!nextLine.startsWith('if')) {
                inElse = true;
                braceDepth = (trimmed.match(/{/g) || []).length - (trimmed.match(/}/g) || []).length;
                return;
            }
        }
        // Pattern 4: Line starts with just "else" (not "else if")
        // This handles: } \n else \n { or if (...) { \n ... \n else \n {
        if (/^else\s*$/.test(trimmed)) {
            // Check next line to make sure it's not "else if" and that it starts with {
            const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : '';
            if (!nextLine.startsWith('if') && nextLine.startsWith('{')) {
                inElse = true;
                braceDepth = 0; // Will be adjusted when we process the next line with {
                return;
            }
        }
        // Reset if we see "else if" - this is not a plain else block
        if (/else\s+if\s*\(/.test(trimmed)) {
            inElse = false;
            return;
        }
        if (inElse) {
            braceDepth += (line.match(/{/g) || []).length;
            braceDepth -= (line.match(/}/g) || []).length;
            // Match variable declarations but exclude return statements and literals
            // Pattern: type identifier = or type identifier;
            // Must not be preceded by "return" keyword
            if (!/\breturn\b/.test(trimmed)) {
                const varDecl = line.match(/\b(?:int|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Z][A-Za-z0-9_]*)\s+[a-z_][A-Za-z0-9_]*\s*(=|;)/);
                if (varDecl) {
                    const col = varDecl.index ?? 0;
                    (0, engine_1.pushDiagnostic)(ctx, "no-var-in-else", idx, col, varDecl[0].length, ctx.rules["no-var-in-else"].message);
                }
            }
            if (braceDepth <= 0)
                inElse = false;
        }
    });
}
