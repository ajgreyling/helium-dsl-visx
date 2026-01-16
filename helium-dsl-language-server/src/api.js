// Stable public API for other in-repo tooling (e.g. MCP server).
// Keep this surface small and versioned to avoid brittle deep-imports.
export { ProjectManager } from "./index/projectManager.js";
export { ProjectIndex } from "./index/projectIndex.js";
export { buildFileAst } from "./ast/builder.js";
export { parseText } from "./parser/index.js";
export { createDiagnostics } from "./diagnostics.js";
export { runLints } from "./linter/engine.js";
export { formatDocument, formatOnType } from "./formatting/formatter.js";
export { getLanguageMetadataSync } from "./language/metadata.js";
