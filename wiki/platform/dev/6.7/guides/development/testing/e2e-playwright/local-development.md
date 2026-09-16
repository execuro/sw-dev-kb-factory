---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/local-development.md
title: Local development
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/local-development.html
sourceHash: 9c3f1fcc1e2c44a94417608d8be35225d5f240fe
codeCheckedAgainst: "6.7.13.0"
keywords: ["TestDataService", "npm run build", "npx playwright test --ui", "tests/acceptance", "@shopware-ag/acceptance-test-suite", "shopware/acceptance-test-suite", "acceptance test suite", "ats", "page objects", "local development", "playwright ui mode", "Shopware default theme"]
summary: Developing ATS changes locally - build the acceptance-test-suite repo, copy dist into tests/acceptance node_modules, run npx playwright test --ui.
lastBuilt: 2026-09-15
---
## What it is

Workflow for changing the Shopware Acceptance Test Suite (ATS, repository `shopware/acceptance-test-suite`) and testing those changes against a local Shopware instance before a release of the package.

## When to use

You are adding or modifying ATS page objects, `TestDataService` methods or other ATS files and want to run a Shopware instance's acceptance tests against your unreleased build.

## Key steps / config

1. In the ATS repository, create or modify page objects, `TestDataService` methods or related files.
2. Build in the ATS repository: `npm run build` — artifacts are generated in `dist`.
3. Copy the artifacts into the Shopware instance's ATS package:
   `cp -R dist/* <path-to-your-shopware-instance>/tests/acceptance/node_modules/@shopware-ag/acceptance-test-suite/dist`
4. In the Shopware instance, adjust tests, page objects and `TestDataService` usages to match the ATS changes.
5. Run from the acceptance test directory:
   `cd tests/acceptance` then `npx playwright test --ui` — opens the Playwright Test Runner UI to select and run tests.

## Essential identifiers

- `TestDataService`
- `npm run build`, `dist`
- `tests/acceptance/node_modules/@shopware-ag/acceptance-test-suite/dist`
- `npx playwright test --ui`

## Gotchas

- The ATS assumes themes are compiled beforehand and that the Storefront uses the "Shopware default theme"; custom themes may break some locators.

## Code check (6.7.13.0)
- confirmed `Shopware default theme` — name of the bundled Storefront theme the ATS locators assume — vendor/shopware/storefront/Resources/theme.json:2
- confirmed `theme:compile` — console command to compile themes before running tests — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- unverified `TestDataService` — ATS npm package, outside vendor/shopware
- unverified `npx playwright test --ui` — Playwright CLI, outside vendor/shopware
- unverified `tests/acceptance` — project directory, not part of vendor/shopware
