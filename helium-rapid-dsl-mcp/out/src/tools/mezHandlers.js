import fs from "node:fs";
import path from "node:path";
import { MezWorkspaceService } from "../services/mezWorkspace.js";
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
function findRapidProjectRootForFile(filePath) {
    // Heuristic: find nearest ancestor containing model/ and web-app/ directories.
    let cur = path.resolve(path.dirname(filePath));
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
        helium_mez_ast: async (args) => {
            const filePath = asString(args.filePath);
            if (!filePath)
                return errorResult("filePath is required");
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            svc.updateFile(filePath, text ?? fs.readFileSync(filePath, "utf8"));
            return jsonResult(svc.getAstSummary(filePath, text));
        },
        helium_mez_symbols: async (args) => {
            const root = asString(args.workspaceRoot) ?? process.cwd();
            const query = asString(args.query) ?? undefined;
            const svc = getSvcForRoot(root);
            return jsonResult(svc.getSymbols(query));
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
            return jsonResult({ locations: svc.getDefinition(filePath, line, character) });
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
            const locations = svc.getReferences(filePath, line, character, includeDeclaration);
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
            const edit = svc.getRenamePreview(filePath, line, character, newName);
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
    };
}
