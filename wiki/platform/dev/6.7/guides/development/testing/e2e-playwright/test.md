---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/test.md
title: Test Suite
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/test.html
sourceHash: 7f2749af9b0bf460593b7fc290923165a443e074
codeCheckedAgainst: "6.7.13.0"
keywords: ["SHOPWARE_VERSION", "SHOPWARE_BUILD_SOURCE", "PHP_VERSION", "docker compose up --wait shopware", "npx playwright test --ui", "TestDataService", "page objects", "acceptance test suite", "self tests", "test image", "playwright"]
summary: Testing the Shopware acceptance test suite itself - tests for page objects and TestDataService, run against a Docker image via SHOPWARE_VERSION.
lastBuilt: 2026-09-15
---
## What it is

Describes the `tests` folder of the Shopware Acceptance Test Suite repository, which validates the suite's own tooling (page objects and `TestDataService` methods), and how to run those tests against a Shopware Docker image.

## When to use

When contributing to the acceptance test suite: adding or changing a page object or a `TestDataService` method requires a test in `tests`, run locally against a specific Shopware version.

## Key steps / config

1. Add tests covering new/changed tooling:
   - Page objects: navigation, element visibility, interactions.
   - `TestDataService` methods: create/get/cleanup produce consistent results.

```typescript
await ShopAdmin.goesTo(AdminManufacturerCreate.url());
await ShopAdmin.expects(AdminManufacturerCreate.nameInput).toBeVisible();

const product = await TestDataService.createProductWithImage({ description: 'Test Description' });
expect(product.coverId).toBeDefined();
```

2. Start a pre-built image (published daily to the GitHub container registry, https://github.com/shopware/acceptance-test-suite/pkgs/container/acceptance-test-suite%2Ftest-image) by exporting its tag as `SHOPWARE_VERSION`:

```bash
SHOPWARE_VERSION=trunk docker compose up --wait shopware
```

3. If no pre-built image exists for the version, build one:

```bash
export PHP_VERSION="8.3"
export SHOPWARE_VERSION="v6.5.8.0"      # branch or tag
export SHOPWARE_BUILD_SOURCE="tag"      # "branch" or "tag"
docker compose up --attach-dependencies shopware
```

4. Run Playwright: `npx playwright test --ui`.

## Essential identifiers

- `SHOPWARE_VERSION`, `SHOPWARE_BUILD_SOURCE`, `PHP_VERSION`
- `docker compose up --wait shopware`
- `npx playwright test --ui`
- `ShopAdmin`, `AdminManufacturerCreate`, `TestDataService.createProductWithImage`

## Gotchas

- Available image tags change (daily builds); check the registry for which versions exist before exporting `SHOPWARE_VERSION`.
- `SHOPWARE_VERSION` is interpreted as a branch or tag depending on `SHOPWARE_BUILD_SOURCE` when building locally.

## Code check (6.7.13.0)
- unverified `ShopAdmin` — fixture of the external acceptance-test-suite package, out of scope
- unverified `AdminManufacturerCreate` — page object in the acceptance-test-suite package, out of scope
- unverified `createProductWithImage()` — acceptance-test-suite package, out of scope
- unverified `SHOPWARE_BUILD_SOURCE` — docker compose variable of the test-suite repository, out of scope
- confirmed `coverId` — product field asserted in the example — vendor/shopware/core/Content/Product/ProductDefinition.php:162
- confirmed `product_manufacturer` — entity behind the manufacturer create page — vendor/shopware/core/Content/Product/Aggregate/ProductManufacturer/ProductManufacturerDefinition.php:28
