import { expect } from "chai";
import { describe, it } from "mocha";
import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { extractBifMetadataFromGrammar } from "../scripts/generate-bif-metadata.js";

describe("generate-bif-metadata", () => {
  it("extracts namespaces from generated grammar (e.g. Mez, String, sql)", async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const toolingRoot = path.resolve(__dirname, "..");
    const grammarPath = path.join(toolingRoot, "generated", "grammar", "MezDSL.g4");

    const grammar = await fs.readFile(grammarPath, "utf8");
    const namespaces = extractBifMetadataFromGrammar(grammar);

    expect(Object.keys(namespaces).length).to.be.greaterThan(0);
    expect(namespaces).to.have.property("Mez");
    expect(namespaces).to.have.property("String");
    expect(namespaces).to.have.property("sql");

    // Sanity check a known entry
    const mezNames = (namespaces["Mez"] ?? []).map((x) => x.name);
    expect(mezNames).to.include("now");
  });
});

