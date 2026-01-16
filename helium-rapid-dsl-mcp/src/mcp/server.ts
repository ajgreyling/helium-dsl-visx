import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { createToolHandlers, tools } from "../tools/index.js";

export async function createRapidDslMcpServer(): Promise<Server> {
  // #region agent log
  (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-test-1',hypothesisId:'H3',location:'helium-rapid-dsl-mcp/src/mcp/server.ts:10',message:'create_server',data:{toolCount:tools.length},timestamp:Date.now()})}).catch(()=>{});
  // #endregion agent log
  const server = new Server(
    { name: "helium-rapid-dsl-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } }
  );

  const handlers = await createToolHandlers();

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    // #region agent log
    (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-test-1',hypothesisId:'H3',location:'helium-rapid-dsl-mcp/src/mcp/server.ts:20',message:'list_tools',data:{toolCount:tools.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    return { tools: tools satisfies Tool[] };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args } = req.params;
    const handler = handlers[name];
    // #region agent log
    (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-test-1',hypothesisId:'H4',location:'helium-rapid-dsl-mcp/src/mcp/server.ts:27',message:'call_tool',data:{toolName:name,hasHandler:Boolean(handler),argKeys:Array.isArray(args)?args.length:Object.keys(args ?? {}).length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    if (!handler) {
      return {
        content: [
          { type: "text", text: `Unknown tool: ${name}` },
        ],
        isError: true,
      };
    }
    return handler(args ?? {});
  });

  return server;
}

