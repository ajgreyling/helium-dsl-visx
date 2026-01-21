#!/usr/bin/env bash
set -euo pipefail

# Skip the slow/redundant validation steps for a quicker local run:
# - Step 9.5: parser-only validation over the sample project
# - Step 14: language-server validation tests (Mocha)
export HELIUM_SKIP_PARSER_VALIDATION=1
export HELIUM_SKIP_TESTS=1

cd helium-vscode-tooling
./validate-dsl.sh -d /Users/ajgreyling/code/appexec-dsl-commons -p /Users/ajgreyling/code/munic-chat

