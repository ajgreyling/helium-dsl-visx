## Helium Rapid DSL MCP Server

This package provides an **MCP server** for Cursor agents working with **Helium Rapid DSL** files:
- **`.mez`** (Helium DSL)
- **`.vxml`** (Helium UI views)

It is designed to reuse the existing Helium language-server AST/index for `.mez`, and add a VXML parser/index plus language-key validation.

### Project semantics

- A Helium Rapid project root is detected by the presence of both `model/` and `web-app/` directories (and `.mez` files).
- Refactors like rename are intended to be **project-scoped**: only files within the owning Helium Rapid project should be edited.

### Build

```bash
cd helium-rapid-dsl-mcp
npm install
npm run build
```

### Run (stdio)

```bash
cd helium-rapid-dsl-mcp
node out/index.js
```

### Cursor MCP configuration (example)

Configure Cursor to run this MCP server via stdio, pointing to the built entrypoint.

- Command: `node`
- Args: `["/absolute/path/to/helium-dsl-visx/helium-rapid-dsl-mcp/out/index.js"]`

### Tools (initial)

- `.mez`: `helium_mez_validate`, `helium_mez_ast`, `helium_mez_symbols`, `helium_mez_definition`, `helium_mez_references`, `helium_mez_rename_preview`, `helium_mez_format`
- `.vxml`: `helium_vxml_ast`, `helium_vxml_validate`, `helium_vxml_complete`, `helium_vxml_extract_unit_stubs`

