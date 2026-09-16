---
id: platform/dev/6.7/resources/references/adr/2023-04-14-jest-test-files-should-be-javascript-only.md
title: Jest test files should be JavaScript only
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-04-14-jest-test-files-should-be-javascript-only.html
sourceHash: c6705ad927908bef396e75c0e30fc1b47e1ebda5
codeCheckedAgainst: "6.7.13.0"
keywords: ["jest", "*.spec.js", "*.spec.ts", "administration tests", "unit test", "javascript", "typescript", "eslint", "vue-test-utils", "no-unused-vars", "adr", "test file format"]
summary: "ADR 2023-04-14: Administration Jest tests are written as *.spec.js only; *.spec.ts files were converted and an eslint rule blocks new ones."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (area: admin, 2023-04-14) settling the file format for Jest test files in the Shopware Administration: tests are written as JavaScript `*.spec.js` files, not TypeScript `*.spec.ts` files.

## When to use

When adding or migrating Jest unit tests for Administration components, services or modules, in core or following core conventions, and deciding which file extension and language to use.

## Key steps / config

- Name new Administration Jest test files `*.spec.js`.
- Do not add `*.spec.ts` files; an eslint rule was added that prevents new `*.spec.ts` files.
- When migrating an existing `*.spec.ts` file, rename it to `*.spec.js` and remove TypeScript-specific code (type annotations, type imports).

## Essential identifiers

- `*.spec.js` — the accepted Jest test file pattern
- `*.spec.ts` — the rejected pattern
- `vue-test-utils` — test library whose typings motivated the decision

## Gotchas

Reasons the ADR gives against `*.spec.ts` files:

- The TypeScript eslint `no-unused-vars` rule is broken in Jest test files.
- No type safety for components: `vue-test-utils` types any Vue component as `any`.
- Several editors lose the Jest context for `*.spec.ts` files.
- The Jest config only adds globals to `*.spec.js` files.
- TypeScript linting was already disabled for `*.spec.ts` files, so they behaved like `*.spec.js` anyway.

At decision time there were 46 `*.spec.ts` and 620 `*.spec.js` files; all `*.spec.ts` files were moved to `*.spec.js`.

## Code check (6.7.13.0)
- unverified `*.spec.ts` — the installed administration `src` ships no Jest spec files (no `*.spec.ts` found), so the migration cannot be checked against test sources
- unverified `*.spec.js` — no spec files present in the installed administration `src`; Jest config lives outside the checked roots
- unverified `no-unused-vars` — eslint configuration is not part of the checked vendor roots
