import fs from "fs";
import path from "path";
import os from "node:os";
import { URI } from "vscode-uri";
import {
  Diagnostic,
  DiagnosticSeverity,
  Location,
  Position,
  Range,
  SymbolInformation,
  SymbolKind,
} from "vscode-languageserver/node.js";
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
import { readRapidProjectConfig, UnusedDiagnosticSeverity, RapidProjectConfigV1 } from "../projects/rapidProjectConfig.js";

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
  private readonly lang = new Map<string, { keys: Set<string>; values: Map<string, string> }>();
  /** Latest .mez source per URI for translation-key extraction */
  private readonly mezLangKeyRefs = new Map<string, Set<string>>();
  /** Latest .vxml source per URI for label/title/etc. key extraction */
  private readonly vxmlText = new Map<string, string>();
  /** Project-wide keys referenced from .mez (String:translate) and .vxml (label-like attrs) */
  private referencedLangKeys = new Set<string>();
  private objects = new Map<string, ObjectDecl>();
  private units = new Map<string, UnitDecl>();
  private enums = new Map<string, EnumDecl>();
  private functionsByName = new Map<string, FunctionDecl[]>();
  // Inverse relationship members derived from `via <alias>`:
  // targetType -> (aliasName -> set(sourceType))
  private inverseMembers = new Map<string, Map<string, Set<string>>>();
  // Project-wide usage counts (rebuilt alongside symbol indexes).
  private unitUsage = new Map<string, number>();
  // unitName -> (functionName -> count)
  private functionUsage = new Map<string, Map<string, number>>();
  // objectName -> (memberName -> count) where memberName is an attribute or relationship name
  private memberUsage = new Map<string, Map<string, number>>();
  /** Declared object (model) type name -> count of references from .mez type positions (see rebuildUsageIndexes). */
  private objectModelUsage = new Map<string, number>();
  private isIndexing = false;
  private cachedConfig: RapidProjectConfigV1 | null = null;

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
      ...(this.getInverseMemberNames(typeName) ?? []),
    ];
    return Array.from(new Set(names));
  }

  getInverseMemberNames(targetType: string): string[] {
    const m = this.inverseMembers.get(targetType);
    if (!m) return [];
    return Array.from(m.keys());
  }

  getInverseMemberSources(targetType: string, aliasName: string): string[] {
    const m = this.inverseMembers.get(targetType);
    const s = m?.get(aliasName);
    if (!s) return [];
    return Array.from(s);
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

  hasEnum(enumName: string): boolean {
    return this.enums.has(enumName);
  }

  hasLangKey(key: string): boolean {
    if (!key) return false;
    for (const entry of this.lang.values()) {
      if (entry.keys.has(key)) return true;
    }
    return false;
  }

  getLangValue(key: string): string | null {
    if (!key) return null;
    for (const entry of this.lang.values()) {
      const value = entry.values.get(key);
      if (value !== undefined) return value;
    }
    return null;
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

    // Helper function to check if position a is before or equal to position b
    const positionLeq = (
      a: { line: number; character: number },
      b: { line: number; character: number }
    ): boolean => {
      return a.line < b.line || (a.line === b.line && a.character <= b.character);
    };

    // Trigger pseudo-scope variables inside model triggers:
    // - `before` is available in beforeCreate/beforeUpdate/beforeDelete code blocks
    // - `after` is available in afterCreate/afterUpdate/afterDelete code blocks,
    //   and also in beforeUpdate (alongside `before`)
    if (name === "before" || name === "after") {
      const scopes = (ast as any).triggerScopes as any[] | undefined;
      if (scopes && scopes.length > 0) {
        const match = scopes.find(
          (s) =>
            s?.scopeName === name &&
            s?.codeBlockRange &&
            rangeContains(s.codeBlockRange, position.line, position.character)
        );
        if (match?.objectName) {
          return match.objectName;
        }
      }
    }

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
        .filter((v) => {
          // Only include variables declared before or at the usage position
          if (v.name !== name) return false;
          const declStart = v.declRange?.start;
          if (!declStart) return true; // If no declRange, include it (shouldn't happen, but be safe)
          return positionLeq(declStart, position);
        })
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
    const { ast } = await buildFileAst(text, uri);
    this.files.set(uri, ast);
    this.mezLangKeyRefs.set(uri, extractTranslateKeysFromMez(text));
    // Don't rebuild if explicitly skipped, or if we're in the middle of initial indexing
    // (the final rebuild will happen after all files are indexed)
    
    if (!skipRebuild && !this.isIndexing) {
      this.rebuildIndexes();
    }
  }

  removeFile(uri: string) {
    this.files.delete(uri);
    this.mezLangKeyRefs.delete(uri);
    // Don't rebuild if we're in the middle of initial indexing
    if (!this.isIndexing) {
      this.rebuildIndexes();
    }
  }

  async updateVxmlFile(uri: string, text: string) {
    try {
      const ast = buildVxmlAst(text, uri);
      // Keep all extracted references so features can evolve without re-indexing VXML.
      // (Existing consumers further filter by kind/attrName as needed.)
      const references = ast.references || [];
      this.vxml.set(uri, { viewUnitName: ast.view?.unitName, references });
      this.vxmlText.set(uri, text);
      // Usage (unused warnings) depends on VXML bindings too.
      if (!this.isIndexing) {
        this.rebuildUsageIndexes();
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(`[ProjectIndex] Error indexing VXML ${uri}: ${err.message}`);
      }
    }
  }

  removeVxmlFile(uri: string) {
    this.vxml.delete(uri);
    this.vxmlText.delete(uri);
    if (!this.isIndexing) {
      this.rebuildUsageIndexes();
    }
  }

  async updateLangFile(uri: string, text: string) {
    try {
      const values = parseLangEntries(text);
      const keys = new Set(values.keys());
      this.lang.set(uri, { keys, values });
    } catch (err) {
      if (err instanceof Error) {
        console.error(`[ProjectIndex] Error indexing LANG ${uri}: ${err.message}`);
      }
    }
  }

  removeLangFile(uri: string) {
    this.lang.delete(uri);
  }

  async indexFileFromDisk(filePath: string, skipRebuild?: boolean) {
    try {
      const tRead0 = Date.now();
      const text = await fs.promises.readFile(filePath, "utf8");
      const readMs = Date.now() - tRead0;
      const uri = URI.file(filePath).toString();
      const tParse0 = Date.now();
      await this.updateFile(uri, text, skipRebuild);
      const parseMs = Date.now() - tParse0;
      return { readMs, parseMs };
    } catch (err) {
      // Log parser errors but continue indexing other files
      if (err instanceof Error) {
        console.error(`[ProjectIndex] Error indexing file ${filePath}: ${err.message}`);
      }
      // ignore and continue
    }
    return { readMs: 0, parseMs: 0 };
  }

  async indexLangFileFromDisk(filePath: string) {
    try {
      const text = await fs.promises.readFile(filePath, "utf8");
      const uri = URI.file(filePath).toString();
      await this.updateLangFile(uri, text);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`[ProjectIndex] Error indexing LANG file ${filePath}: ${err.message}`);
      }
      // ignore and continue
    }
  }

  async indexVxmlFileFromDisk(filePath: string) {
    try {
      const text = await fs.promises.readFile(filePath, "utf8");
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
      this.vxmlText.clear();
      this.mezLangKeyRefs.clear();
      this.lang.clear();
      this.objects.clear();
      this.units.clear();
      this.enums.clear();
      this.functionsByName.clear();
      
      // Collect all .mez files first
      const filePaths: string[] = [];
      this.collectMezFiles(this.projectRoot, filePaths);
      
      // Index all files in parallel, but wait for completion
      const concurrency = Math.max(2, Math.min(16, (os.cpus()?.length ?? 4)));
      const nextIndex = { value: 0 };
      let totalReadMs = 0;
      let totalParseMs = 0;
      let maxParseMs = 0;
      let maxParseFile = "";
      let maxReadMs = 0;
      let maxReadFile = "";
      const workers = Array.from({ length: concurrency }, async () => {
        while (nextIndex.value < filePaths.length) {
          const idx = nextIndex.value++;
          const filePath = filePaths[idx];
          try {
            const res = await this.indexFileFromDisk(filePath, true);
            totalReadMs += res.readMs;
            totalParseMs += res.parseMs;
            if (res.parseMs > maxParseMs) {
              maxParseMs = res.parseMs;
              maxParseFile = filePath.split(path.sep).slice(-3).join(path.sep);
            }
            if (res.readMs > maxReadMs) {
              maxReadMs = res.readMs;
              maxReadFile = filePath.split(path.sep).slice(-3).join(path.sep);
            }
          } catch (err) {
            console.error(`[ProjectIndex] Failed to index ${filePath}:`, err);
            // continue
          }
        }
      });
      await Promise.all(workers);
      
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
      // VXML indexing happens after `rebuildIndexes()`, so refresh usage counts once.
      this.rebuildUsageIndexes();

      // Collect and index all .lang files (language / translation keys)
      const langPaths: string[] = [];
      this.collectLangFiles(this.projectRoot, langPaths);
      const langIndexingPromises = langPaths.map((filePath) =>
        this.indexLangFileFromDisk(filePath).catch((err) => {
          console.error(`[ProjectIndex] Failed to index LANG ${filePath}:`, err);
          return null;
        })
      );
      await Promise.all(langIndexingPromises);
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

  private collectLangFiles(dir: string, filePaths: string[]) {
    if (!fs.existsSync(dir)) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          this.collectLangFiles(fullPath, filePaths);
        } else if (entry.isFile() && entry.name.endsWith(".lang")) {
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
    this.inverseMembers = new Map();
    this.unitUsage = new Map();
    this.functionUsage = new Map();
    this.memberUsage = new Map();
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

    // Build inverse relationship members from `via <alias>` annotations.
    for (const obj of this.objects.values()) {
      for (const rel of obj.relationships) {
        const aliasName = (rel as any).viaName as string | undefined;
        if (!aliasName) continue;
        const targetType = rel.targetType;
        if (!targetType) continue;
        if (!this.inverseMembers.has(targetType)) this.inverseMembers.set(targetType, new Map());
        const byAlias = this.inverseMembers.get(targetType)!;
        if (!byAlias.has(aliasName)) byAlias.set(aliasName, new Set());
        byAlias.get(aliasName)!.add(obj.name);
      }
    }

    // Rebuild usage indexes once symbol indexes are stable.
    this.rebuildUsageIndexes();
  }

  private incUsage(map: Map<string, number>, key: string, delta = 1) {
    if (!key) return;
    map.set(key, (map.get(key) ?? 0) + delta);
  }

  private incNestedUsage(map: Map<string, Map<string, number>>, outer: string, inner: string, delta = 1) {
    if (!outer || !inner) return;
    if (!map.has(outer)) map.set(outer, new Map());
    const innerMap = map.get(outer)!;
    innerMap.set(inner, (innerMap.get(inner) ?? 0) + delta);
  }

  private getNestedUsage(map: Map<string, Map<string, number>>, outer: string, inner: string): number {
    return map.get(outer)?.get(inner) ?? 0;
  }

  /** Count a reference to a declared object type (strip array suffix). Ignores primitives/enums/units. */
  private recordObjectModelTypeReference(typeName: string) {
    const base = typeName.replace(/\[\]$/, "").trim();
    if (!base || !this.objects.has(base)) return;
    this.incUsage(this.objectModelUsage, base);
  }

  private rebuildUsageIndexes() {
    this.unitUsage.clear();
    this.functionUsage.clear();
    this.memberUsage.clear();
    this.objectModelUsage.clear();

    this.referencedLangKeys.clear();
    for (const keys of this.mezLangKeyRefs.values()) {
      for (const k of keys) {
        if (k) {
          this.referencedLangKeys.add(k);
        }
      }
    }
    for (const xml of this.vxmlText.values()) {
      for (const k of extractLangKeysFromVxml(xml)) {
        this.referencedLangKeys.add(k);
      }
    }

    // Functions that can be invoked by the platform (entrypoints) should be treated as “used”
    // even when there is no static call site in the project.
    //
    // These names correspond to the grammar’s `functionAnnotation` alternatives and are stored
    // in the AST without the leading '@' (see `ast/builder.ts`).
    const entrypointAnnotations = new Set<string>([
      "receivesms",
      "test",
      "ussd",
      "scheduled",
      "inviteuser",
      "rolename",
      "onpaymentupdate",
      "onscheduledfunctionresultupdate",
      "onsmsresultupdate",
      "onpaymentstatusrequestresultupdate",
      "post",
      "get",
      "put",
      "delete",
      // These typically decorate API functions alongside @POST/@GET, but treating them as entrypoints
      // avoids false positives if used alone.
      "responseexpand",
      "responseexclude",
    ]);

    const isInRange = (range: SourceRange | undefined, pos: Position): boolean => {
      if (!range) return false;
      return rangeContains(range, pos.line, pos.character);
    };

    const findContainingUnitName = (ast: FileAst, pos: Position): string | null => {
      for (const unit of ast.units) {
        for (const fn of unit.functions) {
          if (isInRange(fn.bodyRange, pos)) return unit.name;
        }
      }
      return null;
    };

    // 0) Seed usage for platform entrypoints (annotated functions) so they don't warn as unused.
    for (const unit of this.units.values()) {
      for (const fn of unit.functions || []) {
        const anns = ((fn as any)?.annotations as string[] | undefined) ?? [];
        const isEntrypoint = anns.some((a) => entrypointAnnotations.has(String(a).toLowerCase()));
        if (!isEntrypoint) continue;
        this.incNestedUsage(this.functionUsage, unit.name, fn.name, 1);
        this.incUsage(this.unitUsage, unit.name, 1);
      }
    }

    // 1) Count usages from Helium DSL ASTs (.mez)
    for (const [uri, ast] of this.files.entries()) {
      // Object/model type references: any type position that names another declared object (attributes,
      // relationships, locals, params, return types, and grammar paths that populate typeReferences).
      for (const ref of ast.typeReferences || []) {
        this.recordObjectModelTypeReference(ref.name);
      }
      for (const o of ast.objects || []) {
        for (const attr of o.attributes || []) {
          this.recordObjectModelTypeReference(attr.typeName);
        }
        for (const rel of o.relationships || []) {
          if (rel.targetType) {
            this.recordObjectModelTypeReference(rel.targetType);
          }
        }
      }
      for (const u of ast.units || []) {
        for (const v of u.variables || []) {
          this.recordObjectModelTypeReference(v.typeName);
        }
        for (const fn of u.functions || []) {
          this.recordObjectModelTypeReference(fn.returnType);
          for (const p of fn.params || []) {
            this.recordObjectModelTypeReference(p.typeName);
          }
          for (const local of fn.locals || []) {
            this.recordObjectModelTypeReference(local.typeName);
          }
        }
      }

      // Units referenced in `Unit:member(...)` constructs.
      for (const ref of ast.unitReferences || []) {
        if (this.units.has(ref.name)) {
          this.incUsage(this.unitUsage, ref.name);
        }
      }

      // Function calls
      for (const call of ast.functionCalls || []) {
        if (!call?.name) continue;
        const pos = call?.nameRange?.start as Position | undefined;
        if (!pos) continue;

        if (call.unitName) {
          // Only count as a unit function usage when the namespace resolves to a unit.
          if (this.units.has(call.unitName)) {
            this.incNestedUsage(this.functionUsage, call.unitName, call.name);
          }
          continue;
        }

        // Unqualified call: prefer containing unit scope first, then fall back to unique global match.
        const containingUnitName = findContainingUnitName(ast, pos);
        if (containingUnitName) {
          const unit = this.units.get(containingUnitName);
          if (unit && unit.functions.some((f) => f.name === call.name)) {
            this.incNestedUsage(this.functionUsage, containingUnitName, call.name);
            continue;
          }
        }

        const candidates = this.functionsByName.get(call.name) || [];
        if (candidates.length === 1) {
          const fn = candidates[0];
          if (fn?.unitName && this.units.has(fn.unitName)) {
            this.incNestedUsage(this.functionUsage, fn.unitName, fn.name);
          }
        }
      }

      // Property references -> object members
      for (const ref of ast.propertyReferences || []) {
        const receiver = ref?.receiverName;
        const member = ref?.name;
        const pos = ref?.nameRange?.start as Position | undefined;
        if (!receiver || !member || !pos) continue;
        const receiverType = this.getVariableType(receiver, uri, pos);
        if (!receiverType) continue;
        const baseType = receiverType.replace(/\[\]$/, "");
        const obj = this.objects.get(baseType);
        if (!obj) continue;
        // Only count members that exist on this object (attributes, relationships, inverse alias members).
        const memberNames = new Set(this.getObjectMembers(baseType));
        if (!memberNames.has(member)) continue;
        this.incNestedUsage(this.memberUsage, baseType, member);
      }
    }

    // If a relationship is only used via its inverse `via <alias>` member, treat the relationship itself as used.
    // Example: `Patient.appointments` declared with `via patient` and code uses `Appointment.patient`.
    for (const sourceObj of this.objects.values()) {
      for (const rel of sourceObj.relationships || []) {
        const aliasName = (rel as any).viaName as string | undefined;
        if (!aliasName) continue;
        const targetType = (rel as any).targetType as string | undefined;
        if (!targetType) continue;
        const aliasCount = this.getNestedUsage(this.memberUsage, targetType, aliasName);
        if (aliasCount > 0) {
          this.incNestedUsage(this.memberUsage, sourceObj.name, rel.name, aliasCount);
        }
      }
    }

    // 2) Count usages from VXML bindings (units/functions)
    for (const entry of this.vxml.values()) {
      const viewUnitName = entry.viewUnitName;
      if (viewUnitName && this.units.has(viewUnitName)) {
        this.incUsage(this.unitUsage, viewUnitName);
      }

      for (const ref of entry.references || []) {
        if (ref.kind !== "function") continue;
        const resolved = resolveVxmlQualified(ref.name, entry.viewUnitName);
        if (!resolved?.unitName || !resolved.memberName) continue;
        if (!this.units.has(resolved.unitName)) continue;
        this.incNestedUsage(this.functionUsage, resolved.unitName, resolved.memberName);
        this.incUsage(this.unitUsage, resolved.unitName);
      }
    }

    // 2b) View lifecycle: platform calls destroy() on teardown; treat as used for view units.
    for (const entry of this.vxml.values()) {
      const viewUnitName = entry.viewUnitName;
      if (viewUnitName && this.units.has(viewUnitName)) {
        this.incNestedUsage(this.functionUsage, viewUnitName, "destroy", 1);
      }
    }
  }

  private getProjectConfig(): RapidProjectConfigV1 | null {
    if (this.cachedConfig === null) {
      this.cachedConfig = readRapidProjectConfig(this.projectRoot);
    }
    return this.cachedConfig;
  }

  private severityStringToDiagnosticSeverity(severity: UnusedDiagnosticSeverity | undefined): DiagnosticSeverity | null {
    switch (severity) {
      case "None":
        return null;
      case "Info":
        return DiagnosticSeverity.Information;
      case "Warning":
        return DiagnosticSeverity.Warning;
      case "Error":
        return DiagnosticSeverity.Error;
      default:
        // Default fallback: use Information (current behavior)
        return DiagnosticSeverity.Information;
    }
  }

  private getUnusedSeverityConfig(): {
    attributes: DiagnosticSeverity | null;
    functions: DiagnosticSeverity | null;
    units: DiagnosticSeverity | null;
    languageEntries: DiagnosticSeverity | null;
    models: DiagnosticSeverity | null;
  } {
    const config = this.getProjectConfig();
    const unusedConfig = config?.diagnostics?.unused;

    // Defaults if config is missing
    const defaultAttributes: UnusedDiagnosticSeverity = "None";
    const defaultFunctions: UnusedDiagnosticSeverity = "Warning";
    const defaultUnits: UnusedDiagnosticSeverity = "Warning";
    const defaultLanguageEntries: UnusedDiagnosticSeverity = "Info";
    const defaultModels: UnusedDiagnosticSeverity = "Info";

    return {
      attributes: this.severityStringToDiagnosticSeverity(unusedConfig?.attributes ?? defaultAttributes),
      functions: this.severityStringToDiagnosticSeverity(unusedConfig?.functions ?? defaultFunctions),
      units: this.severityStringToDiagnosticSeverity(unusedConfig?.units ?? defaultUnits),
      languageEntries: this.severityStringToDiagnosticSeverity(
        unusedConfig?.languageEntries ?? defaultLanguageEntries
      ),
      models: this.severityStringToDiagnosticSeverity(unusedConfig?.models ?? defaultModels),
    };
  }

  /**
   * Functions bound from VXML (action=, init=, visible function=, etc.) should not warn as unused.
   * Re-parse matching .vxml from disk so diagnostics stay correct when in-memory VXML index missed
   * a file (parse failure, race) or tooling validates without a full index refresh.
   */
  private buildVxmlDiskUsageMapForUnits(unitNames: Set<string>): Map<string, Set<string>> {
    const result = new Map<string, Set<string>>();
    for (const u of unitNames) {
      result.set(u, new Set());
    }
    if (unitNames.size === 0) {
      return result;
    }
    const paths: string[] = [];
    this.collectVxmlFiles(this.projectRoot, paths);
    for (const filePath of paths) {
      let text: string;
      try {
        text = fs.readFileSync(filePath, "utf8");
      } catch {
        continue;
      }
      for (const unitName of unitNames) {
        if (
          !text.includes(`unit="${unitName}"`) &&
          !text.includes(`unit='${unitName}'`)
        ) {
          continue;
        }
        try {
          const vxmlAst = buildVxmlAst(text, URI.file(filePath).toString());
          const boundUnit = vxmlAst.view?.unitName;
          if (boundUnit !== unitName) {
            continue;
          }
          const set = result.get(unitName);
          if (!set) {
            continue;
          }
          for (const ref of vxmlAst.references || []) {
            if (ref.kind !== "function") {
              continue;
            }
            const r = resolveVxmlQualified(ref.name, unitName);
            if (r?.unitName === unitName && r?.memberName) {
              set.add(r.memberName);
            }
          }
          // Implicit lifecycle usage for view-bound units.
          set.add("destroy");
        } catch {
          continue;
        }
      }
    }
    return result;
  }

  private getUnusedLangEntryDiagnostics(uri: string, langFileText?: string): Diagnostic[] {
    const severity = this.getUnusedSeverityConfig().languageEntries;
    if (severity === null) {
      return [];
    }

    let text = "";
    if (langFileText !== undefined && langFileText !== null) {
      text = langFileText;
    } else {
      try {
        text = fs.readFileSync(URI.parse(uri).fsPath, "utf8");
      } catch {
        text = "";
      }
    }
    if (text === "") {
      return [];
    }

    const warnings: Diagnostic[] = [];
    for (const { key, range } of parseLangFileKeyEntries(text)) {
      if (key === "" || this.referencedLangKeys.has(key)) {
        continue;
      }
      warnings.push({
        message: `Language entry "${key}" is not referenced in .mez (String:translate) or .vxml (label/title/heading/etc.)`,
        range: toLspRange(range),
        severity,
        source: "helium-dsl-unused",
      });
    }
    return warnings;
  }

  getUnusedWarningsForFile(uri: string, astOverride?: FileAst, langFileText?: string): Diagnostic[] {
    let langPath = false;
    try {
      langPath = URI.parse(uri).fsPath.endsWith(".lang");
    } catch {
      langPath = uri.toLowerCase().includes(".lang");
    }
    if (langPath) {
      return this.getUnusedLangEntryDiagnostics(uri, langFileText);
    }

    const ast = astOverride ?? this.files.get(uri);
    if (!ast) return [];

    const severityConfig = this.getUnusedSeverityConfig();

    const toWarning = (range: SourceRange, message: string, severity: DiagnosticSeverity | null): Diagnostic | null => {
      if (severity === null) {
        return null; // Skip diagnostic if severity is None
      }
      return {
        message,
        range: toLspRange(range),
        severity,
        source: "helium-dsl-unused",
      };
    };

    const warnings: Diagnostic[] = [];

    // Persistent models (object types) referenced nowhere in indexed .mez type positions
    for (const obj of ast.objects || []) {
      if (!obj.isPersistent) {
        continue;
      }
      const modelCount = this.objectModelUsage.get(obj.name) ?? 0;
      if (modelCount <= 0) {
        const diagnostic = toWarning(
          obj.nameRange,
          `Model ${obj.name} is not referenced anywhere`,
          severityConfig.models
        );
        if (diagnostic) {
          warnings.push(diagnostic);
        }
      }
    }

    // Object attributes + relationships are intentionally excluded from unused diagnostics.
    // Keeping this suppressed avoids noisy "helium-dsl-unused" warnings for unreferenced properties.

    // Units + unit functions
    const unitsNeedingVxmlDisk = new Set<string>();
    for (const unit of ast.units || []) {
      for (const fn of unit.functions || []) {
        if (this.getNestedUsage(this.functionUsage, unit.name, fn.name) <= 0) {
          unitsNeedingVxmlDisk.add(unit.name);
          break;
        }
      }
    }
    const vxmlDiskFnsByUnit =
      unitsNeedingVxmlDisk.size > 0 ? this.buildVxmlDiskUsageMapForUnits(unitsNeedingVxmlDisk) : new Map<string, Set<string>>();

    for (const unit of ast.units || []) {
      const diskFns = vxmlDiskFnsByUnit.get(unit.name);
      let unitCount = this.unitUsage.get(unit.name) ?? 0;
      if (unitCount <= 0 && diskFns !== undefined && diskFns.size > 0) {
        unitCount = 1;
      }
      if (unitCount <= 0) {
        const diagnostic = toWarning(unit.nameRange, `Unit ${unit.name} is not used anywhere`, severityConfig.units);
        if (diagnostic) {
          warnings.push(diagnostic);
        }
      }

      for (const fn of unit.functions || []) {
        let fnCount = this.getNestedUsage(this.functionUsage, unit.name, fn.name);
        if (fnCount <= 0 && diskFns !== undefined && diskFns.has(fn.name)) {
          fnCount = 1;
        }
        if (fnCount <= 0) {
          const diagnostic = toWarning(fn.nameRange, `Function ${unit.name}:${fn.name} is not used anywhere`, severityConfig.functions);
          if (diagnostic) {
            warnings.push(diagnostic);
          }
        }
      }
    }

    return warnings;
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

function unescapeMezStringChunk(s: string): string {
  return s.replace(/\\(.)/g, (_: string, ch: string) => {
    if (ch === "n") {
      return "\n";
    }
    if (ch === "t") {
      return "\t";
    }
    if (ch === "r") {
      return "\r";
    }
    return ch;
  });
}

/**
 * Skip one comma-separated argument in Mez-like call text, respecting strings and nested ().
 * `start` is the first character of the argument (after `(` or `,`).
 */
function skipMezArgument(text: string, start: number): { end: number; endedWithComma: boolean } | null {
  let i = start;
  while (i < text.length && /\s/.test(text[i])) {
    i++;
  }
  if (i >= text.length) {
    return null;
  }

  let parenDepth = 0;
  let inString: '"' | "'" | null = null;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === "\\" && i + 1 < text.length) {
        i++;
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = ch as '"' | "'";
      continue;
    }
    if (ch === "(") {
      parenDepth++;
      continue;
    }
    if (ch === ")") {
      if (parenDepth === 0) {
        return { end: i, endedWithComma: false };
      }
      parenDepth--;
      continue;
    }
    if (ch === "," && parenDepth === 0) {
      return { end: i, endedWithComma: true };
    }
  }
  return null;
}

function readMezStringLiteral(text: string, start: number): { value: string; end: number } | null {
  let i = start;
  while (i < text.length && /\s/.test(text[i])) {
    i++;
  }
  const q = text[i];
  if (q !== '"' && q !== "'") {
    return null;
  }
  i++;
  let raw = "";
  while (i < text.length) {
    const ch = text[i];
    if (ch === "\\" && i + 1 < text.length) {
      raw = raw + ch + text[i + 1];
      i = i + 2;
      continue;
    }
    if (ch === q) {
      return { value: unescapeMezStringChunk(raw), end: i + 1 };
    }
    raw = raw + ch;
    i++;
  }
  return null;
}

/** Third argument to Mez:sms(recipient, channel, "langKey") is a translation key. */
function extractMezSmsTranslationKeysFromMez(text: string): Set<string> {
  const out = new Set<string>();
  const re = /Mez\s*:\s*sms\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    let pos = m.index + m[0].length;
    const first = skipMezArgument(text, pos);
    if (!first || first.endedWithComma === false) {
      continue;
    }
    pos = first.end + 1;
    const second = skipMezArgument(text, pos);
    if (!second || second.endedWithComma === false) {
      continue;
    }
    pos = second.end + 1;
    const third = readMezStringLiteral(text, pos);
    if (!third) {
      continue;
    }
    const k = third.value.trim();
    if (k) {
      out.add(k);
    }
  }
  return out;
}

