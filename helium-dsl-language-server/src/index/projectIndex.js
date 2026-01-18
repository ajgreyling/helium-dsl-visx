import fs from "fs";
import path from "path";
import { URI } from "vscode-uri";
import { Range, SymbolKind } from "vscode-languageserver/node";
import { buildFileAst, rangeContains } from "../ast/builder.js";
export class ProjectIndex {
    constructor(projectRoot, metadata) {
        this.files = new Map();
        this.objects = new Map();
        this.units = new Map();
        this.enums = new Map();
        this.functionsByName = new Map();
        this.projectRoot = projectRoot;
        this.metadata = metadata;
    }
    getRoot() {
        return this.projectRoot;
    }
    getObjectNames() {
        return Array.from(this.objects.keys());
    }
    getUnitNames() {
        return Array.from(this.units.keys());
    }
    getObjectMembers(typeName) {
        const obj = this.objects.get(typeName);
        if (!obj)
            return [];
        const names = [
            ...obj.attributes.map((a) => a.name),
            ...obj.relationships.map((r) => r.name),
        ];
        return Array.from(new Set(names));
    }
    getUnitFunctions(unitName) {
        const unit = this.units.get(unitName);
        return unit ? unit.functions : [];
    }
    getUnitVariables(unitName) {
        const unit = this.units.get(unitName);
        return unit ? unit.variables : [];
    }
    getUnit(unitName) {
        return this.units.get(unitName);
    }
    getObject(typeName) {
        return this.objects.get(typeName);
    }
    getEnum(enumName) {
        return this.enums.get(enumName);
    }
    getUnits() {
        return Array.from(this.units.values());
    }
    getObjects() {
        return Array.from(this.objects.values());
    }
    getEnums() {
        return Array.from(this.enums.values());
    }
    getVariableType(name, uri, position) {
        const ast = this.files.get(uri);
        if (!ast)
            return null;
        const containingUnit = ast.units.find((unit) => unit.functions.some((fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character)));
        const containingFn = containingUnit?.functions.find((fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character));
        if (containingFn) {
            const param = containingFn.params.find((p) => p.name === name);
            if (param)
                return param.typeName;
            const locals = containingFn.locals
                .filter((v) => v.name === name)
                .sort((a, b) => {
                if (a.nameRange.start.line !== b.nameRange.start.line) {
                    return b.nameRange.start.line - a.nameRange.start.line;
                }
                return b.nameRange.start.character - a.nameRange.start.character;
            });
            if (locals.length > 0)
                return locals[0].typeName;
        }
        if (containingUnit) {
            const unitVar = containingUnit.variables.find((v) => v.name === name);
            if (unitVar)
                return unitVar.typeName;
        }
        return null;
    }
    getFileAst(uri) {
        return this.files.get(uri);
    }
    updateFile(uri, text) {
        const ast = buildFileAst(text, uri);
        this.files.set(uri, ast);
        this.rebuildIndexes();
    }
    removeFile(uri) {
        this.files.delete(uri);
        this.rebuildIndexes();
    }
    indexFileFromDisk(filePath) {
        try {
            const text = fs.readFileSync(filePath, "utf8");
            const uri = URI.file(filePath).toString();
            this.updateFile(uri, text);
        }
        catch {
            // ignore
        }
    }
    indexProjectFiles() {
        this.files.clear();
        this.objects.clear();
        this.units.clear();
        this.enums.clear();
        this.functionsByName.clear();
        this.scanDirectory(this.projectRoot);
        this.rebuildIndexes();
    }
    scanDirectory(dir) {
        if (!fs.existsSync(dir))
            return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.name.startsWith(".") || entry.name === "node_modules")
                continue;
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                this.scanDirectory(fullPath);
            }
            else if (entry.isFile() && entry.name.endsWith(".mez")) {
                this.indexFileFromDisk(fullPath);
            }
        }
    }
    rebuildIndexes() {
        this.objects = new Map();
        this.units = new Map();
        this.enums = new Map();
        this.functionsByName = new Map();
        for (const ast of this.files.values()) {
            ast.objects.forEach((obj) => this.objects.set(obj.name, obj));
            ast.units.forEach((unit) => {
                this.units.set(unit.name, unit);
                unit.functions.forEach((fn) => {
                    if (!fn.unitName)
                        fn.unitName = unit.name;
                    if (!this.functionsByName.has(fn.name)) {
                        this.functionsByName.set(fn.name, []);
                    }
                    this.functionsByName.get(fn.name).push(fn);
                });
            });
            ast.enums.forEach((enm) => this.enums.set(enm.name, enm));
        }
    }
    getWorkspaceSymbols(query) {
        const symbols = [];
        const lower = query.toLowerCase();
        const addSymbol = (name, kind, uri, range) => {
            if (query && !name.toLowerCase().includes(lower))
                return;
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
    getObjectLocation(typeName) {
        const obj = this.objects.get(typeName);
        if (!obj)
            return null;
        return {
            uri: findUriForDecl(obj, this.files),
            range: toLspRange(obj.nameRange),
        };
    }
    getUnitLocation(unitName) {
        const unit = this.units.get(unitName);
        if (!unit)
            return null;
        return {
            uri: findUriForDecl(unit, this.files),
            range: toLspRange(unit.nameRange),
        };
    }
    resolveDefinitionAt(uri, position) {
        const ast = this.files.get(uri);
        if (!ast)
            return null;
        const match = findSymbolMatch(ast, position);
        if (!match)
            return null;
        if (match.type === "declaration") {
            return {
                uri,
                range: toLspRange(match.symbol.range),
            };
        }
        const resolved = this.resolveReference(match, uri, position);
        if (!resolved)
            return null;
        return {
            uri: resolved.uri,
            range: toLspRange(resolved.range),
        };
    }
    resolveSymbolAt(uri, position) {
        const ast = this.files.get(uri);
        if (!ast)
            return null;
        const match = findSymbolMatch(ast, position);
        if (!match)
            return null;
        if (match.type === "declaration") {
            return match.symbol;
        }
        return this.resolveReference(match, uri, position);
    }
    findReferences(symbol, includeDeclaration) {
        const locations = [];
        for (const [uri, ast] of this.files.entries()) {
            const addLocation = (range) => {
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
                    if (!resolved)
                        return;
                    if (resolved.kind === "variable" || resolved.kind === "param") {
                        if (resolved.name === symbol.name &&
                            resolved.functionName === symbol.functionName &&
                            resolved.unitName === symbol.unitName) {
                            addLocation(ref.nameRange);
                        }
                    }
                });
            }
            if (symbol.kind === "attribute" || symbol.kind === "relationship") {
                (ast.propertyReferences || []).forEach((ref) => {
                    const resolved = this.resolveReference({ type: "propertyRef", ref }, uri, ref.nameRange.start);
                    if (!resolved)
                        return;
                    if (resolved.kind !== symbol.kind)
                        return;
                    if (resolved.name !== symbol.name)
                        return;
                    if (symbol.objectName && resolved.objectName !== symbol.objectName)
                        return;
                    addLocation(ref.nameRange);
                });
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
    isReservedIdentifier(name) {
        return (this.metadata.reservedIdentifiers || []).includes(name);
    }
    isModelBif(name) {
        return (this.metadata.modelBifs || []).includes(name);
    }
    resolveReference(match, uri, position) {
        if (match.type === "typeRef") {
            const obj = this.objects.get(match.ref.name);
            if (obj) {
                return {
                    kind: "object",
                    name: obj.name,
                    uri: findUriForDecl(obj, this.files),
                    range: obj.nameRange,
                };
            }
            const enm = this.enums.get(match.ref.name);
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
                if (!unit)
                    return null;
                const fn = unit.functions.find((f) => f.name === match.ref.name);
                if (!fn)
                    return null;
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
            const symbol = resolveVariableReference(match.ref, this.files.get(uri), this.units, position);
            return symbol;
        }
        if (match.type === "propertyRef") {
            const receiver = match.ref.receiverName;
            if (!receiver)
                return null;
            const receiverType = this.getVariableType(receiver, uri, position);
            if (!receiverType)
                return null;
            const baseType = receiverType.replace(/\[\]$/, "");
            const obj = this.objects.get(baseType);
            if (!obj)
                return null;
            const attr = (obj.attributes || []).find((a) => a.name === match.ref.name);
            if (attr) {
                return {
                    kind: "attribute",
                    name: attr.name,
                    uri: findUriForDecl(obj, this.files),
                    range: attr.nameRange,
                    objectName: obj.name,
                };
            }
            const rel = (obj.relationships || []).find((r) => r.name === match.ref.name);
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
function toLspRange(range) {
    return Range.create(range.start.line, range.start.character, range.end.line, range.end.character);
}
function findUriForDecl(decl, files) {
    for (const [uri, ast] of files.entries()) {
        if (ast.objects.includes(decl))
            return uri;
        if (ast.units.includes(decl))
            return uri;
        if (ast.enums.includes(decl))
            return uri;
    }
    return "";
}
function findSymbolMatch(ast, position) {
    const declMatch = findDeclarationAt(ast, position);
    if (declMatch)
        return { type: "declaration", symbol: declMatch };
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
    for (const ref of ast.propertyReferences || []) {
        if (rangeContains(ref.nameRange, position.line, position.character)) {
            return { type: "propertyRef", ref };
        }
    }
    return null;
}
function findDeclarationAt(ast, position) {
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
function resolveVariableReference(ref, ast, units, position) {
    if (!ast)
        return null;
    const containingUnit = ast.units.find((unit) => unit.functions.some((fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character)));
    const containingFn = containingUnit?.functions.find((fn) => fn.bodyRange && rangeContains(fn.bodyRange, position.line, position.character));
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
