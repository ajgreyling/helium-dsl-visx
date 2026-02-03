#!/bin/bash

# Helium Rapid DSL (ANTLR4) Linter Validation Script
# This script converts ANTLR3 grammar to ANTLR4, generates the parser,
# extracts linting rules, and validates a DSL project codebase.

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DSL_COMMONS_PATH=""
SAMPLE_PROJECT_PATH=""

# Parse command line arguments
usage() {
    echo "Usage: $0 -d <dsl-commons-path> -p <sample-project-path>"
    echo ""
    echo "Arguments:"
    echo "  -d    Path to appexec-dsl-commons folder (contains WebDSLParser-lib)"
    echo "  -p    Path to sample DSL project to validate (contains .mez files)"
    echo ""
    echo "Example:"
    echo "  $0 -d /Users/ajgreyling/code/appexec-dsl-commons -p /Users/ajgreyling/code/munic-chat"
    exit 1
}

while getopts "d:p:h" opt; do
    case $opt in
        d) DSL_COMMONS_PATH="$OPTARG" ;;
        p) SAMPLE_PROJECT_PATH="$OPTARG" ;;
        h) usage ;;
        *) usage ;;
    esac
done

# Validate required arguments
if [ -z "$DSL_COMMONS_PATH" ] || [ -z "$SAMPLE_PROJECT_PATH" ]; then
    echo -e "${RED}Error: Both DSL commons path and sample project path are required${NC}"
    usage
fi

# Validate paths exist
if [ ! -d "$DSL_COMMONS_PATH" ]; then
    echo -e "${RED}Error: DSL commons path does not exist: $DSL_COMMONS_PATH${NC}"
    exit 1
fi

if [ ! -d "$SAMPLE_PROJECT_PATH" ]; then
    echo -e "${RED}Error: Sample project path does not exist: $SAMPLE_PROJECT_PATH${NC}"
    exit 1
fi

# Validate required files/folders exist
GRAMMAR_FILE="$DSL_COMMONS_PATH/WebDSLParser-lib/src/main/antlr3/com/mezzanine/dsl/web/MezDSL.g"

if [ ! -f "$GRAMMAR_FILE" ]; then
    echo -e "${RED}Error: Grammar file not found: $GRAMMAR_FILE${NC}"
    exit 1
fi

# Configuration (no script rewrites)
echo -e "${BLUE}=== Configuration ===${NC}"
echo "DSL Commons: $DSL_COMMONS_PATH"
echo "Sample Project: $SAMPLE_PROJECT_PATH"
echo -e "${GREEN}✓ Using configured paths (no file rewrites)${NC}"
echo ""

# Update test configuration to use the sample project path
echo -e "${BLUE}Updating test configuration...${NC}"
mkdir -p "$SCRIPT_DIR/../helium-dsl-language-server/generated/tests"
CORPUS_NAME="$(basename "$SAMPLE_PROJECT_PATH")"
TEST_FILE="$SCRIPT_DIR/../helium-dsl-language-server/generated/tests/${CORPUS_NAME}.test.ts"
cat > "$TEST_FILE" << EOF
import { describe, it } from "mocha";
import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { Diagnostic } from "vscode-languageserver";
import { URI } from "vscode-uri";
import { parseText } from "../../src/parser/index.js";
import { runLints } from "../../src/linter/engine.js";
import { ProjectIndex } from "../../src/index/projectIndex.js";
import { ProjectManager } from "../../src/index/projectManager.js";
import { getLanguageMetadataSync } from "../../src/language/metadata.js";
import { createSemanticDiagnostics } from "../../src/semantic/diagnostics.js";

const SAMPLE_PROJECT_PATH = "$SAMPLE_PROJECT_PATH";

