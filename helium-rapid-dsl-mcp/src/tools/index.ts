import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types";
import { createMezToolHandlers } from "./mezHandlers.js";
import { createVxmlToolHandlers } from "./vxmlHandlers.js";
import { createDebugToolHandlers } from "./debugHandlers.js";

export type ToolHandler = (args: Record<string, unknown>) => Promise<CallToolResult>;

export const tools: Tool[] = [
  {
    name: "helium_mez_validate",
    description:
      "Validate a .mez file (parser, lint, semantic). Includes unused-function/units/models when configured; unused .lang keys are reported when validating .lang (diagnostics.unused.languageEntries, default Info). View actions from .vxml are merged from disk when the MCP workspace root is the Helium project folder (e.g. dsl/). Prefer helium_mez_lint for lint-focused workflows.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string", description: "Absolute path to the .mez file." },
        text: { type: "string", description: "Optional in-memory text override." }
      },
      required: ["filePath"]
    }
  },
  {
    name: "helium_mez_lint",
    description:
      "Preferred .mez linting: parser + lint + semantic + severity summary. Unused diagnostics account for view-bound methods referenced from .vxml when workspace root contains those files (use dsl/ as MCP cwd/root for Rapid projects).",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string", description: "Absolute path to the .mez file." },
        text: { type: "string", description: "Optional in-memory text override." }
      },
      required: ["filePath"]
    }
  },
  {
    name: "helium_mez_ast",
    description: "Return a compact AST summary for a .mez file.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string", description: "Absolute path to the .mez file." },
        text: { type: "string", description: "Optional in-memory text override." }
      },
      required: ["filePath"]
    }
  },
  {
    name: "helium_mez_symbols",
    description: "List known workspace symbols (types, units, enums, functions) discovered from .mez files.",
    inputSchema: {
      type: "object",
      properties: {
        workspaceRoot: { type: "string", description: "Absolute path to a workspace root to scan. If omitted, uses process.cwd()." },
        query: { type: "string", description: "Optional substring filter." }
      },
      required: []
    }
  },
  {
    name: "helium_mez_definition",
    description: "Resolve definition at a position in a .mez file.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        line: { type: "number", description: "0-based line." },
        character: { type: "number", description: "0-based character." }
      },
      required: ["filePath", "line", "character"]
    }
  },
  {
    name: "helium_mez_references",
    description: "Find references for the symbol at a position in a .mez file.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        line: { type: "number" },
        character: { type: "number" },
        includeDeclaration: { type: "boolean", default: false }
      },
      required: ["filePath", "line", "character"]
    }
  },
  {
    name: "helium_mez_rename_preview",
    description: "Compute rename edits for the symbol at a position in a .mez file (returns WorkspaceEdit-style changes).",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        line: { type: "number" },
        character: { type: "number" },
        newName: { type: "string" }
      },
      required: ["filePath", "line", "character", "newName"]
    }
  },
  {
    name: "helium_mez_format",
    description: "Format a .mez file and return the formatted text.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        text: { type: "string", description: "Optional in-memory text override." }
      },
      required: ["filePath"]
    }
  },
  {
    name: "helium_mez_complete",
    description: "Get completion items for a .mez file at a position.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        line: { type: "number", description: "0-based line." },
        character: { type: "number", description: "0-based character." },
        text: { type: "string", description: "Optional in-memory text override." },
        triggerCharacter: { type: "string", description: "Optional trigger character (e.g. '.' or ':')." }
      },
      required: ["filePath", "line", "character"]
    }
  },
  {
    name: "helium_mez_signature_help",
    description: "Get signature help for a .mez file at a position.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        line: { type: "number", description: "0-based line." },
        character: { type: "number", description: "0-based character." },
        text: { type: "string", description: "Optional in-memory text override." }
      },
      required: ["filePath", "line", "character"]
    }
  },
  {
    name: "helium_mez_hover",
    description: "Get hover information for a .mez file at a position.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        line: { type: "number", description: "0-based line." },
        character: { type: "number", description: "0-based character." },
        text: { type: "string", description: "Optional in-memory text override." }
      },
      required: ["filePath", "line", "character"]
    }
  },
  {
    name: "helium_mez_document_symbols",
    description: "Get document symbols (outline) for a .mez file.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        text: { type: "string", description: "Optional in-memory text override." }
      },
      required: ["filePath"]
    }
  },
  {
    name: "helium_mez_code_actions",
    description: "Get code actions (quick fixes) for diagnostics in a .mez file.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        text: { type: "string", description: "Optional in-memory text override." },
        diagnostics: { type: "array", description: "Optional LSP-style diagnostics array. If omitted, diagnostics will be computed.", items: { type: "object" } }
      },
      required: ["filePath"]
    }
  },
  {
    name: "helium_mez_call_hierarchy",
    description: "Call hierarchy for .mez (prepare/incoming/outgoing).",
    inputSchema: {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["prepare", "incoming", "outgoing"] },
        filePath: { type: "string", description: "Required for prepare." },
        line: { type: "number", description: "0-based line (prepare)." },
        character: { type: "number", description: "0-based character (prepare)." },
        text: { type: "string", description: "Optional in-memory text override (prepare)." },
        item: { type: "object", description: "CallHierarchyItem-like object (incoming/outgoing)." }
      },
      required: ["mode"]
    }
  },
  {
    name: "helium_mez_explain_symbol",
    description: "Agent-friendly symbol explanation (definition, references, signature/hover, context).",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        line: { type: "number", description: "0-based line." },
        character: { type: "number", description: "0-based character." },
        includeReferences: { type: "boolean", default: true },
        maxReferences: { type: "number", default: 50 }
      },
      required: ["filePath", "line", "character"]
    }
  },
  {
    name: "helium_mez_apply_workspace_edit",
    description: "Apply a WorkspaceEdit-style change set to disk (scoped to the Helium Rapid project root).",
    inputSchema: {
      type: "object",
      properties: {
        rootHintFilePath: { type: "string", description: "Absolute path to a file inside the target Helium Rapid project root." },
        edit: { type: "object", description: "WorkspaceEdit-style object with a 'changes' map keyed by URI." }
      },
      required: ["rootHintFilePath", "edit"]
    }
  },
  {
    name: "helium_vxml_ast",
    description: "Return a compact AST summary for a .vxml file.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string", description: "Absolute path to the .vxml file." },
        text: { type: "string", description: "Optional in-memory text override." }
      },
      required: ["filePath"]
    }
  },
  {
    name: "helium_vxml_validate",
    description:
      "Legacy validation for a .vxml file. Checks structure and cross-file references (units/functions/variables, model attributes, enums, language keys). Prefer helium_vxml_lint for lint-focused workflows.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string", description: "Absolute path to the .vxml file." },
        text: { type: "string", description: "Optional in-memory text override." }
      },
      required: ["filePath"]
    }
  },
  {
    name: "helium_vxml_lint",
    description:
      "Preferred .vxml linting tool. Validates view structure and cross-file references, then returns diagnostics plus a severity summary (errors/warnings/info/hints).",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string", description: "Absolute path to the .vxml file." },
        text: { type: "string", description: "Optional in-memory text override." }
      },
      required: ["filePath"]
    }
  },
  {
    name: "helium_vxml_complete",
    description: "Provide simple tag/attribute completions for .vxml at a position.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        line: { type: "number" },
        character: { type: "number" }
      },
      required: ["filePath", "line", "character"]
    }
  },
  {
    name: "helium_vxml_extract_unit_stubs",
    description: "Given a .vxml file, suggest missing .mez unit stubs for init/actions/variables referenced by the view.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: { type: "string" },
        text: { type: "string" }
      },
      required: ["filePath"]
    }
  },
  {
    name: "helium_debug_start_log_stream",
    description:
      "Start streaming Helium platform debug logs (WSS) and expose them via a local SSE URL, using credentials/appId from helium-rapid-dsl-project.json.",
    inputSchema: {
      type: "object",
      properties: {
        workspaceRoot: { type: "string", description: "Optional Rapid DSL project root." },
        rootHintFilePath: { type: "string", description: "Optional file path inside the project to locate the root." },
        port: { type: "number", description: "Optional fixed port for the local SSE server." }
      },
      required: []
    }
  },
  {
    name: "helium_debug_stop_log_stream",
    description: "Stop a previously started debug log stream (by handle or project root).",
    inputSchema: {
      type: "object",
      properties: {
        handle: { type: "string", description: "Handle returned by helium_debug_start_log_stream." },
        workspaceRoot: { type: "string", description: "Optional Rapid DSL project root." },
        rootHintFilePath: { type: "string", description: "Optional file path inside the project to locate the root." }
      },
      required: []
    }
  }
];

export async function createToolHandlers(): Promise<Record<string, ToolHandler>> {
  const notImplemented = (toolName: string): ToolHandler => {
    return async () => ({
      content: [{ type: "text", text: `${toolName} is not implemented yet.` }],
      isError: true
    });
  };

  const map: Record<string, ToolHandler> = {
    ...createMezToolHandlers(),
    ...createVxmlToolHandlers(),
    ...createDebugToolHandlers(),
  };
  for (const t of tools) {
    if (!map[t.name]) {
      map[t.name] = notImplemented(t.name);
    }
  }
  return map;
}

