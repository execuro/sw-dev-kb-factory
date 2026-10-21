---
id: platform/dev/6.7/resources/references/adr/2021-06-14-introduce-jest-fail-on-console.md
title: Introduce jest-fail-on-console
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-06-14-introduce-jest-fail-on-console.html
sourceHash: 962ba2943e137764228c6b07d857cc55d3d446f5
codeCheckedAgainst: "6.7.15.1"
keywords: ["jest-fail-on-console", "jest", "administration unit tests", "console error", "console warning", "failing tests", "test mocks", "v-for key", "vue update errors", "adr", "admin testing", "false positive tests"]
summary: "ADR 2021-06-14: Administration Jest unit tests use jest-fail-on-console, so any console error or warning logged during a test fails it."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area: administration, dated 2021-06-14) introducing the npm package `jest-fail-on-console` into the Administration's Jest unit-test setup. With it, an individual unit test fails as soon as it logs an error or a warning to the console.

## When to use

Read this when writing or debugging Administration Jest tests (Vue components, mixins, services) and a test fails only because something was written to `console.error`/`console.warn`, or when deciding why a test that "passes" in your head is red in the pipeline.

## Key steps / config

The decision itself is the rule: a test must run without any console error or warning. In practice that means, for the component under test:

1. Provide every needed child component, either as a mock/stub or as a really built component.
2. Mock all API requests the component triggers.
3. Provide all needed mixins.
4. Fix the cause of warnings rather than ignoring them, e.g. a wrong or missing `key` in a `v-for` loop, which can lead to Vue update errors but previously did not fail the test.

## Gotchas

- Before this ADR a Jest pipeline run produced hundreds of errors and warnings, which hid why a test failed and made passing tests possible false positives. Logged problems can no longer simply be ignored.
- Tests become somewhat harder to write, because all dependencies listed above must be supplied; the trade-off is more expressive tests and a clean console.

## Code check (6.7.15.1)
- unverified `jest-fail-on-console` — registered in the Administration's Jest setup/package files, outside the checked `src` root
- unverified `v-for` — example of a Vue template warning from the ADR, not a Shopware identifier
