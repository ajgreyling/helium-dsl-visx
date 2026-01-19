import fs from "fs";
import path from "path";
import { URI } from "vscode-uri";
import { Location, Position, Range, SymbolInformation, SymbolKind } from "vscode-languageserver/node.js";
import {
  FileAst,
  ObjectDecl,
  UnitDecl,
  EnumDecl,
  FunctionDecl,
  VariableDecl,
  AttributeDecl,
  RelationshipDecl,
  FunctionCallReference,
  TypeReference,
  UnitReference,
  VariableReference,
  PropertyReference,
} from "../ast/nodes.js";
import { buildFileAst, rangeContains } from "../ast/builder.js";
import { SourceRange } from "../ast/span.js";
import { LanguageMetadata } from "../language/metadata.js";
import { buildVxmlAst } from "../vxml/parser.js";
import { VxmlRange, VxmlReference } from "../vxml/types.js";

type ResolvedSymbol = {
  kind: "object" | "unit" | "enum" | "function" | "variable" | "param" | "attribute" | "relationship";
  name: string;
  uri: string;
  range: SourceRange;
  unitName?: string;
  functionName?: string;
  objectName?: string;
};

type SymbolMatch =
  | { type: "declaration"; symbol: ResolvedSymbol }
  | { type: "typeRef"; ref: TypeReference }
  | { type: "unitRef"; ref: UnitReference }
  | { type: "functionRef"; ref: FunctionCallReference }
  | { type: "variableRef"; ref: VariableReference }
  | { type: "propertyRef"; ref: PropertyReference };

export class ProjectIndex {
  private readonly projectRoot: string;
  private readonly metadata: LanguageMetadata;
  private readonly files = new Map<string, FileAst>();
  private readonly vxml = new Map<string, { viewUnitName?: string; references: VxmlReference[] }>();
  private objects = new Map<string, ObjectDecl>();
  private units = new Map<string, UnitDecl>();
  private enums = new Map<string, EnumDecl>();
  private functionsByName = new Map<string, FunctionDecl[]>();
  private isIndexing = false;

  constructor(projectRoot: string, metadata: LanguageMetadata) {
    this.projectRoot = projectRoot;
    this.metadata = metadata;
  }

  getRoot(): string {
    return this.projectRoot;
  }

  getObjectNames(): string[] {
    return Array.from(this.objects.keys());
  }

  getUnitNames(): string[] {
    return Array.from(this.units.keys());
  }

  getObjectMembers(typeName: string): string[] {
    const obj = this.objects.get(typeName);
    if (!obj) return [];
    const names = [
      ...obj.attributes.map((a) => a.name),
      ...obj.relationships.map((r) => r.name),
    ];
    return Array.from(new Set(names));
  }

  getUnitFunctions(unitName: string): FunctionDecl[] {
    const unit = this.units.get(unitName);
    return unit ? unit.functions : [];
  }

  getUnitVariables(unitName: string): VariableDecl[] {
    const unit = this.units.get(unitName);
    return unit ? unit.variables : [];
  }

  getUnit(unitName: string): UnitDecl | undefined {
    return this.units.get(unitName);
  }

  getObject(typeName: string): ObjectDecl | undefined {
    return this.objects.get(typeName);
  }

  getEnum(enumName: string): EnumDecl | undefined {
    return this.enums.get(enumName);
  }

  getUnits(): UnitDecl[] {
    return Array.from(this.units.values());
  }

  getObjects(): ObjectDecl[] {
    return Array.from(this.objects.values());
  }

  getEnums(): EnumDecl[] {
    return Array.from(this.enums.values());
  }

