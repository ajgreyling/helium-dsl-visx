import * as path from "node:path";
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

export function activate(context: vscode.ExtensionContext) {
  console.log("[HeliumDSL] Activating extension...");
  
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

