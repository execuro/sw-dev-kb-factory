---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/actor-pattern.md
title: Actor Pattern
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/actor-pattern.html
sourceHash: f70ca9f3487fb381ca780ba3ad3d563601f4ea9f
codeCheckedAgainst: "6.7.13.0"
keywords: ["actor pattern", "ShopCustomer", "ShopAdmin", "attemptsTo", "goesTo", "expects", "presses", "fillsIn", "selectsRadioButton", "a11y_checks", "Task", "mergeTests", "playwright tasks", "accessibility testing", "acceptance test suite"]
summary: ATS actor pattern for Playwright tests - ShopCustomer/ShopAdmin actors, goesTo/attemptsTo/expects, keyboard a11y methods, and tasks as fixtures.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/testing/e2e-playwright/page-object.md"]
---
## What it is

The actor pattern in the Shopware Acceptance Test Suite (ATS) structures Playwright tests as: an **actor** goes to a **page**, attempts a **task**, and expects a result. It is optional; plain Playwright APIs remain usable. It adds two entities besides [page objects](platform/dev/6.7/guides/development/testing/e2e-playwright/page-object.md):

- **Actor** — a user with a given context performing actions.
- **Task** — a reusable action performed by an actor.

## When to use

Writing readable, reusable E2E test logic (login, add to cart, checkout steps) for Storefront or Administration, including keyboard-driven accessibility checks.

## Key steps / config

Actor properties: `name` (human-readable name), `page` (Playwright page context).

Primary methods:
- `goesTo(url)` — navigate to a page URL.
- `attemptsTo(task)` — run a task function; each task is wrapped in a Playwright test step.
- `expects(...)` — one-to-one export of Playwright `expect`.

Accessibility methods:
- `a11y_checks` — verifies a locator is focused and shows a visible focus indicator; called automatically by `presses`, `fillsIn`, `selectsRadioButton`.
- `presses` — extends Playwright `press` with `a11y_checks` and a default keyboard key press (overridable); keyboard alternative to `click`.
- `fillsIn` — extends Playwright `fill` with `a11y_checks`.
- `selectsRadioButton` — selects a radio button by keyboard navigation, verifying visible focus via `presses`.

Test shape:

```typescript
test("Product detail test scenario", async ({ ShopCustomer, StorefrontProductDetail, TestDataService }) => {
  const product = await TestDataService.createBasicProduct();
  await ShopCustomer.goesTo(StorefrontProductDetail.url(product));
  await ShopCustomer.attemptsTo(AddProductToCart(product));
  await ShopCustomer.expects(StorefrontProductDetail.offCanvasSummaryTotalPrice).toHaveText("€99.99*");
});
```

A task is a Playwright fixture returning a factory for a named async function:

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

Used as `await ShopCustomer.attemptsTo(Login());`. Page objects implement `PageObject` (with `page`, locators and a `url()` method), e.g. `CheckoutConfirm` exposing `paymentMethodRadioGroup`, consumed by the `SelectPaymentMethod` task via `StorefrontCheckoutConfirm`.

Register custom tasks by merging task fixtures into your base test file with Playwright `mergeTests`; the source points to `/src/tasks/shop-customer-tasks.ts` or `/src/tasks/shop-admin-tasks.ts` for that.

## Essential identifiers

- Actors: `ShopCustomer` (Storefront), `ShopAdmin` (Administration)
- Methods: `goesTo`, `attemptsTo`, `expects`, `presses`, `fillsIn`, `selectsRadioButton`, `a11y_checks`
- Types: `Task`, `FixtureTypes`, `Customer`, `PageObject`
- Fixtures: `TestDataService`, `DefaultSalesChannel`, `StorefrontAccountLogin`, `StorefrontProductDetail`, `StorefrontCheckoutConfirm`
- Playwright: `mergeTests`, `base.extend`

## Gotchas

- Playwright `click` includes actionability checks against flakiness; when using the actor accessibility methods you may need to assert some of those checks for certain locators yourself.
- Name tasks so the call reads like `Actor.attemptsTo(doSomething)` — `PutProductIntoCart`, not `ProductCart`.

## Code check (6.7.13.0)
- unverified `ShopCustomer` — defined in the external ATS npm package; no occurrence in vendor/shopware
- unverified `ShopAdmin` — ATS actor, out of scope of the installed Shopware packages
- unverified `attemptsTo` — ATS Actor method, out of scope
- unverified `a11y_checks` — ATS Actor accessibility helper, out of scope
- unverified `Task` — ATS type, out of scope
- unverified `TestDataService` — ATS service; no occurrence in vendor/shopware
- unverified `mergeTests` — Playwright API, out of scope