  getVariableType(name: string, uri: string, position: Position): string | null {
    const ast = this.files.get(uri);
    if (!ast) return null;
    const containingUnit = ast.units.find((unit) =>
      unit.functions.some((fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character))
    );
    const containingFn = containingUnit?.functions.find(
      (fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character)
    );
    if (containingFn) {
      const param = containingFn.params.find((p) => p.name === name);
      if (param) return param.typeName;
      const locals = containingFn.locals
        .filter((v) => v.name === name)
        .sort((a, b) => {
          if (a.nameRange.start.line !== b.nameRange.start.line) {
            return b.nameRange.start.line - a.nameRange.start.line;
          }
          return b.nameRange.start.character - a.nameRange.start.character;
        });
      if (locals.length > 0) return locals[0].typeName;
    }
    if (containingUnit) {
      const unitVar = containingUnit.variables.find((v) => v.name === name);
      if (unitVar) return unitVar.typeName;
    }
    return null;
  }

  getFileAst(uri: string): FileAst | undefined {
    return this.files.get(uri);
  }

  async updateFile(uri: string, text: string, skipRebuild?: boolean) {
    const ast = await buildFileAst(text, uri);
    this.files.set(uri, ast);
    // Don't rebuild if explicitly skipped, or if we're in the middle of initial indexing
    // (the final rebuild will happen after all files are indexed)
    
    if (!skipRebuild && !this.isIndexing) {
      this.rebuildIndexes();
    }
  }

  removeFile(uri: string) {
    this.files.delete(uri);
    // Don't rebuild if we're in the middle of initial indexing
    if (!this.isIndexing) {
      this.rebuildIndexes();
    }
  }

  async updateVxmlFile(uri: string, text: string) {
    try {
      const ast = buildVxmlAst(text, uri);
      const references = (ast.references || []).filter(
        (r) =>
          (r.kind === "function" && r.attrName === "function") ||
          (r.kind === "variable" && r.attrName === "variable")
      );
      this.vxml.set(uri, { viewUnitName: ast.view?.unitName, references });
    } catch (err) {
      if (err instanceof Error) {
        console.error(`[ProjectIndex] Error indexing VXML ${uri}: ${err.message}`);
      }
    }
  }

  removeVxmlFile(uri: string) {
    this.vxml.delete(uri);
  }

  async indexFileFromDisk(filePath: string, skipRebuild?: boolean) {
    try {
      const text = fs.readFileSync(filePath, "utf8");
      const uri = URI.file(filePath).toString();
      await this.updateFile(uri, text, skipRebuild);
    } catch (err) {
      // Log parser errors but continue indexing other files
      if (err instanceof Error) {
        console.error(`[ProjectIndex] Error indexing file ${filePath}: ${err.message}`);
      }
      // ignore and continue
    }
  }

