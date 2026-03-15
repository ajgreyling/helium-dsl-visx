---
name: package
description: Package the Helium Rapid DSL (ANTLR4) extension into a VSIX using local packaging. Use when the user asks to package the extension, create the VSIX, or build the installable .vsix file.
---

# Package Helium DSL Extension (VSIX)

## When to use

- User says "package", "package the extension", "create the VSIX", or "build the vsix"
- User has already run the **build** and wants an installable `.vsix` file

## Prerequisites

1. **Build must be done first** – Run the **build** skill (or `helium-vscode-tooling` build pipeline) so that language server and extension are built and generated files exist.
2. **Parser errors** – If the build pipeline wrote parser errors to `helium-dsl-language-server/generated/parser-errors.json`, packaging will fail; fix parser/grammar issues and rebuild.

## Command

From **helium-dsl-visx** repo root:

```bash
cd helium-dsl-vscode
npm run package
```

This runs `helium-vscode-tooling/scripts/package-local.sh`, which builds prerequisites (language server, extension, MCP) on the host if needed, then packages in a temporary directory.

## Output

- **VSIX path**: `helium-vscode-tooling/dist/helium-dsl.vsix`
- Install in Cursor: `cursor --install-extension helium-vscode-tooling/dist/helium-dsl.vsix --force`

## What packaging does

- Builds language server, extension, and MCP if not already built
- Creates a temporary directory outside the workspace (avoids npm workspace hoisting issues)
- Copies extension, language server output, and dependencies into the temp dir
- Flattens dependencies and runs `vsce package` (with full dependencies, never `--no-dependencies`)
- Writes `helium-dsl.vsix` to `helium-vscode-tooling/dist/`

## Failures

- **Parser errors file present** – Script exits if `HELIUM_PARSER_ERRORS_FILE` is set and non-empty; clear parser errors and rebuild.
- **Missing build outputs** – Ensure `helium-dsl-language-server/out` and `helium-dsl-vscode/out` exist; run the **build** skill first.
- **vsce validation errors** – Usually dependency or `package.json` issues; do not use `--no-dependencies`.
