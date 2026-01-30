import path from "node:path";
import fs from "node:fs";

const REL_BUILTIN_OBJECTS =
  "WebCompiler-lib/src/main/java/com/mezzanine/program/web/builder/BuiltinObjects.java";
const REL_OBJECT_BUILDER =
  "WebCompiler-lib/src/main/java/com/mezzanine/program/web/builder/object/ObjectBuilder.java";

export type BlobSuffixes = { fname: string; mtype: string; size: string };

export type MinedImplicit = {
  roleImplicitFields: string[];
  platformImplicitFields: string[];
  blobSuffixes: BlobSuffixes;
};

function extractJavaClassBody(src: string, className: string): string {
  const re = new RegExp(`\\bclass\\s+${className}\\b`);
  const m = re.exec(src);
  if (!m || m.index == null) {
    throw new Error(`Unable to find class '${className}'`);
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

/**
 * Mine role implicit fields from BuiltinObjects.java Identity class.
 * Returns all ATTR_* string constant values (ATTR_ID plus the seven role attributes).
 */
export function mineRoleImplicitFields(dslCommonsPath: string): string[] | null {
  try {
    const filePath = path.join(dslCommonsPath, REL_BUILTIN_OBJECTS);
    if (!fs.existsSync(filePath)) return null;
    const javaSource = fs.readFileSync(filePath, "utf8");
    const identityBody = extractJavaClassBody(javaSource, "Identity");
    const constRe =
      /\bpublic\s+static\s+final\s+String\s+(ATTR_[A-Z0-9_]+)\s*=\s*"([^"]+)"\s*;/g;
    const values = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = constRe.exec(identityBody)) !== null) {
      values.add(m[2]);
    }
    if (values.size === 0) return null;
    return Array.from(values).sort();
  } catch {
    return null;
  }
}

/**
 * Mine platform implicit fields from ObjectBuilder.java (ATTR_ID only).
 */
export function minePlatformImplicitFields(dslCommonsPath: string): string[] | null {
  try {
    const filePath = path.join(dslCommonsPath, REL_OBJECT_BUILDER);
    if (!fs.existsSync(filePath)) return null;
    const javaSource = fs.readFileSync(filePath, "utf8");
    const attrIdRe = /\bpublic\s+static\s+final\s+String\s+ATTR_ID\s*=\s*"([^"]+)";/;
    const match = javaSource.match(attrIdRe);
    if (!match) return null;
    return [match[1]];
  } catch {
    return null;
  }
}

/**
 * Mine blob metadata suffixes from ObjectBuilder.java (BLOB_FILE_NAME, BLOB_MIME_TYPE, BLOB_SIZE).
 */
export function mineBlobSuffixes(dslCommonsPath: string): BlobSuffixes | null {
  try {
    const filePath = path.join(dslCommonsPath, REL_OBJECT_BUILDER);
    if (!fs.existsSync(filePath)) return null;
    const javaSource = fs.readFileSync(filePath, "utf8");
    const fnameRe = /\bpublic\s+static\s+final\s+String\s+BLOB_FILE_NAME\s*=\s*"([^"]+)";/;
    const mtypeRe = /\bpublic\s+static\s+final\s+String\s+BLOB_MIME_TYPE\s*=\s*"([^"]+)";/;
    const sizeRe = /\bpublic\s+static\s+final\s+String\s+BLOB_SIZE\s*=\s*"([^"]+)";/;
    const fnameMatch = javaSource.match(fnameRe);
    const mtypeMatch = javaSource.match(mtypeRe);
    const sizeMatch = javaSource.match(sizeRe);
    if (!fnameMatch || !mtypeMatch || !sizeMatch) return null;
    return {
      fname: fnameMatch[1],
      mtype: mtypeMatch[1],
      size: sizeMatch[1],
    };
  } catch {
    return null;
  }
}

/**
 * Mine all implicit field data from dsl-commons. Returns null if any extraction fails.
 */
export function mineAllImplicitFromDslCommons(dslCommonsPath: string): MinedImplicit | null {
  const roleImplicitFields = mineRoleImplicitFields(dslCommonsPath);
  const platformImplicitFields = minePlatformImplicitFields(dslCommonsPath);
  const blobSuffixes = mineBlobSuffixes(dslCommonsPath);
  if (
    roleImplicitFields === null ||
    platformImplicitFields === null ||
    blobSuffixes === null
  ) {
    return null;
  }
  return {
    roleImplicitFields,
    platformImplicitFields,
    blobSuffixes,
  };
}
