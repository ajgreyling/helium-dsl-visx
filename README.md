# Helium DSL VSCode Extension Tooling

This project provides automated tooling for building a VSCode extension for the Helium Rapid DSL. **The extension is primarily designed for Cursor IDE**, though it is compatible with VS Code.

The project includes:
- ANTLR3 to ANTLR4 grammar conversion
- Parser generation
- Linting rule extraction
- Language server implementation
- VSCode extension packaging

## Project Structure

```
helium-dsl-visx/ (project root)
├── dsl-visx.code-workspace
├── README.md
├── helium-dsl-language-server/  # LSP server implementation
├── helium-rapid-dsl-mcp/        # MCP server for Cursor agents (.mez/.vxml)
├── helium-vscode-tooling/       # Tooling and packaging (see below)
└── .DS_Store

helium-vscode-tooling/
├── scripts/              # Build automation scripts
│   ├── extract-grammar.ts    # Extract ANTLR3 grammar from Java project
│   ├── convert-grammar.ts    # Convert ANTLR3 to ANTLR4
│   ├── validate-grammar.ts   # Validate converted grammar
│   ├── extract-rules.ts      # Generate linting rules
│   ├── generate-bif-metadata.ts  # Generate BIF metadata
│   ├── generate-textmate.ts  # Generate TextMate grammar
│   ├── build.ts             # Main build orchestrator
│   ├── watch.ts             # Watch for changes
│   ├── version-check.ts     # Version tracking
│   ├── package-docker.sh    # VSIX packaging orchestrator (uses local packaging)
│   └── package-local.sh     # Local packaging script (runs in temporary directory)
├── helium-dsl-vscode/      # VSCode extension client
├── generated/              # Generated files (not in git)
├── dist/                   # VSIX output directory (not in git)
├── validate-dsl.sh         # Validation pipeline script
├── package.json
└── package-lock.json
```

### Script Files Explained

**`scripts/package-docker.sh`** - Main packaging orchestrator (runs on host)
- **Purpose**: Coordinates the complete packaging workflow
- **Steps**:
  1. Builds language server with local dependencies
  2. Builds extension
  3. Invokes local packaging script (`package-local.sh`)
  4. Verifies VSIX output
- **Why separate**: Ensures prerequisites are built before packaging

**`scripts/package-local.sh`** - Local packaging script
- **Purpose**: Assembles and packages the extension in a temporary directory
- **Key operations**:
  - Creates temporary working directory outside workspace
  - Copies extension to temporary location
  - Copies language server output and dependencies
  - Copies generated files
  - Installs extension production dependencies
  - Flattens nested dependencies (critical for `vsce` to include all deps)
  - Validates dependency tree
  - Runs `vsce package` using `npx`
- **Why temporary directory**: Isolates from npm workspace, ensures clean dependency tree without requiring Docker

## Prerequisites

- Node.js >= 18
- npm or pnpm
- Access to `appexec-dsl-commons` repository
- Access to a sample DSL project for validation

## Installation

```bash
cd /Users/ajgreyling/code/helium-dsl-visx
npm install
```

## MCP Server (Cursor)

This repo includes a TypeScript MCP server for Cursor agents that can analyze and validate `.mez` and `.vxml` files using the existing language-server AST/index.

Quick start:

```bash
cd /Users/ajgreyling/code/helium-dsl-visx/helium-rapid-dsl-mcp
npm install
npm run build
node out/src/index.js
```

See `helium-rapid-dsl-mcp/README.md` for Cursor configuration details and tool descriptions.

## Usage

### Quick Start: Run Full Validation Pipeline

The validation pipeline is driven by `helium-vscode-tooling/validate-dsl.sh` (or the repo-root `run.sh` wrapper).

```bash
# Recommended: run from repo root
cd /Users/ajgreyling/code/helium-dsl-visx
./run.sh

# Or run the pipeline directly
cd /Users/ajgreyling/code/helium-dsl-visx/helium-vscode-tooling
chmod +x validate-dsl.sh
./validate-dsl.sh \
  -d /Users/ajgreyling/code/appexec-dsl-commons \
  -p /Users/ajgreyling/code/munic-chat
```

