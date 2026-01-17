import path from "path";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  CompletionItem,
  CompletionItemKind,
  CompletionParams,
  DefinitionParams,
  DocumentSymbol,
  Location,
  Position,
  ReferenceParams,
  RenameParams,
  SymbolInformation,
  SymbolKind,
  WorkspaceEdit,
} from "vscode-languageserver/node.js";
import { URI } from "vscode-uri";
import { getLanguageMetadataSync } from "../language/metadata.js";
import { discoverProjectRoots, findProjectRootForFile, WorkspaceFolder } from "../projects/projectDiscovery.js";
import { ProjectIndex } from "./projectIndex.js";
import { FileAst } from "../ast/nodes.js";
import { rangeContains } from "../ast/builder.js";

export class ProjectManager {
  private projectRoots: string[] = [];
  private indexes = new Map<string, ProjectIndex>();

  initialize(workspaceFolders: WorkspaceFolder[] | null) {
    this.projectRoots = discoverProjectRoots(workspaceFolders);
    const metadata = getLanguageMetadataSync();
    this.indexes.clear();
    this.projectRoots.forEach((root) => {
      const index = new ProjectIndex(root, metadata);
      index.indexProjectFiles();
      this.indexes.set(root, index);
    });
    // #region agent log
    (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-symbols-1',hypothesisId:'H1',location:'helium-dsl-language-server/src/index/projectManager.ts:28',message:'project_manager_init',data:{workspaceFolderCount:(workspaceFolders ?? []).length,projectRoots:this.projectRoots,projectRootCount:this.projectRoots.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
  }

  getProjectRoots(): string[] {
    return this.projectRoots;
  }

  updateDocument(doc: TextDocument) {
    const index = this.getIndexForUri(doc.uri);
    if (!index) return;
    // Fire and forget - indexing happens asynchronously
    index.updateFile(doc.uri, doc.getText()).catch(() => {});
  }

  removeDocument(uri: string) {
    const index = this.getIndexForUri(uri);
    if (!index) return;
    index.removeFile(uri);
  }

  getUserTypes(): string[] {
    const types: string[] = [];
    for (const index of this.indexes.values()) {
      types.push(...index.getObjectNames());
    }
    return Array.from(new Set(types));
  }

  getUnitNames(): string[] {
    const units: string[] = [];
    for (const index of this.indexes.values()) {
      units.push(...index.getUnitNames());
    }
    return Array.from(new Set(units));
  }

  getDocumentSymbols(doc: TextDocument): DocumentSymbol[] {
    const index = this.getIndexForUri(doc.uri);
    if (!index) return [];
    const ast = index.getFileAst(doc.uri);
    if (!ast) return [];
    return buildDocumentSymbols(ast);
  }

  getWorkspaceSymbols(query: string): SymbolInformation[] {
    const symbols: SymbolInformation[] = [];
    for (const index of this.indexes.values()) {
      symbols.push(...index.getWorkspaceSymbols(query));
    }
    return symbols;
  }

  isUserDefinedType(name: string): boolean {
    return this.getUserTypes().includes(name);
  }

  isUnit(name: string): boolean {
    return this.getUnitNames().includes(name);
  }

  getObjectLocation(name: string): Location | null {
    for (const index of this.indexes.values()) {
      const location = index.getObjectLocation(name);
      if (location) return location;
    }
    return null;
  }

  getUnitLocation(name: string): Location | null {
    for (const index of this.indexes.values()) {
      const location = index.getUnitLocation(name);
      if (location) return location;
    }
    return null;
  }

  getDefinition(params: DefinitionParams): Location | Location[] | null {
    const index = this.getIndexForUri(params.textDocument.uri);
    if (!index) return null;
    const result = index.resolveDefinitionAt(params.textDocument.uri, params.position);
    return result ? [result] : null;
  }

  getReferences(params: ReferenceParams): Location[] {
    const index = this.getIndexForUri(params.textDocument.uri);
    if (!index) return [];
    const symbol = index.resolveSymbolAt(params.textDocument.uri, params.position);
    if (!symbol) return [];
    return index.findReferences(symbol, params.context.includeDeclaration);
  }

  getRenameEdits(params: RenameParams): WorkspaceEdit | null {
    const index = this.getIndexForUri(params.textDocument.uri);
    if (!index) return null;
    const symbol = index.resolveSymbolAt(params.textDocument.uri, params.position);
    if (!symbol) return null;
    if (index.isReservedIdentifier(symbol.name)) return null;
    if (index.isReservedIdentifier(params.newName)) return null;
    const locations = index.findReferences(symbol, true);
    if (locations.length === 0) return null;
    const changes: WorkspaceEdit["changes"] = {};
    for (const loc of locations) {
      if (!changes[loc.uri]) changes[loc.uri] = [];
      changes[loc.uri]!.push({
        range: loc.range,
        newText: params.newName,
      });
    }
    return { changes };
  }

  async getCompletions(params: CompletionParams, doc: TextDocument): Promise<CompletionItem[]> {
    const index = this.getIndexForUri(doc.uri);
    if (!index) return [];
    const items: CompletionItem[] = [];
    const position = params.position;
    const line = doc.getText().split(/\r?\n/)[position.line] || "";
    const beforeCursor = line.substring(0, position.character);
    const metadata = getLanguageMetadataSync();

    const isDotTriggered = params.context?.triggerCharacter === ".";
    const isColonTriggered = params.context?.triggerCharacter === ":";

    if (isDotTriggered) {
      const dotIndex = beforeCursor.lastIndexOf(".");
      if (dotIndex !== -1) {
        const beforeDot = beforeCursor.substring(0, dotIndex).trim();
        const identifierMatch = beforeDot.match(/([a-z][A-Za-z0-9_]*)\s*$/);
        if (identifierMatch) {
          const variableName = identifierMatch[1];
          const variableType = index.getVariableType(variableName, doc.uri, position);
          if (variableType) {
            const baseType = variableType.replace(/\[\]$/, "");
            const properties = index.getObjectMembers(baseType);
            return properties.map((prop) => ({
              label: prop,
              kind: CompletionItemKind.Property,
            }));
          }
        }
      }
    }

    if (isColonTriggered) {
      const colonIndex = beforeCursor.lastIndexOf(":");
      if (colonIndex !== -1) {
        const beforeColon = beforeCursor.substring(0, colonIndex).trim();
        const identifierMatch = beforeColon.match(/([A-Za-z_][A-Za-z0-9_]*)\s*$/);
        if (identifierMatch) {
          const identifier = identifierMatch[1];
          if (index.getUnitNames().includes(identifier)) {
            const unitFunctions = index.getUnitFunctions(identifier);
            return unitFunctions.map((fn) => ({
              label: fn.name,
              kind: CompletionItemKind.Function,
            }));
          }
          if (index.getObjectNames().includes(identifier)) {
            return (metadata.modelBifs || []).map((bif) => ({
              label: bif,
              kind: CompletionItemKind.Function,
            }));
          }
          return [];
        }
      }
    }

    (metadata.keywords || []).forEach((kw) =>
      items.push({ label: kw, kind: CompletionItemKind.Keyword })
    );
    (metadata.bifFunctions || []).forEach((bif) =>
      items.push({ label: bif, kind: CompletionItemKind.Function })
    );

    const ast = index.getFileAst(doc.uri);
    if (ast) {
      const contextVars = findContextVariables(ast, position);
      contextVars.forEach((name) =>
        items.push({ label: name, kind: CompletionItemKind.Variable })
      );
    }

    return items;
  }

  private getIndexForUri(uri: string): ProjectIndex | null {
    const filePath = URI.parse(uri).fsPath;
    const root = findProjectRootForFile(filePath, this.projectRoots);
    if (!root) return null;
    return this.indexes.get(root) || null;
  }
}

function buildDocumentSymbols(ast: FileAst): DocumentSymbol[] {
  const symbols: DocumentSymbol[] = [];
  ast.objects.forEach((obj) => {
    symbols.push({
      name: obj.name,
      kind: SymbolKind.Class,
      range: toRange(obj.nameRange),
      selectionRange: toRange(obj.nameRange),
      children: [
        ...obj.attributes.map((attr) => ({
          name: attr.name,
          kind: SymbolKind.Property,
          range: toRange(attr.nameRange),
          selectionRange: toRange(attr.nameRange),
        })),
        ...obj.relationships.map((rel) => ({
          name: rel.name,
          kind: SymbolKind.Property,
          range: toRange(rel.nameRange),
          selectionRange: toRange(rel.nameRange),
        })),
      ],
    });
  });
  ast.enums.forEach((enm) => {
    symbols.push({
      name: enm.name,
      kind: SymbolKind.Enum,
      range: toRange(enm.nameRange),
      selectionRange: toRange(enm.nameRange),
      children: enm.values.map((val) => ({
        name: val.name,
        kind: SymbolKind.EnumMember,
        range: toRange(val.nameRange),
        selectionRange: toRange(val.nameRange),
      })),
    });
  });
  ast.units.forEach((unit) => {
    symbols.push({
      name: unit.name,
      kind: SymbolKind.Namespace,
      range: toRange(unit.nameRange),
      selectionRange: toRange(unit.nameRange),
      children: [
        ...unit.functions.map((fn) => ({
          name: fn.name,
          kind: SymbolKind.Function,
          range: toRange(fn.nameRange),
          selectionRange: toRange(fn.nameRange),
        })),
        ...unit.variables.map((v) => ({
          name: v.name,
          kind: SymbolKind.Variable,
          range: toRange(v.nameRange),
          selectionRange: toRange(v.nameRange),
        })),
      ],
    });
  });
  return symbols;
}

function toRange(range: { start: Position; end: Position }) {
  return {
    start: { line: range.start.line, character: range.start.character },
    end: { line: range.end.line, character: range.end.character },
  };
}

function findContextVariables(ast: FileAst, position: Position): string[] {
  const names = new Set<string>();
  const containingUnit = ast.units.find((unit) =>
    unit.functions.some((fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character))
  );
  const containingFn = containingUnit?.functions.find(
    (fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character)
  );
  if (containingFn) {
    containingFn.params.forEach((p) => names.add(p.name));
    containingFn.locals.forEach((v) => names.add(v.name));
  }
  if (containingUnit) {
    containingUnit.variables.forEach((v) => names.add(v.name));
  }
  return Array.from(names);
}