function extractTranslateKeysFromMez(text: string): Set<string> {
  const out = extractMezSmsTranslationKeysFromMez(text);
  const reDouble = /String\s*:\s*translate\s*\(\s*"((?:[^"\\]|\\.)*)"/g;
  const reSingle = /String\s*:\s*translate\s*\(\s*'((?:[^'\\]|\\.)*)'/g;
  let m: RegExpExecArray | null;
  while ((m = reDouble.exec(text)) !== null) {
    const k = unescapeMezStringChunk(m[1]).trim();
    if (k) {
      out.add(k);
    }
  }
  while ((m = reSingle.exec(text)) !== null) {
    const k = unescapeMezStringChunk(m[1]).trim();
    if (k) {
      out.add(k);
    }
  }
  return out;
}

/** Strip XML comments so commented-out labels do not count as references */
function stripXmlCommentsForLangScan(xml: string): string {
  return xml.replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * VXML attributes whose values are typically language file keys (see Helium view rules).
 */
function extractLangKeysFromVxml(xml: string): Set<string> {
  const out = new Set<string>();
  const cleaned = stripXmlCommentsForLangScan(xml);
  const attrRe =
    /\b(?:label|title|heading|tooltip|subject|body|value|placeholder|emptyMessage|cancelText|submitText|pageTitle|breadcrumb|message|header|footer|text|description|hint|warnMessage|infoMessage|dialogTitle|confirmTitle|emptyLabel|tabTitle|pill|actionsLabel)="([^"]+)"/gi;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(cleaned)) !== null) {
    const v = (m[1] ?? "").trim();
    if (v && !v.includes("{") && !v.includes("}") && !v.includes("$")) {
      out.add(v);
    }
  }
  return out;
}

