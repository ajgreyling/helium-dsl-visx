## Helium Rapid DSL MCP Server

This package provides an **MCP server** for Cursor agents working with **Helium Rapid DSL** files:
- **`.mez`** (Helium Rapid DSL (ANTLR4))
- **`.vxml`** (Helium UI views)

It is designed to reuse the existing Helium language server **AST/index/LSP-style features** for `.mez`, and adds a VXML parser/index plus language-key validation.

### What “full AST/LSP” means here

For `.mez` files, the MCP server exposes LSP-style queries backed by the same AST/index used by the language server:
- diagnostics (parser + lints)
- AST summary
- workspace symbols
- definition / references
- rename preview (WorkspaceEdit-style)
- formatting

For `.vxml` files, the MCP server provides:
- AST summary
- validation against `.mez` units/functions/variables + model attributes/enums + language keys across `web-app/lang/*.lang`
- lightweight tag/attribute completions
- suggested presenter stubs (missing init/actions/vars referenced by the view)

### Project semantics

- A Helium Rapid project root is detected by the presence of both `model/` and `web-app/` directories (and `.mez` files).
- Refactors like rename are intended to be **project-scoped**: only files within the owning Helium Rapid project should be edited.

### Build

```bash
cd helium-rapid-dsl-mcp
npm install
npm run build
```

Note: this package imports runtime code from `helium-dsl-language-server`, so build that first if you are developing locally:

```bash
cd ../helium-dsl-language-server
npm install
npm run build
```

### Run (stdio)

```bash
cd helium-rapid-dsl-mcp
node out/src/index.js
```

### Bundled in VSIX (Cursor)

When packaged, the MCP server is bundled inside the Helium Rapid DSL (ANTLR4) extension and registered in Cursor via `vscode.cursor.mcp.registerServer(...)`. The bundled entrypoint is:

- `helium-dsl-vscode/server/mcp/out/src/index.js`

This allows Cursor users to enable it directly from **MCP: List Servers** without manual configuration.

### Cursor MCP configuration (example)

Configure Cursor to run this MCP server via stdio, pointing to the built entrypoint.

- Command: `node`
- Args: `["/absolute/path/to/helium-dsl-visx/helium-rapid-dsl-mcp/out/src/index.js"]`

### Node ESM note (important for Cursor)

Cursor’s bundled Node may be strict about ESM specifiers (e.g. Node 25). In this repo we use explicit `.js` import suffixes where required (e.g. `vscode-languageserver/node.js`, `antlr4ts/.../*.js`) so the MCP server can start reliably.

### Tools (initial)

- `.mez`: `helium_mez_validate`, `helium_mez_ast`, `helium_mez_symbols`, `helium_mez_definition`, `helium_mez_references`, `helium_mez_rename_preview`, `helium_mez_format`
- `.vxml`: `helium_vxml_ast`, `helium_vxml_validate`, `helium_vxml_complete`, `helium_vxml_extract_unit_stubs`

