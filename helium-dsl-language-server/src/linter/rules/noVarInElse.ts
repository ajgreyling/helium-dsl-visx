import { pushDiagnostic, LintContext } from "../engine.js";
import { buildFileAst, rangeContains } from "../../ast/builder.js";

export async function applyNoVarInElse(ctx: LintContext) {
  if (!ctx.rules["no-var-in-else"]) return;
  const ast = await buildFileAst(ctx.text, "memory://lint");
  if (ast.elseBlocks.length === 0) {
    applyLegacyNoVarInElse(ctx);
    return;
  }

  const declarations = ast.units.flatMap((unit) => [
    ...unit.variables,
    ...unit.functions.flatMap((fn) => fn.locals),
  ]);

  for (const decl of declarations) {
    const inElse = ast.elseBlocks.some((elseRange) =>
      rangeContains(elseRange, decl.declRange.start.line, decl.declRange.start.character)
    );
    if (inElse) {
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
      if (braceDepth <= 0) inElse = false;
    }
  });
}

