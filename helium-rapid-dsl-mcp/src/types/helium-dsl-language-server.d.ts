declare module "helium-dsl-language-server/api" {
  export class ProjectManager {
    initialize(workspaceFolders: Array<{ uri: string; name?: string }> | null): void;
    updateDocument(doc: any): void;
    getProjectRoots(): string[];
    getUserTypes(): string[];
    getUnitNames(): string[];
    getWorkspaceSymbols(query: string): any[];
    getDefinition(params: any): any;
    getReferences(params: any): any[];
    getRenameEdits(params: any): any;
  }

  export class ProjectIndex {
    constructor(projectRoot: string, metadata: any);
    indexProjectFiles(): void;
    updateFile(uri: string, text: string): void;
    getUnitFunctions(unitName: string): FunctionDecl[];
    getUnitVariables(unitName: string): VariableDecl[];
    getObjectMembers(typeName: string): string[];
    getUnit(unitName: string): UnitDecl | undefined;
    getEnum(enumName: string): EnumDecl | undefined;
  }

  export function buildFileAst(text: string, uri: string): FileAst;
  export function createDiagnostics(text: string): any[];
  export function runLints(text: string): Promise<any[]>;
  export function formatDocument(doc: any, options: any, range?: any): any[];
  export function getLanguageMetadataSync(): any;

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
    elseBlocks: any[];
  };

  export type ObjectDecl = {
    name: string;
    isPersistent: boolean;
    attributes: AttributeDecl[];
    relationships: RelationshipDecl[];
  };

  export type AttributeDecl = {
    name: string;
    typeName: string;
    isEnum: boolean;
  };

  export type RelationshipDecl = {
    name: string;
    targetType: string;
  };

  export type UnitDecl = {
    name: string;
    functions: FunctionDecl[];
    variables: VariableDecl[];
  };

  export type FunctionDecl = {
    name: string;
    returnType: string;
    params: ParamDecl[];
    locals: VariableDecl[];
  };

  export type ParamDecl = {
    name: string;
    typeName: string;
  };

  export type VariableDecl = {
    name: string;
    typeName: string;
  };

  export type EnumDecl = {
    name: string;
    values: EnumValueDecl[];
  };

  export type EnumValueDecl = {
    name: string;
  };

  export type TypeReference = { name: string };
  export type UnitReference = { name: string };
  export type FunctionCallReference = { name: string; unitName?: string };
  export type VariableReference = { name: string; unitName?: string };
  export type PropertyReference = { name: string };
}
