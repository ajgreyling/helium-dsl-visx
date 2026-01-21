# Helium Rapid DSL rules for Cursor (`.mez`, `.vxml`, `.lang`)

This document is intended to be **copy/pasted into a Helium Rapid project’s `.cursorrules`** (or, in Cursor, edited via `cursorrules.md` which is a symlink to `.cursorrules`). Its purpose is to ensure AI-generated code is **syntactically valid** and **consistent with Helium’s tooling**.

Sources of truth used to derive these rules:
- Helium DSL grammar: `/Users/ajgreyling/code/appexec-dsl-commons/WebDSLParser-lib/src/main/antlr3/com/mezzanine/dsl/web/MezDSL.g`
- VXML schema: `/Users/ajgreyling/code/helium-dsl-visx/helium-vscode-tooling/assets/vxml/View.xsd`
- Linter rules: `/Users/ajgreyling/code/helium-dsl-visx/helium-dsl-language-server/src/linter/rules/*`
- Real project examples: `web-app/presenters/*.mez`, `web-app/views/*.vxml`, `web-app/lang/*.lang` (e.g. `munic-chat`)

## Non‑negotiables (all file types)

- **Never invent syntax**. If you are unsure a construct exists in the grammar/XSD, do not use it.
- **Keep files parseable at every step**. Prefer small, valid edits over large speculative refactors.
- **Prefer “declare → reference”**: create the `.mez` function/variable first, then reference it from `.vxml`, then add required `.lang` keys.
- **Avoid name collisions with keyword-like tokens** (see reserved names below).

## Helium Rapid DSL (`.mez`) — grammar-derived rules

### File structure (top-level)

The grammar is effectively:
- A file (“script”) is one or more top-level blocks: **persistence elements** and/or **one unit**.
- **Persistence elements** are: `object`, `persistent object`, `enum`, `validator`.
- A `unit` must appear **once** and (practically) be **last** in the file (the unit production consumes EOF).

**Rules:**
- Prefer **one top-level construct per file** (recommended for clarity).
- If combining: put **`object`/`enum`/`validator` blocks first**, and the **single `unit` last**.

### Identifiers, literals, and comments

- **ID**: `[A-Za-z_][A-Za-z0-9_]*`
- **ENUM_ID**: `[A-Z][A-Z_]*` (uppercase with underscores)
- **String literal**: `"..."` with backslash escapes (no newline inside).
- **String block**: `/% ... %/` (multi-line safe for large content).
- Comments:
  - `// ...` single-line
  - `/* ... */` multi-line

### Primitive types

Use only these primitive type keywords:
- `int`, `decimal`, `bigint`, `uuid`, `bool`, `blob`, `string`, `void`, `date`, `datetime`, `json`, `jsonarray`

Array types are written using `[]` immediately after the type name:
- `Employee[] employees;`
- `string[] names;`

### Persistence elements

#### Objects

Valid shape:

```mez
object Name {
    string attribute_name;
    @OneToMany OtherType relationshipName via aliasName;
    beforeCreate { ... }
    afterUpdate { ... }
}
```

Rules:
- `object Name { ... }` contains:
  - zero or more `attribute;`
  - zero or more `relationship;`
  - zero or more triggers (`beforeCreate`, `afterCreate`, `beforeUpdate`, `afterUpdate`, `beforeDelete`, `afterDelete`) each followed by a `{ ... }` code block (no trailing semicolon).
- Relationship multiplicity is one of: `@OneToOne`, `@ManyToMany`, `@ManyToOne`, `@OneToMany`.

#### Persistent objects

Valid shapes:
- `persistent object Name { ... }`
- `@Role("RoleName") persistent object Name { ... }`
- `@Restrict("RoleName", <selector>) persistent object Name { ... }`

Rules:
- `@Role(...)`, `@Restrict(...)`, `@NotTracked` are object-level annotations.
- Do not invent new annotations.

#### Enums

```mez
enum MY_ENUM {
    ValueOne,
    ValueTwo
}
```

Rules:
- Enum name must be an `ENUM_ID` (uppercase/underscore).
- Values are `ID`s, comma-separated.

#### Validators

```mez
validator myValidator {
    notnull();
    regex("^[0-9]+$");
    minlen(2);
}
```

Only these atomic validators exist:
- `notnull()`
- `regex("...")`
- `maxlen(int)`, `minlen(int)`
- `maxval(int|decimal)`, `minval(int|decimal)` (may be negative)

