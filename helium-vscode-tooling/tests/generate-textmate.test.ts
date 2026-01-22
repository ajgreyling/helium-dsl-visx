import { expect } from "chai";
import { describe, it } from "mocha";
import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

describe("generate-textmate", () => {
  it("uses generated metadata for primitiveTypes and BIF namespaces (no hardcoded lists)", async function () {
    // This test mutates generated metadata on disk and restores it.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const toolingRoot = path.resolve(__dirname, "..");

    const languageMetaPath = path.join(
      toolingRoot,
      "generated",
      "language",
      "helium-language-metadata.json"
    );
    const bifMetaPath = path.join(toolingRoot, "generated", "bifs", "bif-metadata.json");
    const tmPath = path.join(toolingRoot, "generated", "syntaxes", "helium-dsl.tmLanguage.json");

    const originalMeta = await fs.readJson(languageMetaPath);
    const originalBifMeta = await fs.readJson(bifMetaPath);

    try {
      // Inject a synthetic primitive type to prove the generator reads metadata.
      const injectedType = "__primTypeFromTest__";
      const injectedNamespace = "__NsFromTest__";
      const nextMeta = {
        ...originalMeta,
        primitiveTypes: Array.from(
          new Set([...(originalMeta.primitiveTypes ?? []), injectedType])
        ),
      };
      await fs.writeJson(languageMetaPath, nextMeta, { spaces: 2 });

      // Inject a synthetic BIF namespace to prove the generator reads bif-metadata.json.
      const nextBifMeta = {
        ...originalBifMeta,
        namespaces: {
          ...(originalBifMeta.namespaces ?? {}),
          [injectedNamespace]: [{ name: "x", signature: `${injectedNamespace}:x` }],
        },
      };
      await fs.writeJson(bifMetaPath, nextBifMeta, { spaces: 2 });

      // Run generator
      execSync("npx tsx scripts/generate-textmate.ts", {
        cwd: toolingRoot,
        stdio: "pipe",
      });

      const tm = await fs.readJson(tmPath);
      const storageTypePattern = (tm.patterns || []).find((p: any) => p?.name === "storage.type");
      expect(storageTypePattern).to.not.equal(undefined);
      expect(String(storageTypePattern.match)).to.include(injectedType);

      const bifPattern = (tm.patterns || []).find(
        (p: any) => p?.name === "support.function.builtin"
      );
      expect(bifPattern).to.not.equal(undefined);
      expect(String(bifPattern.match)).to.include(injectedNamespace);
    } finally {
      // Restore original metadata and regenerate to avoid leaving the repo in a modified state.
      await fs.writeJson(languageMetaPath, originalMeta, { spaces: 2 });
      await fs.writeJson(bifMetaPath, originalBifMeta, { spaces: 2 });
      execSync("npx tsx scripts/generate-textmate.ts", {
        cwd: toolingRoot,
        stdio: "pipe",
      });
    }
  });
});

