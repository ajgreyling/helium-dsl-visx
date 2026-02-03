import { DiagnosticSeverity } from "vscode-languageserver/node.js";
import type { ProjectManager } from "../index/projectManager.js";
import type { VxmlAst, VxmlRange } from "./types.js";

export type VxmlDiagnostic = {
  message: string;
  range: VxmlRange;
  severity?: DiagnosticSeverity;
  source?: string;
};

type Qualified = { unitName: string | null; memberName: string | null } | null;

function resolveVxmlQualified(raw: string, fallbackUnitName: string | undefined): Qualified {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return null;
  const colon = trimmed.indexOf(":");
  if (colon !== -1) {
    const unitName = trimmed.slice(0, colon).trim();
    const memberName = trimmed.slice(colon + 1).trim();
    return { unitName: unitName || null, memberName: memberName || null };
  }
  return { unitName: fallbackUnitName ?? null, memberName: trimmed };
}

/**
 * Check if a reference string violates dot notation rules.
 * Returns true if the string has more than one dot (e.g., "a.b.c" or "Unit:obj.attr.more").
 * For unit-qualified references, only the part after the colon is checked.
 */
function hasDotNotationViolation(refName: string): boolean {
  const trimmed = (refName ?? "").trim();
  if (!trimmed) return false;
  
  const colon = trimmed.indexOf(":");
  if (colon !== -1) {
    // Unit-qualified: check only the part after the colon
    // Example: "Unit:obj.attr" -> "obj.attr" has 1 dot (valid)
    // Example: "Unit:obj.attr.more" -> "obj.attr.more" has 2 dots (invalid)
    const afterColon = trimmed.slice(colon + 1).trim();
    const dotCount = (afterColon.match(/\./g) || []).length;
    return dotCount > 1;
  } else {
    // Non-unit-qualified: check all dots
    // Example: "obj.attr" has 1 dot (valid)
    // Example: "obj.attr.more" has 2 dots (invalid)
    const dotCount = (trimmed.match(/\./g) || []).length;
    return dotCount > 1;
  }
}

export type ValidateVxmlOptions = {
  /** When false, skip index-dependent diagnostics (unknown unit/function/variable, missing lang key). Default true. */
  indexReady?: boolean;
};

export function validateVxml(
  ast: VxmlAst,
  projectManager: ProjectManager,
  opts?: ValidateVxmlOptions
): VxmlDiagnostic[] {
  const diagnostics: VxmlDiagnostic[] = [];
  const source = "helium-vxml";
  const indexReady = opts?.indexReady !== false;

  const viewUnit = ast.view?.unitName;
  const viewInit = ast.view?.initFunction;
  const viewLabel = ast.view?.labelKey;

  if (indexReady && viewUnit && !projectManager.isUnit(viewUnit)) {
    diagnostics.push({
      message: `Unknown unit '${viewUnit}' referenced by <view unit="...">`,
      range: ast.view!.range,
      severity: DiagnosticSeverity.Error,
      source,
    });
  }

  if (indexReady && viewUnit && viewInit && !projectManager.hasUnitFunction(viewUnit, viewInit)) {
    diagnostics.push({
      message: `Unknown init function '${viewInit}' on unit '${viewUnit}'`,
      range: ast.view!.range,
      severity: DiagnosticSeverity.Error,
      source,
    });
  }

  if (indexReady && viewLabel && !projectManager.hasLangKey(viewLabel)) {
    diagnostics.push({
      message: `Missing language key '${viewLabel}' (referenced by <view label="...">)`,
      range: ast.view!.range,
      severity: DiagnosticSeverity.Warning,
      source,
    });
  }

  for (const ref of ast.references ?? []) {
    if (ref.kind === "unit") {
      if (indexReady && !projectManager.isUnit(ref.name)) {
        diagnostics.push({
          message: `Unknown unit '${ref.name}'`,
          range: ref.range,
          severity: DiagnosticSeverity.Error,
          source,
        });
      }
      continue;
    }

    if (ref.kind === "enum") {
      if (indexReady && !projectManager.isEnum(ref.name)) {
        diagnostics.push({
          message: `Unknown enum '${ref.name}'`,
          range: ref.range,
          severity: DiagnosticSeverity.Error,
          source,
        });
      }
      continue;
    }

    if (ref.kind === "langKey") {
      if (indexReady && !projectManager.hasLangKey(ref.name)) {
        diagnostics.push({
          message: `Missing language key '${ref.name}'`,
          range: ref.range,
          severity: DiagnosticSeverity.Warning,
          source,
        });
      }
      continue;
    }

    if (ref.kind === "function") {
      // Always run: dot notation
      if (hasDotNotationViolation(ref.name)) {
        diagnostics.push({
          message: "Dot notation is only supported one level deep.",
          range: ref.range,
          severity: DiagnosticSeverity.Error,
          source,
        });
      }

      if (!indexReady) continue;

      const resolved = resolveVxmlQualified(ref.name, viewUnit);
      if (!resolved?.unitName || !resolved.memberName) continue;
      if (!projectManager.isUnit(resolved.unitName)) {
        diagnostics.push({
          message: `Unknown unit '${resolved.unitName}'`,
          range: ref.range,
          severity: DiagnosticSeverity.Error,
          source,
        });
        continue;
      }
      if (!projectManager.hasUnitFunction(resolved.unitName, resolved.memberName)) {
        diagnostics.push({
          message: `Unknown function '${resolved.memberName}' on unit '${resolved.unitName}'`,
          range: ref.range,
          severity: DiagnosticSeverity.Error,
          source,
        });
      }
      continue;
    }

    if (ref.kind === "variable") {
      // Always run: dot notation
      if (hasDotNotationViolation(ref.name)) {
        diagnostics.push({
          message: "Dot notation is only supported one level deep.",
          range: ref.range,
          severity: DiagnosticSeverity.Error,
          source,
        });
      }

      if (!indexReady) continue;

      const resolved = resolveVxmlQualified(ref.name, viewUnit);
      if (!resolved?.unitName || !resolved.memberName) continue;
      if (!projectManager.isUnit(resolved.unitName)) {
        diagnostics.push({
          message: `Unknown unit '${resolved.unitName}'`,
          range: ref.range,
          severity: DiagnosticSeverity.Error,
          source,
        });
        continue;
      }
      if (!projectManager.hasUnitVariable(resolved.unitName, resolved.memberName)) {
        diagnostics.push({
          message: `Unknown variable '${resolved.memberName}' on unit '${resolved.unitName}'`,
          range: ref.range,
          severity: DiagnosticSeverity.Error,
          source,
        });
      }
      continue;
    }
  }

  return diagnostics;
}