### Units

Valid shape:

```mez
unit MyUnit;

// unit variables (0+)
bool showDetails;
Employee selectedEmployee;
Employee[] employees;

// functions (1+)
void init() {
    Mez:log("MyUnit");
}
```

Rules:
- The unit header is exactly: `unit UnitName;`
- After the header:
  - zero or more **unit variable declarations** (must end with `;`)
  - one or more **function definitions**
- Function signature:
  - `ReturnType functionName(...) { ... }`
  - Parameter list is `Type name` comma-separated (or empty).

### Statements and expressions (only what the grammar supports)

Allowed “complex statements”:
- `if (...) { ... } else if (...) { ... } else { ... }`
- `for ( init? ; comparison? ; post? ) { ... }`
- `foreach ( Type name : expression ) { ... }`
- `try { ... } catch (ExceptionName) { ... } finally { ... }`
- `throw expression;`

Allowed “simple statements” (semicolon-terminated):
- variable declaration: `Type name;`
- variable declare+init: `Type name = expression;`
- assignment: `lhs = expression;` where `lhs` is a **simple access expression** (see below)
- increment/decrement: `name++;` / `name--;`
- function call: `fn(args...);` or `UnitName:fn(args...);`
- BIF/member BIF statements (see below)
- `return;` or `return expression;`

Allowed expression operators:
- Arithmetic: `+ - * / %`
- Comparisons: `< <= > >=`
- Equality: `== !=`
- Boolean: `&& ||`
- Unary minus: `-expr`

### Access expressions (important limitation)

The grammar’s “accessExpression” is intentionally limited:
- Variable: `name`
- Attribute: `obj.attr`
- Unit variable: `UnitName:name`
- Unit attribute: `UnitName:obj.attr`

**Rule:** if you need deeper navigation (e.g. `a.b.c.d`), introduce locals:

```mez
SomeType b = a.b;
SomeOtherType c = b.c;
```

### Built-in functions and special reserved names

The lexer defines many keyword-like tokens that are **not ordinary IDs**. You must treat them as reserved and avoid defining user symbols with these names unless you explicitly want the special meaning.

**Especially important reserved names:**
- `invite` and `select` (they are special function tokens; `invite` is also a special instance/member call)
- JSON member methods: `jsonGet`, `jsonPut`, `jsonRemove`, `jsonContains`, `jsonKeys`
- Collection member methods: `clear`, `append`, `prepend`, `sortAsc`, `sortDesc`, `add`, `remove`, `pop`, `drop`, `length`, `first`, `last`, `get`, `select`

**Namespaces / BIF call patterns you may use (examples):**
- System / Mez: `Mez:log(expr)`, `Mez:warn(expr)`, `Mez:error(expr)`, `Mez:now()`, `Mez:today()`
- API: `api:get(expr)`, `api:post(expr)`, `api:put(expr)`, `api:delete(expr)`, `api:setStatusCode(expr)`
- SQL: `sql:query(expr, param1, ...)`, `sql:execute(expr, param1, ...)`
- String: `String:concat(a, b, ...)`, `String:replaceAll(s, a, b)`, `String:regexMatch(s, pat)`, etc.
- Math: `Math:round(x, dp)`, `Math:random()`, `Math:sqrt(x)`
- Date: `Date:now()`, `Date:addDays(d, n)`, etc.
- Persistence style: `Type:new()`, `Type:all()`, `Type:read(id)`, `Type:delete(id)`, `Type.save()`
- JSON member calls (receiver must be an accessExpression): `someJson.jsonPut(key, value)`

## Helium View XML (`.vxml`) — XSD-derived rules

### Root + namespace

The root element is `<ui>` in namespace `http://uiprogram.mezzanine.com/View`.

Use this exact, schema-friendly header:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ui xmlns="http://uiprogram.mezzanine.com/View"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://uiprogram.mezzanine.com/View View.xsd">
    <view label="view_heading.some_view" unit="SomeUnit" init="init">
        <!-- widgets -->
    </view>