This will:
1. Configure paths to your DSL commons and sample project
2. Extract the ANTLR3 grammar
3. Convert it to ANTLR4
4. Generate the TypeScript parser
5. Generate linting rules
6. Generate BIF metadata
7. Generate language metadata (keywords, primitive types, model BIFs) from grammar
8. Generate TextMate grammar for syntax highlighting
9. Build the language server
10. Validate parser against the sample project (fails fast on parser errors)
11. Build the VSCode extension
12. Update extension version with epoch-based build number
13. Package the VSCode extension as a `.vsix` file using local packaging
14. Restore original version in package.json
15. Run validation tests against your sample project (including AST/index checks)
16. Automatically install the extension in Cursor

### Manual Build Steps

If you prefer to run steps individually:

```bash
# From helium-vscode-tooling/

# Extract grammar from appexec-dsl-commons
npm run build:extract

# Convert ANTLR3 to ANTLR4
npm run build:grammar

# Validate converted grammar
npm run build:validate

# Generate parser
npm run build:parser

# Extract rules
npm run build:rules

# Generate BIF metadata
npm run build:bifs

# Generate language metadata (keywords/types/model-BIFs)
npm run build:language

# Generate TextMate grammar
npm run build:textmate

# Build language server
npm run build

# Run tests
npm test

# Package extension
npm run package
```

### Development Workflow

```bash
# Watch for changes in grammar and rules
npm run watch

# Build everything
npm run build:all

# Run tests
npm test

# Check versions
npm run version-check
```

## Configuration

The validation script automatically configures the following paths:

- **Grammar Source**: `${DSL_COMMONS}/WebDSLParser-lib/src/main/antlr3/com/mezzanine/dsl/web/MezDSL.g`
- **Rules**: Defined in `scripts/extract-rules.ts`
- **Sample Project**: Path provided via `-p` parameter

### Extension Settings

The extension supports the following configuration options:

#### Trace Server Logging

**Setting**: `heliumDsl.trace.server`

Controls the verbosity of language server logs in the Output channel ("Helium DSL Language Server").

**Options**:
- `off` (default): Minimal logging - only errors and critical messages
- `messages`: LSP protocol messages only - useful for debugging protocol communication
- `verbose`: Full debug logging including project discovery and indexing operations

**What's logged at each level**:

- **`off`**: Only error messages and critical server events
- **`messages`**: LSP protocol messages (requests/responses between client and server)
- **`verbose`**: All logs including:
  - Project discovery (Helium Rapid project roots: `model/` + `web-app/`)
  - AST/project index builds and incremental updates
  - Object/unit discovery and type lists
  - Server initialization details

**To enable verbose logging**:

1. Open Settings (Command Palette → "Preferences: Open Settings (JSON)")
2. Add:
   ```json
   {
     "heliumDsl.trace.server": "verbose"
   }
   ```
3. Reload the window or restart the language server

**Note**: Error logs (`console.error`) always appear regardless of trace level. Only debug/informational logs are controlled by this setting.

## Language Server Features

### IntelliSense and Autocomplete

The language server provides comprehensive IntelliSense support:

- **Keywords** - Language keywords and control structures
- **Built-in Functions** - All BIFs with namespace prefixes (`Mez:`, `sql:`, `String:`, etc.)
- **Context-aware suggestions** - Variables and functions based on current scope

#### Unit IntelliSense

When typing `:` after a unit name (e.g., `SomeUnit:`), IntelliSense shows:
- **Unit-level variables** - Top-level variables declared in the unit file (module scope)
- **Unit functions** - All functions defined in the unit file

Example:
```mez
// Typing "RoleDetails:" shows:
// - Variables: rolePermissions, defaultAccess, etc.
// - Functions: getPermissionsTable(), validateAccess(), etc.
RoleDetails:getPermissionsTable()
```

#### Type IntelliSense

When typing `:` after a user-defined type name (e.g., `SomeModel:`), IntelliSense shows model Built-In Functions (BIFs).

