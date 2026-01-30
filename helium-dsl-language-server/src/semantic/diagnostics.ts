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

function positionLeq(
  a: { line: number; character: number },
  b: { line: number; character: number }
): boolean {
  return a.line < b.line || (a.line === b.line && a.character <= b.character);
}

function rangeContains(
  range: { start: { line: number; character: number }; end: { line: number; character: number } },
  pos: { line: number; character: number }
): boolean {
  return positionLeq(range.start, pos) && positionLeq(pos, range.end);
}

export async function createSemanticDiagnostics(
  text: string,
  uri: string,
  projectManager: ProjectManager
): Promise<Diagnostic[]> {
  let ast: any;
  let astDiagnostics: Diagnostic[] = [];
  try {
    const result = await buildFileAst(text, uri);
    ast = result.ast;
    astDiagnostics = result.diagnostics;
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
  const fileUnitVariables = new Map<string, Set<string>>(
    (ast?.units || []).map((u: any) => [
      u.name,
      new Set<string>((u.variables || []).map((v: any) => v.name)),
    ])
  );
  const fileTypeNames = new Set<string>([
    ...((ast?.objects || []).map((o: any) => o.name) ?? []),
    ...((ast?.enums || []).map((e: any) => e.name) ?? []),
  ]);

  const languageMetadata = getLanguageMetadataSync();
  const modelBifs = new Set<string>((languageMetadata.modelBifs ?? []).filter(Boolean));
  const hasModelBifCatalog = modelBifs.size > 0;

  const bifMeta = loadBifMetadata();
  const bifNamespaces = bifMeta?.namespaces || {};

  const diagnostics: Diagnostic[] = [...astDiagnostics];

  const namespaceIsUnit = (name: string) => fileUnitNames.has(name) || projectManager.isUnit(name);
  const namespaceIsModelType = (name: string) => fileTypeNames.has(name) || projectManager.isUserDefinedType(name);
  const hasUnitVariable = (unitName: string, variableName: string): boolean => {
    // `ProjectManager` is imported via a `.js` path for NodeNext ESM compatibility.
    // In some toolchains the type surface may lag the implementation, so we call this defensively.
    const pmAny = projectManager as any;
    if (typeof pmAny.hasUnitVariable === "function") {
      return pmAny.hasUnitVariable(unitName, variableName);
    }
    return false;
  };

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
    const isUnit = namespaceIsUnit(namespace);
    const isModelType = namespaceIsModelType(namespace);

    const unitHasFunction = (() => {
      if (!isUnit) return false;
      const inFile = fileUnitFunctions.get(namespace);
      if (inFile) return inFile.has(callee);
      return projectManager.hasUnitFunction(namespace, callee);
    })();

    // If the generated metadata isn't available, avoid producing noisy false-positives.
    const modelHasBif = isModelType ? (!hasModelBifCatalog || modelBifs.has(callee)) : false;

    if (isUnit && isModelType) {
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

    if (isUnit) {
      if (!unitHasFunction) {
        diagnostics.push(
          toDiagnostic(nameRange, `Unknown function \`${callee}()\` in unit \`${namespace}\`.`)
        );
      }
      continue;
    }

    if (isModelType) {
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

  // Variable references (locals/params/unit vars + `Unit:var`).
  const findContainingContext = (pos: { line: number; character: number }) => {
    for (const unit of ast?.units || []) {
      for (const fn of unit?.functions || []) {
        if (fn?.bodyRange && rangeContains(fn.bodyRange, pos)) {
          return { unit, fn };
        }
      }
    }
    return { unit: (ast?.units || [])[0], fn: undefined };
  };

  const isSuppressedName = (name: string) => {
    // Prevent noise when an identifier is actually a known unit/type name.
    return namespaceIsUnit(name) || namespaceIsModelType(name);
  };

  for (const ref of ast?.variableReferences || []) {
    const name: string | undefined = ref?.name;
    const nameRange = ref?.nameRange;
    if (!name || !nameRange) continue;
    if (isSuppressedName(name)) continue;

    const refUnitName: string | undefined = ref?.unitName;
    const refPos = nameRange.start;

    // Model trigger pseudo-scope variables are implicitly available inside trigger code blocks.
    if (name === "before" || name === "after") {
      const scopes = (ast as any).triggerScopes as any[] | undefined;
      if (scopes && scopes.length > 0) {
        const inScope = scopes.some(
          (s) =>
            s?.scopeName === name &&
            s?.codeBlockRange &&
            rangeContains(s.codeBlockRange, refPos)
        );
        if (inScope) continue;
      }
    }

    if (refUnitName) {
      const isUnit = namespaceIsUnit(refUnitName);
      const isModelType = namespaceIsModelType(refUnitName);

      if (!isUnit) {
        // If the "namespace" is not a unit, don't flag it as an undeclared variable reference.
        // (It may be a type/namespace in other constructs not represented as variableReferences.)
        if (!isModelType) {
          diagnostics.push(
            toDiagnostic(
              nameRange,
              `Unknown unit \`${refUnitName}\` for variable reference \`${refUnitName}:${name}\`.`
            )
          );
        }
        continue;
      }

      const inFileVars = fileUnitVariables.get(refUnitName);
      const unitHasVar = inFileVars ? inFileVars.has(name) : hasUnitVariable(refUnitName, name);
      if (!unitHasVar) {
        diagnostics.push(toDiagnostic(nameRange, `Unknown variable \`${name}\` in unit \`${refUnitName}\`.`));
      }
      continue;
    }

    const { unit, fn } = findContainingContext(refPos);
    const unitName: string | undefined = unit?.name;

    const declaredInFn =
      (fn?.params || []).some((p: any) => p?.name === name)
      || (fn?.locals || []).some((v: any) => {
        if (v?.name !== name) return false;
        const declStart = v?.declRange?.start;
        if (!declStart) return true;
        return positionLeq(declStart, refPos);
      });

    if (declaredInFn) continue;

    const declaredInUnit = (unit?.variables || []).some((v: any) => v?.name === name);
    if (declaredInUnit) continue;

    // Fall back to checking other units’ globals is intentionally not done here:
    // unqualified `foo` should resolve only in local or current unit scope.
    diagnostics.push(toDiagnostic(nameRange, `Unknown variable \`${name}\`.`));
  }

  // Property references (receiver.member) validated via receiver type + model members.
  //
  // We intentionally only validate when the receiver type is a *known user-defined object*.
  // Platform/library types (e.g. MezApiRequest) are skipped to avoid noise.
  const ROLE_IMPLICIT_FIELDS = (languageMetadata.roleImplicitFields ?? []).filter(Boolean);
  const PLATFORM_IMPLICIT_FIELDS = (languageMetadata.platformImplicitFields ?? []).filter(Boolean);
  const blobSuffixes = languageMetadata.blobSuffixes;

  for (const ref of ast?.propertyReferences || []) {
    const receiverName: string | undefined = ref?.receiverName;
    const propName: string | undefined = ref?.name;
    const nameRange = ref?.nameRange;
    if (!receiverName || !propName || !nameRange) continue;

    const pos = nameRange.start;
    const receiverType = projectManager.getVariableType(receiverName, uri, pos);
    // If we can't infer a receiver type, skip. If the receiver token happens to be a type/unit name
    // (e.g. `client_config.hostUrl` where `client_config` is also a type name), we still want to
    // validate it when it resolves as a variable.
    if (!receiverType) {
      if (isSuppressedName(receiverName)) continue;
      continue;
    }

    const baseType = receiverType.replace(/\[\]$/, "");
    const obj = projectManager.getObjectDecl(baseType, uri);
    if (!obj) continue;

    const memberSet = new Set<string>(projectManager.getObjectMembers(baseType, uri));

    PLATFORM_IMPLICIT_FIELDS.forEach((f) => memberSet.add(f));

    if (obj.isPersistent) {
      ROLE_IMPLICIT_FIELDS.forEach((f) => memberSet.add(f));
    }

    if (blobSuffixes) {
      for (const attr of obj.attributes || []) {
        if ((attr as any).typeName === "blob") {
          memberSet.add(`${attr.name}${blobSuffixes.fname}`);
          memberSet.add(`${attr.name}${blobSuffixes.mtype}`);
          memberSet.add(`${attr.name}${blobSuffixes.size}`);
        }
      }
    }

    if (!memberSet.has(propName)) {
      diagnostics.push(
        toDiagnostic(nameRange, `Invalid attribute/relationship \`${propName}\` on type \`${baseType}\`.`)
      );
    } else {
      // If this member is provided via an inverse relationship alias (`via <alias>`),
      // detect collisions (multiple source types declaring the same alias on the same target).
      const sources = (projectManager as any).getInverseMemberSources?.(baseType, propName, uri) as
        | string[]
        | undefined;
      if (sources && sources.length > 1) {
        const uniq = Array.from(new Set(sources)).sort();
        diagnostics.push(
          toDiagnostic(
            nameRange,
            `Ambiguous inverse relationship alias \`${propName}\` on type \`${baseType}\`: referenced by [${uniq.join(
              ", "
            )}].`
          )
        );
      }
    }
  }

  // Unused warnings (project-wide, usage-based).
  // These are warnings (not errors) and are surfaced in the Problems tab.
  try {
    diagnostics.push(...projectManager.getUnusedWarningsForFile(uri, ast));
  } catch {
    // Best-effort only; unused warnings should never crash semantic diagnostics.
  }

  return diagnostics;
}

