import * as fs from "fs";
import * as path from "path";
import { parseText } from "./src/parser/index.js";
import { buildFileAst } from "./src/ast/builder.js";
import { Diagnostic } from "vscode-languageserver";

const SAMPLE_PROJECT_PATH = "/Users/ajgreyling/code/munic-chat";

interface FileStats {
  file: string;
  size: number;
  lines: number;
  parseSuccess: boolean;
  parseErrors: number;
  parseTime: number;
  astSuccess: boolean;
  astTime: number;
  astStats: {
    objects: number;
    units: number;
    enums: number;
    typeReferences: number;
    unitReferences: number;
    functionCalls: number;
    variableReferences: number;
    propertyReferences: number;
    elseBlocks: number;
  } | null;
}

async function testFile(filePath: string): Promise<FileStats> {
  const text = fs.readFileSync(filePath, "utf8");
  const uri = `file://${filePath}`;
  const relativePath = path.relative(SAMPLE_PROJECT_PATH, filePath);

  const stats: FileStats = {
    file: relativePath,
    size: text.length,
    lines: text.split("\n").length,
    parseSuccess: false,
    parseErrors: 0,
    parseTime: 0,
    astSuccess: false,
    astTime: 0,
    astStats: null,
  };

  // Test parser
  try {
    const parseStart = Date.now();
    const parseResult = await parseText(text);
    stats.parseTime = Date.now() - parseStart;
    // Severity 1 = Error, 2 = Warning, 3 = Info
    // Consider it successful if no errors (severity 1)
    stats.parseSuccess = parseResult.diagnostics.every((d) => d.severity !== 1);
    stats.parseErrors = parseResult.diagnostics.filter((d) => d.severity === 1).length;
  } catch (error) {
    stats.parseErrors = 1;
  }

  // Test AST builder
  try {
    const astStart = Date.now();
    const ast = await buildFileAst(text, uri);
    stats.astTime = Date.now() - astStart;
    stats.astSuccess = true;
    stats.astStats = {
      objects: ast.objects.length,
      units: ast.units.length,
      enums: ast.enums.length,
      typeReferences: ast.typeReferences.length,
      unitReferences: ast.unitReferences.length,
      functionCalls: ast.functionCalls.length,
      variableReferences: ast.variableReferences.length,
      propertyReferences: ast.propertyReferences.length,
      elseBlocks: ast.elseBlocks.length,
    };
  } catch (error) {
    // AST build failed
  }

  return stats;
}

