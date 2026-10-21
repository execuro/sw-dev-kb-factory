---
id: platform/dev/6.7/resources/references/adr/2021-11-22-merge-e2e-projects-into-a-single-project.md
title: Merge E2E projects into a single project
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-11-22-merge-e2e-projects-into-a-single-project.html
sourceHash: c439dfb45700238c48afc475002e29353eea8c4d
codeCheckedAgainst: "6.7.15.1"
keywords: ["e2e", "end-to-end tests", "cypress", "tests/E2E", "cleanUpPreviousState", "commands.js", "fixtures", "e2e project merge", "storefront tests", "administration tests", "recovery tests", "adr"]
summary: "ADR (2021-11-22): merge the three separately maintained Cypress E2E projects of the platform into one project under tests/E2E with shared commands and setup."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record merging the platform's Cypress end-to-end test projects into a single project. At the time there were three E2E projects maintained separately, with many duplicated commands and diverging variants of them. Isolated component testing is hard in E2E anyway, since workflow-based tests naturally exercise other components too.

## When to use

Read this to understand the layout and ownership of the platform's Cypress E2E suite as decided in 2021, e.g. when encountering references to `tests/E2E` paths in older code or pipelines.

## Key steps / config

The merge was carried out by:

- creating a new project `E2E` in `tests/E2E`;
- moving storefront tests to `tests/E2E/cypress/integration/storefront`;
- moving administration tests to `tests/E2E/cypress/integration/administration`;
- moving recovery tests to `tests/E2E/cypress/integration/recovery`;
- moving the new package test scenarios to `tests/E2E/cypress/integration/scenarios`;
- merging the `commands.js` files and removing duplicate code;
- merging the setup code and the fixtures;
- using automatic cleanup in the global setup instead of manual `cleanUpPreviousState` calls in admin tests.

## Gotchas

- Ownership: command and support code are shared by all tests, so the project itself is owned jointly by the component teams; the tests themselves are written and maintained by the solution teams.
- The commands for running the E2E tests and the CI pipelines had to be updated after the merge.

## Code check (6.7.15.1)
- unverified `tests/E2E` — test project lives outside the vendor/shopware package roots
- unverified `cleanUpPreviousState` — Cypress helper, not present in the vendor/shopware package roots
