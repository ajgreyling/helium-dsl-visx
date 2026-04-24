import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const grammarPath = path.join(root, "generated/grammar/MezDSL.g4");
const bifMetaPath = path.join(root, "generated/bifs/bif-metadata.json");
const languageMetaPath = path.join(root, "generated/language/helium-language-metadata.json");
const output = path.join(root, "generated/syntaxes/helium-dsl.tmLanguage.json");
const vxmlXsdPath = path.join(root, "assets", "vxml", "View.xsd");
const vxmlOutput = path.join(root, "generated/syntaxes/helium-vxml.tmLanguage.json");
const vxmlInjectOutput = path.join(root, "generated/syntaxes/helium-vxml-inject.tmLanguage.json");

type LanguageMetadata = {
  keywords?: string[];
  primitiveTypes?: string[];
};

// Keep this list intentionally small to avoid over-highlighting method-like keywords
// (e.g. collection operations) that exist as tokens in the grammar.
const CONTROL_KEYWORDS = [
  "unit",
  "persistent",
  "object",
  "enum",
  "validator",
  "if",
  "else",
  "for",
  "foreach",
  "return",
  "try",
  "catch",
  "finally",
  "throw",
  "via",
];

function escapeRegex(lit: string): string {
  return lit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toAlternation(values: Iterable<string>): string {
  return Array.from(values)
    .filter(Boolean)
    // Prefer longer-first to avoid partial matches when values overlap
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex)
    .join("|");
}

