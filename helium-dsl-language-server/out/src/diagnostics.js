import { parseText } from "./parser";
export function createDiagnostics(text) {
    const { diagnostics } = parseText(text);
    return diagnostics;
}
