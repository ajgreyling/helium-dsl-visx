import { expect } from "chai";
import { describe, it } from "mocha";
import { URI } from "vscode-uri";
import { Position } from "vscode-languageserver/node.js";

import { findCallAtPosition } from "../src/utils/signatureHelp.js";
import { ProjectIndex } from "../src/index/projectIndex.js";
import { getLanguageMetadataSync } from "../src/language/metadata.js";

function positionOf(haystack: string, needle: string): Position {
  const idx = haystack.indexOf(needle);
  expect(idx, `needle not found: ${needle}`).to.be.greaterThan(-1);
  const before = haystack.slice(0, idx);
  const lines = before.split(/\r?\n/);
  const line = lines.length - 1;
  const character = lines[lines.length - 1]?.length ?? 0;
  return { line, character };
}

describe("Signature help helpers", () => {
  it("finds unqualified call + active parameter", () => {
    const text = `unit UnitTest;
void f() {
  foo(1, 2, 3);
}`;
    const pos = positionOf(text, "2");
    const call = findCallAtPosition(text, pos);
    expect(call).to.not.equal(null);
    expect(call!.callee).to.equal("foo");
    expect(call!.namespace).to.equal(undefined);
    expect(call!.activeParameter).to.equal(1);
  });

  it("finds namespaced call + active parameter", () => {
    const text = `unit UnitTest;
void f() {
  String:concat("a", "b");
}`;
    const pos = positionOf(text, "\"b\"");
    const call = findCallAtPosition(text, pos);
    expect(call).to.not.equal(null);
    expect(call!.callee).to.equal("concat");
    expect(call!.namespace).to.equal("String");
    expect(call!.activeParameter).to.equal(1);
  });
});

describe("Property navigation via index", () => {
  it("resolves p.name to the attribute declaration", async function () {
    const metadata = getLanguageMetadataSync();
    const index = new ProjectIndex("/tmp/helium-test", metadata);

    const objText = `object Person {
  string name;
}`;
    const unitText = `unit UnitTest;
string f() {
  Person p;
  string n = p.name;
  return n;
}`;

    const objUri = URI.file("/tmp/helium-test/Person.mez").toString();
    const unitUri = URI.file("/tmp/helium-test/UnitTest.mez").toString();

    await index.updateFile(objUri, objText);
    await index.updateFile(unitUri, unitText);

    const unitAst = index.getFileAst(unitUri);
    if (!unitAst || unitAst.propertyReferences.length === 0) {
      // Parser not generated / AST building disabled in this environment.
      this.skip();
    }

    const usagePos = positionOf(unitText, "name;");
    const def = index.resolveDefinitionAt(unitUri, usagePos);
    expect(def).to.not.equal(null);
    expect(def!.uri).to.equal(objUri);

    // References from declaration should include the usage site.
    const declPos = positionOf(objText, "name;");
    const declSymbol = index.resolveSymbolAt(objUri, declPos);
    expect(declSymbol).to.not.equal(null);
    const refs = index.findReferences(declSymbol!, true);
    expect(refs.some((r) => r.uri === unitUri)).to.equal(true);

    // Document highlight behavior is just "references filtered to current doc".
    const usageSymbol = index.resolveSymbolAt(unitUri, usagePos);
    expect(usageSymbol).to.not.equal(null);
    const inDoc = index.findReferences(usageSymbol!, true).filter((r) => r.uri === unitUri);
    expect(inDoc.length).to.be.greaterThan(0);
  });
});

