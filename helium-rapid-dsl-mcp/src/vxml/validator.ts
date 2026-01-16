import { MezWorkspaceService } from "../services/mezWorkspace.js";
import { LangKeyIndex } from "../services/langIndex.js";
import { VxmlAst, VxmlNode, VxmlRange } from "./types.js";
import type { FunctionDecl, VariableDecl } from "helium-dsl-language-server/api";

export type VxmlDiagnostic = {
  message: string;
  range: VxmlRange;
  severity?: number;
  source?: string;
};

export function validateVxml(
  ast: VxmlAst,
  mez: MezWorkspaceService,
  langIndex: LangKeyIndex
): VxmlDiagnostic[] {
  const diagnostics: VxmlDiagnostic[] = [];
  const index = mez.getIndex();

  const viewNode = findFirst(ast.rootNodes, (n) => n.name === "view");
  if (!viewNode) {
    diagnostics.push({
      message: "No <view> element found in VXML.",
      range: ast.rootNodes[0]?.range ?? defaultRange(),
      severity: 2,
      source: "helium-vxml",
    });
    return diagnostics;
  }

  const viewUnitAttr = getAttr(viewNode, "unit");
  const viewUnitName = viewUnitAttr?.value;
  if (!viewUnitName) {
    diagnostics.push({
      message: "View is missing required 'unit' attribute.",
      range: viewNode.range,
      severity: 2,
      source: "helium-vxml",
    });
  } else if (!index.getUnit(viewUnitName)) {
    diagnostics.push({
      message: `View unit '${viewUnitName}' does not exist.`,
      range: viewUnitAttr?.valueRange ?? viewNode.range,
      severity: 2,
      source: "helium-vxml",
    });
  }

  const initAttr = getAttr(viewNode, "init");
  if (initAttr?.value) {
    const unitName = viewUnitName;
    if (unitName && !unitHasFunction(index, unitName, initAttr.value)) {
      diagnostics.push({
        message: `Init function '${initAttr.value}' not found in unit '${unitName}'.`,
        range: initAttr.valueRange ?? viewNode.range,
        severity: 2,
        source: "helium-vxml",
      });
    }
  }

  validateViewChildren(viewNode, diagnostics);
  validateLangKeys(ast, langIndex, diagnostics);
  validateSymbolRefs(ast, viewUnitName, mez, diagnostics);
  validateAttributeRefs(viewNode, viewUnitName, mez, diagnostics);
  validateEnums(ast, mez, diagnostics);

  return diagnostics;
}

function validateLangKeys(ast: VxmlAst, langIndex: LangKeyIndex, diagnostics: VxmlDiagnostic[]) {
  for (const ref of ast.references) {
    if (ref.kind !== "langKey") continue;
    const missing = langIndex.getMissingKeyDiagnostics(ref.name);
    if (missing) {
      diagnostics.push({
        message: `Language key '${ref.name}' missing in: ${missing.missingIn.join(", ")}`,
        range: ref.range,
        severity: 2,
        source: "helium-vxml",
      });
    }
  }
}

function validateSymbolRefs(
  ast: VxmlAst,
  viewUnitName: string | undefined,
  mez: MezWorkspaceService,
  diagnostics: VxmlDiagnostic[]
) {
  const index = mez.getIndex();
  for (const ref of ast.references) {
    if (ref.kind === "unit") {
      if (!index.getUnit(ref.name)) {
        diagnostics.push({
          message: `Unit '${ref.name}' not found.`,
          range: ref.range,
          severity: 2,
          source: "helium-vxml",
        });
      }
      continue;
    }
    if (ref.kind === "function") {
      const { unitName, name } = splitQualified(ref.name, ref.unitName, viewUnitName);
      if (!unitName) {
        diagnostics.push({
          message: `Function '${name}' has no associated unit.`,
          range: ref.range,
          severity: 2,
          source: "helium-vxml",
        });
        continue;
      }
      if (!index.getUnit(unitName)) {
        diagnostics.push({
          message: `Unit '${unitName}' not found for function '${name}'.`,
          range: ref.range,
          severity: 2,
          source: "helium-vxml",
        });
        continue;
      }
      if (!unitHasFunction(index, unitName, name)) {
        diagnostics.push({
          message: `Function '${name}' not found in unit '${unitName}'.`,
          range: ref.range,
          severity: 2,
          source: "helium-vxml",
        });
      }
      continue;
    }
    if (ref.kind === "variable") {
      const { unitName, name } = splitQualified(ref.name, ref.unitName, viewUnitName);
      if (!unitName) {
        diagnostics.push({
          message: `Variable '${name}' has no associated unit.`,
          range: ref.range,
          severity: 2,
          source: "helium-vxml",
        });
        continue;
      }
      if (!index.getUnit(unitName)) {
        diagnostics.push({
          message: `Unit '${unitName}' not found for variable '${name}'.`,
          range: ref.range,
          severity: 2,
          source: "helium-vxml",
        });
        continue;
      }
      if (!unitHasVariable(index, unitName, name)) {
        diagnostics.push({
          message: `Variable '${name}' not found in unit '${unitName}'.`,
          range: ref.range,
          severity: 2,
          source: "helium-vxml",
        });
      }
    }
  }
}

