# Helium DSL

Language support for the Helium Rapid DSL in Cursor IDE and VS Code.

## Features

- 🎨 **Syntax Highlighting** - Rich syntax highlighting for `.mez` and `.vxml` files
- 🔍 **IntelliSense** - Smart autocomplete for keywords, built-in functions (BIFs), and context-aware suggestions
- ✅ **Real-time Linting** - Configurable linting rules to catch errors and enforce best practices
- 📝 **Language Server Protocol** - Full LSP support for a modern editing experience
- 🔎 **Symbol Navigation** - Navigate to definitions and find references across your workspace
- 💡 **Hover Information** - Get helpful information by hovering over code elements

## Installation

### From Open VSX Registry

Install directly from the [Open VSX Registry](https://open-vsx.org/extension/mezzanineware/helium-dsl-vscode):

```bash
cursor --install-extension mezzanineware.helium-dsl-vscode
```

Or search for "Helium DSL" in the Cursor/VS Code extension marketplace.

### Manual Installation

If you have a `.vsix` file:

```bash
# For Cursor IDE (recommended)
cursor --install-extension <path-to-vsix-file> --force

# For VS Code
code --install-extension <path-to-vsix-file>
```

## Usage

The extension activates automatically when you open any `.mez` or `.vxml` file. Once active, you'll get:

- **Autocomplete**: Press `Ctrl+Space` (or `Cmd+Space` on Mac) to see suggestions for keywords, built-in functions, and unit methods
- **Syntax Errors**: Red squiggles indicate syntax errors detected by the parser
- **Linting**: Yellow/orange squiggles show linting warnings and errors
- **Hover**: Hover over code elements to see type information and documentation

## Configuration

Configure linting rules in your settings (Command Palette → "Preferences: Open Settings (JSON)"):

```json
{
  "heliumDsl.lint.noVarInElse": "error",
  "heliumDsl.lint.namingConventions": "warning"
}
```

### Available Settings

- **`heliumDsl.lint.noVarInElse`** - Controls whether variables can be declared in else blocks
  - Options: `"error"` (default), `"warning"`, `"info"`, `"off"`
  - Detects variable declarations in `else` blocks regardless of formatting (same line or multi-line)

- **`heliumDsl.lint.namingConventions`** - Enforces naming conventions (camelCase, PascalCase, etc.)
  - Options: `"warning"` (default), `"error"`, `"info"`, `"off"`

- **`heliumDsl.trace.server`** - Controls language server logging verbosity
  - Options: `"off"` (default), `"messages"`, `"verbose"`

## Supported File Types

- **`.mez`** - Helium DSL source files
- **`.vxml`** - Helium VXML files

## Requirements

- **VS Code**: Version 1.85.0 or later
- **Cursor IDE**: Fully supported (primary target platform)

## Language Features

### Syntax Highlighting

The extension provides comprehensive syntax highlighting for:
- Keywords (`if`, `else`, `for`, `while`, `function`, etc.)
- Built-in functions (`Mez:now`, `sql:query`, `String:substring`, etc.)
- Unit references (`UnitName:method()`)
- Variables, strings, numbers, and comments

### Autocomplete

IntelliSense provides suggestions for:
- **Keywords** - Language keywords and control structures
- **Built-in Functions** - All BIFs with namespace prefixes (`Mez:`, `sql:`, `String:`, etc.)
- **Unit Methods** - Methods from units referenced in your workspace
- **Context-aware** - Suggestions based on your current code context

### Linting Rules

The extension includes several linting rules:

1. **no-var-in-else** - Prevents variable declarations in else blocks (default: error)
   - Detects variables declared in `else` blocks regardless of code formatting
   - Works with `} else {`, `} else` followed by `{`, `else {` on its own line, etc.
   - Correctly distinguishes between `else` blocks and `else if` blocks
   - Variables should be declared before the if statement, not inside the else block
2. **dot-notation-limit** - Limits dot notation usage per statement (default: warning)
3. **naming-conventions** - Enforces naming conventions (default: warning)
4. **forbidden-operators** - Detects use of forbidden operators

## Troubleshooting

### Extension Not Activating

- Ensure you're opening a `.mez` or `.vxml` file
- Check the Output panel → "Helium DSL Language Server" for errors
- Try reloading the window: Command Palette → "Developer: Reload Window"

### Autocomplete Not Working

- Make sure the language server is running (check Output panel)
- Try restarting the language server: Command Palette → "Developer: Restart Extension Host"
- Verify your workspace contains valid Helium DSL files

### Linting Not Showing

- Check your linting settings in VS Code/Cursor settings
- Ensure linting rules are not set to `"off"`
- Check the Output panel for language server errors

### Enable Verbose Logging

To debug issues, enable verbose logging:

```json
{
  "heliumDsl.trace.server": "verbose"
}
```

Then check the "Helium DSL Language Server" output channel for detailed logs.

## Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/ajgreyling/helium-dsl-visx).

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [Repository](https://github.com/ajgreyling/helium-dsl-visx)
- [Open VSX Registry](https://open-vsx.org/extension/mezzanineware/helium-dsl-vscode)

## Build and Packaging Process

This extension is built from the Helium DSL ANTLR3 grammar through a multi-step process that extracts, converts, and generates all necessary components. Here's how everything is obtained, updated, and packaged:

### Overview

The build process transforms the original ANTLR3 grammar from the Helium Java project into a complete VSCode/Cursor extension with syntax highlighting, IntelliSense, and linting capabilities.

### Step-by-Step Build Process

#### 1. Grammar Extraction (`npm run build:extract`)

**Script**: `scripts/extract-grammar.ts`

- **Source**: Extracts the ANTLR3 grammar file (`MezDSL.g`) from the Java project at:
  ```
  appexec-dsl-commons/WebDSLParser-lib/src/main/antlr3/com/mezzanine/dsl/web/MezDSL.g
  ```
- **Output**: Copies the grammar to `generated/grammar/MezDSL.g3`
- **Hash Tracking**: Generates a SHA256 hash (`MezDSL.g3.hash`) to detect grammar changes
- **Purpose**: Ensures we're always working with the latest grammar from the source project

#### 2. Grammar Conversion (`npm run build:grammar`)

**Script**: `scripts/convert-grammar.ts`

- **Input**: `generated/grammar/MezDSL.g3` (ANTLR3 format)
- **Output**: `generated/grammar/MezDSL.g4` (ANTLR4 format)
- **Transformations**:
  - Removes ANTLR3-specific options (`output=AST`, `ASTLabelType`, `superClass`)
  - Converts token syntax (semicolons → commas)
  - Removes tree rewrite operators (`->`, `^`, `!`)
  - Removes semantic predicates and AST-related actions
  - Converts `$channel=HIDDEN` to `-> channel(HIDDEN)`
  - Removes Java-specific `@header` sections
  - Fixes access expressions to support chaining
  - Improves JSON expression BIF support for left-recursive chaining
- **Purpose**: Converts the grammar to ANTLR4 format compatible with TypeScript parser generation

#### 3. Grammar Validation (`npm run build:validate`)

**Script**: `scripts/validate-grammar.ts`

- **Input**: `generated/grammar/MezDSL.g4`
- **Purpose**: Validates the converted grammar syntax and catches conversion errors early

#### 4. Parser Generation (`npm run build:parser`)

**Tool**: `antlr4ts` CLI

- **Input**: `generated/grammar/MezDSL.g4`
- **Output**: TypeScript parser files in `generated/parser/`:
  - `MezDSLLexer.ts` - Token lexer
  - `MezDSLParser.ts` - Parser implementation
  - `MezDSLListener.ts` - Parse tree listener interface
  - `MezDSLVisitor.ts` - Parse tree visitor interface
  - Token definition files (`.tokens`, `.interp`)
- **Purpose**: Generates the TypeScript parser used by the language server for syntax analysis

#### 5. Rules Extraction (`npm run build:rules`)

**Script**: `scripts/extract-rules.ts`

- **Output**: `generated/rules/dsl-rules.json`
- **Content**: Metadata for linting rules (IDs, severity levels, messages, categories)
- **Purpose**: Provides rule definitions used by the linter engine

#### 6. BIF Metadata Generation (`npm run build:bifs`)

**Script**: `scripts/generate-bif-metadata.ts`

- **Input**: `generated/grammar/MezDSL.g4` (scans for BIF token definitions)
- **Output**: `generated/bifs/bif-metadata.json`
- **Content**: Extracts built-in function tokens (e.g., `Mez:now`, `sql:query`) with namespaces, signatures, and grammar line numbers
- **Purpose**: Powers autocomplete suggestions for built-in functions

#### 7. TextMate Grammar Generation (`npm run build:textmate`)

**Script**: `scripts/generate-textmate.ts`

- **Input**: `generated/grammar/MezDSL.g4` and BIF metadata
- **Output**: `generated/syntaxes/helium-dsl.tmLanguage.json`
- **Purpose**: Generates TextMate grammar for syntax highlighting in the editor
- **Features**: Maps grammar tokens to TextMate scopes (`support.class`, `support.function`, `keyword.control`, etc.)

#### 8. Language Server Build

**Location**: `helium-dsl-language-server/`

- **Dependencies**: Installed locally (`npm install`) to ensure they're available for packaging
- **Build**: Compiles TypeScript source (`src/`) to JavaScript (`out/`)
- **Output**: 
  - `out/server.js` - Main language server entry point
  - `out/` - All compiled language server modules
  - `node_modules/` - Language server runtime dependencies

#### 9. Extension Build

**Location**: `helium-dsl-vscode/`

- **Dependencies**: Installed via `npm install`
- **Build**: Compiles TypeScript extension code (`src/extension.ts`) to `out/extension.js`
- **Output**: Compiled extension client code

#### 10. Local VSIX Packaging (`npm run package`)

**Orchestrator**: `scripts/package-docker.sh` (uses local packaging)

The packaging process uses local packaging with temporary directories to ensure reproducible builds and proper dependency bundling:

**Step 10a: Host-Side Prerequisites** (runs on host machine)
- Builds language server with local dependencies
- Builds extension client
- Verifies all prerequisites are ready

**Step 10b: Local Packaging** (`scripts/package-local.sh`)
- Creates temporary working directory outside workspace using `mktemp`
- This isolates packaging from workspace context, eliminating hoisting issues
- Directory is automatically cleaned up on exit

**Step 10c: Packaging Steps**
1. **Create Working Copy**: Copies extension to temporary directory
2. **Copy Language Server**: 
   - Copies `helium-dsl-language-server/out/` → `server/out/`
   - Copies `helium-dsl-language-server/node_modules/` → `server/node_modules/`
3. **Copy Generated Files**: Copies `generated/` directory (parser, rules, BIFs, TextMate grammar)
4. **Install Dependencies**: Runs `npm install --omit=dev` in temporary working copy
5. **Flatten Dependencies**: Moves nested `node_modules` to root (ensures `vsce` includes all transitive dependencies)
6. **Validate**: Runs `npm list --omit=dev` to verify dependency tree
7. **Package**: Runs `npx @vscode/vsce package` (without `--no-dependencies` flag) to create VSIX
8. **Output**: VSIX written to `dist/helium-dsl.vsix`

**Why Local Packaging?**
- **Workspace Isolation**: Temporary directory prevents npm workspace hoisting issues that break `vsce` validation
- **Reproducible Builds**: Consistent build process across environments
- **Clean Dependencies**: Fresh copy in temporary directory ensures no cached artifacts interfere
- **Proper Bundling**: Ensures all transitive dependencies are included (required by Cursor)
- **Simplified Setup**: No Docker dependency required

#### 11. Publishing to Open VSX Registry

**Prerequisites**:
- Open VSX account at https://open-vsx.org/
- `ovsx` CLI tool installed globally: `npm install -g ovsx`

**Publishing**:
```bash
cd helium-dsl-vscode
ovsx publish -p <your-access-token>
```

The VSIX file is uploaded to Open VSX Registry, making it available for installation via:
```bash
cursor --install-extension mezzanineware.helium-dsl-vscode
```

### Complete Build Workflow

For a complete end-to-end build, use the validation script:

```bash
./validate-dsl.sh -d <dsl-commons-path> -p <sample-project-path>
```

This automates all steps:
1. Extracts grammar from Java project
2. Converts ANTLR3 → ANTLR4
3. Validates grammar
4. Generates TypeScript parser
5. Extracts linting rules
6. Generates BIF metadata
7. Generates TextMate grammar
8. Builds language server
9. Builds extension
10. Packages VSIX using local packaging
11. Validates against sample project
12. Installs extension in Cursor

### Manual Build Commands

If you prefer to run steps individually:

```bash
# Extract and convert grammar
npm run build:extract      # Extract ANTLR3 grammar
npm run build:grammar      # Convert to ANTLR4
npm run build:validate     # Validate grammar

# Generate parser and metadata
npm run build:parser       # Generate TypeScript parser
npm run build:rules        # Extract linting rules
npm run build:bifs         # Generate BIF metadata
npm run build:textmate     # Generate TextMate grammar

# Build components
cd ../helium-dsl-language-server && npm run build
cd ../helium-vscode-tooling/helium-dsl-vscode && npm run build

# Package VSIX
cd ../helium-vscode-tooling
npm run package
```

### Generated Files

All generated files are stored in `helium-vscode-tooling/generated/`:
- `grammar/` - ANTLR3 and ANTLR4 grammar files
- `parser/` - Generated TypeScript parser files
- `rules/` - Linting rules metadata
- `bifs/` - Built-in function metadata
- `syntaxes/` - TextMate grammar for syntax highlighting

These files are **not** committed to git and are regenerated during each build.

### Updating the Extension

When the Helium DSL grammar changes:

1. **Extract Updated Grammar**: Run `npm run build:extract` to get the latest grammar
2. **Review Changes**: Check `generated/grammar/MezDSL.g3.hash` to verify grammar was updated
3. **Rebuild Everything**: Run `npm run build:all` or use the validation script
4. **Test**: Validate against sample projects
5. **Package**: Run `npm run package` to create new VSIX
6. **Publish**: Upload to Open VSX Registry with updated version number
