#!/bin/sh
# Install git hooks into .git/hooks so they run on commit.
# Run once after clone: ./scripts/install-git-hooks.sh
set -e
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
HOOKS_SRC="$ROOT/scripts/git-hooks"
HOOKS_DEST="$ROOT/.git/hooks"
mkdir -p "$HOOKS_DEST"
for hook in pre-commit; do
  if [ -f "$HOOKS_SRC/$hook" ]; then
    cp "$HOOKS_SRC/$hook" "$HOOKS_DEST/$hook"
    chmod +x "$HOOKS_DEST/$hook"
    echo "Installed .git/hooks/$hook"
  fi
done
