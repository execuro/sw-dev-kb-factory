---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/test.md
title: Test Suite
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/test.html
sourceHash: 7f2749af9b0bf460593b7fc290923165a443e074
codeCheckedAgainst: "6.7.15.1"
keywords: ["acceptance-test-suite", "playwright", "TestDataService", "page objects", "AdminManufacturerCreate", "ShopAdmin", "SHOPWARE_VERSION", "SHOPWARE_BUILD_SOURCE", "PHP_VERSION", "docker compose", "npx playwright test", "e2e testing"]
summary: Testing the Playwright acceptance test suite itself - page object and TestDataService tests, Docker images via SHOPWARE_VERSION.
lastBuilt: 2026-10-21
---
## What it is

How to test the Shopware Playwright acceptance test suite repository itself: its own `tests` folder validates the tools and data (page objects, `TestDataService` methods) that the suite ships for use in other tests.

## When to use

When you contribute to the acceptance test suite (new page objects, new `TestDataService` methods, or changes to existing ones) and need to add tests and run them locally against a Shopware instance.

## Key steps / config

1. Add tests in the `tests` folder for every new feature or change:
   - **Page objects**: check navigation, element visibility and interactions.
   - **TestDataService methods**: check that create/get/cleanup of products, customers, orders etc. produce consistent results.

```TypeScript
await ShopAdmin.goesTo(AdminManufacturerCreate.url());
await ShopAdmin.expects(AdminManufacturerCreate.nameInput).toBeVisible();

const product = await TestDataService.createProductWithImage({ description: 'Test Description' });
expect(product.coverId).toBeDefined();
```

2. Start a Shopware container for the version under test. Pre-built images are published daily on the GitHub container registry of `shopware/acceptance-test-suite` (`test-image`); export the tag as `SHOPWARE_VERSION`:

```bash
SHOPWARE_VERSION=trunk docker compose up --wait shopware
```

3. If no pre-built image exists for the version, build one by exporting additional variables:

```bash
export PHP_VERSION="8.3"
export SHOPWARE_VERSION="v6.5.8.0"     # branch or tag
export SHOPWARE_BUILD_SOURCE="tag"     # "branch" or "tag"
docker compose up --attach-dependencies shopware
```

4. Run the tests with the normal Playwright commands, e.g. `npx playwright test --ui`.

## Essential identifiers

- `TestDataService`, `TestDataService.createProductWithImage()`
- `ShopAdmin.goesTo()`, `ShopAdmin.expects()`, `AdminManufacturerCreate.url()`
- Env vars: `SHOPWARE_VERSION`, `PHP_VERSION`, `SHOPWARE_BUILD_SOURCE`
- `docker compose up --wait shopware`, `npx playwright test --ui`

## Gotchas

- `SHOPWARE_VERSION` is interpreted as a branch or a tag depending on `SHOPWARE_BUILD_SOURCE`.
- Check which image tags exist before choosing one; images are rebuilt daily.

## Code check (6.7.15.1)
- confirmed `create` — Administration route `sw.manufacturer.create` (path `create`, component `sw-manufacturer-detail`) that `AdminManufacturerCreate` targets exists — vendor/shopware/administration/Resources/app/administration/src/module/sw-manufacturer/index.js:40
- unverified `TestDataService` — defined in the acceptance-test-suite npm package, outside the scanned vendor roots
- unverified `AdminManufacturerCreate` — page object from the acceptance-test-suite package, out of scope
- unverified `SHOPWARE_VERSION` — docker compose variable of the acceptance-test-suite repository, out of scope
- unverified `SHOPWARE_BUILD_SOURCE` — docker compose variable of the acceptance-test-suite repository, out of scope
