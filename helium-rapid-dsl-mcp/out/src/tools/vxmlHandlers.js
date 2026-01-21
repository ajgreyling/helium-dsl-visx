import fs from "node:fs";
import path from "node:path";
import { VxmlWorkspaceService } from "../services/vxmlWorkspace.js";
import { RAPID_PROJECT_FILE_NAME } from "helium-dsl-language-server/api";
function jsonResult(value) {
    return {
        content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
    };
}
function errorResult(message) {
    return { content: [{ type: "text", text: message }], isError: true };
}
function asString(v) {
    return typeof v === "string" ? v : null;
}
function asNumber(v) {
    return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function findRapidProjectRootForFile(filePath) {
    let cur = path.resolve(path.dirname(filePath));
    for (let i = 0; i < 25; i++) {
        const marker = path.join(cur, RAPID_PROJECT_FILE_NAME);
        if (fs.existsSync(marker))
            return cur;
        const parent = path.dirname(cur);
        if (parent === cur)
            break;
        cur = parent;
    }
    cur = path.resolve(path.dirname(filePath));
    for (let i = 0; i < 25; i++) {
        const modelDir = path.join(cur, "model");
        const webAppDir = path.join(cur, "web-app");
        if (fs.existsSync(modelDir) && fs.existsSync(webAppDir))
            return cur;
        const parent = path.dirname(cur);
        if (parent === cur)
            break;
        cur = parent;
    }
    return path.resolve(path.dirname(filePath));
}
export function createVxmlToolHandlers() {
    const cache = new Map();
    const getSvcForFile = (filePath) => {
        const root = findRapidProjectRootForFile(filePath);
        const existing = cache.get(root);
        if (existing)
            return existing;
        const svc = new VxmlWorkspaceService(root);
        cache.set(root, svc);
        return svc;
    };
    return {
        helium_vxml_ast: async (args) => {
            const filePath = asString(args.filePath);
            if (!filePath)
                return errorResult("filePath is required");
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            const ast = svc.parse(filePath, text);
            return jsonResult(compactAst(ast));
        },
        helium_vxml_validate: async (args) => {
            const filePath = asString(args.filePath);
            if (!filePath)
                return errorResult("filePath is required");
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            const diagnostics = svc.validate(filePath, text);
            return jsonResult({ filePath, diagnostics });
        },
        helium_vxml_complete: async (args) => {
            const filePath = asString(args.filePath);
            const line = asNumber(args.line);
            const character = asNumber(args.character);
            if (!filePath || line === null || character === null) {
                return errorResult("filePath, line, character are required");
            }
            const suggestions = {
                tags: [
                    "view",
                    "menuitem",
                    "action",
                    "submit",
                    "textfield",
                    "textarea",
                    "select",
                    "checkbox",
                    "datefield",
                    "table",
                    "column",
                    "rowAction",
                    "info",
                    "raw",
                    "binding",
                    "visible",
                    "collectionSource",
                    "attribute",
                    "attributeName",
                    "enum",
                ],
                attributes: [
                    "label",
                    "title",
                    "heading",
                    "unit",
                    "init",
                    "action",
                    "icon",
                    "tooltip",
                    "variable",
                    "function",
                    "datatype",
                    "order",
                ],
            };
            return jsonResult({ filePath, line, character, suggestions });
        },
        helium_vxml_extract_unit_stubs: async (args) => {
            const filePath = asString(args.filePath);
            if (!filePath)
                return errorResult("filePath is required");
            const text = asString(args.text) ?? undefined;
            const svc = getSvcForFile(filePath);
            const ast = svc.parse(filePath, text);
            const mez = svc.getMez();
            const index = mez.getIndex();
            const unitName = ast.view?.unitName;
            if (!unitName) {
                return errorResult("View unit not found in VXML (missing view@unit).");
            }
            const unitExists = index.getUnit(unitName);
            const existingFns = index.getUnitFunctions(unitName).map((f) => f.name);
            const existingVars = index.getUnitVariables(unitName).map((v) => v.name);
            const neededFns = collectMissingFunctions(ast, unitName, existingFns);
            const neededVars = collectMissingVariables(ast, unitName, existingVars);
            const stub = buildUnitStub(unitName, unitExists ? [] : ["unit"], neededVars, neededFns);
            return jsonResult({
                unitName,
                unitExists: Boolean(unitExists),
                missingFunctions: neededFns,
                missingVariables: neededVars,
                stub,
            });
        },
    };
}
function compactAst(ast) {
    return {
        uri: ast.uri,
        view: ast.view,
        references: ast.references,
    };
}
function splitQualified(raw, defaultUnit) {
    if (raw.includes(":")) {
        const [unit, name] = raw.split(":", 2);
        return { unitName: unit, name };
    }
    return { unitName: defaultUnit, name: raw };
}
function collectMissingFunctions(ast, viewUnit, existing) {
    const missing = new Set();
    for (const ref of ast.references) {
        if (ref.kind !== "function")
            continue;
        const { unitName, name } = splitQualified(ref.name, viewUnit);
        if (unitName !== viewUnit)
            continue;
        if (!existing.includes(name))
            missing.add(name);
    }
    if (ast.view?.initFunction) {
        const initName = splitQualified(ast.view.initFunction, viewUnit).name;
        if (!existing.includes(initName))
            missing.add(initName);
    }
    return Array.from(missing.values()).sort();
}
function collectMissingVariables(ast, viewUnit, existing) {
    const missing = new Set();
    for (const ref of ast.references) {
        if (ref.kind !== "variable")
            continue;
        const { unitName, name } = splitQualified(ref.name, viewUnit);
        if (unitName !== viewUnit)
            continue;
        if (!existing.includes(name))
            missing.add(name);
    }
    return Array.from(missing.values()).sort();
}
function buildUnitStub(unitName, requiredSections, variables, functions) {
    const lines = [];
    if (requiredSections.includes("unit")) {
        lines.push(`unit ${unitName};`);
        lines.push("");
    }
    for (const v of variables) {
        lines.push(`json ${v};`);
    }
    if (variables.length > 0)
        lines.push("");
    for (const fn of functions) {
        lines.push(`void ${fn}() {`);
        lines.push(`}`);
        lines.push("");
    }
    return lines.join("\n").trimEnd();
}
