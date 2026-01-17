import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import fs from "fs-extra";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const extensionDir = path.join(root, "..", "helium-dsl-vscode");

async function main() {
  console.log("🚀 Starting extension packaging process...\n");

  // 1. Build entire pipeline (grammar, parser, rules, BIFs, language server, extension)
  console.log("📦 Step 1: Building pipeline (grammar, parser, rules, BIFs, language server, extension)...");
  execSync("npm run build:all", { cwd: root, stdio: "inherit" });

  // 2. Package the extension (prepublish will run automatically and bundle everything)
  console.log("\n📦 Step 2: Creating VSIX package...");
  execSync("npm run package", { cwd: extensionDir, stdio: "inherit" });

  // 5. Find and report the generated .vsix file
  const vsixFiles = await fs.readdir(extensionDir);
  const vsixFile = vsixFiles.find((f) => f.endsWith(".vsix"));
  
  if (vsixFile) {
    const vsixPath = path.join(extensionDir, vsixFile);
    const stats = await fs.stat(vsixPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n✅ Package created successfully!`);
    console.log(`   File: ${vsixPath}`);
    console.log(`   Size: ${sizeMB} MB`);
    console.log(`\n📥 To install locally:`);
    console.log(`   cursor --install-extension ${vsixFile}`);
    console.log(`\n📤 To publish to Open VSX:`);
    console.log(`   cd ../helium-dsl-vscode`);
    console.log(`   ovsx publish -p <your-access-token>`);
    console.log(`\n   Or set OVSX_PAT environment variable:`);
    console.log(`   export OVSX_PAT=<your-access-token>`);
    console.log(`   ovsx publish`);
  } else {
    console.error("\n❌ Error: .vsix file not found after packaging");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("\n❌ Packaging failed:", err);
  process.exit(1);
});

