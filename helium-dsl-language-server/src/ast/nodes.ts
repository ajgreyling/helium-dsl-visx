import { SourceRange } from "./span.js";

export type FileAst = {
  uri: string;
  objects: ObjectDecl[];
  units: UnitDecl[];
  enums: EnumDecl[];
  typeReferences: TypeReference[];
  unitReferences: UnitReference[];
  functionCalls: FunctionCallReference[];
  variableReferences: VariableReference[];
  propertyReferences: PropertyReference[];
  triggerScopes: TriggerScope[];
  elseBlocks: SourceRange[];
};

export type TriggerScope = {
  kind: "TriggerScope";
  scopeName: "before" | "after";
  objectName: string;
  codeBlockRange: SourceRange;
};

export type ObjectDecl = {
  kind: "ObjectDecl";
  name: string;
  nameRange: SourceRange;
  isPersistent: boolean;
  attributes: AttributeDecl[];
  relationships: RelationshipDecl[];
};

export type AttributeDecl = {
  kind: "AttributeDecl";
  name: string;
  nameRange: SourceRange;
  typeName: string;
  typeRange: SourceRange;
  isEnum: boolean;
};

export type RelationshipDecl = {
  kind: "RelationshipDecl";
  name: string;
  nameRange: SourceRange;
  targetType: string;
  targetRange: SourceRange;
  viaName?: string;
  viaRange?: SourceRange;
};

export type UnitDecl = {
  kind: "UnitDecl";
  name: string;
  nameRange: SourceRange;
  functions: FunctionDecl[];
  variables: VariableDecl[];
};

export type FunctionDecl = {
  kind: "FunctionDecl";
  name: string;
  nameRange: SourceRange;
  returnType: string;
  returnTypeRange: SourceRange;
  params: ParamDecl[];
  locals: VariableDecl[];
  bodyRange?: SourceRange;
  unitName?: string;
};

export type ParamDecl = {
  kind: "ParamDecl";
  name: string;
  nameRange: SourceRange;
  typeName: string;
  typeRange: SourceRange;
};

export type VariableDecl = {
  kind: "VariableDecl";
  name: string;
  nameRange: SourceRange;
  declRange: SourceRange;
  typeName: string;
  typeRange: SourceRange;
  scope: "unit" | "function";
  functionName?: string;
  unitName?: string;
  isForeachLoopVariable?: boolean;
  /**
   * True when this variable is the identifier declared by a `catch (...) {}` clause.
   * Catch identifiers are not regular variable declarations and should not be flagged by
   * rules like `no-var-in-else`.
   */
  isCatchVariable?: boolean;
};

export type EnumDecl = {
  kind: "EnumDecl";
  name: string;
  nameRange: SourceRange;
  values: EnumValueDecl[];
};

export type EnumValueDecl = {
  kind: "EnumValueDecl";
  name: string;
  nameRange: SourceRange;
};

export type TypeReference = {
  kind: "TypeReference";
  name: string;
  nameRange: SourceRange;
};

export type UnitReference = {
  kind: "UnitReference";
  name: string;
  nameRange: SourceRange;
};

export type FunctionCallReference = {
  kind: "FunctionCallReference";
  name: string;
  nameRange: SourceRange;
  unitName?: string;
};

export type VariableReference = {
  kind: "VariableReference";
  name: string;
  nameRange: SourceRange;
  unitName?: string;
};

export type PropertyReference = {
  kind: "PropertyReference";
  name: string;
  nameRange: SourceRange;
  receiverName?: string;
  receiverRange?: SourceRange;
};
