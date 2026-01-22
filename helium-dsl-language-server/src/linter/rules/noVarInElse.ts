import { pushDiagnostic, LintContext } from "../engine.js";
import { buildFileAst, rangeContains } from "../../ast/builder.js";

export async function applyNoVarInElse(ctx: LintContext) {
  if (!ctx.rules["no-var-in-else"]) return;
  try {
    const ast = await buildFileAst(ctx.text, "memory://lint");
    if (ast.elseBlocks.length === 0) {
      applyLegacyNoVarInElse(ctx);
      return;
    }

    const lineOffsets = computeLineOffsets(ctx.text);

    const declarations = ast.units.flatMap((unit) => [
      ...unit.variables,
      ...unit.functions.flatMap((fn) => fn.locals),
    ]);

    for (const decl of declarations) {
      const elseRange = ast.elseBlocks.find((r) =>
        rangeContains(r, decl.declRange.start.line, decl.declRange.start.character)
      );
      if (!elseRange) continue;
      if (decl.isForeachLoopVariable) continue;
      if (decl.isCatchVariable) continue;

      const declOffset = positionToOffset(
        ctx.text,
        lineOffsets,
        decl.declRange.start.line,
        decl.declRange.start.character
      );

      // We only forbid declarations directly under `else { ... }` (brace depth 1).
      // Declarations inside nested blocks within else (e.g. `if (...) { <decl> }`) are allowed.
      const elseOpenBraceOffset = findFirstCharOffsetInRange(ctx.text, lineOffsets, elseRange, "{");
      if (elseOpenBraceOffset == null) {
        // Should not happen for valid `elsePart: 'else' codeBlock`, but be permissive.
        continue;
      }

      const depth = braceDepthAtOffset(ctx.text, elseOpenBraceOffset, declOffset);
      if (depth === 1) {
        pushDiagnostic(
          ctx,
          "no-var-in-else",
          decl.nameRange.start.line,
          decl.nameRange.start.character,
          decl.name.length,
          ctx.rules["no-var-in-else"].message
        );
      }
    }
  } catch {
    // If AST-building or range math fails, fall back to the legacy scanner.
    applyLegacyNoVarInElse(ctx);
  }
}

function applyLegacyNoVarInElse(ctx: LintContext) {
  const lines = ctx.text.split(/\r?\n/);
  let inElse = false;
  let braceDepth = 0;
  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (/}\s*else\s*{/.test(trimmed)) {
      inElse = true;
      braceDepth = 1;
      return;
    }

    if (/}\s*else\s*$/.test(trimmed)) {
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : "";
      if (!nextLine.startsWith("if")) {
        inElse = true;
        braceDepth =
          (trimmed.match(/{/g) || []).length -
          (trimmed.match(/}/g) || []).length;
        return;
      }
    }

    if (/^else\s*{/.test(trimmed)) {
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : "";
      if (!nextLine.startsWith("if")) {
        inElse = true;
        braceDepth = 1;
        return;
      }
    }

    if (/^else\s*$/.test(trimmed)) {
      const nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : "";
      if (!nextLine.startsWith("if") && nextLine.startsWith("{")) {
        inElse = true;
        braceDepth = 0;
        return;
      }
    }

    if (/else\s+if\s*\(/.test(trimmed)) {
      inElse = false;
      return;
    }

    if (inElse) {
      braceDepth += (line.match(/{/g) || []).length;
      braceDepth -= (line.match(/}/g) || []).length;

      if (!/\breturn\b/.test(trimmed)) {
        const varDeclPattern =
          /\b(?:int|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Z][A-Za-z0-9_]*)\s+[a-z_][A-Za-z0-9_]*\s*(=|;)/g;
        let varMatch: RegExpExecArray | null;

        while ((varMatch = varDeclPattern.exec(line)) !== null) {
          // Only forbid declarations directly under else block (brace depth 1).
          if (braceDepth === 1) {
            pushDiagnostic(
              ctx,
              "no-var-in-else",
              idx,
              varMatch.index ?? 0,
              varMatch[0].length,
              ctx.rules["no-var-in-else"].message
            );
          }
        }
      }
      if (braceDepth <= 0) inElse = false;
    }
  });
}

function computeLineOffsets(text: string): number[] {
  const offsets: number[] = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") offsets.push(i + 1);
  }
  return offsets;
}function positionToOffset(
  text: string,
  lineOffsets: number[],
  line: number,
  character: number
): number {
  if (line < 0) return 0;
  if (line >= lineOffsets.length) return text.length;
  const base = lineOffsets[line] ?? 0;
  return Math.min(text.length, Math.max(0, base + Math.max(0, character)));
}function findFirstCharOffsetInRange(
  text: string,
  lineOffsets: number[],
  range: { start: { line: number; character: number }; end: { line: number; character: number } },
  needle: string
): number | null {
  const startOffset = positionToOffset(text, lineOffsets, range.start.line, range.start.character);
  const endOffset = positionToOffset(text, lineOffsets, range.end.line, range.end.character);
  const idx = text.indexOf(needle, startOffset);
  if (idx === -1 || idx > endOffset) return null;
  return idx;
}/**
 * Computes brace depth at targetOffset, scanning from startOffset (inclusive) to targetOffset (exclusive).
 * Ignores braces inside:
 * - single-line comments (`// ...`)
 * - multi-line string blocks (`/% ... %/`)
 * - string literals ('...' or "...")
 */
function braceDepthAtOffset(text: string, startOffset: number, targetOffset: number): number {
  let depth = 0;
  let inLineComment = false;
  let inBlockString = false;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;

  const end = Math.min(text.length, Math.max(startOffset, targetOffset));
  for (let i = Math.max(0, startOffset); i < end; i++) {
    const c = text[i];
    const n = i + 1 < end ? text[i + 1] : "";    if (inLineComment) {
      if (c === "\n") inLineComment = false;
      continue;
    }

    if (inBlockString) {
      if (c === "%" && n === "/") {
        inBlockString = false;
        i += 1;
      }
      continue;
    }

    if (inSingleQuote || inDoubleQuote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (c === "\\") {
        escaped = true;
        continue;
      }
      if (inSingleQuote && c === "'") {
        inSingleQuote = false;
        continue;
      }
      if (inDoubleQuote && c === '"') {
        inDoubleQuote = false;
        continue;
      }
      continue;
    }

    if (c === "/" && n === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (c === "/" && n === "%") {
      inBlockString = true;
      i += 1;
      continue;
    }
    if (c === "'") {
      inSingleQuote = true;
      continue;
    }
    if (c === '"') {
      inDoubleQuote = true;
      continue;
    }    if (c === "{") depth += 1;
    if (c === "}") depth -= 1;
  }
  return depth;
}
