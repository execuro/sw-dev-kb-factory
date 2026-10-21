---
id: platform/dev/6.7/resources/references/adr/2025-02-06-deprecate-iterator-iterate.md
title: Deprecate Iterator.helper in Storefront JS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-02-06-deprecate-iterator-iterate.html
sourceHash: c0cf9c5cec179c0891bfc70dbf3a91991aca3b86
codeCheckedAgainst: "6.7.15.1"
keywords: ["Iterator.iterate()", "iterator.helper.js", "storefront js", "storefront helper", "native loop", "forEach", "NodeList", "FormData", "HTMLCollection", "deprecation", "v6.8.0", "adr"]
summary: "ADR: the Storefront JS iterator helper and Iterator.iterate() are deprecated for v6.8.0; use native loops such as forEach instead."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2025-02-06, area framework) deprecating the Storefront JavaScript iterator helper class, which iterates over Maps, `FormData`, plain arrays and other objects, in favour of native JavaScript iteration.

## When to use

- Your Storefront plugin or theme JavaScript imports the core iterator helper.
- You write new Storefront JS and wonder which loop construct core expects.

## Key steps / config

Reasons for the deprecation given in the ADR:

- It is an unnecessary abstraction over native alternatives; often it only wraps a plain `forEach`.
- It keeps developers from choosing the appropriate loop for the data type.
- It is Shopware-specific syntax that must be learned and documented, whereas web standards are already documented.
- Usage across the codebase was inconsistent, mixed with native loops.
- It suggests the iterated data is a special object, while in about 90% of cases it is a plain `NodeList`.
- It adds an extra import to every file using it.

Replace each call with the native construct for the data type. The installed helper's own branches show the equivalents:

| Source type | Native replacement |
|---|---|
| `Map`, array, `NodeList` | `source.forEach(callback)` |
| `FormData` | `for (const [key, value] of source.entries())` |
| `HTMLCollection` | `Array.from(source).forEach(callback)` |
| plain object | `Object.keys(source).forEach(key => ...)` |

Note the callback order: the helper passed `(value, key)` for `FormData` and plain objects.

## Essential identifiers

- `forEach` — native replacement for Map, array and `NodeList`
- `FormData.entries()`, `Array.from()`, `Object.keys()` — native replacements for the other types

## Gotchas

- The deprecated helper is `src/helper/iterator.helper.js` (default export class `Iterator`) with the static method `Iterator.iterate()`; both carry `@deprecated tag:v6.8.0 - Use native alternatives like forEach instead.`
- The helper throws `The element type ... is not iterable!` for unsupported types; native loops fail differently, so check error handling when migrating.
- Core Storefront sources in 6.7 no longer call `Iterator.iterate()`; only third-party code still depends on the helper.

## Version notes

- Deprecated for removal in v6.8.0. The changelog and upgrade documentation are referenced as `2025-01-28-use-native-iteration-instead-of-iterator-helper.md`.

## Code check (6.7.15.1)
- deprecated `Iterator` — default export class of src/helper/iterator.helper.js, deprecated for v6.8.0 — vendor/shopware/storefront/Resources/app/storefront/src/helper/iterator.helper.js:5
- deprecated `Iterator.iterate()` — static iterate() method deprecated for v6.8.0 — vendor/shopware/storefront/Resources/app/storefront/src/helper/iterator.helper.js:21
- confirmed `FormData` — helper iterates entries() and calls callback(value, key) — vendor/shopware/storefront/Resources/app/storefront/src/helper/iterator.helper.js:32
- confirmed `NodeList` — helper delegates to native forEach — vendor/shopware/storefront/Resources/app/storefront/src/helper/iterator.helper.js:39
- confirmed `HTMLCollection` — helper uses Array.from().forEach — vendor/shopware/storefront/Resources/app/storefront/src/helper/iterator.helper.js:43
- unverified `Iterator.iterate()` callers — no call found in core Storefront src, third-party code out of scope
