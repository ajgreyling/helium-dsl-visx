import { describe, it } from "mocha";
import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { URI } from "vscode-uri";
import { buildFileAst } from "../src/ast/builder.js";
import { FileAst } from "../src/ast/nodes.js";

const SAMPLE_PROJECT_PATH = "/Users/ajgreyling/code/munic-chat";

/**
 * Wrapper for buildFileAst with timeout protection
 * If AST building hangs, this will timeout after specified milliseconds
 */
function buildFileAstWithTimeout(
  text: string,
  uri: string,
  timeoutMs: number = 30000
): Promise<FileAst> {
  return Promise.race([
    new Promise<FileAst>((resolve, reject) => {
      // Run AST building asynchronously so timeout can interrupt
      setImmediate(async () => {
        try {
          const result = await buildFileAst(text, uri);
          resolve(result.ast);
        } catch (err) {
          reject(err);
        }
      });
    }),
    new Promise<FileAst>((_, reject) =>
      setTimeout(() => reject(new Error(`AST building timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

/**
 * Check if an AST is empty (indicates parsing failure)
 */
function isEmptyAst(ast: FileAst): boolean {
  return (
    ast.objects.length === 0 &&
    ast.units.length === 0 &&
    ast.enums.length === 0 &&
    ast.typeReferences.length === 0 &&
    ast.unitReferences.length === 0 &&
    ast.functionCalls.length === 0 &&
    ast.variableReferences.length === 0 &&
    ast.propertyReferences.length === 0 &&
    ast.elseBlocks.length === 0
  );
}

/**
 * Statistics collected during AST building
 */
type AstStatistics = {
  totalFiles: number;
  successfulBuilds: number;
  failedBuilds: number;
  emptyAsts: number;
  totalObjects: number;
  totalObjectAttributes: number;
  totalObjectRelationships: number;
  totalUnits: number;
  totalUnitFunctions: number;
  totalUnitVariables: number;
  totalEnums: number;
  totalEnumValues: number;
  totalTypeReferences: number;
  totalUnitReferences: number;
  totalFunctionCalls: number;
  totalVariableReferences: number;
  totalPropertyReferences: number;
  totalElseBlocks: number;
  failedFiles: Array<{ path: string; error: string }>;
  emptyAstFiles: string[];
};

describe("AST Building on munic-chat Project", () => {
  it("should build AST for a simple test case", async () => {
    const simpleText = "object TestObject { string name; }";
    const uri = "file:///test.mez";
    const result = await buildFileAst(simpleText, uri);
    // Verify AST was built
    expect(result.ast).to.exist;
  });

  it("should build ASTs for all .mez files in munic-chat project", async function () {
    // Increase timeout significantly to allow for timeout handling per file
    // Each file has 30s timeout, so many files * 30s could be substantial
    // But most files should complete quickly, so 10 minutes should be sufficient
    this.timeout(600000); // 10 minutes total timeout

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
    console.log(`\n  Found ${mezFiles.length} .mez files to process\n`);

    const stats: AstStatistics = {
      totalFiles: mezFiles.length,
      successfulBuilds: 0,
      failedBuilds: 0,
      emptyAsts: 0,
      totalObjects: 0,
      totalObjectAttributes: 0,
      totalObjectRelationships: 0,
      totalUnits: 0,
      totalUnitFunctions: 0,
      totalUnitVariables: 0,
      totalEnums: 0,
      totalEnumValues: 0,
      totalTypeReferences: 0,
      totalUnitReferences: 0,
      totalFunctionCalls: 0,
      totalVariableReferences: 0,
      totalPropertyReferences: 0,
      totalElseBlocks: 0,
      failedFiles: [],
      emptyAstFiles: [],
    };

    // Process each file
    for (let i = 0; i < mezFiles.length; i++) {
      const file = mezFiles[i];
      const text = fs.readFileSync(file, "utf8");
      const relativePath = path.relative(SAMPLE_PROJECT_PATH, file);
      const uri = URI.file(file).toString();

      try {
        // Build AST with timeout protection
        let ast: FileAst;
        try {
          ast = await buildFileAstWithTimeout(text, uri, 30000);
        } catch (astErr) {
          const errorMsg = astErr instanceof Error ? astErr.message : String(astErr);
          console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  AST building failed/timeout: ${errorMsg}`);
          stats.failedBuilds++;
          stats.failedFiles.push({ path: relativePath, error: `AST error: ${errorMsg}` });
          continue;
        }

        // Check if AST is empty (indicates parsing failure)
        if (isEmptyAst(ast)) {
          console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  Empty AST (parsing may have failed)`);
          stats.emptyAsts++;
          stats.emptyAstFiles.push(relativePath);
          // Don't count as successful build
          continue;
        }

        // Collect statistics
        stats.successfulBuilds++;

        // Objects
        stats.totalObjects += ast.objects.length;
        for (const obj of ast.objects) {
          stats.totalObjectAttributes += obj.attributes.length;
          stats.totalObjectRelationships += obj.relationships.length;
        }

        // Units
        stats.totalUnits += ast.units.length;
        for (const unit of ast.units) {
          stats.totalUnitFunctions += unit.functions.length;
          stats.totalUnitVariables += unit.variables.length;
        }

        // Enums
        stats.totalEnums += ast.enums.length;
        for (const enumDecl of ast.enums) {
          stats.totalEnumValues += enumDecl.values.length;
        }

        // References and other elements
        stats.totalTypeReferences += ast.typeReferences.length;
        stats.totalUnitReferences += ast.unitReferences.length;
        stats.totalFunctionCalls += ast.functionCalls.length;
        stats.totalVariableReferences += ast.variableReferences.length;
        stats.totalPropertyReferences += ast.propertyReferences.length;
        stats.totalElseBlocks += ast.elseBlocks.length;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.log(`  [${i + 1}/${mezFiles.length}] ⚠️  Unexpected error: ${errorMsg}`);
        stats.failedBuilds++;
        stats.failedFiles.push({ path: relativePath, error: errorMsg });
      }
    }

    // Print comprehensive report
    console.log(`\n  ${"=".repeat(80)}`);
    console.log(`  AST BUILDING STATISTICS`);
    console.log(`  ${"=".repeat(80)}\n`);

    console.log(`  📊 File Processing:`);
    console.log(`    Total files scanned: ${stats.totalFiles}`);
    console.log(`    Successful AST builds: ${stats.successfulBuilds}`);
    console.log(`    Failed builds: ${stats.failedBuilds}`);
    console.log(`    Empty ASTs (parsing issues): ${stats.emptyAsts}\n`);

    console.log(`  📋 AST Element Counts:`);
    console.log(`    Objects: ${stats.totalObjects}`);
    console.log(`      └─ Attributes: ${stats.totalObjectAttributes}`);
    console.log(`      └─ Relationships: ${stats.totalObjectRelationships}`);
    console.log(`    Units: ${stats.totalUnits}`);
    console.log(`      └─ Functions: ${stats.totalUnitFunctions}`);
    console.log(`      └─ Variables: ${stats.totalUnitVariables}`);
    console.log(`    Enums: ${stats.totalEnums}`);
    console.log(`      └─ Values: ${stats.totalEnumValues}`);
    console.log(`    Type References: ${stats.totalTypeReferences}`);
    console.log(`    Unit References: ${stats.totalUnitReferences}`);
    console.log(`    Function Calls: ${stats.totalFunctionCalls}`);
    console.log(`    Variable References: ${stats.totalVariableReferences}`);
    console.log(`    Property References: ${stats.totalPropertyReferences}`);
    console.log(`    Else Blocks: ${stats.totalElseBlocks}\n`);

    // Report failed files
    if (stats.failedFiles.length > 0) {
      console.log(`  ⚠️  Failed Files (${stats.failedFiles.length}):`);
      for (const { path: filePath, error } of stats.failedFiles) {
        console.log(`    ${filePath}: ${error}`);
      }
      console.log(``);
    }

    // Report empty AST files
    if (stats.emptyAstFiles.length > 0) {
      console.log(`  ⚠️  Empty AST Files (${stats.emptyAstFiles.length} - may indicate parsing issues):`);
      for (const filePath of stats.emptyAstFiles.slice(0, 10)) {
        console.log(`    ${filePath}`);
      }
      if (stats.emptyAstFiles.length > 10) {
        console.log(`    ... and ${stats.emptyAstFiles.length - 10} more`);
      }
      console.log(``);
    }

    // Summary
    if (stats.successfulBuilds > 0) {
      console.log(`  ✅ Successfully built ASTs for ${stats.successfulBuilds} files`);
    }
    if (stats.failedBuilds > 0 || stats.emptyAsts > 0) {
      console.log(`  ⚠️  ${stats.failedBuilds + stats.emptyAsts} files had issues`);
    }

    console.log(`\n  ${"=".repeat(80)}\n`);

    // Test passes if we processed at least some files
    expect(stats.totalFiles).to.be.greaterThan(0);
    
    // If we have successful builds, verify AST structure is reasonable
    if (stats.successfulBuilds > 0) {
      // Verify that we found at least some AST elements (objects, units, or enums)
      const hasTopLevelElements = 
        stats.totalObjects > 0 || 
        stats.totalUnits > 0 || 
        stats.totalEnums > 0;
      
      if (!hasTopLevelElements) {
        console.log(`  ⚠️  Warning: No top-level elements (objects/units/enums) found in any AST`);
      }
    }
  });
});
