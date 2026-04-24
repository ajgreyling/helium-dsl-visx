import { expect } from "chai";
import { TextDocument } from "vscode-languageserver-textdocument";
import { CodeActionKind, DiagnosticSeverity } from "vscode-languageserver";
import { createForbiddenOperatorFix } from "../src/codeActions/quickFixes.js";

describe("quick fixes", () => {
  it("creates explicit boolean comparison fix for function-call if conditions", () => {
    const text =
      "void saveInstance() {\n\tif (fetchAndPersistFriendlyAppNameForInstance(currentInstance)) {\n\t\treturn;\n\t}\n}\n";
    const doc = TextDocument.create("file:///memory/Instances.mez", "helium-dsl", 1, text);

    const diagnostic = {
      range: {
        start: { line: 1, character: 1 },
        end: { line: 1, character: 63 },
      },
      message:
        "Boolean variables in if conditions must use explicit comparison. Use '== true' or '== false'.",
      severity: DiagnosticSeverity.Warning,
      source: "helium-dsl-linter",
      code: "forbidden-operators",
    };

    const action = createForbiddenOperatorFix(doc, diagnostic, text);
    expect(action).to.not.equal(null);
    expect(action?.kind).to.equal(CodeActionKind.QuickFix);
    const edits = action?.edit?.changes?.[doc.uri];
    expect(edits).to.not.equal(undefined);
    expect(edits![0]?.newText).to.equal(
      "if (fetchAndPersistFriendlyAppNameForInstance(currentInstance) == true)"
    );
  });
});
