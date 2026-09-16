---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/page-object.md
title: Page Objects
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/page-object.html
sourceHash: 1c0568177d5927e414882d02d73efcaaaf76ee46
codeCheckedAgainst: "6.7.13.0"
keywords: ["StorefrontCheckoutCart", "AdministrationPageTypes", "AdminPageObjects", "AdministrationPages.ts", "StorefrontPages.ts", "getCustomFieldCardLocators", "getSelectFieldListitem", "page objects", "page object model", "pom", "acceptance test suite", "ats", "locators"]
summary: ATS Playwright page objects - using them as fixtures, the modules folder for shared Page helpers, and registering a new page in AdministrationPages.ts.
lastBuilt: 2026-09-15
---
## What it is

Page objects in the Shopware Acceptance Test Suite (ATS) are simple collections of element locators, plus small helper methods, for Administration and Storefront pages. They are available as fixtures in Playwright tests.

## When to use

Writing acceptance tests that interact with Administration/Storefront pages through reusable locators, or contributing a new page object or shared helper to the ATS.

## Key steps / config

Use a page object like any fixture:

```TypeScript
import { test, expect } from './../BaseTestFile';

test('Storefront cart test scenario', async ({ StorefrontPage, StorefrontCheckoutCart }) => {
    await StorefrontPage.goto(StorefrontCheckoutCart.url());
    await expect(StorefrontCheckoutCart.grandTotalPrice).toHaveText('€100.00*');
});
```

The full list of page objects is in the ATS repository under `src/page-objects`.

Modules: the `modules` folder holds reusable utility functions operating on a Playwright `Page` passed as `page` parameter, e.g. `getCustomFieldCardLocators` (defined in `src/page-objects/administration/modules/CustomFieldCard.ts`, used in `ProductDetail.ts`) or `getSelectFieldListitem`. Add a module when it removes logic repeated across page objects.

Adding a page object: place it in the `administration` or `storefront` subfolder and register it in `AdministrationPages.ts` or `StorefrontPages.ts`:

```TypeScript
import { MyNewPage } from './administration/MyNewPage';

export interface AdministrationPageTypes {
    AdminProductDetail: ProductDetail;
    AdminMyNewPage: MyNewPage;
}

export const AdminPageObjects = {
    ProductDetail,
    MyNewPage,
}
```

## Essential identifiers

- `StorefrontPage`, `StorefrontCheckoutCart` (`url()`, `grandTotalPrice`)
- `AdministrationPageTypes`, `AdminPageObjects`, `FixtureTypes`
- `AdministrationPages.ts`, `StorefrontPages.ts`
- `getCustomFieldCardLocators`, `getSelectFieldListitem`, `modules` folder

## Gotchas

- Keep page objects minimal: locators and small helpers, not test logic.
- Administration page object fixtures are named with an `Admin` prefix (`AdminProductDetail`) in `AdministrationPageTypes`, while `AdminPageObjects` uses the class name.

## Code check (6.7.13.0)
- confirmed `frontend.checkout.cart.page` — Storefront cart page route behind the cart page object — vendor/shopware/storefront/Controller/CheckoutController.php:76
- unverified `StorefrontCheckoutCart` — ATS npm package, outside vendor/shopware
- unverified `AdministrationPageTypes` — ATS npm package, outside vendor/shopware
- unverified `AdminPageObjects` — ATS npm package, outside vendor/shopware
- unverified `getCustomFieldCardLocators` — not present in vendor/shopware; ATS package code
- unverified `getSelectFieldListitem` — not present in vendor/shopware; ATS package code