  async indexVxmlFileFromDisk(filePath: string) {
    try {
      const text = fs.readFileSync(filePath, "utf8");
      const uri = URI.file(filePath).toString();
      await this.updateVxmlFile(uri, text);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`[ProjectIndex] Error indexing VXML file ${filePath}: ${err.message}`);
      }
      // ignore and continue
    }
  }

  async indexProjectFiles() {
    // Set flag to prevent rebuilds during indexing
    this.isIndexing = true;
    try {
      this.files.clear();
      this.vxml.clear();
      this.objects.clear();
      this.units.clear();
      this.enums.clear();
      this.functionsByName.clear();
      
      // Collect all .mez files first
      const filePaths: string[] = [];
      this.collectMezFiles(this.projectRoot, filePaths);
      
      // Index all files in parallel, but wait for completion
      const indexingPromises = filePaths.map(filePath => 
        this.indexFileFromDisk(filePath, true).catch(err => {
          console.error(`[ProjectIndex] Failed to index ${filePath}:`, err);
          return null; // Continue with other files
        })
      );
      
      await Promise.all(indexingPromises);
      
      // Rebuild indexes after all files are indexed (only once)
      this.rebuildIndexes();

      // Collect and index all .vxml files (for references from views)
      const vxmlPaths: string[] = [];
      this.collectVxmlFiles(this.projectRoot, vxmlPaths);
      const vxmlIndexingPromises = vxmlPaths.map((filePath) =>
        this.indexVxmlFileFromDisk(filePath).catch((err) => {
          console.error(`[ProjectIndex] Failed to index VXML ${filePath}:`, err);
          return null;
        })
      );
      await Promise.all(vxmlIndexingPromises);
    } finally {
      // Always clear the flag, even if indexing fails
      this.isIndexing = false;
    }
    
  }

  private collectMezFiles(dir: string, filePaths: string[]) {
    if (!fs.existsSync(dir)) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          this.collectMezFiles(fullPath, filePaths);
        } else if (entry.isFile() && entry.name.endsWith(".mez")) {
          filePaths.push(fullPath);
        }
      }
    } catch (err) {
      // Ignore directory read errors
    }
  }

  private collectVxmlFiles(dir: string, filePaths: string[]) {
    if (!fs.existsSync(dir)) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          this.collectVxmlFiles(fullPath, filePaths);
        } else if (entry.isFile() && entry.name.endsWith(".vxml")) {
          filePaths.push(fullPath);
        }
      }
    } catch {
      // Ignore directory read errors
    }
  }

  private rebuildIndexes() {
    this.objects = new Map();
    this.units = new Map();
    this.enums = new Map();
    this.functionsByName = new Map();
    for (const ast of this.files.values()) {
      ast.objects.forEach((obj) => {
        this.objects.set(obj.name, obj);
      });
      ast.units.forEach((unit) => {
        this.units.set(unit.name, unit);
        unit.functions.forEach((fn) => {
          // Ensure functions know their owning unit for later resolution.
          if (!fn.unitName) fn.unitName = unit.name;
          if (!this.functionsByName.has(fn.name)) {
            this.functionsByName.set(fn.name, []);
          }
          this.functionsByName.get(fn.name)!.push(fn);
        });
      });
      ast.enums.forEach((enm) => this.enums.set(enm.name, enm));
    }
  }

  getWorkspaceSymbols(query: string): SymbolInformation[] {
    const symbols: SymbolInformation[] = [];
    const lower = query.toLowerCase();
    const addSymbol = (name: string, kind: SymbolKind, uri: string, range: SourceRange) => {
      if (query && !name.toLowerCase().includes(lower)) return;
      symbols.push({
        name,
        kind,
        location: {
          uri,
          range: toLspRange(range),
        },
      });
    };
    for (const [name, obj] of this.objects.entries()) {
      addSymbol(name, SymbolKind.Class, findUriForDecl(obj, this.files), obj.nameRange);
    }
    for (const [name, unit] of this.units.entries()) {
      addSymbol(name, SymbolKind.Class, findUriForDecl(unit, this.files), unit.nameRange);
      unit.functions.forEach((fn) => {
        addSymbol(fn.name, SymbolKind.Function, findUriForDecl(unit, this.files), fn.nameRange);
      });
    }
    for (const [name, enm] of this.enums.entries()) {
      addSymbol(name, SymbolKind.Enum, findUriForDecl(enm, this.files), enm.nameRange);
    }
    return symbols;
  }

  getObjectLocation(typeName: string): Location | null {
    const obj = this.objects.get(typeName);
    if (!obj) return null;
    return {
      uri: findUriForDecl(obj, this.files),
      range: toLspRange(obj.nameRange),
    };
  }

  getUnitLocation(unitName: string): Location | null {
    const unit = this.units.get(unitName);
    if (!unit) return null;
    return {
      uri: findUriForDecl(unit, this.files),
      range: toLspRange(unit.nameRange),
    };
  }

  resolveDefinitionAt(uri: string, position: Position): Location | null {
    const ast = this.files.get(uri);
    if (!ast) {
      return null;
    }
    const match = findSymbolMatch(ast, position);
    if (!match) {
      return null;
    }
    if (match.type === "declaration") {
      return {
        uri,
        range: toLspRange(match.symbol.range),
      };
    }
    const resolved = this.resolveReference(match, uri, position);
    if (!resolved) {
      return null;
    }
    return {
      uri: resolved.uri,
      range: toLspRange(resolved.range),
    };
  }

  resolveSymbolAt(uri: string, position: Position): ResolvedSymbol | null {
    const ast = this.files.get(uri);
    if (!ast) return null;
    const match = findSymbolMatch(ast, position);
    if (!match) return null;
    if (match.type === "declaration") {
      return match.symbol;
    }
    return this.resolveReference(match, uri, position);
  }

  findReferences(symbol: ResolvedSymbol, includeDeclaration: boolean): Location[] {
    const locations: Location[] = [];
    const addVxmlLocation = (uri: string, range: VxmlRange) => {
      locations.push({
        uri,
        range: Range.create(
          range.start.line,
          range.start.character,
          range.end.line,
          range.end.character
        ),
      });
    };
    for (const [uri, ast] of this.files.entries()) {
      const addLocation = (range: SourceRange) => {
        locations.push({ uri, range: toLspRange(range) });
      };
      if (symbol.kind === "object" || symbol.kind === "enum") {
        ast.typeReferences.forEach((ref) => {
          const resolved = this.resolveReference({ type: "typeRef", ref }, uri, ref.nameRange.start);
          if (resolved && resolved.kind === symbol.kind && resolved.name === symbol.name) {
            addLocation(ref.nameRange);
          }
        });
        ast.unitReferences.forEach((ref) => {
          const resolved = this.resolveReference({ type: "unitRef", ref }, uri, ref.nameRange.start);
          if (resolved && resolved.kind === symbol.kind && resolved.name === symbol.name) {
            addLocation(ref.nameRange);
          }
        });
      }
      if (symbol.kind === "unit") {
        ast.unitReferences.forEach((ref) => {
          if (ref.name === symbol.name) {
            addLocation(ref.nameRange);
          }
        });
      }
      if (symbol.kind === "function") {
        ast.functionCalls.forEach((ref) => {
          const resolved = this.resolveReference({ type: "functionRef", ref }, uri, ref.nameRange.start);
          if (resolved && resolved.kind === "function" && resolved.name === symbol.name && resolved.unitName === symbol.unitName) {
            addLocation(ref.nameRange);
          }
        });
      }
      if (symbol.kind === "variable" || symbol.kind === "param") {
        ast.variableReferences.forEach((ref) => {
          const resolved = this.resolveReference({ type: "variableRef", ref }, uri, ref.nameRange.start);
          if (!resolved) return;
          if (resolved.kind === "variable" || resolved.kind === "param") {
            if (
              resolved.name === symbol.name &&
              resolved.functionName === symbol.functionName &&
              resolved.unitName === symbol.unitName
            ) {
              addLocation(ref.nameRange);
            }
          }
        });
      }

      if (symbol.kind === "attribute" || symbol.kind === "relationship") {
        ast.propertyReferences.forEach((ref) => {
          const resolved = this.resolveReference({ type: "propertyRef", ref }, uri, ref.nameRange.start);
          if (!resolved) return;
          if (resolved.kind !== symbol.kind) return;
          if (resolved.name !== symbol.name) return;
          if (symbol.objectName && resolved.objectName !== symbol.objectName) return;
          addLocation(ref.nameRange);
        });
      }
    }

    // Add VXML references for unit functions and unit variables (bindings only)
    if (symbol.kind === "function" && symbol.unitName) {
      for (const [uri, entry] of this.vxml.entries()) {
        for (const ref of entry.references) {
          if (ref.kind !== "function") continue;
          if (ref.attrName !== "function") continue;
          const resolved = resolveVxmlQualified(ref.name, entry.viewUnitName);
          if (!resolved?.unitName || !resolved.memberName) continue;
          if (resolved.unitName !== symbol.unitName) continue;
          if (resolved.memberName !== symbol.name) continue;
          addVxmlLocation(uri, ref.range);
        }
      }
    }

    if (symbol.kind === "variable" && symbol.unitName && !symbol.functionName) {
      for (const [uri, entry] of this.vxml.entries()) {
        for (const ref of entry.references) {
          if (ref.kind !== "variable") continue;
          if (ref.attrName !== "variable") continue;
          const resolved = resolveVxmlQualified(ref.name, entry.viewUnitName);
          if (!resolved?.unitName || !resolved.memberName) continue;
          if (resolved.unitName !== symbol.unitName) continue;
          if (resolved.memberName !== symbol.name) continue;
          addVxmlLocation(uri, ref.range);
        }
      }
    }

    if (includeDeclaration) {
      locations.push({
        uri: symbol.uri,
        range: toLspRange(symbol.range),
      });
    }
    return locations;
  }

  isReservedIdentifier(name: string): boolean {
    return (this.metadata.reservedIdentifiers || []).includes(name);
  }

  isModelBif(name: string): boolean {
    return (this.metadata.modelBifs || []).includes(name);
  }

  private resolveReference(match: SymbolMatch, uri: string, position: Position): ResolvedSymbol | null {
    if (match.type === "typeRef") {
      const typeName = match.ref.name;
      const obj = this.objects.get(typeName);
      if (obj) {
        return {
          kind: "object",
          name: obj.name,
          uri: findUriForDecl(obj, this.files),
          range: obj.nameRange,
        };
      }
      const enm = this.enums.get(typeName);
      if (enm) {
        return {
          kind: "enum",
          name: enm.name,
          uri: findUriForDecl(enm, this.files),
          range: enm.nameRange,
        };
      }
      return null;
    }

    if (match.type === "unitRef") {
      const unit = this.units.get(match.ref.name);
      if (unit) {
        return {
          kind: "unit",
          name: unit.name,
          uri: findUriForDecl(unit, this.files),
          range: unit.nameRange,
        };
      }
      const obj = this.objects.get(match.ref.name);
      if (obj) {
        return {
          kind: "object",
          name: obj.name,
          uri: findUriForDecl(obj, this.files),
          range: obj.nameRange,
        };
      }
      return null;
    }

    if (match.type === "functionRef") {
      if (match.ref.unitName) {
        if (this.isModelBif(match.ref.name)) {
          const obj = this.objects.get(match.ref.unitName);
          if (obj) {
            return {
              kind: "object",
              name: obj.name,
              uri: findUriForDecl(obj, this.files),
              range: obj.nameRange,
            };
          }
        }
        const unit = this.units.get(match.ref.unitName);
        if (!unit) return null;
        const fn = unit.functions.find((f) => f.name === match.ref.name);
        if (!fn) return null;
        return {
          kind: "function",
          name: fn.name,
          uri: findUriForDecl(unit, this.files),
          range: fn.nameRange,
          unitName: unit.name,
        };
      }
      const candidates = this.functionsByName.get(match.ref.name) || [];
      if (candidates.length === 1) {
        const fn = candidates[0];
        const unit = fn.unitName ? this.units.get(fn.unitName) : null;
        return {
          kind: "function",
          name: fn.name,
          uri: unit ? findUriForDecl(unit, this.files) : uri,
          range: fn.nameRange,
          unitName: fn.unitName,
        };
      }
      return null;
    }

    if (match.type === "variableRef") {
      const symbol = resolveVariableReference(
        match.ref,
        this.files.get(uri),
        this.units,
        position
      );
      return symbol;
    }

    if (match.type === "propertyRef") {
      const receiver = match.ref.receiverName;
      if (!receiver) return null;
      const receiverType = this.getVariableType(receiver, uri, position);
      if (!receiverType) return null;
      const baseType = receiverType.replace(/\[\]$/, "");
      const obj = this.objects.get(baseType);
      if (!obj) return null;
      const attr = obj.attributes.find((a) => a.name === match.ref.name);
      if (attr) {
        return {
          kind: "attribute",
          name: attr.name,
          uri: findUriForDecl(obj, this.files),
          range: attr.nameRange,
          objectName: obj.name,
        };
      }
      const rel = obj.relationships.find((r) => r.name === match.ref.name);
      if (rel) {
        return {
          kind: "relationship",
          name: rel.name,
          uri: findUriForDecl(obj, this.files),
          range: rel.nameRange,
          objectName: obj.name,
        };
      }
      return null;
    }

    return null;
  }
}

