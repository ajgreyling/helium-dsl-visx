import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
import * as childProcess from "child_process";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  Trace,
} from "vscode-languageclient/node.js";

let client: LanguageClient | undefined;
let userDefinedTypes: string[] = [];
let outputChannel: vscode.OutputChannel | undefined;
let mcpChild: childProcess.ChildProcessWithoutNullStreams | undefined;

/**
 * Automatically set the Helium Icons theme if the user hasn't configured a different icon theme.
 * This respects user preferences by only setting it if they're using the default themes.
 */
async function setIconThemeIfNotConfigured(): Promise<void> {
  try {
    const workbenchConfig = vscode.workspace.getConfiguration("workbench");
    const currentTheme = workbenchConfig.get<string>("iconTheme");
    
    // Default themes that indicate no user preference
    const defaultThemes = ["vs-seti", "vs-minimal"];
    
    // Only set if theme is unset or set to a default theme
    if (!currentTheme || defaultThemes.includes(currentTheme)) {
      await workbenchConfig.update(
        "iconTheme",
        "helium-icons",
        vscode.ConfigurationTarget.Global
      );
      console.log("[HeliumDSL] Set file icon theme to 'helium-icons'");
    } else {
      console.log(`[HeliumDSL] Icon theme already configured to '${currentTheme}', skipping auto-set`);
    }
  } catch (error) {
    // Don't fail activation if setting icon theme fails
    const errorMsg = `[HeliumDSL] Failed to set icon theme (non-fatal): ${error}`;
    console.log(errorMsg);
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("[HeliumDSL] Activating extension...");
  
  // Set icon theme automatically if not already configured
  setIconThemeIfNotConfigured();
  
  // The language server compiles to out/src/server.js (not out/server.js)
  const serverModule = context.asAbsolutePath(
    path.join("server", "out", "src", "server.js")
  );

  console.log(`[HeliumDSL] Server module path: ${serverModule}`);
  console.log(`[HeliumDSL] Extension context path: ${context.extensionPath}`);

  // Check if server file exists
  if (!fs.existsSync(serverModule)) {
    const errorMsg = `[HeliumDSL] ERROR: Server file not found at ${serverModule}`;
    console.error(errorMsg);
    vscode.window.showErrorMessage(`Helium Rapid DSL (ANTLR4): Language server not found. Please rebuild the extension.`);
    return;
  }

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ["--nolazy", "--inspect=6009"] },
    },
  };

  // Create output channel for language server logs
  outputChannel = vscode.window.createOutputChannel("Helium Rapid DSL (ANTLR4) Language Server");
  context.subscriptions.push(outputChannel);

  // Read trace level from configuration
  const config = vscode.workspace.getConfiguration("heliumDsl");
  const traceConfig = config.get<string>("trace.server", "off");
  
  // Map configuration values to Trace enum
  let traceLevel: Trace;
  switch (traceConfig) {
    case "messages":
      traceLevel = Trace.Messages;
      break;
    case "verbose":
      traceLevel = Trace.Verbose;
      break;
    case "off":
    default:
      traceLevel = Trace.Off;
      break;
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: "file", language: "helium-dsl" },
      { scheme: "file", language: "helium-vxml" },
    ],
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher("**/*.mez"),
    },
    outputChannel: outputChannel,
    traceOutputChannel: outputChannel,
    initializationOptions: {
      trace: traceConfig,
    },
  };

  client = new LanguageClient(
    "heliumDslLanguageServer",
    "Helium Rapid DSL (ANTLR4) Language Server",
    serverOptions,
    clientOptions
  );

  // Register handler for user types notification early so we don't miss notifications
  client.onNotification("helium/userTypes", (types: string[]) => {
    try {
      userDefinedTypes = types;
      if (outputChannel) {
        outputChannel.appendLine(`[HeliumDSL] Discovered ${types.length} user-defined types:`);
        for (const t of types) {
          outputChannel.appendLine(`  - ${t}`);
        }
        outputChannel.appendLine(`[HeliumDSL] Triggering semantic tokens refresh...`);
      }
      
      // Trigger semantic tokens refresh for all open Helium Rapid DSL (ANTLR4) documents
      refreshSemanticTokens();
    } catch (err) {
      const errorMsg = `[HeliumDSL] Error handling helium/userTypes notification: ${err}`;
      console.error(errorMsg);
      if (outputChannel) {
        outputChannel.appendLine(`ERROR: ${errorMsg}`);
      }
    }
  });

  // The `onNotification` handler above is sufficient for receiving `helium/userTypes`.
  // Avoid using `client.onReady()` here because some `vscode-languageclient`
  // versions do not expose that method on the `LanguageClient` type.

  console.log("[HeliumDSL] Starting language client...");
  if (outputChannel) {
    outputChannel.appendLine("[HeliumDSL] Starting language client...");
    outputChannel.show(true); // Show the output channel so user can see logs
  }
  
  client.start().then(
    () => {
      // Set trace level after client starts
      if (client) {
        client.setTrace(traceLevel);
      }
      console.log("[HeliumDSL] Language client started successfully");
      if (outputChannel) {
        outputChannel.appendLine("Helium Rapid DSL (ANTLR4) Language Server started successfully");
        outputChannel.appendLine(`[HeliumDSL] Server module: ${serverModule}`);
        outputChannel.appendLine(`[HeliumDSL] Trace level: ${traceConfig}`);
      }
    },
    (error: unknown) => {
      const errorMsg = `[HeliumDSL] ERROR: Failed to start language client: ${error}`;
      console.error(errorMsg);
      if (outputChannel) {
        outputChannel.appendLine(`ERROR: ${errorMsg}`);
        outputChannel.show(true);
      }
      vscode.window.showErrorMessage(`Helium Rapid DSL (ANTLR4): Failed to start language server. Check the output channel for details.`);
    }
  );
  
  context.subscriptions.push({ dispose: () => client?.stop() });

  // Register MCP server definition provider
  registerMcpServerProvider(context);
}

