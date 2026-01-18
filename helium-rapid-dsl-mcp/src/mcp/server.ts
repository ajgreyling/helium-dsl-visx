import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { createToolHandlers, tools } from "../tools/index.js";

export async function createRapidDslMcpServer(): Promise<Server> {
  const server = new Server(
    { name: "helium-rapid-dsl-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } }
  );

  const handlers = await createToolHandlers();

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: tools satisfies Tool[] };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args } = req.params;
    const handler = handlers[name];
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

