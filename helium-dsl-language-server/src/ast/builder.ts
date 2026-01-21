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
  TriggerScope,
} from "./nodes.js";

// Re-export FileAst for tests
export type { FileAst } from "./nodes.js";
import { rangeFromContext, rangeFromTokens, SourceRange } from "./span.js";
import { fileURLToPath } from "url";
import path from "node:path";
import fs from "fs";

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
  
  // Helper function to try loading a module from a path using dynamic import()
  const tryLoad = async (modulePath: string, withExtension?: string): Promise<any | undefined> => {
    const pathsToTry = withExtension 
      ? [modulePath + withExtension, modulePath]
      : [modulePath];
    
    for (const tryPath of pathsToTry) {
      const existsTs = fs.existsSync(tryPath + ".ts");
      const existsJs = fs.existsSync(tryPath + ".js");
      const exists = existsTs || existsJs || fs.existsSync(tryPath);
      if (exists) {
        try {
          // In ESM mode, use import() directly to avoid mixing require() and import()
          // which causes "imported again after being required" errors
          const resolvedPath = path.resolve(tryPath);
          const fileUrl = (tryPath.endsWith('.ts') || tryPath.endsWith('.js'))
            ? `file://${resolvedPath}`
            : existsJs ? `file://${resolvedPath}.js` : `file://${resolvedPath}.ts`;
          const mod = await import(fileUrl);
          if (mod) {
            const result = mod[name] || mod.default || mod;
            if (result) {
              // Cache the module for future use
              moduleCache.set(name, mod);
              return result;
            }
          }
        } catch (importError) {
          // Suppress "Cannot require() ES Module" errors - these occur when a module was already touched
          // by require() (e.g., by ts-node internally). We'll try other paths which may succeed.
          // Silently continue to next path on import errors
        }
      }
    }
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

  console.error(`[HeliumDSL] Failed to load generated parser module "${name}"`);
  return undefined;
}

