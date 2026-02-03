import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

type BlobSuffixes = { fname: string; mtype: string; size: string };

type LanguageMetadata = {
  keywords: string[];
  primitiveTypes: string[];
  modelBifs: string[];
  bifNamespaces: string[];
  bifFunctions: string[];
  reservedIdentifiers: string[];
  roleImplicitFields: string[];
  platformImplicitFields: string[];
  blobSuffixes: BlobSuffixes;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const grammarPath = path.join(root, "generated/grammar/MezDSL.g4");
const bifsPath = path.join(root, "generated/bifs/bif-metadata.json");
const outputPath = path.join(root, "generated/language/helium-language-metadata.json");

const DEFAULT_BUILTIN_OBJECTS_RELATIVE_PATH =
  "WebCompiler-lib/src/main/java/com/mezzanine/program/web/builder/BuiltinObjects.java";
const DEFAULT_OBJECT_BUILDER_RELATIVE_PATH =
  "WebCompiler-lib/src/main/java/com/mezzanine/program/web/builder/object/ObjectBuilder.java";

function readArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("-")) return undefined;
  return value;
}

function resolveDslCommonsPath(): string {
  const fromArgs = readArgValue("--dsl-commons");
  if (fromArgs) return path.resolve(fromArgs);

  const fromEnv = process.env.DSL_COMMONS_PATH;
  if (fromEnv) return path.resolve(fromEnv);

  throw new Error(
    [
      "No DSL commons path configured for role implicit fields extraction.",
      "",
      "Provide one of:",
      '  - CLI: "--dsl-commons <path-to-appexec-dsl-commons>"',
      "  - Env: DSL_COMMONS_PATH=<path-to-appexec-dsl-commons>",
    ].join("\n")
  );
}

function extractRuleBody(grammar: string, ruleName: string): string | null {
  const rulePattern = new RegExp(`${ruleName}\\s*:\\s*([\\s\\S]*?);`, "m");
  const match = grammar.match(rulePattern);
  return match ? match[1] : null;
}

function collectTokenLiterals(grammar: string): Map<string, string> {
  const map = new Map<string, string>();
  const tokenPattern = /^([A-Z_][A-Z0-9_]*)\s*:\s*'([^']+)'/gm;
  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(grammar)) !== null) {
    map.set(match[1], match[2]);
  }
  return map;
}

function collectWordLiterals(grammar: string): Set<string> {
  const literals = new Set<string>();
  const literalPattern = /'([^']+)'/g;
  let match: RegExpExecArray | null;
  while ((match = literalPattern.exec(grammar)) !== null) {
    const literal = match[1];
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(literal)) {
      literals.add(literal);
    }
  }
  return literals;
}

function resolveTokenLiterals(
  tokenNames: string[],
  tokenLiteralMap: Map<string, string>
): string[] {
  const values: string[] = [];
  tokenNames.forEach((tokenName) => {
    const literal = tokenLiteralMap.get(tokenName);
    if (literal) {
      values.push(literal);
    }
  });
  return values;
}

function extractRuleTokens(
  grammar: string,
  ruleName: string,
  tokenLiteralMap: Map<string, string>
): string[] {
  const body = extractRuleBody(grammar, ruleName);
  if (!body) return [];
  const tokenMatches = body.match(/\b[A-Z_][A-Z0-9_]*\b/g) || [];
  const resolved = resolveTokenLiterals(tokenMatches, tokenLiteralMap);
  return Array.from(new Set(resolved));
}

function extractJavaClassBody(src: string, className: string, fileName: string = "BuiltinObjects.java"): string {
  // Finds `class <Name>` or `static class <Name>` and returns its `{ ... }` body.
  const re = new RegExp(`\\bclass\\s+${className}\\b`);
  const m = re.exec(src);
  if (!m || m.index == null) {
    throw new Error(`Unable to find class '${className}' in ${fileName}`);
  }

  const startSearch = src.indexOf("{", m.index);
  if (startSearch === -1) {
    throw new Error(`Unable to find opening brace for class '${className}'`);
  }

  let depth = 0;
  let bodyStart = -1;
  for (let i = startSearch; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") {
      depth++;
      if (bodyStart === -1) bodyStart = i + 1;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return src.slice(bodyStart, i);
      }
    }
  }

  throw new Error(`Unable to find closing brace for class '${className}'`);
}

