import fs from "node:fs";
import { URI } from "vscode-uri";
import { MezWorkspaceService } from "./mezWorkspace.js";
import { LangKeyIndex } from "./langIndex.js";
import { buildVxmlAst } from "../vxml/parser.js";
import { validateVxml } from "../vxml/validator.js";
export class VxmlWorkspaceService {
    workspaceRoot;
    langIndex;
    mez;
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this.langIndex = new LangKeyIndex(workspaceRoot);
        this.mez = new MezWorkspaceService(workspaceRoot);
    }
    getWorkspaceRoot() {
        return this.workspaceRoot;
    }
    updateVxml(filePath, text) {
        const uri = URI.file(filePath).toString();
        return buildVxmlAst(text, uri);
    }
    parse(filePath, textOverride) {
        const text = textOverride ?? fs.readFileSync(filePath, "utf8");
        const uri = URI.file(filePath).toString();
        return buildVxmlAst(text, uri);
    }
    validate(filePath, textOverride) {
        const ast = this.parse(filePath, textOverride);
        this.langIndex.refresh();
        return validateVxml(ast, this.mez, this.langIndex);
    }
    getLangIndex() {
        return this.langIndex;
    }
    getMez() {
        return this.mez;
    }
}
