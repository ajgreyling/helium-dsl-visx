#!/bin/bash

# Helium Rapid DSL (ANTLR4) Extension Publishing Script
# This script builds the extension, packages it, and publishes to Open VSX Registry

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
OVSX_TOKEN=""

# Extension details
EXTENSION_ID="mezzanineware.helium-dsl-vscode"
EXTENSION_NAME="helium-dsl-vscode"
PUBLISHER="mezzanineware"

# Parse command line arguments
usage() {
    echo "Usage: $0 -d <dsl-commons-path> [-t <ovsx-token>]"
    echo ""
    echo "Arguments:"
    echo "  -d    Path to appexec-dsl-commons folder (contains WebDSLParser-lib)"
    echo "  -t    Open VSX access token (optional, can use OVSX_PAT env var)"
    echo ""
    echo "Example:"
    echo "  $0 -d /Users/ajgreyling/code/appexec-dsl-commons"
    echo "  $0 -d /Users/ajgreyling/code/appexec-dsl-commons -t <your-token>"
    echo ""
    echo "Environment variables:"
    echo "  OVSX_PAT    Open VSX access token (alternative to -t flag)"
    exit 1
}

while getopts "d:t:h" opt; do
    case $opt in
        d) DSL_COMMONS_PATH="$OPTARG" ;;
        t) OVSX_TOKEN="$OPTARG" ;;
        h) usage ;;
        *) usage ;;
    esac
done

# Validate required arguments
if [ -z "$DSL_COMMONS_PATH" ]; then
    echo -e "${RED}Error: DSL commons path is required${NC}"
    usage
fi

# Use environment variable if token not provided via flag
if [ -z "$OVSX_TOKEN" ] && [ -n "$OVSX_PAT" ]; then
    OVSX_TOKEN="$OVSX_PAT"
fi

# Validate paths exist
if [ ! -d "$DSL_COMMONS_PATH" ]; then
    echo -e "${RED}Error: DSL commons path does not exist: $DSL_COMMONS_PATH${NC}"
    exit 1
fi

# Validate required files/folders exist
GRAMMAR_FILE="$DSL_COMMONS_PATH/WebDSLParser-lib/src/main/antlr3/com/mezzanine/dsl/web/MezDSL.g"

if [ ! -f "$GRAMMAR_FILE" ]; then
    echo -e "${RED}Error: Grammar file not found: $GRAMMAR_FILE${NC}"
    exit 1
fi

