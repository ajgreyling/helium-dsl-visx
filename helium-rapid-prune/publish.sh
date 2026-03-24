#!/usr/bin/env bash
# Publish helium-rapid-prune to npm (bundles private helium-dsl-language-server).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

usage() {
  echo "Usage: $0 [npm-publish-args...]"
  echo ""
  echo "Runs: build language server → bundle into node_modules → bump patch.epoch version → npm publish"
  echo "Example: $0"
  echo "         $0 --dry-run"
  exit 1
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
fi

LS_ROOT="$SCRIPT_DIR/../helium-dsl-language-server"
if [[ ! -d "$LS_ROOT" ]]; then
  echo "Error: helium-dsl-language-server not found at $LS_ROOT"
  exit 1
fi

echo "=== Building helium-dsl-language-server ==="
( cd "$LS_ROOT" && npm run build )

echo "=== Bundling language server into helium-rapid-prune ==="
node "$SCRIPT_DIR/scripts/bundle-language-server.mjs"

PACKAGE_JSON="$SCRIPT_DIR/package.json"
ORIGINAL_VERSION="$(node -p "require('$PACKAGE_JSON').version")"
EPOCH="$(date +%s)"
MAJOR_MINOR="$(node -p "require('$PACKAGE_JSON').version.split('.').slice(0, 2).join('.')")"
NEW_VERSION="${MAJOR_MINOR}.${EPOCH}"

echo "=== Bumping version: ${ORIGINAL_VERSION} -> ${NEW_VERSION} ==="
node -e "
const fs = require('fs');
const pkgPath = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = process.argv[2];
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
" "$PACKAGE_JSON" "$NEW_VERSION"

restore_version() {
  node -e "
const fs = require('fs');
const pkgPath = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = process.argv[2];
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
" "$PACKAGE_JSON" "$ORIGINAL_VERSION"
  echo "Version restored to ${ORIGINAL_VERSION}"
}

trap restore_version ERR

echo "=== npm publish ==="
npm publish --access public "$@"

trap - ERR
restore_version

echo "=== Done ==="
