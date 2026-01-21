import fs from "node:fs";
import path from "node:path";
import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver/node.js";
import type { ProjectManager } from "../index/projectManager.js";
import { buildFileAst } from "../ast/builder.js";
import { getLanguageMetadataSync } from "../language/metadata.js";

type BifMetadata = {
  namespaces?: Record<
    string,
    Array<{
      name: string;
      signature?: string;
      description?: string;
    }>
  >;
};

let bifMetadataCache: BifMetadata | null = null;
function loadBifMetadata(): BifMetadata | null {
  if (bifMetadataCache) return bifMetadataCache;
  try {
    // Keep the lookup logic aligned with `src/server.ts` so it works in the packaged server cwd.
    const bundledPath = path.join(process.cwd(), "generated", "bifs", "bif-metadata.json");
    const devPath = path.join(process.cwd(), "..", "generated", "bifs", "bif-metadata.json");
    let bifPath = bundledPath;
    if (!fs.existsSync(bifPath)) {
      bifPath = devPath;
    }
    if (!fs.existsSync(bifPath)) return null;
    const data = JSON.parse(fs.readFileSync(bifPath, "utf8")) as BifMetadata;
    bifMetadataCache = data;
    return data;
  } catch {
    return null;
  }
}

const DEFAULT_MODEL_BIFS = [
  "all",
  "read",
  "delete",
  "new",
  "equals",
  "empty",
  "between",
  "lessThanOrEqual",
  "lessThan",
  "greaterThan",
  "attributeIn",
  "relationshipIn",
  "contains",
  "beginsWith",
  "endsWith",
  "notEquals",
  "notEmpty",
  "notBetween",
  "notContains",
  "notBeginWith",
  "notEndsWith",
  "notAttributeIn",
  "notRelationshipIn",
  "union",
  "diff",
  "intersect",
  "and",
];

function toDiagnostic(
  range: { start: { line: number; character: number }; end: { line: number; character: number } },
  message: string
): Diagnostic {
  return {
    message,
    range,
    severity: DiagnosticSeverity.Error,
    source: "helium-dsl-semantic",
  };
}

export async function createSemanticDiagnostics(
  text: string,
  uri: string,
  projectManager: ProjectManager
): Promise<Diagnostic[]> {
  let ast: any;
  try {
    ast = await buildFileAst(text, uri);
  } catch {
    return [];
  }

  const fileUnitNames = new Set<string>((ast?.units || []).map((u: any) => u.name));
  const fileUnitFunctions = new Map<string, Set<string>>(
    (ast?.units || []).map((u: any) => [
      u.name,
      new Set<string>((u.functions || []).map((f: any) => f.name)),
    ])
  );
  const fileTypeNames = new Set<string>([
    ...((ast?.objects || []).map((o: any) => o.name) ?? []),
    ...((ast?.enums || []).map((e: any) => e.name) ?? []),
  ]);

  const languageMetadata = getLanguageMetadataSync();
  const modelBifs = new Set<string>(
    (languageMetadata.modelBifs && languageMetadata.modelBifs.length > 0)
      ? languageMetadata.modelBifs
      : DEFAULT_MODEL_BIFS
  );

  const bifMeta = loadBifMetadata();
  const bifNamespaces = bifMeta?.namespaces || {};

  const diagnostics: Diagnostic[] = [];

  for (const call of ast?.functionCalls || []) {
    const namespace: string | undefined = call?.unitName;
    const callee: string | undefined = call?.name;
    const nameRange = call?.nameRange;
    if (!namespace || !callee || !nameRange) continue;

    // 1) Built-in namespace calls (Mez:String:sql:Date:...) validated via bif-metadata.json if available.
    const namespaceEntries = bifNamespaces[namespace];
    if (namespaceEntries) {
      const ok = namespaceEntries.some((f) => f?.name === callee);
      if (!ok) {
        diagnostics.push(
          toDiagnostic(
            nameRange,
            `Unknown built-in function \`${namespace}:${callee}()\`.`
          )
        );
      }
      continue;
    }

    // 2) Unit and/or model-type calls. (If both exist, accept either; if neither resolves, error.)
    const namespaceIsUnit = fileUnitNames.has(namespace) || projectManager.isUnit(namespace);
    const namespaceIsModelType = fileTypeNames.has(namespace) || projectManager.isUserDefinedType(namespace);

    const unitHasFunction = (() => {
      if (!namespaceIsUnit) return false;
      const inFile = fileUnitFunctions.get(namespace);
      if (inFile) return inFile.has(callee);
      return projectManager.hasUnitFunction(namespace, callee);
    })();

    const modelHasBif = namespaceIsModelType ? modelBifs.has(callee) : false;

    if (namespaceIsUnit && namespaceIsModelType) {
      if (!unitHasFunction && !modelHasBif) {
        diagnostics.push(
          toDiagnostic(
            nameRange,
            `Unknown call \`${namespace}:${callee}()\`: not a function in unit \`${namespace}\` and not a model BIF on type \`${namespace}\`.`
          )
        );
      }
      continue;
    }

    if (namespaceIsUnit) {
      if (!unitHasFunction) {
        diagnostics.push(
          toDiagnostic(nameRange, `Unknown function \`${callee}()\` in unit \`${namespace}\`.`)
        );
      }
      continue;
    }

    if (namespaceIsModelType) {
      if (!modelHasBif) {
        diagnostics.push(
          toDiagnostic(nameRange, `Unknown model BIF \`${namespace}:${callee}()\`.`)
        );
      }
      continue;
    }

    // 3) Unknown namespace/type/unit.
    diagnostics.push(
      toDiagnostic(nameRange, `Unknown namespace/type/unit \`${namespace}\` for call \`${namespace}:${callee}()\`.`)
    );
  }

  return diagnostics;
}

