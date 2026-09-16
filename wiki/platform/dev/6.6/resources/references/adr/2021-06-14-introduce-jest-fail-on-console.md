---
id: "platform/dev/6.6/resources/references/adr/2021-06-14-introduce-jest-fail-on-console.md"
title: "Introduce jest-fail-on-console"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-06-14-introduce-jest-fail-on-console.html"
sourceHash: "962ba2943e137764228c6b07d857cc55d3d446f5"
keywords: ["jest-fail-on-console", "jest", "console.error", "console.warn", "unit test", "v-for key", "vue update errors", "mock", "mixin", "administration test", "API request mock"]
summary: "ADR: the jest-fail-on-console npm package fails a Jest test whenever it logs a console error or warning, forcing full mocking of dependencies."
lastBuilt: "2026-09-15"
---
## What it is

This ADR adopts the npm package `jest-fail-on-console` in the administration's Jest test suite, so that a unit test fails whenever it logs an error or warning to the console, instead of letting such output pass silently and pile up unnoticed.

## When to use

Relevant when writing or debugging Jest unit tests in the administration, or investigating why a previously-passing test starts failing after this change lands.

## Key steps / config

- The npm package `jest-fail-on-console` is introduced into the Jest pipeline.
- With it enabled, any `console.error` or `console.warn` call during a test run causes that individual test to fail, rather than merely cluttering the output.
- Because tests now fail on console noise, every component under test must be given all it needs: components must be mocked or fully built and provided, all API requests must be mocked, and all needed mixins must be supplied — otherwise administration/Vue internals may log warnings (missing props, unmocked requests, and similar) that now fail the test.

## Essential identifiers

- `jest-fail-on-console` (npm package)

## Gotchas

A test that appeared to pass before could have been a false positive masking an underlying problem — for example an incorrect key in a `v-for` loop can trigger a Vue update warning that, before this change, did not fail the test. After adopting `jest-fail-on-console`, such warnings must be fixed or the underlying console call addressed, since tests can no longer silently tolerate errors or warnings.

## Version notes

Prior to this ADR, a Jest pipeline run could produce hundreds of console errors and warnings that did not fail tests, making it hard to tell real failures from noise; after adoption, console output itself is treated as a test-failure signal.
