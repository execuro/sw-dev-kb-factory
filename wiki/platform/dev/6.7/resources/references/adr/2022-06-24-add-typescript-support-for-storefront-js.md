---
id: platform/dev/6.7/resources/references/adr/2022-06-24-add-typescript-support-for-storefront-js.md
title: Add typescript support for storefront javascript
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-06-24-add-typescript-support-for-storefront-js.html
sourceHash: 9d20eda8d76f7e3bdd0058cbcb0f071a141d6d42
codeCheckedAgainst: "6.7.13.0"
keywords: ["typescript", "storefront javascript", "@babel/preset-typescript", "swc-loader", ".ts", ".tsx", "storefront plugin", "webpack", "babel", "js plugin", "adr"]
summary: "ADR: Storefront JS accepts TypeScript (.ts/.tsx) in core and plugins; the installed webpack build compiles it with swc-loader."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2022-06-24, area storefront) adding TypeScript support to the Storefront JavaScript stack without breaking existing JavaScript-based Storefront plugins.

## When to use

When writing Storefront JS plugins in TypeScript, importing between `.ts` and `.js` files, or checking how the Storefront build handles TypeScript.

## Key steps / config

- Decision: TypeScript language support was added to the existing babel chain via the preset `@babel/preset-typescript`. The preset is still listed in the storefront's `.babelrc.js` and `package.json`.
- In the installed 6.7 storefront `webpack.config.js`, `.ts`/`.js` sources are compiled by `swc-loader` with parser `syntax: 'typescript'` and `useDefineForClassFields: false` (a comment notes this restores what `@babel/preset-typescript` did in v6.5.x).
- Webpack resolves `.ts`, `.tsx`, `.js`, `.jsx` extensions, so TypeScript and JavaScript modules can import each other.
- Publicly used `.js` files are not replaced by `.ts` files without proper deprecation, so existing plugins keep working. Core Storefront JS is converted incrementally (e.g. `src/shopware.ts`, `src/component-system/component.ts`).

## Essential identifiers

- `@babel/preset-typescript`
- `swc-loader`
- file extensions `.ts`, `.tsx`

## Gotchas

- The swc loader rule's test is `/\.m?(t|j)s$/`, which matches `.ts`/`.js` but not `.tsx`, even though `.tsx` is a resolvable extension.

## Code check (6.7.13.0)
- confirmed `@babel/preset-typescript` — listed in storefront babel presets — vendor/shopware/storefront/Resources/app/storefront/.babelrc.js:11
- confirmed `@babel/preset-typescript` — devDependency 7.23.3 — vendor/shopware/storefront/Resources/app/storefront/package.json:76
- corrected `swc-loader` — docs: babel chain; 6.7 webpack compiles TS/JS with swc — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:124
- confirmed `useDefineForClassFields` — set false to match former babel behaviour — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:141
- confirmed `extensions` — resolves .ts and .tsx alongside .js — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:314
