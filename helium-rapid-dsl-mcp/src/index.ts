import { createRapidDslMcpServer } from "./mcp/server.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
  const server = await createRapidDslMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // #region agent log
  (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-test-1',hypothesisId:'H3',location:'helium-rapid-dsl-mcp/src/index.ts:8',message:'mcp_server_connected',data:{connected:true},timestamp:Date.now()})}).catch(()=>{});
  // #endregion agent log
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[helium-rapid-dsl-mcp] Fatal error:", err);
  process.exitCode = 1;
});

