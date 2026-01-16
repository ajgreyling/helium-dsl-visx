import fs from "node:fs";
import path from "node:path";
import { URI } from "vscode-uri";
import { MezWorkspaceService } from "./mezWorkspace.js";
import { LangKeyIndex } from "./langIndex.js";
import { buildVxmlAst } from "../vxml/parser.js";
import { validateVxml, VxmlDiagnostic } from "../vxml/validator.js";
import { VxmlAst } from "../vxml/types.js";

export class VxmlWorkspaceService {
  private readonly langIndex: LangKeyIndex;
  private readonly mez: MezWorkspaceService;

  constructor(private readonly workspaceRoot: string) {
    this.langIndex = new LangKeyIndex(workspaceRoot);
    this.mez = new MezWorkspaceService(workspaceRoot);
  }

  getWorkspaceRoot(): string {
    return this.workspaceRoot;
  }

  updateVxml(filePath: string, text: string) {
    const uri = URI.file(filePath).toString();
    return buildVxmlAst(text, uri);
  }

  parse(filePath: string, textOverride?: string): VxmlAst {
    const text = textOverride ?? fs.readFileSync(filePath, "utf8");
    const uri = URI.file(filePath).toString();
    return buildVxmlAst(text, uri);
  }

  validate(filePath: string, textOverride?: string): VxmlDiagnostic[] {
    const ast = this.parse(filePath, textOverride);
    this.langIndex.refresh();
    return validateVxml(ast, this.mez, this.langIndex);
  }

  getLangIndex(): LangKeyIndex {
    return this.langIndex;
  }

  getMez(): MezWorkspaceService {
    return this.mez;
  }
}

