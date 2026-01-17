import { Diagnostic } from "vscode-languageserver";
import { parseText } from "./parser/index.js";

export async function createDiagnostics(text: string): Promise<Diagnostic[]> {
  const { diagnostics } = await parseText(text);
  return diagnostics;
}

