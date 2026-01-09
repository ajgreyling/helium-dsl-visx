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