class AstListener {
  public ast: FileAst;
  private currentUnit: UnitDecl | null = null;
  private currentFunction: FunctionDecl | null = null;
  private currentObject: ObjectDecl | null = null;
  private currentEnum: EnumDecl | null = null;
  private persistentDepth = 0;
  private inForEachLoop: boolean = false;
  private pendingFunctionAnnotations: string[] = [];
  public tokenStream: any = null; // Store token stream for accessing tokens by index
  public tokenFillSucceeded: boolean = false; // Whether tokens.fill() succeeded

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
      triggerScopes: [],
      elseBlocks: [],
    };
  }

  private recordTriggerScope(scopeName: TriggerScope["scopeName"], ctx: any) {
    if (!this.currentObject) return;
    const block = ctx?.codeBlock?.();
    if (!block) return;
    this.ast.triggerScopes.push({
      kind: "TriggerScope",
      scopeName,
      objectName: this.currentObject.name,
      codeBlockRange: rangeFromContext(block),
    });
  }

  // Catch-all method to verify walker is calling methods
  enterEveryRule(ctx: ParserRuleContext) {
    // Keep null check to prevent crashes
    if (!ctx) {
      return;
    }
  }

  exitEveryRule(ctx: ParserRuleContext) {
    // No-op - kept for interface compliance
  }

  enterPersistentObject(ctx: any) {
    this.persistentDepth += 1;
    
    // Backup: Try to extract object name from persistentObject context
    // This is a fallback in case enterSimpleObject fails
    // The persistentObject rule contains a simpleObject child, so we can try to find the ID there
    // Note: This runs before enterSimpleObject, so we store the extracted name and let enterSimpleObject use it
    // or we can add it here as a backup if enterSimpleObject fails
    if (ctx && ctx.children) {
      // Look for simpleObject child
      for (const child of ctx.children) {
        if (child && typeof child.getText === 'function') {
          // Check if this child has an ID() method (simpleObject should)
          try {
            const idTokens = child.ID ? child.ID() : null;
            if (idTokens) {
              const idToken = Array.isArray(idTokens) ? idTokens[0] : idTokens;
              if (idToken && idToken.text) {
                const objectName = idToken.text.trim();
                // Store this for potential use by enterSimpleObject
                // We'll let enterSimpleObject handle the actual object creation to avoid duplicates
                // This is just a backup in case enterSimpleObject completely fails
              }
            }
          } catch (err) {
            // Ignore errors - enterSimpleObject will handle it
          }
        }
      }
    }
  }

  exitPersistentObject(_ctx: ParserRuleContext) {
    this.persistentDepth = Math.max(0, this.persistentDepth - 1);
  }

  enterPersistenceElement(ctx: any) {
    // This is called for persistence elements (objects, validators, enums)
    // We don't need to do anything here
  }

  enterCustomObject(ctx: any) {
    // This is called for customObject (which contains simpleObject or persistentObject)
    // We don't need to do anything here
  }

  enterSimpleObject(ctx: any) {
    // FIX: ctx.ID() returns the first ID token in the context, which might be from nested rules
    // We need the ID token that comes right after "object" keyword
    // The object name should be at startToken.tokenIndex + 1
    let nameToken = ctx.ID();
    const isPersistent = this.persistentDepth > 0;
    
    // Only try to use token stream if fill() succeeded - otherwise use ctx.ID() directly
    if (nameToken && ctx.start && this.tokenStream && this.tokenFillSucceeded) {
      try {
        // The start token is "object" keyword. The object name should be the next non-whitespace token after it.
        // Always skip whitespace tokens to find the actual object name
        let objectNameTokenIndex: number | undefined = undefined;
        const allTokens = this.tokenStream.getTokens();
        
        // Find the "object" token first
        let objectTokenIndex: number | undefined = undefined;
        if (ctx.start.tokenIndex !== undefined && ctx.start.tokenIndex >= 0) {
          objectTokenIndex = ctx.start.tokenIndex;
        } else {
          // If tokenIndex is -1, scan for "object" token
          // When inside persistentObject, we need to find the "object" token that comes after "persistent"
          for (let i = 0; i < allTokens.length; i++) {
            if (allTokens[i].text === "object") {
              // If we're in a persistent context, verify this "object" comes after "persistent"
              if (isPersistent) {
                // Check if there's a "persistent" token before this "object" token
                let foundPersistent = false;
                for (let k = i - 1; k >= 0; k--) {
                  const prevToken = allTokens[k];
                  // Skip whitespace
                  if (prevToken.type !== 265 && prevToken.channel !== 1) {
                    if (prevToken.text === "persistent") {
                      foundPersistent = true;
                      break;
                    } else {
                      // If we hit a non-whitespace token that's not "persistent", this isn't the right "object"
                      break;
                    }
                  }
                }
                if (foundPersistent) {
                  objectTokenIndex = i;
                  break;
                }
              } else {
                objectTokenIndex = i;
                break;
              }
            }
          }
        }
        
        // Now find the next non-whitespace token after "object"
        if (objectTokenIndex !== undefined) {
          for (let j = objectTokenIndex + 1; j < allTokens.length; j++) {
            const token = allTokens[j];
            // Skip whitespace tokens (type 265 or channel HIDDEN)
            if (token.type !== 265 && token.channel !== 1) {
              objectNameTokenIndex = j;
              break;
            }
          }
        }
        
        if (objectNameTokenIndex !== undefined) {
          const actualObjectNameToken = this.tokenStream.get(objectNameTokenIndex);
          if (actualObjectNameToken) {
            // Use the token from the stream - it's the object name (regardless of token type)
            nameToken = { text: actualObjectNameToken.text, symbol: actualObjectNameToken };
          }
        }
      } catch (err) {
        // Ignore token stream errors - fall back to ctx.ID()
        console.error(`[AST] Token stream error in enterSimpleObject:`, err instanceof Error ? err.message : String(err));
      }
    }
    
    // Fallback: if nameToken is still null and we have token stream, try to find ID token manually
    if (!nameToken && ctx.start && this.tokenStream && this.tokenFillSucceeded) {
      try {
        const allTokens = this.tokenStream.getTokens();
        let objectTokenIndex: number | undefined = undefined;
        
        // Find "object" token (accounting for "persistent" prefix if needed)
        for (let i = 0; i < allTokens.length; i++) {
          if (allTokens[i].text === "object") {
            if (isPersistent) {
              // Verify "persistent" comes before "object"
              let foundPersistent = false;
              for (let k = i - 1; k >= 0; k--) {
                const prevToken = allTokens[k];
                if (prevToken.type !== 265 && prevToken.channel !== 1) {
                  if (prevToken.text === "persistent") {
                    foundPersistent = true;
                    break;
                  } else {
                    break;
                  }
                }
              }
              if (foundPersistent) {
                objectTokenIndex = i;
                break;
              }
            } else {
              objectTokenIndex = i;
              break;
            }
          }
        }
        
        // Find ID token after "object"
        if (objectTokenIndex !== undefined) {
          for (let j = objectTokenIndex + 1; j < allTokens.length; j++) {
            const token = allTokens[j];
            if (token.type !== 265 && token.channel !== 1) {
              // Check if this looks like an identifier (starts with letter/underscore, contains alphanumeric)
              const tokenText = token.text || "";
              if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(tokenText)) {
                nameToken = { text: tokenText, symbol: token };
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error(`[AST] Fallback token stream search failed:`, err instanceof Error ? err.message : String(err));
      }
    }
    
    // Final fallback: try to get ID from child contexts if ctx.ID() failed
    if (!nameToken && ctx.children) {
      for (const child of ctx.children) {
        if (child && typeof child.getText === 'function') {
          const childText = child.getText();
          // Look for ID tokens in children
          if (child.constructor?.name?.includes('IdContext') || 
              (childText && /^[A-Za-z_][A-Za-z0-9_]*$/.test(childText) && childText !== "object" && childText !== "persistent")) {
            // Try to get the actual token
            if (child.start && child.stop && child.start === child.stop) {
              nameToken = { text: childText, symbol: child.start };
              break;
            }
          }
        }
      }
    }
    
    if (!nameToken) {
      console.error(`[AST] enterSimpleObject: Failed to extract object name, isPersistent=${isPersistent}`);
      return;
    }
    
    // Validate that nameToken.text is not just whitespace
    if (!nameToken.text || nameToken.text.trim().length === 0) {
      console.error(`[AST] enterSimpleObject: nameToken.text is empty or whitespace`);
      return;
    }
    
    const objectName = nameToken.text.trim();
    
    // Check for duplicates (in case enterPersistentObject backup handler already added it)
    const existing = this.ast.objects.find(obj => obj.name === objectName);
    if (existing) {
      this.currentObject = existing;
      return;
    }
    
    const objectDecl: ObjectDecl = {
      kind: "ObjectDecl",
      name: objectName,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      isPersistent: isPersistent,
      attributes: [],
      relationships: [],
    };
    this.ast.objects.push(objectDecl);
    this.currentObject = objectDecl;
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
    // Grammar: relationship : multiplicityAnnotation objID=ID nameID=ID (VIA aliasID=ID)?;
    // Prefer labeled tokens if present; fall back to ctx.ID() ordering.
    const ids = ctx.ID ? ctx.ID() : [];
    const target = ctx.objID ?? ids?.[0];
    const nameToken = ctx.nameID ?? ids?.[1];
    const aliasToken = ctx.aliasID ?? ids?.[2];
    if (!target || !nameToken) return;
    const rel: RelationshipDecl = {
      kind: "RelationshipDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      targetType: target.text,
      targetRange: rangeFromTokens(target.symbol, target.symbol),
    };

    if (aliasToken && aliasToken.text) {
      rel.viaName = aliasToken.text;
      rel.viaRange = rangeFromTokens(aliasToken.symbol, aliasToken.symbol);
    }
    this.currentObject.relationships.push(rel);
  }

  enterUnit(ctx: any) {
    const nameToken = ctx.ID();
    if (!nameToken) {
      return;
    }
    const unitDecl: UnitDecl = {
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

  private normalizeFunctionAnnotation(raw: string): string | null {
    const trimmed = (raw ?? "").trim();
    if (!trimmed) return null;
    // Typically looks like "@Scheduled(\"...\")" or "@POST(\"/path\")"
    const withoutAt = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
    const paren = withoutAt.indexOf("(");
    const name = (paren === -1 ? withoutAt : withoutAt.slice(0, paren)).trim();
    if (!name) return null;
    // Strip any trailing punctuation in pathological cases
    return name.replace(/[^A-Za-z0-9_]+$/g, "");
  }

  enterFunctionDefinition(_ctx: any) {
    // Reset at the start of each functionDefinition to avoid leaking annotations between functions.
    this.pendingFunctionAnnotations = [];
  }

  enterFunctionAnnotation(ctx: any) {
    const text = typeof ctx?.getText === "function" ? ctx.getText() : "";
    const n = this.normalizeFunctionAnnotation(text);
    if (n) this.pendingFunctionAnnotations.push(n);
  }

  private collectFunctionAnnotationsFromTokens(ctx: any): string[] {
    if (!this.tokenStream || !this.tokenFillSucceeded) return [];
    const startIdx: number | undefined = ctx?.start?.tokenIndex;
    if (typeof startIdx !== "number" || startIdx <= 0) return [];

    let allTokens: any[] = [];
    try {
      allTokens = this.tokenStream.getTokens?.() ?? [];
    } catch {
      return [];
    }
    if (!Array.isArray(allTokens) || allTokens.length === 0) return [];

    const isDefaultChannel = (t: any) => (t?.channel ?? 0) === 0;

    // Find a boundary token before the signature so we only scan the immediate prefix.
    // We stop at common statement/block boundaries.
    let boundary = startIdx - 1;
    while (boundary >= 0) {
      const t = allTokens[boundary];
      if (!isDefaultChannel(t)) {
        boundary--;
        continue;
      }
      if (t.text === ";" || t.text === "{" || t.text === "}") break;
      boundary--;
    }

    const from = boundary + 1;
    const to = startIdx - 1;
    if (from > to) return [];

    const names: string[] = [];
    let parenDepth = 0;

    for (let i = from; i <= to; i++) {
      const t = allTokens[i];
      if (!isDefaultChannel(t)) continue;
      const txt: string = t?.text ?? "";

      if (txt === "(") {
        parenDepth++;
        continue;
      }
      if (txt === ")") {
        parenDepth = Math.max(0, parenDepth - 1);
        continue;
      }

      if (parenDepth === 0 && txt === "@") {
        // Next default-channel token is the annotation name (e.g. Scheduled, POST, ReceiveSMS).
        let k = i + 1;
        while (k <= to && !isDefaultChannel(allTokens[k])) k++;
        const nameTok = allTokens[k];
        if (nameTok?.text) {
          const normalized = this.normalizeFunctionAnnotation(String(nameTok.text));
          if (normalized) names.push(normalized);
        }
      }
    }

    return names;
  }

  enterFunctionSignature(ctx: any) {
    if (!this.currentUnit) return;
    const nameToken = ctx.ID ? ctx.ID() : null;
    if (!nameToken) return;
    const typeCtx = ctx.typeName();
    if (!typeCtx) return;

    // Best-effort: Prefer listener-captured annotations, but fall back to token-stream scanning.
    // (Some parser/walker environments may skip enterFunctionAnnotation callbacks.)
    const annotationsFromTokens = this.collectFunctionAnnotationsFromTokens(ctx);
    const mergedAnnotations = [
      ...(this.pendingFunctionAnnotations || []),
      ...annotationsFromTokens,
    ];
    const uniqueAnnotations = Array.from(new Set(mergedAnnotations)).filter(Boolean);

    const functionDecl: FunctionDecl = {
      kind: "FunctionDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      returnType: typeCtx.text,
      returnTypeRange: rangeFromContext(typeCtx),
      params: [],
      locals: [],
      unitName: this.currentUnit.name,
      annotations: uniqueAnnotations.length > 0 ? uniqueAnnotations : undefined,
    };
    this.currentUnit.functions.push(functionDecl);
    this.currentFunction = functionDecl;
    this.pendingFunctionAnnotations = [];
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
      isForeachLoopVariable: this.inForEachLoop,
    };
    if (this.currentFunction) {
      this.currentFunction.locals.push(variable);
    } else if (this.currentUnit) {
      this.currentUnit.variables.push(variable);
    }
  }

  enterEnumeration(ctx: any) {
    const nameToken = ctx.ENUM_ID();
    if (!nameToken) {
      return;
    }
    const enumDecl: EnumDecl = {
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

  private recordPseudoscopeMemberAccess(ids: any[]) {
    if (!ids || ids.length < 2) return;
    const receiverToken = ids[0];
    const memberToken = ids[1];
    const receiverName = receiverToken?.text;
    const memberName = memberToken?.text;
    if (!receiverName || !memberName) return;
    if (receiverName !== "before" && receiverName !== "after") return;

    // Represent `before.foo` / `after.bar` as a PropertyReference so usage tracking can
    // map it onto the owning persistent object via triggerScopes.
    this.ast.propertyReferences.push({
      kind: "PropertyReference",
      name: memberName,
      nameRange: rangeFromTokens(memberToken.symbol, memberToken.symbol),
      receiverName,
      receiverRange: rangeFromTokens(receiverToken.symbol, receiverToken.symbol),
    });
  }

  enterAssignStatement(ctx: any) {
    const access = ctx?.accessExpression?.();
    if (!access) return;

    const ids = access.ID ? access.ID() : [];
    if (!ids || ids.length === 0) return;

    // `accessExpression` can be:
    // - ID
    // - ID ('.' ID)+
    // - ID ':' ID
    // - ID ':' ID ('.' ID)+
    //
    // For variable-resolution purposes, we treat the assignment target as:
    // - plain/dotted: base variable = first ID
    // - unit-qualified: variable = second ID, unit = first ID
    let unitName: string | undefined;
    let variableToken = ids[0];

    const hasColon = Array.isArray(access.children)
      ? access.children.some((c: any) => (typeof c?.getText === "function") && c.getText() === ":")
      : false;

    if (hasColon && ids.length >= 2) {
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

    // Pseudoscope member assignment should count as property usage:
    // `before.created_at = ...` / `after.archived = ...`
    if (!hasColon) {
      this.recordPseudoscopeMemberAccess(ids);
    }
  }

  enterMemberAttribute(ctx: any) {
    const nameToken = ctx.ID();
    if (!nameToken) return;
    let receiverName: string | undefined;
    let receiverRange: SourceRange | undefined;

    // Best-effort: look backward in the token stream for `receiver . <thisProperty>`
    if (this.tokenStream && this.tokenFillSucceeded && nameToken.symbol?.tokenIndex != null) {
      try {
        const allTokens = this.tokenStream.getTokens();
        const propertyTokenIndex: number = nameToken.symbol.tokenIndex;

        const isDefaultChannel = (t: any) => (t?.channel ?? 0) === 0;

        // Find the dot immediately before this property token.
        let dotIndex = -1;
        for (let i = propertyTokenIndex - 1; i >= 0; i--) {
          const t = allTokens[i];
          if (!isDefaultChannel(t)) continue;
          if (t.text === ".") {
            dotIndex = i;
            break;
          }
          // If we hit another identifier or delimiter before '.', give up (not a simple member access).
          if (t.text && /[A-Za-z0-9_]/.test(t.text[0])) break;
          if (t.text && /[;(){}[\],]/.test(t.text)) break;
        }

        if (dotIndex !== -1) {
          // Find receiver identifier before dot.
          for (let i = dotIndex - 1; i >= 0; i--) {
            const t = allTokens[i];
            if (!isDefaultChannel(t)) continue;
            if (t.text && /^[A-Za-z_][A-Za-z0-9_]*$/.test(t.text)) {
              receiverName = t.text;
              receiverRange = rangeFromTokens(t, t);
              break;
            }
            if (t.text && /[;(){}[\],]/.test(t.text)) break;
          }
        }
      } catch {
        // Ignore token stream issues; property ref will still be recorded without receiver.
      }
    }

    this.ast.propertyReferences.push({
      kind: "PropertyReference",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      receiverName,
      receiverRange,
    });
  }

  enterAccessExpression(ctx: any) {
    // Count pseudoscope reads like `before.created_at` as property references too.
    // Assignments are handled in `enterAssignStatement`, but reads appear as bare accessExpression
    // nodes within expressions.
    const ids = ctx?.ID ? ctx.ID() : [];
    if (!ids || ids.length < 2) return;

    const hasColon = Array.isArray(ctx.children)
      ? ctx.children.some((c: any) => (typeof c?.getText === "function") && c.getText() === ":")
      : false;
    if (hasColon) return;

    this.recordPseudoscopeMemberAccess(ids);
  }

  enterBeforeCreate(ctx: any) {
    this.recordTriggerScope("before", ctx);
  }
  enterBeforeUpdate(ctx: any) {
    this.recordTriggerScope("before", ctx);
  }
  enterBeforeDelete(ctx: any) {
    this.recordTriggerScope("before", ctx);
  }

  enterAfterCreate(ctx: any) {
    this.recordTriggerScope("after", ctx);
  }
  enterAfterUpdate(ctx: any) {
    this.recordTriggerScope("after", ctx);
  }
  enterAfterDelete(ctx: any) {
    this.recordTriggerScope("after", ctx);
  }

  enterCatchPart(ctx: any) {
    if (!this.currentFunction) return;
    const nameToken = ctx?.ID?.();
    if (!nameToken) return;

    // Helium DSL catch blocks don't declare a type (`catch(ex)`), but we still want
    // the identifier to participate in local-variable resolution.
    const variable: VariableDecl = {
      kind: "VariableDecl",
      name: nameToken.text,
      nameRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      declRange: rangeFromContext(ctx),
      typeName: "any",
      typeRange: rangeFromTokens(nameToken.symbol, nameToken.symbol),
      scope: "function",
      functionName: this.currentFunction.name,
      unitName: this.currentUnit?.name,
      isForeachLoopVariable: false,
      isCatchVariable: true,
    };

    this.currentFunction.locals.push(variable);
  }

  enterElsePart(ctx: any) {
    this.ast.elseBlocks.push(rangeFromContext(ctx));
  }

  enterForEach(_ctx: any) {
    this.inForEachLoop = true;
  }

  exitForEach(_ctx: any) {
    this.inForEachLoop = false;
  }
}

export async function buildFileAst(text: string, uri: string): Promise<FileAst> {
  const MezDSLLexer = await loadGenerated("MezDSLLexer");
  const MezDSLParser = await loadGenerated("MezDSLParser");

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
      triggerScopes: [],
      elseBlocks: [],
    };
  }

  try {
    const input = new ANTLRInputStream(text);
    const lexer = new MezDSLLexer(input);
    const tokens = new CommonTokenStream(lexer);
    // Try to fill token stream, but don't fail if it causes stack overflow
    // The parser can work with lazy tokenization, and we only need fill() for token index access
    let tokenFillSucceeded = false;
    try {
      tokens.fill(); // Fill token stream so token indices are available
      tokenFillSucceeded = true;
    } catch (fillErr) {
      if (fillErr instanceof Error && fillErr.message.includes('Maximum call stack')) {
        console.error("[DEBUG] Token stream fill failed with stack overflow for:", uri, "- continuing with lazy tokenization");
        // Continue without filling - parser will tokenize lazily
        // tokenStream will be set but getTokens()/get() may not work for all tokens
        tokenFillSucceeded = false;
      } else {
        throw fillErr;
      }
    }
    const parser = new MezDSLParser(tokens);
    // Remove default error listeners to prevent stderr logging
    lexer.removeErrorListeners();
    parser.removeErrorListeners();
    let tree;
    try {
      tree = parser.script();
    } catch (parseErr) {
      if (parseErr instanceof Error && parseErr.message.includes('Maximum call stack')) {
        console.error("[DEBUG] Parser failed with stack overflow for:", uri);
        // Return empty AST if parsing fails with stack overflow
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
          triggerScopes: [],
          elseBlocks: [],
        };
      }
      throw parseErr;
    }
    
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
        triggerScopes: [],
        elseBlocks: [],
      };
    }
    
    const listener = new AstListener(uri);
    listener.tokenStream = tokens; // Store token stream for listener to access
    listener.tokenFillSucceeded = tokenFillSucceeded; // Track if fill succeeded
    
    // Validate tree structure - check for nodes with undefined ruleContext
    // ParseTreeWalker.enterRule calls ctx.enterRule(listener) where ctx = r.ruleContext
    // If ruleContext is undefined, this will fail
    function validateTree(node: any, depth: number = 0, path: string = 'root'): { valid: boolean; issues: string[] } {
      const issues: string[] = [];
      if (!node) {
        return { valid: true, issues }; // Null nodes are handled by walker
      }
      
      // TerminalNodes don't have ruleContext - this is expected, skip validation
      const isTerminalNode = node.constructor?.name === 'TerminalNode';
      if (isTerminalNode) {
        // TerminalNodes are handled by visitTerminal, not enterRule
        // Skip validation but still check children if any
        // (TerminalNodes typically don't have children, but be safe)
        if (depth < 5 && (node as any).childCount > 0) {
          for (let i = 0; i < Math.min((node as any).childCount, 20); i++) {
            const child = (node as any).getChild?.(i);
            if (child) {
              const childValidation = validateTree(child, depth + 1, `${path}[${i}]`);
              if (!childValidation.valid) {
                issues.push(...childValidation.issues);
              }
            }
          }
        }
        return { valid: issues.length === 0, issues };
      }
      
      // ErrorNodes don't have ruleContext - this is expected when there are parse errors, skip validation
      const isErrorNode = node.constructor?.name === 'ErrorNode' || node.constructor?.name === 'ErrorNodeImpl';
      if (isErrorNode) {
        // ErrorNodes are created by ANTLR4 when it encounters syntax errors
        // They don't have ruleContext because they represent invalid syntax, not valid parse tree nodes
        // Skip validation but still check children if any
        if (depth < 5 && (node as any).childCount > 0) {
          for (let i = 0; i < Math.min((node as any).childCount, 20); i++) {
            const child = (node as any).getChild?.(i);
            if (child) {
              const childValidation = validateTree(child, depth + 1, `${path}[${i}]`);
              if (!childValidation.valid) {
                issues.push(...childValidation.issues);
              }
            }
          }
        }
        return { valid: issues.length === 0, issues };
      }
      
      // Check if node has ruleContext (required by ParseTreeWalker.enterRule)
      const ruleContext = (node as any).ruleContext;
      if (ruleContext === undefined && depth === 0) {
        // Root node might not have ruleContext directly, check if it's a RuleNode
        const hasRuleIndex = (node as any).ruleIndex !== undefined;
        if (!hasRuleIndex) {
          issues.push(`Root node ${node.constructor?.name} missing ruleIndex`);
        }
      } else if (ruleContext === undefined && depth > 0) {
        issues.push(`Node at ${path} (${node.constructor?.name}) has undefined ruleContext`);
      } else if (ruleContext && typeof ruleContext.enterRule !== 'function') {
        issues.push(`Node at ${path} has ruleContext but enterRule is not a function`);
      }
      
      // Recursively check children (limit depth to avoid infinite recursion)
      if (depth < 5 && (node as any).childCount > 0) {
        for (let i = 0; i < Math.min((node as any).childCount, 20); i++) {
          const child = (node as any).getChild?.(i);
          if (child) {
            const childValidation = validateTree(child, depth + 1, `${path}[${i}]`);
            if (!childValidation.valid) {
              issues.push(...childValidation.issues);
            }
          }
        }
      }
      
      return { valid: issues.length === 0, issues };
    }
    
    const treeValidation = validateTree(tree);
    // Tree validation runs silently - issues would be caught by tests or error handling
    
    // Create a custom walker wrapper to catch which node causes the error
    // We'll intercept the walker's enterRule call to see which node fails
    const originalWalk = ParseTreeWalker.DEFAULT.walk.bind(ParseTreeWalker.DEFAULT);
    // CRITICAL: Bind originalEnterRule BEFORE we replace it, otherwise we'll bind the replaced method!
    const originalEnterRule = (ParseTreeWalker.DEFAULT as any).enterRule.bind(ParseTreeWalker.DEFAULT);
    const walkerProxy = {
      walk: (listener: any, tree: any) => {
        // Create a wrapper around enterRule to catch the failing node
        const stats = { skippedCount: 0, processedCount: 0 };
        (ParseTreeWalker.DEFAULT as any).enterRule = function(listener: any, r: any) {
          try {
            const ctx = r?.ruleContext;
            if (!ctx) {
              stats.skippedCount++;
              return; // Skip nodes without ruleContext
            }
            if (typeof ctx.enterRule !== 'function') {
              return;
            }
            stats.processedCount++;
            return originalEnterRule(listener, r);
          } catch (err) {
            console.error("[DEBUG] Walker enterRule error:", {
              error: err instanceof Error ? err.message : String(err),
              nodeType: r?.constructor?.name,
              nodeRuleIndex: r?.ruleIndex,
              hasRuleContext: !!r?.ruleContext
            });
            throw err;
          }
        };
        try {
          return originalWalk(listener, tree);
        } finally {
          // Restore original enterRule
          (ParseTreeWalker.DEFAULT as any).enterRule = originalEnterRule;
        }
      }
    };
    
    // Wrap listener in a proxy to catch what ParseTreeWalker is trying to access
    const listenerProxy = new Proxy(listener, {
      get(target, prop) {
        if (prop === undefined) {
          return undefined;
        }
        const value = (target as any)[prop];
        return value;
      }
    });
    
    // Try calling walker - keep minimal logging for current "enterRule" error
    try {
      // Walker wrapper will handle nodes without ruleContext (TerminalNodes)
      walkerProxy.walk(listenerProxy as any, tree);
    } catch (walkErr) {
      if (walkErr instanceof Error && walkErr.message.includes('Maximum call stack')) {
        console.error("[DEBUG] Walker failed with stack overflow for:", uri);
        // Return AST as-is (may be partially populated) if walker fails with stack overflow
        return listener.ast;
      }
      console.error("[DEBUG] Walker error:", walkErr instanceof Error ? walkErr.message : String(walkErr));
      console.error("[DEBUG] Walker error stack:", walkErr instanceof Error ? walkErr.stack : undefined);
      // Log detailed listener structure when error occurs
      const listenerProto = Object.getPrototypeOf(listener);
      const listenerMethods = Object.getOwnPropertyNames(listenerProto).filter(m => m.startsWith('enter') || m.startsWith('exit'));
      console.error("[DEBUG] Listener state on error:", { 
        listenerType: listener?.constructor?.name, 
        hasListener: !!listener,
        listenerIsObject: typeof listener === 'object',
        listenerProto: listenerProto?.constructor?.name,
        listenerMethods,
        hasEnterEveryRule: typeof listener.enterEveryRule === 'function',
        hasExitEveryRule: typeof listener.exitEveryRule === 'function',
        listenerKeys: Object.keys(listener),
        listenerProtoKeys: Object.keys(listenerProto)
      });
    }
    return listener.ast;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    
    if (errorMsg.includes('Maximum call stack')) {
      console.error("[DEBUG] Stack overflow in buildFileAst for:", uri, "- This may indicate a grammar issue or very deep nesting");
    } else {
      console.error("[DEBUG] Exception in buildFileAst:", errorMsg);
    }
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
      triggerScopes: [],
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
