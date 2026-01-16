import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  Trace,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;
let userDefinedTypes: string[] = [];
let outputChannel: vscode.OutputChannel | undefined;

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
  // #region agent log
  (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-test-3',hypothesisId:'H1',location:'helium-dsl-vscode/src/extension.ts:49',message:'activate',data:{workspaceFolders:(vscode.workspace.workspaceFolders?.length ?? 0),appName:vscode.env.appName,extensionId:context.extension?.id ?? 'unknown',extensionVersion:context.extension?.packageJSON?.version ?? 'unknown'},timestamp:Date.now()})}).catch(()=>{});
  // #endregion agent log
  
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
    vscode.window.showErrorMessage(`Helium DSL: Language server not found. Please rebuild the extension.`);
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
  outputChannel = vscode.window.createOutputChannel("Helium DSL Language Server");
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
    "Helium DSL Language Server",
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
      
      // Trigger semantic tokens refresh for all open Helium DSL documents
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
        outputChannel.appendLine("Helium DSL Language Server started successfully");
        outputChannel.appendLine(`[HeliumDSL] Server module: ${serverModule}`);
        outputChannel.appendLine(`[HeliumDSL] Trace level: ${traceConfig}`);
      }
    },
    (error) => {
      const errorMsg = `[HeliumDSL] ERROR: Failed to start language client: ${error}`;
      console.error(errorMsg);
      if (outputChannel) {
        outputChannel.appendLine(`ERROR: ${errorMsg}`);
        outputChannel.show(true);
      }
      vscode.window.showErrorMessage(`Helium DSL: Failed to start language server. Check the output channel for details.`);
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
  // #region agent log
  (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-test-3',hypothesisId:'H1',location:'helium-dsl-vscode/src/extension.ts:195',message:'mcp_api_check',data:{lmPresent:Boolean(vscodeAny.lm),providerFn:Boolean(vscodeAny.lm?.registerMcpServerDefinitionProvider),hasCtor:Boolean(vscodeAny.McpStdioServerDefinition)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion agent log
  if (!vscodeAny.lm || !vscodeAny.lm.registerMcpServerDefinitionProvider) {
    console.log("[HeliumDSL] MCP API not available - skipping MCP server registration");
    return;
  }

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
    const didChangeEmitter = new vscode.EventEmitter<void>();

    context.subscriptions.push(
      vscodeAny.lm.registerMcpServerDefinitionProvider("heliumRapidDsl", {
        onDidChangeMcpServerDefinitions: didChangeEmitter.event,
        provideMcpServerDefinitions: async (): Promise<any[]> => {
          // #region agent log
          (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-test-3',hypothesisId:'H2',location:'helium-dsl-vscode/src/extension.ts:217',message:'provide_mcp_definitions',data:{entrypointExists:fs.existsSync(mcpEntrypoint),hasDefinitionCtor:Boolean(vscodeAny.McpStdioServerDefinition)},timestamp:Date.now()})}).catch(()=>{});
          // #endregion agent log
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
            // #region agent log
            (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-test-3',hypothesisId:'H5',location:'helium-dsl-vscode/src/extension.ts:230',message:'mcp_definition_shape',data:{labelType:typeof def?.label,labelValue:String(def?.label),labelCtor:def?.label?.constructor?.name,commandType:typeof def?.command,hasId:Object.prototype.hasOwnProperty.call(def ?? {},'id'),cwdType:typeof def?.cwd,cwdIsUri:def?.cwd instanceof vscode.Uri,argsCount:Array.isArray(def?.args)?def?.args.length:0},timestamp:Date.now()})}).catch(()=>{});
            // #endregion agent log
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
            // #region agent log
            (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-test-3',hypothesisId:'H5',location:'helium-dsl-vscode/src/extension.ts:245',message:'mcp_definition_shape_fallback',data:{labelType:typeof def.label,labelValue:String(def.label),labelCtor:(def as any).label?.constructor?.name,commandType:typeof def.command,hasId:Object.prototype.hasOwnProperty.call(def,'id'),cwdType:typeof def.cwd,cwdIsUri:def.cwd instanceof vscode.Uri,argsCount:Array.isArray(def.args)?def.args.length:0},timestamp:Date.now()})}).catch(()=>{});
            // #endregion agent log
            return [def];
          }
        },
        resolveMcpServerDefinition: async (server: any): Promise<any> => {
          // #region agent log
          (globalThis as any).fetch('http://127.0.0.1:7243/ingest/f8eecc7d-5d84-4f56-8e99-5ad9d9836767',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'mcp-test-1',hypothesisId:'H2',location:'helium-dsl-vscode/src/extension.ts:246',message:'resolve_mcp_definition',data:{label:server?.label ?? 'unknown',type:server?.type ?? 'unknown'},timestamp:Date.now()})}).catch(()=>{});
          // #endregion agent log
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
 * Refresh semantic tokens for all open Helium DSL documents
 * Semantic tokens will be automatically recomputed when VS Code requests them,
 * but we can trigger a refresh by requesting semantic tokens refresh from the language server.
 */
function refreshSemanticTokens(): void {
  if (!client) {
    return;
  }

  // Find all open Helium DSL documents
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

