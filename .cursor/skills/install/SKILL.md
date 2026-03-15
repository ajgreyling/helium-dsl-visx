---
name: install
description: Install the Helium Rapid DSL (ANTLR4) extension in Cursor from the local VSIX. Use when the user asks to install the extension in Cursor, install the vsix, or load the extension locally.
---

# Install Helium DSL Extension in Cursor

## When to use

- User says "install the extension", "install in Cursor", "install the vsix", or "load the extension locally"
- User has a built VSIX and wants it active in Cursor

## Prerequisites

A packaged VSIX exists (run the **package** skill first, or use an existing build). Default path: `helium-vscode-tooling/dist/helium-dsl.vsix`.

## Command

From **helium-dsl-visx** repo root:

```bash
cursor --install-extension helium-vscode-tooling/dist/helium-dsl.vsix --force
```

From **helium-vscode-tooling**:

```bash
cursor --install-extension dist/helium-dsl.vsix --force
```

Use `--force` to replace any previously installed version.

## After install

Reload the Cursor window (or restart Cursor) if the extension was already loaded. New windows pick up the extension automatically.

## Related skills

- **package** – Produce the VSIX before installing.
