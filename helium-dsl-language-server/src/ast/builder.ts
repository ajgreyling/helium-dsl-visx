import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker.js";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext.js";
import {
  FileAst,
  ObjectDecl,
  UnitDecl,
  FunctionDecl,
  VariableDecl,
  EnumDecl,
  AttributeDecl,
  RelationshipDecl,
} from "./nodes.js";

// Re-export FileAst for tests
export type { FileAst } from "./nodes.js";
import { rangeFromContext, rangeFromTokens, SourceRange } from "./span.js";
import { fileURLToPath } from "url";
import path from "node:path";
import fs from "fs";

const DEBUG_LOG_PATH = "/Users/ajgreyling/code/helium-dsl-visx/.cursor/debug.log";

function debugLog(location: string, message: string, data: any, hypothesisId: string) {
  try {
    const logEntry = {
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId,
    };
    const logLine = JSON.stringify(logEntry) + "\n";
    fs.appendFileSync(DEBUG_LOG_PATH, logLine);
    // Also log to console for debugging
    console.error(`[DEBUG] ${location}: ${message}`, JSON.stringify(data));
  } catch (err) {
    console.error(`[DEBUG LOG ERROR] ${err instanceof Error ? err.message : String(err)}`);
  }
}

// Note: We don't register ts-node here because we're using --loader ts-node/esm
// which handles TypeScript files directly via the ESM loader.
// Registering ts-node/register would use require() internally and conflict with import()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared module cache (shared with parser/index.ts via global)
declare global {
  // eslint-disable-next-line no-var
  var __heliumParserModuleCache: Map<string, any> | undefined;
}
if (!global.__heliumParserModuleCache) {
  global.__heliumParserModuleCache = new Map<string, any>();
}
const moduleCache = global.__heliumParserModuleCache;

