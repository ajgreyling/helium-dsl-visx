import { pushDiagnostic, LintContext } from "../engine.js";
import { maskCommentsPreserveLength } from "../commentMask.js";

export function applyForbiddenOperators(ctx: LintContext) {
  if (!ctx.rules["forbidden-operators"]) return;
  const maskedText = maskCommentsPreserveLength(ctx.text);
  const lines = maskedText.split(/\r?\n/);

  const stringLiteralCache = new Map<number, Set<number>>();
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

    let stringLiteralPositions: Set<number>;
    if (stringLiteralCache.has(idx)) {
      stringLiteralPositions = stringLiteralCache.get(idx)!;
    } else {
      stringLiteralPositions = new Set<number>();
      let inDouble = false;
      let inSingle = false;
      let inBlock = false;
      let escapeNext = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i]!;
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
            if (inDouble) stringLiteralPositions.add(i);
          }
          if (char === "'" && !inDouble) {
            inSingle = !inSingle;
            if (inSingle) stringLiteralPositions.add(i);
          }
        }
        if (inDouble || inSingle || inBlock) {
          stringLiteralPositions.add(i);
        }
      }
      stringLiteralCache.set(idx, stringLiteralPositions);
    }

    const inStringLiteral = (pos: number): boolean => {
      return stringLiteralPositions.has(pos);
    };

    const ifConditions = extractInlineIfConditions(line);
    let ifConditionCount = 0;
    for (const ifCondition of ifConditions) {
      ifConditionCount++;
      if (ifConditionCount > 100) {
        break;
      }
      if (inStringLiteral(ifCondition.start)) {
        continue;
      }
      if (!isBareBooleanConditionWithoutExplicitComparison(ifCondition.condition)) {
        continue;
      }

      pushDiagnostic(
        ctx,
        "forbidden-operators",
        idx,
        ifCondition.start,
        ifCondition.length,
        "Boolean variables in if conditions must use explicit comparison. Use '== true' or '== false'."
      );
    }

    const ops = [
      {
        regex: /\+=|-=|\*=|\/=|%=/,
        msg: "Compound assignment is not allowed. Use explicit assignment.",
        checkString: false,
      },
      {
        regex:
          /\b[A-Za-z_][A-Za-z0-9_]*\s*\?(?!\s*[A-Za-z_][A-Za-z0-9_]*\s*=)\s*[^:]{0,500}\s*:/,
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
      let match: RegExpExecArray | null;
      let matchCount = 0;
      while ((match = regex.exec(line)) !== null) {
        matchCount++;
        if (matchCount > 100) {
          break;
        }
        if (checkString && inStringLiteral(match.index!)) {
          continue;
        }
        pushDiagnostic(ctx, "forbidden-operators", idx, match.index!, match[0].length, msg);
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

function extractInlineIfConditions(
  line: string
): Array<{ start: number; length: number; condition: string }> {
  const results: Array<{ start: number; length: number; condition: string }> = [];
  let cursor = 0;

  while (cursor < line.length) {
    const ifIndex = line.indexOf("if", cursor);
    if (ifIndex === -1) break;

    const before = ifIndex > 0 ? line[ifIndex - 1] : "";
    const after = ifIndex + 2 < line.length ? line[ifIndex + 2] : "";
    if (isIdentifierChar(before) || isIdentifierChar(after)) {
      cursor = ifIndex + 2;
      continue;
    }

    let openParen = ifIndex + 2;
    while (openParen < line.length && /\s/.test(line[openParen]!)) openParen++;
    if (openParen >= line.length || line[openParen] !== "(") {
      cursor = ifIndex + 2;
      continue;
    }

    let depth = 0;
    let closeParen = -1;
    for (let i = openParen; i < line.length; i++) {
      const c = line[i]!;
      if (c === "(") depth++;
      if (c === ")") depth--;
      if (depth === 0) {
        closeParen = i;
        break;
      }
    }

    if (closeParen === -1) break;
    results.push({
      start: ifIndex,
      length: closeParen - ifIndex + 1,
      condition: line.slice(openParen + 1, closeParen),
    });
    cursor = closeParen + 1;
  }

  return results;
}

function isBareBooleanConditionWithoutExplicitComparison(condition: string): boolean {
  const trimmed = condition.trim();
  if (trimmed.length === 0) return false;
  if (/==|!=/.test(trimmed)) return false;
  if (/[<>]=?|&&|\|\|/.test(trimmed)) return false;
  if (/[+\-*/%]/.test(trimmed)) return false;
  if (/^\s*!/.test(trimmed)) return false;

  return /^[A-Za-z_][A-Za-z0-9_]*(?::[A-Za-z_][A-Za-z0-9_]*)?(?:\.[A-Za-z_][A-Za-z0-9_]*)*(?:\s*\([^()]*\))?$/.test(
    trimmed
  );
}

function isIdentifierChar(char: string): boolean {
  return /[A-Za-z0-9_]/.test(char);
}