/**
 * Register the Helium Rapid DSL MCP server definition provider.
 * Uses runtime feature detection since TypeScript types may not be available.
 */
function registerMcpServerProvider(context: vscode.ExtensionContext): void {
  // Check if MCP API is available (runtime feature detection)
  const vscodeAny = vscode as any;
  const cursorMcp = vscodeAny?.cursor?.mcp;

  try {
    const mcpEntrypoint = context.asAbsolutePath(
      path.join("server", "mcp", "out", "src", "index.js")
    );

    // Verify MCP server file exists
    if (!fs.existsSync(mcpEntrypoint)) {
      console.warn(`[HeliumDSL] MCP server not found at ${mcpEntrypoint} - skipping registration`);
      return;
    }

    const mcpCwd = context.asAbsolutePath(path.join("server", "mcp"));

    // Cursor MCP Extension API (preferred in Cursor; legacy provider is not supported there)
    if (cursorMcp?.registerServer) {
      // Start a local MCP server in SSE mode and register it via server.url.
      // This avoids Cursor's lack of `cwd` support for MCP servers when registering stdio commands.
      // In Cursor, `process.execPath` may point at a helper binary (not Node). Prefer a real Node.
      // `spawn("node", ...)` uses PATH resolution and works in typical Cursor installs.
      const nodeExec = process.env.VSCODE_NODE_EXECUTABLE || "node";
      const baseEnv: Record<string, string> = {};

      // Ensure we don't leak multiple processes across reloads.
      if (mcpChild && !mcpChild.killed) {
        try {
          mcpChild.kill();
        } catch {
          // ignore
        }
        mcpChild = undefined;
      }

      const childArgs = [
        mcpEntrypoint,
        "--transport",
        "sse",
        "--host",
        "127.0.0.1",
        "--port",
        "0",
      ];

      mcpChild = childProcess.spawn(nodeExec, childArgs, {
        cwd: mcpCwd,
        env: { ...process.env, ...baseEnv },
        stdio: "pipe",
      });

      context.subscriptions.push({
        dispose: () => {
          try {
            mcpChild?.kill();
          } catch {
            // ignore
          }
          mcpChild = undefined;
        },
      });

      let registered = false;
      let stdoutBuf = "";

      const tryRegisterFromLine = (line: string) => {
        if (registered) return;
        const trimmed = line.trim();
        if (!trimmed.startsWith("{")) return;
        try {
          const msg = JSON.parse(trimmed);
          if (msg?.type !== "mcp-sse-ready" || typeof msg?.url !== "string") return;
          registered = true;
          Promise.resolve(
            cursorMcp.registerServer({
              name: "heliumRapidDsl",
              server: { url: msg.url, headers: {} },
            })
          ).then(
            () => {
              console.log(`[HeliumDSL] Registered MCP SSE server via cursor API: ${msg.url}`);
            },
            (err: unknown) => {
              console.warn(`[HeliumDSL] Failed to register MCP SSE server via cursor API: ${err}`);
            }
          );
        } catch {
          // ignore non-JSON lines
        }
      };

      mcpChild.stdout.on("data", (d: Buffer) => {
        stdoutBuf += d.toString("utf8");
        while (true) {
          const idx = stdoutBuf.indexOf("\n");
          if (idx === -1) break;
          const line = stdoutBuf.slice(0, idx);
          stdoutBuf = stdoutBuf.slice(idx + 1);
          tryRegisterFromLine(line);
        }
      });

      mcpChild.stderr.on("data", (d: Buffer) => {
        const text = d.toString("utf8");
        console.warn(`[HeliumDSL] MCP stderr: ${text}`);
      });

      mcpChild.on("error", (err: unknown) => {
      });

      mcpChild.on("exit", (code, signal) => {
        if (!registered) {
          console.warn(`[HeliumDSL] MCP SSE process exited before registration (code=${code}, signal=${signal})`);
        }
      });

      return;
    }

    // Legacy API (VS Code). Cursor logs warn this is unsupported.
    if (!vscodeAny.lm || !vscodeAny.lm.registerMcpServerDefinitionProvider) {
      console.log("[HeliumDSL] MCP API not available - skipping MCP server registration");
      return;
    }
    const didChangeEmitter = new vscode.EventEmitter<void>();

    context.subscriptions.push(
      vscodeAny.lm.registerMcpServerDefinitionProvider("heliumRapidDsl", {
        onDidChangeMcpServerDefinitions: didChangeEmitter.event,
        provideMcpServerDefinitions: async (): Promise<any[]> => {
          // Use McpStdioServerDefinition if available, otherwise construct manually
          if (vscodeAny.McpStdioServerDefinition) {
            const def = new vscodeAny.McpStdioServerDefinition({
                label: "Helium Rapid DSL MCP Server",
                command: "node",
                args: [mcpEntrypoint],
                cwd: vscode.Uri.file(mcpCwd),
                env: {},
                version: "0.1.0",
              });
            return [def];
          } else {
            // Fallback: construct server definition object manually
            const def = {
                type: "stdio",
                label: "Helium Rapid DSL MCP Server",
                command: "node",
                args: [mcpEntrypoint],
                cwd: vscode.Uri.file(mcpCwd),
                env: {},
                version: "0.1.0",
              };
            return [def];
          }
        },
        resolveMcpServerDefinition: async (server: any): Promise<any> => {
          // No additional resolution needed - server is ready to start
          return server;
        },
      })
    );

    console.log("[HeliumDSL] MCP server definition provider registered");
    console.log(`[HeliumDSL] MCP entrypoint: ${mcpEntrypoint}`);
  } catch (error) {
    const errorMsg = `[HeliumDSL] Failed to register MCP server provider: ${error}`;
    console.error(errorMsg);
    if (outputChannel) {
      outputChannel.appendLine(`ERROR: ${errorMsg}`);
    }
  }
}

