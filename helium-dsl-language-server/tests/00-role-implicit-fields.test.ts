import { expect } from "chai";
import { describe, it } from "mocha";
import path from "node:path";
import os from "node:os";
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

describe("Platform implicit fields (persistent objects)", () => {
  it("allows _id and _tstamp on persistent objects (from language metadata platformImplicitFields)", async function () {
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
      roleImplicitFields: [],
      platformImplicitFields: ["_id"],
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
    expect(Array.isArray((metadata as any).platformImplicitFields)).to.equal(true);
    expect((metadata as any).platformImplicitFields.includes("_id")).to.equal(true);

    const index = new ProjectIndex("/tmp/helium-test-platform-implicit-fields", metadata as any);

    const modelText = `persistent object CaseWithCampaignContact {
  string name;
}`;

    const unitText = `unit TestUnit;
void f() {
  CaseWithCampaignContact c;
  uuid id = c._id;
}`;

    const modelUri = URI.file(
      "/tmp/helium-test-platform-implicit-fields/CaseWithCampaignContact.mez"
    ).toString();
    const unitUri = URI.file("/tmp/helium-test-platform-implicit-fields/TestUnit.mez").toString();

    await index.updateFile(modelUri, modelText);
    await index.updateFile(unitUri, unitText);

    // If parser/AST isn't available in this environment, skip (consistent with other tests).
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

    const caseDecl = pm.getObjectDecl("CaseWithCampaignContact");
    if (!caseDecl) {
      throw new Error("Expected CaseWithCampaignContact object declaration to be indexed");
    }
    expect(Boolean(caseDecl.isPersistent)).to.equal(true);

    const diags = await createSemanticDiagnostics(unitText, unitUri, pm);
    const hasIdError = diags.some((d: any) =>
      String(d?.message ?? "").includes("Invalid attribute/relationship `_id`")
    );

    expect(hasIdError).to.equal(false, "Expected _id to be accepted on persistent objects");

    // Clean up so local runs don't leave untracked generated files behind.
    await fs.remove(bundledMetadataPath);
    await fs.remove(workspaceMetadataPath);
  });

  it("allows _id when dsl-commons path is set and mining succeeds", async function () {
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

    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "helium-dsl-commons-"));
    const relBuiltin =
      "WebCompiler-lib/src/main/java/com/mezzanine/program/web/builder/BuiltinObjects.java";
    const relObjectBuilder =
      "WebCompiler-lib/src/main/java/com/mezzanine/program/web/builder/object/ObjectBuilder.java";
    await fs.ensureDir(path.join(tmp, path.dirname(relBuiltin)));
    await fs.ensureDir(path.join(tmp, path.dirname(relObjectBuilder)));
    await fs.writeFile(
      path.join(tmp, relBuiltin),
      `public class BuiltinObjects {
    public static class Identity {
        public static final String ATTR_ID = "_id";
        public static final String ATTR_TIME_ZONE = "_timeZone";
    }
}`
    );
    await fs.writeFile(
      path.join(tmp, relObjectBuilder),
      `public class ObjectBuilder {
    public static final String ATTR_ID = "_id";
    public static final String BLOB_FILE_NAME = "_fname__";
    public static final String BLOB_MIME_TYPE = "_mtype__";
    public static final String BLOB_SIZE = "_size__";
}`
    );

    await fs.remove(bundledMetadataPath).catch(() => {});
    await fs.remove(workspaceMetadataPath).catch(() => {});

    const { getLanguageMetadataSync, resetLanguageMetadataCache, setDslCommonsPath } = await import(
      "../src/language/metadata.js"
    );
    const { createSemanticDiagnostics } = await import("../src/semantic/diagnostics.js");

    setDslCommonsPath(tmp);
    resetLanguageMetadataCache();
    const metadata = getLanguageMetadataSync();
    expect(metadata.platformImplicitFields).to.deep.equal(["_id"]);

    const index = new ProjectIndex("/tmp/helium-test-platform-mined", metadata as any);

    const modelText = `persistent object SomeEntity {
  string name;
}`;

    const unitText = `unit TestUnit;
void f() {
  SomeEntity someObj;
  uuid id = someObj._id;
}`;

    const modelUri = URI.file("/tmp/helium-test-platform-mined/SomeEntity.mez").toString();
    const unitUri = URI.file("/tmp/helium-test-platform-mined/TestUnit.mez").toString();

    await index.updateFile(modelUri, modelText);
    await index.updateFile(unitUri, unitText);

    const unitAst = index.getFileAst(unitUri);
    if (!unitAst || unitAst.units.length === 0) {
      this.skip();
    }

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

    const diags = await createSemanticDiagnostics(unitText, unitUri, pm);
    const hasIdError = diags.some((d: any) =>
      String(d?.message ?? "").includes("Invalid attribute/relationship `_id`")
    );
    expect(hasIdError).to.equal(false, "Expected _id to be accepted when mined from dsl-commons");

    setDslCommonsPath(undefined);
    resetLanguageMetadataCache();
    await fs.remove(tmp).catch(() => {});
  });
});
