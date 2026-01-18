import fs from "node:fs";
import path from "node:path";
import { URI } from "vscode-uri";
import { TextDocument } from "vscode-languageserver-textdocument";
import { ProjectManager, ProjectIndex, buildFileAst, buildSignatureHelpFromLabel, createDiagnostics, createForbiddenOperatorFix, createNamingConventionFix, createNoVarInElseFix, findCallAtPosition, findFunctionCalls, findFunctionDefinition, getLanguageMetadataSync, runLints, formatDocument, } from "helium-dsl-language-server/api";
export class MezWorkspaceService {
    workspaceRoot;
    projectManager = new ProjectManager();
    projectIndex;
    ready;
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        const metadata = getLanguageMetadataSync();
        this.projectIndex = new ProjectIndex(workspaceRoot, metadata);
        // ProjectIndex indexing + ProjectManager initialization are async. Ensure tools await readiness.
        const projectIndex = this.projectIndex;
        const projectManager = this.projectManager;
        this.ready = (async () => {
            await projectIndex.indexProjectFiles();
            await projectManager.initialize([
                {
                    uri: URI.file(workspaceRoot).toString(),
                    name: path.basename(workspaceRoot),
                },
            ]);
        })();
    }
    getWorkspaceRoot() {
        return this.workspaceRoot;
    }
    toUri(filePath) {
        return URI.file(filePath).toString();
    }
    readTextOrThrow(filePath) {
        return fs.readFileSync(filePath, "utf8");
    }
    getText(filePath, textOverride) {
        return textOverride ?? this.readTextOrThrow(filePath);
    }
    getDoc(filePath, textOverride) {
        const uri = this.toUri(filePath);
        const text = this.getText(filePath, textOverride);
        const doc = TextDocument.create(uri, "helium-dsl", 1, text);
        return { uri, text, doc };
    }
    updateFile(filePath, text) {
        const uri = this.toUri(filePath);
        const doc = TextDocument.create(uri, "helium-dsl", 1, text);
        this.projectManager.updateDocument(doc);
        this.projectIndex.updateFile(uri, text);
    }
    async validate(filePath, textOverride) {
        const text = this.getText(filePath, textOverride);
        const parserDiags = createDiagnostics(text);
        const lintDiags = (await runLints(text));
        return [...parserDiags, ...lintDiags];
    }
    getAstSummary(filePath, textOverride) {
        const text = this.getText(filePath, textOverride);
        const uri = this.toUri(filePath);
        const ast = buildFileAst(text, uri);
        return {
            uri: ast.uri,
            objects: ast.objects.map((o) => ({
                name: o.name,
                isPersistent: o.isPersistent,
                attributes: o.attributes.map((a) => ({
                    name: a.name,
                    typeName: a.typeName,
                    isEnum: a.isEnum,
                })),
                relationships: o.relationships.map((r) => ({
                    name: r.name,
                    targetType: r.targetType,
                })),
            })),
            enums: ast.enums.map((e) => ({
                name: e.name,
                values: e.values.map((v) => v.name),
            })),
            units: ast.units.map((u) => ({
                name: u.name,
                variables: u.variables.map((v) => ({
                    name: v.name,
                    typeName: v.typeName,
                })),
                functions: u.functions.map((f) => ({
                    name: f.name,
                    returnType: f.returnType,
                    params: f.params.map((p) => ({ name: p.name, typeName: p.typeName })),
                    locals: f.locals.map((v) => ({ name: v.name, typeName: v.typeName })),
                })),
            })),
            references: {
                types: ast.typeReferences.map((r) => r.name),
                units: ast.unitReferences.map((r) => r.name),
                functionCalls: ast.functionCalls.map((r) => ({
                    unitName: r.unitName,
                    name: r.name,
                })),
                variableRefs: ast.variableReferences.map((r) => ({
                    unitName: r.unitName,
                    name: r.name,
                })),
                properties: ast.propertyReferences.map((r) => r.name),
            },
        };
    }
    async getSymbols(query) {
        await this.ready;
        const q = query ?? "";
        return {
            projectRoots: this.projectManager.getProjectRoots(),
            types: this.projectManager.getUserTypes(),
            units: this.projectManager.getUnitNames(),
            workspaceSymbols: this.projectManager.getWorkspaceSymbols(q),
        };
    }
    getIndex() {
        return this.projectIndex;
    }
    async getDefinition(filePath, line, character) {
        await this.ready;
        const uri = this.toUri(filePath);
        const res = this.projectManager.getDefinition({
            textDocument: { uri },
            position: { line, character },
        });
        return (res ?? null);
    }
    async getReferences(filePath, line, character, includeDeclaration) {
        await this.ready;
        const uri = this.toUri(filePath);
        return this.projectManager.getReferences({
            textDocument: { uri },
            position: { line, character },
            context: { includeDeclaration },
        });
    }
    async getRenamePreview(filePath, line, character, newName) {
        await this.ready;
        const uri = this.toUri(filePath);
        return this.projectManager.getRenameEdits({
            textDocument: { uri },
            position: { line, character },
            newName,
        });
    }
    format(filePath, textOverride) {
        const uri = this.toUri(filePath);
        const originalText = this.getText(filePath, textOverride);
        const doc = TextDocument.create(uri, "helium-dsl", 1, originalText);
        const edits = formatDocument(doc, { insertSpaces: true, tabSize: 2 });
        const formattedText = applyTextEdits(originalText, edits);
        return { formattedText };
    }
    async getCompletions(filePath, line, character, textOverride, triggerCharacter) {
        await this.ready;
        const { uri, text, doc } = this.getDoc(filePath, textOverride);
        this.updateFile(filePath, text);
        const params = {
            textDocument: { uri },
            position: { line, character },
            context: triggerCharacter
                ? {
                    triggerKind: 2, // TriggerCharacter
                    triggerCharacter,
                }
                : undefined,
        };
        return (await this.projectManager.getCompletions(params, doc));
    }
    async getDocumentSymbols(filePath, textOverride) {
        await this.ready;
        const { text, doc } = this.getDoc(filePath, textOverride);
        this.updateFile(filePath, text);
        return this.projectManager.getDocumentSymbols(doc);
    }
    async getSignatureHelp(filePath, line, character, textOverride) {
        await this.ready;
        const { uri, text, doc } = this.getDoc(filePath, textOverride);
        this.updateFile(filePath, text);
        const call = findCallAtPosition(text, { line, character });
        if (!call)
            return null;
        const metadata = getLanguageMetadataSync();
        const isModelBif = (methodName) => Boolean((metadata.modelBifs || []).includes(methodName));
        const bifMeta = loadBifMetadataBestEffort();
        if (call.namespace) {
            const bif = bifMeta?.namespaces?.[call.namespace]?.find((f) => f.name === call.callee);
            if (bif?.signature) {
                return buildSignatureHelpFromLabel(bif.signature, call.activeParameter, bif.description);
            }
            if (this.projectManager.isUnit(call.namespace)) {
                const decl = this.projectManager.getFunctionDeclForSignatureHelp(uri, { line, character }, call.callee, call.namespace);
                if (decl) {
                    const label = `${decl.returnType} ${call.namespace}:${decl.name}(` +
                        (decl.params || [])
                            .map((p) => `${p.typeName} ${p.name}`.trim())
                            .join(", ") +
                        ")";
                    return buildSignatureHelpFromLabel(label, call.activeParameter);
                }
            }
            if (this.projectManager.isUserDefinedType(call.namespace) && isModelBif(call.callee)) {
                const label = `${call.namespace}:${call.callee}()`;
                return buildSignatureHelpFromLabel(label, call.activeParameter);
            }
            // Best-effort fallback for unknown namespaces (e.g. missing BIF metadata in dev env).
            return buildSignatureHelpFromLabel(`${call.namespace}:${call.callee}()`, call.activeParameter);
        }
        const decl = this.projectManager.getFunctionDeclForSignatureHelp(uri, { line, character }, call.callee);
        if (!decl)
            return null;
        const label = `${decl.returnType} ${decl.name}(` +
            (decl.params || [])
                .map((p) => `${p.typeName} ${p.name}`.trim())
                .join(", ") +
            ")";
        return buildSignatureHelpFromLabel(label, call.activeParameter);
    }
    async getHover(filePath, line, character, textOverride) {
        await this.ready;
        const { uri, text, doc } = this.getDoc(filePath, textOverride);
        this.updateFile(filePath, text);
        const wordInfo = getWordAt(text, { line, character });
        if (!wordInfo)
            return null;
        const { word, namespace, methodContext } = wordInfo;
        const content = [];
        const bifMeta = loadBifMetadataBestEffort();
        if (namespace && methodContext) {
            // Namespaced call: Unit:method or BIF namespace
            if (this.projectManager.isUnit(namespace)) {
                content.push(`**Unit**: \`${namespace}\``);
                content.push(`**Method**: \`${word}()\``);
                const decl = this.projectManager.getFunctionDeclForSignatureHelp(uri, { line, character }, word, namespace);
                if (decl) {
                    const signature = `${decl.returnType} ${namespace}:${decl.name}(` +
                        (decl.params || [])
                            .map((p) => `${p.typeName} ${p.name}`.trim())
                            .join(", ") +
                        ")";
                    content.push(`\`\`\`mez\n${signature}\n\`\`\``);
                    const defLine = decl.nameRange?.start?.line;
                    if (typeof defLine === "number")
                        content.push(`Defined at line ${defLine + 1}.`);
                }
            }
            else {
                const bif = bifMeta?.namespaces?.[namespace]?.find((f) => f.name === word);
                if (bif?.signature) {
                    content.push(`\`\`\`mez\n${bif.signature}\n\`\`\``);
                    if (bif.description)
                        content.push(bif.description);
                }
            }
        }
        else if (this.projectManager.isUserDefinedType(word)) {
            const location = this.projectManager.getObjectLocation(word);
            content.push(`**Type**: \`${word}\``);
            if (location)
                content.push(`Defined at line ${location.range.start.line + 1}.`);
        }
        else if (this.projectManager.isUnit(word)) {
            const location = this.projectManager.getUnitLocation(word);
            content.push(`**Unit**: \`${word}\``);
            if (location)
                content.push(`Defined at line ${location.range.start.line + 1}.`);
        }
        else {
            // Variable / function hover from AST
            try {
                const ast = await buildFileAst(text, doc.uri);
                const localVar = findLocalVariable(ast, word, { line, character });
                if (localVar) {
                    content.push(`**Variable**: \`${word}\``);
                    content.push(`**Type**: \`${localVar.typeName}\``);
                    const declLine = localVar.decl?.nameRange?.start?.line;
                    if (typeof declLine === "number")
                        content.push(`Declared at line ${declLine + 1}.`);
                }
                else {
                    const fn = findFunctionDecl(ast, word);
                    if (fn) {
                        const signature = `${fn.returnType} ${fn.name}(` +
                            (fn.params || [])
                                .map((p) => `${p.typeName} ${p.name}`.trim())
                                .join(", ") +
                            ")";
                        content.push(`\`\`\`mez\n${signature}\n\`\`\``);
                        const defLine = fn.nameRange?.start?.line;
                        if (typeof defLine === "number")
                            content.push(`Defined at line ${defLine + 1}.`);
                    }
                }
            }
            catch {
                // Ignore parse errors for hover.
            }
        }
        if (content.length === 0)
            return null;
        return { contents: { kind: "markdown", value: content.join("\n\n") } };
    }
    getCodeActions(filePath, diagnostics, textOverride) {
        const { uri, text, doc } = this.getDoc(filePath, textOverride);
        this.updateFile(filePath, text);
        const actions = [];
        for (const diagnostic of diagnostics) {
            const message = String(diagnostic?.message ?? "").toLowerCase();
            if (message.includes("variable") && message.includes("else")) {
                const fix = createNoVarInElseFix(doc, diagnostic, text);
                if (fix)
                    actions.push(fix);
            }
            else if (message.includes("naming") || message.includes("convention")) {
                const fix = createNamingConventionFix(doc, diagnostic, text);
                if (fix)
                    actions.push(fix);
            }
            else if (message.includes("forbidden") ||
                message.includes("operator") ||
                message.includes("negation") ||
                message.includes("ternary") ||
                message.includes("compound") ||
                message.includes("boolean")) {
                const fix = createForbiddenOperatorFix(doc, diagnostic, text);
                if (fix)
                    actions.push(fix);
            }
        }
        return actions;
    }
    async callHierarchyPrepare(filePath, line, character, textOverride) {
        const { uri, text, doc } = this.getDoc(filePath, textOverride);
        this.updateFile(filePath, text);
        const wordInfo = getWordAt(text, { line, character });
        const functionName = wordInfo?.word ?? "";
        if (!/^[a-z][A-Za-z0-9_]*$/.test(functionName))
            return null;
        const definition = await findFunctionDefinition(doc, functionName);
        if (!definition)
            return null;
        return [
            {
                name: functionName,
                kind: 12, // SymbolKind.Function
                uri: definition.uri,
                range: definition.range,
                selectionRange: definition.range,
            },
        ];
    }
    async callHierarchyIncoming(functionName) {
        // Best-effort: scan project .mez files for call sites.
        const filePaths = collectMezFiles(this.workspaceRoot);
        const calls = [];
        const perDocCalls = await Promise.all(filePaths.map(async (fp) => {
            try {
                const t = fs.readFileSync(fp, "utf8");
                const d = TextDocument.create(this.toUri(fp), "helium-dsl", 1, t);
                return await findFunctionCalls(d, functionName);
            }
            catch {
                return [];
            }
        }));
        for (const docCalls of perDocCalls) {
            for (const call of docCalls) {
                calls.push({ fromRanges: [call.range], fromUri: call.uri });
            }
        }
        return calls;
    }
    async callHierarchyOutgoing(item) {
        // Mirror the language-server’s outgoing logic, but keep it best-effort.
        const filePath = URI.parse(item.uri).fsPath;
        const text = this.readTextOrThrow(filePath);
        const doc = TextDocument.create(item.uri, "helium-dsl", 1, text);
        let ast;
        try {
            ast = await buildFileAst(text, doc.uri);
        }
        catch {
            return [];
        }
        const decl = (ast.units || [])
            .flatMap((u) => u.functions || [])
            .find((fn) => fn.name === item.name);
        if (!decl?.bodyRange)
            return [];
        const inBody = (range) => {
            const s = decl.bodyRange.start;
            const e = decl.bodyRange.end;
            const p = range.start;
            if (p.line < s.line || (p.line === s.line && p.character < s.character))
                return false;
            if (p.line > e.line || (p.line === e.line && p.character > e.character))
                return false;
            return true;
        };
        const resolveCalledFunction = (name, unitName) => {
            const units = ast.units || [];
            if (unitName) {
                const unit = units.find((u) => u.name === unitName);
                return unit?.functions?.find((f) => f.name === name) || null;
            }
            for (const unit of units) {
                const fn = (unit.functions || []).find((f) => f.name === name);
                if (fn)
                    return fn;
            }
            return null;
        };
        const out = [];
        for (const call of ast.functionCalls || []) {
            if (!call?.nameRange || !inBody(call.nameRange))
                continue;
            if (call.name === item.name)
                continue;
            const called = resolveCalledFunction(call.name, call.unitName);
            if (!called?.nameRange)
                continue;
            out.push({
                to: {
                    name: called.name,
                    kind: 12,
                    uri: doc.uri,
                    range: called.nameRange,
                    selectionRange: called.nameRange,
                },
                fromRanges: [call.nameRange],
            });
        }
        return out;
    }
    async explainSymbol(filePath, line, character, options) {
        await this.ready;
        const { uri, text } = this.getDoc(filePath);
        this.updateFile(filePath, text);
        const includeReferences = options?.includeReferences ?? true;
        const maxReferences = options?.maxReferences ?? 50;
        const wordInfo = getWordAt(text, { line, character });
        const word = wordInfo?.word ?? "";
        const definition = await this.getDefinition(filePath, line, character);
        const references = includeReferences
            ? ((await this.getReferences(filePath, line, character, true)) ?? [])
            : [];
        // Context from AST (enclosing unit/function)
        let context = null;
        try {
            const ast = await buildFileAst(text, uri);
            const containingUnit = (ast.units || []).find((u) => (u.functions || []).some((fn) => fn.bodyRange && rangeContains(fn.bodyRange, line, character)));
            const containingFn = (containingUnit?.functions || []).find((fn) => fn.bodyRange && rangeContains(fn.bodyRange, line, character));
            context = {
                unitName: containingUnit?.name ?? null,
                functionName: containingFn?.name ?? null,
            };
        }
        catch {
            // ignore
        }
        const sig = await this.getSignatureHelp(filePath, line, character);
        const hover = await this.getHover(filePath, line, character);
        return {
            uri,
            position: { line, character },
            token: { word, namespace: wordInfo?.namespace ?? null },
            context,
            definition,
            signatureHelp: sig,
            hover,
            references: includeReferences
                ? {
                    total: references.length,
                    sample: references.slice(0, maxReferences),
                }
                : { total: 0, sample: [] },
        };
    }
}
function applyTextEdits(text, edits) {
    // LSP text edits are applied from the end of the document backwards.
    const sorted = [...edits].sort((a, b) => {
        const aStart = a.range.start;
        const bStart = b.range.start;
        if (aStart.line !== bStart.line)
            return bStart.line - aStart.line;
        return bStart.character - aStart.character;
    });
    const lines = text.split(/\r?\n/);
    const offsetAt = (pos) => {
        let offset = 0;
        for (let i = 0; i < pos.line; i++)
            offset += (lines[i]?.length ?? 0) + 1;
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
let bifMetadataCache = null;
function loadBifMetadataBestEffort() {
    if (bifMetadataCache)
        return bifMetadataCache;
    const candidates = [
        path.join(process.cwd(), "generated", "bifs", "bif-metadata.json"),
        path.join(process.cwd(), "..", "generated", "bifs", "bif-metadata.json"),
        path.join(process.cwd(), "..", "..", "generated", "bifs", "bif-metadata.json"),
    ];
    for (const p of candidates) {
        try {
            if (!fs.existsSync(p))
                continue;
            const data = JSON.parse(fs.readFileSync(p, "utf8"));
            bifMetadataCache = data;
            return bifMetadataCache;
        }
        catch {
            // continue
        }
    }
    return null;
}
function getWordAt(text, pos) {
    const lines = text.split(/\r?\n/);
    const line = lines[pos.line] ?? "";
    if (!line)
        return null;
    const ch = Math.max(0, Math.min(pos.character, line.length));
    let start = ch;
    while (start > 0 && /[A-Za-z0-9_]/.test(line[start - 1]))
        start--;
    let end = ch;
    while (end < line.length && /[A-Za-z0-9_]/.test(line[end]))
        end++;
    const word = line.substring(start, end);
    if (!word)
        return null;
    const before = line.substring(0, start);
    const nsMatch = before.match(/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*$/);
    const namespace = nsMatch?.[1];
    return { word, namespace, methodContext: Boolean(namespace) };
}
function findLocalVariable(ast, name, pos) {
    const containingUnit = (ast.units || []).find((unit) => (unit.functions || []).some((fn) => fn.bodyRange && rangeContains(fn.bodyRange, pos.line, pos.character)));
    const containingFn = (containingUnit?.functions || []).find((fn) => fn.bodyRange && rangeContains(fn.bodyRange, pos.line, pos.character));
    if (containingFn) {
        const param = (containingFn.params || []).find((p) => p.name === name);
        if (param)
            return { typeName: param.typeName, decl: param };
        const locals = (containingFn.locals || []).filter((v) => v.name === name);
        if (locals.length > 0)
            return { typeName: locals[0].typeName, decl: locals[0] };
    }
    const unitVar = (containingUnit?.variables || []).find((v) => v.name === name);
    if (unitVar)
        return { typeName: unitVar.typeName, decl: unitVar };
    return null;
}
function findFunctionDecl(ast, name) {
    for (const unit of ast.units || []) {
        for (const fn of unit.functions || []) {
            if (fn.name === name)
                return fn;
        }
    }
    return null;
}
function rangeContains(range, line, character) {
    const s = range.start;
    const e = range.end;
    if (line < s.line || (line === s.line && character < s.character))
        return false;
    if (line > e.line || (line === e.line && character > e.character))
        return false;
    return true;
}
function collectMezFiles(projectRoot) {
    const out = [];
    const walk = (dir) => {
        if (!fs.existsSync(dir))
            return;
        let entries;
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        }
        catch {
            return;
        }
        for (const entry of entries) {
            if (entry.name.startsWith(".") || entry.name === "node_modules")
                continue;
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory())
                walk(fullPath);
            else if (entry.isFile() && entry.name.endsWith(".mez"))
                out.push(fullPath);
        }
    };
    walk(projectRoot);
    return out;
}
