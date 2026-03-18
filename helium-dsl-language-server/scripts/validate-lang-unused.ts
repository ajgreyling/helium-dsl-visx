/**
 * One-shot: index a Helium project root and report unused .lang key diagnostics for en.lang.
 * Usage: npx tsx scripts/validate-lang-unused.ts [projectRoot]
 * Example: npx tsx scripts/validate-lang-unused.ts /path/to/dsl
 */
import path from "node:path";
import { URI } from "vscode-uri";
import { ProjectIndex } from "../src/index/projectIndex.js";
import { getLanguageMetadataSync } from "../src/language/metadata.js";

const root = path.resolve(process.argv[2] ?? "");
if (!root) {
  console.error("Usage: tsx scripts/validate-lang-unused.ts <dsl-project-root>");
  process.exit(1);
}

const metadata = getLanguageMetadataSync();
const index = new ProjectIndex(root, metadata);
console.error(`Indexing ${root} ...`);
const t0 = Date.now();
await index.indexProjectFiles();
console.error(`Indexed in ${Date.now() - t0}ms`);

const langPath = path.join(root, "web-app", "lang", "en.lang");
const langUri = URI.file(langPath).toString();
const diags = index.getUnusedWarningsForFile(langUri);
console.log(JSON.stringify({ projectRoot: root, unusedLangEntryCount: diags.length, sampleMessages: diags.slice(0, 5).map((d) => d.message) }, null, 2));
if (diags.length > 0 && diags[0]!.source === "helium-dsl-unused") {
  console.error("validate-lang-unused: OK (unused language diagnostics emitted)");
} else if (diags.length === 0) {
  console.error("validate-lang-unused: OK (zero unused keys, or languageEntries=None / all keys referenced)");
} else {
  console.error("validate-lang-unused: unexpected diagnostic source");
  process.exit(1);
}