function validateAttributeRefs(
  viewNode: VxmlNode,
  viewUnitName: string | undefined,
  mez: MezWorkspaceService,
  diagnostics: VxmlDiagnostic[]
) {
  const index = mez.getIndex();
  const nodes = flatten(viewNode);
  for (const node of nodes) {
    if (node.name === "attribute" || node.name === "displayAttribute") {
      const attr = getAttr(node, "name");
      if (!attr?.value) continue;
      const bindingVar = findNearestBindingVariable(node);
      if (!bindingVar) continue;
      const { unitName, name: varName } = splitQualified(bindingVar, undefined, viewUnitName);
      const typeName = unitName ? resolveUnitVariableType(index, unitName, varName) : null;
      if (!typeName) continue;
      if (!objectHasMember(index, typeName, attr.value)) {
        diagnostics.push({
          message: `Attribute '${attr.value}' not found on type '${typeName}'.`,
          range: attr.valueRange ?? attr.nameRange,
          severity: 2,
          source: "helium-vxml",
        });
      }
    }

    if (node.name === "attributeName") {
      const text = getTrimmedText(node);
      if (!text.value) continue;
      const table = findNearest(node, (n) => n.name === "table");
      if (!table) continue;
      const collectionType = resolveCollectionSourceType(table, viewUnitName, index);
      if (!collectionType) continue;
      if (!objectHasMember(index, collectionType, text.value)) {
        diagnostics.push({
          message: `Attribute '${text.value}' not found on type '${collectionType}'.`,
          range: text.range,
          severity: 2,
          source: "helium-vxml",
        });
      }
    }
  }
}

function validateEnums(ast: VxmlAst, mez: MezWorkspaceService, diagnostics: VxmlDiagnostic[]) {
  const index = mez.getIndex();
  for (const ref of ast.references) {
    if (ref.kind !== "enum") continue;
    if (!index.getEnum(ref.name)) {
      diagnostics.push({
        message: `Enum '${ref.name}' not found.`,
        range: ref.range,
        severity: 2,
        source: "helium-vxml",
      });
    }
  }
}

function validateViewChildren(viewNode: VxmlNode, diagnostics: VxmlDiagnostic[]) {
  const allowedChildren = new Set([
    "checkbox",
    "datefield",
    "fileupload",
    "select",
    "textarea",
    "textfield",
    "invite",
    "code",
    "filebrowser",
    "gallery",
    "info",
    "map",
    "table",
    "wall",
    "raw",
    "menuitem",
    "action",
    "submit",
  ]);

  const labelRequired = new Set([
    "checkbox",
    "datefield",
    "fileupload",
    "select",
    "textarea",
    "textfield",
    "invite",
    "code",
    "filebrowser",
    "gallery",
    "info",
    "map",
    "wall",
    "raw",
    "menuitem",
    "action",
    "submit",
    "rowAction",
  ]);

  for (const child of viewNode.children) {
    if (!allowedChildren.has(child.name)) {
      diagnostics.push({
        message: `Invalid view child element '${child.name}'.`,
        range: child.range,
        severity: 2,
        source: "helium-vxml",
      });
      continue;
    }
    if (labelRequired.has(child.name)) {
      const label = getAttr(child, "label");
      if (!label?.value) {
        diagnostics.push({
          message: `Element '${child.name}' requires a 'label' attribute.`,
          range: child.range,
          severity: 2,
          source: "helium-vxml",
        });
      }
    }
    if (child.name === "table") {
      const title = getAttr(child, "title");
      if (!title?.value) {
        diagnostics.push({
          message: "Table requires a 'title' attribute.",
          range: child.range,
          severity: 2,
          source: "helium-vxml",
        });
      }
    }
  }

  const columnNodes = flatten(viewNode).filter((n) => n.name === "column");
  for (const column of columnNodes) {
    const heading = getAttr(column, "heading");
    if (!heading?.value) {
      diagnostics.push({
        message: "Column requires a 'heading' attribute.",
        range: column.range,
        severity: 2,
        source: "helium-vxml",
      });
    }
  }
}

function unitHasFunction(index: ReturnType<MezWorkspaceService["getIndex"]>, unitName: string, name: string): boolean {
  return index.getUnitFunctions(unitName).some((fn: FunctionDecl) => fn.name === name);
}

