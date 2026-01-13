#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLING_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$TOOLING_ROOT/.." && pwd)"

EXT_DIR="$PROJECT_ROOT/helium-dsl-vscode"
SERVER_OUT="$PROJECT_ROOT/helium-dsl-language-server/out"
SERVER_NODE_MODULES="$PROJECT_ROOT/helium-dsl-language-server/node_modules"
GENERATED="$TOOLING_ROOT/generated"
OUT_DIR="$TOOLING_ROOT/dist"

# Create temporary working directory outside workspace to avoid hoisting issues
WORK_DIR=$(mktemp -d -t helium-dsl-vscode-packaging-XXXXXX)
trap "rm -rf $WORK_DIR" EXIT

echo "=========================================="
echo "Helium DSL VSIX Packaging (Local)"
echo "=========================================="
echo ""
echo "Working directory: $WORK_DIR"
echo ""

# Create writable working copy of extension
echo "Creating working copy of extension..."
cp -r "$EXT_DIR" "$WORK_DIR/extension"

# Copy language server output and dependencies
echo "Copying language server files..."
mkdir -p "$WORK_DIR/extension/server/out"
if [ -d "$SERVER_OUT" ] && [ -n "$(ls -A "$SERVER_OUT" 2>/dev/null)" ]; then
  cp -r "$SERVER_OUT"/* "$WORK_DIR/extension/server/out/" 2>/dev/null || true
else
  echo "  ⚠ Warning: Language server output directory is empty or missing"
fi

echo "Checking for language server dependencies..."
if [ -d "$SERVER_NODE_MODULES" ] && [ -n "$(ls -A "$SERVER_NODE_MODULES" 2>/dev/null)" ]; then
  echo "Copying language server dependencies..."
  mkdir -p "$WORK_DIR/extension/server/node_modules"
  cp -r "$SERVER_NODE_MODULES"/* "$WORK_DIR/extension/server/node_modules/"
  echo "  ✓ Language server dependencies copied"
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
else
  echo "  ✗ Error: Language server node_modules not found or empty"
  echo "  This may cause the language server to fail to start"
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

echo "Installing production dependencies..."
npm install --omit=dev --no-audit --no-fund

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

if [ -d "$WORK_DIR/extension/server/out" ] && [ -f "$WORK_DIR/extension/server/out/server.js" ]; then
  echo "  ✓ server/out/server.js exists"
else
  echo "  ✗ Error: server/out/server.js missing - packaging will fail"
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
