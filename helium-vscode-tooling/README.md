# helium-vscode-tooling

Build and code-generation pipeline for the **Helium Rapid DSL (ANTLR4)** stack: grammar extraction/conversion, TypeScript parser generation, lint rules, BIF and language metadata, VXML metadata, TextMate grammars, full workspace build, and **local VSIX packaging**.

## Outputs

Generated artifacts live under `generated/` (grammar, parser, rules, bifs, language JSON, VXML JSON, syntaxes). These are **not** meant to be edited by hand; update scripts under `scripts/` and regenerate.

The `build:all` step also **copies** parser and VXML metadata into [`helium-dsl-language-server`](../helium-dsl-language-server/README.md) so the language server can compile against them.

## Common scripts

| Script | Purpose |
|--------|---------|
| `npm run build:all` | End-to-end: extract grammar → parser → metadata → TextMate → copy to language server → build LSP + extension |
| `npm run build:extract` | Pull ANTLR3 grammar from dsl-commons (see script for paths) |
| `npm run build:grammar` | Convert ANTLR3 → ANTLR4 |
| `npm run build:validate` | Validate `MezDSL.g4` |
| `npm run build:parser` | Run `antlr4ts` + import fix |
| `npm run build:rules` | Lint rule metadata → `generated/rules/` |
| `npm run build:bifs` | Built-in function metadata |
| `npm run build:language` | Keywords / language metadata bundle |
| `npm run build:vxml` | VXML node metadata (needs dsl-commons / `DSL_COMMONS_PATH`) |
| `npm run build:textmate` | TextMate grammars for `.mez` / `.vxml` |
| `npm run package` | Local VSIX build via `scripts/package-local.sh` → `dist/helium-dsl.vsix` |
| `npm run package:all` | Orchestrated packaging entry |
| `npm test` | Tooling tests |

## Packaging constraints

VSIX packaging uses an isolated temp directory and bundles the language server `out/` and `node_modules` under the extension’s `server/` tree. Do not use `vsce package --no-dependencies`; the scripts enforce a full production dependency tree for Cursor compatibility.

## Consumers

- [`helium-dsl-vscode`](../helium-dsl-vscode/README.md) — extension manifest, client, bundled `generated/` at package time
- [`helium-dsl-language-server`](../helium-dsl-language-server/README.md) — consumes copied parser and metadata
- [`helium-rapid-dsl-mcp`](../helium-rapid-dsl-mcp/README.md) — copies VXML metadata at build; bundles LSP for npm

## See also

- [Repository root README](../README.md)
- [.cursor/rules](../.cursor/rules/) for generated-path and packaging rules
