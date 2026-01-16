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
  elseBlocks: SourceRange[];
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
};
