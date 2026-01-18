import { VxmlAst, VxmlRange } from "./types.js";
import { ProjectManager } from "../index/projectManager.js";
import { DiagnosticSeverity } from "vscode-languageserver/node.js";

export type VxmlDiagnostic = {
  message: string;
  range: VxmlRange;
  severity?: DiagnosticSeverity;
  source?: string;
};

export function validateVxml(ast: VxmlAst, projects: ProjectManager): VxmlDiagnostic[] {
  const diagnostics: VxmlDiagnostic[] = [];

  const view = ast.view;
  if (!view) {
    diagnostics.push({
      message: "No <view> element found in VXML.",
      range: ast.rootNodes[0]?.range ?? defaultRange(),
      severity: DiagnosticSeverity.Error,
      source: "helium-vxml",
    });
    return diagnostics;
  }

  const unitRef = ast.references.find((r) => r.kind === "unit");
  const initRef = ast.references.find((r) => r.kind === "function" && r.name === view.initFunction);

  const unitName = view.unitName;
  if (!unitName) {
    diagnostics.push({
      message: "View is missing required 'unit' attribute.",
      range: view.range,
      severity: DiagnosticSeverity.Error,
      source: "helium-vxml",
    });
  } else if (!projects.isUnit(unitName)) {
    diagnostics.push({
      message: `View unit '${unitName}' does not exist.`,
      range: unitRef?.range ?? view.range,
      severity: DiagnosticSeverity.Error,
      source: "helium-vxml",
    });
  }

  const init = view.initFunction;
  if (unitName && init) {
    // init is unqualified in VXML schema; it refers to a function on the view unit.
    if (!projects.hasUnitFunction(unitName, init)) {
      diagnostics.push({
        message: `Init function '${init}' not found in unit '${unitName}'.`,
        range: initRef?.range ?? view.range,
        severity: DiagnosticSeverity.Error,
        source: "helium-vxml",
      });
    }
  }

  return diagnostics;
}

function defaultRange(): VxmlRange {
  return {
    start: { line: 0, character: 0 },
    end: { line: 0, character: 0 },
  };
}

