---
id: platform/dev/6.6/resources/references/adr/2023-04-14-jest-test-files-should-be-javascript-only.md
title: Jest test files should be JavaScript only
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-04-14-jest-test-files-should-be-javascript-only.html"
sourceHash: "c6705ad927908bef396e75c0e30fc1b47e1ebda5"
keywords: ["jest", "spec.js", "spec.ts", "typescript", "javascript", "administration tests", "eslint", "no-unused-vars", "vue-test-utils", "unit testing"]
summary: "ADR: Administration Jest tests standardize on *.spec.js files only; *.spec.ts is disallowed by an eslint rule."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record settling the Administration's Jest test file format on plain JavaScript (`*.spec.js`), ending the mix with TypeScript (`*.spec.ts`) test files.

## When to use
Relevant when writing or converting Jest unit tests in the Administration codebase and deciding whether to use `*.spec.js` or `*.spec.ts`.

## Key steps / config
At the time of the decision there were 46 `*.spec.ts` files versus 620 `*.spec.js` files. Reasons for standardizing on `*.spec.js`:
- The TypeScript eslint `no-unused-vars` rule was broken in Jest test files.
- No real type safety for components, since `vue-test-utils` types Vue components as `any`.
- Several editors lost Jest context for `*.spec.ts` files.
- The Jest config only added globals to `*.spec.js` files.
- TypeScript linting was already disabled for `*.spec.ts` files, making them effectively `*.spec.js` files anyway.

## Essential identifiers
- `*.spec.js`
- `*.spec.ts`
- `vue-test-utils`
- eslint `no-unused-vars` rule

## Gotchas
All existing `*.spec.ts` files were moved to `*.spec.js` and TypeScript-specific code removed; an eslint rule was added to block new `*.spec.ts` files from being introduced.
