import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const generated = path.join(root, "generated");

function run(cmd: string, opts: { cwd?: string } = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: opts.cwd ?? root });
}

async function ensureGenerated() {
  await fs.ensureDir(path.join(generated, "grammar"));
  await fs.ensureDir(path.join(generated, "parser"));
  await fs.ensureDir(path.join(generated, "rules"));
  await fs.ensureDir(path.join(generated, "bifs"));
  await fs.ensureDir(path.join(generated, "language"));
  await fs.ensureDir(path.join(generated, "syntaxes"));
  await fs.ensureDir(path.join(generated, "vxml"));
}

async function main() {
  await ensureGenerated();

  // 1. Extract ANTLR3 grammar from Java project
  run("npx tsx scripts/extract-grammar.ts");

  // 2. Convert ANTLR3 → ANTLR4
  run("npx tsx scripts/convert-grammar.ts");

  // 3. Validate grammar
  run("npx tsx scripts/validate-grammar.ts");

  // 4. Generate TypeScript parser
  run("npm run build:parser");

  // 4a. Fix parser imports (add .js extensions for strict ESM)
  run("npx tsx scripts/fix-parser-imports.ts");

  // 5. Generate lint rules
  run("npx tsx scripts/extract-rules.ts");

  // 6. Generate BIF metadata
  run("npx tsx scripts/generate-bif-metadata.ts");

  // 7. Generate language metadata
  run("npx tsx scripts/generate-language-metadata.ts");

  // 8. Generate VXML metadata
  run("npx tsx scripts/generate-vxml-metadata.ts");

  // 9. Generate TextMate grammar
  run("npx tsx scripts/generate-textmate.ts");

  // 10. Copy parser files and VXML metadata to language server for compilation
  // This ensures parser files are compiled as ES modules by the language server's TypeScript compiler
  const parserSourceDir = path.join(generated, "parser");
  const vxmlMetadataFile = path.join(generated, "vxml", "function-value-nodes.json");
  const languageServerRoot = path.join(root, "..", "helium-dsl-language-server");
  const languageServerGeneratedDir = path.join(languageServerRoot, "generated", "parser");
  const languageServerVxmlDir = path.join(languageServerRoot, "generated", "vxml");
  
  if (await fs.pathExists(parserSourceDir)) {
    console.log("Copying parser files to language server for compilation...");
    await fs.ensureDir(languageServerGeneratedDir);
    await fs.copy(parserSourceDir, languageServerGeneratedDir, {
      overwrite: true,
      filter: (src) => {
        // Copy all files and directories
        return true;
      }
    });
    console.log("  ✓ Parser files copied to language server");
  } else {
    console.warn("  ⚠ Warning: Parser source directory not found, skipping copy");
  }

  // Always ensure the VXML metadata directory exists and copy the file if it exists
  // If it doesn't exist, create a stub file to prevent TypeScript compilation errors
  await fs.ensureDir(languageServerVxmlDir);
  const targetVxmlFile = path.join(languageServerVxmlDir, "function-value-nodes.json");
  
  if (await fs.pathExists(vxmlMetadataFile)) {
    console.log("Copying VXML metadata to language server for compilation...");
    await fs.copy(vxmlMetadataFile, targetVxmlFile, {
      overwrite: true,
    });
    console.log("  ✓ VXML metadata copied to language server");
  } else {
    console.warn("  ⚠ Warning: VXML metadata file not found, creating stub file");
    // Create a stub file to prevent TypeScript compilation errors
    await fs.writeJson(targetVxmlFile, {
      version: "0.1.0",
      extractedFrom: "stub",
      extractedAt: new Date().toISOString(),
      functionValueNodes: [],
    }, { spaces: 2 });
  }

  // 11. Build language server + extension
  run("npm run build", { cwd: languageServerRoot });
  run("npm run build", { cwd: path.join(root, "..", "helium-dsl-vscode") });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

