---
id: platform/dev/6.7/resources/references/testing-reference/e2e-custom-commands.md
title: Custom E2E Commands
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/testing-reference/e2e-custom-commands.html
sourceHash: 072fcf7d1123796d474b3673261ea60b82e8bc5f
codeCheckedAgainst: "6.7.15.1"
keywords: ["cypress", "e2e", "end-to-end test", "custom commands", "login", "typeAndCheck", "typeSingleSelectAndCheck", "awaitAndCheckNotification", "storefrontApiRequest", "requestAdminApi", "createProductFixture", "createDefaultFixture", "cleanUpPreviousState", "onlyOnFeature", "test fixtures"]
summary: Custom Cypress E2E commands for Shopware - Admin UI, Storefront API, system, Admin API and fixture helpers with their parameters.
lastBuilt: 2026-10-21
---
## What it is

A reference list of the custom Cypress commands Shopware provides for end-to-end tests, grouped into general (Administration UI), Storefront / Sales Channel API, system, API and fixture commands. Each command is called as `cy.<command>(...)` with the parameters listed below.

## When to use

When writing or reading Cypress E2E tests for Shopware or an extension and you need to know which helper exists for logging in, filling `sw-select` fields, calling the Admin or Storefront API, or creating test data.

## Key steps / config

### General commands (Administration UI)

- `setLocaleToEnGb` — switch Administration UI locale to EN_GB.
- `login(userType)` — log in to the Administration manually.
- `typeAndCheck(textToType)` / `clearTypeAndCheck(textToType)` — type (after clearing) into an input and verify the content.
- `typeMultiSelectAndCheck(textToType, { searchTerm: searchTerm })` — multi `sw-select`.
- `typeSingleSelect(textToType, selector)` / `typeSingleSelectAndCheck(textToType, selector)` — single `sw-select`.
- `typeLegacySelectAndCheck(textToType, { searchTerm: searchTerm })` — legacy `swSelect`.
- `typeAndCheckSearchField(searchTerm)` — global search field, verifies search terms in the URL.
- `awaitAndCheckNotification(message)` — wait for a notification and check its message.
- `clickContextMenuItem(actionInMenuSelector, openMenuSelector, scope = '')` — trigger a context-menu action.
- `clickMainMenuItem({ targetPath, mainMenuId, subMenuId })` — navigate to a module via the main menu.
- `openUserActionMenu({ targetPath, mainMenuId, subMenuId })` — open the user menu.
- `dragTo(target)` — drag the previous subject to a target.
- `onlyOnFeature(feature)` / `skipOnFeature(feature)` — run or skip the test depending on an active feature flag.

### Storefront / Sales Channel API

- `getSalesChannelId` — sales channel ID via Admin API.
- `storefrontApiRequest(method, endpoint, header = {}, body = {})` — Storefront API request.
- `getRandomProductInformationForCheckout` — random product with id, name and URL.

### System

- `activateShopwareTheme` — activate the Shopware theme for the Cypress runner.
- `cleanUpPreviousState` — restore database and clear caches.
- `openInitialPage` — open the Administration and wait for the `me` call to succeed.

### API

- `authenticate`, `loginViaApi` — authenticate / log in silently via the Shopware API.
- `searchViaAdminApi(data)`, `requestAdminApi(method, url, requestData)`, `updateViaAdminApi(endpoint, id, data)`.

### Fixtures

- `setToInitialState` — reset Shopware when using the platform E2E backup routine.
- `createDefaultFixture(endpoint, data = {}, jsonPath)` — generic entity creation via API.
- `createProductFixture`, `createCategoryFixture`, `createSalesChannelFixture`, `createCustomerFixture`, `createCmsFixture` — each `(userData = {})`.
- `createPropertyFixture(options, userData)`, `createShippingFixture(userData)`, `createLanguageFixture`, `createSnippetFixture`.
- `setSalesChannelDomain(salesChannelName = 'Storefront')` — create a sales channel domain.
- `createGuestOrder(productId, userData)` — guest order fixture.
- `setProductFixtureVisibility(productName, categoryName)` — assign category and visibility so a product shows in the Storefront.

## Essential identifiers

`login`, `typeAndCheck`, `typeSingleSelectAndCheck`, `awaitAndCheckNotification`, `clickMainMenuItem`, `storefrontApiRequest`, `requestAdminApi`, `searchViaAdminApi`, `cleanUpPreviousState`, `setToInitialState`, `createDefaultFixture`, `createProductFixture`, `createGuestOrder`, `onlyOnFeature`, `skipOnFeature`

## Gotchas

- The source table lists `createSalesChannelFixture` as `(userData = {}` and `createGuestOrder` as `productId, userData)` — unbalanced parentheses in the docs; the intended signatures are `(userData = {})` and `(productId, userData)`.
- `setToInitialState` only works with the platform E2E backup routine.

## Code check (6.7.15.1)
- unverified `login` — Cypress commands are not defined in the core/storefront/administration src roots (no `Cypress.Commands.add` found); they ship in the separate E2E test-suite package, out of scope
- unverified `typeAndCheck` — not in the checked package roots; E2E test-suite package, out of scope
- unverified `storefrontApiRequest` — not in the checked package roots; E2E test-suite package, out of scope
- unverified `createProductFixture` — not in the checked package roots; E2E test-suite package, out of scope
- unverified `onlyOnFeature` — not in the checked package roots; E2E test-suite package, out of scope
- unverified `setLocaleToEnGb` — not in the checked package roots; E2E test-suite package, out of scope
