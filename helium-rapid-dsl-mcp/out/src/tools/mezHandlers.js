import fs from "node:fs";
import path from "node:path";
import { MezWorkspaceService } from "../services/mezWorkspace.js";
import { URI } from "vscode-uri";
import { RAPID_PROJECT_FILE_NAME } from "helium-dsl-language-server/api";
function jsonResult(value) {
    return {
        content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
    };
}
function errorResult(message) {
    return { content: [{ type: "text", text: message }], isError: true };
}
function asString(v) {
    return typeof v === "string" ? v : null;
}
function asNumber(v) {
    return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function asBoolean(v) {
    return typeof v === "boolean" ? v : null;
}
function asObject(v) {
    return v && typeof v === "object" && !Array.isArray(v) ? v : null;
}
function asArray(v) {
    return Array.isArray(v) ? v : null;
}
function summarizeDiagnostics(diagnostics) {
    const summary = {
        total: diagnostics.length,
        errors: 0,
        warnings: 0,
        information: 0,
        hints: 0,
        unknownSeverity: 0,
    };
    for (const diagnostic of diagnostics) {
        if (diagnostic.severity === 1)
            summary.errors += 1;
        else if (diagnostic.severity === 2)
            summary.warnings += 1;
        else if (diagnostic.severity === 3)
            summary.information += 1;
        else if (diagnostic.severity === 4)
            summary.hints += 1;
        else
            summary.unknownSeverity += 1;
    }
    return summary;
}
function findRapidProjectRootForFile(filePath) {
    // Preferred: find nearest ancestor containing the explicit Rapid DSL project file.
    let cur = path.resolve(path.dirname(filePath));
    for (let i = 0; i < 25; i++) {
        const marker = path.join(cur, RAPID_PROJECT_FILE_NAME);
        if (fs.existsSync(marker))
            return cur;
        const parent = path.dirname(cur);
        if (parent === cur)
            break;
        cur = parent;
    }
    // Heuristic fallback: find nearest ancestor containing model/ and web-app/ directories.
    cur = path.resolve(path.dirname(filePath));
    for (let i = 0; i < 25; i++) {
        const modelDir = path.join(cur, "model");
        const webAppDir = path.join(cur, "web-app");
        if (fs.existsSync(modelDir) && fs.existsSync(webAppDir))
            return cur;
        const parent = path.dirname(cur);
        if (parent === cur)
            break;
        cur = parent;
    }
    // Fallback: directory of file.
    return path.resolve(path.dirname(filePath));
}
export function createMezToolHandlers() {
    const cache = new Map();
    const getSvcForFile = (filePath) => {
        const root = findRapidProjectRootForFile(filePath);
        const existing = cache.get(root);
        if (existing)
            return existing;
        const svc = new MezWorkspaceService(root);
        cache.set(root, svc);
        return svc;
    };
    const getSvcForRoot = (workspaceRoot) => {
        const root = path.resolve(workspaceRoot);
        const existing = cache.get(root);
        if (existing)
            return existing;
        const svc = new MezWorkspaceService(root);
        cache.set(root, svc);
        return svc;
    };
    return {
        helium_mez_validate: async (args) => {
            const filePath = asString(args.filePath);
            if (!filePath)
                return errorResult("filePath is required");
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            // Keep index fresh for the file under validation.
            svc.updateFile(filePath, text ?? fs.readFileSync(filePath, "utf8"));
            const diagnostics = await svc.validate(filePath, text);
            return jsonResult({ filePath, diagnostics });
        },
        helium_mez_lint: async (args) => {
            const filePath = asString(args.filePath);
            if (!filePath)
                return errorResult("filePath is required");
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            svc.updateFile(filePath, text ?? fs.readFileSync(filePath, "utf8"));
            const diagnostics = await svc.validate(filePath, text);
            return jsonResult({ filePath, diagnostics, summary: summarizeDiagnostics(diagnostics) });
        },
        helium_mez_ast: async (args) => {
            const filePath = asString(args.filePath);
            if (!filePath)
                return errorResult("filePath is required");
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            svc.updateFile(filePath, text ?? fs.readFileSync(filePath, "utf8"));
            return jsonResult(await svc.getAstSummary(filePath, text));
        },
        helium_mez_symbols: async (args) => {
            const root = asString(args.workspaceRoot) ?? process.cwd();
            const query = asString(args.query) ?? undefined;
            const svc = getSvcForRoot(root);
            const result = await svc.getSymbols(query);
            return jsonResult(result);
        },
        helium_mez_definition: async (args) => {
            const filePath = asString(args.filePath);
            const line = asNumber(args.line);
            const character = asNumber(args.character);
            if (!filePath || line === null || character === null) {
                return errorResult("filePath, line, character are required");
            }
            const svc = getSvcForFile(filePath);
            svc.updateFile(filePath, fs.readFileSync(filePath, "utf8"));
            return jsonResult({ locations: await svc.getDefinition(filePath, line, character) });
        },
        helium_mez_references: async (args) => {
            const filePath = asString(args.filePath);
            const line = asNumber(args.line);
            const character = asNumber(args.character);
            if (!filePath || line === null || character === null) {
                return errorResult("filePath, line, character are required");
            }
            const includeDeclaration = asBoolean(args.includeDeclaration) ?? false;
            const svc = getSvcForFile(filePath);
            svc.updateFile(filePath, fs.readFileSync(filePath, "utf8"));
            const locations = await svc.getReferences(filePath, line, character, includeDeclaration);
            return jsonResult({ locations });
        },
        helium_mez_rename_preview: async (args) => {
            const filePath = asString(args.filePath);
            const line = asNumber(args.line);
            const character = asNumber(args.character);
            const newName = asString(args.newName);
            if (!filePath || line === null || character === null || !newName) {
                return errorResult("filePath, line, character, newName are required");
            }
            const svc = getSvcForFile(filePath);
            svc.updateFile(filePath, fs.readFileSync(filePath, "utf8"));
            const edit = await svc.getRenamePreview(filePath, line, character, newName);
            return jsonResult({ edit });
        },
        helium_mez_format: async (args) => {
            const filePath = asString(args.filePath);
            if (!filePath)
                return errorResult("filePath is required");
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            const res = svc.format(filePath, text);
            return jsonResult(res);
        },
        helium_mez_complete: async (args) => {
            const filePath = asString(args.filePath);
            const line = asNumber(args.line);
            const character = asNumber(args.character);
            if (!filePath || line === null || character === null) {
                return errorResult("filePath, line, character are required");
            }
            const text = asString(args.text) ?? undefined;
            const triggerCharacter = asString(args.triggerCharacter) ?? undefined;
            const svc = getSvcForFile(filePath);
            const items = await svc.getCompletions(filePath, line, character, text, triggerCharacter);
            return jsonResult({ items });
        },
        helium_mez_signature_help: async (args) => {
            const filePath = asString(args.filePath);
            const line = asNumber(args.line);
            const character = asNumber(args.character);
            if (!filePath || line === null || character === null) {
                return errorResult("filePath, line, character are required");
            }
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            const signatureHelp = await svc.getSignatureHelp(filePath, line, character, text);
            return jsonResult({ signatureHelp });
        },
        helium_mez_hover: async (args) => {
            const filePath = asString(args.filePath);
            const line = asNumber(args.line);
            const character = asNumber(args.character);
            if (!filePath || line === null || character === null) {
                return errorResult("filePath, line, character are required");
            }
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            const hover = await svc.getHover(filePath, line, character, text);
            return jsonResult({ hover });
        },
        helium_mez_document_symbols: async (args) => {
            const filePath = asString(args.filePath);
            if (!filePath)
                return errorResult("filePath is required");
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            const symbols = await svc.getDocumentSymbols(filePath, text);
            return jsonResult({ symbols });
        },
        helium_mez_code_actions: async (args) => {
            const filePath = asString(args.filePath);
            if (!filePath)
                return errorResult("filePath is required");
            const text = asString(args.text) ?? undefined;
            const diagnosticsArg = asArray(args.diagnostics);
            const svc = getSvcForFile(filePath);
            const diagnostics = diagnosticsArg
                ? diagnosticsArg
                : await svc.validate(filePath, text);
            const actions = svc.getCodeActions(filePath, diagnostics, text);
            return jsonResult({ actions });
        },
        helium_mez_call_hierarchy: async (args) => {
            const mode = asString(args.mode);
            if (!mode)
                return errorResult("mode is required");
            if (mode === "prepare") {
                const filePath = asString(args.filePath);
                const line = asNumber(args.line);
                const character = asNumber(args.character);
                if (!filePath || line === null || character === null) {
                    return errorResult("filePath, line, character are required for mode=prepare");
                }
                const text = asString(args.text) ?? undefined;
                const svc = getSvcForFile(filePath);
                const items = await svc.callHierarchyPrepare(filePath, line, character, text);
                return jsonResult({ items });
            }
            const item = asObject(args.item);
            if (!item)
                return errorResult("item is required for mode=incoming/outgoing");
            const itemName = asString(item.name);
            if (!itemName)
                return errorResult("item.name is required");
            const svc = getSvcForFile(mode === "outgoing" && typeof item.uri === "string" ? URI.parse(item.uri).fsPath : process.cwd());
            if (mode === "incoming") {
                const calls = await svc.callHierarchyIncoming(itemName);
                // Minimal schema: return call sites as ranges (agent/editor can format as needed)
                return jsonResult({ calls });
            }
            if (mode === "outgoing") {
                const uri = asString(item.uri);
                if (!uri)
                    return errorResult("item.uri is required for mode=outgoing");
                const calls = await svc.callHierarchyOutgoing({ uri, name: itemName });
                return jsonResult({ calls });
            }
            return errorResult(`Unknown mode: ${mode}`);
        },
        helium_mez_explain_symbol: async (args) => {
            const filePath = asString(args.filePath);
            const line = asNumber(args.line);
            const character = asNumber(args.character);
            if (!filePath || line === null || character === null) {
                return errorResult("filePath, line, character are required");
            }
            const includeReferences = asBoolean(args.includeReferences) ?? true;
            const maxReferences = asNumber(args.maxReferences) ?? 50;
            const svc = getSvcForFile(filePath);
            const explanation = await svc.explainSymbol(filePath, line, character, {
                includeReferences,
                maxReferences,
            });
            return jsonResult(explanation);
        },
        helium_mez_apply_workspace_edit: async (args) => {
            const rootHintFilePath = asString(args.rootHintFilePath);
            const editObj = asObject(args.edit);
            if (!rootHintFilePath || !editObj) {
                return errorResult("rootHintFilePath and edit are required");
            }
            const root = findRapidProjectRootForFile(rootHintFilePath);
            const changes = editObj.changes;
            if (!changes || typeof changes !== "object") {
                return errorResult("edit.changes is required and must be an object keyed by URI");
            }
            const applied = [];
            const rejected = [];
            for (const [uri, edits] of Object.entries(changes)) {
                const filePath = safeUriToFsPath(uri);
                if (!filePath) {
                    rejected.push({ uri, reason: "Unsupported URI (expected file://)" });
                    continue;
                }
                const resolved = path.resolve(filePath);
                const rel = path.relative(root, resolved);
                if (rel.startsWith("..") || path.isAbsolute(rel)) {
                    rejected.push({ uri, reason: `Refusing to edit outside project root: ${root}` });
                    continue;
                }
                if (!fs.existsSync(resolved)) {
                    rejected.push({ uri, reason: "File does not exist on disk" });
                    continue;
                }
                const original = fs.readFileSync(resolved, "utf8");
                const next = applyTextEdits(original, edits ?? []);
                fs.writeFileSync(resolved, next, "utf8");
                applied.push({ uri, filePath: resolved, editCount: Array.isArray(edits) ? edits.length : 0 });
            }
            return jsonResult({ root, applied, rejected });
        },
    };
}
function applyTextEdits(text, edits) {
    const sorted = [...(edits ?? [])].sort((a, b) => {
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
        out = out.slice(0, start) + (e.newText ?? "") + out.slice(end);
    }
    return out;
}
function safeUriToFsPath(uriOrPath) {
    if (uriOrPath.startsWith("file://")) {
        try {
            return URI.parse(uriOrPath).fsPath;
        }
        catch {
            return null;
        }
    }
    // Support passing a raw absolute path (best-effort).
    if (path.isAbsolute(uriOrPath))
        return uriOrPath;
    return null;
}
