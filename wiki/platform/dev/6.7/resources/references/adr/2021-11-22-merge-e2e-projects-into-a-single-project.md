---
id: platform/dev/6.7/resources/references/adr/2021-11-22-merge-e2e-projects-into-a-single-project.md
title: Merge E2E projects into a single project
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-11-22-merge-e2e-projects-into-a-single-project.html
sourceHash: c439dfb45700238c48afc475002e29353eea8c4d
codeCheckedAgainst: "6.7.13.0"
keywords: ["e2e", "end-to-end tests", "cypress", "tests/E2E", "cleanUpPreviousState", "commands.js", "fixtures", "adr", "test project", "storefront tests", "administration tests"]
summary: "ADR 2021-11-22: all Cypress E2E projects of the platform are merged into one project in tests/E2E with shared commands, setup and fixtures."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2021-11-22, area `core`, tags `e2e`, `cypress`) that merges the three separately maintained Cypress end-to-end test projects of the Shopware platform repository into one project. Motivation: duplicated commands with diverging variants, and E2E tests being workflow-based anyway, so isolating components was not realistic.

## When to use

When locating, writing or running Cypress E2E tests in the Shopware platform repository layout of that era, or when you need to know why storefront, administration and recovery E2E tests share one command/support code base.

## Key steps / config

The merge was defined as:

1. Create a new project `E2E` in `tests/E2E`.
2. Move storefront tests to `tests/E2E/cypress/integration/storefront`.
3. Move administration tests to `tests/E2E/cypress/integration/administration`.
4. Move recovery tests to `tests/E2E/cypress/integration/recovery`.
5. Move the new package test scenarios to `tests/E2E/cypress/integration/scenarios`.
6. Merge the `commands.js` files and remove duplicate code.
7. Merge the setup code and the fixtures.
8. Use automatic cleanup in the global setup instead of manual calls to `cleanUpPreviousState` in admin tests.

## Essential identifiers

- `tests/E2E`
- `tests/E2E/cypress/integration/{storefront,administration,recovery,scenarios}`
- `commands.js`
- `cleanUpPreviousState`

## Gotchas

- Command and support code is shared by all tests, so ownership of the project is shared among the component teams; the tests themselves are written and maintained by the solution teams.
- The commands to run the E2E tests and the CI pipelines had to be updated after the merge.
- These paths live in the Shopware development repository, not in the installed Composer packages.

## Code check (6.7.13.0)
- unverified `tests/E2E` — repository test directory, not shipped in vendor/shopware/{core,storefront} (no match found)
- unverified `cleanUpPreviousState` — Cypress test helper, no match in the administration src root; test tooling is out of scope
- unverified `commands.js` — Cypress support file in the development repository, out of scope of the installed packages
