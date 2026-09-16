---
id: platform/dev/6.6/guides/plugins/plugins/testing/end-to-end-testing.md
title: End-to-end testing
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/end-to-end-testing.html
sourceHash: b837528ecc7ed0b553bfd80036b6b8ace769ebec
keywords: ["e2e testing", "cypress", "e2e-testsuite-platform", "composer run init", "composer run e2e:open", "composer run e2e:setup", "composer run e2e:prepare", "createDefaultFixture", "ApiService", "FixturesService", "cypress.json", "describe it beforeEach"]
summary: How to set up and write Cypress-based end-to-end tests for Shopware plugins and platform, including fixtures and custom services.
lastBuilt: 2026-09-15
---

## What it is

Explains Shopware's end-to-end (E2E) testing approach using Cypress and the `@shopware-ag/e2e-testsuite-platform` package: prerequisites, setup, folder structure, writing tests, and handling test data via fixtures and custom API services.

## When to use

When a plugin or platform change needs full user-workflow testing across the UI and backend rather than isolated unit tests.

## Key steps / config

Prerequisites: a clean Shopware installation (`composer run init`), running in production mode, with a theme assigned; install E2E deps with `npm install` in the relevant `test/e2e` folder.

Plugin E2E folder structure:

```text
Resources
  `-- app
    `-- <environment>
      `-- test
        `-- e2e
          `-- cypress
            |-- fixtures
            |-- integration
            |-- plugins
            `-- support
```

Install the test suite package and wire it up:

```javascript
module.exports = require('@shopware-ag/e2e-testsuite-platform/cypress/plugins');
```

Run tests: `composer run e2e:setup` (outside container, first time), `composer run e2e:open` (Cypress runner), or CLI with `composer e2e:cypress -- run --spec="cypress/e2e/administration/**/*.cy.js"`.

Fixture-based test data creation via the REST API:

```javascript
beforeEach(() => {
    cy.createDefaultFixture('tax');
});
```

Custom fixture services extend `AdminFixtureService` (or `FixturesService`) and live under `cypress/support/service/`.

## Essential identifiers

- `@shopware-ag/e2e-testsuite-platform` npm package
- `composer run init`, `composer run e2e:setup`, `composer run e2e:prepare`, `composer run e2e:open`, `composer e2e:cypress`
- `cy.createDefaultFixture(endpoint, data, jsonPath)`
- `ApiService`, `AdminFixtureService`/`FixturesService`
- Test file suffix `*.spec.js`; folders `fixtures`, `integration`, `plugins`, `support`

## Gotchas

- Tests must run against a clean installation with no demo data, in production mode, for reliable results.
- Contributed platform tests must be placed under one of the fixed `integration` subfolders (`catalogue`, `content`, `customer`, `general`, `media-marketing`, `order`, `rule-product-stream`, `settings`) or CI will not pick them up.
- Prefer `beforeEach` over `after`/`afterEach` for cleanup, since an `after` hook may not run if a test fails.
- Avoid relying on UUID-based IDs as test selectors since they can change between installations/builds.
