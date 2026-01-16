import path from "node:path";
import fs from "fs-extra";

type LanguageMetadata = {
  keywords: string[];
  primitiveTypes: string[];
  modelBifs: string[];
  bifNamespaces: string[];
  bifFunctions: string[];
  reservedIdentifiers: string[];
};

const root = path.resolve(__dirname, "..");
const grammarPath = path.join(root, "generated/grammar/MezDSL.g4");
const bifsPath = path.join(root, "generated/bifs/bif-metadata.json");
const outputPath = path.join(root, "generated/language/helium-language-metadata.json");

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

  const metadata: LanguageMetadata = {
    keywords: keywords.sort(),
    primitiveTypes: Array.from(new Set(primitiveTypes)).sort(),
    modelBifs: Array.from(new Set(modelBifs)).sort(),
    bifNamespaces: Array.from(new Set(bifNamespaces)).sort(),
    bifFunctions: Array.from(new Set(bifFunctions)).sort(),
    reservedIdentifiers: reservedIdentifiers.sort(),
  };

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeJson(outputPath, metadata, { spaces: 2 });
  console.log(`Wrote language metadata to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
