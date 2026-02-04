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
export { createSemanticDiagnostics } from "./semantic/diagnostics.js";

export {
  RAPID_PROJECT_FILE_NAME,
  baseUrlForEnvironment,
  defaultRapidProjectConfig,
  ensureRapidProjectConfig,
  getRapidProjectFilePath,
  isRapidProjectRoot,
  readRapidProjectConfig,
} from "./projects/rapidProjectConfig.js";
export type { RapidDebugEnvironment, RapidProjectConfigV1, UnusedDiagnosticSeverity } from "./projects/rapidProjectConfig.js";

// LSP-style helpers used by in-repo tooling (e.g. MCP server). Keep this minimal.
export {
  buildSignatureHelpFromLabel,
  findCallAtPosition,
} from "./utils/signatureHelp.js";

export {
  createNoVarInElseFix,
  createNamingConventionFix,
  createForbiddenOperatorFix,
  createUnusedSymbolDeleteFix,
} from "./codeActions/quickFixes.js";

export {
  findFunctionCalls,
  findFunctionDefinition,
} from "./callHierarchy/callHierarchy.js";

