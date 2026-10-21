---
id: platform/dev/6.7/guides/development/testing/legacy/cypress/cypress-best-practises.md
title: Best practices on writing end-to-end tests
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/legacy/cypress/cypress-best-practises.html
sourceHash: 5539b79ed5b1ce36801d22f822516df943e0ab39
codeCheckedAgainst: "6.7.15.1"
keywords: ["cypress", "e2e best practices", "end-to-end tests", "selectors", "flaky tests", "cy.wait", "cy.route", "beforeEach", "btn-buy", "checkout-confirm-tos-label", "workflow-based tests", "test isolation", "test pyramid"]
summary: Cypress E2E best practices for Shopware - test prioritisation, workflow-based scope, isolation, stable selectors, no fixed waits, command queue.
lastBuilt: 2026-10-21
---
## What it is

Shopware's do/don't list for writing Cypress end-to-end tests: which workflows deserve E2E coverage, how to scope and isolate tests, how to choose selectors, how to wait, and how to handle the Cypress command queue. It complements Cypress's own best practices, which Shopware strongly recommends following too.

## When to use

When writing or reviewing Cypress E2E tests for the Shopware platform or a plugin, especially when tests are slow, flaky or hard to maintain.

## Key steps / config

**Prioritise (test pyramid)** - do not cover every workflow. Cover:
- the most general, most used workflows (happy path, e.g. CRUD);
- the critical path - workflows that cause the most damage if broken;
- no duplicate coverage: test the UI's reaction to a failed validation, not the validation itself (unit tests).

**Workflow-based** - write tests from the user's point of view, not like unit tests.

**Scope** - one test per workflow. Create prerequisites (sales channel, products, categories, fixtures) via API in `beforeEach`; do not repeat login steps in every test.

**Stability** - keep tests isolated, runnable independently or in random order, with data created beforehand and the installation reset between tests. Keep tests small with little logic.

**Selectors** - avoid XPath and framework (Bootstrap) selectors; use Shopware-specific classes, adding a descriptive class if none exists:

```javascript
cy.get('.btn.btn-primary').click();     // avoid
cy.get('.btn-buy').click();             // prefer
cy.get('[data-toggle="modal"]').click(); // avoid
cy.get('.btn-open-settings').click();   // prefer
cy.get('.checkout-confirm-tos-label').click();
```

**Waiting** - never `cy.wait(500)`; use assertions or route aliases:

```javascript
cy.get('.sw-category-tree').should('be.visible');
cy.server();
cy.route({ url: '/api/search/category', method: 'post' }).as('getData');
cy.wait('@getData').then((xhr) => {
    expect(xhr).to.have.property('status', 200);
});
```

**Command queue** - Cypress commands are asynchronous and queued; vanilla JavaScript runs immediately. Wrap it in `then` or a custom command.

## Essential identifiers

- `beforeEach` (API setup), `cy.get()`, `.should('be.visible')`
- `cy.server()`, `cy.route()`, `cy.wait('@alias')`
- Selector examples: `.btn-buy`, `.btn-open-settings`, `.checkout-confirm-tos-label`, `.sw-category-tree`
- Route example: `/api/search/category`

## Gotchas

- Flaky tests block the deployment pipeline and give no valid result.
- Cypress commands look like promises but are not; see the Cypress docs on "Commands Are Not Promises".
- The `.btn-buy` selector stays stable if the button variant changes (e.g. to `.btn-secondary`).

## Code check (6.7.15.1)
- confirmed `btn-buy` — Storefront buy button carries `btn btn-primary btn-buy` — vendor/shopware/storefront/Resources/views/storefront/component/buy-widget/buy-widget-form.html.twig:148
- confirmed `checkout-confirm-tos-label` — label class on the checkout confirm TOS checkbox — vendor/shopware/storefront/Resources/views/storefront/page/checkout/confirm/index.html.twig:97
- confirmed `sw-category-tree` — Administration root element class — vendor/shopware/administration/Resources/app/administration/src/module/sw-category/component/sw-category-tree/sw-category-tree.html.twig:2
- confirmed `/api/search/` — POST search route generated per entity, e.g. `/api/search/category` — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:109
- unverified `btn-open-settings` — illustrative markup in the docs; no Storefront template match found
- unverified `cy.route` — Cypress API, outside the scanned vendor roots
