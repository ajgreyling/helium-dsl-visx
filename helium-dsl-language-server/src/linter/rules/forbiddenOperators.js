import { pushDiagnostic } from "../engine.js";
import { maskCommentsPreserveLength } from "../commentMask.js";
export function applyForbiddenOperators(ctx) {
    if (!ctx.rules["forbidden-operators"])
        return;
    const maskedText = maskCommentsPreserveLength(ctx.text);
    const lines = maskedText.split(/\r?\n/);
    const stringLiteralCache = new Map();
    let inMultiLineBlock = false;
    lines.forEach((line, idx) => {
        if (line.length > 10000) {
            return;
        }
        const hasStartMarker = line.includes("/%");
        const hasEndMarker = line.includes("%/");
        if (inMultiLineBlock) {
            if (hasEndMarker) {
                inMultiLineBlock = false;
            }
            return;
        }
        if (hasStartMarker) {
            if (!hasEndMarker) {
                inMultiLineBlock = true;
            }
            return;
        }
        let stringLiteralPositions;
        if (stringLiteralCache.has(idx)) {
            stringLiteralPositions = stringLiteralCache.get(idx);
        }
        else {
            stringLiteralPositions = new Set();
            let inDouble = false;
            let inSingle = false;
            let inBlock = false;
            let escapeNext = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (escapeNext) {
                    escapeNext = false;
                    continue;
                }
                if (char === "\\") {
                    escapeNext = true;
                    continue;
                }
                if (line.substring(i, i + 2) === "/%") {
                    inBlock = true;
                    i++;
                    continue;
                }
                if (line.substring(i, i + 2) === "%/") {
                    inBlock = false;
                    i++;
                    continue;
                }
                if (!inBlock) {
                    if (char === '"' && !inSingle) {
                        inDouble = !inDouble;
                        if (inDouble)
                            stringLiteralPositions.add(i);
                    }
                    if (char === "'" && !inDouble) {
                        inSingle = !inSingle;
                        if (inSingle)
                            stringLiteralPositions.add(i);
                    }
                }
                if (inDouble || inSingle || inBlock) {
                    stringLiteralPositions.add(i);
                }
            }
            stringLiteralCache.set(idx, stringLiteralPositions);
        }
        const inStringLiteral = (pos) => {
            return stringLiteralPositions.has(pos);
        };
        const ifBooleanPattern = /\bif\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)/g;
        let ifMatch;
        let ifMatchCount = 0;
        while ((ifMatch = ifBooleanPattern.exec(line)) !== null) {
            ifMatchCount++;
            if (ifMatchCount > 100) {
                break;
            }
            if (inStringLiteral(ifMatch.index)) {
                continue;
            }
            const conditionContent = ifMatch[0].substring(ifMatch[0].indexOf("(") + 1, ifMatch[0].lastIndexOf(")"));
            if (/==|!=/.test(conditionContent.trim())) {
                continue;
            }
            pushDiagnostic(ctx, "forbidden-operators", idx, ifMatch.index, ifMatch[0].length, "Boolean variables in if conditions must use explicit comparison. Use '== true' or '== false'.");
            if (ifMatch[0].length === 0) {
                ifBooleanPattern.lastIndex++;
            }
        }
        const ops = [
            {
                regex: /\+=|-=|\*=|\/=|%=/,
                msg: "Compound assignment is not allowed. Use explicit assignment.",
                checkString: false,
            },
            {
                regex: /\b[A-Za-z_][A-Za-z0-9_]*\s*\?(?!\s*[A-Za-z_][A-Za-z0-9_]*\s*=)\s*[^:]{0,500}\s*:/,
                msg: "Ternary operator is not allowed. Use if/else.",
                checkString: true,
            },
            {
                regex: /!\s*[A-Za-z_][A-Za-z0-9_]*/,
                msg: "Use '== false' instead of '!var'.",
                checkString: true,
            },
        ];
        ops.forEach(({ regex, msg, checkString }, opIdx) => {
            let match;
            let matchCount = 0;
            while ((match = regex.exec(line)) !== null) {
                matchCount++;
                if (matchCount > 100) {
                    break;
                }
                if (checkString && inStringLiteral(match.index)) {
                    continue;
                }
                pushDiagnostic(ctx, "forbidden-operators", idx, match.index, match[0].length, msg);
                if (match[0].length === 0) {
                    regex.lastIndex++;
                    if (regex.lastIndex === match.index) {
                        break;
                    }
                }
            }
        });
    });
}
