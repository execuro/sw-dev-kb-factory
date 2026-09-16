---
id: platform/dev/6.7/resources/references/adr/2021-06-14-introduce-jest-fail-on-console.md
title: Introduce jest-fail-on-console
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-06-14-introduce-jest-fail-on-console.html
sourceHash: 962ba2943e137764228c6b07d857cc55d3d446f5
codeCheckedAgainst: "6.7.13.0"
keywords: ["jest-fail-on-console", "jest", "unit tests", "administration tests", "console.error", "console.warn", "jest.spyOn", "failing test on warning", "mocking", "v-for key", "adr"]
summary: "ADR: administration Jest unit tests fail when they log a console error or warning (jest-fail-on-console); components, mixins and API calls must be mocked."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (administration area) introducing the npm package `jest-fail-on-console` for the administration Jest suite. With it, an individual unit test fails if it logs an error or a warning to the console.

## When to use

- Writing or fixing administration Jest tests that fail although all assertions pass, because the component logs a warning or error.
- Understanding why admin specs need complete stubs, mocks and mixins.

## Key steps / config

Background: a Jest pipeline run previously produced hundreds of errors and warnings, making it hard to see why a test failed or whether a passing test was a false positive.

Consequences for test authors:

1. Provide every component the tested component needs, either mocked or built.
2. Mock all API requests.
3. Provide all needed mixins.
4. Do not ignore console output; fix its cause. Where a spec intentionally triggers a warning, installed admin test helpers mute it explicitly with `jest.spyOn(console, 'warn').mockImplementation(() => {})` and restore it afterwards with `mockRestore()`.

## Gotchas

- Mistakes that previously went unnoticed now fail the test, e.g. an incorrect key in a `v-for` loop that could lead to Vue update errors.
- Tests are somewhat harder to write, since errors cannot simply be ignored; the ADR accepts this for more expressive tests and a clean console.

## Code check (6.7.13.0)
- confirmed `jest.spyOn(console, 'warn')` — admin spec helper mutes an intentional warning and restores it — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.spec/native-block-condition.fixtures.js:150
- unverified `jest-fail-on-console` — registered in the Jest setup/package files outside the administration src root, out of scope
