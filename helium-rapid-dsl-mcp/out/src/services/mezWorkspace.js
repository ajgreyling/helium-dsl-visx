import fs from "node:fs";
import path from "node:path";
import { URI } from "vscode-uri";
import { TextDocument } from "vscode-languageserver-textdocument";
import { ProjectManager, ProjectIndex, buildFileAst, createDiagnostics, getLanguageMetadataSync, runLints, formatDocument, } from "helium-dsl-language-server/api";
export class MezWorkspaceService {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this.projectManager = new ProjectManager();
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
    getWorkspaceRoot() {
        return this.workspaceRoot;
    }
    toUri(filePath) {
        return URI.file(filePath).toString();
    }
    readTextOrThrow(filePath) {
        return fs.readFileSync(filePath, "utf8");
    }
    updateFile(filePath, text) {
        const uri = this.toUri(filePath);
        const doc = TextDocument.create(uri, "helium-dsl", 1, text);
        this.projectManager.updateDocument(doc);
        this.projectIndex.updateFile(uri, text);
    }
    async validate(filePath, textOverride) {
        const text = textOverride ?? this.readTextOrThrow(filePath);
        const parserDiags = createDiagnostics(text);
        const lintDiags = (await runLints(text));
        return [...parserDiags, ...lintDiags];
    }
    getAstSummary(filePath, textOverride) {
        const text = textOverride ?? this.readTextOrThrow(filePath);
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
    getSymbols(query) {
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
    getDefinition(filePath, line, character) {
        const uri = this.toUri(filePath);
        const res = this.projectManager.getDefinition({
            textDocument: { uri },
            position: { line, character },
        });
        return (res ?? null);
    }
    getReferences(filePath, line, character, includeDeclaration) {
        const uri = this.toUri(filePath);
        return this.projectManager.getReferences({
            textDocument: { uri },
            position: { line, character },
            context: { includeDeclaration },
        });
    }
    getRenamePreview(filePath, line, character, newName) {
        const uri = this.toUri(filePath);
        return this.projectManager.getRenameEdits({
            textDocument: { uri },
            position: { line, character },
            newName,
        });
    }
    format(filePath, textOverride) {
        const uri = this.toUri(filePath);
        const originalText = textOverride ?? this.readTextOrThrow(filePath);
        const doc = TextDocument.create(uri, "helium-dsl", 1, originalText);
        const edits = formatDocument(doc, { insertSpaces: true, tabSize: 2 });
        const formattedText = applyTextEdits(originalText, edits);
        return { formattedText };
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
