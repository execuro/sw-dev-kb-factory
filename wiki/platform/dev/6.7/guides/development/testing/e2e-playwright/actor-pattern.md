---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/actor-pattern.md
title: Actor Pattern
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/actor-pattern.html
sourceHash: f70ca9f3487fb381ca780ba3ad3d563601f4ea9f
codeCheckedAgainst: "6.7.15.1"
keywords: ["actor pattern", "ShopCustomer", "ShopAdmin", "attemptsTo", "goesTo", "expects", "Task", "presses", "fillsIn", "selectsRadioButton", "a11y_checks", "mergeTests", "playwright task fixture", "acceptance test suite", "e2e test"]
summary: Shopware Acceptance Test Suite actor pattern - ShopCustomer/ShopAdmin actors, goesTo/attemptsTo/expects, Task fixtures and keyboard a11y methods.
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/development/testing/e2e-playwright/page-object.md"]
---
## What it is

The actor pattern in the Shopware Acceptance Test Suite (ATS) for Playwright: reusable, human-readable test logic built from three entities — an **Actor** (a user with a context performing actions), a **Task** (a reusable action the actor performs) and **Pages** (page objects the actor acts on, see [page objects](platform/dev/6.7/guides/development/testing/e2e-playwright/page-object.md)). It is optional; plain Playwright APIs stay usable.

## When to use

Writing Storefront or Administration E2E tests where steps like login, add-to-cart or payment selection recur across scenarios, and you want tests to read as "actor goes to page, attempts task, expects result".

## Key steps / config

Actor properties: `name` (human-readable name), `page` (the Playwright page context it navigates).

Actor primary methods:

- `goesTo(url)` — navigate to a page URL.
- `attemptsTo(task)` — run a task function; each task is wrapped in a Playwright test step automatically.
- `expects(...)` — one-to-one export of Playwright `expect`.

Default actors: `ShopCustomer` (Storefront user) and `ShopAdmin` (Administration user).

Accessibility methods (keyboard navigation plus visible-focus checks, WCAG-oriented):

- `a11y_checks(locator)` — asserts the locator is focused and shows a visible focus indicator; called automatically by `presses`, `fillsIn`, `selectsRadioButton`.
- `presses` — extends Playwright `press`, applies the default browser key mapping (overridable); keyboard alternative to `click`.
- `fillsIn` — extends Playwright `fill` with `a11y_checks`.
- `selectsRadioButton(group, name)` — selects a radio via keyboard and verifies focus.

A task is a Playwright fixture returning a function:

```typescript
export const Login = base.extend<{ Login: Task }, FixtureTypes>({
  Login: async ({ ShopCustomer, DefaultSalesChannel, StorefrontAccountLogin, StorefrontAccount }, use) => {
    const task = (customCustomer?: Customer) => {
      return async function Login() { /* goesTo, fillsIn, presses, expects */ };
    };
    await use(task);
  },
});
```

Usage in a test: `await ShopCustomer.attemptsTo(Login());`, or chain tasks such as `AddProductToCart(product)`, `ProceedFromProductToCheckout()`, `SelectPaymentMethod("Invoice")`, `ConfirmOrder()`. Page objects (e.g. `CheckoutConfirm implements PageObject`, `url()` returning `"checkout/confirm"`, locator `.checkout-card` with text "Payment Method") supply the locators tasks use.

Register your own tasks by merging task fixtures into your base test file with Playwright `mergeTests`; the source points to `/src/tasks/shop-customer-tasks.ts` or `/src/tasks/shop-admin-tasks.ts` for that.

## Essential identifiers

- `ShopCustomer`, `ShopAdmin`
- `goesTo`, `attemptsTo`, `expects`
- `a11y_checks`, `presses`, `fillsIn`, `selectsRadioButton`
- `Task`, `FixtureTypes`, `PageObject` types
- `TestDataService.createBasicProduct()`, `DefaultSalesChannel`
- `mergeTests`

## Gotchas

- Playwright `click` includes built-in actionability checks against flakiness; when you use the actor accessibility methods instead, you may need to assert some of those checks for certain locators yourself.
- Name tasks so the line reads like `Actor.attemptsTo(doSomething)` — e.g. `PutProductIntoCart`, not `ProductCart`.

## Code check (6.7.15.1)
- unverified `ShopCustomer` — defined in the external @shopware-ag/acceptance-test-suite npm package, out of scope
- unverified `attemptsTo` — ATS actor method, not part of Shopware core/storefront/administration
- unverified `a11y_checks` — ATS actor method, out of scope
- confirmed `frontend.checkout.confirm.page` — Storefront route behind the page object url `checkout/confirm` — vendor/shopware/storefront/Controller/CheckoutController.php:122
- confirmed `checkout-card` — CSS class on the confirm page payment card the locator targets — vendor/shopware/storefront/Resources/views/storefront/page/checkout/confirm/confirm-payment.html.twig:2
- confirmed `frontend.account.login.page` — Storefront login page the Login task navigates to — vendor/shopware/storefront/Controller/AuthController.php:77
