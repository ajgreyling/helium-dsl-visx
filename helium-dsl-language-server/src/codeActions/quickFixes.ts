import { CodeAction, TextEdit, Range, Diagnostic } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { CodeActionKind } from "vscode-languageserver";

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
    // if (flag) -> if (flag == true)
    const match = diagnosticText.match(/if\s*\(\s*(\w+)\s*\)/);
    if (match) {
      fix = `if (${match[1]} == true)`;
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
