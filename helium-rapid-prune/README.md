# helium-rapid-prune

CLI that iteratively removes unused Helium Rapid DSL **functions**, **single-unit `.mez` files**, and **`.lang` entries**, driven by the same unused diagnostics as the Helium language server.

Maintainer npm user: **ajgreyling** (unscoped package).

## Install

```bash
npm install -g helium-rapid-prune
```

## Usage

**With `npx` (no global install):**

```bash
npx helium-rapid-prune /path/to/repo
npx helium-rapid-prune /path/to/repo --max-passes=25
```

**With a project root (non-interactive):**

```bash
helium-rapid-prune /path/to/repo
helium-rapid-prune /path/to/repo --max-passes=25
```

**Without arguments** (prompts for project root and max passes):

```bash
helium-rapid-prune
```

Default max passes is `5` when `--max-passes` is not provided.

**Environment:**

- `PROJECT_ROOT` — used as the project root when no positional argument is given (still runs non-interactively for the other options unless you only set this and want prompts; if both env and no argv positionals, env wins before prompts).

## Behaviour

- Uses the path you pass (or enter at the prompt) **as the Helium Rapid DSL project root** — it does **not** append `dsl` or any other segment.

## Publishing (maintainers)

From this directory:

```bash
chmod +x publish.sh
./publish.sh
```

This builds [`helium-dsl-language-server`](../helium-dsl-language-server), bundles it via `bundleDependencies`, bumps the version with an epoch build number, publishes to npm, then restores `package.json` version.

`npm publish` also runs `prepack`, which re-bundles the language server before pack.

## Related tooling

- [Language server](../helium-dsl-language-server/README.md) (bundled by this CLI)
- [MCP server](../helium-rapid-dsl-mcp/README.md)
- [Extension](../helium-dsl-vscode/README.md)
- [Build pipeline](../helium-vscode-tooling/README.md)
- [Repository overview](../README.md)

## License

MIT
