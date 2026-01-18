import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const DEFAULT_GRAMMAR_RELATIVE_PATH =
  "WebDSLParser-lib/src/main/antlr3/com/mezzanine/dsl/web/MezDSL.g";

function readArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("-")) return undefined;
  return value;
}

function resolveSourceGrammar(): string {
  const grammarFromArgs = readArgValue("--grammar");
  if (grammarFromArgs) return path.resolve(grammarFromArgs);

  const dslCommonsFromArgs = readArgValue("--dsl-commons");
  if (dslCommonsFromArgs) {
    return path.resolve(dslCommonsFromArgs, DEFAULT_GRAMMAR_RELATIVE_PATH);
  }

  const grammarFromEnv = process.env.GRAMMAR_FILE;
  if (grammarFromEnv) return path.resolve(grammarFromEnv);

  const dslCommonsFromEnv = process.env.DSL_COMMONS_PATH;
  if (dslCommonsFromEnv) {
    return path.resolve(dslCommonsFromEnv, DEFAULT_GRAMMAR_RELATIVE_PATH);
  }

  throw new Error(
    [
      "No grammar source configured.",
      "",
      "Provide one of:",
      '  - CLI: "--grammar <path-to-MezDSL.g>"',
      '  - CLI: "--dsl-commons <path-to-appexec-dsl-commons>"',
      "  - Env: GRAMMAR_FILE=<path-to-MezDSL.g>",
      "  - Env: DSL_COMMONS_PATH=<path-to-appexec-dsl-commons>",
      "",
      "Example:",
      "  DSL_COMMONS_PATH=/path/to/appexec-dsl-commons npx tsx scripts/extract-grammar.ts",
    ].join("\n")
  );
}

const sourceGrammar = resolveSourceGrammar();
const targetGrammar = path.join(root, "generated/grammar/MezDSL.g3");
const hashFile = path.join(root, "generated/grammar/MezDSL.g3.hash");

async function fileHash(file: string) {
  const buf = await fs.readFile(file);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

async function main() {
  if (!(await fs.pathExists(sourceGrammar))) {
    throw new Error(
      [
        `Source grammar not found: ${sourceGrammar}`,
        "",
        "If you passed --dsl-commons / DSL_COMMONS_PATH, expected grammar at:",
        `  ${DEFAULT_GRAMMAR_RELATIVE_PATH}`,
      ].join("\n")
    );
  }

  await fs.ensureDir(path.dirname(targetGrammar));
  await fs.copyFile(sourceGrammar, targetGrammar);

  const hash = await fileHash(targetGrammar);
  await fs.writeFile(hashFile, hash, "utf8");

  console.log(`Extracted grammar to ${targetGrammar}`);
  console.log(`SHA256: ${hash}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