function extractIdentityImplicitFieldsFromBuiltinObjects(javaSource: string): string[] {
  const identityBody = extractJavaClassBody(javaSource, "Identity");

  // Map constant name -> string literal value
  const constants = new Map<string, string>();
  const constRe =
    /\bpublic\s+static\s+final\s+String\s+(ATTR_[A-Z0-9_]+)\s*=\s*"([^"]+)"\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = constRe.exec(identityBody)) !== null) {
    constants.set(m[1], m[2]);
  }

  // Capture the ATTRIBUTE_NAMES initializer and extract add(ATTR_...) calls.
  const attrNamesStart = identityBody.indexOf("ATTRIBUTE_NAMES");
  if (attrNamesStart === -1) {
    throw new Error("Unable to find Identity.ATTRIBUTE_NAMES in BuiltinObjects.java");
  }
  const attrNamesSlice = identityBody.slice(attrNamesStart, Math.min(identityBody.length, attrNamesStart + 8000));

  const adds: string[] = [];
  const addRe = /\badd\s*\(\s*(ATTR_[A-Z0-9_]+)\s*\)\s*;/g;
  while ((m = addRe.exec(attrNamesSlice)) !== null) {
    adds.push(m[1]);
  }
  if (adds.length === 0) {
    throw new Error("Unable to extract any add(ATTR_...) entries from Identity.ATTRIBUTE_NAMES");
  }

  const values = new Set<string>();
  for (const key of adds) {
    const value = constants.get(key);
    if (!value) {
      throw new Error(`Identity.ATTRIBUTE_NAMES references '${key}' but it has no string constant value`);
    }
    values.add(value);
  }

  // Only include platform implicit fields (the upstream set is already platform-defined).
  // Keep stable ordering for deterministic JSON output.
  return Array.from(values).sort();
}

function extractPlatformImplicitFieldsFromObjectBuilder(javaSource: string): string[] {
  // Extract ATTR_ID constant: public static final String ATTR_ID = "_id";
  const attrIdRe = /\bpublic\s+static\s+final\s+String\s+ATTR_ID\s*=\s*"([^"]+)";/;
  const attrIdMatch = javaSource.match(attrIdRe);
  if (!attrIdMatch) {
    throw new Error("Unable to find ObjectBuilder.ATTR_ID constant in ObjectBuilder.java");
  }
  const idValue = attrIdMatch[1];

  // Platform implicit fields for persistent objects:
  // - _id: extracted from ATTR_ID constant
  // - _tstamp: platform convention (appears in SQL schemas, not defined as constant)
  const fields = [idValue, "_tstamp"];

  // Keep stable ordering for deterministic JSON output.
  return fields.sort();
}

function extractBlobSuffixesFromObjectBuilder(javaSource: string): BlobSuffixes {
  const fnameRe = /\bpublic\s+static\s+final\s+String\s+BLOB_FILE_NAME\s*=\s*"([^"]+)";/;
  const mtypeRe = /\bpublic\s+static\s+final\s+String\s+BLOB_MIME_TYPE\s*=\s*"([^"]+)";/;
  const sizeRe = /\bpublic\s+static\s+final\s+String\s+BLOB_SIZE\s*=\s*"([^"]+)";/;
  const fnameMatch = javaSource.match(fnameRe);
  const mtypeMatch = javaSource.match(mtypeRe);
  const sizeMatch = javaSource.match(sizeRe);
  if (!fnameMatch || !mtypeMatch || !sizeMatch) {
    throw new Error(
      "Unable to find BLOB_FILE_NAME, BLOB_MIME_TYPE, or BLOB_SIZE constants in ObjectBuilder.java"
    );
  }
  return {
    fname: fnameMatch[1],
    mtype: mtypeMatch[1],
    size: sizeMatch[1],
  };
}

