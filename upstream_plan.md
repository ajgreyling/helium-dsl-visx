## Findings in `helium-dsl-visx` (hardcoded lists that *could* come from upstream)

- **TextMate generator hardcodes primitive types + “common” BIF namespaces**
  - File: `/Users/ajgreyling/code/helium-dsl-visx/helium-vscode-tooling/scripts/generate-textmate.ts`
  - Candidates to mine from upstream (or from grammar/BIF metadata instead of hardcoding):
    - `systemTypes` (primitive/system types)
    - `commonBifNamespaces` (baseline namespaces always treated as BIFs)
    - `keywordRegex` (hardcoded keyword set used to derive highlighting keywords)

```text
14:41:/Users/ajgreyling/code/helium-dsl-visx/helium-vscode-tooling/scripts/generate-textmate.ts
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
```

- **Semantic diagnostics has hardcoded fallback model-BIFs + fallback role implicit fields**
  - File: `/Users/ajgreyling/code/helium-dsl-visx/helium-dsl-language-server/src/semantic/diagnostics.ts`
  - These are explicitly “fallbacks” when generated metadata isn’t available, but they’re still duplicated value lists that could be mined from `appexec-dsl-commons`.

```text
39:67:/Users/ajgreyling/code/helium-dsl-visx/helium-dsl-language-server/src/semantic/diagnostics.ts
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
```

```text
311:313:/Users/ajgreyling/code/helium-dsl-visx/helium-dsl-language-server/src/semantic/diagnostics.ts
const ROLE_IMPLICIT_FIELDS =
  languageMetadata.roleImplicitFields ?? ["_firstNames", "_nickName", "_surname"];
```

## Upstream sources in `appexec-dsl-commons` that already contain “source-of-truth” lists

- **Completion “catalog” of keywords/types/BIFs/annotations**
  - File: `/Users/ajgreyling/code/appexec-dsl-commons/WebDSLParser-lib/src/main/java/com/mezzanine/dsl/web/completion/DslAppCompletionState.java`
  - Contains many arrays that overlap with (or could drive) your TextMate + language metadata:
    - `types`, `keywords`
    - namespaces/signatures for BIFs (`mezBif`, `mathBif`, `stringsBifs`, `dateBif`, `miscBifs`)
    - `validators`, `relationships`, `objectAnnotation`, `functionAnnotations`
    - model/persistence BIF signatures (`persistenceBif`)

```text
13:185:/Users/ajgreyling/code/appexec-dsl-commons/WebDSLParser-lib/src/main/java/com/mezzanine/dsl/web/completion/DslAppCompletionState.java
public static final String[] mezBif = new String[]{
  "Mez:alert(string)",
  // ...
};
public static final String[] types = new String[]{
  "int ",
  "decimal ",
  "uuid ",
  "blob ",
  "bool ",
  "string ",
  "date ",
  "datetime "
};
public static final String[] keywords = new String[]{
  "null",
  "true",
  "false",
  "via",
  "return",
  "object",
  "persistent",
  "validator",
  "function",
  "enum",
  "void "
};
```

- **Role/Identity implicit fields (already being mined by your tooling)**
  - File: `/Users/ajgreyling/code/appexec-dsl-commons/WebCompiler-lib/src/main/java/com/mezzanine/program/web/builder/BuiltinObjects.java`
  - Your `generate-language-metadata.ts` already mines `Identity.ATTRIBUTE_NAMES` from here; this is the upstream source for `roleImplicitFields`.

- **Other upstream “reserved lists / catalog-like” constants**
  - `/Users/ajgreyling/code/appexec-dsl-commons/WebCompiler-lib/src/main/java/com/mezzanine/program/web/compiler/BuiltinJasperParameters.java`
    - Reserved/supplied Jasper parameter names (string sets).
  - `/Users/ajgreyling/code/appexec-dsl-commons/WebCompiler-lib/src/main/java/com/mezzanine/program/web/compiler/SpecializedObjectTypes.java`
    - Large set of built-in/special object names + some convenience `String[]` attribute lists (`ATTRS`).
  - `/Users/ajgreyling/code/appexec-dsl-commons/WebCompiler-lib/src/main/java/com/mezzanine/program/web/compiler/SpecializedFunctions.java`
    - Specialized unit names + `UPDATE_PAYMENT_SPECIAL_METHODS` array.
  - `/Users/ajgreyling/code/appexec-dsl-commons/WebCompiler-lib/src/main/java/com/mezzanine/program/web/builder/BuiltinVariables.java`
    - Built-in variable names (“item”, “filteredCollection”, etc.) that could be used for completions / reserved identifiers (if you want).