Important: the **model BIF list is not hardcoded** in the language server; it is derived from the grammar and written to `helium-vscode-tooling/generated/language/helium-language-metadata.json` during the build pipeline.
- **CRUD operations**: `all`, `new`, `read`, `delete`
- **Query operations**: `equals`, `empty`, `between`, `lessThan`, `greaterThan`, `contains`, `beginsWith`, `endsWith`, `attributeIn`, `relationshipIn`
- **Negated queries**: `notEquals`, `notEmpty`, `notBetween`, `notContains`, `notBeginWith`, `notEndsWith`, `notAttributeIn`, `notRelationshipIn`
- **Set operations**: `union`, `diff`, `intersect`, `and`

Example:
```mez
// Typing "Person:" shows all model BIFs:
Person:all()
Person:read(uuid)
Person:new()
Person:delete(uuid)
Person:equals(...)
// ... and all other model BIFs
```

### Property IntelliSense

When typing `.` after a variable of a user-defined type, IntelliSense shows all properties of that type.

## Linting Rules

The linter currently implements the following rules:

1. **no-var-in-else** (error): Variables cannot be declared in else blocks. This rule detects variable declarations in else blocks regardless of formatting:
   - `} else {` (same line)
   - `} else` followed by `{` on next line
   - `else {` on its own line after a closing brace
   - `else` on its own line followed by `{` on next line
   - The rule correctly distinguishes between `else` blocks and `else if` blocks (only flags plain `else` blocks)
2. **dot-notation-limit** (warning): Dot notation can only be used once per statement  
3. **naming-conventions** (warning): Follow naming conventions (camelCase, PascalCase, etc.)

## Test Output

The validation script will output:
- Number of files scanned
- Total issues found
- Issues grouped by rule type
- Detailed list of issues per file
- Special focus on critical errors (variables in else blocks)

Example output:
```
📊 Summary:
  Files scanned: 73
  Files with issues: 73
  Total issues: 162

📋 Issues by rule:
  helium-dsl-linter: 162
  
✅ 0 critical "variable-in-else" errors found!
```

## Troubleshooting

### Parser Not Generated

If you see "Parser not generated yet" errors:
```bash
npm run build:parser
```

### Parser Errors Detected

The validation pipeline now **fails fast** when parser diagnostics are detected in the sample project.

- The parser validation step writes details to:
  `helium-dsl-language-server/generated/parser-errors.json`
- Fix grammar conversion issues (see below), then re-run `./run.sh`
- If you see "Parser not generated" during validation, ensure:
  - `npm run build:parser` ran in `helium-vscode-tooling`
  - `npm install` ran in `helium-dsl-language-server` (ts-node is required for parser validation)
- The pipeline runs the parser in **strict mode** (`HELIUM_STRICT_PARSER=1`) so known false-positive suppression used in the editor does not hide conversion gaps.

### Grammar Conversion Errors

If grammar validation fails:
1. Check that the source grammar exists
2. Review the conversion script output
3. Check `generated/grammar/MezDSL.g4` for syntax errors
4. **Do not edit generated grammar directly** — update `helium-vscode-tooling/scripts/convert-grammar.ts`

### Test Failures

If tests fail:
1. Ensure paths are correct
2. Run `npm run build:all` to regenerate everything
3. Check the test output for specific file issues

### Test Execution Delays

If tests complete quickly but the script hangs before Step 14:
1. Check that `mocha --exit` flag is being used (prevents hanging on active timers)
2. Verify no background processes are still running: `ps aux | grep mocha`
3. Check the debug output for timing information: `[DEBUG] Step 13 completed in Xs`
4. If delays persist, ensure `stdbuf` is available or the fallback path is used correctly

### Extension Activation Errors

If the extension fails to activate with "Cannot find module" errors:
1. Ensure you're using the VSIX from `dist/helium-dsl.vsix` (created by local packaging)
2. Rebuild and repackage: `npm run package`
3. Reinstall the extension: `cursor --install-extension dist/helium-dsl.vsix --force`
4. Check Extension Host logs: Command Palette → "Developer: Show Extension Host Log"

## Automation & Repeatability

This tooling is designed to be fully automated and repeatable:

1. All source files (grammar, rules) are referenced by path
2. Generated files are in `generated/` (gitignored)
3. The build pipeline can be re-run any time the DSL changes
4. Version checking tracks changes to source files
5. Each build automatically gets a unique version number based on the epoch timestamp
6. The extension is automatically installed in Cursor after successful packaging (when using `validate-dsl.sh`)

