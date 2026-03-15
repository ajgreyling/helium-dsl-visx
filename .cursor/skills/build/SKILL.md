---
name: build
description: Build the Helium Rapid DSL (ANTLR4) extension—grammar, parser, metadata, language server, and VSCode client. Use when the user asks to build the extension, compile the grammar, or run the build pipeline.
---

# Build Helium DSL Extension

## When to use

- User says "build", "build the extension", "compile", or "run the build"
- User needs to regenerate grammar, parser, or metadata before packaging

## Prerequisites

**appexec-dsl-commons** – Path to the repo containing the ANTLR3 grammar:
- Required: `WebDSLParser-lib/src/main/antlr3/com/mezzanine/dsl/web/MezDSL.g`
- Set `DSL_COMMONS_PATH` (e.g. `/Users/ajgreyling/code/appexec-dsl-commons`)

## Command

From **helium-dsl-visx** repo root:

```bash
cd helium-vscode-tooling
DSL_COMMONS_PATH="/path/to/appexec-dsl-commons" npm run build:all
```

Or from **helium-vscode-tooling**:

```bash
DSL_COMMONS_PATH="/path/to/appexec-dsl-commons" npm run build:all
```

## What it does

1. Extract ANTLR3 grammar from dsl-commons
2. Convert ANTLR3 → ANTLR4, validate, generate parser (and fix ESM imports)
3. Extract rules, generate BIF metadata, language metadata, VXML metadata, TextMate grammar
4. Copy generated parser and VXML metadata into the language server
5. Build **helium-dsl-language-server** (TypeScript)
6. Build **helium-dsl-vscode** extension client

No VSIX is produced; use the **package** skill after a successful build to create the VSIX.

## Failures

- **Missing or invalid `DSL_COMMONS_PATH`** – Extract and language-metadata steps need it; script may fail or produce stub data.
- **Grammar file not found** – Ensure path contains `WebDSLParser-lib/.../MezDSL.g`.
- **Parser/validation errors** – Fix grammar or conversion in `helium-vscode-tooling/scripts/` (e.g. `convert-grammar.ts`).
