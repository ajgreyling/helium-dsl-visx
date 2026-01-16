import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";
import { rangeFromContext, rangeFromTokens } from "./span.js";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "node:path";
import fs from "fs";
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function loadGenerated(name) {
    const currentDir = __dirname;
    const tryLoad = (modulePath, withExtension) => {
        const pathsToTry = withExtension
            ? [modulePath + withExtension, modulePath]
            : [modulePath];
        for (const tryPath of pathsToTry) {
            if (fs.existsSync(tryPath + ".ts") ||
                fs.existsSync(tryPath + ".js") ||
                fs.existsSync(tryPath)) {
                try {
                    const mod = require(tryPath);
                    if (mod) {
                        return mod[name] || mod;
                    }
                }
                catch {
                    // ignore
                }
            }
        }
        return undefined;
    };
    const bundledPath = path.resolve(currentDir, "../../generated/parser/generated/grammar", name);
    const bundledResult = tryLoad(bundledPath);
    if (bundledResult)
        return bundledResult;
    const devPath = path.resolve(currentDir, "../../../generated/parser/generated/grammar", name);
    const devResult = tryLoad(devPath);
    if (devResult)
        return devResult;
    const projectRoot = path.resolve(currentDir, "../../../..");
    const toolingPath = path.resolve(projectRoot, "helium-vscode-tooling/generated/parser/generated/grammar", name);
    const siblingPath1 = path.resolve(currentDir, "../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
    const sibling1Result = tryLoad(siblingPath1, ".ts");
    if (sibling1Result)
        return sibling1Result;
    const siblingPath2 = path.resolve(currentDir, "../../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
    const sibling2Result = tryLoad(siblingPath2, ".ts");
    if (sibling2Result)
        return sibling2Result;
    const absoluteResult = tryLoad(toolingPath, ".ts");
    if (absoluteResult)
        return absoluteResult;
    return undefined;
}
class AstListener {
    constructor(uri) {
        this.currentUnit = null;
        this.currentFunction = null;
        this.currentObject = null;
        this.currentEnum = null;
        this.persistentDepth = 0;
        this.ast = {
            uri,
            objects: [],
            units: [],
            enums: [],
            typeReferences: [],
            unitReferences: [],
            functionCalls: [],
            variableReferences: [],
            propertyReferences: [],
            elseBlocks: [],
        };
    }
    enterPersistentObject(_ctx) {
        this.persistentDepth += 1;
    }
    exitPersistentObject(_ctx) {
        this.persistentDepth = Math.max(0, this.persistentDepth - 1);
    }
    enterSimpleObject(ctx) {
        const nameToken = ctx.ID();
        if (!nameToken)
            return;
        const objectDecl = {
            kind: "ObjectDecl",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
            isPersistent: this.persistentDepth > 0,
            attributes: [],
            relationships: [],
        };
        this.ast.objects.push(objectDecl);
        this.currentObject = objectDecl;
    }
    exitSimpleObject() {
        this.currentObject = null;
    }
    enterPrimitiveAttribute(ctx) {
        if (!this.currentObject)
            return;
        const nameToken = ctx.ID();
        const typeCtx = ctx.primitiveType();
        if (!nameToken || !typeCtx)
            return;
        const attribute = {
            kind: "AttributeDecl",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
            typeName: typeCtx.text,
            typeRange: rangeFromContext(typeCtx),
            isEnum: false,
        };
        this.currentObject.attributes.push(attribute);
    }
    enterEnumAttribute(ctx) {
        if (!this.currentObject)
            return;
        const nameToken = ctx.ID();
        const typeToken = ctx.ENUM_ID();
        if (!nameToken || !typeToken)
            return;
        const attribute = {
            kind: "AttributeDecl",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
            typeName: typeToken.text,
            typeRange: rangeFromTokens(typeToken.symbol, typeToken.symbol),
            isEnum: true,
        };
        this.currentObject.attributes.push(attribute);
    }
    enterRelationship(ctx) {
        if (!this.currentObject)
            return;
        const ids = ctx.ID ? ctx.ID() : [];
        if (!ids || ids.length < 2)
            return;
        const target = ids[0];
        const nameToken = ids[1];
        const rel = {
            kind: "RelationshipDecl",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
            targetType: target.text,
            targetRange: rangeFromTokens(target.symbol, target.symbol),
        };
        this.currentObject.relationships.push(rel);
    }
    enterUnit(ctx) {
        const nameToken = ctx.ID();
        if (!nameToken)
            return;
        const unitDecl = {
            kind: "UnitDecl",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
            functions: [],
            variables: [],
        };
        this.ast.units.push(unitDecl);
        this.currentUnit = unitDecl;
    }
    exitUnit() {
        this.currentUnit = null;
    }
    enterFunctionSignature(ctx) {
        if (!this.currentUnit)
            return;
        const nameToken = ctx.ID ? ctx.ID() : null;
        if (!nameToken)
            return;
        const typeCtx = ctx.typeName();
        if (!typeCtx)
            return;
        const functionDecl = {
            kind: "FunctionDecl",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
            returnType: typeCtx.text,
            returnTypeRange: rangeFromContext(typeCtx),
            params: [],
            locals: [],
            unitName: this.currentUnit.name,
        };
        this.currentUnit.functions.push(functionDecl);
        this.currentFunction = functionDecl;
    }
    exitFunctionDefinition(ctx) {
        if (this.currentFunction && ctx.codeBlock) {
            const body = ctx.codeBlock();
            if (body) {
                this.currentFunction.bodyRange = rangeFromContext(body);
            }
        }
        this.currentFunction = null;
    }
    enterParameter(ctx) {
        if (!this.currentFunction)
            return;
        const nameToken = ctx.ID();
        const typeCtx = ctx.typeName();
        if (!nameToken || !typeCtx)
            return;
        this.currentFunction.params.push({
            kind: "ParamDecl",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
            typeName: typeCtx.text,
            typeRange: rangeFromContext(typeCtx),
        });
    }
    enterVariableDeclaration(ctx) {
        const nameToken = ctx.ID();
        const typeCtx = ctx.variableType();
        if (!nameToken || !typeCtx)
            return;
        const scope = this.currentFunction ? "function" : "unit";
        const variable = {
            kind: "VariableDecl",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
            declRange: rangeFromContext(ctx),
            typeName: typeCtx.text,
            typeRange: rangeFromContext(typeCtx),
            scope,
            functionName: this.currentFunction?.name,
            unitName: this.currentUnit?.name,
        };
        if (this.currentFunction) {
            this.currentFunction.locals.push(variable);
        }
        else if (this.currentUnit) {
            this.currentUnit.variables.push(variable);
        }
    }
    enterEnumeration(ctx) {
        const nameToken = ctx.ENUM_ID();
        if (!nameToken)
            return;
        const enumDecl = {
            kind: "EnumDecl",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
            values: [],
        };
        this.ast.enums.push(enumDecl);
        this.currentEnum = enumDecl;
    }
    exitEnumeration() {
        this.currentEnum = null;
    }
    enterEnumValue(ctx) {
        if (!this.currentEnum)
            return;
        const nameToken = ctx.ID();
        if (!nameToken)
            return;
        this.currentEnum.values.push({
            kind: "EnumValueDecl",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
        });
    }
    enterTypeName(ctx) {
        const idToken = ctx.ID ? ctx.ID() : null;
        const enumToken = ctx.ENUM_ID ? ctx.ENUM_ID() : null;
        const token = idToken || enumToken;
        if (!token)
            return;
        this.ast.typeReferences.push({
            kind: "TypeReference",
            name: token.text,
            nameRange: rangeFromTokens(token.symbol, token.symbol),
        });
    }
    enterFunctionCall(ctx) {
        const ids = ctx.ID ? ctx.ID() : [];
        if (!ids || ids.length === 0)
            return;
        let unitName;
        let functionToken = ids[0];
        if (ids.length > 1) {
            unitName = ids[0].text;
            functionToken = ids[1];
            if (unitName) {
                this.ast.unitReferences.push({
                    kind: "UnitReference",
                    name: unitName,
                    nameRange: rangeFromTokens(ids[0].symbol, ids[0].symbol),
                });
            }
        }
        this.ast.functionCalls.push({
            kind: "FunctionCallReference",
            name: functionToken.text,
            nameRange: rangeFromTokens(functionToken.symbol, functionToken.symbol),
            unitName,
        });
    }
    enterValueExpression(ctx) {
        const ids = ctx.ID ? ctx.ID() : [];
        if (!ids || ids.length === 0)
            return;
        let unitName;
        let variableToken = ids[0];
        if (ids.length > 1) {
            unitName = ids[0].text;
            variableToken = ids[1];
            if (unitName) {
                this.ast.unitReferences.push({
                    kind: "UnitReference",
                    name: unitName,
                    nameRange: rangeFromTokens(ids[0].symbol, ids[0].symbol),
                });
            }
        }
        this.ast.variableReferences.push({
            kind: "VariableReference",
            name: variableToken.text,
            nameRange: rangeFromTokens(variableToken.symbol, variableToken.symbol),
            unitName,
        });
    }
    enterMemberAttribute(ctx) {
        const nameToken = ctx.ID();
        if (!nameToken)
            return;
        this.ast.propertyReferences.push({
            kind: "PropertyReference",
            name: nameToken.text,
            nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
        });
    }
    enterElsePart(ctx) {
        this.ast.elseBlocks.push(rangeFromContext(ctx));
    }
}
export function buildFileAst(text, uri) {
    const MezDSLLexer = loadGenerated("MezDSLLexer");
    const MezDSLParser = loadGenerated("MezDSLParser");
    if (!MezDSLLexer || !MezDSLParser) {
        return {
            uri,
            objects: [],
            units: [],
            enums: [],
            typeReferences: [],
            unitReferences: [],
            functionCalls: [],
            variableReferences: [],
            propertyReferences: [],
            elseBlocks: [],
        };
    }
    try {
        const input = new ANTLRInputStream(text);
        const lexer = new MezDSLLexer(input);
        const tokens = new CommonTokenStream(lexer);
        const parser = new MezDSLParser(tokens);
        const tree = parser.script();
        if (!tree) {
            return {
                uri,
                objects: [],
                units: [],
                enums: [],
                typeReferences: [],
                unitReferences: [],
                functionCalls: [],
                variableReferences: [],
                propertyReferences: [],
                elseBlocks: [],
            };
        }
        const listener = new AstListener(uri);
        ParseTreeWalker.DEFAULT.walk(listener, tree);
        return listener.ast;
    }
    catch {
        return {
            uri,
            objects: [],
            units: [],
            enums: [],
            typeReferences: [],
            unitReferences: [],
            functionCalls: [],
            variableReferences: [],
            propertyReferences: [],
            elseBlocks: [],
        };
    }
}
export function rangeContains(range, line, character) {
    if (line < range.start.line || line > range.end.line)
        return false;
    if (line === range.start.line && character < range.start.character)
        return false;
    if (line === range.end.line && character > range.end.character)
        return false;
    return true;
}
