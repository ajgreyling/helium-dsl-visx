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
  if (cachedMetadata) return cachedMetadata;
  const metadataPath = getMetadataPath();
  if (fs.existsSync(metadataPath)) {
    cachedMetadata = fs.readJsonSync(metadataPath) as LanguageMetadata;
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