async function main() {
  console.log("🔍 Scanning munic-chat project for .mez files...\n");

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
  console.log(`Found ${mezFiles.length} .mez files\n`);

  if (mezFiles.length === 0) {
    console.log("No .mez files found.");
    process.exit(0);
  }

  console.log("Testing parser and AST builder on each file...\n");
  console.log("=".repeat(80));

  const results: FileStats[] = [];
  let processed = 0;

  for (const file of mezFiles) {
    processed++;
    process.stderr.write(`\rProcessing ${processed}/${mezFiles.length}: ${path.basename(file)}`);

    try {
      const stats = await testFile(file);
      results.push(stats);
    } catch (error) {
      results.push({
        file: path.relative(SAMPLE_PROJECT_PATH, file),
        size: 0,
        lines: 0,
        parseSuccess: false,
        parseErrors: 1,
        parseTime: 0,
        astSuccess: false,
        astTime: 0,
        astStats: null,
      });
    }
  }

  process.stderr.write("\n\n");
  console.log("=".repeat(80));
  console.log("\n📊 STATISTICS\n");

  // Overall statistics
  const totalFiles = results.length;
  const parseSuccess = results.filter((r) => r.parseSuccess).length;
  const parseFailures = results.filter((r) => !r.parseSuccess).length;
  const astSuccess = results.filter((r) => r.astSuccess).length;
  const astFailures = results.filter((r) => !r.astSuccess).length;

  const totalParseErrors = results.reduce((sum, r) => sum + r.parseErrors, 0);
  const totalSize = results.reduce((sum, r) => sum + r.size, 0);
  const totalLines = results.reduce((sum, r) => sum + r.lines, 0);
  const totalParseTime = results.reduce((sum, r) => sum + r.parseTime, 0);
  const totalAstTime = results.reduce((sum, r) => sum + r.astTime, 0);

  // AST statistics
  const totalObjects = results.reduce((sum, r) => sum + (r.astStats?.objects || 0), 0);
  const totalUnits = results.reduce((sum, r) => sum + (r.astStats?.units || 0), 0);
  const totalEnums = results.reduce((sum, r) => sum + (r.astStats?.enums || 0), 0);
  const totalTypeRefs = results.reduce((sum, r) => sum + (r.astStats?.typeReferences || 0), 0);
  const totalUnitRefs = results.reduce((sum, r) => sum + (r.astStats?.unitReferences || 0), 0);
  const totalFunctionCalls = results.reduce((sum, r) => sum + (r.astStats?.functionCalls || 0), 0);
  const totalVarRefs = results.reduce((sum, r) => sum + (r.astStats?.variableReferences || 0), 0);
  const totalPropRefs = results.reduce((sum, r) => sum + (r.astStats?.propertyReferences || 0), 0);
  const totalElseBlocks = results.reduce((sum, r) => sum + (r.astStats?.elseBlocks || 0), 0);

  console.log("📁 File Statistics:");
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   Total size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   Total lines: ${totalLines.toLocaleString()}`);
  console.log(`   Average file size: ${(totalSize / totalFiles / 1024).toFixed(2)} KB`);
  console.log(`   Average lines per file: ${Math.round(totalLines / totalFiles)}`);

  console.log("\n✅ Parser Statistics:");
  console.log(`   Successful parses: ${parseSuccess} (${((parseSuccess / totalFiles) * 100).toFixed(1)}%)`);
  console.log(`   Failed parses: ${parseFailures} (${((parseFailures / totalFiles) * 100).toFixed(1)}%)`);
  console.log(`   Total parse errors: ${totalParseErrors}`);
  console.log(`   Average parse time: ${(totalParseTime / totalFiles).toFixed(2)} ms`);
  console.log(`   Total parse time: ${(totalParseTime / 1000).toFixed(2)} s`);

  console.log("\n🌳 AST Builder Statistics:");
  console.log(`   Successful AST builds: ${astSuccess} (${((astSuccess / totalFiles) * 100).toFixed(1)}%)`);
  console.log(`   Failed AST builds: ${astFailures} (${((astFailures / totalFiles) * 100).toFixed(1)}%)`);
  console.log(`   Average AST build time: ${(totalAstTime / totalFiles).toFixed(2)} ms`);
  console.log(`   Total AST build time: ${(totalAstTime / 1000).toFixed(2)} s`);

  console.log("\n📊 AST Content Statistics:");
  console.log(`   Total objects: ${totalObjects}`);
  console.log(`   Total units: ${totalUnits}`);
  console.log(`   Total enums: ${totalEnums}`);
  console.log(`   Total type references: ${totalTypeRefs}`);
  console.log(`   Total unit references: ${totalUnitRefs}`);
  console.log(`   Total function calls: ${totalFunctionCalls}`);
  console.log(`   Total variable references: ${totalVarRefs}`);
  console.log(`   Total property references: ${totalPropRefs}`);
  console.log(`   Total else blocks: ${totalElseBlocks}`);

  // Files with errors
  const filesWithParseErrors = results.filter((r) => r.parseErrors > 0);
  if (filesWithParseErrors.length > 0) {
    console.log("\n❌ Files with Parse Errors:");
    filesWithParseErrors.slice(0, 10).forEach((r) => {
      console.log(`   ${r.file}: ${r.parseErrors} error(s)`);
    });
    if (filesWithParseErrors.length > 10) {
      console.log(`   ... and ${filesWithParseErrors.length - 10} more files with errors`);
    }
  }

  // Performance summary
  console.log("\n⚡ Performance Summary:");
  console.log(`   Total processing time: ${((totalParseTime + totalAstTime) / 1000).toFixed(2)} s`);
  console.log(`   Average time per file: ${((totalParseTime + totalAstTime) / totalFiles).toFixed(2)} ms`);
  console.log(`   Files per second: ${(totalFiles / ((totalParseTime + totalAstTime) / 1000)).toFixed(1)}`);

  console.log("\n✅ Test complete!\n");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
