---
id: platform/dev/6.6/resources/references/adr/2022-06-24-add-typescript-support-for-storefront-js.md
title: Add typescript support for storefront javascript
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-06-24-add-typescript-support-for-storefront-js.html"
sourceHash: 9d20eda8d76f7e3bdd0058cbcb0f071a141d6d42
keywords: ["typescript", "storefront javascript", "@babel/preset-typescript", ".ts", ".tsx", "babel chain", "storefront plugins", "backwards compatibility", "deprecation", "ADR"]
summary: "Documents adding TypeScript to the Storefront via @babel/preset-typescript while keeping existing .js Storefront plugins working."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting the decision to add TypeScript support to the Shopware 6 Storefront JavaScript stack while keeping the existing plugin ecosystem, which was built without TypeScript, working unchanged.

## When to use

Relevant when writing new Storefront JavaScript/TypeScript code, or when a plugin developer wants to know whether existing `.js` Storefront plugin files can keep working alongside new `.ts` code.

## Key steps / config

- Context: the goal was to add TypeScript to the Storefront for developer experience, code quality and maintainability, while staying compatible with existing Storefront plugins built in earlier, non-TypeScript versions; `.ts` and `.js` files need to interoperate in both directions, both for the Storefront itself and for plugins.
- Decision: TypeScript language support was added to the existing babel build chain using the preset `@babel/preset-typescript`, rather than switching to a dedicated TypeScript compiler pipeline, to avoid breaking the current Storefront build.
- Decision: no publicly used `.js` file is replaced by a `.ts` file without going through a proper deprecation cycle first, specifically to avoid breaking existing Storefront plugins that depend on those files.
- Consequence: `.ts` and `.tsx` files are now supported by the Storefront build; Storefront plugins can be developed in TypeScript; existing Storefront JavaScript can be converted to `.ts` incrementally; and `.ts`/`.js` files remain importable from each other.

## Essential identifiers

- `@babel/preset-typescript`
- `.ts` / `.tsx` Storefront file support

## Gotchas

Public `.js` files used by Storefront plugins are never swapped for `.ts` files without a prior deprecation cycle, so plugin authors relying on a specific `.js` path should watch for deprecation notices rather than assume immediate replacement.
