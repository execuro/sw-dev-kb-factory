---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/fixtures.md
title: Fixtures
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/fixtures.html
sourceHash: 7674a34104f5e3623dbcb35aa77f44a687983628
codeCheckedAgainst: "6.7.15.1"
keywords: ["playwright fixtures", "DefaultSalesChannel", "AdminApiContext", "StoreApiContext", "AdminPage", "StorefrontPage", "APIRequestContext", "login", "admin api client", "store api client", "src/fixtures", "acceptance test suite"]
summary: General ATS Playwright fixtures - DefaultSalesChannel, AdminApiContext, StoreApiContext (manual login), AdminPage, StorefrontPage - and adding new ones.
lastBuilt: 2026-10-20
---
## What it is

The general fixtures shipped with the Shopware Acceptance Test Suite (ATS) for Playwright: an isolated test sales channel, authenticated API clients for the Admin API and Store API, and page contexts for the Administration and Storefront. Each fixture is requested as an argument of the test function.

## When to use

Writing ATS tests that need a deterministic sales channel and customer, need to create test data or test endpoints through the Admin API or Store API, or need a logged-in Administration page.

## Key steps / config

`DefaultSalesChannel` (worker-scoped): creates a separate sales channel with default settings inside the standard Storefront, plus a default Storefront customer. Properties: `salesChannel`, `customer`, `url`.

`AdminApiContext`: Admin API client based on Playwright `APIRequestContext`; handles authentication itself. Methods: `get`, `post`, `patch`, `delete`, `fetch`, `head`.

```typescript
const response = await AdminApiContext.post('property-group?_response=1', {
  data: { name: 'Size', description: 'Size', displayType: 'text', sortingType: 'name',
          options: [{ name: 'Small' }, { name: 'Medium' }, { name: 'Large' }] },
});
expect(response.ok()).toBeTruthy();
```

`StoreApiContext`: Store API client, also based on `APIRequestContext`, calling on behalf of a Storefront user. Methods: `login(user)` (logs a customer in and keeps the login state for later requests), `get`, `post`, `patch`, `delete`, `fetch`, `head`.

```typescript
await StoreApiContext.login(DefaultSalesChannel.customer);
const response = await StoreApiContext.post('checkout/cart', { data: { name: 'default-customer-cart' } });
```

`AdminPage`: Playwright page for the Administration with a newly created admin user and authenticated session, e.g. `await AdminPage.goto('#/sw/product/index')` then assert `.sw-product-list__add-physical-button` is visible. Usually wrapped by a page object rather than used directly.

`StorefrontPage`: Playwright page for the Storefront of the default sales channel.

Adding fixtures: create them in `src/fixtures` and merge them in `/src/index.ts`.

## Essential identifiers

- `DefaultSalesChannel` (`salesChannel`, `customer`, `url`)
- `AdminApiContext`, `StoreApiContext`, `StoreApiContext.login(user)`
- `AdminPage`, `StorefrontPage`
- `APIRequestContext` (Playwright)
- `src/fixtures`, `/src/index.ts`

## Gotchas

- Unlike `AdminApiContext`, `StoreApiContext` does not log in automatically, because a Storefront user is not necessarily registered — call `login` when you need a registered customer.
- The `?_response=1` query on the Admin API write makes the API return the written entity instead of an empty response.

## Code check (6.7.15.1)
- unverified `DefaultSalesChannel` — fixture of the external acceptance-test-suite package, out of scope
- unverified `AdminApiContext` — ATS fixture, out of scope
- confirmed `_response` — without this query parameter the Admin API write returns no content — vendor/shopware/core/Framework/Api/Controller/ApiController.php:637
- confirmed `display_type` — `displayType` is a required property group field — vendor/shopware/core/Content/Property/PropertyGroupDefinition.php:87
- confirmed `sorting_type` — `sortingType` is a required property group field — vendor/shopware/core/Content/Property/PropertyGroupDefinition.php:88
- confirmed `/store-api/checkout/cart` — accepts GET and POST — vendor/shopware/core/Checkout/Cart/SalesChannel/CartLoadRoute.php:39
- confirmed `/store-api/account/login` — Store API customer login route used by a login call — vendor/shopware/core/Checkout/Customer/SalesChannel/LoginRoute.php:38
- confirmed `sw-product-list__add-physical-button` — button class in the product list — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-list/sw-product-list.html.twig:53
- confirmed `index` — `sw.product.index` route path for `#/sw/product/index` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:135
