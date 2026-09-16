---
id: platform/dev/6.7/guides/development/testing/legacy/cypress/_index.md
title: Cypress
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/legacy/cypress/
sourceHash: 746beada81ac8b3576b9b07142759681b57ea8ba
codeCheckedAgainst: "6.7.13.0"
keywords: ["@shopware-ag/e2e-testsuite-platform", "cypress", "createDefaultFixture", "AdminFixtureService", "cy.fixture", "composer run e2e:setup", "composer run e2e:open", "CYPRESS_baseUrl", "cypress.json", "e2e tests", "end-to-end testing", "legacy", "fixtures"]
summary: Legacy Cypress E2E testing for Shopware - e2e-testsuite-platform setup in plugins, composer e2e scripts, folder layout, fixtures and fixture services.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/testing-reference/e2e-commands.md", "platform/dev/6.7/resources/references/testing-reference/e2e-custom-commands.md", "platform/dev/6.7/resources/references/core-reference/commands-reference.md", "platform/dev/6.7/guides/development/testing/unit/php-unit.md"]
---
## What it is

Legacy guide for end-to-end (E2E) tests of Shopware 6 with Cypress and the `@shopware-ag/e2e-testsuite-platform` package (repository archived at https://github.com/shopwareArchive/e2e-testsuite-platform), which adds Shopware-specific commands, helpers and API-based test data management. Built on Cypress plus the plugins cypress-select-tests, cypress-log-to-output and cypress-file-upload.

## When to use

When maintaining existing Cypress E2E tests in a plugin or the platform. Cypress is deprecated in the Shopware docs; new projects should use Playwright.

## Key steps / config

Prerequisites: a clean installation (`composer run init` initialises without demo data), production mode, and a theme assigned to the shop. Some commands expect viewport settings from `cypress.json` (the admin menu opens only on wide viewports).

Plugin setup in `Resources/app/<environment>/test/e2e` (environment = administration or storefront):

```text
Resources/app/<environment>/test/e2e/cypress/
  fixtures/  integration/  plugins/  support/
```

1. `npm init -y`, add `"scripts": { "open": "node_modules/.bin/cypress open" }`.
2. `npm install @shopware-ag/e2e-testsuite-platform`
3. `e2e/cypress/plugins/index.js`: `module.exports = require('@shopware-ag/e2e-testsuite-platform/cypress/plugins');`
4. `e2e/cypress/support/index.js`: `require('@shopware-ag/e2e-testsuite-platform/cypress/support');`
5. Run: `CYPRESS_baseUrl=<your-url> npm run open` (`<your-url>` = Storefront URL).

Platform project (Docker):
- `composer run e2e:setup` (outside container; prepares a clean installation and dependencies)
- `composer run e2e:prepare` (inside container; when the installation is already clean)
- `composer run e2e:open` (outside container; Test Runner)
- `composer e2e:cypress -- run --spec="cypress/e2e/administration/**/*.cy.js"` (or `storefront/**`)

Docker on Mac needs XQuartz with "Allow connections from network clients", then in the same terminal: `IP=$(ipconfig getifaddr en0)`, `DISPLAY=$IP:0`, `xhost + $IP` before creating the containers.

Tests: Mocha-style `describe()`/`it()`, BDD assertions (`should`/`expect`). Clean up state in `beforeEach`, not `after`. Platform tests go under `integration/` subfolders (`catalogue`, `content`, `customer`, `general`, `media-marketing`, `order`, `rule-product-stream`, `settings`) or CI ignores them.

Test data: JSON files in `e2e/cypress/fixtures` sent to the Admin API with `cy.createDefaultFixture('tax')` (signature `createDefaultFixture(endpoint, data = {}, jsonPath)`, merges `data` into the fixture). Entities needing existing IDs get a custom service in `e2e/cypress/support/service`:

```javascript
class ShippingFixtureService extends AdminFixtureService {
    setShippingFixture(userData) {
        // search 'rule' and 'delivery-time', then:
        // this.mergeFixtureWithData(userData, { availabilityRuleId, deliveryTimeId })
        // this.apiClient.post('/shipping-method?_response=true', finalShippingData)
    }
}
```

## Essential identifiers

- `@shopware-ag/e2e-testsuite-platform`
- `composer run e2e:setup`, `composer run e2e:prepare`, `composer run e2e:open`, `composer e2e:cypress`
- `CYPRESS_baseUrl`, `cypress.json`, `cypress.env.json`
- `cy.createDefaultFixture()`, `cy.fixture()`, `AdminFixtureService`, `FixturesService`, `mergeFixtureWithData()`
- `cypress/support/service/api.service.js`, `cypress/support/commands/api-commands.js`, `cypress/support/commands/fixture-commands.js`

## Gotchas

- The E2E API client uses its own axios-based `ApiService` instead of `cy.request`, because Cypress commands are not promises and fixture requests are parallelised.
- UUID-based IDs change between installations; do not use them as selectors.
- Fixtures should only use fields accessible in the UI/Storefront and stay compatible with every test in the file.
- To find required entity fields, read the `FieldCollection` of the entity definition (e.g. `CustomerDefinition`) or save an empty entity in the Administration and inspect the API error response.
- Mac: `DISPLAY` must be set before containers are created; changing it later has no effect until re-creation.
- See [e2e command reference](platform/dev/6.7/resources/references/testing-reference/e2e-commands.md) and [custom commands](platform/dev/6.7/resources/references/testing-reference/e2e-custom-commands.md).

## Version notes

- Cypress is listed under legacy testing and is deprecated/unmaintained; the suite repository and development template are in the shopwareArchive organisation.

## Code check (6.7.13.0)
- unverified `@shopware-ag/e2e-testsuite-platform` — external archived npm package, out of scope
- unverified `composer run e2e:setup` — platform repository composer script, not in the installed vendor packages
- confirmed `customer` — entity name of `CustomerDefinition` — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- confirmed `customerNumber` — required field used in the customer fixture — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:121
- confirmed `guest` — bool field used in the customer fixture — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:137
- confirmed `tax` — entity behind `createDefaultFixture('tax')` — vendor/shopware/core/System/Tax/TaxDefinition.php:28
- confirmed `availabilityRuleId` — shipping method FK merged by the custom service — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:81
- confirmed `deliveryTimeId` — required shipping method FK — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:83
- confirmed `_response` — query flag that makes the Admin API return the written entity — vendor/shopware/core/Framework/Api/Controller/ApiController.php:637
- confirmed `sw-grid__row--` — row class used as selector in the command example — vendor/shopware/administration/Resources/app/administration/src/app/component/grid/sw-grid/sw-grid.html.twig:112
