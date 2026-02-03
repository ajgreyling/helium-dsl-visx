#!/usr/bin/env bash
set -euo pipefail

DSL_COMMONS_PATH="${DSL_COMMONS_PATH:-}"
SAMPLE_PROJECT_PATH="${SAMPLE_PROJECT_PATH:-}"

usage() {
  echo "Usage: $0 -d <dsl-commons-path> -p <sample-project-path>"
  echo ""
  echo "Arguments:"
  echo "  -d    Path to appexec-dsl-commons folder"
  echo "  -p    Path to sample DSL project to validate (contains .mez files)"
  echo ""
  echo "Environment variables (alternatives to flags):"
  echo "  DSL_COMMONS_PATH     Path to appexec-dsl-commons folder"
  echo "  SAMPLE_PROJECT_PATH  Path to sample DSL project"
  exit 1
}

while getopts "d:p:h" opt; do
  case "$opt" in
    d) DSL_COMMONS_PATH="$OPTARG" ;;
    p) SAMPLE_PROJECT_PATH="$OPTARG" ;;
    h) usage ;;
    *) usage ;;
  esac
done

if [ -z "$DSL_COMMONS_PATH" ] || [ -z "$SAMPLE_PROJECT_PATH" ]; then
  echo "Error: both -d and -p are required (or set DSL_COMMONS_PATH and SAMPLE_PROJECT_PATH)."
  usage
fi

# Resolve relative paths to absolute paths before passing to validate-dsl.sh
# (validate-dsl.sh runs from helium-vscode-tooling, so relative paths would be wrong)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DSL_COMMONS_PATH="$(cd "$SCRIPT_DIR" && cd "$DSL_COMMONS_PATH" && pwd)"
SAMPLE_PROJECT_PATH="$(cd "$SCRIPT_DIR" && cd "$SAMPLE_PROJECT_PATH" && pwd)"

cd helium-vscode-tooling
./validate-dsl.sh -d "$DSL_COMMONS_PATH" -p "$SAMPLE_PROJECT_PATH"