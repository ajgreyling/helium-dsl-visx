import path from "node:path";
import fs from "fs-extra";
import { glob } from "glob";

const root = path.resolve(__dirname, "..");
const parserDir = path.join(root, "generated/parser");

/**
 * Post-processes generated ANTLR parser files to add .js extensions
 * to antlr4ts imports for strict ESM compatibility (Node 25+).
 */
async function fixParserImports() {
  console.log("Fixing antlr4ts imports in generated parser files...");

  // Find all generated TypeScript parser files
  const parserFiles = await glob("**/*.ts", {
    cwd: parserDir,
    absolute: true,
  });

  let fixedCount = 0;
  for (const filePath of parserFiles) {
    const content = await fs.readFile(filePath, "utf8");
    
    // Pattern to match antlr4ts imports without .js extension
    // Matches: import { X } from "antlr4ts/..."
    // Or: import X from "antlr4ts/..."
    // Or: import * as X from "antlr4ts/..."
    const importPattern = /from\s+["']antlr4ts\/([^"']+)["']/g;
    
    let modified = content;
    let hasChanges = false;
    
    // Replace all antlr4ts imports to add .js extension
    modified = modified.replace(importPattern, (match, importPath) => {
      // Skip if already has .js extension
      if (importPath.endsWith(".js")) {
        return match;
      }
      hasChanges = true;
      return `from "antlr4ts/${importPath}.js"`;
    });
    
    // Also fix relative imports (e.g., './MezDSLListener')
    const relativeImportPattern = /from\s+["'](\.\/[^"']+)["']/g;
    modified = modified.replace(relativeImportPattern, (match, importPath) => {
      // Skip if already has .js extension or is a directory import
      if (importPath.endsWith(".js") || importPath.endsWith("/")) {
        return match;
      }
      // Only fix if it's a TypeScript file import (likely a generated file)
      if (importPath.match(/\.(ts|js)$/)) {
        return match; // Already has extension
      }
      // Check if the imported file exists as .ts in the same directory
      const importDir = path.dirname(filePath);
      const importedFile = path.join(importDir, importPath + ".ts");
      if (fs.existsSync(importedFile)) {
        hasChanges = true;
        return `from "${importPath}.js"`;
      }
      return match;
    });
    
    if (hasChanges) {
      await fs.writeFile(filePath, modified, "utf8");
      fixedCount++;
      console.log(`  Fixed imports in ${path.relative(root, filePath)}`);
    }
  }

  console.log(`Fixed imports in ${fixedCount} file(s).`);
}

fixParserImports().catch((err) => {
  console.error(err);
  process.exit(1);
});
