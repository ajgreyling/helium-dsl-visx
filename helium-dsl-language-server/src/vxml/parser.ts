import {
  VxmlAst,
  VxmlAttribute,
  VxmlNode,
  VxmlPosition,
  VxmlRange,
  VxmlReference,
} from "./types.js";
import functionValueNodesData from "../../generated/vxml/function-value-nodes.json" with { type: "json" };

type OffsetRange = { start: number; end: number };

export function buildVxmlAst(text: string, uri: string): VxmlAst {
  const lineStarts = computeLineStarts(text);
  const offsetToPos = (offset: number): VxmlPosition => {
    const line = findLineForOffset(lineStarts, offset);
    const lineStart = lineStarts[line] ?? 0;
    return { line, character: Math.max(0, offset - lineStart) };
  };
  const offsetToRange = (range: OffsetRange): VxmlRange => ({
    start: offsetToPos(range.start),
    end: offsetToPos(range.end),
  });

  const rootNodes: VxmlNode[] = [];
  const stack: VxmlNode[] = [];

  let index = 0;
  while (index < text.length) {
    const lt = text.indexOf("<", index);
    if (lt === -1) {
      appendTextSegment(stack, offsetToRange, text, index, text.length);
      break;
    }
    if (lt > index) {
      appendTextSegment(stack, offsetToRange, text, index, lt);
    }

    if (text.startsWith("<!--", lt)) {
      const end = text.indexOf("-->", lt + 4);
      index = end === -1 ? text.length : end + 3;
      continue;
    }
    if (text.startsWith("<?", lt) || text.startsWith("<!", lt)) {
      const end = findTagEnd(text, lt + 2);
      index = end === -1 ? text.length : end + 1;
      continue;
    }

    const tagEnd = findTagEnd(text, lt + 1);
    if (tagEnd === -1) break;

    const raw = text.slice(lt + 1, tagEnd);
    const trimmed = raw.trim();
    if (!trimmed) {
      index = tagEnd + 1;
      continue;
    }

    const isClosing = trimmed.startsWith("/");
    const isSelfClosing = trimmed.endsWith("/");
    const tagBody = isClosing ? trimmed.slice(1).trim() : trimmed;
    const nameMatch = tagBody.match(/^([A-Za-z_][A-Za-z0-9_\-:]*)/);
    const tagName = nameMatch ? nameMatch[1] : "";
    if (!tagName) {
      index = tagEnd + 1;
      continue;
    }

    if (isClosing) {
      const node = stack.pop();
      if (node) {
        node.range.end = offsetToPos(tagEnd + 1);
      }
      index = tagEnd + 1;
      continue;
    }

    const attrs = parseAttributes(raw, lt + 1, offsetToRange);
    const node: VxmlNode = {
      name: tagName,
      attributes: attrs,
      children: [],
      range: {
        start: offsetToPos(lt),
        end: offsetToPos(tagEnd + 1),
      },
      parent: stack.length ? stack[stack.length - 1] : undefined,
      textSegments: [],
    };

    if (stack.length) {
      stack[stack.length - 1].children.push(node);
    } else {
      rootNodes.push(node);
    }

    if (!isSelfClosing) {
      stack.push(node);
    }

    index = tagEnd + 1;
  }

  const references = collectReferences(rootNodes);
  const view = extractViewInfo(rootNodes);

  return {
    uri,
    rootNodes,
    view,
    references,
  };
}

function computeLineStarts(text: string): number[] {
  const starts = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") {
      starts.push(i + 1);
    }
  }
  return starts;
}

function findLineForOffset(lineStarts: number[], offset: number): number {
  let low = 0;
  let high = lineStarts.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const start = lineStarts[mid];
    const next =
      mid + 1 < lineStarts.length ? lineStarts[mid + 1] : Number.MAX_SAFE_INTEGER;
    if (offset < start) {
      high = mid - 1;
    } else if (offset >= next) {
      low = mid + 1;
    } else {
      return mid;
    }
  }
  return lineStarts.length - 1;
}

