import { expect } from "chai";
import { describe, it } from "mocha";
import type { ProjectManager } from "../src/index/projectManager.js";
import { buildVxmlAst } from "../src/vxml/parser.js";
import { validateVxml } from "../src/vxml/validator.js";

const stubPmNoUnits = {
  isUnit: () => false,
  hasUnitFunction: () => false,
  hasLangKey: () => true,
  hasUnitVariable: () => false,
} as unknown as ProjectManager;

describe("VXML static-only view (no presenter unit)", () => {
  it("does not report unknown unit when view only contains <static>", () => {
    const vxml = `<?xml version="1.0" encoding="UTF-8"?>
<ui xmlns="http://uiprogram.mezzanine.com/View">
	<view label="view_heading.water_report" unit="WaterReport">
		<static source="WaterReportPivotTable.html"/>
	</view>
</ui>`;
    const ast = buildVxmlAst(vxml, "file:///WaterReport.vxml");
    const diags = validateVxml(ast, stubPmNoUnits, { indexReady: true });
    const unknownUnit = diags.filter((d) => d.message.includes("Unknown unit"));
    expect(unknownUnit).to.have.length(0);
  });

  it("still reports unknown unit when view has interactive widgets", () => {
    const vxml = `<?xml version="1.0" encoding="UTF-8"?>
<ui xmlns="http://uiprogram.mezzanine.com/View">
	<view label="k" unit="NotAUnit">
		<static source="a.html"/>
		<textfield label="t"><binding variable="NotAUnit:x"/></textfield>
	</view>
</ui>`;
    const ast = buildVxmlAst(vxml, "file:///Bad.vxml");
    const diags = validateVxml(ast, stubPmNoUnits, { indexReady: true });
    expect(diags.some((d) => d.message.includes("Unknown unit"))).to.equal(true);
  });
});