function toLspRange(range: SourceRange): Range {
  return Range.create(range.start.line, range.start.character, range.end.line, range.end.character);
}

function resolveVxmlQualified(
  raw: string,
  fallbackUnitName: string | undefined
): { unitName: string | null; memberName: string | null } | null {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return null;
  const colon = trimmed.indexOf(":");
  if (colon !== -1) {
    const unitName = trimmed.slice(0, colon).trim();
    const memberName = trimmed.slice(colon + 1).trim();
    return {
      unitName: unitName || null,
      memberName: memberName || null,
    };
  }
  return {
    unitName: fallbackUnitName ?? null,
    memberName: trimmed,
  };
}

function findUriForDecl(decl: ObjectDecl | UnitDecl | EnumDecl, files: Map<string, FileAst>): string {
  for (const [uri, ast] of files.entries()) {
    if (ast.objects.includes(decl as ObjectDecl)) return uri;
    if (ast.units.includes(decl as UnitDecl)) return uri;
    if (ast.enums.includes(decl as EnumDecl)) return uri;
  }
  return "";
}

function findSymbolMatch(ast: FileAst, position: Position): SymbolMatch | null {
  const declMatch = findDeclarationAt(ast, position);
  if (declMatch) {
    return { type: "declaration", symbol: declMatch };
  }

  // Also treat type spans in declarations as type references.
  // The grammar uses `variableType` for variable declarations, which does NOT trigger `enterTypeName`,
  // so these spans won't appear in `ast.typeReferences` unless we match them explicitly here.
  const normalizeTypeName = (name: string) => name.replace(/\[\]$/, "");
  const matchTypeSpan = (name: string, range: SourceRange): SymbolMatch | null => {
    if (!name) return null;
    if (!rangeContains(range, position.line, position.character)) return null;
    const normalized = normalizeTypeName(name);
    const ref: TypeReference = { kind: "TypeReference", name: normalized, nameRange: range };
    return { type: "typeRef", ref };
  };

  for (const obj of ast.objects) {
    for (const attr of obj.attributes) {
      const m = matchTypeSpan(attr.typeName, attr.typeRange);
      if (m) return m;
    }
    for (const rel of obj.relationships) {
      const m = matchTypeSpan(rel.targetType, rel.targetRange);
      if (m) return m;
    }
  }
  for (const unit of ast.units) {
    for (const v of unit.variables) {
      const m = matchTypeSpan(v.typeName, v.typeRange);
      if (m) return m;
    }
    for (const fn of unit.functions) {
      const mRet = matchTypeSpan(fn.returnType, fn.returnTypeRange);
      if (mRet) return mRet;
      for (const p of fn.params) {
        const m = matchTypeSpan(p.typeName, p.typeRange);
        if (m) return m;
      }
      for (const local of fn.locals) {
        const m = matchTypeSpan(local.typeName, local.typeRange);
        if (m) return m;
      }
    }
  }

  for (const ref of ast.typeReferences) {
    if (rangeContains(ref.nameRange, position.line, position.character)) {
      return { type: "typeRef", ref };
    }
  }
  for (const ref of ast.unitReferences) {
    if (rangeContains(ref.nameRange, position.line, position.character)) {
      return { type: "unitRef", ref };
    }
  }
  for (const ref of ast.functionCalls) {
    if (rangeContains(ref.nameRange, position.line, position.character)) {
      return { type: "functionRef", ref };
    }
  }
  for (const ref of ast.variableReferences) {
    if (rangeContains(ref.nameRange, position.line, position.character)) {
      return { type: "variableRef", ref };
    }
  }
  for (const ref of ast.propertyReferences) {
    if (rangeContains(ref.nameRange, position.line, position.character)) {
      return { type: "propertyRef", ref };
    }
  }
  return null;
}

