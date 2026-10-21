---
id: platform/dev/6.7/resources/references/adr/2023-04-14-jest-test-files-should-be-javascript-only.md
title: Jest test files should be JavaScript only
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-04-14-jest-test-files-should-be-javascript-only.html
sourceHash: c6705ad927908bef396e75c0e30fc1b47e1ebda5
codeCheckedAgainst: "6.7.15.1"
keywords: ["jest", "*.spec.js", "*.spec.ts", "administration unit tests", "typescript tests", "javascript tests", "vue-test-utils", "@vue/test-utils", "eslint rule", "no-unused-vars", "admin", "adr"]
summary: "ADR 2023-04-14: Administration Jest tests written as *.spec.js rather than *.spec.ts; note 6.7.15.1 again ships TypeScript spec files."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-04-14, area admin) that settled the Administration's mix of JavaScript and TypeScript Jest test files on one format: `*.spec.js`. At the time there were 46 `*.spec.ts` and 620 `*.spec.js` files.

## When to use

- Deciding which file extension a new Administration Jest test should use, and understanding why the codebase contains so many `.spec.js` files.

## Key steps / config

Reasons the ADR gives against `*.spec.ts` files:

- The TypeScript eslint `no-unused-vars` rule is broken in Jest test files.
- No type safety for components, because `vue-test-utils` types any mounted Vue component as `any`.
- Several editors lose the Jest context for `*.spec.ts` files.
- The Jest config only added globals to `*.spec.js` files.
- TypeScript linting was disabled for `*.spec.ts` files anyway, so they behaved like `*.spec.js`.

Decision and consequences: use `*.spec.js` from then on; all existing `*.spec.ts` files were moved to `*.spec.js` with TypeScript-specific code removed, and an eslint rule was added to prevent new `*.spec.ts` files.

## Essential identifiers

- `*.spec.js` (chosen test file suffix)
- `@vue/test-utils` (component mounting in tests)

## Gotchas

- The installed 6.7.15.1 Administration source contains many `*.spec.ts` files again (stores, services, composables, component specs), so the "JavaScript only" rule is not what the current codebase follows; check the surrounding module's existing specs before choosing a suffix.

## Code check (6.7.15.1)
- corrected `describe` — docs: Jest specs are `*.spec.js` only; a TypeScript spec (`flow.store.spec.ts`) ships in 6.7.15.1 — vendor/shopware/administration/Resources/app/administration/src/module/sw-flow/store/flow.store.spec.ts:3
- corrected `mount` — docs: no `*.spec.ts` component tests; `sw-mail-header-footer-create.spec.ts` mounts via `@vue/test-utils` — vendor/shopware/administration/Resources/app/administration/src/module/sw-mail-template/page/sw-mail-header-footer-create/sw-mail-header-footer-create.spec.ts:5
- unverified `no-unused-vars` — eslint/Jest config lives outside the administration `src` root