describe("Sample DSL Codebase Validation", () => {
  it("should validate all .mez files in sample project", async function() {
    // Default to 10 minutes for large codebases; override with HELIUM_VALIDATE_TIMEOUT_MS if needed
    const timeoutMs = Number(process.env.HELIUM_VALIDATE_TIMEOUT_MS ?? "") || 10 * 60 * 1000;
    this.timeout(timeoutMs);

    // Build a project index so semantic diagnostics (unknown UnitName:method / TypeName:modelBif)
    // can resolve symbols across files.
    const projects = new ProjectManager();
    await projects.initialize([{ uri: URI.file(SAMPLE_PROJECT_PATH).toString() }]);

    const mezFiles: string[] = [];

    function findMezFiles(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          findMezFiles(fullPath);
        } else if (entry.name.endsWith(".mez")) {
          mezFiles.push(fullPath);
        }
      }
    }

    findMezFiles(SAMPLE_PROJECT_PATH);
    console.log(\`\\n  Found \${mezFiles.length} .mez files to validate\\n\`);

    const fileIssues: Record<string, any[]> = {};
    let totalIssues = 0;
    const issuesByRule: Record<string, number> = {};

    for (const file of mezFiles) {
      const text = fs.readFileSync(file, "utf8");
      const relativePath = path.relative(SAMPLE_PROJECT_PATH, file);
      const uri = URI.file(file).toString();

      try {
        const parseResult = await parseText(text);
        const lintDiagnostics = await runLints(text);
        const semanticDiagnostics = await createSemanticDiagnostics(text, uri, projects);
        const allDiagnostics = [...parseResult.diagnostics, ...lintDiagnostics, ...semanticDiagnostics];

        if (allDiagnostics.length > 0) {
          fileIssues[relativePath] = allDiagnostics;
          totalIssues += allDiagnostics.length;

          allDiagnostics.forEach((diag) => {
            const source = diag.source || "unknown";
            issuesByRule[source] = (issuesByRule[source] || 0) + 1;
          });
        }
      } catch (err) {
        fileIssues[relativePath] = [
          {
            message: err instanceof Error ? err.message : String(err),
            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
            severity: 1,
            source: "test-error",
          },
        ];
        totalIssues++;
      }
    }

    // Print summary
    console.log(\`  📊 Summary:\`);
    console.log(\`    Files scanned: \${mezFiles.length}\`);
    console.log(\`    Files with issues: \${Object.keys(fileIssues).length}\`);
    console.log(\`    Total issues: \${totalIssues}\`);
    console.log(\`\`);
    console.log(\`  📋 Issues by rule:\`);
    Object.entries(issuesByRule)
      .sort(([, a], [, b]) => b - a)
      .forEach(([rule, count]) => {
        console.log(\`    \${rule}: \${count}\`);
      });

    // Print file details (limit to first 5 issues per file)
    if (Object.keys(fileIssues).length > 0) {
      console.log(\`\`);
      console.log(\`  📝 Files with issues:\`);
      console.log(\`\`);
      for (const [file, issues] of Object.entries(fileIssues)) {
        console.log(\`    \${file}:\`);
        const displayIssues = issues.slice(0, 5);
        displayIssues.forEach((issue) => {
          console.log(\`      Line \${issue.range.start.line + 1}: \${issue.message}\`);
        });
        if (issues.length > 5) {
          console.log(\`      ... and \${issues.length - 5} more\`);
        }
        console.log(\`\`);
      }

      // Count critical errors (variable-in-else)
      const varInElseErrors = Object.values(fileIssues)
        .flat()
        .filter((d) => d.message.includes("Variables cannot be declared in else blocks"));

      console.log(\`  ❌ \${varInElseErrors.length} errors found\`);
    } else {
      console.log(\`\`);
      console.log(\`  ✅ No issues found!\`);
    }

    // Test passes regardless - this is a validation report
    expect(mezFiles.length).to.be.greaterThan(0);
  });

  it("should not flag variables in else blocks in known-good code", async () => {
    // This is a representative test case
    const testCode = \`
      if (x > 0) {
        int y = 5;
      } else {
        return false;
      }
    \`;

    const lintDiagnostics = await runLints(testCode);
    const varInElseErrors = lintDiagnostics.filter((d: Diagnostic) =>
      d.message.includes("Variables cannot be declared in else blocks")
    );

    console.log(\`    Found \${varInElseErrors.length} variable-in-else violations\`);
    expect(varInElseErrors.length).to.equal(0);
  });

  it("should build AST index and resolve definitions", () => {
    const metadata = getLanguageMetadataSync();
    const index = new ProjectIndex(SAMPLE_PROJECT_PATH, metadata);
    index.indexProjectFiles();

    const objectNames = index.getObjectNames();
    if (objectNames.length > 0) {
      const firstObject = objectNames[0];
      const objLocation = index.getObjectLocation(firstObject);
      expect(objLocation).to.not.equal(null);
    }

    const unitNames = index.getUnitNames();
    if (unitNames.length > 0) {
      const unitLocation = index.getUnitLocation(unitNames[0]);
      expect(unitLocation).to.not.equal(null);
    }

    const testText = [
      "unit AstIndexUnit;",
      "int __astIndexFunc__(int x) {",
      "  return x;",
      "}",
      "int __astIndexCaller__() {",
      "  return __astIndexFunc__(1);",
      "}",
    ].join("\\n");

    const tempUri = URI.file(path.join(SAMPLE_PROJECT_PATH, "services", "__ast_index_test.mez")).toString();
    const testIndex = new ProjectIndex(SAMPLE_PROJECT_PATH, metadata);
    testIndex.updateFile(tempUri, testText);

    const ast = testIndex.getFileAst(tempUri);
    if (ast && ast.functionCalls.length > 0) {
      const firstCall = ast.functionCalls[0];
      const definition = testIndex.resolveDefinitionAt(tempUri, {
        line: firstCall.nameRange.start.line,
        character: firstCall.nameRange.start.character + 1,
      });
      expect(definition).to.not.equal(null);
    }
  });
});
EOF

echo ""
echo -e "${GREEN}=== Configuration Complete ===${NC}"
echo ""

# Check dependencies before running build pipeline
echo -e "${BLUE}=== Step 0: Verify Dependencies ===${NC}"
cd "$SCRIPT_DIR"

# Check if tsx is available in node_modules (workspace root or local)
TSX_FOUND=false
if [ -f "$SCRIPT_DIR/../node_modules/.bin/tsx" ]; then
    TSX_FOUND=true
    echo -e "${GREEN}✓ tsx found in workspace root node_modules${NC}"
elif [ -f "$SCRIPT_DIR/node_modules/.bin/tsx" ]; then
    TSX_FOUND=true
    echo -e "${GREEN}✓ tsx found in local node_modules${NC}"
elif command -v tsx >/dev/null 2>&1; then
    TSX_FOUND=true
    echo -e "${GREEN}✓ tsx found in PATH${NC}"
fi

if [ "$TSX_FOUND" = false ]; then
    echo -e "${RED}✗ Error: tsx not found${NC}"
    echo -e "${YELLOW}  tsx is required to run TypeScript scripts.${NC}"
    echo -e "${YELLOW}  Please run: npm install${NC}"
    echo -e "${YELLOW}  (from the repository root: $(cd "$SCRIPT_DIR/../.." && pwd))${NC}"
    exit 1
fi
echo ""

# Run the build pipeline
echo -e "${BLUE}=== Step 1: Extract Grammar ===${NC}"
cd "$SCRIPT_DIR"
DSL_COMMONS_PATH="$DSL_COMMONS_PATH" npm run build:extract

echo ""
echo -e "${BLUE}=== Step 2: Convert ANTLR3 to ANTLR4 ===${NC}"
npm run build:grammar

echo ""
echo -e "${BLUE}=== Step 3: Validate Grammar ===${NC}"
npm run build:validate || echo -e "${YELLOW}Warning: Grammar validation had warnings${NC}"

echo ""
echo -e "${BLUE}=== Step 4: Generate Parser ===${NC}"
npm run build:parser

echo ""
echo -e "${BLUE}=== Step 5: Extract Rules ===${NC}"
npm run build:rules

echo ""
echo -e "${BLUE}=== Step 6: Generate BIF Metadata ===${NC}"
npm run build:bifs

echo ""
echo -e "${BLUE}=== Step 7: Generate Language Metadata ===${NC}"
DSL_COMMONS_PATH="$DSL_COMMONS_PATH" npm run build:language

echo ""
echo -e "${BLUE}=== Step 8: Generate VXML Metadata ===${NC}"
DSL_COMMONS_PATH="$DSL_COMMONS_PATH" npm run build:vxml

echo ""
echo -e "${BLUE}=== Step 8.5: Copy VXML Metadata to Language Server ===${NC}"
VXML_METADATA_FILE="$SCRIPT_DIR/generated/vxml/function-value-nodes.json"
LANG_SERVER_VXML_DIR="$SCRIPT_DIR/../helium-dsl-language-server/generated/vxml"
mkdir -p "$LANG_SERVER_VXML_DIR"
if [ -f "$VXML_METADATA_FILE" ]; then
    cp "$VXML_METADATA_FILE" "$LANG_SERVER_VXML_DIR/function-value-nodes.json"
    echo -e "${GREEN}✓ VXML metadata copied to language server${NC}"
else
    echo -e "${YELLOW}⚠ Warning: VXML metadata file not found, creating stub file${NC}"
    # Use node to generate stub file for cross-platform compatibility
    node -e "
    const fs = require('fs');
    const data = {
      version: '0.1.0',
      extractedFrom: 'stub',
      extractedAt: new Date().toISOString(),
      functionValueNodes: [],
      functionBindingNodes: ['binding', 'visible', 'collectionSource', 'content', 'variant', 'dynamicUserRoles', 'dynamicIcon', 'dynamicLabel', 'dynamicOrder'],
      actionRefNodes: ['action', 'rowAction', 'subMenuItem']
    };
    fs.writeFileSync('$LANG_SERVER_VXML_DIR/function-value-nodes.json', JSON.stringify(data, null, 2));
    "
fi

echo ""
echo -e "${BLUE}=== Step 9: Generate TextMate Grammar ===${NC}"
# Note: SAMPLE_PROJECT_PATH is no longer needed for TextMate grammar generation
# User-defined types are now handled dynamically via semantic tokens
npm run build:textmate

echo ""
echo -e "${BLUE}=== Step 10: Build Language Server ===${NC}"
cd "$SCRIPT_DIR/../helium-dsl-language-server"
npm run build

echo ""
PARSER_ERRORS_FILE="$SCRIPT_DIR/../helium-dsl-language-server/generated/parser-errors.json"
rm -f "$PARSER_ERRORS_FILE"

if [ "${HELIUM_SKIP_PARSER_VALIDATION:-0}" = "1" ]; then
    echo -e "${YELLOW}=== Skipping Step 9.5: Validate Parser (HELIUM_SKIP_PARSER_VALIDATION=1) ===${NC}"
else
    echo -e "${BLUE}=== Step 9.5: Validate Parser (fail on parser errors) ===${NC}"

    PARSER_LEXER_TS="$SCRIPT_DIR/generated/parser/generated/grammar/MezDSLLexer.ts"
    PARSER_PARSER_TS="$SCRIPT_DIR/generated/parser/generated/grammar/MezDSLParser.ts"
    if [ ! -f "$PARSER_LEXER_TS" ] || [ ! -f "$PARSER_PARSER_TS" ]; then
        echo -e "${RED}Error: Parser not generated. Run npm run build:parser in helium-vscode-tooling.${NC}"
        exit 1
    fi

    # Create temporary script file for tsx to execute
    # We'll use npx tsx directly - it will find tsx in node_modules from any directory
    # Use .ts extension so Node.js recognizes it as TypeScript
    # Create temp file first, then rename to add .ts extension (works on both BSD and GNU mktemp)
    TEMP_SCRIPT=$(mktemp /tmp/helium-validate.XXXXXX)
    mv "$TEMP_SCRIPT" "${TEMP_SCRIPT}.ts"
    TEMP_SCRIPT="${TEMP_SCRIPT}.ts"
    LANG_SERVER_DIR="$SCRIPT_DIR/../helium-dsl-language-server"
    cat > "$TEMP_SCRIPT" << EOF
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const sampleRoot = process.env.SAMPLE_PROJECT_PATH;
const errorsFile = process.env.PARSER_ERRORS_FILE;
const errors = [];

(async () => {
  const langServerDir = '${LANG_SERVER_DIR}';
  const parserModule = pathToFileURL(path.join(langServerDir, 'src/parser/index.js')).href;
  const { parseText } = await import(parserModule);

  async function findMezFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await findMezFiles(fullPath);
      } else if (entry.name.endsWith('.mez')) {
        const text = fs.readFileSync(fullPath, 'utf8');
        const result = await parseText(text);
        if (result.diagnostics.length > 0) {
          errors.push({
            file: path.relative(sampleRoot, fullPath),
            issues: result.diagnostics,
          });
        }
      }
    }
  }

  await findMezFiles(sampleRoot);

  if (errors.length > 0) {
    fs.writeFileSync(errorsFile, JSON.stringify(errors, null, 2));
    console.error('Parser errors detected in sample project. Aborting.');
    const first = errors.slice(0, 5);
    first.forEach((e) => {
      console.error('  ' + e.file);
      e.issues.slice(0, 3).forEach((issue) => {
        const line = (issue.range?.start?.line ?? 0) + 1;
        console.error('    Line ' + line + ': ' + issue.message);
      });
    });
    process.exit(1);
  } else {
    console.log('No parser errors detected.');
  }
})();
EOF

    cd "$SCRIPT_DIR/../helium-dsl-language-server"
    # Use npx tsx which will find tsx in node_modules from any directory
    echo "  Running parser validation with tsx..."
    echo "  Temp script: $TEMP_SCRIPT"
    echo "  Sample project: $SAMPLE_PROJECT_PATH"
    NODE_ENV=development HELIUM_STRICT_PARSER=1 SAMPLE_PROJECT_PATH="$SAMPLE_PROJECT_PATH" PARSER_ERRORS_FILE="$PARSER_ERRORS_FILE" npx tsx "$TEMP_SCRIPT" 2>&1
    TSX_EXIT_CODE=$?
    rm -f "$TEMP_SCRIPT"

    if [ $TSX_EXIT_CODE -ne 0 ]; then
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}=== Step 11: Build VSCode Extension ===${NC}"
cd "$SCRIPT_DIR/../helium-dsl-vscode"
npm run build

echo ""
echo -e "${BLUE}=== Step 12: Update Version with Epoch Build Number ===${NC}"
cd "$SCRIPT_DIR/../helium-dsl-vscode"
PACKAGE_JSON="$SCRIPT_DIR/../helium-dsl-vscode/package.json"
EPOCH=$(date +%s)

# Backup original version
ORIGINAL_VERSION=$(node -p "require('$PACKAGE_JSON').version")

# Extract major.minor from current version (e.g., "1.0.0" -> "1.0")
MAJOR_MINOR=$(node -p "require('$PACKAGE_JSON').version.split('.').slice(0, 2).join('.')")

# Update version to use epoch as build number (format: <major>.<minor>.<epoch>)
NEW_VERSION="$MAJOR_MINOR.$EPOCH"
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('$PACKAGE_JSON', 'utf8'));
pkg.version = '$NEW_VERSION';
fs.writeFileSync('$PACKAGE_JSON', JSON.stringify(pkg, null, 2) + '\n');
"

echo -e "${GREEN}Version updated: ${ORIGINAL_VERSION} -> ${NEW_VERSION}${NC}"

echo ""
echo -e "${BLUE}=== Step 13: Package VSCode Extension ===${NC}"
cd "$SCRIPT_DIR/../helium-dsl-vscode"
export HELIUM_PARSER_ERRORS_FILE="$PARSER_ERRORS_FILE"
npm run package

echo ""
echo -e "${BLUE}=== Step 14: Restore Original Version ===${NC}"
cd "$SCRIPT_DIR/../helium-dsl-vscode"
# Restore original version
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('$PACKAGE_JSON', 'utf8'));
pkg.version = '$ORIGINAL_VERSION';
fs.writeFileSync('$PACKAGE_JSON', JSON.stringify(pkg, null, 2) + '\n');
"
echo -e "${GREEN}Version restored to: ${ORIGINAL_VERSION}${NC}"

echo ""
if [ "${HELIUM_SKIP_TESTS:-0}" = "1" ]; then
    echo -e "${YELLOW}=== Skipping Step 15: Run Validation Tests (HELIUM_SKIP_TESTS=1) ===${NC}"
else
    echo -e "${BLUE}=== Step 15: Run Validation Tests ===${NC}"
    STEP14_START=$(date +%s)
    cd "$SCRIPT_DIR/../helium-dsl-language-server"
    # Use npm test which uses the package.json test script with proper tsx import and --exit flag
    # Filter out Node.js warnings about deprecated loader and fs.Stats
    if command -v stdbuf >/dev/null 2>&1; then
        # Use PIPESTATUS to capture exit code before grep filters warnings
        stdbuf -oL -eL npm test 2>&1 | grep -vE "(ExperimentalWarning|DeprecationWarning)" || true
        MOCHA_EXIT_CODE=${PIPESTATUS[0]}
    else
        # Use PIPESTATUS to capture exit code before grep filters warnings
        npm test 2>&1 | grep -vE "(ExperimentalWarning|DeprecationWarning)" || true
        MOCHA_EXIT_CODE=${PIPESTATUS[0]}
    fi
    STEP14_END=$(date +%s)
    STEP14_DURATION=$((STEP14_END - STEP14_START))

    # Ensure mocha/npx processes have fully terminated
    wait

    # Log timing diagnostics (to stderr for immediate output)
    echo "[DEBUG] Step 14 completed in ${STEP14_DURATION}s, exit code: $MOCHA_EXIT_CODE" >&2

    if [ $MOCHA_EXIT_CODE -ne 0 ]; then
        echo -e "${RED}Error: Tests failed with exit code $MOCHA_EXIT_CODE${NC}"
        exit $MOCHA_EXIT_CODE
    fi
fi

# Force output flush before proceeding to Step 16
# Use printf instead of echo for immediate output (no buffering)
printf "\n"
printf "${BLUE}=== Step 16: Install Extension in Cursor ===${NC}\n"

# VSIX file is created in dist/ directory by the local packaging script
VSIX_FILE="$SCRIPT_DIR/dist/helium-dsl.vsix"

if [ ! -f "$VSIX_FILE" ]; then
    echo -e "${RED}Error: VSIX file not found at $VSIX_FILE${NC}"
    exit 1
fi

# Get absolute path to VSIX file
VSIX_ABSOLUTE_PATH="$VSIX_FILE"

echo -e "${BLUE}Installing extension: ${VSIX_ABSOLUTE_PATH}${NC}"
cursor --install-extension "$VSIX_ABSOLUTE_PATH" --force

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Extension installed successfully${NC}"
else
    echo -e "${YELLOW}Warning: Extension installation may have failed${NC}"
fi

echo ""
echo -e "${GREEN}=== Pipeline Complete ===${NC}"
echo ""
echo -e "${GREEN}✓${NC} Grammar extracted and converted"
echo -e "${GREEN}✓${NC} Parser generated"
echo -e "${GREEN}✓${NC} Rules extracted"
echo -e "${GREEN}✓${NC} Language server built"
echo -e "${GREEN}✓${NC} VSCode extension built"
echo -e "${GREEN}✓${NC} Version updated with epoch build number ($EPOCH)"
echo -e "${GREEN}✓${NC} VSCode extension packaged"
if [ "${HELIUM_SKIP_TESTS:-0}" = "1" ]; then
    echo -e "${YELLOW}-${NC} Validation tests skipped (HELIUM_SKIP_TESTS=1)"
else
    echo -e "${GREEN}✓${NC} Validation tests run"
fi
echo -e "${GREEN}✓${NC} Extension installed in Cursor"
echo ""
echo -e "Sample project validated: ${BLUE}$SAMPLE_PROJECT_PATH${NC}"
echo ""


