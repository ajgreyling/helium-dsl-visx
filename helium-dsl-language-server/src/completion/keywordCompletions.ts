import { getLanguageMetadata } from "../language/metadata.js";

export async function getKeywordCompletions(): Promise<string[]> {
  const metadata = await getLanguageMetadata();
  return metadata.keywords || [];
}

