import {
  CompletionItem,
  CompletionItemKind,
  CompletionParams,
  Position,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import * as fs from "fs";
import { loadBifCompletions } from "./bifCompletions.js";
import { buildContextCompletions, getObjectProperties } from "./contextCompletions.js";
import { SymbolTable } from "../symbols/symbolTable.js";
import { WorkspaceIndex } from "../symbols/workspaceIndex.js";
import { getLanguageMetadata } from "../language/metadata.js";

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

/**
 * Get all model BIFs (Built-In Functions) available for user-defined types
 */
async function getModelBifCompletions(): Promise<CompletionItem[]> {
  const metadata = await getLanguageMetadata();
  const modelBifs = metadata.modelBifs || [];
  return modelBifs.map((bif) => ({
    label: bif,
    kind: CompletionItemKind.Function,
  }));
}

/**
 * Get completions for a unit (functions and top-level variables)
 */
function getUnitCompletions(
  unitName: string,
  workspaceIndex: WorkspaceIndex
): CompletionItem[] {
  const items: CompletionItem[] = [];

  // Get unit definition
  const unitDefinition = workspaceIndex.findUnitDefinition(unitName);
  if (!unitDefinition) {
    return items;
  }

  // Read file content from disk
  let unitFileContent: string | null = null;
  try {
    const unitFilePath = URI.parse(unitDefinition.uri).fsPath;
    unitFileContent = fs.readFileSync(unitFilePath, "utf8");
  } catch (err) {
    console.error(`[Completion] Error reading unit file for ${unitName}:`, err);
    return items;
  }

  if (!unitFileContent) {
    return items;
  }

  // Parse the file to extract functions and top-level variables
  const lines = unitFileContent.split(/\r?\n/);
  let braceDepth = 0;
  let foundUnit = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if we've reached the unit definition
    const unitMatch = line.match(/\bunit\s+([A-Za-z_][A-Za-z0-9_]*)/);
    if (unitMatch && unitMatch[1] === unitName) {
      foundUnit = true;
      // Unit definition ends with semicolon, so after this line we're in the unit scope
      continue;
    }

    if (!foundUnit) {
      continue;
    }

    // Skip comments
    if (trimmedLine.startsWith("//") || trimmedLine.startsWith("/*")) {
      continue;
    }

    // Skip empty lines
    if (trimmedLine.length === 0) {
      continue;
    }

    // Extract top-level functions and variables: only when braceDepth is 0 (before processing braces on this line)
    // When braceDepth is 0, we're at the top level of the unit
    if (braceDepth === 0) {
      // Extract top-level functions: returnType functionName(
      // Pattern matches: int|void|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|UserDefinedType functionName(
      const functionPattern = /\b(?:int|void|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*)\s+([a-z][A-Za-z0-9_]*)\s*\(/;
      const functionMatch = trimmedLine.match(functionPattern);
      if (functionMatch && functionMatch[1]) {
        const functionName = functionMatch[1];
        // Check if this function is already in items
        if (!items.some((item) => item.label === functionName)) {
          items.push({
            label: functionName,
            kind: CompletionItemKind.Function,
          });
        }
      }

      // Extract top-level variables: type variableName
      // Pattern matches: type variableName = or type variableName;
      const variablePattern = /\b(?:int|bool|string|decimal|uuid|json|jsonarray|date|datetime|bigint|blob|[A-Za-z_][A-Za-z0-9_]*(?:\[\])?)\s+([a-z][A-Za-z0-9_]*)\s*(=|;)/;
      const variableMatch = trimmedLine.match(variablePattern);
      if (variableMatch && variableMatch[1]) {
        const variableName = variableMatch[1];
        // Skip if it's a function parameter (would have been caught by function pattern)
        // Skip if already in items
        if (!items.some((item) => item.label === variableName)) {
          items.push({
            label: variableName,
            kind: CompletionItemKind.Variable,
          });
        }
      }
    }

    // Track brace depth to identify top-level scope (variables outside any function)
    // Update braceDepth AFTER checking for functions/variables
    for (const char of line) {
      if (char === "{") braceDepth++;
      if (char === "}") braceDepth--;
    }
  }

  return items;
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
  // Check if this is a colon-triggered completion
  const isColonTriggered = params.context?.triggerCharacter === ":";

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

  if (isColonTriggered) {
    // Extract the identifier before the colon (unit name or type name)
    const line = doc.getText().split(/\r?\n/)[position.line] || "";
    const beforeCursor = line.substring(0, position.character);

    // Match pattern: Identifier: (where Identifier is a unit name or type name)
    // Look backwards from cursor to find the identifier before the colon
    const colonIndex = beforeCursor.lastIndexOf(":");
    if (colonIndex !== -1) {
      const beforeColon = beforeCursor.substring(0, colonIndex).trim();
      // Extract the last identifier (unit name or type name - starts with uppercase)
      const identifierMatch = beforeColon.match(/([A-Za-z_][A-Za-z0-9_]*)\s*$/);
      if (identifierMatch && identifierMatch[1]) {
        const identifier = identifierMatch[1];

        // Check if it's a unit
        if (workspaceIndex.isUnit(identifier)) {
          const unitCompletions = getUnitCompletions(identifier, workspaceIndex);
          return unitCompletions;
        }

        // Check if it's a user-defined type
        if (workspaceIndex.isUserDefinedType(identifier)) {
          const modelBifCompletions = await getModelBifCompletions();
          return modelBifCompletions;
        }

        // Unknown identifier - return empty array
        return [];
      }
    }
  }

  // Default completions (keywords, BIFs, etc.) - only show when not dot-triggered or colon-triggered
  if (!isDotTriggered && !isColonTriggered) {
    const metadata = await getLanguageMetadata();
    (metadata.keywords || []).forEach((kw) =>
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

