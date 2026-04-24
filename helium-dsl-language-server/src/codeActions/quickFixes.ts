import { CodeAction, TextEdit, Range, Diagnostic } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { CodeActionKind } from "vscode-languageserver";
import type { FileAst } from "../ast/nodes.js";

/**
 * Create a quick fix for no-var-in-else: move variable declaration before if statement
 */
export function createNoVarInElseFix(
  doc: TextDocument,
  diagnostic: Diagnostic,
  text: string
): CodeAction | null {
  const lines = text.split(/\r?\n/);
  const diagnosticLine = diagnostic.range.start.line;
  const diagnosticText = lines[diagnosticLine] || "";

  // Extract variable declaration
  const varMatch = diagnosticText.match(/\b((?:int|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*(?:\[\])?))\s+([a-z][A-Za-z0-9_]*)\s*(=|;)/);
  if (!varMatch) {
    return null;
  }

  const varType = varMatch[1];
  const varName = varMatch[2];
  const assignment = varMatch[3] === "=" ? ` = ${diagnosticText.substring(diagnosticText.indexOf("=") + 1).trim()}` : "";

  // Find the if statement before the else block
  let ifLineIndex = -1;
  let braceDepth = 0;
  let foundElse = false;

  for (let i = diagnosticLine; i >= 0; i--) {
    const line = lines[i] || "";
    
    // Track brace depth
    for (const char of line) {
      if (char === "}") braceDepth++;
      if (char === "{") braceDepth--;
    }

    // Check for else block
    if (/}\s*else\s*{/.test(line.trim()) || /^else\s*{/.test(line.trim())) {
      foundElse = true;
      continue;
    }

    // Find the if statement
    if (foundElse && /if\s*\(/.test(line)) {
      ifLineIndex = i;
      break;
    }
  }

  if (ifLineIndex === -1) {
    return null;
  }

  // Create edit: remove from else block and add before if statement
  const newVarDeclaration = `${varType} ${varName}${assignment};`;
  const ifLine = lines[ifLineIndex] || "";
  const indentMatch = ifLine.match(/^(\s*)/);
  const indent = indentMatch ? indentMatch[1] : "";

  const edits: TextEdit[] = [
    {
      range: diagnostic.range,
      newText: "", // Remove from else block
    },
    {
      range: {
        start: { line: ifLineIndex, character: 0 },
        end: { line: ifLineIndex, character: 0 },
      },
      newText: `${indent}${newVarDeclaration}\n`,
    },
  ];

  return {
    title: `Move variable '${varName}' declaration before if statement`,
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    edit: {
      changes: {
        [doc.uri]: edits,
      },
    },
  };
}

/**
 * Create a quick fix for naming conventions violations
 */
export function createNamingConventionFix(
  doc: TextDocument,
  diagnostic: Diagnostic,
  text: string
): CodeAction | null {
  const lines = text.split(/\r?\n/);
  const diagnosticLine = diagnostic.range.start.line;
  const diagnosticText = lines[diagnosticLine] || "";
  const range = diagnostic.range;

  // Extract the identifier that needs fixing
  const identifier = diagnosticText.substring(range.start.character, range.end.character);
  if (!identifier) {
    return null;
  }

  // Determine what kind of identifier it is and suggest fix
  let fixedName: string | null = null;
  const message = diagnostic.message.toLowerCase();

  if (message.includes("camelcase") || message.includes("variable")) {
    // Variable should be camelCase
    if (/^[A-Z]/.test(identifier)) {
      fixedName = identifier[0].toLowerCase() + identifier.slice(1);
    }
  } else if (message.includes("pascalcase") || message.includes("type") || message.includes("unit")) {
    // Type/Unit should be PascalCase
    if (/^[a-z]/.test(identifier)) {
      fixedName = identifier[0].toUpperCase() + identifier.slice(1);
    }
  }

  if (!fixedName || fixedName === identifier) {
    return null;
  }

  return {
    title: `Rename '${identifier}' to '${fixedName}'`,
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    edit: {
      changes: {
        [doc.uri]: [
          {
            range: range,
            newText: fixedName,
          },
        ],
      },
    },
  };
}

/**
 * Create a quick fix for forbidden operators
 */
export function createForbiddenOperatorFix(
  doc: TextDocument,
  diagnostic: Diagnostic,
  text: string
): CodeAction | null {
  const lines = text.split(/\r?\n/);
  const diagnosticLine = diagnostic.range.start.line;
  const diagnosticText = lines[diagnosticLine] || "";
  const range = diagnostic.range;
  const message = diagnostic.message.toLowerCase();

  let fix: string | null = null;

  if (message.includes("negation") || message.includes("!")) {
    // !var -> var == false
    const match = diagnosticText.substring(range.start.character, range.end.character).match(/!(\w+)/);
    if (match) {
      fix = `${match[1]} == false`;
    }
  } else if (message.includes("ternary")) {
    // Ternary operators are forbidden - suggest if-else
    // This is complex, so we'll just suggest removing it
    return null;
  } else if (message.includes("compound assignment")) {
    // +=, -=, etc. -> explicit assignment
    const match = diagnosticText.substring(range.start.character, range.end.character).match(/(\w+)\s*([+\-*/%])=/);
    if (match) {
      const varName = match[1];
      const op = match[2];
      fix = `${varName} = ${varName} ${op}`;
    }
  } else if (message.includes("boolean") || message.includes("if")) {
    // if (flag) / if (isReady()) -> explicit boolean comparison
    const focusedText = diagnosticText.substring(range.start.character, range.end.character);
    const condition = extractIfCondition(focusedText) ?? extractIfCondition(diagnosticText);
    if (condition && !/==|!=/.test(condition)) {
      fix = `if (${condition.trim()} == true)`;
    }
  }

  if (!fix) {
    return null;
  }

  return {
    title: `Fix: ${diagnosticText.substring(range.start.character, range.end.character)} -> ${fix}`,
    kind: CodeActionKind.QuickFix,
    diagnostics: [diagnostic],
    edit: {
      changes: {
        [doc.uri]: [
          {
            range: range,
            newText: fix,
          },
        ],
      },
    },
  };
}

function extractIfCondition(text: string): string | null {
  const ifIndex = text.indexOf("if");
  if (ifIndex === -1) return null;

  let openParen = ifIndex + 2;
  while (openParen < text.length && /\s/.test(text[openParen] ?? "")) openParen++;
  if (openParen >= text.length || text[openParen] !== "(") return null;

  let depth = 0;
  for (let i = openParen; i < text.length; i++) {
    const char = text[i] ?? "";
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (depth === 0) {
      return text.slice(openParen + 1, i);
    }
  }

  return null;
}

function toLspRange(range: { start: { line: number; character: number }; end: { line: number; character: number } }): Range {
  return Range.create(range.start.line, range.start.character, range.end.line, range.end.character);
}

/**
 * Create a quick fix for unused units: delete the file (only when file contains exactly one unit).
 * Create a quick fix for unused functions: delete the function declaration from the document.
 */
export function createUnusedSymbolDeleteFix(
  doc: TextDocument,
  diagnostic: Diagnostic,
  ast: FileAst
): CodeAction | null {
  if (diagnostic.source !== "helium-dsl-unused") {
    return null;
  }

  const msg = diagnostic.message;

  // Unit: "Unit X is not used anywhere"
  const unitMatch = msg.match(/^Unit\s+(\w+)\s+is not used anywhere$/);
  if (unitMatch) {
    const unitName = unitMatch[1];
    const unit = ast.units?.find((u) => u.name === unitName);
    if (!unit) return null;

    // Only offer "Delete file" when the file contains exactly one unit
    if (ast.units.length !== 1) {
      return null;
    }

    const fileName = doc.uri.split("/").pop() ?? doc.uri.split("\\").pop() ?? "file";
    return {
      title: `Delete file ${fileName}`,
      kind: CodeActionKind.QuickFix,
      diagnostics: [diagnostic],
      edit: {
        documentChanges: [{ kind: "delete", uri: doc.uri }],
      },
    };
  }

  // Function: "Function X:Y is not used anywhere"
  const fnMatch = msg.match(/^Function\s+(\w+):(\w+)\s+is not used anywhere$/);
  if (fnMatch) {
    const unitName = fnMatch[1];
    const fnName = fnMatch[2];
    const unit = ast.units?.find((u) => u.name === unitName);
    const fn = unit?.functions?.find((f) => f.name === fnName);
    if (!unit || !fn) return null;
    if (!fn.bodyRange) return null;

    const lines = doc.getText().split(/\r?\n/);
    const endLine = fn.bodyRange.end.line;
    const hasNextLine = endLine + 1 < lines.length;

    const deleteRange: Range = hasNextLine
      ? Range.create(
          fn.returnTypeRange.start.line,
          fn.returnTypeRange.start.character,
          endLine + 1,
          0
        )
      : Range.create(
          fn.returnTypeRange.start.line,
          fn.returnTypeRange.start.character,
          fn.bodyRange.end.line,
          fn.bodyRange.end.character
        );

    return {
      title: `Delete function ${unitName}:${fnName}`,
      kind: CodeActionKind.QuickFix,
      diagnostics: [diagnostic],
      edit: {
        changes: {
          [doc.uri]: [{ range: deleteRange, newText: "" }],
        },
      },
    };
  }

  return null;
}
