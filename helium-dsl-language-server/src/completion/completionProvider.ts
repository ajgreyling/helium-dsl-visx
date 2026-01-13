import {
  CompletionItem,
  CompletionItemKind,
  CompletionParams,
  Position,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { keywords } from "./keywordCompletions.js";
import { loadBifCompletions } from "./bifCompletions.js";
import { buildContextCompletions, getObjectProperties } from "./contextCompletions.js";
import { SymbolTable } from "../symbols/symbolTable.js";
import { WorkspaceIndex } from "../symbols/workspaceIndex.js";

/**
 * Get the type of a variable at a given position
 */
function getVariableType(
  variableName: string,
  position: Position,
  symbolTable: SymbolTable,
  doc: TextDocument
): string | null {
  // Find the most recent declaration of this variable before or at the cursor position
  const relevantSymbols = symbolTable.symbols
    .filter(
      (s) =>
        s.name === variableName &&
        s.kind === "variable" &&
        s.location &&
        s.type &&
        (s.location.line < position.line ||
          (s.location.line === position.line &&
            s.location.character <= position.character))
    )
    .sort((a, b) => {
      // Sort by line (most recent first), then by character
      if (a.location!.line !== b.location!.line) {
        return b.location!.line - a.location!.line;
      }
      return b.location!.character - a.location!.character;
    });

  if (relevantSymbols.length > 0) {
    return relevantSymbols[0].type || null;
  }

  return null;
}

export async function provideCompletions(
  params: CompletionParams,
  symbolTable: SymbolTable,
  doc: TextDocument,
  workspaceIndex: WorkspaceIndex
): Promise<CompletionItem[]> {
  const items: CompletionItem[] = [];
  const position = params.position;

  // Check if this is a dot-triggered completion
  const isDotTriggered = params.context?.triggerCharacter === ".";

  if (isDotTriggered) {
    // Extract the variable name before the dot
    const line = doc.getText().split(/\r?\n/)[position.line] || "";
    const beforeCursor = line.substring(0, position.character);

    // Match pattern: identifier. (where identifier is a variable name)
    // Look backwards from cursor to find the identifier before the dot
    const dotIndex = beforeCursor.lastIndexOf(".");
    if (dotIndex !== -1) {
      const beforeDot = beforeCursor.substring(0, dotIndex).trim();
      // Extract the last identifier (variable name)
      const identifierMatch = beforeDot.match(/([a-z][A-Za-z0-9_]*)\s*$/);
      if (identifierMatch && identifierMatch[1]) {
        const variableName = identifierMatch[1];

        // Get the type of this variable
        const variableType = getVariableType(variableName, position, symbolTable, doc);

        if (variableType) {
          // Remove array brackets for type lookup
          const baseType = variableType.replace(/\[\]$/, "");

          // Check if it's a user-defined type
          if (workspaceIndex.isUserDefinedType(baseType)) {
            // Get properties for this type
            const properties = getObjectProperties(baseType, workspaceIndex);
            properties.forEach((prop) => {
              items.push({
                label: prop,
                kind: CompletionItemKind.Property,
              });
            });

            // Return early with just the properties (don't show keywords/BIFs when dot-triggered)
            return items;
          }
        }
      }
    }
  }

  // Default completions (keywords, BIFs, etc.) - only show when not dot-triggered
  if (!isDotTriggered) {
    keywords.forEach((kw) =>
      items.push({ label: kw, kind: CompletionItemKind.Keyword })
    );

    const bifs = await loadBifCompletions();
    bifs.forEach((b) =>
      items.push({
        label: b.label,
        kind: CompletionItemKind.Function,
        detail: b.detail,
      })
    );

    const contextItems = buildContextCompletions(symbolTable);
    items.push(
      ...contextItems.map((c) => ({
        label: c.label,
        kind: CompletionItemKind.Variable,
      }))
    );
  }

  return items;
}

