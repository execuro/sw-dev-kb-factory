---
id: platform/dev/6.7/resources/references/adr/2025-02-06-deprecate-iterator-iterate.md
title: Deprecate Iterator.helper in Storefront JS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-02-06-deprecate-iterator-iterate.html
sourceHash: c0cf9c5cec179c0891bfc70dbf3a91991aca3b86
codeCheckedAgainst: "6.7.13.0"
keywords: ["Iterator.iterate()", "src/helper/iterator.helper.js", "Iterator", "storefront js", "iterator helper", "forEach", "NodeList", "FormData", "native loops", "deprecation", "v6.8.0", "adr"]
summary: "ADR: Storefront JS helper src/helper/iterator.helper.js (Iterator.iterate()) is deprecated for v6.8.0; use native loops such as forEach instead."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-02-06, area framework) deprecating the Storefront JavaScript helper class `src/helper/iterator.helper.js` and its `Iterator.iterate()` method in favour of native JavaScript iteration.

## When to use

- You write or maintain Storefront JS plugins that import the iterator helper and want to stay compatible with 6.8.
- You review Storefront JS and need to know which loop style is expected.

## Key steps / config

Use the native loop that fits the data type instead of the generic helper. The installed helper only wraps these native calls:

- Arrays, `Map`, `NodeList`: `source.forEach(callback)`
- `HTMLCollection`: `Array.from(source).forEach(callback)`
- `FormData`: `for (const [key, value] of formData.entries()) { ... }`
- Plain objects: `Object.keys(obj).forEach(...)` (or `Object.entries`)

The helper's callback signature was `(value, key)`, which matches `Map`/array `forEach`.

Reasons stated in the ADR: the helper is an unnecessary abstraction over native `forEach`, hides the appropriate loop for the data type, is Shopware-specific syntax that must be learned, is used inconsistently alongside native loops, suggests the data is a special object (in ~90% of cases it is a plain `NodeList`), and adds an extra import to every file.

## Gotchas

- The helper file `src/helper/iterator.helper.js` still ships in 6.7 but core Storefront sources no longer call `Iterator.iterate()`; third-party code importing it will break once it is removed.
- The ADR refers to `2025-01-28-use-native-iteration-instead-of-iterator-helper.md` for the changelog and upgrade documentation.

## Version notes

- Deprecated with `@deprecated tag:v6.8.0` — removal is planned for 6.8.0.

## Code check (6.7.13.0)
- deprecated `Iterator` — class in src/helper/iterator.helper.js annotated `@deprecated tag:v6.8.0` — vendor/shopware/storefront/Resources/app/storefront/src/helper/iterator.helper.js:5
- deprecated `Iterator.iterate()` — method annotated `@deprecated tag:v6.8.0` — vendor/shopware/storefront/Resources/app/storefront/src/helper/iterator.helper.js:23
- confirmed `FormData` — helper iterates `source.entries()` calling callback(value, key) — vendor/shopware/storefront/Resources/app/storefront/src/helper/iterator.helper.js:32
- confirmed `NodeList` — helper delegates to native forEach — vendor/shopware/storefront/Resources/app/storefront/src/helper/iterator.helper.js:39