async function main() {
  if (!(await fs.pathExists(grammarPath))) {
    throw new Error(`Grammar file not found: ${grammarPath}`);
  }

  const grammar = await fs.readFile(grammarPath, "utf8");
  const tokenLiteralMap = collectTokenLiterals(grammar);

  const wordLiterals = collectWordLiterals(grammar);
  const keywords = Array.from(wordLiterals).filter(
    (literal) => literal === literal.toLowerCase()
  );

  const primitiveTypes = extractRuleTokens(grammar, "primitiveType", tokenLiteralMap);

  const modelBifs = [
    ...extractRuleTokens(grammar, "persistenceBIFStatement", tokenLiteralMap),
    ...extractRuleTokens(grammar, "persistenceBIFExpression", tokenLiteralMap),
    ...extractRuleTokens(grammar, "simpleSelectorBIF", tokenLiteralMap),
    ...extractRuleTokens(grammar, "selectorBIF", tokenLiteralMap),
  ];

  const bifNamespaces: string[] = [];
  const bifFunctions: string[] = [];
  if (await fs.pathExists(bifsPath)) {
    const bifData = await fs.readJson(bifsPath);
    const namespaces = bifData?.namespaces || {};
    Object.keys(namespaces).forEach((ns) => {
      bifNamespaces.push(ns);
      const entries = namespaces[ns] as Array<{ name: string }>;
      entries.forEach((entry) => {
        bifFunctions.push(`${ns}:${entry.name}`);
      });
    });
  }

  const reservedIdentifiers = Array.from(
    new Set([...keywords, ...primitiveTypes, ...modelBifs])
  );

  const dslCommonsPath = resolveDslCommonsPath();
  const builtinObjectsPath = path.join(dslCommonsPath, DEFAULT_BUILTIN_OBJECTS_RELATIVE_PATH);
  if (!(await fs.pathExists(builtinObjectsPath))) {
    throw new Error(
      [
        `BuiltinObjects.java not found: ${builtinObjectsPath}`,
        "",
        "If you passed --dsl-commons / DSL_COMMONS_PATH, expected file at:",
        `  ${DEFAULT_BUILTIN_OBJECTS_RELATIVE_PATH}`,
      ].join("\n")
    );
  }
  const builtinObjectsSrc = await fs.readFile(builtinObjectsPath, "utf8");
  const roleImplicitFields = extractIdentityImplicitFieldsFromBuiltinObjects(builtinObjectsSrc);

  const objectBuilderPath = path.join(dslCommonsPath, DEFAULT_OBJECT_BUILDER_RELATIVE_PATH);
  if (!(await fs.pathExists(objectBuilderPath))) {
    throw new Error(
      [
        `ObjectBuilder.java not found: ${objectBuilderPath}`,
        "",
        "If you passed --dsl-commons / DSL_COMMONS_PATH, expected file at:",
        `  ${DEFAULT_OBJECT_BUILDER_RELATIVE_PATH}`,
      ].join("\n")
    );
  }
  const objectBuilderSrc = await fs.readFile(objectBuilderPath, "utf8");
  const platformImplicitFields = extractPlatformImplicitFieldsFromObjectBuilder(objectBuilderSrc);
  const blobSuffixes = extractBlobSuffixesFromObjectBuilder(objectBuilderSrc);

  const metadata: LanguageMetadata = {
    keywords: keywords.sort(),
    primitiveTypes: Array.from(new Set(primitiveTypes)).sort(),
    modelBifs: Array.from(new Set(modelBifs)).sort(),
    bifNamespaces: Array.from(new Set(bifNamespaces)).sort(),
    bifFunctions: Array.from(new Set(bifFunctions)).sort(),
    reservedIdentifiers: reservedIdentifiers.sort(),
    roleImplicitFields,
    platformImplicitFields,
    blobSuffixes,
  };

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeJson(outputPath, metadata, { spaces: 2 });
  console.log(`Wrote language metadata to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
