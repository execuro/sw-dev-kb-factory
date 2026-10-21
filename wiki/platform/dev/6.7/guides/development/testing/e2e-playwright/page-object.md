---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/page-object.md
title: Page Objects
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/page-object.html
sourceHash: 1c0568177d5927e414882d02d73efcaaaf76ee46
codeCheckedAgainst: "6.7.15.1"
keywords: ["page objects", "page object model", "StorefrontPage", "StorefrontCheckoutCart", "AdministrationPages.ts", "StorefrontPages.ts", "AdministrationPageTypes", "AdminPageObjects", "getCustomFieldCardLocators", "getSelectFieldListitem", "modules folder", "acceptance test suite", "playwright locators"]
summary: ATS page objects - fixture usage in Playwright tests, the modules folder for shared locator helpers, and registering new pages in AdministrationPages.ts.
lastBuilt: 2026-10-21
---
## What it is

Page objects in the Shopware Acceptance Test Suite (ATS) bundle page-specific element locators and small helper methods for Administration and Storefront pages. They are kept deliberately simple — mostly collections of locators — and are consumed like any other Playwright fixture.

## When to use

- Writing acceptance tests that navigate Administration or Storefront pages and need reusable selectors.
- Adding a new page object or shared locator helper to the ATS.

## Key steps / config

### Use a page object in a test

Request page objects as fixtures:

```TypeScript
test('Storefront cart test scenario', async ({ StorefrontPage, StorefrontCheckoutCart }) => {
    await StorefrontPage.goto(StorefrontCheckoutCart.url());
    await expect(StorefrontCheckoutCart.grandTotalPrice).toHaveText('€100.00*');
});
```

`StorefrontCheckoutCart.url()` targets the Storefront cart page. The full list of page objects is in the ATS repository under `src/page-objects` (https://github.com/shopware/acceptance-test-suite/tree/trunk/src/page-objects).

### Shared helpers: the `modules` folder

`modules` holds reusable utility functions that take a Playwright `Page` and operate on it, e.g. `getCustomFieldCardLocators` (defined in `src/page-objects/administration/modules/CustomFieldCard.ts`, used by `ProductDetail.ts`) or `getSelectFieldListitem`. Add a module class when it removes repeated logic across page objects.

### Add a new page object

Place it in the Administration or Storefront subfolder and register it in `AdministrationPages.ts` or `StorefrontPages.ts` — both in the type interface and the exported object:

```TypeScript
import { MyNewPage } from './administration/MyNewPage';

export interface AdministrationPageTypes {
    AdminProductDetail: ProductDetail;
    // [...]
    AdminMyNewPage: MyNewPage;
}

export const AdminPageObjects = {
    ProductDetail,
    // [...]
    MyNewPage,
}
```

## Essential identifiers

- `AdministrationPages.ts`, `StorefrontPages.ts`
- `AdministrationPageTypes`, `AdminPageObjects` (fixture names prefixed `Admin`, e.g. `AdminProductDetail`)
- `StorefrontPage`, `StorefrontCheckoutCart`, `ProductDetail`, `OrderDetail`, `CustomerListing`
- `getCustomFieldCardLocators`, `getSelectFieldListitem`, `modules`
- `FixtureTypes`

## Gotchas

- Keep logic out of page objects; they should mainly expose locators plus small helpers.

## Code check (6.7.15.1)
- unverified `AdminPageObjects` — ATS export, external npm package outside vendor/shopware
- unverified `getCustomFieldCardLocators` — ATS helper, out of scope
- unverified `StorefrontCheckoutCart` — ATS page object, out of scope
- confirmed `frontend.checkout.cart.page` — Storefront cart route `/checkout/cart` that the cart page object targets — vendor/shopware/storefront/Controller/CheckoutController.php:76
