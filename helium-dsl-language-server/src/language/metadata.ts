import path from "node:path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

export type LanguageMetadata = {
  keywords: string[];
  primitiveTypes: string[];
  modelBifs: string[];
  bifNamespaces: string[];
  bifFunctions: string[];
  reservedIdentifiers: string[];
  // Optional to support older generated metadata files.
  roleImplicitFields?: string[];
  platformImplicitFields?: string[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..", "..");

function getMetadataPath(): string {
  const bundledPath = path.join(
    root,
    "..",
    "generated",
    "language",
    "helium-language-metadata.json"
  );
  const devPath = path.join(
    root,
    "..",
    "..",
    "generated",
    "language",
    "helium-language-metadata.json"
  );
  try {
    if (fs.existsSync(bundledPath)) {
      return bundledPath;
    }
  } catch {
    // ignore
  }
  return devPath;
}

let cachedMetadata: LanguageMetadata | null = null;

export function getLanguageMetadataSync(): LanguageMetadata {
  if (cachedMetadata) {
    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/2d3a9c8a-c014-44ca-b636-6599bc56fc4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'metadata.ts:49',message:'Returning cached metadata',data:{hasPlatformFields:!!cachedMetadata.platformImplicitFields,platformFields:cachedMetadata.platformImplicitFields,metadataKeys:Object.keys(cachedMetadata)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return cachedMetadata;
  }
  const metadataPath = getMetadataPath();
  // #region agent log
  fetch('http://127.0.0.1:7249/ingest/2d3a9c8a-c014-44ca-b636-6599bc56fc4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'metadata.ts:51',message:'Loading metadata from file',data:{metadataPath,fileExists:fs.existsSync(metadataPath)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
  // #endregion
  if (fs.existsSync(metadataPath)) {
    cachedMetadata = fs.readJsonSync(metadataPath) as LanguageMetadata;
    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/2d3a9c8a-c014-44ca-b636-6599bc56fc4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'metadata.ts:53',message:'Metadata loaded from file',data:{hasPlatformFields:!!cachedMetadata.platformImplicitFields,platformFields:cachedMetadata.platformImplicitFields,metadataKeys:Object.keys(cachedMetadata)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
    // #endregion
  } else {
    cachedMetadata = {
      keywords: [],
      primitiveTypes: [],
      modelBifs: [],
      bifNamespaces: [],
      bifFunctions: [],
      reservedIdentifiers: [],
    };
    // #region agent log
    fetch('http://127.0.0.1:7249/ingest/2d3a9c8a-c014-44ca-b636-6599bc56fc4e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'metadata.ts:62',message:'Using fallback empty metadata',data:{metadataPath},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }
  return cachedMetadata;
}

// Test/support helper: allow forcing a re-read of the on-disk metadata.
// (Useful because some tests load this module early and cache an empty fallback.)
export function resetLanguageMetadataCache() {
  cachedMetadata = null;
}

export async function getLanguageMetadata(): Promise<LanguageMetadata> {
  if (cachedMetadata) return cachedMetadata;
  const metadataPath = getMetadataPath();
  if (await fs.pathExists(metadataPath)) {
    cachedMetadata = (await fs.readJson(metadataPath)) as LanguageMetadata;
  } else {
    cachedMetadata = {
      keywords: [],
      primitiveTypes: [],
      modelBifs: [],
      bifNamespaces: [],
      bifFunctions: [],
      reservedIdentifiers: [],
    };
  }
  return cachedMetadata;
}
