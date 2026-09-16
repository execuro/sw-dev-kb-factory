---
id: platform/dev/6.6/resources/references/testing-reference/e2e-custom-commands.md
title: Custom E2E Commands
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/testing-reference/e2e-custom-commands.html
sourceHash: dbd2560098311d4b8c399bce0911e3fd7911d9e5
keywords: ["Cypress", "E2E commands", "login", "typeAndCheck", "clickContextMenuItem", "storefrontApiRequest", "createProductFixture", "requestAdminApi", "fixture commands", "custom commands"]
summary: "Custom Cypress E2E commands for Shopware: login, typing, context menus, API requests, and fixture creation."
lastBuilt: "2026-09-15"
---

## What it is
Reference of custom Cypress commands available for Shopware end-to-end (E2E) tests, grouped into general UI commands, Storefront/Sales Channel API commands, system commands, API commands, and fixture commands.

## When to use
Consult this page when writing or debugging a Cypress E2E test and you need the exact custom command name, its parameters, and what it does — e.g. logging in, typing into `sw-select` fields, creating fixtures via the API, or resetting state between tests.

## Key steps / config
- General commands: `setLocaleToEnGb`, `login(userType)`, `typeAndCheck(textToType)`, `clearTypeAndCheck(textToType)`, `typeMultiSelectAndCheck(textToType, { searchTerm })`, `typeSingleSelect(textToType, selector)`, `typeSingleSelectAndCheck(textToType, selector)`, `typeLegacySelectAndCheck(textToType, { searchTerm })`, `typeAndCheckSearchField(searchTerm)`, `awaitAndCheckNotification(message)`, `clickContextMenuItem(actionInMenuSelector, openMenuSelector, scope = '')`, `clickMainMenuItem({ targetPath, mainMenuId, subMenuId })`, `openUserActionMenu(...)`, `dragTo(target)`, `onlyOnFeature(feature)`, `skipOnFeature(feature)`.
- Storefront / Sales Channel API: `getSalesChannelId`, `storefrontApiRequest(method, endpoint, header = {}, body = {})`, `getRandomProductInformationForCheckout`.
- System commands: `activateShopwareTheme`, `cleanUpPreviousState` (restores database, clears caches), `openInitialPage` (waits for the "me" call to succeed).
- API commands: `authenticate`, `loginViaApi`, `searchViaAdminApi(data)`, `requestAdminApi(method, url, requestData)`, `updateViaAdminApi(endpoint, id, data)`.
- Fixture commands: `setToInitialState`, `createDefaultFixture(endpoint, data = {}, jsonPath)`, `createProductFixture(userData = {})`, `createCategoryFixture(userData = {})`, `createSalesChannelFixture(userData = {})`, `setSalesChannelDomain(salesChannelName = 'Storefront')`, `createCustomerFixture(userData = {})`, `createCmsFixture(userData = {})`, `createPropertyFixture(options, userData)`, `createLanguageFixture`, `createShippingFixture(userData)`, `createSnippetFixture`, `createGuestOrder(productId, userData)`, `setProductFixtureVisibility(productName, categoryName)`.

## Essential identifiers
`login`, `typeAndCheck`, `clickContextMenuItem`, `clickMainMenuItem`, `storefrontApiRequest`, `authenticate`, `loginViaApi`, `requestAdminApi`, `createDefaultFixture`, `createProductFixture`
