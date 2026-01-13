import { pushDiagnostic } from "../engine";
export function applyNoVarInElse(ctx) {
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
            braceDepth = 1; // We're entering the else block (depth 1)
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
                braceDepth = 1; // We're entering the else block (depth 1)
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
                // Check if line contains for loops and identify their initialization sections
                // For loop format: for (int i = 0; i < length; i = i + 1)
                // Initialization section is from "for (" to the first ";"
                const forLoopInitRanges = [];
                const forPattern = /\bfor\s*\(/g;
                let forMatch;
                // Find all for loops on this line
                while ((forMatch = forPattern.exec(line)) !== null) {
                    const forStart = forMatch.index;
                    let parenDepth = 1; // We're inside the opening paren of "for ("
                    let pos = forMatch.index + forMatch[0].length;
                    let initEnd = -1;
                    // Find the first semicolon that's at the same paren depth (end of initialization)
                    while (pos < line.length) {
                        const char = line[pos];
                        if (char === '(') {
                            parenDepth++;
                        }
                        else if (char === ')') {
                            parenDepth--;
                            if (parenDepth === 0) {
                                // Reached end of for loop without finding semicolon (unusual but possible)
                                break;
                            }
                        }
                        else if (char === ';' && parenDepth === 1) {
                            // Found the first semicolon at the same depth as "for ("
                            initEnd = pos + 1; // Include the semicolon
                            break;
                        }
                        pos++;
                    }
                    if (initEnd > 0) {
                        forLoopInitRanges.push({ start: forStart, end: initEnd });
                    }
                }
                // Now check for variable declarations, excluding those in for loop initialization
                const varDeclPattern = /\b(?:int|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Z][A-Za-z0-9_]*)\s+[a-z_][A-Za-z0-9_]*\s*(=|;)/g;
                let varMatch;
                while ((varMatch = varDeclPattern.exec(line)) !== null) {
                    const varStart = varMatch.index ?? 0;
                    const varEnd = varStart + varMatch[0].length;
                    // Check if this variable declaration is within any for loop initialization section
                    const isInForLoopInit = forLoopInitRanges.some(range => varStart >= range.start && varEnd <= range.end);
                    if (!isInForLoopInit) {
                        // This variable declaration is not in a for loop initialization, flag it
                        pushDiagnostic(ctx, "no-var-in-else", idx, varStart, varMatch[0].length, ctx.rules["no-var-in-else"].message);
                    }
                }
            }
            if (braceDepth <= 0)
                inElse = false;
        }
    });
}