function findTagEnd(text: string, start: number): number {
  let inQuote: string | null = null;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inQuote) {
      if (ch === inQuote) inQuote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inQuote = ch;
      continue;
    }
    if (ch === ">") return i;
  }
  return -1;
}

function parseAttributes(
  rawTag: string,
  tagStartOffset: number,
  toRange: (r: OffsetRange) => VxmlRange
): VxmlAttribute[] {
  const attributes: VxmlAttribute[] = [];
  const tagBody = rawTag.replace(/^\s*\/?/, "");
  const nameMatch = tagBody.match(/^([A-Za-z_][A-Za-z0-9_\-:]*)/);
  const afterName = nameMatch ? tagBody.slice(nameMatch[0].length) : tagBody;
  const afterNameOffset = rawTag.indexOf(afterName);
  const attrRegex =
    /([A-Za-z_][A-Za-z0-9_\-:]*)\s*(=\s*("([^"]*)"|'([^']*)'))?/g;
  let match: RegExpExecArray | null;
  while ((match = attrRegex.exec(afterName)) !== null) {
    const attrName = match[1];
    const matchStart = match.index;
    const matchText = match[0];
    const absoluteStart = tagStartOffset + afterNameOffset + matchStart;
    const nameRange = toRange({
      start: absoluteStart,
      end: absoluteStart + attrName.length,
    });
    const value = match[4] ?? match[5];
    let valueRange: VxmlRange | undefined;
    if (value !== undefined) {
      const quoteIndex =
        matchText.indexOf('"') !== -1
          ? matchText.indexOf('"')
          : matchText.indexOf("'");
      const valueStart = absoluteStart + quoteIndex + 1;
      valueRange = toRange({ start: valueStart, end: valueStart + value.length });
    }
    attributes.push({
      name: attrName,
      value,
      nameRange,
      valueRange,
    });
  }
  return attributes;
}

function appendTextSegment(
  stack: VxmlNode[],
  toRange: (r: OffsetRange) => VxmlRange,
  text: string,
  start: number,
  end: number
) {
  if (stack.length === 0) return;
  const content = text.slice(start, end);
  if (!content) return;
  stack[stack.length - 1].textSegments.push({
    text: content,
    range: toRange({ start, end }),
  });
}

function extractViewInfo(nodes: VxmlNode[]): VxmlAst["view"] {
  const viewNode = findFirst(nodes, (n) => n.name === "view");
  if (!viewNode) return undefined;
  const unitAttr = viewNode.attributes.find((a) => a.name === "unit");
  const initAttr = viewNode.attributes.find((a) => a.name === "init");
  const labelAttr = viewNode.attributes.find((a) => a.name === "label");
  return {
    unitName: unitAttr?.value,
    initFunction: initAttr?.value,
    labelKey: labelAttr?.value,
    range: viewNode.range,
  };
}

