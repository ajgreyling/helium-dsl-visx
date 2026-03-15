---
name: publish
description: Publish the Helium Rapid DSL (ANTLR4) VSCode extension to the Open VSX Registry and install in Cursor. Use when the user asks to publish the extension, release to Open VSX, or run the full publish workflow.
---

# Publish Helium DSL Extension

## When to use

- User says "publish", "publish the extension", "release to Open VSX", or "run publish"
- User wants the extension on Open VSX and installed in Cursor

## Two options

### Option A: Full workflow (build + package + publish)

Use the script that does uninstall, clean, build, version bump, package, publish, restore version, and install:

From **helium-dsl-visx** repo root:

```bash
./helium-vscode-tooling/publish.sh -d <dsl-commons-path> [-t <ovsx-token>]
```

**Prerequisites:**
- **appexec-dsl-commons**: Path via `-d` (or `DSL_COMMONS_PATH`). Must contain `WebDSLParser-lib/.../MezDSL.g`.
- **Open VSX token**: Via `-t` or env `OVSX_PAT`. Get token: https://open-vsx.org/user-settings/tokens

**Examples:**

```bash
./helium-vscode-tooling/publish.sh -d /Users/ajgreyling/code/appexec-dsl-commons -t <token>
export OVSX_PAT="<token>"
./helium-vscode-tooling/publish.sh -d /Users/ajgreyling/code/appexec-dsl-commons
```

If a root `publish.sh` forwards to this script with `-d` and optional `-t`, the user can run `./publish.sh`.

### Option B: Publish an existing VSIX only

If the user has already run **build** and **package** and has `helium-vscode-tooling/dist/helium-dsl.vsix`:

1. **Bump version** (optional; full script uses `<major>.<minor>.<epoch>`).
2. **Publish to Open VSX:**
   ```bash
   ovsx publish --packagePath helium-vscode-tooling/dist/helium-dsl.vsix -p "$OVSX_PAT"
   ```
   Install `ovsx` if needed: `npm install -g ovsx`
3. **Install in Cursor:** `cursor --install-extension helium-vscode-tooling/dist/helium-dsl.vsix --force`

## What the full script does

1. Uninstall extension from Cursor (if present)
2. Clean old `.vsix` from `helium-vscode-tooling/dist/`
3. Build pipeline (extract grammar → convert → validate → parser → rules → BIF → language → TextMate → language server → extension)
4. Set version to `<major>.<minor>.<epoch>` for publish
5. Package (local temp dir, deps, `vsce package`) → `helium-vscode-tooling/dist/helium-dsl.vsix`
6. Publish to Open VSX via `ovsx publish`
7. Restore original version in `helium-dsl-vscode/package.json`
8. Install extension in Cursor from the local VSIX

## Failures

- **Missing `-d` or invalid path** – Script exits; provide a valid dsl-commons path.
- **Missing Open VSX token** – Set `OVSX_PAT` or pass `-t`.
- **Grammar file not found** – Ensure dsl-commons path contains `WebDSLParser-lib/.../MezDSL.g`.
- **Publish or install fails** – Check token, network, and script output; fix and re-run.

## After publish

- Open VSX: https://open-vsx.org/extension/mezzanineware/helium-dsl-vscode
- Cursor gets the extension from the local VSIX installed by the script; it does not use Open VSX for install.

## Related skills

- **build** – Run only the build pipeline (no package/publish).
- **package** – Produce the VSIX only (after build).
