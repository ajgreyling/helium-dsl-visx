import fs from "node:fs";
import path from "node:path";
import { URI } from "vscode-uri";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  ProjectManager,
  ProjectIndex,
  buildFileAst,
  createDiagnostics,
  getLanguageMetadataSync,
  runLints,
  formatDocument,
} from "helium-dsl-language-server/api";
import type {
  AttributeDecl,
  EnumDecl,
  EnumValueDecl,
  FunctionDecl,
  ObjectDecl,
  ParamDecl,
  PropertyReference,
  RelationshipDecl,
  TypeReference,
  UnitDecl,
  UnitReference,
  VariableDecl,
  VariableReference,
  FunctionCallReference,
} from "helium-dsl-language-server/api";

export type WorkspaceRoot = string;

export type MezDiagnostic = {
  message: string;
  range: { start: { line: number; character: number }; end: { line: number; character: number } };
  severity?: number;
  source?: string;
};

export type MezLocation = {
  uri: string;
  range: { start: { line: number; character: number }; end: { line: number; character: number } };
};

export type MezWorkspaceEdit = {
  changes?: Record<string, { range: MezLocation["range"]; newText: string }[]>;
};

export class MezWorkspaceService {
  private readonly projectManager = new ProjectManager();
  private readonly projectIndex: ProjectIndex;

  constructor(private readonly workspaceRoot: WorkspaceRoot) {
    const metadata = getLanguageMetadataSync();
    this.projectIndex = new ProjectIndex(workspaceRoot, metadata);
    this.projectIndex.indexProjectFiles();
    this.projectManager.initialize([
      {
        uri: URI.file(workspaceRoot).toString(),
        name: path.basename(workspaceRoot),
      },
    ]);
  }

  getWorkspaceRoot(): string {
    return this.workspaceRoot;
  }

  private toUri(filePath: string): string {
    return URI.file(filePath).toString();
  }

  private readTextOrThrow(filePath: string): string {
    return fs.readFileSync(filePath, "utf8");
  }

  updateFile(filePath: string, text: string) {
    const uri = this.toUri(filePath);
    const doc = TextDocument.create(uri, "helium-dsl", 1, text);
    this.projectManager.updateDocument(doc);
    this.projectIndex.updateFile(uri, text);
  }

  async validate(filePath: string, textOverride?: string): Promise<MezDiagnostic[]> {
    const text = textOverride ?? this.readTextOrThrow(filePath);
    const parserDiags = createDiagnostics(text) as unknown as MezDiagnostic[];
    const lintDiags = (await runLints(text)) as unknown as MezDiagnostic[];
    return [...parserDiags, ...lintDiags];
  }

  getAstSummary(filePath: string, textOverride?: string) {
    const text = textOverride ?? this.readTextOrThrow(filePath);
    const uri = this.toUri(filePath);
    const ast = buildFileAst(text, uri);
    return {
      uri: ast.uri,
      objects: ast.objects.map((o: ObjectDecl) => ({
        name: o.name,
        isPersistent: o.isPersistent,
        attributes: o.attributes.map((a: AttributeDecl) => ({
          name: a.name,
          typeName: a.typeName,
          isEnum: a.isEnum,
        })),
        relationships: o.relationships.map((r: RelationshipDecl) => ({
          name: r.name,
          targetType: r.targetType,
        })),
      })),
      enums: ast.enums.map((e: EnumDecl) => ({
        name: e.name,
        values: e.values.map((v: EnumValueDecl) => v.name),
      })),
      units: ast.units.map((u: UnitDecl) => ({
        name: u.name,
        variables: u.variables.map((v: VariableDecl) => ({
          name: v.name,
          typeName: v.typeName,
        })),
        functions: u.functions.map((f: FunctionDecl) => ({
          name: f.name,
          returnType: f.returnType,
          params: f.params.map((p: ParamDecl) => ({ name: p.name, typeName: p.typeName })),
          locals: f.locals.map((v: VariableDecl) => ({ name: v.name, typeName: v.typeName })),
        })),
      })),
      references: {
        types: ast.typeReferences.map((r: TypeReference) => r.name),
        units: ast.unitReferences.map((r: UnitReference) => r.name),
        functionCalls: ast.functionCalls.map((r: FunctionCallReference) => ({
          unitName: r.unitName,
          name: r.name,
        })),
        variableRefs: ast.variableReferences.map((r: VariableReference) => ({
          unitName: r.unitName,
          name: r.name,
        })),
        properties: ast.propertyReferences.map((r: PropertyReference) => r.name),
      },
    };
  }

  getSymbols(query?: string) {
    const q = query ?? "";
    return {
      projectRoots: this.projectManager.getProjectRoots(),
      types: this.projectManager.getUserTypes(),
      units: this.projectManager.getUnitNames(),
      workspaceSymbols: this.projectManager.getWorkspaceSymbols(q),
    };
  }

  getIndex(): ProjectIndex {
    return this.projectIndex;
  }

  getDefinition(filePath: string, line: number, character: number): MezLocation[] | null {
    const uri = this.toUri(filePath);
    const res = this.projectManager.getDefinition({
      textDocument: { uri },
      position: { line, character },
    } as any);
    return (res ?? null) as any;
  }

  getReferences(
    filePath: string,
    line: number,
    character: number,
    includeDeclaration: boolean
  ): MezLocation[] {
    const uri = this.toUri(filePath);
    return this.projectManager.getReferences({
      textDocument: { uri },
      position: { line, character },
      context: { includeDeclaration },
    } as any) as any;
  }

  getRenamePreview(
    filePath: string,
    line: number,
    character: number,
    newName: string
  ): MezWorkspaceEdit | null {
    const uri = this.toUri(filePath);
    return this.projectManager.getRenameEdits({
      textDocument: { uri },
      position: { line, character },
      newName,
    } as any) as any;
  }

  format(filePath: string, textOverride?: string): { formattedText: string } {
    const uri = this.toUri(filePath);
    const originalText = textOverride ?? this.readTextOrThrow(filePath);
    const doc = TextDocument.create(uri, "helium-dsl", 1, originalText);
    const edits = formatDocument(doc, { insertSpaces: true, tabSize: 2 } as any);
    const formattedText = applyTextEdits(originalText, edits as any);
    return { formattedText };
  }
}

type TextEdit = { range: MezLocation["range"]; newText: string };

function applyTextEdits(text: string, edits: TextEdit[]): string {
  // LSP text edits are applied from the end of the document backwards.
  const sorted = [...edits].sort((a, b) => {
    const aStart = a.range.start;
    const bStart = b.range.start;
    if (aStart.line !== bStart.line) return bStart.line - aStart.line;
    return bStart.character - aStart.character;
  });

  const lines = text.split(/\r?\n/);
  const offsetAt = (pos: { line: number; character: number }) => {
    let offset = 0;
    for (let i = 0; i < pos.line; i++) offset += (lines[i]?.length ?? 0) + 1;
    return offset + pos.character;
  };

  let out = text;
  for (const e of sorted) {
    const start = offsetAt(e.range.start);
    const end = offsetAt(e.range.end);
    out = out.slice(0, start) + e.newText + out.slice(end);
  }
  return out;
}


