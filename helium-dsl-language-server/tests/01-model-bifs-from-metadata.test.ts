import { expect } from "chai";
import { describe, it } from "mocha";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { URI } from "vscode-uri";

import { ProjectIndex } from "../src/index/projectIndex.js";

describe("Model BIFs (from language metadata)", () => {
  it("validates TypeName:method() against metadata.modelBifs when available", async function () {
    // Ensure metadata file exists before metadata module is imported/cached.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const languageServerRoot = path.resolve(__dirname, "..");
    const bundledMetadataPath = path.join(
      languageServerRoot,
      "generated",
      "language",
      "helium-language-metadata.json"
    );
    const workspaceMetadataPath = path.join(
      path.resolve(languageServerRoot, ".."),
      "generated",
      "language",
      "helium-language-metadata.json"
    );

    const testMetadata = {
      keywords: [],
      primitiveTypes: [],
      modelBifs: ["okBif"],
      bifNamespaces: [],
      bifFunctions: [],
      reservedIdentifiers: [],
      roleImplicitFields: [],
    };

    await fs.ensureDir(path.dirname(bundledMetadataPath));
    await fs.ensureDir(path.dirname(workspaceMetadataPath));
    await fs.writeJson(bundledMetadataPath, testMetadata, { spaces: 2 });
    await fs.writeJson(workspaceMetadataPath, testMetadata, { spaces: 2 });

    const { getLanguageMetadataSync, resetLanguageMetadataCache } = await import(
      "../src/language/metadata.js"
    );
    const { createSemanticDiagnostics } = await import("../src/semantic/diagnostics.js");

    resetLanguageMetadataCache();
    const metadata = getLanguageMetadataSync();
    expect((metadata.modelBifs ?? []).includes("okBif")).to.equal(true);

    const index = new ProjectIndex("/tmp/helium-test-model-bifs", metadata as any);

    const modelText = `persistent object Nurse { string name; }`;
    const modelUri = URI.file("/tmp/helium-test-model-bifs/Nurse.mez").toString();
    await index.updateFile(modelUri, modelText);

    const okUnitText = `unit TestUnit; void f() { Nurse:okBif(); }`;
    const badUnitText = `unit TestUnit; void f() { Nurse:notOk(); }`;
    const unitUri = URI.file("/tmp/helium-test-model-bifs/TestUnit.mez").toString();

    await index.updateFile(unitUri, okUnitText);
    const unitAst = index.getFileAst(unitUri);
    if (!unitAst || unitAst.units.length === 0) {
      this.skip();
    }

    const pm = {
      isUnit: (name: string) => index.getUnitNames().includes(name),
      hasUnitFunction: (unitName: string, fnName: string) =>
        index.getUnitFunctions(unitName).some((f: any) => f?.name === fnName),
      isUserDefinedType: (name: string) => index.getObjectNames().includes(name),
      getUnusedWarningsForFile: () => [],
    } as any;

    const okDiags = await createSemanticDiagnostics(okUnitText, unitUri, pm);
    expect(okDiags.some((d: any) => String(d?.message ?? "").includes("Unknown model BIF"))).to.equal(false);

    const badDiags = await createSemanticDiagnostics(badUnitText, unitUri, pm);
    expect(badDiags.some((d: any) => String(d?.message ?? "").includes("Unknown model BIF"))).to.equal(true);

    await fs.remove(bundledMetadataPath);
    await fs.remove(workspaceMetadataPath);
  });
});

