import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import { describe, it } from "mocha";
import { URI } from "vscode-uri";
import { DiagnosticSeverity } from "vscode-languageserver/node.js";

import { ProjectIndex } from "../src/index/projectIndex.js";
import { getLanguageMetadataSync } from "../src/language/metadata.js";

describe("Unused symbol warnings", () => {
  it("warns for unused attributes/functions/units and suppresses when used (including via VXML)", async function () {
    const metadata = getLanguageMetadataSync();
    const index = new ProjectIndex("/tmp/helium-test-unused", metadata);

    const doctorObj = `@Role("Doctor")
persistent object Doctor {
  @EmailValidator("validator.email_address")
  string email_address;

  @PhoneValidator("validator.phone_number")
  string phone_number;

  string license_number;
  string used_attr;
  datetime created_at;
  datetime updated_at;
  bool archived;

  beforeCreate {
    before.created_at = Mez:now();
    before.updated_at = Mez:now();
    before.archived = false;
  }
}`;
    const units = `unit DoctorUnit;
void usedFn() {
  // no-op
}
void unusedFn() {
  // no-op
}
@Scheduled("0 0 * * *")
void scheduledEntrypoint() {
  // platform entrypoint
}

unit UnusedUnit;
void neverCalled() {
  // no-op
}`;
    const consumer = `unit Consumer;
void f() {
  Doctor d;
  string x = d.used_attr;
  DoctorUnit:usedFn();
}`;
    const viewUnit = `unit ViewUnit;
void init() {
  // no-op
}
void destroy() {
  // platform lifecycle hook
}
void unusedViewFn() {
  // no-op
}`;

    const doctorObjUri = URI.file("/tmp/helium-test-unused/Doctor.mez").toString();
    const unitsUri = URI.file("/tmp/helium-test-unused/Units.mez").toString();
    const consumerUri = URI.file("/tmp/helium-test-unused/Consumer.mez").toString();
    const viewUnitUri = URI.file("/tmp/helium-test-unused/ViewUnit.mez").toString();
    const viewUri = URI.file("/tmp/helium-test-unused/View.vxml").toString();

    await index.updateFile(doctorObjUri, doctorObj);
    await index.updateFile(unitsUri, units);
    await index.updateFile(consumerUri, consumer);
    await index.updateFile(viewUnitUri, viewUnit);

    // If parser/AST isn’t available in this environment, skip (consistent with other tests).
    const viewAst = index.getFileAst(viewUnitUri);
    if (!viewAst || viewAst.units.length === 0) {
      this.skip();
    }

    // VXML binds ViewUnit + init()
    const vxml = `<view unit="ViewUnit" init="init"></view>`;
    await index.updateVxmlFile(viewUri, vxml);

    // Ensure project config exists so unused diagnostics are emitted (attributes default to None otherwise).
    const projectRoot = "/tmp/helium-test-unused";
    const configPath = path.join(projectRoot, "helium-rapid-dsl-project.json");
    fs.mkdirSync(projectRoot, { recursive: true });
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        schemaVersion: 1,
        diagnostics: {
          unused: { attributes: "Info", functions: "Info", units: "Info" },
        },
      }),
      "utf8"
    );

    const objWarnings = index.getUnusedWarningsForFile(doctorObjUri);
    const unitsWarnings = index.getUnusedWarningsForFile(unitsUri);
    const viewWarnings = index.getUnusedWarningsForFile(viewUnitUri);

    // Helper: any severity (Info or Warning) for unused diagnostics
    const hasUnusedDiag = (diags: any[], contains: string) =>
      diags.some((d) => String(d.message).includes(contains));

    // Unused attribute should warn
    expect(hasUnusedDiag(objWarnings, "Attribute license_number is not used anywhere")).to.equal(true);
    // Used attribute should not warn
    expect(hasUnusedDiag(objWarnings, "Attribute used_attr is not used anywhere")).to.equal(false);
    // Attributes assigned via pseudoscope in triggers should not warn
    expect(hasUnusedDiag(objWarnings, "Attribute created_at is not used anywhere")).to.equal(false);
    expect(hasUnusedDiag(objWarnings, "Attribute updated_at is not used anywhere")).to.equal(false);
    expect(hasUnusedDiag(objWarnings, "Attribute archived is not used anywhere")).to.equal(false);

    // Used function should not warn; unused should warn
    expect(hasUnusedDiag(unitsWarnings, "Function DoctorUnit:usedFn is not used anywhere")).to.equal(false);
    expect(hasUnusedDiag(unitsWarnings, "Function DoctorUnit:unusedFn is not used anywhere")).to.equal(true);
    // Entrypoint-annotated function should not warn even if never called
    expect(hasUnusedDiag(unitsWarnings, "Function DoctorUnit:scheduledEntrypoint is not used anywhere")).to.equal(false);

    // Unused unit should warn
    expect(hasUnusedDiag(unitsWarnings, "Unit UnusedUnit is not used anywhere")).to.equal(true);

    // ViewUnit/init is used via VXML, should not warn
    expect(hasUnusedDiag(viewWarnings, "Unit ViewUnit is not used anywhere")).to.equal(false);
    expect(hasUnusedDiag(viewWarnings, "Function ViewUnit:init is not used anywhere")).to.equal(false);
    // destroy is platform lifecycle hook for view units, should not warn
    expect(hasUnusedDiag(viewWarnings, "Function ViewUnit:destroy is not used anywhere")).to.equal(false);
    // Another view function is unused, should warn
    expect(hasUnusedDiag(viewWarnings, "Function ViewUnit:unusedViewFn is not used anywhere")).to.equal(true);
  });

  it("reports unused language entries (default Info) when referenced from mez or vxml", async function () {
    const metadata = getLanguageMetadataSync();
    const index = new ProjectIndex("/tmp/helium-test-lang-unused", metadata);
    const projectRoot = "/tmp/helium-test-lang-unused";
    fs.mkdirSync(projectRoot, { recursive: true });
    const configPath = path.join(projectRoot, "helium-rapid-dsl-project.json");
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        schemaVersion: 1,
        diagnostics: {
          unused: {
            attributes: "None",
            functions: "None",
            units: "None",
            languageEntries: "Info",
          },
        },
      }),
      "utf8"
    );

    const mezUri = URI.file(path.join(projectRoot, "App.mez")).toString();
    const vxmlUri = URI.file(path.join(projectRoot, "V.vxml")).toString();
    const langUri = URI.file(path.join(projectRoot, "en.lang")).toString();

    await index.updateFile(
      mezUri,
      `unit U;
void f() {
  string x = String:translate("used_from_mez");
}
`
    );
    await index.updateVxmlFile(vxmlUri, `<view label="used_from_vxml" unit="U"></view>`);

    const langText = `used_from_mez=One
used_from_vxml=Two
orphan_unused=Three
`;
    await index.updateLangFile(langUri, langText);

    const diags = index.getUnusedWarningsForFile(langUri, undefined, langText);
    const orphan = diags.find((d) => String(d.message).includes("orphan_unused"));
    expect(orphan).to.not.equal(undefined);
    expect(orphan!.severity).to.equal(DiagnosticSeverity.Information);
    expect(diags.some((d) => String(d.message).includes("used_from_mez"))).to.equal(false);
    expect(diags.some((d) => String(d.message).includes("used_from_vxml"))).to.equal(false);

    fs.writeFileSync(
      configPath,
      JSON.stringify({
        schemaVersion: 1,
        diagnostics: {
          unused: { languageEntries: "None" },
        },
      }),
      "utf8"
    );
    (index as any).cachedConfig = null;
    const noneDiags = index.getUnusedWarningsForFile(langUri, undefined, langText);
    expect(noneDiags.length).to.equal(0);
  });

  it("does not warn for unit and functions referenced only via globalview", async function () {
    const metadata = getLanguageMetadataSync();
    const index = new ProjectIndex("/tmp/helium-test-unused-globalview", metadata);

    const globalUnitMez = `unit GlobalsLike;
void getFoo() {
  // no-op
}
void destroy() {
  // no-op
}`;
    const vxmlGlobalView = `<globalview unit="GlobalsLike">
  <globalAction label="action.foo" action="navigateToFoo">
    <visible function="getFoo"/>
  </globalAction>
</globalview>`;

    const globalUnitUri = URI.file("/tmp/helium-test-unused-globalview/GlobalsLike.mez").toString();
    const viewVxmlUri = URI.file("/tmp/helium-test-unused-globalview/Globals.vxml").toString();

    await index.updateFile(globalUnitUri, globalUnitMez);
    await index.updateVxmlFile(viewVxmlUri, vxmlGlobalView);

    const globalUnitAst = index.getFileAst(globalUnitUri);
    if (!globalUnitAst || globalUnitAst.units.length === 0) {
      this.skip();
    }

    const warnings = index.getUnusedWarningsForFile(globalUnitUri);
    const hasUnusedDiag = (diags: any[], contains: string) =>
      diags.some((d) => String(d.message).includes(contains));

    expect(hasUnusedDiag(warnings, "Unit GlobalsLike is not used anywhere")).to.equal(false);
    expect(hasUnusedDiag(warnings, "Function GlobalsLike:getFoo is not used anywhere")).to.equal(false);
    expect(hasUnusedDiag(warnings, "Function GlobalsLike:destroy is not used anywhere")).to.equal(false);
  });

  it("does not warn for unit referenced only via VXML menu binding (dynamicUserRoles function)", async function () {
    const metadata = getLanguageMetadataSync();
    const index = new ProjectIndex("/tmp/helium-test-unused-menu", metadata);

    const menuItemPermissionMez = `unit MenuItemPermission;
bool mayViewMovables() {
  return true;
}`;
    const viewUnitMez = `unit MovablesViewUnit;
void init() {
  // no-op
}`;
    const vxmlWithMenuBinding = `<view unit="MovablesViewUnit" init="init">
  <menuitem>
    <dynamicUserRoles function="MenuItemPermission:mayViewMovables" />
  </menuitem>
</view>`;

    const menuItemPermissionUri = URI.file("/tmp/helium-test-unused-menu/MenuItemPermission.mez").toString();
    const viewUnitUri = URI.file("/tmp/helium-test-unused-menu/MovablesViewUnit.mez").toString();
    const viewVxmlUri = URI.file("/tmp/helium-test-unused-menu/MovablesView.vxml").toString();

    await index.updateFile(menuItemPermissionUri, menuItemPermissionMez);
    await index.updateFile(viewUnitUri, viewUnitMez);
    await index.updateVxmlFile(viewVxmlUri, vxmlWithMenuBinding);

    const menuItemPermissionAst = index.getFileAst(menuItemPermissionUri);
    if (!menuItemPermissionAst || menuItemPermissionAst.units.length === 0) {
      this.skip();
    }

    const warnings = index.getUnusedWarningsForFile(menuItemPermissionUri);
    const hasUnusedUnit = warnings.some(
      (d) =>
        (d.severity === DiagnosticSeverity.Information || d.severity === DiagnosticSeverity.Warning) &&
        String(d.message).includes("Unit MenuItemPermission is not used anywhere")
    );
    expect(hasUnusedUnit).to.equal(false);
  });

  it("does not warn for unit referenced only via VXML button action attribute", async function () {
    const metadata = getLanguageMetadataSync();
    const index = new ProjectIndex("/tmp/helium-test-unused-button-action", metadata);

    const scheduleUnitMez = `unit ScheduleFunction_ProcessDelta;
void run() {
  // no-op
}`;
    const viewUnitMez = `unit SystemAdminViewUnit;
void init() {
  // no-op
}`;
    const vxmlWithButtonAction = `<view unit="SystemAdminViewUnit" init="init">
  <button action="ScheduleFunction_ProcessDelta:run" label="Run" />
</view>`;

    const scheduleUnitUri = URI.file("/tmp/helium-test-unused-button-action/ScheduleFunction_ProcessDelta.mez").toString();
    const viewUnitUri = URI.file("/tmp/helium-test-unused-button-action/SystemAdminViewUnit.mez").toString();
    const viewVxmlUri = URI.file("/tmp/helium-test-unused-button-action/SystemAdminGeneral.vxml").toString();

    await index.updateFile(scheduleUnitUri, scheduleUnitMez);
    await index.updateFile(viewUnitUri, viewUnitMez);
    await index.updateVxmlFile(viewVxmlUri, vxmlWithButtonAction);

    const scheduleUnitAst = index.getFileAst(scheduleUnitUri);
    if (!scheduleUnitAst || scheduleUnitAst.units.length === 0) {
      this.skip();
    }

    const warnings = index.getUnusedWarningsForFile(scheduleUnitUri);
    const hasUnusedUnit = warnings.some(
      (d) =>
        (d.severity === DiagnosticSeverity.Information || d.severity === DiagnosticSeverity.Warning) &&
        String(d.message).includes("Unit ScheduleFunction_ProcessDelta is not used anywhere")
    );
    expect(hasUnusedUnit).to.equal(false);
  });

  it("does not warn for view function only bound in VXML when in-memory VXML index was cleared (disk fallback)", async function () {
    const projectRoot = "/tmp/helium-test-vxml-disk-fallback";
    fs.mkdirSync(projectRoot, { recursive: true });
    const metadata = getLanguageMetadataSync();
    const viewUnitPath = path.join(projectRoot, "ViewDiskOnly.mez");
    const viewVxmlPath = path.join(projectRoot, "ViewDiskOnly.vxml");
    const configPath = path.join(projectRoot, "helium-rapid-dsl-project.json");

    fs.writeFileSync(
      configPath,
      JSON.stringify({
        schemaVersion: 1,
        diagnostics: {
          unused: { attributes: "None", functions: "Warning", units: "Warning" },
        },
      }),
      "utf8"
    );
    fs.writeFileSync(
      viewUnitPath,
      `unit ViewDiskOnly;
void init() {
}
void onlyFromDisk() {
}`,
      "utf8"
    );
    fs.writeFileSync(
      viewVxmlPath,
      `<view unit="ViewDiskOnly" init="init">
  <submit action="onlyFromDisk" label="l" />
</view>`,
      "utf8"
    );

    const index = new ProjectIndex(projectRoot, metadata);
    await index.indexProjectFiles();

    const viewUnitUri = URI.file(viewUnitPath).toString();
    const viewAst = index.getFileAst(viewUnitUri);
    if (!viewAst || viewAst.units.length === 0) {
      this.skip();
    }

    (index as unknown as { vxml: Map<string, unknown> }).vxml.clear();
    (index as unknown as { rebuildUsageIndexes: () => void }).rebuildUsageIndexes();

    const warnings = index.getUnusedWarningsForFile(viewUnitUri);
    const hasUnusedFn = warnings.some((d) =>
      String(d.message).includes("Function ViewDiskOnly:onlyFromDisk is not used anywhere")
    );
    expect(hasUnusedFn).to.equal(false);
  });
});

