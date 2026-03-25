# helium-dsl-language-server

TypeScript **Language Server Protocol (LSP)** implementation for **Helium Rapid DSL** (`.mez`), **VXML** (`.vxml`), and **language files** (`.lang`). It drives parsing, indexing, diagnostics, completions, navigation, formatting, and unused-code analysis for the Cursor/VS Code extension and for tooling such as the [MCP server](../helium-rapid-dsl-mcp/README.md) and [rapid-prune CLI](../helium-rapid-prune/README.md).

## Relationship to the build pipeline

The ANTLR4 parser and related generated assets are produced under [`helium-vscode-tooling`](../helium-vscode-tooling/README.md). Running `npm run build:all` there copies `generated/parser/**` and VXML metadata into this package’s `generated/` tree before compiling the language server.

Do **not** hand-edit `generated/**`; change generators in `helium-vscode-tooling/scripts/` and rebuild.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | `tsc -b` — compile to `out/` |
| `npm run watch` | Watch mode |
| `npm run clean` | Remove `out/` |
| `npm test` | Mocha tests under `tests/**` and `generated/tests/**` |

## Module entry points

- **LSP server**: `out/server.js` (package `main`)
- **Programmatic API** (for MCP and other Node consumers): `helium-dsl-language-server/api` → `out/src/api.js`

Prefer importing the stable **`./api`** surface from other packages instead of deep imports from compiled internals.

## Local development

From the repo root (workspaces):

```bash
npm install
cd helium-vscode-tooling && npm run build:all
```

Or, if `helium-dsl-language-server/generated` is already in sync:

```bash
cd helium-dsl-language-server
npm install
npm run build
npm test
```

## Configuration in Helium projects

Project-wide behaviour (unused diagnostics severity, debug hints for tooling) is read from `helium-rapid-dsl-project.json` at the DSL root. See the [extension README](../helium-dsl-vscode/README.md#project-configuration-file) for the schema.

## See also

- [Repository root README](../README.md)
- [Extension client](../helium-dsl-vscode/README.md)
- [Build and packaging](../helium-vscode-tooling/README.md)
