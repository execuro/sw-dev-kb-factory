---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/local-development.md
title: Local development
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/local-development.html
sourceHash: 9c3f1fcc1e2c44a94417608d8be35225d5f240fe
codeCheckedAgainst: "6.7.15.1"
keywords: ["acceptance test suite", "ATS", "@shopware-ag/acceptance-test-suite", "shopware/acceptance-test-suite", "npm run build", "npx playwright test --ui", "tests/acceptance", "node_modules", "TestDataService", "page objects", "local ats development", "playwright e2e"]
summary: Local ATS development - build the suite, copy dist into tests/acceptance/node_modules of a Shopware instance, run npx playwright test --ui.
lastBuilt: 2026-10-21
---
## What it is

The workflow for changing the Shopware Acceptance Test Suite (ATS, repository `shopware/acceptance-test-suite`) and testing those changes against a local Shopware instance.

## When to use

You are adding or modifying ATS page objects, `TestDataService` methods or related files and want to run them in your own Shopware setup.

## Key steps / config

1. In the ATS repository, create or modify page objects, `TestDataService` methods or other files.
2. Build the package in the ATS repository: `npm run build` — artifacts land in `dist`.
3. Copy the artifacts into the Shopware instance's installed ATS package:
   ```bash
   cp -R dist/* <path-to-your-shopware-instance>/tests/acceptance/node_modules/@shopware-ag/acceptance-test-suite/dist
   ```
4. In the Shopware instance, adjust tests, page objects and `TestDataService` usages to match the ATS changes.
5. Run the tests from the acceptance test directory:
   ```bash
   cd tests/acceptance
   npx playwright test --ui
   ```
   This opens the Playwright Test Runner UI to select and run specific tests.

## Essential identifiers

- `shopware/acceptance-test-suite`, `@shopware-ag/acceptance-test-suite`
- `npm run build`, `dist`, `tests/acceptance/node_modules/@shopware-ag/acceptance-test-suite/dist`
- `npx playwright test --ui`
- `TestDataService`

## Gotchas

- ATS assumes themes are compiled beforehand (in core via `theme:compile`) and that the Storefront uses the Shopware default theme; custom themes may need locator adjustments.

## Code check (6.7.15.1)
- unverified `@shopware-ag/acceptance-test-suite` — external npm package, outside the vendor/shopware roots
- unverified `npx playwright test --ui` — Playwright CLI, out of scope
- unverified `TestDataService` — ATS class, out of scope
- confirmed `theme:compile` — console command compiling themes before tests — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- confirmed `BASE_THEME_NAME` — default theme technical name `Storefront` — vendor/shopware/storefront/Theme/StorefrontPluginRegistry.php:20
