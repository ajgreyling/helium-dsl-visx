import { pushDiagnostic, LintContext } from "../engine.js";
import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { checkDotNotation } from "../../parser/dotNotation.js";
import { fileURLToPath } from "url";
import path from "node:path";
import fs from "fs";

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
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
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
          const resolvedPath = path.resolve(tryPath);
          const fileUrl = (tryPath.endsWith('.ts') || tryPath.endsWith('.js'))
            ? `file://${resolvedPath}`
            : existsJs ? `file://${resolvedPath}.js` : `file://${resolvedPath}.ts`;
          const mod = await import(fileUrl);
          if (mod) {
            const result = mod[name] || mod.default || mod;
            if (result) {
              moduleCache.set(name, mod);
              return result;
            }
          }
        } catch {
          // Silently continue to next path on import errors
        }
      }
    }
    return undefined;
  };
  
  // Try bundled path first (when packaged in extension)
  const bundledPath = path.resolve(currentDir, "../../../generated/parser/generated/grammar", name);
  const bundledResult = await tryLoad(bundledPath);
  if (bundledResult) return bundledResult;
  
  // Fallback to development path
  const devPath = path.resolve(currentDir, "../../../../generated/parser/generated/grammar", name);
  const devResult = await tryLoad(devPath);
  if (devResult) return devResult;
  
  // Fallback to sibling directory path (helium-vscode-tooling)
  const projectRoot = path.resolve(currentDir, "../../../../..");
  const toolingPath = path.resolve(projectRoot, "helium-vscode-tooling/generated/parser/generated/grammar", name);
  
  // Try siblingPath1 first (correct path from TypeScript source: src/linter/rules)
  const siblingPath1 = path.resolve(currentDir, "../../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
  const sibling1Result = await tryLoad(siblingPath1, ".ts");
  if (sibling1Result) return sibling1Result;
  
  // Try siblingPath2 (correct path from compiled output: out/src/linter/rules)
  const siblingPath2 = path.resolve(currentDir, "../../../../../helium-vscode-tooling/generated/parser/generated/grammar", name);
  const sibling2Result = await tryLoad(siblingPath2, ".ts");
  if (sibling2Result) return sibling2Result;
  
  // Try absolute path
  const absoluteResult = await tryLoad(toolingPath, ".ts");
  if (absoluteResult) return absoluteResult;
  
  // Also try the parser directory directly (not in generated/grammar subdirectory)
  const parserDirPath1 = path.resolve(currentDir, "../../../../helium-vscode-tooling/generated/parser", name);
  const parserDirResult1 = await tryLoad(parserDirPath1, ".ts");
  if (parserDirResult1) return parserDirResult1;
  
  const parserDirPath2 = path.resolve(currentDir, "../../../../../helium-vscode-tooling/generated/parser", name);
  const parserDirResult2 = await tryLoad(parserDirPath2, ".ts");
  if (parserDirResult2) return parserDirResult2;

  return undefined;
}


export async function applyDotNotationLimit(ctx: LintContext) {
  if (!ctx.rules["dot-notation-limit"]) return;

  // Load parser modules
  const MezDSLLexer = await loadGenerated("MezDSLLexer");
  const MezDSLParser = await loadGenerated("MezDSLParser");

  if (!MezDSLLexer || !MezDSLParser) {
    // Parser not available, skip this rule
    return;
  }

  try {
    // Parse the file
    const input = new ANTLRInputStream(ctx.text);
    const lexer = new MezDSLLexer(input);
    const tokens = new CommonTokenStream(lexer);
    
    // Remove default error listeners to prevent stderr logging
    lexer.removeErrorListeners();
    
    const parser = new MezDSLParser(tokens);
    parser.removeErrorListeners();
    
    let tree;
    try {
      tree = parser.script();
    } catch (parseErr) {
      // If parsing fails (syntax errors, stack overflow, etc.), don't report false positives
      if (parseErr instanceof Error && parseErr.message.includes('Maximum call stack')) {
        // Stack overflow - skip this rule
        return;
      }
      // Other parse errors - skip this rule to avoid false positives
      return;
    }

    if (!tree) {
      return;
    }

    // Check for dot notation violations using shared helper
    try {
      const diagnostics = checkDotNotation(tree);
      const message = ctx.rules["dot-notation-limit"]?.message || "Dot notation is only supported one level deep.";
      for (const diag of diagnostics) {
        pushDiagnostic(
          ctx,
          "dot-notation-limit",
          diag.line,
          diag.character,
          diag.length,
          message
        );
      }
    } catch (checkErr) {
      // If checking fails (stack overflow, etc.), don't report false positives
      if (checkErr instanceof Error && checkErr.message.includes('Maximum call stack')) {
        return;
      }
      return;
    }
  } catch (err) {
    // If anything else fails, don't report false positives
    return;
  }
}