/**
 * Refresh semantic tokens for all open Helium Rapid DSL (ANTLR4) documents
 * Semantic tokens will be automatically recomputed when VS Code requests them,
 * but we can trigger a refresh by requesting semantic tokens refresh from the language server.
 */
function refreshSemanticTokens(): void {
  if (!client) {
    return;
  }

  // Find all open Helium Rapid DSL (ANTLR4) documents
  const openDocuments = vscode.workspace.textDocuments.filter(
    (doc) => doc.languageId === "helium-dsl"
  );

  if (openDocuments.length === 0) {
    return;
  }

  console.log(`[HeliumDSL] Refreshing semantic tokens for ${openDocuments.length} document(s)`);
  if (outputChannel) {
    outputChannel.appendLine(`[HeliumDSL] Refreshing semantic tokens for ${openDocuments.length} document(s)`);
  }
  
  // Request semantic tokens refresh from the language server
  // The language server will re-compute tokens when VS Code requests them
  // We can also try to trigger a refresh by sending a workspace semantic tokens refresh notification
  client.sendRequest("workspace/semanticTokens/refresh", undefined).then(
    () => {
      console.log("[HeliumDSL] Semantic tokens refresh requested");
      if (outputChannel) {
        outputChannel.appendLine("[HeliumDSL] Semantic tokens refresh requested successfully");
      }
    },
    (err: unknown) => {
      // This might fail if the server doesn't support it, but that's OK
      // Semantic tokens will still be requested automatically when documents change
      const errorMsg = `[HeliumDSL] Semantic tokens refresh request failed (this is OK): ${err}`;
      console.log(errorMsg);
      if (outputChannel) {
        outputChannel.appendLine(errorMsg);
      }
    }
  );
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

