import path from "node:path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..", "..");
function getMetadataPath() {
    const bundledPath = path.join(root, "..", "generated", "language", "helium-language-metadata.json");
    const devPath = path.join(root, "..", "..", "generated", "language", "helium-language-metadata.json");
    try {
        if (fs.existsSync(bundledPath)) {
            return bundledPath;
        }
    }
    catch {
        // ignore
    }
    return devPath;
}
let cachedMetadata = null;
export function getLanguageMetadataSync() {
    if (cachedMetadata)
        return cachedMetadata;
    const metadataPath = getMetadataPath();
    if (fs.existsSync(metadataPath)) {
        cachedMetadata = fs.readJsonSync(metadataPath);
    }
    else {
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
// Test/support helper: allow forcing a re-read of the on-disk metadata.
// (Useful because some tests load this module early and cache an empty fallback.)
export function resetLanguageMetadataCache() {
    cachedMetadata = null;
}
export async function getLanguageMetadata() {
    if (cachedMetadata)
        return cachedMetadata;
    const metadataPath = getMetadataPath();
    if (await fs.pathExists(metadataPath)) {
        cachedMetadata = (await fs.readJson(metadataPath));
    }
    else {
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
