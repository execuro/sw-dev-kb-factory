---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/fixtures.md
title: Fixtures
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/fixtures.html
sourceHash: 7674a34104f5e3623dbcb35aa77f44a687983628
codeCheckedAgainst: "6.7.13.0"
keywords: ["DefaultSalesChannel", "AdminApiContext", "StoreApiContext", "AdminPage", "StorefrontPage", "@shopware-ag/acceptance-test-suite", "playwright fixtures", "acceptance test suite", "ats", "e2e testing", "admin api client", "store api client", "src/fixtures"]
summary: Shopware ATS Playwright fixtures DefaultSalesChannel, AdminApiContext, StoreApiContext, AdminPage, StorefrontPage, and where to add new fixtures.
lastBuilt: 2026-09-15
---
## What it is

Reference for the general fixtures shipped by the Shopware Acceptance Test Suite (ATS, `@shopware-ag/acceptance-test-suite`) for Playwright: an isolated test sales channel, authenticated Admin-API and Store-API clients, and ready-to-use Administration/Storefront page contexts. Fixtures are requested as named arguments of a `test()` callback.

## When to use

Writing Playwright acceptance tests against a Shopware instance that need test data created via API, API assertions, or a logged-in Administration / Storefront browser page.

## Key steps / config

- `DefaultSalesChannel` (worker-scoped): creates a separate sales channel with default settings in the standard Storefront, including a default Storefront customer. Properties: `salesChannel`, `customer`, `url`.
- `AdminApiContext`: Admin-API client based on Playwright `APIRequestContext`; handles authentication automatically. Methods: `get`, `post`, `patch`, `delete`, `fetch`, `head`.
- `StoreApiContext`: Store-API client based on `APIRequestContext`, acting on behalf of a Storefront user. It does **not** log in automatically; call `login(user)` to log in a registered customer and keep the login state for later requests. Same HTTP methods as above.
- `AdminPage`: Playwright `page` for the Administration with a newly created admin user and authenticated session.
- `StorefrontPage`: Playwright `page` for the Storefront of the default sales channel.

Usage shape (property group values aligned with the installed code):

```TypeScript
import { test, expect } from './../BaseTestFile';

test('scenario', async ({ AdminApiContext, StoreApiContext, DefaultSalesChannel }) => {
    const res = await AdminApiContext.post('property-group?_response=1', {
        data: { name: 'Size', displayType: 'text', sortingType: 'alphanumeric', options: [{ name: 'Small' }] },
    });
    expect(res.ok()).toBeTruthy();
    await StoreApiContext.login(DefaultSalesChannel.customer);
    await StoreApiContext.post('checkout/cart', { data: { name: 'default-customer-cart' } });
});
```

`AdminPage` example: `await AdminPage.goto('#/sw/product/index');` then assert `.sw-product-list__add-physical-button` is visible.

Adding a fixture: create it in the ATS `src/fixtures` folder and merge it in `/src/index.ts`.

## Essential identifiers

- `DefaultSalesChannel` (`salesChannel`, `customer`, `url`)
- `AdminApiContext`, `StoreApiContext`, `StoreApiContext.login(user)`
- `AdminPage`, `StorefrontPage`
- Admin-API entity path `property-group`, query `_response`
- Store-API path `checkout/cart`
- `src/fixtures`, `/src/index.ts`

## Gotchas

- `StoreApiContext` requires an explicit `login()`; unauthenticated calls act as a guest, which is intentional for testing non-registered users.
- The source example posts `sortingType: 'name'`; the installed `PropertyGroupDefinition` only defines `alphanumeric` (default) and `position` sorting types. The field is a plain required string, so other values are stored but are not recognised values.
- Without `_response` in the query, the Admin-API write returns no content body.
- Direct `AdminPage` use is a rough example; normally a page object wraps the page.

## Code check (6.7.13.0)
- confirmed `property_group` — Admin-API entity behind `property-group` — vendor/shopware/core/Content/Property/PropertyGroupDefinition.php:25
- confirmed `displayType` — required API-aware field — vendor/shopware/core/Content/Property/PropertyGroupDefinition.php:84
- corrected `sortingType` — docs: example value 'name'; code defines only 'alphanumeric' (default) and 'position' — vendor/shopware/core/Content/Property/PropertyGroupDefinition.php:85
- confirmed `_response` — its absence yields a no-content write response — vendor/shopware/core/Framework/Api/Controller/ApiController.php:637
- confirmed `/store-api/checkout/cart` — Store-API cart route, GET and POST — vendor/shopware/core/Checkout/Cart/SalesChannel/CartLoadRoute.php:39
- confirmed `sw-product-list__add-physical-button` — button class in the product list page — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-list/sw-product-list.html.twig:53
- confirmed `sw-product-list` — component of the product module `index` route (`#/sw/product/index`) — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:132
- unverified `AdminApiContext` — defined in the ATS npm package, outside vendor/shopware
- unverified `StoreApiContext` — defined in the ATS npm package, outside vendor/shopware
- unverified `DefaultSalesChannel` — defined in the ATS npm package, outside vendor/shopware