async function main() {
  if (!(await fs.pathExists(grammarPath))) {
    throw new Error(`Missing grammar: ${grammarPath}`);
  }

  const grammar = await fs.readFile(grammarPath, "utf8");
  const languageMeta: LanguageMetadata = (await fs.pathExists(languageMetaPath))
    ? await fs.readJson(languageMetaPath)
    : {};

  const primitiveTypes = (languageMeta.primitiveTypes ?? []).filter(Boolean);
  if (primitiveTypes.length === 0) {
    throw new Error(
      [
        "Missing primitive types for TextMate generation.",
        `Expected ${languageMetaPath} to exist and contain primitiveTypes[].`,
        "Run: npm run build:language",
      ].join("\n")
    );
  }

  const keywordSet = new Set<string>(
    CONTROL_KEYWORDS.filter((kw) => (languageMeta.keywords ?? []).includes(kw))
  );

  const bifMeta = (await fs.pathExists(bifMetaPath))
    ? await fs.readJson(bifMetaPath)
    : { namespaces: {} };

  const bifNamespacesFromMeta = Object.keys(bifMeta.namespaces ?? {});
  const bifNamespaces = Array.from(new Set(bifNamespacesFromMeta));

  // Note: User-defined types are now handled dynamically via semantic tokens
  // (provided by the language server based on the current workspace's model folder).
  // We no longer extract types from a test project at build time.

  // Build patterns array
  // Order matters: more specific patterns should come before more general ones
  const patterns: any[] = [
    { include: "#comments" },
    { include: "#strings" },
    // Numbers must come before operators to avoid matching digits in operators
    { include: "#numbers" },
    // Language constants (true, false, null) must come before keywords
    { include: "#language-constants" },
    {
      name: "keyword.control",
      match: `\\b(${Array.from(keywordSet).join("|")})\\b`,
    },
  ];

  // Add system types pattern
  patterns.push({
    name: "storage.type",
    match: `\\b(${primitiveTypes.join("|")})\\b`,
  });

  // Add object definition patterns (must come before user-defined types to catch definitions)
  // Pattern for persistent object definitions
  patterns.push({
    name: "meta.object.definition.persistent.helium",
    begin: "\\b(persistent)\\s+(object)\\s+",
    end: "\\s*\\{",
    beginCaptures: {
      1: {
        name: "storage.modifier",
      },
      2: {
        name: "keyword.control",
      },
    },
    endCaptures: {
      0: {
        name: "punctuation.definition.block.begin",
      },
    },
    patterns: [
      {
        name: "entity.name.type",
        match: "\\b([A-Za-z_][a-zA-Z0-9_]*)\\b",
      },
    ],
  });

  // Pattern for non-persistent object definitions
  patterns.push({
    name: "meta.object.definition.helium",
    begin: "\\b(object)\\s+",
    end: "\\s*\\{",
    beginCaptures: {
      1: {
        name: "keyword.control",
      },
    },
    endCaptures: {
      0: {
        name: "punctuation.definition.block.begin",
      },
    },
    patterns: [
      {
        name: "entity.name.type",
        match: "\\b([A-Za-z_][a-zA-Z0-9_]*)\\b",
      },
    ],
  });

  // Note: User-defined types are handled via semantic tokens (dynamic, workspace-based)
  // rather than static TextMate patterns. This allows highlighting to adapt to each
  // workspace's model folder without regenerating the grammar.

  // Add unit definition pattern (must come before enum patterns)
  // Use support.class for unit definitions to match unit references
  patterns.push({
    name: "meta.unit.definition.helium",
    begin: "\\b(unit)\\s+",
    end: "\\s*;",
    beginCaptures: {
      1: {
        name: "keyword.control",
      },
    },
    endCaptures: {
      0: {
        name: "punctuation.terminator",
      },
    },
    patterns: [
      {
        name: "support.class", // Use support.class scope for units
        match: "\\b([A-Z][A-Za-z0-9_]*)\\b",
      },
    ],
  });

  // Add enum definition pattern (must come before function patterns)
  patterns.push({
    name: "meta.enum.definition.helium",
    begin: "\\b(enum)\\s+",
    end: "\\s*\\{",
    beginCaptures: {
      1: {
        name: "keyword.control",
      },
    },
    endCaptures: {
      0: {
        name: "punctuation.definition.block.begin",
      },
    },
    patterns: [
      {
        name: "entity.name.type.enum",
        match: "\\b([A-Z_][A-Z0-9_]*)\\b",
      },
    ],
  });

  // Add function definition pattern (must come before variable patterns)
  patterns.push({
    name: "meta.function.definition.helium",
    begin: `\\b(${primitiveTypes.join("|")})\\s+([a-z_][a-zA-Z0-9_]*)\\s*\\(`,
    end: "\\)\\s*\\{",
    beginCaptures: {
      1: {
        name: "storage.type",
      },
      2: {
        name: "entity.name.function",
      },
    },
    endCaptures: {
      0: {
        name: "punctuation.definition.block.begin",
      },
    },
    patterns: [
      { include: "#function-parameters" },
    ],
  });

  // Add variable declaration pattern (must come after function patterns)
  patterns.push({
    name: "meta.variable.declaration.helium",
    match: `\\b(${primitiveTypes.join("|")})\\s+([a-z_][a-zA-Z0-9_]*)\\b`,
    captures: {
      1: {
        name: "storage.type",
      },
      2: {
        name: "variable.other",
      },
    },
  });

  // Add BIF function calls (e.g., Mez:now, sql:query, String:concat, Math:sqrt)
  // Use standard support.function.builtin scope for cross-theme compatibility
  // Must come before unit reference pattern so BIFs are matched first (TextMate uses first-match wins)
  patterns.push({
    name: "support.function.builtin",
    match: `\\b(${bifNamespaces.join("|")}):[a-zA-Z_][a-zA-Z0-9_]*\\b`,
  });

  // Add unit reference pattern (e.g., SomeUnit:someFunction() or SomeUnit:someVar)
  // Must come after BIF pattern but exclude BIF namespaces via negative lookahead
  // Matches PascalCase identifiers (units) followed by colon and identifier (function or variable)
  // Uses lookahead to match even when followed by ( or other punctuation
  // Use support.class for unit names (units are like classes/modules) - more widely supported
  // Use support.function for methods in unit references - distinct from entity.name.function
  const bifNamespacesRegex = bifNamespaces.map(ns => ns.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  patterns.push({
    name: "meta.unit.reference.helium",
    match: `\\b(?!(?:${bifNamespacesRegex}):)([A-Z][A-Za-z0-9_]*):([a-zA-Z_][a-zA-Z0-9_]*)(?=\\s*[;(,=)]|\\s*$|\\s*[^a-zA-Z0-9_])`,
    captures: {
      1: {
        name: "support.class", // Unit name - use support.class for better theme support
      },
      2: {
        name: "support.function", // Function or variable name - use support.function for better theme support
      },
    },
  });

  // Add operators (must come after numbers and strings)
  patterns.push({ include: "#operators" });

  // Add punctuation (must come after other patterns to avoid conflicts)
  patterns.push({ include: "#punctuation" });

  const tmLanguage = {
    $schema: "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    name: "Helium Rapid DSL (ANTLR4)",
    scopeName: "source.helium-dsl",
    patterns,
    repository: {
      comments: {
        patterns: [
          { name: "comment.line.double-slash", match: "//.*$" },
          { name: "comment.block", begin: "/\\*", end: "\\*/" },
        ],
      },
      strings: {
        patterns: [
          { name: "string.quoted.double", begin: '"', end: '"', patterns: [{ include: "#escapes" }] },
          { name: "string.quoted.block", begin: "/%", end: "%/" },
        ],
      },
      escapes: {
        patterns: [{ name: "constant.character.escape", match: "\\\\." }],
      },
      numbers: {
        patterns: [
          // Decimal numbers (must come before integers)
          { name: "constant.numeric", match: "\\b\\d+\\.\\d+\\b" },
          // Integers
          { name: "constant.numeric", match: "\\b\\d+\\b" },
        ],
      },
      "language-constants": {
        patterns: [
          { name: "constant.language", match: "\\b(true|false|null)\\b" },
        ],
      },
      operators: {
        patterns: [
          // Comparison operators (multi-character first)
          { name: "keyword.operator.comparison", match: "==|!=|>=|<=" },
          { name: "keyword.operator.comparison", match: "[><]" },
          // Arithmetic operators
          { name: "keyword.operator.arithmetic", match: "[+\\-*/]" },
          // Assignment operator
          { name: "keyword.operator.assignment", match: "=" },
        ],
      },
      punctuation: {
        patterns: [
          // Separators
          { name: "punctuation.separator", match: "," },
          { name: "punctuation.terminator", match: ";" },
          // Accessor (dot notation)
          { name: "punctuation.accessor", match: "\\." },
        ],
      },
      "function-parameters": {
        patterns: [
          {
            // Match parameter declarations: type name
            // Use negative lookbehind to prevent matching parameterName: TypeName patterns
            name: "variable.parameter",
            match: `(?<!:)\\b(${primitiveTypes.join("|")}|[A-Z_][A-Z0-9_]*)\\s+([a-z_][a-zA-Z0-9_]*)\\b`,
            captures: {
              1: { name: "storage.type" },
              2: { name: "variable.parameter" },
            },
          },
          { include: "#punctuation" },
        ],
      },
    },
    fileTypes: ["mez"],
    uuid: "a0416cfa-4b07-44d4-9f7a-8ad7f3f1b0f1",
  };

  await fs.ensureDir(path.dirname(output));
  await fs.writeJson(output, tmLanguage, { spaces: 2 });
  console.log(`Generated TextMate grammar at ${output}`);

  // -------------------------------------------------------------------------------------------
  // VXML (XML + Helium overlays)
  // -------------------------------------------------------------------------------------------
  if (!(await fs.pathExists(vxmlXsdPath))) {
    throw new Error(`Missing VXML schema: ${vxmlXsdPath}`);
  }

  const xsd = await fs.readFile(vxmlXsdPath, "utf8");
  const elementNames = new Set<string>();
  const attributeNames = new Set<string>();

  // Very small, robust extraction: mine element/attribute names from XSD.
  // (We don't need a full XSD parser for syntax highlighting.)
  {
    const elementRe = /<element\s+name\s*=\s*"([^"]+)"/g;
    let match: RegExpExecArray | null;
    while ((match = elementRe.exec(xsd)) !== null) {
      elementNames.add(match[1]);
    }
  }
  {
    const attrRe = /<attribute\s+name\s*=\s*"([^"]+)"/g;
    let match: RegExpExecArray | null;
    while ((match = attrRe.exec(xsd)) !== null) {
      attributeNames.add(match[1]);
    }
  }

  const elementAlt = toAlternation(elementNames);
  const attrAlt = toAlternation(attributeNames);

  // -------------------------------------------------------------------------------------------
  // VXML base grammar: use XML grammar + (safe) vocabulary overlays.
  // NOTE: Wired attribute values (function/variable/etc) are handled via an injection grammar,
  // because the XML grammar owns tag-attribute contexts.
  // -------------------------------------------------------------------------------------------
  const vxmlTmLanguage = {
    $schema: "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    name: "Helium VXML",
    scopeName: "text.xml.helium-vxml",
    patterns: [
      { include: "#helium-vxml-vocabulary" },
      // Base XML highlighting
      { include: "text.xml" },
    ],
    repository: {
      "helium-vxml-vocabulary": {
        patterns: [
          // Known VXML tags (widgets / elements) from XSD
          ...(elementAlt
            ? [
                {
                  name: "meta.helium.vxml.tag",
                  match: `</?(${elementAlt})(?=[\\s>/])`,
                  captures: {
                    1: { name: "support.function" },
                  },
                },
              ]
            : []),

          // Known VXML attribute names from XSD (including hyphenated attrs)
          ...(attrAlt
            ? [
                {
                  name: "meta.helium.vxml.attribute",
                  match: `(?:^|[\\s<])(${attrAlt})(?=\\s*=)`,
                  captures: {
                    1: { name: "entity.other.attribute-name" },
                  },
                },
              ]
            : []),
        ],
      },
    },
    fileTypes: ["vxml"],
    uuid: "f3a1a6b9-0a52-4d0f-a14c-7bb25f5f5e8a",
  };

  await fs.ensureDir(path.dirname(vxmlOutput));
  await fs.writeJson(vxmlOutput, vxmlTmLanguage, { spaces: 2 });
  console.log(`Generated TextMate grammar at ${vxmlOutput}`);

  // -------------------------------------------------------------------------------------------
  // VXML injection grammar: highlight wired attribute values inside XML tag contexts.
  // -------------------------------------------------------------------------------------------
  const vxmlInjectTmLanguage = {
    $schema: "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    name: "Helium VXML (Inject)",
    scopeName: "text.xml.helium-vxml.inject",
    // Inject into our VXML base scope (which includes the XML grammar).
    // We do NOT exclude strings, because we want to highlight inside attribute value quotes.
    injectionSelector: "L:text.xml.helium-vxml -comment",
    patterns: [{ include: "#helium-vxml-wiring" }],
    repository: {
      "helium-vxml-wiring": {
        patterns: [
          // unit="SomeUnit" / unit='SomeUnit' — presenter / unit file reference
          {
            name: "meta.helium.vxml.wired.unit",
            match: `\\b(unit)\\s*=\\s*\"([A-Z][A-Za-z0-9_]*)\"`,
            captures: {
              1: { name: "entity.other.attribute-name" },
              2: { name: "entity.name.type.helium.vxml.unit" },
            },
          },
          {
            name: "meta.helium.vxml.wired.unit",
            match: `\\b(unit)\\s*=\\s*'([A-Z][A-Za-z0-9_]*)'`,
            captures: {
              1: { name: "entity.other.attribute-name" },
              2: { name: "entity.name.type.helium.vxml.unit" },
            },
          },

          // init="(Unit:)?name" — view entrypoint (distinct from other wired functions)
          {
            name: "meta.helium.vxml.wired.init",
            match:
              `\\b(init)\\s*=\\s*\"(?:([A-Z][A-Za-z0-9_]*)\\:)?([A-Za-z_][A-Za-z0-9_]*)\"`,
            captures: {
              1: { name: "entity.other.attribute-name" },
              2: { name: "entity.name.type.helium.vxml.unit" },
              3: { name: "entity.name.function.helium.vxml.init" },
            },
          },
          {
            name: "meta.helium.vxml.wired.init",
            match:
              `\\b(init)\\s*=\\s*'(?:([A-Z][A-Za-z0-9_]*)\\:)?([A-Za-z_][A-Za-z0-9_]*)'`,
            captures: {
              1: { name: "entity.other.attribute-name" },
              2: { name: "entity.name.type.helium.vxml.unit" },
              3: { name: "entity.name.function.helium.vxml.init" },
            },
          },

          // action / destroy / function="(Unit:)?name" — callbacks, actions, visibility, etc.
          {
            name: "meta.helium.vxml.wired.bindfn",
            match:
              `\\b(action|destroy|function)\\s*=\\s*\"(?:([A-Z][A-Za-z0-9_]*)\\:)?([A-Za-z_][A-Za-z0-9_]*)\"`,
            captures: {
              1: { name: "entity.other.attribute-name" },
              2: { name: "entity.name.type.helium.vxml.unit" },
              3: { name: "entity.name.function.helium.vxml.bindfn" },
            },
          },
          {
            name: "meta.helium.vxml.wired.bindfn",
            match:
              `\\b(action|destroy|function)\\s*=\\s*'(?:([A-Z][A-Za-z0-9_]*)\\:)?([A-Za-z_][A-Za-z0-9_]*)'`,
            captures: {
              1: { name: "entity.other.attribute-name" },
              2: { name: "entity.name.type.helium.vxml.unit" },
              3: { name: "entity.name.function.helium.vxml.bindfn" },
            },
          },

          // variable="(Unit:)?name"
          {
            name: "meta.helium.vxml.wired.variable",
            match:
              `\\b(variable)\\s*=\\s*\"(?:([A-Z][A-Za-z0-9_]*)\\:)?([A-Za-z_][A-Za-z0-9_]*)\"`,
            captures: {
              1: { name: "entity.other.attribute-name" },
              2: { name: "entity.name.type.helium.vxml.unit" },
              3: { name: "variable.other.helium.vxml.bindvar" },
            },
          },
          {
            name: "meta.helium.vxml.wired.variable",
            match:
              `\\b(variable)\\s*=\\s*'(?:([A-Z][A-Za-z0-9_]*)\\:)?([A-Za-z_][A-Za-z0-9_]*)'`,
            captures: {
              1: { name: "entity.other.attribute-name" },
              2: { name: "entity.name.type.helium.vxml.unit" },
              3: { name: "variable.other.helium.vxml.bindvar" },
            },
          },
        ],
      },
    },
    uuid: "f6f1f6f0-2f9b-4e8a-9ed3-2c2c0a7c7f44",
  };

  await fs.ensureDir(path.dirname(vxmlInjectOutput));
  await fs.writeJson(vxmlInjectOutput, vxmlInjectTmLanguage, { spaces: 2 });
  console.log(`Generated TextMate injection grammar at ${vxmlInjectOutput}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

