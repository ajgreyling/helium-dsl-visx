import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const DEFAULT_VIEW_XSD_RELATIVE_PATH =
  "WebViewParser-lib/src/main/resources/com/mezzanine/dsl/web/View.xsd";

function readArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("-")) return undefined;
  return value;
}

function resolveDslCommonsPath(): string {
  const fromArgs = readArgValue("--dsl-commons");
  if (fromArgs) return path.resolve(fromArgs);

  const fromEnv = process.env.DSL_COMMONS_PATH;
  if (fromEnv) return path.resolve(fromEnv);

  throw new Error(
    [
      "No DSL commons path configured for VXML metadata extraction.",
      "",
      "Provide one of:",
      '  - CLI: "--dsl-commons <path-to-appexec-dsl-commons>"',
      "  - Env: DSL_COMMONS_PATH=<path-to-appexec-dsl-commons>",
    ].join("\n")
  );
}

/**
 * Extracts function-value node names from the XSD schema.
 * 
 * Finds all complexTypes that have a `value` attribute of type `v:QualifiedName`,
 * then finds all elements that reference those complexTypes, and extracts the element names.
 */
function extractFunctionValueNodes(xsdContent: string): string[] {
  const functionValueNodes = new Set<string>();

  // Step 1: Find all complexTypes that have <attribute name="value" type="v:QualifiedName">
  const complexTypePattern = /<complexType\s+name="([^"]+)">([\s\S]*?)<\/complexType>/g;
  const qualifiedNameValueTypes = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = complexTypePattern.exec(xsdContent)) !== null) {
    const [, typeName, typeBody] = match;
    // Check if this complexType has a value attribute of type v:QualifiedName
    if (typeBody.includes('<attribute name="value" type="v:QualifiedName">')) {
      qualifiedNameValueTypes.add(typeName);
    }
  }

  // Step 2: Find all elements that reference these complexTypes
  // Pattern: <element name="elementName" ... type="v:ComplexTypeName" ...>
  // Handle both single-line and multi-line element definitions
  const elementPattern = /<element\s+name="([^"]+)"[\s\S]*?type="v:([^"]+)"[\s\S]*?>/g;
  
  while ((match = elementPattern.exec(xsdContent)) !== null) {
    const [, elementName, referencedType] = match;
    if (qualifiedNameValueTypes.has(referencedType)) {
      functionValueNodes.add(elementName);
    }
  }

  // Sort for consistent output
  return Array.from(functionValueNodes).sort();
}

/**
 * Extracts function/variable binding node names from the XSD schema.
 * Finds all elements whose type is v:Binding (Binding has function and variable attributes).
 * Uses [^>]* to stay within the same element tag and avoid matching across elements.
 */
function extractFunctionBindingNodes(xsdContent: string): string[] {
  const names = new Set<string>();
  // name then type, or type then name (attribute order varies)
  const nameFirst = /<element\s+name="([^"]+)"[^>]*type="v:Binding"[^>]*>/g;
  const typeFirst = /<element\s+[^>]*type="v:Binding"[^>]*name="([^"]+)"[^>]*>/g;
  let match: RegExpExecArray | null;
  while ((match = nameFirst.exec(xsdContent)) !== null) names.add(match[1]);
  while ((match = typeFirst.exec(xsdContent)) !== null) names.add(match[1]);
  return Array.from(names).sort();
}

/**
 * Extracts action-ref node names from the XSD schema.
 * Finds all elements whose type has an action attribute of type v:QualifiedName.
 */
function extractActionRefNodes(xsdContent: string): string[] {
  const actionRefNodes = new Set<string>();

  // Step 1: Find all complexTypes that have <attribute name="action" type="v:QualifiedName"
  const complexTypePattern = /<complexType\s+name="([^"]+)">([\s\S]*?)<\/complexType>/g;
  const actionAttributeTypes = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = complexTypePattern.exec(xsdContent)) !== null) {
    const [, typeName, typeBody] = match;
    if (typeBody.includes('<attribute name="action" type="v:QualifiedName"')) {
      actionAttributeTypes.add(typeName);
    }
  }

  // Step 2: Find all elements that reference these complexTypes
  const elementPattern = /<element\s+name="([^"]+)"[\s\S]*?type="v:([^"]+)"[\s\S]*?>/g;
  while ((match = elementPattern.exec(xsdContent)) !== null) {
    const [, elementName, referencedType] = match;
    if (actionAttributeTypes.has(referencedType)) {
      actionRefNodes.add(elementName);
    }
  }

  return Array.from(actionRefNodes).sort();
}

async function main() {
  const dslCommonsPath = resolveDslCommonsPath();
  const xsdPath = path.join(dslCommonsPath, DEFAULT_VIEW_XSD_RELATIVE_PATH);

  if (!(await fs.pathExists(xsdPath))) {
    throw new Error(`XSD file not found at ${xsdPath}`);
  }

  const xsdContent = await fs.readFile(xsdPath, "utf8");
  const functionValueNodes = extractFunctionValueNodes(xsdContent);
  const functionBindingNodes = extractFunctionBindingNodes(xsdContent);
  const actionRefNodes = extractActionRefNodes(xsdContent);

  const output = path.join(root, "generated/vxml/function-value-nodes.json");
  const data = {
    version: "0.1.0",
    extractedFrom: xsdPath,
    extractedAt: new Date().toISOString(),
    functionValueNodes,
    functionBindingNodes,
    actionRefNodes,
  };

  await fs.ensureDir(path.dirname(output));
  await fs.writeJson(output, data, { spaces: 2 });
  console.log(
    `Generated VXML metadata to ${output} (functionValue: ${functionValueNodes.length}, functionBinding: ${functionBindingNodes.length}, actionRef: ${actionRefNodes.length})`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
