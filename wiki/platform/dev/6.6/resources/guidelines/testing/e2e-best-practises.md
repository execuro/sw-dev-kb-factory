---
id: platform/dev/6.6/resources/guidelines/testing/e2e-best-practises.md
title: Best practices on writing end-to-end tests
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/testing/e2e-best-practises.html
sourceHash: 2a0b9fb8c9391f178dbe8cc2c2e14171d35466d2
keywords: ["E2E testing", "Cypress", "test pyramid", "happy path", "beforeEach hook", "flaky tests", "selectors", "cy.wait", "workflow-based testing", "test stability", "command queue", "cy.route"]
summary: "Best practices for writing stable, workflow-based Cypress E2E tests: scope, selectors, waiting, and command queuing."
lastBuilt: "2026-09-15"
---
## What it is
Best practices for writing Cypress-based end-to-end (E2E) tests in Shopware, covering test prioritization, workflow structure, selectors, waiting strategies, and command queuing.

## When to use
When deciding whether to write an E2E test, how to scope it, and how to keep the Administration/Storefront E2E test suite stable and maintainable.

## Key steps / config
- Prioritization: E2E tests are slow and expensive, so align roughly with the test pyramid — write few, well-chosen cases. Cover the most general/most-used workflows (the "happy path"), the critical path (highest-damage-if-broken workflows), and avoid duplicate coverage — prefer unit tests for things like validation logic.
- Workflow-based tests: write from the end user's point of view, describing a real user's workflow, not the developer's internal implementation steps.
- Scope: use **one test for one workflow**; perform setup unrelated to the tested workflow (creating sales channels, products, categories, logging in) via API operations in the `beforeEach` hook rather than through the UI.
- Stability: keep tests isolated and independent of run order and of each other; use test fixtures to create needed data beforehand and an appropriate reset method for cleanup; avoid large, multi-purpose tests.
- Selectors: avoid fuzzy selectors like XPath and framework-specific classes (e.g. Bootstrap's `.btn-primary`); use stable, Shopware-specific classes instead (e.g. `.btn-buy`, `.checkout-confirm-tos-label`).
- Waiting: never use fixed waits like `cy.wait(500)`; rely on Cypress's built-in retry-ability and explicit assertions, e.g. `cy.get('.sw-category-tree').should('be.visible')`, or wait on a routed request alias:
```javascript
cy.route({ url: '/api/search/category', method: 'post' }).as('getData');
cy.wait('@getData').then((xhr) => {
  expect(xhr).to.have.property('status', 200);
});
```
- Cypress command queue: Cypress commands are asynchronous and queued for later execution; wrap any vanilla JavaScript logic in a Cypress `then` or a custom command so it runs in the correct order — Cypress commands are not plain promises.

## Essential identifiers
- `beforeEach` hook
- `cy.wait('@alias')`, `cy.route(...).as(...)`
- `.btn-buy`, `.checkout-confirm-tos-label` (Shopware-specific selector examples)
- Cypress `then`

## Gotchas
Using framework-specific selectors (e.g. Bootstrap's `.btn-primary` or `[data-toggle="modal"]`) breaks when the framework's markup changes; fixed-duration waits like `cy.wait(500)` cause flaky, non-deterministic tests.
