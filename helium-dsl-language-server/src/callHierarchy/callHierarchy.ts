import { CallHierarchyItem, Location, Range } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { SymbolKind } from "vscode-languageserver";
import { buildSymbolTable } from "../symbols/symbolTable.js";

/**
 * Find function calls in a document
 */
export function findFunctionCalls(
  doc: TextDocument,
  functionName: string
): Location[] {
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const calls: Location[] = [];

  // Pattern to match function calls: functionName( or UnitName:functionName(
  const patterns = [
    new RegExp(`\\b${functionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`, "g"),
    new RegExp(`\\b[A-Z][A-Za-z0-9_]*\\s*:\\s*${functionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`, "g"),
  ];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = pattern.exec(line)) !== null) {
        const matchIndex = match.index;

        // Skip if in comment
        const beforeMatch = line.substring(0, matchIndex);
        const commentIndex = beforeMatch.indexOf("//");
        if (commentIndex !== -1) {
          const beforeComment = beforeMatch.substring(0, commentIndex);
          const singleQuotes = (beforeComment.match(/'/g) || []).length;
          const doubleQuotes = (beforeComment.match(/"/g) || []).length;
          if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0) {
            continue;
          }
        }

        calls.push({
          uri: doc.uri,
          range: {
            start: { line: lineIndex, character: matchIndex },
            end: { line: lineIndex, character: matchIndex + functionName.length },
          },
        });
      }
    }
  }

  return calls;
}

/**
 * Find function definition location
 */
export function findFunctionDefinition(
  doc: TextDocument,
  functionName: string
): Location | null {
  const text = doc.getText();
  const lines = text.split(/\r?\n/);
  const symbolTable = buildSymbolTable(text);

  const funcSymbol = symbolTable.symbols.find(
    (s) => s.name === functionName && s.kind === "function" && s.location
  );

  if (funcSymbol && funcSymbol.location) {
    const line = lines[funcSymbol.location.line] || "";
    const nameStart = funcSymbol.location.character;
    const nameEnd = nameStart + functionName.length;

    return {
      uri: doc.uri,
      range: {
        start: { line: funcSymbol.location.line, character: nameStart },
        end: { line: funcSymbol.location.line, character: nameEnd },
      },
    };
  }

  return null;
}