function unitHasVariable(index: ReturnType<MezWorkspaceService["getIndex"]>, unitName: string, name: string): boolean {
  return index.getUnitVariables(unitName).some((v: VariableDecl) => v.name === name);
}

function splitQualified(
  raw: string,
  explicitUnit: string | undefined,
  defaultUnit: string | undefined
): { unitName?: string; name: string } {
  if (raw.includes(":")) {
    const [unit, name] = raw.split(":", 2);
    return { unitName: unit, name };
  }
  return { unitName: explicitUnit ?? defaultUnit, name: raw };
}

function resolveUnitVariableType(
  index: ReturnType<MezWorkspaceService["getIndex"]>,
  unitName: string,
  varName: string
): string | null {
  const variable = index.getUnitVariables(unitName).find((v: VariableDecl) => v.name === varName);
  if (!variable) return null;
  return normalizeTypeName(variable.typeName);
}

function resolveUnitFunctionReturnType(
  index: ReturnType<MezWorkspaceService["getIndex"]>,
  unitName: string,
  fnName: string
): string | null {
  const fn = index.getUnitFunctions(unitName).find((f: FunctionDecl) => f.name === fnName);
  if (!fn) return null;
  return normalizeTypeName(fn.returnType);
}

function normalizeTypeName(typeName: string): string {
  return typeName.endsWith("[]") ? typeName.slice(0, -2) : typeName;
}

function objectHasMember(
  index: ReturnType<MezWorkspaceService["getIndex"]>,
  typeName: string,
  member: string
): boolean {
  const members = index.getObjectMembers(typeName);
  return members.includes(member);
}

function resolveCollectionSourceType(
  table: VxmlNode,
  viewUnitName: string | undefined,
  index: ReturnType<MezWorkspaceService["getIndex"]>
): string | null {
  const collection = table.children.find((c) => c.name === "collectionSource");
  if (!collection) return null;
  const fnAttr = getAttr(collection, "function");
  if (fnAttr?.value) {
    const { unitName, name } = splitQualified(fnAttr.value, undefined, viewUnitName);
    if (!unitName) return null;
    return resolveUnitFunctionReturnType(index, unitName, name);
  }
  const varAttr = getAttr(collection, "variable");
  if (varAttr?.value) {
    const { unitName, name } = splitQualified(varAttr.value, undefined, viewUnitName);
    if (!unitName) return null;
    return resolveUnitVariableType(index, unitName, name);
  }
  return null;
}

function findNearestBindingVariable(node: VxmlNode): string | null {
  let cur: VxmlNode | undefined = node.parent;
  while (cur) {
    if (cur.name === "binding" || cur.name === "content") {
      const variable = getAttr(cur, "variable");
      if (variable?.value) return variable.value;
    }
    cur = cur.parent;
  }
  return null;
}

function getAttr(node: VxmlNode, name: string) {
  return node.attributes.find((a) => a.name === name);
}

function findNearest(node: VxmlNode, predicate: (n: VxmlNode) => boolean): VxmlNode | null {
  let cur: VxmlNode | undefined = node.parent;
  while (cur) {
    if (predicate(cur)) return cur;
    cur = cur.parent;
  }
  return null;
}

function flatten(node: VxmlNode): VxmlNode[] {
  const out: VxmlNode[] = [];
  const visit = (n: VxmlNode) => {
    out.push(n);
    for (const child of n.children) visit(child);
  };
  visit(node);
  return out;
}

function findFirst(nodes: VxmlNode[], predicate: (n: VxmlNode) => boolean): VxmlNode | undefined {
  for (const node of nodes) {
    if (predicate(node)) return node;
    const found = findFirst(node.children, predicate);
    if (found) return found;
  }
  return undefined;
}

function getTrimmedText(node: VxmlNode): { value: string | null; range: VxmlRange } {
  const combined = node.textSegments.map((s) => s.text).join("");
  const trimmed = combined.trim();
  if (!trimmed) {
    return { value: null, range: node.range };
  }
  const firstSegment = node.textSegments.find((s) => s.text.trim().length > 0) ?? node.textSegments[0];
  const raw = firstSegment.text;
  const startOffset = raw.indexOf(trimmed);
  if (startOffset !== -1) {
    return {
      value: trimmed,
      range: {
        start: {
          line: firstSegment.range.start.line,
          character: firstSegment.range.start.character + startOffset,
        },
        end: {
          line: firstSegment.range.start.line,
          character: firstSegment.range.start.character + startOffset + trimmed.length,
        },
      },
    };
  }
  return { value: trimmed, range: firstSegment.range };
}

function defaultRange(): VxmlRange {
  return { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } };
}
