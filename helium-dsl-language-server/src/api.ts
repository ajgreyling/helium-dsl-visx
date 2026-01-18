// Stable public API for other in-repo tooling (e.g. MCP server).
// Keep this surface small and versioned to avoid brittle deep-imports.

export { ProjectManager } from "./index/projectManager.js";
export { ProjectIndex } from "./index/projectIndex.js";

export { buildFileAst } from "./ast/builder.js";
export type {
  FileAst,
  ObjectDecl,
  UnitDecl,
  FunctionDecl,
  VariableDecl,
  ParamDecl,
  EnumDecl,
  AttributeDecl,
  RelationshipDecl,
  TypeReference,
  UnitReference,
  FunctionCallReference,
  VariableReference,
  PropertyReference,
} from "./ast/nodes.js";

export { parseText } from "./parser/index.js";
export { createDiagnostics } from "./diagnostics.js";
export { runLints } from "./linter/engine.js";
export { formatDocument, formatOnType } from "./formatting/formatter.js";
export { getLanguageMetadataSync } from "./language/metadata.js";

// LSP-style helpers used by in-repo tooling (e.g. MCP server). Keep this minimal.
export {
  buildSignatureHelpFromLabel,
  findCallAtPosition,
} from "./utils/signatureHelp.js";

export {
  createNoVarInElseFix,
  createNamingConventionFix,
  createForbiddenOperatorFix,
} from "./codeActions/quickFixes.js";

export {
  findFunctionCalls,
  findFunctionDefinition,
} from "./callHierarchy/callHierarchy.js";

