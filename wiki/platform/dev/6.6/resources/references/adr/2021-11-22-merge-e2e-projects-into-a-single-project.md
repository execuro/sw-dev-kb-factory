---
id: platform/dev/6.6/resources/references/adr/2021-11-22-merge-e2e-projects-into-a-single-project.md
title: Merge E2E projects into a single project
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-11-22-merge-e2e-projects-into-a-single-project.html
sourceHash: c439dfb45700238c48afc475002e29353eea8c4d
keywords: ["E2E tests", "cypress", "tests/E2E", "end-to-end testing", "storefront tests", "administration tests", "recovery tests", "cleanUpPreviousState", "commands.js", "test fixtures", "merge projects"]
summary: ADR merging three separate Cypress E2E projects (storefront, administration, recovery) into one shared tests/E2E project.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record consolidating three separately maintained Cypress end-to-end test projects into a single project to remove duplicated commands and setup code.

## When to use
Relevant when writing or locating Cypress E2E tests, or when the ownership/location of E2E test folders is unclear.

## Key steps / config
The merge moves tests into a new `E2E` project under `tests/E2E`:
- storefront tests to `tests/E2E/cypress/integration/storefront`
- administration tests to `tests/E2E/cypress/integration/administration`
- recovery tests to `tests/E2E/cypress/integration/recovery`
- new package test scenarios to `tests/E2E/cypress/integration/scenarios`
- `commands.js` files are merged and duplicate code removed
- setup code and fixtures are merged
- global setup uses automatic cleanup instead of manual calls to `cleanUpPreviousState` in admin tests

## Essential identifiers
- `tests/E2E` (merged project root)
- `cleanUpPreviousState` (replaced by automatic cleanup in global setup)

## Gotchas
- Command and support code are now shared across all tests, so ownership of the shared project code is shared among component teams while individual tests remain owned by solution teams.
- CI pipelines and the commands used to run the E2E tests need to be updated after the merge.
