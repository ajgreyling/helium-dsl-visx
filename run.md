# `./run.sh` pipeline (what runs, where, and what’s duplicated)

This document describes what happens when you run `./run.sh` from the repo root, and why some steps appear to run twice.

## Entry point(s)

### `./run.sh` (repo root)

`run.sh` is a thin wrapper:

- `cd helium-vscode-tooling`
- Runs `./validate-dsl.sh` with **hardcoded** arguments:
  - `-d /Users/ajgreyling/code/appexec-dsl-commons`
  - `-p /Users/ajgreyling/code/munic-chat`

If you want to validate a different corpus, you currently edit `run.sh` (or run `validate-dsl.sh` directly with your own `-d/-p`).

## What `validate-dsl.sh` does (step-by-step)

Script: `helium-vscode-tooling/validate-dsl.sh`

### Step “Config”: generate a Mocha test for your sample project

- Creates/overwrites:
  - `helium-dsl-language-server/generated/tests/<corpus>.test.ts`
    - `<corpus>` is `basename(<sample-project-path>)` (e.g. `munic-chat.test.ts`)
    - This test:
      - Recursively finds all `.mez` files in the sample project
      - Runs **parser diagnostics** (`parseText`)
      - Runs **lints** (`runLints`)
      - Runs **semantic diagnostics** (`createSemanticDiagnostics`) using `ProjectManager`

### Step 0: verify tooling dependencies (tsx)

- Checks for `tsx` in:
  - repo-root `node_modules/.bin/tsx`, or
  - local `helium-vscode-tooling/node_modules/.bin/tsx`, or
  - `PATH`

### Step 1–8: generate all “derived artifacts” from the upstream grammar

All of these run in `helium-vscode-tooling/`:

1. **Extract grammar**: `npm run build:extract`
   - Reads `MezDSL.g` from the `-d` repo (`appexec-dsl-commons/WebDSLParser-lib/.../MezDSL.g`)
   - Writes into `helium-vscode-tooling/generated/grammar/`
2. **Convert ANTLR3 → ANTLR4**: `npm run build:grammar`
3. **Validate grammar**: `npm run build:validate` (warnings don’t fail the pipeline)
4. **Generate parser**: `npm run build:parser`
5. **Extract rules**: `npm run build:rules`
6. **Generate BIF metadata**: `npm run build:bifs`
7. **Generate language metadata**: `npm run build:language`
8. **Generate TextMate grammar**: `npm run build:textmate`

Primary outputs (all under `helium-vscode-tooling/generated/`):

- `grammar/` (ANTLR3 + ANTLR4 grammar files)
- `parser/` (generated TypeScript parser)
- `rules/` (linter rules metadata)
- `bifs/` (BIF metadata)
- `language/` (keywords/types/model BIF metadata)
- `syntaxes/` (TextMate grammars)

### Step 9: build the language server

- Runs in `helium-dsl-language-server/`: `npm run build`
- Output: `helium-dsl-language-server/out/**`

### Step 9.5: “parser-only” validation against the sample project (fail-fast)

- Deletes any previous `helium-dsl-language-server/generated/parser-errors.json`
- Creates a temporary `tsx` script, then:
  - Recursively parses all `.mez` files in the sample project using `parseText`
  - If any parser diagnostics exist, writes them to:
    - `helium-dsl-language-server/generated/parser-errors.json`
  - Exits non-zero to abort the pipeline

Environment highlights:

- Runs with `HELIUM_STRICT_PARSER=1`

### Step 10: build the VSCode/Cursor extension client

- Runs in `helium-dsl-vscode/`: `npm run build`
- Output: `helium-dsl-vscode/out/**`

### Step 11 + 13: temporary version bump for packaging

- Step 11 rewrites `helium-dsl-vscode/package.json` version to `major.minor.<epoch>`
- Step 13 restores the original version after packaging

### Step 12: package the extension (VSIX)

- Runs in `helium-dsl-vscode/`: `npm run package`
- `helium-dsl-vscode/package.json` defines:
  - `"package": "bash ../helium-vscode-tooling/scripts/package-local.sh"`