## Packaging and Publishing

### Local VSIX Packaging

The extension uses **local packaging** with temporary directories to ensure reproducible builds and proper dependency bundling. This approach:

- ✅ Eliminates workspace hoisting issues by packaging in a temporary directory outside the workspace
- ✅ Ensures all transitive dependencies are included (e.g., `minimatch`, `semver`, `brace-expansion`)
- ✅ Works without Docker, simplifying the build process
- ✅ Uses temporary directories to isolate packaging from workspace context
- ✅ Works correctly in Cursor IDE (primary target)

**Why Local Packaging?**

1. **Temporary Isolation**: Packaging happens in a temporary directory outside the workspace, ensuring no workspace artifacts interfere with dependency installation.

2. **Clean Dependency Tree**: Each packaging run starts with a fresh copy of the extension in a temporary directory, ensuring no cached dependencies or symlinks interfere.

3. **Proper Dependency Bundling**: The packaging script installs dependencies in isolation, flattens nested dependencies, and ensures ALL transitive dependencies are included in the VSIX.

4. **Cursor Compatibility**: Cursor requires all dependencies to be properly bundled. Local packaging ensures this without using the `--no-dependencies` flag.

5. **Simplified Setup**: No Docker dependency required, making the build process more accessible and easier to debug.

**Critical Principles:**

- ❌ **NEVER use `--no-dependencies` flag**: Cursor requires dependencies to be bundled normally
- ❌ **NO hoisting hacks**: Never rename `package.json`, remove symlinks, or disable workspaces
- ✅ **Robust builds**: Use distinct steps, temporary directories for isolation
- ✅ **Target Cursor**: Always use `cursor --install-extension`, not `code --install-extension`

**Architecture:**

The packaging uses two main components:

1. **`scripts/package-docker.sh`** - Orchestrator script (renamed from Docker-specific, but now uses local packaging)
   - Builds language server and extension
   - Ensures dependencies are installed locally
   - Invokes local packaging script
   - Verifies output

2. **`scripts/package-local.sh`** - Local packaging script
   - Creates temporary working directory outside workspace
   - Copies extension, language server, and generated files
   - Installs and flattens dependencies
   - Runs `vsce package` using `npx`

**Prerequisites for Packaging:**

- Node.js and npm must be installed
- Language server and extension must be built first (handled automatically by `package-docker.sh`)

**Design Principles:**

- **Temporary Directory Isolation**: Packaging happens in a temporary directory outside the workspace, eliminating hoisting issues naturally.
- **Robust Builds**: Use distinct, clear steps with temporary directories for isolation.
- **No `--no-dependencies`**: NEVER use `vsce package --no-dependencies`. Cursor requires all dependencies to be properly bundled for extraction.
- **Cursor-First**: This extension targets Cursor IDE primarily. Always use `cursor --install-extension` commands, not `code --install-extension`.

### Prerequisites for Publishing