function collectReferences(nodes: VxmlNode[]): VxmlReference[] {
  const refs: VxmlReference[] = [];
  const allNodes = flatten(nodes);
  for (const node of allNodes) {
    for (const attr of node.attributes) {
      if (!attr.value) continue;
      if (isLangKeyAttr(attr.name)) {
        // Special case: value attributes on function-reference nodes should be function refs
        if (attr.name === "value" && isFunctionValueNode(node.name)) {
          refs.push({
            kind: "function",
            name: attr.value,
            range: attr.valueRange ?? attr.nameRange,
            attrName: attr.name,
            nodeName: node.name,
          });
        } else {
          refs.push({
            kind: "langKey",
            name: attr.value,
            range: attr.valueRange ?? attr.nameRange,
            attrName: attr.name,
          });
        }
      }
      if (attr.name === "unit" && node.name === "view") {
        refs.push({
          kind: "unit",
          name: attr.value,
          range: attr.valueRange ?? attr.nameRange,
        });
      }
      if (attr.name === "init" && node.name === "view") {
        refs.push({
          kind: "function",
          name: attr.value,
          range: attr.valueRange ?? attr.nameRange,
          attrName: attr.name,
          nodeName: node.name,
        });
      }
      if (
        attr.name === "action" &&
        (node.name === "action" || node.name === "rowAction" || node.name === "subMenuItem")
      ) {
        refs.push({
          kind: "function",
          name: attr.value,
          range: attr.valueRange ?? attr.nameRange,
          attrName: attr.name,
          nodeName: node.name,
        });
      }
      if (attr.name === "function" && isFunctionBindingNode(node.name)) {
        refs.push({
          kind: "function",
          name: attr.value,
          range: attr.valueRange ?? attr.nameRange,
          attrName: attr.name,
          nodeName: node.name,
        });
      }
      if (attr.name === "variable" && isVariableBindingNode(node.name)) {
        refs.push({
          kind: "variable",
          name: attr.value,
          range: attr.valueRange ?? attr.nameRange,
          attrName: attr.name,
          nodeName: node.name,
        });
      }
      if (attr.name === "name" && node.name === "attribute") {
        refs.push({
          kind: "attribute",
          name: attr.value,
          range: attr.valueRange ?? attr.nameRange,
        });
      }
      if (attr.name === "name" && node.name === "displayAttribute") {
        refs.push({
          kind: "attribute",
          name: attr.value,
          range: attr.valueRange ?? attr.nameRange,
        });
      }
    }
    if (node.name === "attributeName") {
      const text = getTrimmedText(node);
      if (text.value) {
        refs.push({ kind: "attribute", name: text.value, range: text.range });
      }
    }
    if (node.name === "enum") {
      const text = getTrimmedText(node);
      if (text.value) {
        refs.push({ kind: "enum", name: text.value, range: text.range });
      }
    }
  }
  return refs;
}

function isLangKeyAttr(name: string): boolean {
  return ["label", "title", "heading", "tooltip", "value", "subject", "body"].includes(name);
}

function isFunctionValueNode(nodeName: string): boolean {
  return functionValueNodesData.functionValueNodes.includes(nodeName);
}

function isFunctionBindingNode(name: string): boolean {
  return [
    "binding",
    "visible",
    "collectionSource",
    "content",
    "variant",
    "dynamicUserRoles",
    "dynamicIcon",
    "dynamicLabel",
    "dynamicOrder",
  ].includes(name);
}

function isVariableBindingNode(name: string): boolean {
  return [
    "binding",
    "visible",
    "collectionSource",
    "content",
    "dynamicUserRoles",
    "dynamicIcon",
    "dynamicLabel",
    "dynamicOrder",
  ].includes(name);
}

function getTrimmedText(node: VxmlNode): { value: string | null; range: VxmlRange } {
  const combined = node.textSegments.map((s) => s.text).join("");
  const trimmed = combined.trim();
  if (!trimmed) {
    return { value: null, range: node.range };
  }
  const firstSegment =
    node.textSegments.find((s) => s.text.trim().length > 0) ?? node.textSegments[0];
  const raw = firstSegment.text;
  const startOffset = raw.indexOf(trimmed);
  if (startOffset !== -1) {
    const range: VxmlRange = {
      start: {
        line: firstSegment.range.start.line,
        character: firstSegment.range.start.character + startOffset,
      },
      end: {
        line: firstSegment.range.start.line,
        character: firstSegment.range.start.character + startOffset + trimmed.length,
      },
    };
    return { value: trimmed, range };
  }
  return { value: trimmed, range: firstSegment.range };
}

function flatten(nodes: VxmlNode[]): VxmlNode[] {
  const out: VxmlNode[] = [];
  const visit = (node: VxmlNode) => {
    out.push(node);
    for (const child of node.children) {
      visit(child);
    }
  };
  for (const n of nodes) visit(n);
  return out;
}

function findFirst(
  nodes: VxmlNode[],
  predicate: (n: VxmlNode) => boolean
): VxmlNode | undefined {
  for (const node of nodes) {
    if (predicate(node)) return node;
    const found = findFirst(node.children, predicate);
    if (found) return found;
  }
  return undefined;
}

