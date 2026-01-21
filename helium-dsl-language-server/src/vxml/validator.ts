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

export function validateVxml(ast: VxmlAst, projectManager: ProjectManager): VxmlDiagnostic[] {
  const diagnostics: VxmlDiagnostic[] = [];
  const source = "helium-vxml";

  const viewUnit = ast.view?.unitName;
  const viewInit = ast.view?.initFunction;
  const viewLabel = ast.view?.labelKey;

  if (viewUnit && !projectManager.isUnit(viewUnit)) {
    diagnostics.push({
      message: `Unknown unit '${viewUnit}' referenced by <view unit="...">`,
      range: ast.view!.range,
      severity: DiagnosticSeverity.Error,
      source,
    });
  }

  if (viewUnit && viewInit && !projectManager.hasUnitFunction(viewUnit, viewInit)) {
    diagnostics.push({
      message: `Unknown init function '${viewInit}' on unit '${viewUnit}'`,
      range: ast.view!.range,
      severity: DiagnosticSeverity.Error,
      source,
    });
  }

  if (viewLabel && !projectManager.hasLangKey(viewLabel)) {
    diagnostics.push({
      message: `Missing language key '${viewLabel}' (referenced by <view label="...">)`,
      range: ast.view!.range,
      severity: DiagnosticSeverity.Warning,
      source,
    });
  }

  for (const ref of ast.references ?? []) {
    if (ref.kind === "unit") {
      if (!projectManager.isUnit(ref.name)) {
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
      if (!projectManager.isEnum(ref.name)) {
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
      if (!projectManager.hasLangKey(ref.name)) {
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

