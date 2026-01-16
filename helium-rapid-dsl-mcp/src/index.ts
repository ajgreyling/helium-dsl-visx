import { createRapidDslMcpServer } from "./mcp/server.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
  const server = await createRapidDslMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[helium-rapid-dsl-mcp] Fatal error:", err);
  process.exitCode = 1;
});