async function loadGenerated(name: string): Promise<any | undefined> {
  // Check cache first
  if (moduleCache.has(name)) {
    const cached = moduleCache.get(name);
    if (cached) {
      return cached[name] || cached;
    }
  }
  // Use __dirname which is already set from import.meta.url
  const currentDir = __dirname;
  // Only log if not in cache (to reduce noise)
  if (!moduleCache.has(name)) {
    console.error("[DEBUG] loadGenerated called for", name, "from dir", currentDir);
  }
  
  // Helper function to try loading a module from a path using dynamic import()
  const tryLoad = async (modulePath: string, withExtension?: string): Promise<any | undefined> => {
    const pathsToTry = withExtension 
      ? [modulePath + withExtension, modulePath]
      : [modulePath];
    
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/146b1551-6c81-48d6-ae92-7f21748a9524',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'builder.ts:107',message:'tryLoad entry',data:{name,modulePath,withExtension,pathsToTry},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    for (const tryPath of pathsToTry) {
      const exists = fs.existsSync(tryPath + ".ts") || fs.existsSync(tryPath + ".js") || fs.existsSync(tryPath);
      // Only log if file exists (to reduce noise from non-existent paths)
      if (exists) {
        console.error("[DEBUG] Trying path:", tryPath, "exists:", exists);
      }
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/146b1551-6c81-48d6-ae92-7f21748a9524',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'builder.ts:115',message:'Before import attempt',data:{tryPath,exists,hasTsExtension:tryPath.endsWith('.ts')},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      if (exists) {
        try {
          // In ESM mode, use import() directly to avoid mixing require() and import()
          // which causes "imported again after being required" errors
          const resolvedPath = path.resolve(tryPath);
          const fileUrl = (tryPath.endsWith('.ts') || tryPath.endsWith('.js'))
            ? `file://${resolvedPath}`
            : `file://${resolvedPath}.ts`;
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/146b1551-6c81-48d6-ae92-7f21748a9524',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'builder.ts:143',message:'Attempting import (ESM mode)',data:{fileUrl,tryPath},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix5',hypothesisId:'K'})}).catch(()=>{});
          // #endregion
          const mod = await import(fileUrl);
          // #region agent log
          const modKeys = mod ? Object.keys(mod).slice(0, 10) : [];
          const hasNameExport = mod && (mod[name] !== undefined);
          const modType = mod ? (mod.constructor?.name || typeof mod) : 'null';
          fetch('http://127.0.0.1:7244/ingest/146b1551-6c81-48d6-ae92-7f21748a9524',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'builder.ts:149',message:'import succeeded',data:{tryPath,hasMod:!!mod,name,hasNameExport,modKeys,modType},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix5',hypothesisId:'K'})}).catch(()=>{});
          // #endregion
          if (mod) {
            const result = mod[name] || mod;
            // #region agent log
            fetch('http://127.0.0.1:7244/ingest/146b1551-6c81-48d6-ae92-7f21748a9524',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'builder.ts:155',message:'Checking module export',data:{tryPath,name,hasNameExport,resultType:result ? (result.constructor?.name || typeof result) : 'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix5',hypothesisId:'K'})}).catch(()=>{});
            // #endregion
            if (result) {
              console.error("[DEBUG] Successfully loaded from:", tryPath, "via import()");
              // Cache the module for future use
              moduleCache.set(name, mod);
              return result;
            }
          }
        } catch (importError) {
          const importErrorMsg = importError instanceof Error ? importError.message : String(importError);
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/146b1551-6c81-48d6-ae92-7f21748a9524',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'builder.ts:163',message:'import failed',data:{tryPath,error:importErrorMsg.substring(0,150)},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix6',hypothesisId:'L'})}).catch(()=>{});
          // #endregion
          // Suppress "Cannot require() ES Module" errors - these occur when a module was already touched
          // by require() (e.g., by ts-node internally). We'll try other paths which may succeed.
          // Only log if it's not the expected "require/import conflict" error
          const isRequireConflict = importErrorMsg.includes("Cannot require() ES Module") || 
                                   importErrorMsg.includes("imported again after being required");
          if (!isRequireConflict && tryPath.includes('helium-vscode-tooling')) {
            console.error("[DEBUG] Failed to load from:", tryPath, "error:", importErrorMsg.substring(0, 100));
          }
        }
      }
    }
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/146b1551-6c81-48d6-ae92-7f21748a9524',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'builder.ts:140',message:'tryLoad exhausted all paths',data:{name,modulePath},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    return undefined;
  };
  
  // Try bundled path first (when packaged in extension)
  const bundledPath = path.resolve(currentDir, "../../generated/parser/generated/grammar", name);
  const bundledResult = await tryLoad(bundledPath);
  if (bundledResult) return bundledResult;
  
  // Fallback to development path
  const devPath = path.resolve(currentDir, "../../../generated/parser/generated/grammar", name);
  const devResult = await tryLoad(devPath);
  if (devResult) return devResult;
  
  // Fallback to sibling directory path (helium-vscode-tooling)
  // From src/ast: ../../../helium-vscode-tooling/...
  // From out/src/ast: ../../../../helium-vscode-tooling/...
  // Try both paths to handle both ts-node (source) and compiled (out) contexts
  
  // Calculate absolute path to project root to ensure correct resolution
  const projectRoot = path.resolve(currentDir, "../../../..");
  const toolingPath = path.resolve(projectRoot, "helium-vscode-tooling/generated/parser/generated/grammar", name);
  
  // Try siblingPath1 first (correct path from TypeScript source: src/ast)
  const siblingPath1 = path.resolve(currentDir, "../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
  const sibling1Result = await tryLoad(siblingPath1, ".ts");
  if (sibling1Result) return sibling1Result;
  
  // Try siblingPath2 (correct path from compiled output: out/src/ast)
  const siblingPath2 = path.resolve(currentDir, "../../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
  const sibling2Result = await tryLoad(siblingPath2, ".ts");
  if (sibling2Result) return sibling2Result;
  
  // Try absolute path
  const absoluteResult = await tryLoad(toolingPath, ".ts");
  if (absoluteResult) return absoluteResult;
  
  // Also try the parser directory directly (not in generated/grammar subdirectory)
  const parserDirPath1 = path.resolve(currentDir, "../../../helium-vscode-tooling/generated/parser", name);
  const parserDirResult1 = await tryLoad(parserDirPath1, ".ts");
  if (parserDirResult1) return parserDirResult1;
  
  const parserDirPath2 = path.resolve(currentDir, "../../../../helium-vscode-tooling/generated/parser", name);
  const parserDirResult2 = await tryLoad(parserDirPath2, ".ts");
  if (parserDirResult2) return parserDirResult2;

  console.error("[DEBUG] Failed to load", name, "from any path");
  return undefined;
}

class AstListener {
  public ast: FileAst;
  private currentUnit: UnitDecl | null = null;
  private currentFunction: FunctionDecl | null = null;
  private currentObject: ObjectDecl | null = null;
  private currentEnum: EnumDecl | null = null;
  private persistentDepth = 0;
  public tokenStream: any = null; // Store token stream for accessing tokens by index

  constructor(uri: string) {
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

  // Catch-all method to verify walker is calling methods
  enterEveryRule(ctx: ParserRuleContext) {
    // #region agent log
    const ruleName = ctx.constructor.name;
    console.error("[DEBUG LISTENER] enterEveryRule called", ruleName);
    // Log specific rules we care about
    if (ruleName.includes("SimpleObject") || ruleName.includes("Unit") || ruleName.includes("Enumeration") || 
        ruleName.includes("CustomObject") || ruleName.includes("PersistenceElement") || ruleName.includes("Persistence")) {
      console.error("[DEBUG LISTENER] Important rule entered:", ruleName, "text:", ctx.text?.substring(0, 100));
    }
    // #endregion
  }

  exitEveryRule(ctx: ParserRuleContext) {
    // #region agent log
    const ruleName = ctx.constructor.name;
    console.error("[DEBUG LISTENER] exitEveryRule called", ruleName);
    // #endregion
  }

  enterPersistentObject(_ctx: ParserRuleContext) {
    // #region agent log
    debugLog("builder.ts:117", "enterPersistentObject called", { ctxType: _ctx?.constructor?.name }, "C");
    // #endregion
    this.persistentDepth += 1;
  }

  exitPersistentObject(_ctx: ParserRuleContext) {
    this.persistentDepth = Math.max(0, this.persistentDepth - 1);
  }

  enterPersistenceElement(ctx: any) {
    console.error("[DEBUG LISTENER] enterPersistenceElement called", ctx?.constructor?.name);
    // This is called for persistence elements (objects, validators, enums)
    // We don't need to do anything here, just log it
  }

  enterCustomObject(ctx: any) {
    console.error("[DEBUG LISTENER] enterCustomObject called", ctx?.constructor?.name);
    // This is called for customObject (which contains simpleObject or persistentObject)
    // We don't need to do anything here, just log it
  }

  enterSimpleObject(ctx: any) {
    // #region agent log
    console.error("[DEBUG LISTENER] enterSimpleObject called", ctx?.constructor?.name, "hasId:", !!ctx?.ID);
    // Check the start and stop tokens to see the actual token range
    let startToken: any = null;
    let stopToken: any = null;
    let tokenStreamInfo: any = null;
    try {
      if (ctx && ctx.start && ctx.stop) {
        startToken = { text: ctx.start.text, type: ctx.start.type, line: ctx.start.line, charPositionInLine: ctx.start.charPositionInLine };
        stopToken = { text: ctx.stop.text, type: ctx.stop.type, line: ctx.stop.line, charPositionInLine: ctx.stop.charPositionInLine };
        // Get the token stream and check tokens around the start
        if (ctx && ctx.parser && ctx.parser.inputStream) {
          const tokens: any[] = [];
          const startIndex = ctx.start.tokenIndex;
          for (let i = Math.max(0, startIndex - 2); i <= Math.min(startIndex + 10, ctx.stop.tokenIndex); i++) {
            const token = ctx.parser.inputStream.get(i);
            if (token) {
              tokens.push({ index: i, text: token.text, type: token.type, isID: token.type === 258 });
            }
          }
          tokenStreamInfo = tokens;
        }
      }
    } catch (err) {
      console.error("[DEBUG] Error inspecting tokens:", err);
    }
    debugLog("builder.ts:190", "enterSimpleObject called", { ctxType: ctx?.constructor?.name, hasId: !!ctx?.ID, uri: this.ast.uri, startToken, stopToken, tokenStreamInfo, ctxText: ctx?.text?.substring(0, 100) }, "B");
    // #endregion
    
    // FIX: ctx.ID() returns the first ID token in the context, which might be from nested rules
    // We need the ID token that comes right after "object" keyword
    // The object name should be at startToken.tokenIndex + 1
    let nameToken = ctx.ID();
    // #region agent log
    debugLog("builder.ts:253", "enterSimpleObject: checking token stream", { uri: this.ast.uri, hasTokenStream: !!this.tokenStream, hasStart: !!ctx.start, startTokenIndex: ctx.start?.tokenIndex, startTokenText: ctx.start?.text, nameTokenText: nameToken?.text }, "B");
    // #endregion
    if (nameToken && ctx.start && this.tokenStream) {
      try {
        // The start token is "object" keyword. The object name should be the next token after it.
        // If start.tokenIndex is -1, we need to find the token by looking at the start token's position
        let objectNameTokenIndex: number | undefined = undefined;
        if (ctx.start.tokenIndex !== undefined && ctx.start.tokenIndex >= 0) {
          objectNameTokenIndex = ctx.start.tokenIndex + 1;
        } else {
          // If tokenIndex is -1, try to find the token by scanning from the start
          // The start token text is "object", so the next non-whitespace token should be the object name
          const allTokens = this.tokenStream.getTokens();
          for (let i = 0; i < allTokens.length - 1; i++) {
            if (allTokens[i].text === "object") {
              // Find the next non-whitespace token (skip whitespace)
              for (let j = i + 1; j < allTokens.length; j++) {
                const token = allTokens[j];
                // Skip whitespace tokens (type 265 or channel HIDDEN)
                if (token.type !== 265 && token.channel !== 1) {
                  objectNameTokenIndex = j;
                  // #region agent log
                  debugLog("builder.ts:272", "enterSimpleObject: found object name token after object", { uri: this.ast.uri, tokenIndex: j, tokenText: token.text, tokenType: token.type }, "B");
                  // #endregion
                  break;
                }
              }
              break;
            }
          }
        }
        
        if (objectNameTokenIndex !== undefined) {
          const actualObjectNameToken = this.tokenStream.get(objectNameTokenIndex);
          // #region agent log
          debugLog("builder.ts:259", "enterSimpleObject: got token from stream", { uri: this.ast.uri, tokenIndex: objectNameTokenIndex, tokenText: actualObjectNameToken?.text, tokenType: actualObjectNameToken?.type }, "B");
          // #endregion
          if (actualObjectNameToken) {
            // Use the token from the stream - it's the object name (regardless of token type)
            nameToken = { text: actualObjectNameToken.text, symbol: actualObjectNameToken };
            // #region agent log
            debugLog("builder.ts:267", "enterSimpleObject: using corrected nameToken from token stream", { uri: this.ast.uri, correctedName: nameToken.text, originalName: ctx.ID()?.text, tokenIndex: objectNameTokenIndex, tokenType: actualObjectNameToken.type }, "B");
            // #endregion
          }
        }
      } catch (err) {
        // #region agent log
        debugLog("builder.ts:273", "enterSimpleObject: error accessing token stream", { uri: this.ast.uri, error: err instanceof Error ? err.message : String(err) }, "B");
        // #endregion
      }
    }
    
    if (!nameToken) {
      // #region agent log
      debugLog("builder.ts:195", "enterSimpleObject: no nameToken", { uri: this.ast.uri }, "B");
      // #endregion
      console.error("[DEBUG LISTENER] enterSimpleObject: no nameToken found");
      return;
    }
    // #region agent log
    debugLog("builder.ts:200", "enterSimpleObject: nameToken found", { uri: this.ast.uri, nameTokenText: nameToken.text, nameTokenSymbol: nameToken.symbol?.text, nameTokenType: nameToken.symbol?.type, nameTokenIndex: nameToken.symbol?.tokenIndex }, "B");
    // #endregion
    console.error("[DEBUG LISTENER] enterSimpleObject: creating object", nameToken.text);
    const objectDecl: ObjectDecl = {
      kind: "ObjectDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      isPersistent: this.persistentDepth > 0,
      attributes: [],
      relationships: [],
    };
    this.ast.objects.push(objectDecl);
    this.currentObject = objectDecl;
    // #region agent log
    debugLog("builder.ts:210", "Object added to AST", { uri: this.ast.uri, objectName: nameToken.text, isPersistent: this.persistentDepth > 0, totalObjects: this.ast.objects.length }, "B");
    // #endregion
    console.error("[DEBUG LISTENER] enterSimpleObject: object added, total objects:", this.ast.objects.length);
  }

  exitSimpleObject() {
    this.currentObject = null;
  }

  enterPrimitiveAttribute(ctx: any) {
    if (!this.currentObject) return;
    const nameToken = ctx.ID();
    const typeCtx = ctx.primitiveType();
    if (!nameToken || !typeCtx) return;
    const attribute: AttributeDecl = {
      kind: "AttributeDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      typeName: typeCtx.text,
      typeRange: rangeFromContext(typeCtx),
      isEnum: false,
    };
    this.currentObject.attributes.push(attribute);
  }

  enterEnumAttribute(ctx: any) {
    if (!this.currentObject) return;
    const nameToken = ctx.ID();
    const typeToken = ctx.ENUM_ID();
    if (!nameToken || !typeToken) return;
    const attribute: AttributeDecl = {
      kind: "AttributeDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      typeName: typeToken.text,
      typeRange: rangeFromTokens(typeToken.symbol, typeToken.symbol),
      isEnum: true,
    };
    this.currentObject.attributes.push(attribute);
  }

  enterRelationship(ctx: any) {
    if (!this.currentObject) return;
    const ids = ctx.ID ? ctx.ID() : [];
    if (!ids || ids.length < 2) return;
    const target = ids[0];
    const nameToken = ids[1];
    const rel: RelationshipDecl = {
      kind: "RelationshipDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      targetType: target.text,
      targetRange: rangeFromTokens(target.symbol, target.symbol),
    };
    this.currentObject.relationships.push(rel);
  }

  enterUnit(ctx: any) {
    // #region agent log
    console.error("[DEBUG LISTENER] enterUnit called", ctx?.constructor?.name, "hasId:", !!ctx?.ID);
    debugLog("builder.ts:260", "enterUnit called", { ctxType: ctx?.constructor?.name, hasId: !!ctx?.ID, uri: this.ast.uri }, "B");
    // #endregion
    const nameToken = ctx.ID();
    if (!nameToken) {
      // #region agent log
      debugLog("builder.ts:265", "enterUnit: no nameToken", { uri: this.ast.uri }, "B");
      // #endregion
      console.error("[DEBUG LISTENER] enterUnit: no nameToken found");
      return;
    }
    console.error("[DEBUG LISTENER] enterUnit: creating unit", nameToken.text);
    const unitDecl: UnitDecl = {
      kind: "UnitDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      functions: [],
      variables: [],
    };
    this.ast.units.push(unitDecl);
    this.currentUnit = unitDecl;
    // #region agent log
    debugLog("builder.ts:280", "Unit added to AST", { uri: this.ast.uri, unitName: nameToken.text, totalUnits: this.ast.units.length }, "B");
    // #endregion
    console.error("[DEBUG LISTENER] enterUnit: unit added, total units:", this.ast.units.length);
  }

  exitUnit() {
    this.currentUnit = null;
  }

  enterFunctionSignature(ctx: any) {
    if (!this.currentUnit) return;
    const nameToken = ctx.ID ? ctx.ID() : null;
    if (!nameToken) return;
    const typeCtx = ctx.typeName();
    if (!typeCtx) return;
    const functionDecl: FunctionDecl = {
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

  exitFunctionDefinition(ctx: any) {
    if (this.currentFunction && ctx.codeBlock) {
      const body = ctx.codeBlock();
      if (body) {
        this.currentFunction.bodyRange = rangeFromContext(body);
      }
    }
    this.currentFunction = null;
  }

  enterParameter(ctx: any) {
    if (!this.currentFunction) return;
    const nameToken = ctx.ID();
    const typeCtx = ctx.typeName();
    if (!nameToken || !typeCtx) return;
    this.currentFunction.params.push({
      kind: "ParamDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      typeName: typeCtx.text,
      typeRange: rangeFromContext(typeCtx),
    });
  }

  enterVariableDeclaration(ctx: any) {
    const nameToken = ctx.ID();
    const typeCtx = ctx.variableType();
    if (!nameToken || !typeCtx) return;
    const scope: VariableDecl["scope"] = this.currentFunction ? "function" : "unit";
    const variable: VariableDecl = {
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
    } else if (this.currentUnit) {
      this.currentUnit.variables.push(variable);
    }
  }

  enterEnumeration(ctx: any) {
    // #region agent log
    console.error("[DEBUG LISTENER] enterEnumeration called", ctx?.constructor?.name, "hasEnumId:", !!ctx?.ENUM_ID);
    debugLog("builder.ts:348", "enterEnumeration called", { ctxType: ctx?.constructor?.name, hasEnumId: !!ctx?.ENUM_ID, uri: this.ast.uri }, "B");
    // #endregion
    const nameToken = ctx.ENUM_ID();
    if (!nameToken) {
      // #region agent log
      debugLog("builder.ts:353", "enterEnumeration: no nameToken", { uri: this.ast.uri }, "B");
      // #endregion
      console.error("[DEBUG LISTENER] enterEnumeration: no nameToken found");
      return;
    }
    console.error("[DEBUG LISTENER] enterEnumeration: creating enum", nameToken.text);
    const enumDecl: EnumDecl = {
      kind: "EnumDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      values: [],
    };
    this.ast.enums.push(enumDecl);
    this.currentEnum = enumDecl;
    // #region agent log
    debugLog("builder.ts:368", "Enum added to AST", { uri: this.ast.uri, enumName: nameToken.text, totalEnums: this.ast.enums.length }, "B");
    // #endregion
    console.error("[DEBUG LISTENER] enterEnumeration: enum added, total enums:", this.ast.enums.length);
  }

  exitEnumeration() {
    this.currentEnum = null;
  }

  enterEnumValue(ctx: any) {
    if (!this.currentEnum) return;
    const nameToken = ctx.ID();
    if (!nameToken) return;
    this.currentEnum.values.push({
      kind: "EnumValueDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
    });
  }

  enterTypeName(ctx: any) {
    const idToken = ctx.ID ? ctx.ID() : null;
    const enumToken = ctx.ENUM_ID ? ctx.ENUM_ID() : null;
    const token = idToken || enumToken;
    if (!token) return;
    this.ast.typeReferences.push({
      kind: "TypeReference",
      name: token.text,
      nameRange: rangeFromTokens(token.symbol, token.symbol),
    });
  }

  enterFunctionCall(ctx: any) {
    const ids = ctx.ID ? ctx.ID() : [];
    if (!ids || ids.length === 0) return;
    let unitName: string | undefined;
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

  enterValueExpression(ctx: any) {
    const ids = ctx.ID ? ctx.ID() : [];
    if (!ids || ids.length === 0) return;
    let unitName: string | undefined;
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

  enterMemberAttribute(ctx: any) {
    const nameToken = ctx.ID();
    if (!nameToken) return;
    this.ast.propertyReferences.push({
      kind: "PropertyReference",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
    });
  }

  enterElsePart(ctx: any) {
    this.ast.elseBlocks.push(rangeFromContext(ctx));
  }
}

export async function buildFileAst(text: string, uri: string): Promise<FileAst> {
  // #region agent log
  // Force write to verify function is called with new code
  // UNIQUE ID: AST_FIX_2025_01_17_VER3
  console.error("[BUILDFILEAST_CALLED_VER3]", uri, "text length:", text.length);
  if (uri.includes("TestObject")) {
    console.error("[TEST_OBJECT_DETECTED]", uri);
  }
  try {
    // Ensure directory exists
    const logDir = path.dirname(DEBUG_LOG_PATH);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const entryLog = JSON.stringify({location:"builder.ts:526",message:"buildFileAst entry",data:{uri,textLength:text.length,textPreview:text.substring(0,200)},timestamp:Date.now(),sessionId:"debug-session",runId:"run1",hypothesisId:"A"}) + "\n";
    fs.appendFileSync(DEBUG_LOG_PATH, entryLog);
    console.error("[DEBUG FILE WRITE] Successfully wrote to", DEBUG_LOG_PATH);
  } catch (err) {
    console.error("[DEBUG LOG ERROR]", err instanceof Error ? err.message : String(err), "Path:", DEBUG_LOG_PATH);
  }
  debugLog("builder.ts:505", "buildFileAst entry", { uri, textLength: text.length, textPreview: text.substring(0, 200) }, "A");
  // #endregion
  const MezDSLLexer = await loadGenerated("MezDSLLexer");
  const MezDSLParser = await loadGenerated("MezDSLParser");

  // #region agent log
  debugLog("builder.ts:514", "Parser/lexer loaded", { hasLexer: !!MezDSLLexer, hasParser: !!MezDSLParser, lexerType: MezDSLLexer?.name, parserType: MezDSLParser?.name }, "A");
  debugLog("builder.ts:514", "Parser/lexer loaded check", { hasLexer: !!MezDSLLexer, hasParser: !!MezDSLParser }, "E");
  // #endregion

  if (!MezDSLLexer || !MezDSLParser) {
    // #region agent log
    debugLog("builder.ts:520", "Early return - parser/lexer not loaded", { uri }, "E");
    // #endregion
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
    // #region agent log
    debugLog("builder.ts:538", "Before parsing", { uri, textLength: text.length }, "B");
    // #endregion
    const input = new ANTLRInputStream(text);
    const lexer = new MezDSLLexer(input);
    const tokens = new CommonTokenStream(lexer);
    tokens.fill(); // Fill token stream so token indices are available
    const parser = new MezDSLParser(tokens);
    const tree = parser.script();
    // #region agent log
    debugLog("builder.ts:545", "Parser tree result", { treeIsNull: !tree, treeType: tree?.constructor?.name, treeChildCount: tree?.childCount, treeText: tree?.text?.substring(0, 200) }, "B");
    debugLog("builder.ts:545", "Parser tree result check", { treeIsNull: !tree, treeType: tree?.constructor?.name }, "D");
    // #endregion
    if (!tree) {
      // #region agent log
      debugLog("builder.ts:551", "Early return - tree is null", { uri }, "D");
      // #endregion
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
    listener.tokenStream = tokens; // Store token stream for listener to access
    // #region agent log
    const listenerMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(listener)).filter(m => m.startsWith('enter') || m.startsWith('exit'));
    const treeRuleIndex = (tree as any)?.ruleIndex;
    const treeText = (tree as any)?.text;
    const treeChildCount = (tree as any)?.childCount;
    debugLog("builder.ts:570", "Before walker", { uri, listenerMethodCount: listenerMethods.length, listenerMethods: listenerMethods.slice(0, 10) }, "B");
    // #endregion
    
    // Manually inspect tree structure - write to file since console might be suppressed
    const inspection = {
      ruleIndex: treeRuleIndex,
      childCount: treeChildCount,
      text: treeText?.substring(0, 300),
      treeType: tree?.constructor?.name,
      children: [] as any[]
    };
    
    // Try to manually walk the tree
    if (treeChildCount > 0) {
      for (let i = 0; i < Math.min(treeChildCount, 5); i++) {
        const child = (tree as any)?.getChild(i);
        inspection.children.push({
          index: i,
          type: child?.constructor?.name,
          ruleIndex: child?.ruleIndex,
          text: child?.text?.substring(0, 100)
        });
      }
    }
    
    debugLog("builder.ts:tree-inspection", "Tree structure", inspection, "D");
    
    debugLog("builder.ts:419", "Before ParseTreeWalker.walk", { uri, listenerMethods, treeRuleIndex, treeChildCount, treeText: treeText?.substring(0, 200) }, "C");
    // #endregion
    
    // Try calling walker
    try {
      // #region agent log
      debugLog("builder.ts:580", "Before walker call", { uri }, "B");
      // #endregion
      ParseTreeWalker.DEFAULT.walk(listener as any, tree);
      console.error("[DEBUG] Walker completed without error");
      // #region agent log
      debugLog("builder.ts:584", "After walker call", { uri, objectsCount: listener.ast.objects.length, unitsCount: listener.ast.units.length, enumsCount: listener.ast.enums.length }, "B");
      debugLog("builder.ts:584", "After walker call check", { uri, objectsCount: listener.ast.objects.length, unitsCount: listener.ast.units.length, enumsCount: listener.ast.enums.length }, "C");
      // #endregion
    } catch (walkErr) {
      // #region agent log
      debugLog("builder.ts:588", "Walker error", { uri, error: walkErr instanceof Error ? walkErr.message : String(walkErr) }, "C");
      // #endregion
      console.error("[DEBUG] Walker error:", walkErr);
    }
    // #region agent log
    debugLog("builder.ts:592", "Final AST result", { 
      uri, 
      objects: listener.ast.objects.length, 
      units: listener.ast.units.length, 
      enums: listener.ast.enums.length,
      objectsList: listener.ast.objects.map(o => o.name),
      unitsList: listener.ast.units.map(u => u.name),
      enumsList: listener.ast.enums.map(e => e.name)
    }, "C");
    // #endregion
    return listener.ast;
  } catch (err) {
    // #region agent log
    debugLog("builder.ts:598", "Exception caught", { uri, error: err instanceof Error ? err.message : String(err), stack: err instanceof Error ? err.stack?.substring(0, 500) : undefined }, "C");
    // #endregion
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

export function rangeContains(range: SourceRange, line: number, character: number): boolean {
  if (line < range.start.line || line > range.end.line) return false;
  if (line === range.start.line && character < range.start.character) return false;
  if (line === range.end.line && character > range.end.character) return false;
  return true;
}
