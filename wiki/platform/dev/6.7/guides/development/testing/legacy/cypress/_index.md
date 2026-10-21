---
id: platform/dev/6.7/guides/development/testing/legacy/cypress/_index.md
title: Cypress
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/legacy/cypress/
sourceHash: 746beada81ac8b3576b9b07142759681b57ea8ba
codeCheckedAgainst: "6.7.15.1"
keywords: ["cypress", "e2e testing", "@shopware-ag/e2e-testsuite-platform", "composer run e2e:open", "composer run e2e:setup", "cy.createDefaultFixture", "AdminFixtureService", "FixturesService", "cypress.json", "fixtures", "api.service.js", "end-to-end tests", "legacy"]
summary: Legacy Cypress E2E testing for Shopware - e2e-testsuite-platform setup, composer e2e scripts, folder layout, fixtures and API-based fixture services.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/resources/references/testing-reference/e2e-commands.md", "platform/dev/6.7/resources/references/testing-reference/e2e-custom-commands.md", "platform/dev/6.7/resources/references/core-reference/commands-reference.md", "platform/dev/6.7/guides/development/testing/unit/php-unit.md"]
---
## What it is

The (legacy) guide to writing and running Cypress end-to-end tests for the Shopware platform and for plugins, using the `@shopware-ag/e2e-testsuite-platform` npm package, which adds Shopware commands, helpers and API-based test-data management on top of Cypress (plugins: `cypress-select-tests`, `cypress-log-to-output`, `cypress-file-upload`).

## When to use

When maintaining existing Cypress E2E tests in the platform or in a plugin's `Resources/app/<environment>/test/e2e` folder. Cypress is deprecated in the legacy section; new projects should use Playwright.

## Key steps / config

**Prerequisites**: a clean Shopware installation (no categories, products or settings) in production mode with a theme assigned. `composer run init` initialises without demo data; run `npm install` in the E2E folder (platform Administration: `src/Administration/Resources/app/administration/test/e2e`). Commands expecting viewport config (admin menu only opens on wide viewports) rely on the suite's `cypress.json`.

**Plugin setup**

1. Create `Resources/app/<environment>/test/e2e/cypress/{fixtures,integration,plugins,support}`.
2. In `test/e2e`, run `npm init -y`, add the script `"open": "node_modules/.bin/cypress open"`, then `npm install @shopware-ag/e2e-testsuite-platform`.
3. `e2e/cypress/plugins/index.js`: `module.exports = require('@shopware-ag/e2e-testsuite-platform/cypress/plugins');`
4. `e2e/cypress/support/index.js`: `require('@shopware-ag/e2e-testsuite-platform/cypress/support');`
5. Run: `CYPRESS_baseUrl=<your-url> npm run open` (`<your-url>` = Storefront URL).

**Platform project (Docker)**

- `composer run e2e:setup` (outside the container) prepares installation, environment and dependencies; `composer run e2e:prepare` (inside) only prepares an already clean install.
- `composer run e2e:open` opens the Test Runner; CLI: `composer e2e:cypress -- run --spec="cypress/e2e/administration/**/*.cy.js"` (or `.../storefront/**/*.cy.js`).
- On Mac, the Test Runner in the Cypress/Included image needs XQuartz (`brew install --cask xquartz`, enable "Allow connections from network clients", restart), then `IP=$(ipconfig getifaddr en0)`, `DISPLAY=$IP:0`, `xhost + $IP` in the same terminal session, before the containers are created.

**Folder roles**: `fixtures` (static JSON for `cy.fixture`), `integration` (`*.spec.js` files), `plugins`, `support` (custom commands); config in `cypress.json` and `cypress.env.json`. Platform tests must be placed under `integration/` in one of `catalogue`, `content`, `customer`, `general`, `media-marketing`, `order`, `rule-product-stream`, `settings`, otherwise CI ignores them.

**Test data**: create data via the Admin API in `beforeEach` (clean up before, not after). Services live in `cypress/support/service/` (`api.service.js` = axios interface, `admin-api.service.js`, `fixture.service.js`); commands in `cypress/support/commands/api-commands.js` and `fixture-commands.js`. `cy.createDefaultFixture('tax')` loads `fixtures/tax.json`, merges custom data and posts it. A custom service extends `AdminFixtureService`:

```javascript
class ShippingFixtureService extends AdminFixtureService {
    setShippingFixture(userData) {
        // this.search('rule', ...), this.search('delivery-time', ...)
        // this.mergeFixtureWithData(userData, { availabilityRuleId, deliveryTimeId })
        // this.apiClient.post('/shipping-method?_response=true', data)
    }
}
```

## Essential identifiers

- `@shopware-ag/e2e-testsuite-platform`, `cypress.json`, `cypress.env.json`
- `composer run e2e:setup`, `composer run e2e:prepare`, `composer run e2e:open`, `composer e2e:cypress`
- `cy.createDefaultFixture(endpoint, data, jsonPath)`, `cy.fixture()`
- `AdminFixtureService`, `FixturesService`, `ApiService` (`api.service.js`)
- `CustomerDefinition` — field list shows which customer data the API needs

## Gotchas

- Use fixture fields that are accessible in the UI/Storefront; all tests in a file may share a fixture.
- UUID-based IDs differ between installations; do not use them as selectors.
- The suite uses its own axios implementation instead of `cy.request`, because Cypress commands are not real promises and fixture fetching is parallelised.
- Test results on a development (non-production) environment may vary.
- See also [E2E commands](platform/dev/6.7/resources/references/testing-reference/e2e-commands.md) and [custom commands](platform/dev/6.7/resources/references/testing-reference/e2e-custom-commands.md).

## Version notes

Cypress is deprecated and no longer maintained; the platform's Cypress test suite package is archived.

## Code check (6.7.15.1)
- confirmed `CustomerDefinition` — entity definition for `customer` exists — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:60
- confirmed `ShippingMethodDefinition::ENTITY_NAME` — `shipping_method`, exposed as `/api/shipping-method` — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:44
- confirmed `availabilityRuleId` — optional FK on shipping method — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:84
- confirmed `deliveryTimeId` — Required FK on shipping method — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:86
- confirmed `DeliveryTimeDefinition::ENTITY_NAME` — `delivery_time`, resource name `delivery-time` — vendor/shopware/core/System/DeliveryTime/DeliveryTimeDefinition.php:28
- confirmed `str_replace` — entity names map to hyphenated API resource names — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:69
- confirmed `/api/search/` — POST search route per entity used by fixture services — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:109
- confirmed `_response` — query flag makes write responses return content — vendor/shopware/core/Framework/Api/Controller/ApiController.php:637
- confirmed `sw-grid__row--` — row class used in the command example — vendor/shopware/administration/Resources/app/administration/src/app/component/grid/sw-grid/sw-grid.html.twig:112
- unverified `@shopware-ag/e2e-testsuite-platform` — external npm package and composer e2e scripts are outside the scanned vendor roots