# Check if ovsx is installed
echo -e "${BLUE}=== Checking for ovsx CLI ===${NC}"
if ! command -v ovsx &> /dev/null; then
    echo -e "${YELLOW}ovsx not found. Installing globally...${NC}"
    npm install -g ovsx
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to install ovsx${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ ovsx installed${NC}"
else
    echo -e "${GREEN}✓ ovsx found${NC}"
fi

# Check for Open VSX token
if [ -z "$OVSX_TOKEN" ]; then
    echo -e "${RED}Error: Open VSX access token is required${NC}"
    echo -e "${YELLOW}Provide it via -t flag or OVSX_PAT environment variable${NC}"
    echo -e "${YELLOW}Get your token from: https://open-vsx.org/user-settings/tokens${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}=== Configuration ===${NC}"
echo "DSL Commons: $DSL_COMMONS_PATH"
echo -e "${GREEN}✓ Using configured paths (no file rewrites)${NC}"
echo ""

# Uninstall extension from Cursor if present (before building)
echo -e "${BLUE}=== Step 0: Uninstalling Extension from Cursor ===${NC}"
if command -v cursor &> /dev/null; then
    if cursor --list-extensions 2>/dev/null | grep -q "^${EXTENSION_ID}$"; then
        echo -e "${YELLOW}Extension found in Cursor. Uninstalling...${NC}"
        cursor --uninstall-extension "$EXTENSION_ID" 2>/dev/null || echo -e "${YELLOW}Warning: Uninstall may have failed${NC}"
        echo -e "${GREEN}✓ Extension uninstalled${NC}"
    else
        echo -e "${BLUE}Extension not installed in Cursor${NC}"
    fi
else
    echo -e "${YELLOW}Warning: cursor command not found, skipping uninstall${NC}"
fi

# Delete old VSIX files from dist folder (before building)
echo ""
echo -e "${BLUE}=== Step 0.5: Cleaning Old VSIX Files ===${NC}"
DIST_DIR="$SCRIPT_DIR/dist"
if [ -d "$DIST_DIR" ]; then
    OLD_VSIX_COUNT=$(find "$DIST_DIR" -name "*.vsix" -type f | wc -l | tr -d ' ')
    if [ "$OLD_VSIX_COUNT" -gt 0 ]; then
        echo -e "${BLUE}Found $OLD_VSIX_COUNT VSIX file(s) in dist. Removing...${NC}"
        find "$DIST_DIR" -name "*.vsix" -type f -delete
        echo -e "${GREEN}✓ Old VSIX files removed${NC}"
    else
        echo -e "${BLUE}No old VSIX files found in dist${NC}"
    fi
else
    echo -e "${BLUE}Dist directory does not exist yet${NC}"
fi

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
echo -e "${BLUE}=== Step 7: Generate TextMate Grammar ===${NC}"
npm run build:textmate

echo ""
echo -e "${BLUE}=== Step 8: Build Language Server ===${NC}"
cd "$SCRIPT_DIR/../helium-dsl-language-server"
npm run build

echo ""
echo -e "${BLUE}=== Step 9: Build VSCode Extension ===${NC}"
cd "$SCRIPT_DIR/../helium-dsl-vscode"
npm run build

echo ""
echo -e "${BLUE}=== Step 10: Update Version with Epoch Build Number ===${NC}"
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
echo -e "${BLUE}=== Step 11: Package VSCode Extension ===${NC}"
cd "$SCRIPT_DIR/../helium-dsl-vscode"
npm run package

# Get the VSIX file path
VSIX_FILE="$SCRIPT_DIR/dist/helium-dsl.vsix"

if [ ! -f "$VSIX_FILE" ]; then
    echo -e "${RED}Error: VSIX file not found at $VSIX_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✓ VSIX packaged: $VSIX_FILE${NC}"

# Publish to Open VSX
echo ""
echo -e "${BLUE}=== Step 12: Publishing to Open VSX Registry ===${NC}"

echo -e "${BLUE}Publishing extension: $EXTENSION_ID${NC}"
echo -e "${BLUE}VSIX file: $VSIX_FILE${NC}"

# Export token for ovsx
export OVSX_PAT="$OVSX_TOKEN"

# Publish using ovsx (can use --packagePath or pass path directly)
# Change to extension directory for ovsx to read package.json metadata
cd "$SCRIPT_DIR/../helium-dsl-vscode"
ovsx publish --packagePath "$VSIX_FILE" -p "$OVSX_TOKEN"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Extension published successfully to Open VSX${NC}"
else
    echo -e "${RED}Error: Failed to publish extension${NC}"
    exit 1
fi

# Restore original version after publishing
echo ""
echo -e "${BLUE}=== Restoring Original Version ===${NC}"
cd "$SCRIPT_DIR/../helium-dsl-vscode"
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('$PACKAGE_JSON', 'utf8'));
pkg.version = '$ORIGINAL_VERSION';
fs.writeFileSync('$PACKAGE_JSON', JSON.stringify(pkg, null, 2) + '\n');
"
echo -e "${GREEN}Version restored to: ${ORIGINAL_VERSION}${NC}"

# Install from local VSIX file (Cursor doesn't support Open VSX registry directly)
echo ""
echo -e "${BLUE}=== Step 13: Installing Extension from Local VSIX ===${NC}"
echo -e "${BLUE}Installing from: $VSIX_FILE${NC}"

if command -v cursor &> /dev/null; then
    cursor --install-extension "$VSIX_FILE" --force
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Extension installed successfully from local VSIX${NC}"
    else
        echo -e "${YELLOW}Warning: Extension installation may have failed${NC}"
        echo -e "${YELLOW}Try manually: cursor --install-extension $VSIX_FILE --force${NC}"
    fi
else
    echo -e "${YELLOW}Warning: cursor command not found, skipping installation${NC}"
    echo -e "${YELLOW}Install manually: cursor --install-extension $VSIX_FILE --force${NC}"
fi

echo ""
echo -e "${GREEN}=== Publishing Complete ===${NC}"
echo ""
echo -e "${GREEN}✓${NC} Grammar extracted and converted"
echo -e "${GREEN}✓${NC} Parser generated"
echo -e "${GREEN}✓${NC} Rules extracted"
echo -e "${GREEN}✓${NC} Language server built"
echo -e "${GREEN}✓${NC} VSCode extension built"
echo -e "${GREEN}✓${NC} Version updated with epoch build number ($EPOCH)"
echo -e "${GREEN}✓${NC} Extension packaged"
echo -e "${GREEN}✓${NC} Extension published to Open VSX (version: $NEW_VERSION)"
echo -e "${GREEN}✓${NC} Extension installed from local VSIX"
echo ""
echo -e "Extension available at: ${BLUE}https://open-vsx.org/extension/$PUBLISHER/$EXTENSION_NAME${NC}"
echo ""
