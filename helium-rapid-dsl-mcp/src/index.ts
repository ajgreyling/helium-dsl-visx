import { createRapidDslMcpServer } from "./mcp/server.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";

type TransportMode = "stdio" | "sse";

function getArgValue(argv: string[], key: string): string | undefined {
  const idx = argv.indexOf(key);
  if (idx === -1) return undefined;
  return argv[idx + 1];
}

function parseMode(argv: string[]): TransportMode {
  const v = (getArgValue(argv, "--transport") ?? process.env.MCP_TRANSPORT ?? "stdio").toLowerCase();
  return v === "sse" ? "sse" : "stdio";
}

function parseHost(argv: string[]): string {
  return getArgValue(argv, "--host") ?? process.env.MCP_HOST ?? "127.0.0.1";
}

function parsePort(argv: string[]): number {
  const raw = getArgValue(argv, "--port") ?? process.env.MCP_PORT ?? "0";
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function readJsonBody(req: IncomingMessage, maxBytes = 5 * 1024 * 1024): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on("data", (chunk) => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += buf.length;
      if (total > maxBytes) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(buf);
    });
    req.on("end", () => {
      const text = Buffer.concat(chunks).toString("utf8");
      if (!text.trim()) return resolve(undefined);
      try {
        resolve(JSON.parse(text));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, obj: any) {
  const body = JSON.stringify(obj);
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("content-length", Buffer.byteLength(body));
  res.end(body);
}

async function runStdio() {
  const server = await createRapidDslMcpServer();
  await server.connect(new StdioServerTransport());
}

async function runSse(opts: { host: string; port: number }) {
  const transports = new Map<string, { transport: SSEServerTransport; serverClose: () => Promise<void> | void }>();

  const httpServer = http.createServer(async (req, res) => {
    try {
      const method = (req.method ?? "GET").toUpperCase();
      const url = new URL(req.url ?? "/", `http://${opts.host}`);

      if (method === "GET" && url.pathname === "/health") {
        sendJson(res, 200, { ok: true });
        return;
      }

      if (method === "GET" && url.pathname === "/sse") {
        // Create a fresh MCP server per SSE session to avoid any assumptions about multi-transport support.
        const mcpServer = await createRapidDslMcpServer();
        const transport = new SSEServerTransport("/messages", res as any);
        const sessionId = transport.sessionId;

        transports.set(sessionId, {
          transport,
          serverClose: async () => {
            try {
              // server has no explicit close; transport.close() handles stream cleanup
              transport.close();
            } catch {
              // ignore
            }
          },
        });

        res.on("close", () => {
          const entry = transports.get(sessionId);
          transports.delete(sessionId);
          void entry?.serverClose();
        });

        await mcpServer.connect(transport);
        return;
      }

      if (method === "POST" && url.pathname === "/messages") {
        const sessionId = url.searchParams.get("sessionId");
        if (!sessionId) {
          sendJson(res, 400, { error: "Missing sessionId query param" });
          return;
        }
        const entry = transports.get(sessionId);
        if (!entry) {
          sendJson(res, 400, { error: "No active transport for sessionId" });
          return;
        }
        const body = await readJsonBody(req);
        await entry.transport.handlePostMessage(req as any, res as any, body);
        return;
      }

      sendJson(res, 404, { error: "Not found" });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[helium-rapid-dsl-mcp] SSE HTTP error:", err);
      if (!res.headersSent) {
        sendJson(res, 500, { error: "Internal server error" });
      } else {
        try {
          res.end();
        } catch {
          // ignore
        }
      }
    }
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.listen(opts.port, opts.host, () => resolve());
    httpServer.on("error", reject);
  });

  const addr = httpServer.address() as AddressInfo | null;
  const port = addr?.port ?? opts.port;
  const url = `http://${opts.host}:${port}/sse`;

  // Machine-parseable readiness signal for the extension.
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ type: "mcp-sse-ready", port, url }));

  const shutdown = () => {
    for (const [sid, entry] of transports.entries()) {
      transports.delete(sid);
      try {
        void entry.serverClose();
      } catch {
        // ignore
      }
    }
    httpServer.close(() => {
      process.exitCode = 0;
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

async function main() {
  const argv = process.argv.slice(2);
  const mode = parseMode(argv);
  if (mode === "sse") {
    await runSse({ host: parseHost(argv), port: parsePort(argv) });
    return;
  }
  await runStdio();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[helium-rapid-dsl-mcp] Fatal error:", err);
  process.exitCode = 1;
});

