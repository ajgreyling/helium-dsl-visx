import { expect } from "chai";
import { describe, it } from "mocha";
import { URI } from "vscode-uri";

import { ProjectIndex } from "../src/index/projectIndex.js";
import { getLanguageMetadataSync } from "../src/language/metadata.js";

describe("Trigger pseudo-scopes (before / after)", () => {
  it("treats `after` as in scope inside beforeUpdate blocks", async function () {
    const metadata = getLanguageMetadataSync();
    const index = new ProjectIndex("/tmp/helium-test-trigger-pseudoscope", metadata);

    const modelText = `persistent object Status_Log_Tracked {
  datetime date_modified;
  beforeUpdate {
    after.date_modified = Mez:now();
  }
}`;
    const modelUri = URI.file("/tmp/helium-test-trigger-pseudoscope/Status_Log_Tracked.mez").toString();
    await index.updateFile(modelUri, modelText);

    const ast = index.getFileAst(modelUri);
    if (!ast || ast.objects.length === 0) {
      this.skip();
    }

    const { createSemanticDiagnostics } = await import("../src/semantic/diagnostics.js");

    const pm = {
      isUnit: () => false,
      hasUnitFunction: () => false,
      isUserDefinedType: (name: string) => ast.objects.some((o: any) => o.name === name),
      getObjectDecl: (baseType: string) => ast.objects.find((o: any) => o.name === baseType),
      getObjectMembers: (baseType: string) => {
        const o = ast.objects.find((x: any) => x.name === baseType);
        return (o?.attributes ?? []).map((a: any) => a.name);
      },
      getVariableType: (name: string, uri: string, pos: { line: number; character: number }) =>
        index.getVariableType(name, uri, pos),
      getInverseMemberSources: () => undefined,
      getUnusedWarningsForFile: () => [],
    } as any;

    const diags = await createSemanticDiagnostics(modelText, modelUri, pm);
    const unknownAfter = diags.some(
      (d: any) => String(d?.message ?? "").includes("Unknown variable") && String(d?.message ?? "").includes("`after`")
    );
    expect(unknownAfter).to.equal(false);
  });
});
