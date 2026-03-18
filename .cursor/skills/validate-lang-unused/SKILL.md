---
name: validate-lang-unused
description: Check Helium project for unused translation keys in en.lang (keys not referenced from .mez String:translate or .vxml label-like attributes). Use when auditing en.lang, debugging noisy Problems on .lang files, or verifying diagnostics.unused.languageEntries behaviour.
---

# Validate unused `.lang` keys

## When to use

- User wants a count or sample of unused keys in `web-app/lang/en.lang`
- User sees many Info diagnostics on `.lang` and wants to understand scope
- After changing `diagnostics.unused.languageEntries` in `helium-rapid-dsl-project.json`

## Command

From **helium-dsl-visx/helium-dsl-language-server** (after `npm run build` or with `tsx`):

```bash
node --import=tsx ./scripts/validate-lang-unused.ts /absolute/path/to/dsl
```

Example: `/path/to/repo/dsl` (folder containing `helium-rapid-dsl-project.json`, `model/`, `web-app/`).

## Output

JSON with `unusedLangEntryCount` and `sampleMessages`. Keys referenced only in SQL, Jasper, or outside `.mez`/`.vxml` are **not** counted as used and may inflate the count.

## Config

- **`diagnostics.unused.languageEntries`**: `"None"` | `"Info"` | `"Warning"` | `"Error"` — default **Info** in new project templates.
- Omitting the key behaves as **Info**.

## IDE

Opening `en.lang` in Cursor with the Helium extension shows the same class of diagnostics in Problems (after project index completes).
