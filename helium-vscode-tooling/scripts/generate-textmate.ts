import path from "node:path";
import fs from "fs-extra";

const root = path.resolve(__dirname, "..");
const grammarPath = path.join(root, "generated/grammar/MezDSL.g4");
const bifMetaPath = path.join(root, "generated/bifs/bif-metadata.json");
const output = path.join(root, "helium-dsl-vscode/syntaxes/helium-dsl.tmLanguage.json");

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
      name: "keyword.control.helium",
      match: `\\b(${Array.from(keywordSet).join("|")})\\b`,
    },
  ];

  // Add system types pattern
  patterns.push({
    name: "storage.type.primitive.helium",
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
        name: "storage.modifier.helium",
      },
      2: {
        name: "keyword.control.helium",
      },
    },
    endCaptures: {
      0: {
        name: "punctuation.definition.block.begin.helium",
      },
    },
    patterns: [
      {
        name: "entity.name.type.class.helium",
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
        name: "keyword.control.helium",
      },
    },
    endCaptures: {
      0: {
        name: "punctuation.definition.block.begin.helium",
      },
    },
    patterns: [
      {
        name: "entity.name.type.class.helium",
        match: "\\b([A-Za-z_][a-zA-Z0-9_]*)\\b",
      },
    ],
  });

  // Note: User-defined types are handled via semantic tokens (dynamic, workspace-based)
  // rather than static TextMate patterns. This allows highlighting to adapt to each
  // workspace's model folder without regenerating the grammar.

  // Add unit definition pattern (must come before enum patterns)
  patterns.push({
    name: "meta.unit.definition.helium",
    begin: "\\b(unit)\\s+",
    end: "\\s*;",
    beginCaptures: {
      1: {
        name: "keyword.control.helium",
      },
    },
    endCaptures: {
      0: {
        name: "punctuation.terminator.helium",
      },
    },
    patterns: [
      {
        name: "entity.name.type.namespace.helium",
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
        name: "keyword.control.helium",
      },
    },
    endCaptures: {
      0: {
        name: "punctuation.definition.block.begin.helium",
      },
    },
    patterns: [
      {
        name: "entity.name.type.enum.helium",
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
        name: "storage.type.primitive.helium",
      },
      2: {
        name: "entity.name.function.helium",
      },
    },
    endCaptures: {
      0: {
        name: "punctuation.definition.block.begin.helium",
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
        name: "storage.type.primitive.helium",
      },
      2: {
        name: "variable.other.helium",
      },
    },
  });

cur  // Add BIF function calls (e.g., Mez:now, sql:query, String:concat, Math:sqrt)
  // Use standard support.function scope for cross-theme compatibility
  // Must come before unit reference pattern so BIFs are matched first
  patterns.push({
    name: "support.function.helium",
    match: `\\b(${bifNamespaces.join("|")}):[a-zA-Z_][a-zA-Z0-9_]*\\b`,
  });

  // Add unit reference pattern (e.g., SomeUnit:someFunction)
  // Matches user-defined units (PascalCase identifiers) followed by colon and function name
  patterns.push({
    name: "meta.unit.reference.helium",
    match: `\\b([A-Z][A-Za-z0-9_]*):([a-zA-Z_][a-zA-Z0-9_]*)\\b`,
    captures: {
      1: {
        name: "entity.name.type.namespace.helium", // Unit name
      },
      2: {
        name: "entity.name.function.helium", // Function name
      },
    },
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
          { name: "comment.line.double-slash.helium", match: "//.*$" },
          { name: "comment.block.helium", begin: "/\\*", end: "\\*/" },
        ],
      },
      strings: {
        patterns: [
          { name: "string.quoted.double.helium", begin: '"', end: '"', patterns: [{ include: "#escapes" }] },
          { name: "string.quoted.block.helium", begin: "/%", end: "%/" },
        ],
      },
      escapes: {
        patterns: [{ name: "constant.character.escape.helium", match: "\\\\." }],
      },
      numbers: {
        patterns: [
          // Decimal numbers (must come before integers)
          { name: "constant.numeric.helium", match: "\\b\\d+\\.\\d+\\b" },
          // Integers
          { name: "constant.numeric.helium", match: "\\b\\d+\\b" },
        ],
      },
      "language-constants": {
        patterns: [
          { name: "constant.language.helium", match: "\\b(true|false|null)\\b" },
        ],
      },
      operators: {
        patterns: [
          // Comparison operators (multi-character first)
          { name: "keyword.operator.comparison.helium", match: "==|!=|>=|<=" },
          { name: "keyword.operator.comparison.helium", match: "[><]" },
          // Arithmetic operators
          { name: "keyword.operator.arithmetic.helium", match: "[+\\-*/]" },
          // Assignment operator
          { name: "keyword.operator.assignment.helium", match: "=" },
        ],
      },
      punctuation: {
        patterns: [
          // Separators
          { name: "punctuation.separator.helium", match: "," },
          { name: "punctuation.terminator.helium", match: ";" },
          // Accessor (dot notation)
          { name: "punctuation.accessor.helium", match: "\\." },
        ],
      },
      "function-parameters": {
        patterns: [
          {
            // Match parameter declarations: type name
            name: "variable.parameter.helium",
            match: `\\b(${systemTypes.join("|")}|[A-Z_][A-Z0-9_]*)\\s+([a-z_][a-zA-Z0-9_]*)\\b`,
            captures: {
              1: { name: "storage.type.helium" },
              2: { name: "variable.parameter.helium" },
            },
          },
          { include: "#punctuation" },
        ],
      },
    },
    fileTypes: ["mez"],
    uuid: "a0416cfa-4b07-44d4-9f7a-8ad7f3f1b0f1",
  };

  await fs.writeJson(output, tmLanguage, { spaces: 2 });
  console.log(`Generated TextMate grammar at ${output}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

