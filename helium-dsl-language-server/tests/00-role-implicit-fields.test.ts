import { expect } from "chai";
import { describe, it } from "mocha";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { URI } from "vscode-uri";

import { ProjectIndex } from "../src/index/projectIndex.js";

describe("Role implicit fields (Identity)", () => {
  it("allows _timeZone on persistent objects (from language metadata roleImplicitFields)", async function () {
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
      modelBifs: [],
      bifNamespaces: [],
      bifFunctions: [],
      reservedIdentifiers: [],
      roleImplicitFields: [
        "_firstNames",
        "_lastPasswordReset",
        "_locale",
        "_mustResetPassword",
        "_nickName",
        "_surname",
        "_timeZone",
      ],
    };

    // Write both locations because metadata resolution varies between dev and packaged layouts.
    await fs.ensureDir(path.dirname(bundledMetadataPath));
    await fs.ensureDir(path.dirname(workspaceMetadataPath));
    await fs.writeJson(bundledMetadataPath, testMetadata, { spaces: 2 });
    await fs.writeJson(workspaceMetadataPath, testMetadata, { spaces: 2 });

    const { getLanguageMetadataSync, resetLanguageMetadataCache } = await import(
      "../src/language/metadata.js"
    );
    const { createSemanticDiagnostics } = await import("../src/semantic/diagnostics.js");

    // Prime the metadata cache so downstream code reads our test metadata.
    resetLanguageMetadataCache();
    const metadata = getLanguageMetadataSync();
    expect(Array.isArray((metadata as any).roleImplicitFields)).to.equal(true);
    expect((metadata as any).roleImplicitFields.includes("_timeZone")).to.equal(true);

    const index = new ProjectIndex("/tmp/helium-test-role-implicit-fields", metadata as any);

    const modelText = `@Role("Nurse")
persistent object Nurse {
  string name;
}`;

    const unitText = `unit TestUnit;
void f() {
  Nurse n;
  string tz = n._timeZone;
}`;

    const modelUri = URI.file("/tmp/helium-test-role-implicit-fields/Nurse.mez").toString();
    const unitUri = URI.file("/tmp/helium-test-role-implicit-fields/TestUnit.mez").toString();

    await index.updateFile(modelUri, modelText);
    await index.updateFile(unitUri, unitText);

    // If parser/AST isn’t available in this environment, skip (consistent with other tests).
    const unitAst = index.getFileAst(unitUri);
    if (!unitAst || unitAst.units.length === 0) {
      this.skip();
    }

    // Minimal ProjectManager surface required by createSemanticDiagnostics.
    const pm = {
      isUnit: (name: string) => index.getUnitNames().includes(name),
      hasUnitFunction: (unitName: string, fnName: string) =>
        index.getUnitFunctions(unitName).some((f: any) => f?.name === fnName),
      isUserDefinedType: (name: string) => index.getObjectNames().includes(name),
      getVariableType: (name: string, uri: string, pos: any) => index.getVariableType(name, uri, pos),
      getObjectDecl: (typeName: string) => index.getObject(typeName) ?? null,
      getObjectMembers: (typeName: string) => index.getObjectMembers(typeName),
      getUnusedWarningsForFile: () => [],
    } as any;

    const nurseDecl = pm.getObjectDecl("Nurse");
    if (!nurseDecl) {
      throw new Error("Expected Nurse object declaration to be indexed");
    }
    expect(Boolean(nurseDecl.isPersistent)).to.equal(true);

    const diags = await createSemanticDiagnostics(unitText, unitUri, pm);
    const hasTimeZoneError = diags.some((d: any) =>
      String(d?.message ?? "").includes("Invalid attribute/relationship `_timeZone`")
    );

    expect(hasTimeZoneError).to.equal(false);

    // Clean up so local runs don't leave untracked generated files behind.
    await fs.remove(bundledMetadataPath);
    await fs.remove(workspaceMetadataPath);
  });
});

