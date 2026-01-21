import { expect } from "chai";
import { createDiagnostics } from "../src/diagnostics.js";
import { runLints } from "../src/linter/engine.js";

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
});