So packaging is implemented by:

- `helium-vscode-tooling/scripts/package-local.sh`

Key behaviors of `package-local.sh`:

- Creates a **temporary working directory outside the workspace**
- Copies the extension into that temp dir
- Copies in:
  - Language server compiled output (`helium-dsl-language-server/out/**`) → `extension/server/out/**`
  - MCP compiled output (`helium-rapid-dsl-mcp/out/**`) → `extension/server/mcp/out/**`
  - Generated artifacts (`helium-vscode-tooling/generated/**`) → `extension/generated/**`
- Installs **production** dependencies in the temp dir (`npm install --omit=dev`)
- Flattens nested dependencies (so `vsce` includes them)
- Produces:
  - `helium-vscode-tooling/dist/helium-dsl.vsix`

### Step 14: run language-server tests (includes the generated corpus test)

- Runs in `helium-dsl-language-server/`: `npm test`
  - Executes both:
    - `tests/**/*.test.ts`
    - `generated/tests/**/*.test.ts` (the file generated at the top)

### Step 15: install the VSIX into Cursor

- Installs:
  - `helium-vscode-tooling/dist/helium-dsl.vsix`
- Command used:
  - `cursor --install-extension <vsix> --force`

## Where the duplication comes from

The duplication is real: the pipeline builds and validates things explicitly, and then packaging re-builds prerequisites again so packaging can be run standalone.

### Duplicate #1: language server build

- **First time**: `validate-dsl.sh` Step 9 (`helium-dsl-language-server/npm run build`)
- **Second time**: `package-local.sh` always runs “Building prerequisites (host)...” and rebuilds the language server.

### Duplicate #2: extension build

- **First time**: `validate-dsl.sh` Step 10 (`helium-dsl-vscode/npm run build`)
- **Second time**: `package-local.sh` rebuilds the extension during “Building prerequisites (host)...”.

### Duplicate #3: parsing the sample corpus

- **First time**: Step 9.5 runs a **parser-only** scan over all `.mez` files (fail-fast on any parser diagnostics).
- **Second time**: Step 14 runs Mocha tests; the generated corpus test parses **again**, then also runs:
  - lints, and
  - semantic diagnostics.

This isn’t “wasted” if you want separate guarantees (parser-only gating + full semantic report), but it does mean the corpus is walked twice.

### Duplicate-ish: installs

- `package-local.sh` installs production deps in a fresh temp directory every run (intentional).
- It may also run `npm install` in `helium-dsl-language-server/`, `helium-dsl-vscode/`, and `helium-rapid-dsl-mcp/` **if** their `node_modules` are missing/empty (depends on your machine state).

## Why `package-local.sh` rebuilds things (even when you already did)

`package-local.sh` is designed to be safe when invoked directly (e.g. `npm run package`), so it rebuilds host prerequisites to ensure the VSIX always contains fresh:

- `helium-dsl-language-server/out/**`
- `helium-dsl-vscode/out/**`
- `helium-rapid-dsl-mcp/out/**`

When called from `validate-dsl.sh`, those rebuilds are usually redundant (except MCP, which `validate-dsl.sh` otherwise doesn’t build explicitly).

## Outputs you should expect after a successful run

- **Generated artifacts**: `helium-vscode-tooling/generated/**`
- **Language server build output**: `helium-dsl-language-server/out/**`
- **Extension build output**: `helium-dsl-vscode/out/**`
- **VSIX**: `helium-vscode-tooling/dist/helium-dsl.vsix`
- **Generated test**: `helium-dsl-language-server/generated/tests/<corpus>.test.ts`
- **Parser error report (only if parser errors are found)**:
  - `helium-dsl-language-server/generated/parser-errors.json`

## Notes / potential simplifications (not implemented here)

If you want to remove the “double build” behavior, the cleanest options are usually:

- Make `validate-dsl.sh` **not** build Step 9/10 and rely on `package-local.sh` to build prerequisites, or
- Add an opt-in flag/env var so `package-local.sh` can **skip prerequisite builds** when it’s being called from a pipeline that already built them.

