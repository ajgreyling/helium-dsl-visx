import path from "node:path";
import fs from "fs-extra";

const root = path.resolve(__dirname, "..");
const grammarPath = path.join(root, "generated/grammar/MezDSL.g4");
const bifMetaPath = path.join(root, "generated/bifs/bif-metadata.json");
const output = path.join(root, "generated/syntaxes/helium-dsl.tmLanguage.json");

// System/primitive types
const systemTypes = [
  "int",
  "decimal",
  "bigint",
  "uuid",
  "blob",
  "bool",
  "string",
  "void",
  "date",
  "datetime",
  "json",
  "jsonarray",
];

// Common built-in function namespaces (always available)
const commonBifNamespaces = [
  "Mez",
  "sql",
  "String",
  "Math",
  "Date",
  "Integer",
  "Decimal",
  "Uuid",
  "api",
];

async function main() {
  if (!(await fs.pathExists(grammarPath))) {
    throw new Error(`Missing grammar: ${grammarPath}`);
  }

  const bifMeta = (await fs.pathExists(bifMetaPath))
    ? await fs.readJson(bifMetaPath)
    : { namespaces: {} };

  // Keywords from primitive rules (simple heuristic).
  const grammar = await fs.readFile(grammarPath, "utf8");
  const keywordSet = new Set<string>();
  const keywordRegex = /\b(unit|persistent|object|enum|validator|if|else|for|foreach|return)\b/g;
  let m: RegExpExecArray | null;
  while ((m = keywordRegex.exec(grammar))) {
    keywordSet.add(m[1]);
  }

  const bifNamespacesFromMeta = Object.keys(bifMeta.namespaces ?? {});
  // Merge common namespaces with metadata namespaces, removing duplicates
  const bifNamespaces = Array.from(new Set([...commonBifNamespaces, ...bifNamespacesFromMeta]));

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
    match: `\\b(${systemTypes.join("|")})\\b`,
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
    begin: `\\b(${systemTypes.join("|")})\\s+([a-z_][a-zA-Z0-9_]*)\\s*\\(`,
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
    match: `\\b(${systemTypes.join("|")})\\s+([a-z_][a-zA-Z0-9_]*)\\b`,
    captures: {
      1: {
        name: "storage.type",
      },
      2: {
        name: "variable.other",
      },
    },
  });

  // Add unit reference pattern (e.g., SomeUnit:someFunction() or SomeUnit:someVar)
  // Must come before BIF pattern but exclude BIF namespaces
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

  // Add BIF function calls (e.g., Mez:now, sql:query, String:concat, Math:sqrt)
  // Use standard support.function.builtin scope for cross-theme compatibility
  // Must come after unit reference pattern so BIFs match when namespaces overlap
  patterns.push({
    name: "support.function.builtin",
    match: `\\b(${bifNamespaces.join("|")}):[a-zA-Z_][a-zA-Z0-9_]*\\b`,
  });

  // Add operators (must come after numbers and strings)
  patterns.push({ include: "#operators" });

  // Add punctuation (must come after other patterns to avoid conflicts)
  patterns.push({ include: "#punctuation" });

  const tmLanguage = {
    $schema: "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    name: "Helium DSL",
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
            match: `(?<!:)\\b(${systemTypes.join("|")}|[A-Z_][A-Z0-9_]*)\\s+([a-z_][a-zA-Z0-9_]*)\\b`,
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
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

