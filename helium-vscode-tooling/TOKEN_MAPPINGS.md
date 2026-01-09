# Helium DSL TextMate Token Mappings

This document lists all TextMate scope names used in the Helium DSL grammar and what syntax elements they map to. These scopes are designed to provide unique colors in Cursor Dark theme while remaining compatible with other themes like Solarized Dark and MonoKai.

## Token Scope Mappings

### Keywords & Control Flow
- **`keyword.control`** - Control keywords: `unit`, `validator`, `object`, `persistent`, `enum`, `foreach`, `for`, `if`, `else`, `return`
- **`storage.modifier`** - Modifiers: `persistent` (when used as modifier)

### Types & Storage
- **`storage.type`** - Primitive types: `int`, `decimal`, `bigint`, `uuid`, `blob`, `bool`, `string`, `void`, `date`, `datetime`, `json`, `jsonarray`
- **`entity.name.type`** - User-defined object/class names (in `object` and `persistent object` definitions)
- **`entity.name.type.enum`** - Enum type names (in `enum` definitions)

### Units & Namespaces
- **`support.class`** - Unit names (in `unit` definitions and unit references like `RoleDetails:`)
  - Example: `RoleDetails` in `RoleDetails:getPermissionsTable()`
  - Units are treated as classes/modules using `support.class` scope for better theme support

### Functions & Methods
- **`entity.name.function`** - Regular function names (in function definitions)
  - Example: `getRoleName` in `string getRoleName()`
- **`support.function`** - Methods/functions in unit references
  - Example: `getPermissionsTable` in `RoleDetails:getPermissionsTable()`
  - Uses `support.function` scope (distinct from `support.function.builtin`) for better theme support
- **`support.function.builtin`** - Built-in function namespaces and calls
  - Examples: `Mez:now`, `sql:query`, `String:concat`, `Math:sqrt`, `Date:now`, etc.

### Variables
- **`variable.other`** - Regular variables (in variable declarations)
  - Example: `role` in `movables_viewer role = ...`
- **`variable.parameter`** - Function parameters
  - Example: `webuser1` in `void inviteExisting(webuser webuser1, bool doInvite)`

### Constants
- **`constant.language`** - Language constants: `true`, `false`, `null`
- **`constant.numeric`** - Numeric literals (integers and decimals)
- **`constant.character.escape`** - Escape sequences in strings

### Strings
- **`string.quoted.double`** - Double-quoted strings: `"text"`
- **`string.quoted.block`** - Block strings: `/%text%/`

### Comments
- **`comment.line.double-slash`** - Single-line comments: `// comment`
- **`comment.block`** - Multi-line comments: `/* comment */`

### Operators
- **`keyword.operator.comparison`** - Comparison operators: `==`, `!=`, `>=`, `<=`, `>`, `<`
- **`keyword.operator.arithmetic`** - Arithmetic operators: `+`, `-`, `*`, `/`
- **`keyword.operator.assignment`** - Assignment operator: `=`

### Punctuation
- **`punctuation.separator`** - Separators: `,`
- **`punctuation.terminator`** - Terminators: `;`
- **`punctuation.accessor`** - Accessors: `.`
- **`punctuation.definition.block.begin`** - Block begin: `{`

## Color Differentiation Strategy

The key changes made to ensure unique colors in Cursor Dark:

1. **Unit Names**: Changed from `entity.name.type` to `support.class`
   - Units are like classes/modules, so `support.class` scope is semantically appropriate
   - `support.class` is widely supported by themes and provides distinct color from object/class types

2. **Unit Methods**: Changed from `entity.name.function` to `support.function`
   - Methods in unit references use `support.function` (distinct from `support.function.builtin`)
   - `support.function` is widely supported by themes and provides distinct color from regular functions

3. **Built-in Functions**: Uses `support.function.builtin`
   - Standard scope for built-in/library functions
   - Distinct from user-defined functions and unit methods

## Expected Colors in Themes

### Cursor Dark
- **`support.class`** (units): Should be distinct color (widely supported scope)
- **`support.function`** (unit methods): Should be distinct color (widely supported scope)
- **`entity.name.function`** (regular functions): Different from unit methods
- **`entity.name.type`** (objects/classes): Different from units
- **`support.function.builtin`** (BIFs): Distinct color for built-ins

### Solarized Dark
- Already working well with `RoleDetails` in dark red and `getPermissionsTable()` in blue

### MonoKai
- Should now differentiate between units and methods with the new scopes

## Token Usage Summary

| Syntax Element | TextMate Scope | Example |
|---------------|----------------|---------|
| Control keywords | `keyword.control` | `if`, `else`, `return` |
| Primitive types | `storage.type` | `int`, `string`, `bool` |
| Object/class names | `entity.name.type` | `movables_viewer`, `webuser` |
| Enum names | `entity.name.type.enum` | `STATUS_ACTIVE` |
| Unit names | `support.class` | `RoleDetails`, `Auditor` |
| Regular functions | `entity.name.function` | `getRoleName()` |
| Unit methods | `support.function` | `getPermissionsTable()` |
| Built-in functions | `support.function.builtin` | `Mez:now`, `String:concat` |
| Variables | `variable.other` | `role`, `enrollment` |
| Parameters | `variable.parameter` | `webuser1`, `doInvite` |
| Language constants | `constant.language` | `true`, `false`, `null` |
| Numbers | `constant.numeric` | `42`, `3.14` |
| Strings | `string.quoted.double` | `"text"` |
| Comments | `comment.line.double-slash` | `// comment` |
| Comparison ops | `keyword.operator.comparison` | `==`, `!=`, `>=` |
| Arithmetic ops | `keyword.operator.arithmetic` | `+`, `-`, `*`, `/` |
| Assignment op | `keyword.operator.assignment` | `=` |

## Notes

- Semantic tokens are disabled for unit references to allow TextMate grammar to handle them
- User-defined types are handled via semantic tokens (dynamic, workspace-based)
- The grammar uses standard TextMate scopes for maximum theme compatibility
- Pattern order matters: more specific patterns come before general ones
