#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLING_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$TOOLING_ROOT/.." && pwd)"

EXT_DIR="$PROJECT_ROOT/helium-dsl-vscode"
SERVER_OUT="$PROJECT_ROOT/helium-dsl-language-server/out"
SERVER_NODE_MODULES="$PROJECT_ROOT/helium-dsl-language-server/node_modules"
MCP_OUT="$PROJECT_ROOT/helium-rapid-dsl-mcp/out"
GENERATED="$TOOLING_ROOT/generated"
OUT_DIR="$TOOLING_ROOT/dist"

# Create temporary working directory outside workspace to avoid hoisting issues
WORK_DIR=$(mktemp -d -t helium-dsl-vscode-packaging-XXXXXX)
trap "rm -rf $WORK_DIR" EXIT

# Fail fast if parser errors were detected earlier in the pipeline.
if [ -n "${HELIUM_PARSER_ERRORS_FILE:-}" ] && [ -s "${HELIUM_PARSER_ERRORS_FILE}" ]; then
  echo "✗ Error: Parser errors detected. See ${HELIUM_PARSER_ERRORS_FILE}"
  exit 1
fi

echo "=========================================="
echo "Helium DSL VSIX Packaging (Local)"
echo "=========================================="
echo ""
echo "Working directory: $WORK_DIR"
echo ""

# Create writable working copy of extension
echo "Creating working copy of extension..."
cp -r "$EXT_DIR" "$WORK_DIR/extension"

