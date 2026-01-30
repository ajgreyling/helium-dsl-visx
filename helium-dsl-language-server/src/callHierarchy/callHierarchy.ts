import { Location } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { buildFileAst } from "../ast/builder.js";

/**
 * Find function calls in a document
 */
export async function findFunctionCalls(
  doc: TextDocument,
  functionName: string
): Promise<Location[]> {
  const text = doc.getText();
  const calls: Location[] = [];

  const { ast } = await buildFileAst(text, doc.uri);
  for (const ref of ast.functionCalls) {
    if (ref.name !== functionName) continue;
    calls.push({
      uri: doc.uri,
      range: {
        start: ref.nameRange.start,
        end: ref.nameRange.end,
      },
    });
  }

  return calls;
}

/**
 * Find function definition location
 */
export async function findFunctionDefinition(
  doc: TextDocument,
  functionName: string
): Promise<Location | null> {
  const text = doc.getText();
  const { ast } = await buildFileAst(text, doc.uri);
  for (const unit of ast.units) {
    for (const fn of unit.functions) {
      if (fn.name === functionName) {
        return { uri: doc.uri, range: { start: fn.nameRange.start, end: fn.nameRange.end } };
      }
    }
  }
  return null;
}
