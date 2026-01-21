import fs from "node:fs";
import path from "node:path";
import { URI } from "vscode-uri";
import { RAPID_PROJECT_FILE_NAME } from "helium-dsl-language-server/api";
import { startDebugLogStream, stopDebugLogStream } from "./debugLogStream.js";
function jsonResult(value) {
    return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
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
function findRapidProjectRootForHint(hintPathOrUri) {
    const fsPath = hintPathOrUri.startsWith("file://")
        ? URI.parse(hintPathOrUri).fsPath
        : hintPathOrUri;
    let cur = path.resolve(fsPath);
    if (fs.existsSync(cur) && fs.statSync(cur).isFile()) {
        cur = path.dirname(cur);
    }
    // Prefer explicit marker file.
    for (let i = 0; i < 25; i++) {
        if (fs.existsSync(path.join(cur, RAPID_PROJECT_FILE_NAME)))
            return cur;
        const parent = path.dirname(cur);
        if (parent === cur)
            break;
        cur = parent;
    }
    // Fallback: model/ + web-app/
    cur = path.resolve(fsPath);
    if (fs.existsSync(cur) && fs.statSync(cur).isFile()) {
        cur = path.dirname(cur);
    }
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
    return path.resolve(fsPath);
}
export function createDebugToolHandlers() {
    return {
        helium_debug_start_log_stream: async (args) => {
            const workspaceRoot = asString(args.workspaceRoot);
            const rootHintFilePath = asString(args.rootHintFilePath);
            const port = asNumber(args.port) ?? undefined;
            const hint = rootHintFilePath ?? workspaceRoot ?? process.cwd();
            const projectRoot = findRapidProjectRootForHint(hint);
            try {
                const res = await startDebugLogStream({ projectRoot, port });
                return jsonResult(res);
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                return errorResult(msg);
            }
        },
        helium_debug_stop_log_stream: async (args) => {
            const handle = asString(args.handle);
            const workspaceRoot = asString(args.workspaceRoot);
            const rootHintFilePath = asString(args.rootHintFilePath);
            const key = handle ?? rootHintFilePath ?? workspaceRoot;
            if (!key) {
                return errorResult("handle or workspaceRoot or rootHintFilePath is required");
            }
            try {
                const res = await stopDebugLogStream({ handleOrProjectRoot: key });
                return jsonResult(res);
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                return errorResult(msg);
            }
        },
    };
}
