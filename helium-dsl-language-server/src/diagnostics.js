import { parseText } from "./parser/index.js";
export function createDiagnostics(text) {
    const { diagnostics } = parseText(text);
    return diagnostics;
}