function findDeclarationAt(ast: FileAst, position: Position): ResolvedSymbol | null {
  for (const obj of ast.objects) {
    if (rangeContains(obj.nameRange, position.line, position.character)) {
      return { kind: "object", name: obj.name, uri: ast.uri, range: obj.nameRange };
    }
    for (const attr of obj.attributes) {
      if (rangeContains(attr.nameRange, position.line, position.character)) {
        return {
          kind: "attribute",
          name: attr.name,
          uri: ast.uri,
          range: attr.nameRange,
          objectName: obj.name,
        };
      }
    }
    for (const rel of obj.relationships) {
      if (rangeContains(rel.nameRange, position.line, position.character)) {
        return {
          kind: "relationship",
          name: rel.name,
          uri: ast.uri,
          range: rel.nameRange,
          objectName: obj.name,
        };
      }
    }
  }
  for (const unit of ast.units) {
    if (rangeContains(unit.nameRange, position.line, position.character)) {
      return { kind: "unit", name: unit.name, uri: ast.uri, range: unit.nameRange };
    }
    for (const fn of unit.functions) {
      if (rangeContains(fn.nameRange, position.line, position.character)) {
        return {
          kind: "function",
          name: fn.name,
          uri: ast.uri,
          range: fn.nameRange,
          unitName: unit.name,
        };
      }
      for (const param of fn.params) {
        if (rangeContains(param.nameRange, position.line, position.character)) {
          return {
            kind: "param",
            name: param.name,
            uri: ast.uri,
            range: param.nameRange,
            unitName: unit.name,
            functionName: fn.name,
          };
        }
      }
      for (const local of fn.locals) {
        if (rangeContains(local.nameRange, position.line, position.character)) {
          return {
            kind: "variable",
            name: local.name,
            uri: ast.uri,
            range: local.nameRange,
            unitName: unit.name,
            functionName: fn.name,
          };
        }
      }
    }
    for (const variable of unit.variables) {
      if (rangeContains(variable.nameRange, position.line, position.character)) {
        return {
          kind: "variable",
          name: variable.name,
          uri: ast.uri,
          range: variable.nameRange,
          unitName: unit.name,
        };
      }
    }
  }
  for (const enm of ast.enums) {
    if (rangeContains(enm.nameRange, position.line, position.character)) {
      return { kind: "enum", name: enm.name, uri: ast.uri, range: enm.nameRange };
    }
    for (const value of enm.values) {
      if (rangeContains(value.nameRange, position.line, position.character)) {
        return { kind: "enum", name: value.name, uri: ast.uri, range: value.nameRange };
      }
    }
  }
  return null;
}