# Copy language server output
echo "Copying language server files..."
mkdir -p "$WORK_DIR/extension/server/out"
if [ -d "$SERVER_OUT" ] && [ -n "$(ls -A "$SERVER_OUT" 2>/dev/null)" ]; then
  cp -r "$SERVER_OUT"/* "$WORK_DIR/extension/server/out/" 2>/dev/null || true
  echo "  ✓ Language server output copied"
  # Copy language server package.json so Node can resolve helium-dsl-language-server imports
  # Adjust exports paths since package.json will be at server/out/package.json
  SERVER_PKG_JSON="$PROJECT_ROOT/helium-dsl-language-server/package.json"
  if [ -f "$SERVER_PKG_JSON" ]; then
    # Use Node.js to copy package.json and adjust exports paths
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('$SERVER_PKG_JSON', 'utf8'));
      // Adjust exports: from './out/src/api.js' to './src/api.js' (relative to server/out/)
      if (pkg.exports) {
        if (pkg.exports['./api']) {
          pkg.exports['./api'] = './src/api.js';
        }
        if (pkg.exports['.']) {
          pkg.exports['.'] = {
            types: pkg.exports['.'].types ? './src/server.d.ts' : undefined,
            default: './src/server.js'
          };
        }
      }
      fs.writeFileSync('$WORK_DIR/extension/server/out/package.json', JSON.stringify(pkg, null, '\t') + '\n');
    "
    echo "  ✓ Language server package.json copied and adjusted for module resolution"
  fi
else
  echo "  ⚠ Warning: Language server output directory is empty or missing"
fi

# Copy MCP server output
echo "Copying MCP server files..."
MCP_ENTRYPOINT="$MCP_OUT/src/index.js"
if [ ! -f "$MCP_ENTRYPOINT" ]; then
  echo "  ✗ Error: MCP server not built. Expected: $MCP_ENTRYPOINT"
  echo "  Please run: cd helium-rapid-dsl-mcp && npm run build"
  exit 1
fi
mkdir -p "$WORK_DIR/extension/server/mcp/out"
if [ -d "$MCP_OUT" ] && [ -n "$(ls -A "$MCP_OUT" 2>/dev/null)" ]; then
  cp -r "$MCP_OUT"/* "$WORK_DIR/extension/server/mcp/out/" 2>/dev/null || true
  echo "  ✓ MCP server output copied"
else
  echo "  ✗ Error: MCP server output directory is empty or missing"
  exit 1
fi

# Copy generated files
if [ -d "$GENERATED" ] && [ -n "$(ls -A "$GENERATED" 2>/dev/null)" ]; then
  echo "Copying generated files..."
  cp -r "$GENERATED" "$WORK_DIR/extension/"
else
  echo "  ⚠ Warning: Generated files directory is empty or missing"
fi

cd "$WORK_DIR/extension"

echo "Installing extension production dependencies..."
npm install --omit=dev --no-audit --no-fund

# Install server dependencies in temp dir (includes MCP deps)
echo "Installing server production dependencies..."
cd "$WORK_DIR/extension/server"
npm install --omit=dev --no-audit --no-fund
echo "  ✓ Server dependencies installed"

# Resolve symlink for helium-dsl-language-server (file:./out creates a symlink that vsce can't handle)
if [ -L "$WORK_DIR/extension/server/node_modules/helium-dsl-language-server" ]; then
  echo "  Resolving symlink for helium-dsl-language-server..."
  SYMLINK_TARGET=$(readlink "$WORK_DIR/extension/server/node_modules/helium-dsl-language-server")
  ABS_TARGET=$(cd "$WORK_DIR/extension/server/node_modules" && readlink -f "$SYMLINK_TARGET")
  rm "$WORK_DIR/extension/server/node_modules/helium-dsl-language-server"
  cp -r "$ABS_TARGET" "$WORK_DIR/extension/server/node_modules/helium-dsl-language-server"
  echo "  ✓ Symlink resolved and replaced with actual files"
fi

# Verify critical dependencies are present
if [ -d "$WORK_DIR/extension/server/node_modules/vscode-languageserver" ]; then
  echo "  ✓ Verified: vscode-languageserver found"
  
  # Add exports field to vscode-languageserver/package.json for ES module resolution
  echo "  Adding exports field to vscode-languageserver/package.json for ES module support..."
  VSLS_PKG_JSON="$WORK_DIR/extension/server/node_modules/vscode-languageserver/package.json"
  if [ -f "$VSLS_PKG_JSON" ]; then
    # Use Node.js to add exports field while preserving existing fields
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('$VSLS_PKG_JSON', 'utf8'));
      pkg.exports = {
        '.': './lib/node/main.js',
        './node': './node.js',
        './node.js': './node.js'
      };
      fs.writeFileSync('$VSLS_PKG_JSON', JSON.stringify(pkg, null, '\t') + '\n');
    "
    echo "  ✓ Exports field added to vscode-languageserver/package.json"
  else
    echo "  ⚠ Warning: vscode-languageserver/package.json not found, skipping exports field"
  fi
else
  echo "  ✗ Error: vscode-languageserver not found in server/node_modules"
  exit 1
fi

# Verify MCP dependencies are present
if [ -d "$WORK_DIR/extension/server/node_modules/@modelcontextprotocol" ]; then
  echo "  ✓ Verified: @modelcontextprotocol/sdk found"
else
  echo "  ✗ Error: @modelcontextprotocol/sdk not found in server/node_modules"
  exit 1
fi

cd "$WORK_DIR/extension"

# Move nested dependencies to root node_modules (vsce doesn't follow nested node_modules)
echo "Moving nested dependencies to root node_modules..."
if [ -d "node_modules/vscode-languageclient/node_modules" ]; then
  for dep in node_modules/vscode-languageclient/node_modules/*; do
    if [ -d "$dep" ] && [ -e "$dep" ]; then
      dep_name=$(basename "$dep")
      # Skip if it's the parent package itself or already exists at root
      if [ "$dep_name" != "vscode-languageclient" ] && [ ! -d "node_modules/$dep_name" ]; then
        echo "  Moving $dep_name to root..."
        mv "$dep" "node_modules/$dep_name" 2>/dev/null || (cp -r "$dep" "node_modules/$dep_name" && rm -rf "$dep")
      fi
    fi
  done
  # Remove empty nested node_modules directory if it exists
  rmdir node_modules/vscode-languageclient/node_modules 2>/dev/null || true
fi

# Remove all remaining nested node_modules to prevent duplicate file errors
# IMPORTANT: Exclude server/node_modules as it's required for the language server
echo "Removing remaining nested node_modules (excluding server/node_modules)..."
find node_modules -type d -name node_modules ! -path "node_modules" ! -path "server/node_modules" ! -path "server/node_modules/*" -exec rm -rf {} + 2>/dev/null || true

# Verify server/node_modules still exists after cleanup
if [ ! -d "$WORK_DIR/extension/server/node_modules" ] || [ -z "$(ls -A "$WORK_DIR/extension/server/node_modules" 2>/dev/null)" ]; then
  echo "  ✗ Error: server/node_modules was removed or is empty after cleanup"
  exit 1
else
  echo "  ✓ Verified: server/node_modules preserved"
fi

echo "Validating dependency tree..."
npm list --omit=dev || true

# Final verification before packaging
echo "Verifying server dependencies before packaging..."
if [ -d "$WORK_DIR/extension/server/node_modules/vscode-languageserver" ]; then
  echo "  ✓ server/node_modules/vscode-languageserver exists"
else
  echo "  ✗ Error: server/node_modules/vscode-languageserver missing - packaging will fail"
  exit 1
fi

if [ -d "$WORK_DIR/extension/server/out" ] && [ -f "$WORK_DIR/extension/server/out/src/server.js" ]; then
  echo "  ✓ server/out/src/server.js exists"
else
  echo "  ✗ Error: server/out/src/server.js missing - packaging will fail"
  exit 1
fi

if [ -d "$WORK_DIR/extension/server/mcp/out" ] && [ -f "$WORK_DIR/extension/server/mcp/out/src/index.js" ]; then
  echo "  ✓ server/mcp/out/src/index.js exists"
else
  echo "  ✗ Error: server/mcp/out/src/index.js missing - packaging will fail"
  exit 1
fi

# Ensure output directory exists
mkdir -p "$OUT_DIR"

echo "Packaging VSIX..."
npx --yes @vscode/vsce package --out "$OUT_DIR/helium-dsl.vsix" --no-yarn --allow-missing-repository

echo ""
echo "VSIX created:"
ls -lh "$OUT_DIR/helium-dsl.vsix"

echo ""
echo "=========================================="
echo "✓ VSIX packaging complete!"
echo "  Location: $OUT_DIR/helium-dsl.vsix"
echo "=========================================="
