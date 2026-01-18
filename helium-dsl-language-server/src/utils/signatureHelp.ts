import {
  MarkupKind,
  ParameterInformation,
  Position,
  SignatureHelp,
  SignatureInformation,
} from "vscode-languageserver/node.js";

export function buildSignatureHelpFromLabel(
  label: string,
  activeParameter: number,
  documentation?: string
): SignatureHelp {
  const open = label.indexOf("(");
  const close = label.lastIndexOf(")");
  const paramsText =
    open !== -1 && close !== -1 && close > open ? label.slice(open + 1, close) : "";
  const paramParts = paramsText
    ? paramsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const parameters: ParameterInformation[] = paramParts.map((p) => ({
    label: p,
  }));

  const sig: SignatureInformation = {
    label,
    documentation: documentation
      ? { kind: MarkupKind.Markdown, value: documentation }
      : undefined,
    parameters,
  };

  return {
    signatures: [sig],
    activeSignature: 0,
    activeParameter: Math.max(0, Math.min(activeParameter, Math.max(0, parameters.length - 1))),
  };
}

export function findCallAtPosition(
  text: string,
  position: Position
): { callee: string; namespace?: string; openParenOffset: number; activeParameter: number } | null {
  const lines = text.split(/\r?\n/);
  const positionToOffset = (pos: Position): number => {
    let offset = 0;
    for (let i = 0; i < pos.line; i++) offset += (lines[i]?.length ?? 0) + 1;
    offset += pos.character;
    return offset;
  };

  const cursorOffset = positionToOffset(position);
  const maxScanBack = Math.max(0, cursorOffset - 20_000);
  let parenDepth = 0;
  let inString = false;
  let stringChar: string | null = null;

  // Find the nearest unmatched '(' that encloses the cursor (lightweight heuristic).
  let openParenOffset = -1;
  for (let i = cursorOffset - 1; i >= maxScanBack; i--) {
    const ch = text[i];
    if (!ch) continue;
    if (inString) {
      if (ch === stringChar) {
        // naive escape check
        let backslashes = 0;
        for (let k = i - 1; k >= 0 && text[k] === "\\"; k--) backslashes++;
        if (backslashes % 2 === 0) {
          inString = false;
          stringChar = null;
        }
      }
      continue;
    }
    if (ch === "'" || ch === '"') {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (ch === ")") {
      parenDepth++;
      continue;
    }
    if (ch === "(") {
      if (parenDepth === 0) {
        openParenOffset = i;
        break;
      }
      parenDepth = Math.max(0, parenDepth - 1);
    }
  }
  if (openParenOffset === -1) return null;

  // Extract callee + optional namespace (Unit/BIF namespace) before '('.
  let j = openParenOffset - 1;
  while (j >= 0 && /\s/.test(text[j])) j--;
  const end = j + 1;
  while (j >= 0 && /[A-Za-z0-9_]/.test(text[j])) j--;
  const callee = text.slice(j + 1, end);
  if (!callee || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(callee)) return null;

  // Optional namespace before ':'.
  while (j >= 0 && /\s/.test(text[j])) j--;
  let namespace: string | undefined;
  if (j >= 0 && text[j] === ":") {
    j--;
    while (j >= 0 && /\s/.test(text[j])) j--;
    const nsEnd = j + 1;
    while (j >= 0 && /[A-Za-z0-9_]/.test(text[j])) j--;
    const ns = text.slice(j + 1, nsEnd);
    if (ns && /^[A-Za-z_][A-Za-z0-9_]*$/.test(ns)) namespace = ns;
  }

  // Count commas between '(' and cursor at nesting depth 0.
  let activeParameter = 0;
  let depth = 0;
  inString = false;
  stringChar = null;
  for (let i = openParenOffset + 1; i < cursorOffset && i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === stringChar) {
        let backslashes = 0;
        for (let k = i - 1; k >= 0 && text[k] === "\\"; k--) backslashes++;
        if (backslashes % 2 === 0) {
          inString = false;
          stringChar = null;
        }
      }
      continue;
    }
    if (ch === "'" || ch === '"') {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") depth = Math.max(0, depth - 1);
    else if (ch === "," && depth === 0) activeParameter++;
  }

  return { callee, namespace, openParenOffset, activeParameter };
}

