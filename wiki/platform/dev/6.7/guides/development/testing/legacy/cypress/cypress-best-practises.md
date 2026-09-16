---
id: platform/dev/6.7/guides/development/testing/legacy/cypress/cypress-best-practises.md
title: Best practices on writing end-to-end tests
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/legacy/cypress/cypress-best-practises.html
sourceHash: 5539b79ed5b1ce36801d22f822516df943e0ab39
codeCheckedAgainst: "6.7.13.0"
keywords: ["cypress", "e2e", "end-to-end tests", "best practices", "selectors", "cy.get", "cy.wait", "cy.route", "beforeEach", "flaky tests", "test fixtures", "btn-buy", "checkout-confirm-tos-label", "sw-category-tree", "workflow-based testing"]
summary: "Legacy Cypress E2E best practices for Shopware: prioritise workflows, isolate tests, use Shopware-specific selectors, wait on assertions/route aliases."
lastBuilt: 2026-09-15
---
## What it is

Guidance (legacy Cypress section) on designing and writing Shopware end-to-end tests: which workflows to cover, how to scope and isolate tests, which selectors to use, how to wait, and how to handle the Cypress command queue. It also points to Cypress's own best-practices guide, which Shopware recommends following as well.

## When to use

When writing or reviewing Cypress E2E tests for the Shopware Storefront or Administration (core contributions or extensions), especially when tests are slow, flaky or depend on each other.

## Key steps / config

1. **Prioritise test cases** (test pyramid): cover the most-used "happy path" workflows (e.g. CRUD), the critical paths whose breakage causes the most damage, and avoid duplicate coverage. Test the application's reaction to a failed validation in E2E, the validation itself in unit tests.
2. **Write workflow-based tests** from the end user's point of view, not as unit tests.
3. **One test per workflow.** Perform setup (sales channel, products, categories, Administration login) via API operations or test fixtures in the `beforeEach` hook, then let the test exercise only the workflow under test (e.g. only the checkout).
4. **Stability first:** keep tests simple and isolated so they run in any order; create data with fixtures beforehand and restore a clean installation / reset between tests.
5. **Selectors:** avoid XPath (text-dependent) and framework-specific (Bootstrap) selectors; use Shopware-specific classes. If none exists, add a descriptive class or ID.

```javascript
cy.get('.btn.btn-primary').click();          // avoid
cy.get('.btn-buy').click();                  // prefer
cy.get('.custom-checkbox label').click();    // avoid
cy.get('.checkout-confirm-tos-label').click(); // prefer
```

6. **No fixed waits** like `cy.wait(500)`. Rely on Cypress retryability and assertions, or wait on a route alias:

```javascript
cy.get('.sw-category-tree').should('be.visible');

cy.server();
cy.route({ url: '/api/search/category', method: 'post' }).as('getData');
cy.wait('@getData').then((xhr) => {
    expect(xhr).to.have.property('status', 200);
});
```

7. **Command queue:** Cypress commands are asynchronous and queued; plain JavaScript runs immediately. Wrap vanilla JS in `then` or a custom command so it is queued.

## Essential identifiers

- `beforeEach` (setup via API / fixtures)
- `cy.get(...).should('be.visible')`
- `cy.server()`, `cy.route(...).as('getData')`, `cy.wait('@getData')`
- `.then(...)` for queuing vanilla JS
- Storefront classes `.btn-buy`, `.checkout-confirm-tos-label`; Administration class `.sw-category-tree`
- Admin API search route `/api/search/category`

## Gotchas

- Cypress `then` looks like a promise but is not one; do not treat commands as promises.
- Tests that depend on each other or leave written data behind produce flaky, non-deterministic results and can block CI pipelines.
- Long tests covering many workflows slow runtime and make failures hard to attribute.
- `.btn-open-settings` in the source's modal example is an illustrative class, not one found in the installed Storefront templates.

## Version notes

This page lives in the legacy Cypress testing section of the 6.7 docs.

## Code check (6.7.13.0)
- confirmed `btn-buy` — Storefront buy button carries `btn btn-primary btn-buy` — vendor/shopware/storefront/Resources/views/storefront/component/buy-widget/buy-widget-form.html.twig:139
- confirmed `checkout-confirm-tos-label` — TOS label class on checkout confirm page — vendor/shopware/storefront/Resources/views/storefront/page/checkout/confirm/index.html.twig:76
- confirmed `sw-category-tree` — root element class of the admin category tree component — vendor/shopware/administration/Resources/app/administration/src/module/sw-category/component/sw-category-tree/sw-category-tree.html.twig:2
- confirmed `/api/search/` — dynamic Admin API search route per entity (e.g. category) — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:109
- unverified `btn-open-settings` — not found in installed Storefront twig templates; illustrative example only
- unverified `cy.route` — Cypress API, outside the vendor/shopware roots
