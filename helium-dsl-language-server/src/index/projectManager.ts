import path from "path";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  CompletionItem,
  CompletionItemKind,
  CompletionParams,
  DefinitionParams,
  Diagnostic,
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
import { ensureRapidProjectConfig } from "../projects/rapidProjectConfig.js";
import { ProjectIndex } from "./projectIndex.js";
import { FileAst, FunctionDecl, ObjectDecl } from "../ast/nodes.js";
import { rangeContains } from "../ast/builder.js";

export class ProjectManager {
  private projectRoots: string[] = [];
  private indexes = new Map<string, ProjectIndex>();
  private indexingPromise: Promise<void> | null = null;
  private indexingComplete = false;

  async initialize(
    workspaceFolders: WorkspaceFolder[] | null,
    opts?: { mode?: "blocking" | "background" }
  ) {
    this.indexingComplete = false;
    this.projectRoots = discoverProjectRoots(workspaceFolders);
    const metadata = getLanguageMetadataSync();
    this.indexes.clear();
    
    // Index all projects in parallel (optionally in background)
    const indexingPromises = this.projectRoots.map(async (root) => {
      // Create the marker/config file if missing so subsequent discovery is fast and explicit.
      // Do not overwrite an existing (possibly user-edited) file.
      try {
        ensureRapidProjectConfig(root, { env: "preprod", overwriteInvalid: false });
      } catch {
        // Best-effort only; indexing should still proceed.
      }
      const index = new ProjectIndex(root, metadata);
      // Register immediately so open/change events can update an index even while background indexing runs.
      this.indexes.set(root, index);
      await index.indexProjectFiles();
    });
    
    const all = Promise.all(indexingPromises).then(() => {
      this.indexingComplete = true;
    });
    this.indexingPromise = all;

    if ((opts?.mode ?? "blocking") === "background") {
      all.catch(() => {});
      return;
    }

    await all;
  }

  whenIndexingComplete(): Promise<void> {
    return this.indexingPromise ?? Promise.resolve();
  }

  isIndexingComplete(): boolean {
    return this.indexingComplete;
  }

  getProjectRoots(): string[] {
    return this.projectRoots;
  }

  updateDocument(doc: TextDocument) {
    const index = this.getIndexForUri(doc.uri);
    if (!index) return;
    const fsPath = URI.parse(doc.uri).fsPath;
    // Fire and forget - indexing happens asynchronously
    if (fsPath.endsWith(".mez")) {
      index.updateFile(doc.uri, doc.getText()).catch(() => {});
      return;
    }
    if (fsPath.endsWith(".vxml")) {
      index.updateVxmlFile(doc.uri, doc.getText()).catch(() => {});
      return;
    }
    if (fsPath.endsWith(".lang")) {
      index.updateLangFile(doc.uri, doc.getText()).catch(() => {});
      return;
    }
  }

  removeDocument(uri: string) {
    const index = this.getIndexForUri(uri);
    if (!index) return;
    const fsPath = URI.parse(uri).fsPath;
    if (fsPath.endsWith(".mez")) {
      index.removeFile(uri);
      return;
    }
    if (fsPath.endsWith(".vxml")) {
      index.removeVxmlFile(uri);
      return;
    }
    if (fsPath.endsWith(".lang")) {
      index.removeLangFile(uri);
      return;
    }
  }

