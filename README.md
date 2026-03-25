# Helium Rapid DSL Toolchain (Cursor-First)

This monorepo builds and packages the Helium Rapid DSL tooling stack used by Cursor: language server, MCP server, extension client, packaging pipeline, and optional CLI utilities.

## Package documentation

| Package | Role | README |
|---------|------|--------|
| `helium-dsl-language-server` | LSP: parse, index, diagnostics, completions | [helium-dsl-language-server/README.md](helium-dsl-language-server/README.md) |
| `helium-dsl-vscode` | Cursor/VS Code extension (client + bundled assets) | [helium-dsl-vscode/README.md](helium-dsl-vscode/README.md) |
| `helium-vscode-tooling` | Grammar → parser → metadata → VSIX build | [helium-vscode-tooling/README.md](helium-vscode-tooling/README.md) |
| `helium-rapid-dsl-mcp` | MCP server for agent tools (`.mez` / `.vxml`) | [helium-rapid-dsl-mcp/README.md](helium-rapid-dsl-mcp/README.md) |
| `helium-rapid-prune` | CLI to prune unused functions, units, `.lang` keys | [helium-rapid-prune/README.md](helium-rapid-prune/README.md) |

## Monorepo layout (short)

- `helium-dsl-language-server/` — LSP implementation ([readme](helium-dsl-language-server/README.md)).
- `helium-dsl-vscode/` — Extension ([readme](helium-dsl-vscode/README.md)).
- `helium-vscode-tooling/` — Generation and packaging ([readme](helium-vscode-tooling/README.md)).
- `helium-rapid-dsl-mcp/` — MCP server ([readme](helium-rapid-dsl-mcp/README.md)).
- `helium-rapid-prune/` — Publishable prune CLI ([readme](helium-rapid-prune/README.md)); optional workspace install, not always listed in root `workspaces`.

## Critical Rules

- Primary target IDE is Cursor.
- Do not manually edit generated artifacts:
  - `helium-vscode-tooling/generated/**`
  - `helium-dsl-language-server/generated/**`
  - `helium-dsl-language-server/out/**`
  - `helium-vscode-tooling/dist/**`
- Update source/scripts first, then regenerate.

## Quick Start

```bash
npm install
npm run build
npm run test
```

Useful targeted paths:

- Package extension: `helium-vscode-tooling/scripts/` and packaging scripts.
- MCP work: `helium-rapid-dsl-mcp/`.
- Language diagnostics/indexing: `helium-dsl-language-server/`.

## Build and Packaging Workflow

```mermaid
flowchart TD
    A[Source grammars and scripts] --> B[Generate parser/rules/metadata]
    B --> C[Build language server]
    C --> D[Build extension client]
    D --> E[Package VSIX]
    E --> F[Install in Cursor]
```

## Extension Runtime State Machine

```mermaid
stateDiagram-v2
    [*] --> ExtensionActivated
    ExtensionActivated --> LspBoot
    LspBoot --> MigrateProjectIndex
    MigrateProjectIndex --> Ready
    Ready --> FileChanged
    FileChanged --> Reindexing
    Reindexing --> Ready
    Ready --> Shutdown
    Shutdown --> [*]
```

## Human + AI Agent Onboarding Checklist

1. Read repository rules under `.cursor/rules/` first.
2. Choose your layer (LSP, MCP, or packaging) before changing code.
3. Never patch generated output directly.
4. Rebuild and rerun affected tests after changes.
5. Validate local VSIX install in Cursor when extension behavior changes.

## Deep references

- [helium-dsl-language-server/README.md](helium-dsl-language-server/README.md)
- [helium-dsl-vscode/README.md](helium-dsl-vscode/README.md)
- [helium-vscode-tooling/README.md](helium-vscode-tooling/README.md)
- [helium-rapid-dsl-mcp/README.md](helium-rapid-dsl-mcp/README.md)
- [helium-rapid-prune/README.md](helium-rapid-prune/README.md)
- `run.md`
- `.cursor/rules/` for project-specific constraints