function parseLangFileKeyEntries(text: string): Array<{ key: string; range: SourceRange }> {
  const entries: Array<{ key: string; range: SourceRange }> = [];
  const lines = text.split(/\r?\n/);
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const raw = lines[lineIdx];
    const trimmed = raw.trim();
    if (trimmed === "") {
      continue;
    }
    if (trimmed.startsWith("#") || trimmed.startsWith(";")) {
      continue;
    }
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    if (key === "") {
      continue;
    }
    const keyStartInTrimmed = trimmed.slice(0, eq).search(/\S/);
    const wsLeading = raw.length - raw.trimStart().length;
    const charStart = wsLeading + (keyStartInTrimmed >= 0 ? keyStartInTrimmed : 0);
    entries.push({
      key,
      range: {
        start: { line: lineIdx, character: charStart },
        end: { line: lineIdx, character: charStart + key.length },
      },
    });
  }
  return entries;
}

function parseLangKeys(text: string): Set<string> {
  const keys = new Set<string>();
  for (const { key } of parseLangFileKeyEntries(text)) {
    keys.add(key);
  }
  return keys;
}

function parseLangEntries(text: string): Map<string, string> {
  const entries = new Map<string, string>();
  const lines = text.split(/\r?\n/);
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (
      trimmed === "" ||
      trimmed.startsWith("#") ||
      trimmed.startsWith(";") ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!key) continue;
    const value = trimmed.slice(eq + 1).trim();
    entries.set(key, value);
  }
  return entries;
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