</ui>
```

### Allowed view types under `<ui>`

Per the XSD, `<ui>` contains exactly one of:
- `<view>` (0..unbounded)
- `<sensorview>` (0..unbounded)
- `<globalview>` (exactly 1)

**Rule:** In normal projects, keep **one `.vxml` file per `<view>`** and do not mix view kinds in the same file.

### `QualifiedName` pattern (functions/variables)

Many attributes are `QualifiedName`, which must match:
- `([A-Za-z][A-Za-z0-9_]*:)?[A-Za-z][A-Za-z0-9_]*`

Meaning:
- `name`
- or `UnitName:name`

**Rules:**
- When referring to functions/variables in the same unit, prefer unqualified: `function="init"`, `variable="selectedLog"`.
- Only qualify with `UnitName:` when explicitly calling across units.

### Bindings

Bindings appear as elements like:
- `<visible function="someFn"/>` or `<visible variable="someVar"/>`
- `<collectionSource function="getRows"/>`
- `<binding variable="selectedLog"><attribute name="requestUrl"/></binding>`
- `<content variable="selectedLog"><attribute name="requestBody"/></content>`

**Rules:**
- For every `function="X"` in VXML, there must be a corresponding `.mez` function `X()` in the unit referenced by `view@unit`.
- For every `variable="Y"` in VXML, there must be a corresponding `.mez` unit variable `Y;` in that unit.
- For every `<attribute name="attr"/>` under a binding to an object, ensure `attr` is a valid model attribute name (when resolvable).

### Common widget elements (schema-defined)

The XSD declares common widget elements such as:
- `button`, `submit`, `textfield`, `textarea`, `table`, `gallery`, `datefield`, `select`, `map`, `break`, `checkbox`, `info`, `code`, `fileupload`, `filebrowser`, `wall`, `raw`
- plus view-level: `menuitem`, `navigation`, `action`

**Rule:** Only use elements that exist in the XSD; do not invent new widget tags.

### Cross-file requirements (.vxml ↔ .mez ↔ .lang)

When you add or modify a view:
- `view@unit` must match an existing/created `unit UnitName;` in the project (commonly under `web-app/presenters/`).
- `view@init` (if present) must exist as a function in that unit.
- Every `action="X"` must exist as a unit function `X(...)` (signature depends on action usage; default to no-arg unless project patterns demand parameters).
- Every label key referenced by `label="..."`, `title="..."`, `heading="..."`, `tooltip="..."` must exist in **all** `web-app/lang/*.lang` files.

## Translations (`.lang`) — format-derived rules

Observed format (examples in `web-app/lang/en.lang` and unit tests):
- One entry per line: `key=value`
- Whitespace around `=` may appear; keep it consistent.
- Lines starting with `#` are treated as comments in real projects; keep them as-is.
- Values may contain placeholders like `{variable}` or `{UnitName:var.attr}` and may include escaped newlines like `\\n`.

**Rules:**
- Do not introduce duplicate keys.
- When you add a new UI label key, add it to **all** language files in `web-app/lang/` (at minimum `en.lang`).
- Keep placeholders balanced (`{` must have a matching `}`) and reference real variables/functions where applicable.

## Strict lint-style constraints (must-follow for generated `.mez`)

These rules come from the language-server linter implementations in this repo. They are written here as **generation constraints** (even if some are toggled on/off internally over time).

### No variables declared in `else` blocks

Do **not** declare variables inside a plain `else { ... }` block.
- Declare before the `if`, or inside `if` branches only if permitted by your project rules.

### Forbidden operators and boolean condition policy

Do not use:
- Compound assignment: `+=`, `-=`, `*=`, `/=`, `%=`
- Ternary: `cond ? a : b`
- Negation: `!flag` (write explicit comparisons instead)

In `if (...)` conditions:
- Do **not** write `if (flag)` or `if (!flag)`.
- Write `if (flag == true)` or `if (flag == false)` (explicit comparison).

### Dot-notation depth: keep statements simple

Avoid chaining 3+ dot segments in a single **statement-level** access (especially for assignments or method calls).
- Instead, split into locals to keep parsing + tooling reliable.

### Naming conventions (recommended project policy)

These are common project conventions and may be enabled as lint rules:
- Units: **PascalCase** (`MyUnit`)
- Enums: **UPPERCASE** (`MY_ENUM`)
- Variables: **camelCase** (`selectedLog`)
- Attributes: **snake_case** (`mobile_number`)

## Authoring workflow (recommended for correctness)

When implementing a feature that touches UI:
- **Step 1**: Update/create presenter unit (`web-app/presenters/*.mez`): add unit variables and functions.
- **Step 2**: Update/create view (`web-app/views/*.vxml`): reference only existing unit functions/variables.
- **Step 3**: Update translations (`web-app/lang/*.lang`): add missing keys referenced from VXML (and keep them consistent across languages).

