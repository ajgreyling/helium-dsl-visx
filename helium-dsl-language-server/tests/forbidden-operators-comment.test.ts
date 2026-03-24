import { expect } from "chai";
import { maskCommentsPreserveLength } from "../src/linter/commentMask.js";
import { applyForbiddenOperators } from "../src/linter/rules/forbiddenOperators.js";
import type { LintContext } from "../src/linter/engine.js";

const forbiddenRule = {
  id: "forbidden-operators",
  severity: "warning" as const,
  message: "Forbidden operator usage.",
  category: "style",
};

function makeCtx(text: string): LintContext {
  return {
    text,
    rules: { "forbidden-operators": forbiddenRule },
    diagnostics: [],
  };
}

describe("forbidden-operators and comment masking", () => {
  it("maskCommentsPreserveLength clears block comment including URL query and colon", () => {
    const line =
      "\t\t\twscat -c wss://helium.mezzanineware.com/api/ws2/logging?appId=uuid --auth un:pw";
    const sample = `void syncProgressCheck() {\n\t/*\n${line}\n\t*/\n\treturn;\n}\n`;
    const masked = maskCommentsPreserveLength(sample);
    expect(masked.length).to.equal(sample.length);
    const maskedLines = masked.split("\n");
    expect(maskedLines[2]!.includes("?")).to.be.false;
    expect(maskedLines[2]!.includes(":")).to.be.false;
  });

  it("does not report ternary for URL-like text inside block comment", () => {
    const line =
      "\t\t\twscat -c wss://helium.mezzanineware.com/api/ws2/logging?appId=uuid --auth un:pw";
    const sample = `void syncProgressCheck() {\n\t/*\n${line}\n\t*/\n\treturn;\n}\n`;
    const ctx = makeCtx(sample);
    applyForbiddenOperators(ctx);
    const ternary = ctx.diagnostics.filter(
      (d) => d.code === "forbidden-operators" && d.message.includes("Ternary")
    );
    expect(ternary.length).to.equal(0);
  });

  it("still flags ternary in real code", () => {
    const sample = "void f() {\n\tint x = a ? b : c;\n}\n";
    const ctx = makeCtx(sample);
    applyForbiddenOperators(ctx);
    const ternary = ctx.diagnostics.filter(
      (d) => d.code === "forbidden-operators" && d.message.includes("Ternary")
    );
    expect(ternary.length).to.be.greaterThan(0);
  });

  it("masks line comments", () => {
    const sample = 'void f() {\n\tint x = 1; // a ? b : c\n}\n';
    const masked = maskCommentsPreserveLength(sample);
    expect(masked.includes("?")).to.be.false;
  });

  it("does not treat // inside double-quoted string as line comment", () => {
    const sample = 'string s = "// not a comment ? a : b";\n';
    const masked = maskCommentsPreserveLength(sample);
    expect(masked.includes("?")).to.be.true;
  });
});