  getUserTypes(): string[] {
    const types: string[] = [];
    for (const index of this.indexes.values()) {
      types.push(...index.getObjectNames());
      types.push(...index.getEnums().map((e) => e.name));
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
    const types = this.getUserTypes();
    const isType = types.includes(name);
    return isType;
  }

  isUnit(name: string): boolean {
    return this.getUnitNames().includes(name);
  }

  isEnum(name: string): boolean {
    for (const index of this.indexes.values()) {
      if (index.hasEnum(name)) return true;
    }
    return false;
  }

  hasLangKey(key: string): boolean {
    for (const index of this.indexes.values()) {
      if (index.hasLangKey(key)) return true;
    }
    return false;
  }

  hasUnitFunction(unitName: string, functionName: string): boolean {
    for (const index of this.indexes.values()) {
      const functions = index.getUnitFunctions(unitName);
      if (functions.some((f) => f.name === functionName)) {
        return true;
      }
    }
    return false;
  }

  hasUnitVariable(unitName: string, variableName: string): boolean {
    for (const index of this.indexes.values()) {
      const variables = index.getUnitVariables(unitName);
      if (variables.some((v) => v.name === variableName)) {
        return true;
      }
    }
    return false;
  }

  getVariableType(name: string, uri: string, position: Position): string | null {
    const index = this.getIndexForUri(uri);
    if (!index) return null;
    return index.getVariableType(name, uri, position);
  }

  getObjectDecl(typeName: string, uri?: string): ObjectDecl | null {
    // Prefer the index that owns the file (if provided), else fall back across all indexes.
    if (uri) {
      const index = this.getIndexForUri(uri);
      const obj = index?.getObject(typeName);
      if (obj) return obj;
    }
    for (const index of this.indexes.values()) {
      const obj = index.getObject(typeName);
      if (obj) return obj;
    }
    return null;
  }

  getObjectMembers(typeName: string, uri?: string): string[] {
    if (uri) {
      const index = this.getIndexForUri(uri);
      const members = index?.getObjectMembers(typeName);
      if (members && members.length > 0) return members;
    }
    for (const index of this.indexes.values()) {
      const members = index.getObjectMembers(typeName);
      if (members.length > 0) return members;
    }
    return [];
  }

  getInverseMemberSources(typeName: string, aliasName: string, uri?: string): string[] {
    if (uri) {
      const index = this.getIndexForUri(uri);
      const sources = (index as any)?.getInverseMemberSources?.(typeName, aliasName) as string[] | undefined;
      if (sources && sources.length > 0) return sources;
    }
    for (const index of this.indexes.values()) {
      const sources = (index as any)?.getInverseMemberSources?.(typeName, aliasName) as string[] | undefined;
      if (sources && sources.length > 0) return sources;
    }
    return [];
  }

  getObjectLocation(name: string): Location | null {
    for (const index of this.indexes.values()) {
      const location = index.getObjectLocation(name);
      if (location) {
        return location;
      }
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

  getUnusedWarningsForFile(uri: string, astOverride?: FileAst): Diagnostic[] {
    const index = this.getIndexForUri(uri);
    if (!index) return [];
    return index.getUnusedWarningsForFile(uri, astOverride);
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
        const identifierMatch = beforeDot.match(/([A-Za-z_][A-Za-z0-9_]*)\s*$/);
        if (identifierMatch) {
          const identifier = identifierMatch[1];

          // First: treat it as a variable receiver (e.g. `chatClient.`).
          const variableType = index.getVariableType(identifier, doc.uri, position);
          if (variableType) {
            const baseType = variableType.replace(/\[\]$/, "");

            const enm = index.getEnum(baseType);
            if (enm) {
              return enm.values.map((v) => ({
                label: v.name,
                kind: CompletionItemKind.EnumMember,
              }));
            }

            const properties = index.getObjectMembers(baseType);
            return properties.map((prop) => ({
              label: prop,
              kind: CompletionItemKind.Property,
            }));
          }

          // Second: allow enum-qualified access (e.g. `CHAT_CLIENT.`).
          const enm = index.getEnum(identifier);
          if (enm) {
            return enm.values.map((v) => ({
              label: v.name,
              kind: CompletionItemKind.EnumMember,
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

  getFunctionDeclForSignatureHelp(
    uri: string,
    position: Position,
    functionName: string,
    unitName?: string
  ): FunctionDecl | null {
    // Unit-qualified lookup across all known project indexes
    if (unitName) {
      for (const index of this.indexes.values()) {
        const unit = index.getUnit(unitName);
        if (!unit) continue;
        const fn = unit.functions.find((f) => f.name === functionName);
        if (fn) return fn;
      }
      return null;
    }

    // Unqualified: prefer current unit context
    const index = this.getIndexForUri(uri);
    if (!index) return null;
    const ast = index.getFileAst(uri);
    if (ast) {
      const containingUnit = ast.units.find((unit) =>
        unit.functions.some((fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character))
      );
      if (containingUnit) {
        const fn = containingUnit.functions.find((f) => f.name === functionName);
        if (fn) return fn;
      }
    }

    // Fallback: resolve only if unique within the project index
    const candidates: FunctionDecl[] = [];
    for (const unit of index.getUnits()) {
      const fn = unit.functions.find((f) => f.name === functionName);
      if (fn) candidates.push(fn);
      if (candidates.length > 1) break;
    }
    if (candidates.length === 1) return candidates[0];
    return null;
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
