import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types";
import { createMezToolHandlers } from "./mezHandlers.js";
import { createVxmlToolHandlers } from "./vxmlHandlers.js";

export type ToolHandler = (args: Record<string, unknown>) => Promise<CallToolResult>;

export const tools: Tool[] = [
  {
    name: "helium_mez_validate",
    description: "Validate a .mez file (parser + lints).",
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
    description: "Validate a .vxml file (structure, unit/function/variable references, model attributes, and language keys).",
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
  };
  for (const t of tools) {
    if (!map[t.name]) {
      map[t.name] = notImplemented(t.name);
    }
  }
  return map;
}

