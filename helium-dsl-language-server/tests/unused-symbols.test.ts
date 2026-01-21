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

    const objWarnings = index.getUnusedWarningsForFile(doctorObjUri);
    const unitsWarnings = index.getUnusedWarningsForFile(unitsUri);
    const viewWarnings = index.getUnusedWarningsForFile(viewUnitUri);

    // Helper
    const hasInfo = (diags: any[], contains: string) =>
      diags.some((d) => d.severity === DiagnosticSeverity.Information && String(d.message).includes(contains));

    // Unused attribute should warn
    expect(hasInfo(objWarnings, "Attribute license_number is not used anywhere")).to.equal(true);
    // Used attribute should not warn
    expect(hasInfo(objWarnings, "Attribute used_attr is not used anywhere")).to.equal(false);
    // Attributes assigned via pseudoscope in triggers should not warn
    expect(hasInfo(objWarnings, "Attribute created_at is not used anywhere")).to.equal(false);
    expect(hasInfo(objWarnings, "Attribute updated_at is not used anywhere")).to.equal(false);
    expect(hasInfo(objWarnings, "Attribute archived is not used anywhere")).to.equal(false);

    // Used function should not warn; unused should warn
    expect(hasInfo(unitsWarnings, "Function DoctorUnit:usedFn is not used anywhere")).to.equal(false);
    expect(hasInfo(unitsWarnings, "Function DoctorUnit:unusedFn is not used anywhere")).to.equal(true);
    // Entrypoint-annotated function should not warn even if never called
    expect(hasInfo(unitsWarnings, "Function DoctorUnit:scheduledEntrypoint is not used anywhere")).to.equal(false);

    // Unused unit should warn
    expect(hasInfo(unitsWarnings, "Unit UnusedUnit is not used anywhere")).to.equal(true);

    // ViewUnit/init is used via VXML, should not warn
    expect(hasInfo(viewWarnings, "Unit ViewUnit is not used anywhere")).to.equal(false);
    expect(hasInfo(viewWarnings, "Function ViewUnit:init is not used anywhere")).to.equal(false);
    // Another view function is unused, should warn
    expect(hasInfo(viewWarnings, "Function ViewUnit:unusedViewFn is not used anywhere")).to.equal(true);
  });
});