function resolveVariableReference(
  ref: VariableReference,
  ast: FileAst | undefined,
  units: Map<string, UnitDecl>,
  position: Position
): ResolvedSymbol | null {
  if (!ast) return null;
  const containingUnit = ast.units.find((unit) =>
    unit.functions.some((fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character))
  );
  const containingFn = containingUnit?.functions.find(
    (fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character)
  );
  if (containingFn) {
    const param = containingFn.params.find((p) => p.name === ref.name);
    if (param) {
      return {
        kind: "param",
        name: param.name,
        uri: ast.uri,
        range: param.nameRange,
        unitName: containingUnit?.name,
        functionName: containingFn.name,
      };
    }
    const locals = containingFn.locals
      .filter((v) => v.name === ref.name)
      .sort((a, b) => {
        if (a.nameRange.start.line !== b.nameRange.start.line) {
          return b.nameRange.start.line - a.nameRange.start.line;
        }
        return b.nameRange.start.character - a.nameRange.start.character;
      });
    if (locals.length > 0) {
      const local = locals[0];
      return {
        kind: "variable",
        name: local.name,
        uri: ast.uri,
        range: local.nameRange,
        unitName: containingUnit?.name,
        functionName: containingFn.name,
      };
    }
  }

  if (ref.unitName) {
    const unit = units.get(ref.unitName);
    if (unit) {
      const unitVar = unit.variables.find((v) => v.name === ref.name);
      if (unitVar) {
        return {
          kind: "variable",
          name: unitVar.name,
          uri: ast.uri,
          range: unitVar.nameRange,
          unitName: unit.name,
        };
      }
    }
  }

  const unit = ast.units[0];
  if (unit) {
    const unitVar = unit.variables.find((v) => v.name === ref.name);
    if (unitVar) {
      return {
        kind: "variable",
        name: unitVar.name,
        uri: ast.uri,
        range: unitVar.nameRange,
        unitName: unit.name,
      };
    }
  }

  return null;
}
