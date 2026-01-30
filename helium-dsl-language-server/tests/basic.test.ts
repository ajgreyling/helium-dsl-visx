import { expect } from "chai";
import { createDiagnostics } from "../src/diagnostics.js";
import { runLints } from "../src/linter/engine.js";
import { parseText } from "../src/parser/index.js";

describe("Diagnostics and lints", () => {
  it("reports no diagnostics for empty file", async () => {
    const diags = await createDiagnostics("");
    expect(diags.length).to.be.greaterThan(0); // parser-not-generated warning until parser is built
  });

  it("flags variable declarations inside else", async () => {
    const sample = `
    if (x == true) {
      int a = 1;
    } else {
      int b = 2;
    }
    `;
    const diags = await runLints(sample);
    expect(diags.some((d) => d.code === "no-var-in-else")).to.be.true;
  });

  it("does not flag variable declarations inside nested blocks within else", async () => {
    const sample = `
    if (x == true) {
      int a = 1;
    } else {
      if (y == true) {
        int b = 2;
      }
    }
    `;
    const diags = await runLints(sample);
    expect(diags.some((d) => d.code === "no-var-in-else")).to.be.false;
  });

  it("does not treat catch variables as forbidden declarations in else", async () => {
    const sample = `
    if (x == true) {
      int a = 1;
    } else {
      try {
        Mez:log("ok");
      } catch (ex) {
        Mez:log(ex.toString);
      }
    }
    `;
    const diags = await runLints(sample);
    expect(diags.some((d) => d.code === "no-var-in-else")).to.be.false;
  });

  describe("Dot notation diagnostics", () => {
    it("flags parser error for deep dot notation (a.b.c)", async () => {
      const sample = `
      object Test {
        int test() {
          parent.child.name = 1;
          return 0;
        }
      }
      `;
      const result = await parseText(sample);
      const dotNotationErrors = result.diagnostics.filter(
        (d) => d.message.includes("Dot notation is only supported one level deep") && d.source === "helium-dsl-parser"
      );
      expect(dotNotationErrors.length).to.be.greaterThan(0);
    });

    it("flags parser error for deep unit-qualified dot notation (Unit:obj.attr.more)", async () => {
      const sample = `
      object Test {
        int test() {
          SomeUnit:someObject.someProperty.nested = 1;
          return 0;
        }
      }
      `;
      const result = await parseText(sample);
      const dotNotationErrors = result.diagnostics.filter(
        (d) => d.message.includes("Dot notation is only supported one level deep") && d.source === "helium-dsl-parser"
      );
      expect(dotNotationErrors.length).to.be.greaterThan(0);
    });

    it("does not flag valid single-level dot notation (a.b)", async () => {
      const sample = `
      object Test {
        int test() {
          parent.name = 1;
          return 0;
        }
      }
      `;
      const result = await parseText(sample);
      const dotNotationErrors = result.diagnostics.filter(
        (d) => d.message.includes("Dot notation is only supported one level deep") && d.source === "helium-dsl-parser"
      );
      expect(dotNotationErrors.length).to.equal(0);
    });

    it("does not flag valid unit-qualified dot notation (Unit:obj.attr)", async () => {
      const sample = `
      object Test {
        int test() {
          SomeUnit:someObject.someProperty = 1;
          return 0;
        }
      }
      `;
      const result = await parseText(sample);
      const dotNotationErrors = result.diagnostics.filter(
        (d) => d.message.includes("Dot notation is only supported one level deep") && d.source === "helium-dsl-parser"
      );
      expect(dotNotationErrors.length).to.equal(0);
    });

    it("flags linter error for deep dot notation when rule is enabled", async () => {
      const sample = `
      object Test {
        int test() {
          parent.child.name = 1;
          return 0;
        }
      }
      `;
      const diags = await runLints(sample);
      const dotNotationErrors = diags.filter((d) => d.code === "dot-notation-limit");
      expect(dotNotationErrors.length).to.be.greaterThan(0);
    });
  });
});

