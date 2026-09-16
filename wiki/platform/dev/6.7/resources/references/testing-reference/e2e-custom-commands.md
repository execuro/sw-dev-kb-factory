---
id: platform/dev/6.7/resources/references/testing-reference/e2e-custom-commands.md
title: Custom E2E Commands
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/testing-reference/e2e-custom-commands.html
sourceHash: 072fcf7d1123796d474b3673261ea60b82e8bc5f
codeCheckedAgainst: "6.7.13.0"
keywords: ["cypress custom commands", "e2e", "login", "typeAndCheck", "typeSingleSelectAndCheck", "createProductFixture", "createDefaultFixture", "requestAdminApi", "storefrontApiRequest", "onlyOnFeature", "cleanUpPreviousState", "fixtures", "test helpers"]
summary: "Shopware Cypress custom E2E commands: login, typeAndCheck, createProductFixture, requestAdminApi, onlyOnFeature and more, with parameters."
lastBuilt: 2026-09-15
---
## What it is

Reference of the custom Cypress commands (`cy.<command>`) available in Shopware E2E tests, grouped as general UI, Storefront/Sales Channel API, system, API and fixture commands, with their parameters.

## When to use

When writing Cypress E2E tests for the Administration or Storefront and you need an existing helper for login, form input, navigation, API calls or test data fixtures.

## Key steps / config

**General commands**

- `setLocaleToEnGb` — switch Administration UI locale to EN_GB
- `login(userType)` — log in to the Administration manually
- `typeAndCheck(textToType)`, `clearTypeAndCheck(textToType)` — type (after clearing) and verify input
- `typeMultiSelectAndCheck(textToType, { searchTerm })` — sw-select multi select
- `typeSingleSelect(textToType, selector)`, `typeSingleSelectAndCheck(textToType, selector)` — sw-select single select
- `typeLegacySelectAndCheck(textToType, { searchTerm })` — legacy swSelect
- `typeAndCheckSearchField(searchTerm)` — global search, verifies term in URL
- `awaitAndCheckNotification(message)` — wait for notification and check text
- `clickContextMenuItem(actionInMenuSelector, openMenuSelector, scope = '')`
- `clickMainMenuItem({ targetPath, mainMenuId, subMenuId })` — navigate via main menu
- `openUserActionMenu({ targetPath, mainMenuId, subMenuId })` — open user menu
- `dragTo(target)` — drag previous subject onto target
- `onlyOnFeature(feature)` / `skipOnFeature(feature)` — run/skip test depending on an active feature flag

**Storefront / Sales Channel API**

- `getSalesChannelId` — via Admin API
- `storefrontApiRequest(method, endpoint, header = {}, body = {})`
- `getRandomProductInformationForCheckout` — random product with id, name, url

**System**

- `activateShopwareTheme` — activate Shopware theme for the runner
- `cleanUpPreviousState` — restore database and clear caches
- `openInitialPage` — open Administration and wait for the "me" call

**API**

- `authenticate`, `loginViaApi`
- `searchViaAdminApi(data)`, `requestAdminApi(method, url, requestData)`, `updateViaAdminApi(endpoint, id, data)`

**Fixtures**

- `setToInitialState` — reset to initial state using the platform E2E backup routine
- `createDefaultFixture(endpoint, data = {}, jsonPath)`
- `createProductFixture(userData = {})`, `createCategoryFixture(userData = {})`, `createSalesChannelFixture(userData = {})`, `createCustomerFixture(userData = {})`, `createCmsFixture(userData = {})`
- `setSalesChannelDomain(salesChannelName = 'Storefront')`
- `createPropertyFixture(options, userData)`, `createShippingFixture(userData)`
- `createLanguageFixture`, `createSnippetFixture`
- `createGuestOrder(productId, userData)`
- `setProductFixtureVisibility(productName, categoryName)` — category and visibility so the product shows in the Storefront

## Gotchas

- `setToInitialState` and `cleanUpPreviousState` rely on the database backup routine (`e2e:dump-db` / `e2e:restore-db`).
- The source table shows malformed parameter lists for `createSalesChannelFixture` and `createGuestOrder` (missing parentheses); the forms above are normalised.

## Code check (6.7.13.0)
- unverified `login` — Cypress support command not present in vendor/shopware core/storefront/administration src
- unverified `createProductFixture` — not found in the checked roots; ships with the E2E test suite package
- unverified `typeSingleSelectAndCheck` — not found in the checked roots
- unverified `onlyOnFeature` — not found in the checked roots
- unverified `setLocaleToEnGb` — not found in the checked roots
