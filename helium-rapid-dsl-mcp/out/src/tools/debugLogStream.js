import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import WebSocket from "ws";
import { RAPID_PROJECT_FILE_NAME, baseUrlForEnvironment, } from "helium-dsl-language-server/api";
const streamsByRoot = new Map();
const streamsByHandle = new Map();
function safeJsonParse(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return null;
    }
}
function readProjectConfig(projectRoot) {
    const configPath = path.join(projectRoot, RAPID_PROJECT_FILE_NAME);
    if (!fs.existsSync(configPath)) {
        throw new Error(`Missing ${RAPID_PROJECT_FILE_NAME} at project root: ${projectRoot}`);
    }
    const raw = fs.readFileSync(configPath, "utf8");
    const parsed = safeJsonParse(raw);
    if (!parsed || parsed.schemaVersion !== 1 || !parsed.debug) {
        throw new Error(`Invalid ${RAPID_PROJECT_FILE_NAME} (expected schemaVersion=1).`);
    }
    return { path: configPath, config: parsed };
}
function computeWsUrl(cfg) {
    const env = cfg.debug.environment;
    const baseUrl = cfg.debug.baseUrl || baseUrlForEnvironment(env);
    const u = new URL(baseUrl);
    const wsProtocol = u.protocol === "https:" ? "wss:" : "ws:";
    const wsPath = cfg.debug.logging?.wsPath || "/api/ws2/logging";
    const appId = (cfg.debug.appId || "").trim();
    if (!appId)
        throw new Error("debug.appId is required in helium-rapid-dsl-project.json");
    return `${wsProtocol}//${u.host}${wsPath}?appId=${encodeURIComponent(appId)}`;
}
function computeAuthHeader(cfg) {
    const user = (cfg.debug.heliumUser || "").trim();
    const pass = cfg.debug.heliumPassword ?? "";
    if (!user || !pass)
        throw new Error("debug.heliumUser and debug.heliumPassword are required.");
    const token = Buffer.from(`${user}:${pass}`, "utf8").toString("base64");
    return `Basic ${token}`;
}
function writeSse(res, data) {
    // SSE requires CR/LF safe payloads; JSON stringify already yields no bare newlines in keys.
    res.write(`data: ${data}\n\n`);
}
function handleSseRequest(req, res, state) {
    res.statusCode = 200;
    res.setHeader("content-type", "text/event-stream; charset=utf-8");
    res.setHeader("cache-control", "no-cache, no-transform");
    res.setHeader("connection", "keep-alive");
    res.setHeader("x-accel-buffering", "no");
    // Initial comment to open stream.
    res.write(`: connected\n\n`);
    writeSse(res, JSON.stringify({ type: "status", status: "connected", startedAt: state.startedAt }));
    state.clients.add(res);
    res.on("close", () => {
        state.clients.delete(res);
    });
}
function broadcast(state, payload) {
    const text = typeof payload === "string" ? payload : JSON.stringify(payload);
    for (const res of state.clients) {
        try {
            writeSse(res, text);
        }
        catch {
            // ignore individual client failures
        }
    }
}
function randomHandle() {
    return `debuglog_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
export async function startDebugLogStream(opts) {
    const projectRoot = path.resolve(opts.projectRoot);
    const existing = streamsByRoot.get(projectRoot);
    if (existing) {
        return {
            handle: existing.handle,
            projectRoot: existing.projectRoot,
            configPath: existing.configPath,
            wsUrl: existing.wsUrl,
            sseUrl: existing.sseUrl,
        };
    }
    const { path: configPath, config } = readProjectConfig(projectRoot);
    const wsUrl = computeWsUrl(config);
    const authHeader = computeAuthHeader(config);
    const startedAt = Date.now();
    const clients = new Set();
    const ssePath = "/debug/logs";
    let state = null;
    const httpServer = http.createServer((req, res) => {
        try {
            if (!state) {
                res.statusCode = 503;
                res.end("Stream not ready");
                return;
            }
            const method = (req.method ?? "GET").toUpperCase();
            const url = new URL(req.url ?? "/", "http://127.0.0.1");
            if (method === "GET" && url.pathname === "/health") {
                res.statusCode = 200;
                res.setHeader("content-type", "application/json; charset=utf-8");
                res.end(JSON.stringify({ ok: true }));
                return;
            }
            if (method === "GET" && url.pathname === ssePath) {
                handleSseRequest(req, res, state);
                return;
            }
            res.statusCode = 404;
            res.end("Not found");
        }
        catch {
            try {
                res.statusCode = 500;
                res.end("Internal error");
            }
            catch {
                // ignore
            }
        }
    });
    const handle = randomHandle();
    state = {
        handle,
        projectRoot,
        configPath,
        wsUrl,
        httpServer,
        ssePath,
        sseUrl: "", // filled after listen
        ws: null, // filled after ws constructed
        clients,
        startedAt,
    };
    await new Promise((resolve, reject) => {
        httpServer.listen(opts.port ?? 0, "127.0.0.1", () => resolve());
        httpServer.on("error", reject);
    });
    const addr = httpServer.address();
    const port = addr?.port ?? opts.port ?? 0;
    const sseUrl = `http://127.0.0.1:${port}${ssePath}`;
    const ws = new WebSocket(wsUrl, {
        headers: {
            Authorization: authHeader,
        },
    });
    state.sseUrl = sseUrl;
    state.ws = ws;
    streamsByRoot.set(projectRoot, state);
    streamsByHandle.set(handle, state);
    ws.on("open", () => {
        broadcast(state, { type: "status", status: "ws_open", wsUrl, startedAt });
    });
    ws.on("message", (data, isBinary) => {
        const msg = isBinary ? Buffer.from(data).toString("utf8") : String(data);
        broadcast(state, { type: "log", message: msg, timestamp: Date.now() });
    });
    ws.on("close", (code, reason) => {
        broadcast(state, { type: "status", status: "ws_close", code, reason: reason?.toString?.() ?? "" });
    });
    ws.on("error", (err) => {
        broadcast(state, { type: "status", status: "ws_error", error: String(err?.message ?? err) });
    });
    return { handle, projectRoot, configPath, wsUrl, sseUrl };
}
export async function stopDebugLogStream(opts) {
    const key = opts.handleOrProjectRoot;
    const byHandle = streamsByHandle.get(key);
    const byRoot = streamsByRoot.get(path.resolve(key));
    const state = byHandle ?? byRoot;
    if (!state)
        return { stopped: false, handle: null, projectRoot: null };
    streamsByHandle.delete(state.handle);
    streamsByRoot.delete(state.projectRoot);
    // Close clients
    for (const res of state.clients) {
        try {
            res.end();
        }
        catch {
            // ignore
        }
    }
    state.clients.clear();
    try {
        state.ws.close();
    }
    catch {
        // ignore
    }
    await new Promise((resolve) => {
        try {
            state.httpServer.close(() => resolve());
        }
        catch {
            resolve();
        }
    });
    return { stopped: true, handle: state.handle, projectRoot: state.projectRoot };
}