Before publishing the extension to [Open VSX Registry](https://open-vsx.org/), you need:

1. **Open VSX Account**: Create an account at https://open-vsx.org/ if you haven't already
2. **Install ovsx**: Install the Open VSX CLI tool globally:
   ```bash
   npm install -g ovsx
   ```

### Packaging the Extension

To create a `.vsix` package file:

```bash
# From the helium-vscode-tooling directory
npm run package
```

This runs `scripts/package-docker.sh`, which orchestrates the complete packaging workflow.

#### Detailed Packaging Workflow

**Step 1: Build Language Server** (`scripts/package-docker.sh`)
- Changes to `helium-dsl-language-server/` directory
- Installs dependencies locally to ensure they're in the language server directory
- Compiles TypeScript: `npm run build` → creates `out/` directory
- Verifies `node_modules/` exists and contains packages

**Step 2: Build Extension** (`scripts/package-docker.sh`)
- Changes to `helium-dsl-vscode/` directory
- Installs dependencies if needed: `npm install`
- Compiles TypeScript: `npm run build` → creates `out/extension.js`

**Step 3: Local Packaging** (`scripts/package-local.sh`)

1. **Create Temporary Working Directory**
   - Creates a temporary directory outside the workspace using `mktemp`
   - This isolates packaging from any workspace context
   - Directory is automatically cleaned up on exit

2. **Copy Extension**
   - Copies the entire extension directory to the temporary location
   - This allows modifications without affecting source files

3. **Copy Language Server**
   - Copies compiled language server from `helium-dsl-language-server/out/` → `server/out/`
   - Copies language server dependencies from `helium-dsl-language-server/node_modules/` → `server/node_modules/`
   - These are required for the language server to run at runtime

4. **Copy Generated Files**
   - Copies `generated/` directory (parser, BIF metadata, rules) into extension
   - These files are needed by the language server for parsing and linting

5. **Install Extension Dependencies**
   - Runs `npm install --omit=dev` in the temporary working copy
   - Installs only production dependencies (e.g., `vscode-languageclient`)
   - Creates isolated dependency tree without workspace hoisting

6. **Flatten Nested Dependencies**
   - Moves nested dependencies from `node_modules/vscode-languageclient/node_modules/` to root `node_modules/`
   - This ensures transitive dependencies like `minimatch`, `semver`, `brace-expansion` are accessible
   - Removes all remaining nested `node_modules` directories (except `server/node_modules/`) to prevent duplicate file errors in VSIX

7. **Validate Dependencies**
   - Runs `npm list --omit=dev` to verify dependency tree is valid
   - Ensures `vsce` will pass its validation checks

8. **Package VSIX**
   - Runs `npx @vscode/vsce package` to create the VSIX file
   - **Critical**: Does NOT use `--no-dependencies` flag (Cursor requires dependencies to be bundled)
   - Outputs to `helium-vscode-tooling/dist/helium-dsl.vsix`

**Step 4: Verify Output** (`scripts/package-docker.sh`)
- Checks that VSIX file was created
- Displays file location and size

#### Complete Workflow Summary

```
1. package-docker.sh
   ├─ Build language server (on host)
   │  └─ npm install && npm run build
   ├─ Build extension (on host)
   │  └─ npm install && npm run build
   └─ package-local.sh
      ├─ Create temporary directory
      ├─ Copy extension to temp
      ├─ Copy server/out/ and server/node_modules/
      ├─ Copy generated/
      ├─ npm install --production
      ├─ Flatten nested deps
      ├─ npm list (validate)
      └─ npx vsce package
2. Output to dist/helium-dsl.vsix
3. Verify VSIX created
```

#### Why Local Packaging?

The local packaging approach solves several problems:

1. **Temporary Isolation**: Packaging happens in a temporary directory outside the workspace, ensuring no workspace artifacts interfere with dependency installation.

2. **Dependency Flattening**: npm may install transitive dependencies in nested `node_modules/`. The script flattens them so `vsce` includes all dependencies.

3. **Clean Environment**: Each build starts with a fresh copy of the extension in a temporary directory.

4. **No Docker Required**: Simplifies the build process by removing Docker as a dependency.

5. **Cursor Compatibility**: Cursor requires all dependencies to be properly bundled. Local packaging ensures this without using the `--no-dependencies` flag.

#### Alternative: Using Validation Script

The validation script also includes packaging:

```bash
./validate-dsl.sh -d <dsl-commons-path> -p <sample-project-path>
```

This will:
1. Build all prerequisites (grammar, parser, rules, BIFs)
2. Build the language server
3. Build the extension
4. Run the local packaging workflow (same as `npm run package`)
5. Output the VSIX to `dist/helium-dsl.vsix`

The generated `.vsix` file includes all required dependencies and can be installed manually or published to a marketplace.

### Installing Locally

To manually install the extension:

**For Cursor:**
```bash
# Install from the .vsix file
cursor --install-extension dist/helium-dsl.vsix --force
```

**For VSCode (secondary target):**
```bash
# Install from the .vsix file
code --install-extension dist/helium-dsl.vsix
```

**Note**: This extension is primarily designed for Cursor IDE. While it works in VS Code, Cursor is the intended target platform.

The VSIX file is created in the `dist/` directory and includes all required dependencies, ensuring the extension activates correctly without module errors.

### Publishing to Open VSX Registry

1. **Get your access token**:
   - Log in to your account at https://open-vsx.org/
   - Go to your account settings
   - Generate an access token

2. **Publish the extension**:
   ```bash
   cd helium-dsl-vscode
   ovsx publish -p <your-access-token>
   ```

   Or set the token as an environment variable for convenience:
   ```bash
   export OVSX_PAT=<your-access-token>
   cd helium-dsl-vscode
   ovsx publish
   ```

   To publish a specific version:
   ```bash
   ovsx publish -p <your-access-token> --packagePath helium-dsl-vscode-<version>.vsix
   ```

3. **Verify**: Check the [Open VSX Registry](https://open-vsx.org/) for your extension. It should appear shortly after publishing.

### Manual Distribution

You can also distribute the `.vsix` file manually:
- Share it directly with users
- Host it on your website
- Include it in your project repository

Users can install it using:
```bash
# For Cursor (primary target)
cursor --install-extension <path-to-vsix-file> --force

# For VS Code (secondary target)
code --install-extension <path-to-vsix-file>
```

### Extension Structure

When packaged, the extension includes:
- `out/` - Compiled extension code
- `server/out/` - Bundled language server
- `server/node_modules/` - Language server dependencies
- `generated/` - Required generated files (parser, BIF metadata, rules)
- `syntaxes/` - TextMate grammar for syntax highlighting
- `language-configuration.json` - Language configuration
- `node_modules/` - Extension dependencies (including `vscode-languageclient` and all transitive dependencies like `minimatch`, `semver`, `brace-expansion`)

### Troubleshooting Packaging

**Language server dependencies missing:**
- The script ensures dependencies are installed locally in the language server directory
- If you see "Language server node_modules missing or empty" error:
  ```bash
  cd helium-dsl-language-server
  npm install
  npm run build
  ```

**Missing dependencies in VSIX:**
- The local packaging automatically includes all transitive dependencies
- If you see "Cannot find module" errors, ensure you're using the latest VSIX from `dist/helium-dsl.vsix`
- Rebuild and repackage if needed: `npm run package`
- Check Extension Host logs for specific missing modules

**Packaging fails:**
- Check that language server builds successfully: `cd helium-dsl-language-server && npm run build`
- Check that extension builds successfully: `cd helium-dsl-vscode && npm run build`
- Check that Node.js and npm are installed: `node --version && npm --version`
- Verify temporary directory creation works: `mktemp -d -t test-XXXXXX`

**Language server fails to start:**
- Ensure the VSIX includes `server/node_modules/` (check with `unzip -l dist/helium-dsl.vsix | grep "server/node_modules"`)
- If missing, the language server dependencies weren't copied - rebuild with `npm run package`
- Verify language server dependencies are installed locally: `ls helium-dsl-language-server/node_modules`

## Contributing

When the Helium DSL is updated:

1. Run the validation script with updated paths
2. Review any new linting errors
3. Update linting rules if needed
4. Commit any changes to tooling scripts

## Script Reference

### Packaging Scripts

**`npm run package`** → `scripts/package-docker.sh`
- Orchestrates complete packaging workflow
- Builds prerequisites, then runs local packaging
- Output: `dist/helium-dsl.vsix`

### Build Scripts

**`npm run build:all`** → `scripts/build.ts`
- Orchestrates all build steps (grammar, parser, rules, BIFs, language server, extension)

**`npm run build:extract`** → `scripts/extract-grammar.ts`
- Extracts ANTLR3 grammar from Java project

**`npm run build:grammar`** → `scripts/convert-grammar.ts`
- Converts ANTLR3 grammar to ANTLR4 format

**`npm run build:parser`**
- Generates TypeScript parser from ANTLR4 grammar using `antlr4ts`

**`npm run build:rules`** → `scripts/extract-rules.ts`
- Extracts linting rules from grammar

**`npm run build:bifs`** → `scripts/generate-bif-metadata.ts`
- Generates metadata for Built-In Functions

**`npm run build:textmate`** → `scripts/generate-textmate.ts`
- Generates TextMate grammar for syntax highlighting

## Syntax Highlighting Best Practices

The extension uses **TextMate grammar** for syntax highlighting, relying on theme defaults rather than custom color overrides. This ensures compatibility across different themes (Cursor Dark, Solarized Dark, MonoKai, etc.).

### TextMate Scope Selection

**Use Standard Scopes**: Always use standard TextMate scopes that themes recognize:
- ✅ `support.class` - For unit names (units are like classes/modules)
- ✅ `support.function` - For methods in unit references
- ✅ `support.function.builtin` - For built-in functions (BIFs)
- ✅ `entity.name.function` - For regular function definitions
- ✅ `entity.name.type` - For object/class names
- ✅ `variable.other` - For variables
- ✅ `keyword.control` - For control keywords
- ✅ `storage.type` - For primitive types
- ❌ Avoid custom scopes with `.helium` suffix - themes won't recognize them

**Scope Differentiation**: Use different scopes for different token types to ensure unique colors:
- Unit names use `support.class` (not `entity.name.type`)
- Unit methods use `support.function` (not `entity.name.function`)
- BIFs use `support.function.builtin` (distinct from regular functions)

### Semantic Tokens vs TextMate Grammar

**Semantic Tokens Can Override TextMate**: Semantic tokens take precedence over TextMate grammar. To ensure TextMate grammar handles specific constructs:

1. **Remove `semanticTokenColors`**: Don't define custom semantic token colors in `package.json` - let themes use their defaults
2. **Skip Overlapping Tokens**: Configure semantic token provider to skip tokens that TextMate grammar handles (e.g., unit references)
3. **Use TextMate for Syntax**: TextMate grammar is better for syntax highlighting based on patterns
4. **Use Semantic Tokens for Context**: Semantic tokens are better for context-aware highlighting (e.g., distinguishing local variables from types)

### Unit Reference Pattern

Unit references (`UnitName:method()`) require special handling:
- Pattern must match even when followed by `(` or other punctuation
- Use lookahead: `(?=\\s*[;(,=)]|\\s*$|\\s*[^a-zA-Z0-9_])`
- Unit name gets `support.class` scope
- Method name gets `support.function` scope

### Testing Syntax Highlighting

After making changes to TextMate grammar:
1. Regenerate grammar: `npm run build:textmate`
2. Repackage extension: `npm run package`
3. Reinstall extension: `cursor --install-extension dist/helium-dsl.vsix --force`
4. Reload Cursor window
5. Test with "Developer: Inspect Editor Tokens and Scopes" to verify scopes are applied correctly

See `helium-vscode-tooling/TOKEN_MAPPINGS.md` for complete token scope reference.

## Performance and Optimization Notes

### Linting Performance

**Multi-Line String Block Handling**:
- The `forbidden-operators` linting rule tracks multi-line string blocks (`/% ... %/`) across lines to skip processing content inside these blocks
- This prevents timeouts when processing files with large JSON/text content in multi-line strings
- Lines containing `/%` or `%/` markers are skipped, and lines between them are also skipped when inside a block

**Test Execution Performance**:
- Mocha should use the `--exit` flag to prevent hanging on active timers from timeout protection code
- Without `--exit`, mocha may wait for `setTimeout` timers to expire (e.g., 30-second timeout protection), causing 30+ second delays
- The `validate-dsl.sh` script includes timing diagnostics to identify performance bottlenecks

**Output Buffering**:
- Use `stdbuf` (when available) to disable output buffering for immediate test output
- Use `printf` instead of `echo` for immediate output when buffering is a concern
- Export environment variables before using `stdbuf` (stdbuf doesn't handle inline variable assignments)

### Common Performance Issues

**Linting Timeouts**:
- If linting times out on files with large multi-line strings, ensure the linting rule properly tracks multi-line block state
- Check that string literal detection is working correctly and not processing content inside string blocks

**Test Execution Delays**:
- If tests complete quickly but the script hangs, check for active timers or event loop handles
- Use `mocha --exit` to force immediate exit after tests complete
- Add timing diagnostics to identify where delays occur

## Notes

- The generated parser may have warnings about unreachable tokens or duplicate names - these are from the original ANTLR3 grammar and can be safely ignored
- Semantic actions containing `token()` calls are automatically removed during conversion
- The parser is regenerated from scratch each time to ensure consistency
- The local packaging ensures all dependencies are included, preventing "Cannot find module" errors at runtime
- Member access functions like `list.length()` or `obj.jsonGet(...)` are handled in the conversion script; update `convert-grammar.ts` if keyword-tokens cause parse errors


