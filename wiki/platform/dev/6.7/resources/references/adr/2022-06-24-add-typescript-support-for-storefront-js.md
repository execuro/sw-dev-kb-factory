---
id: platform/dev/6.7/resources/references/adr/2022-06-24-add-typescript-support-for-storefront-js.md
title: Add typescript support for storefront javascript
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-06-24-add-typescript-support-for-storefront-js.html
sourceHash: 9d20eda8d76f7e3bdd0058cbcb0f071a141d6d42
codeCheckedAgainst: "6.7.15.1"
keywords: ["typescript", "@babel/preset-typescript", "swc-loader", "storefront javascript", ".ts", ".tsx", "storefront plugin", "webpack", "babel", "js ts interop", "storefront build"]
summary: "ADR: Storefront JS build accepts TypeScript (.ts/.tsx); TS and JS files import each other; public .js files are not replaced without deprecation."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-06-24) adding TypeScript support to the Storefront JavaScript stack, so the Storefront itself and Storefront plugins can be written in TypeScript while staying compatible with existing JavaScript plugins.

## When to use

When writing Storefront plugin JavaScript in TypeScript, or when deciding whether a core Storefront `.js` file can be expected to turn into `.ts`.

## Key steps / config

- TypeScript (`.ts` and `.tsx`) files are supported by the Storefront build; TypeScript and JavaScript files can be imported into each other, both inside the Storefront and in plugins.
- The ADR's approach was to add TypeScript language support to the existing Babel chain via `@babel/preset-typescript`, so the current Storefront stack does not break. In the installed 6.7 Storefront the webpack build transpiles `.js`/`.ts` with `swc-loader` using the TypeScript parser; `@babel/preset-typescript` remains in the Storefront's Babel config.
- The webpack resolver lists `.ts` and `.tsx` ahead of `.js`/`.jsx`, so extension-less imports resolve TypeScript files.
- Storefront core JavaScript is converted to `.ts` incrementally (e.g. `src/shopware.ts`, `src/component-system/component.ts`).

## Essential identifiers

- `@babel/preset-typescript`
- `swc-loader` with `jsc.parser.syntax: 'typescript'`
- File extensions `.ts`, `.tsx`

## Gotchas

- To avoid breaking existing plugins, publicly used `.js` files are not replaced by `.ts` files without a proper deprecation.

## Version notes

The installed webpack config notes that `useDefineForClassFields: false` restores the class-field behaviour that `@babel/preset-typescript` applied automatically in 6.5.x.

## Code check (6.7.15.1)
- corrected `swc-loader` — docs: TypeScript via the babel chain; webpack now uses swc-loader with typescript parser — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:124
- confirmed `@babel/preset-typescript` — still listed in the Storefront babel config — vendor/shopware/storefront/Resources/app/storefront/.babelrc.js:11
- confirmed `useDefineForClassFields` — set false to match 6.5.x preset-typescript behaviour — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:141
- confirmed `.tsx` — resolver extensions include .ts and .tsx — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:314
