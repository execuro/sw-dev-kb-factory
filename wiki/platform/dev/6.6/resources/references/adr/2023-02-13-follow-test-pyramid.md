---
id: platform/dev/6.6/resources/references/adr/2023-02-13-follow-test-pyramid.md
title: Follow test pyramid
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-13-follow-test-pyramid.html
sourceHash: de9c9f45f84ef99a29b6ee2bee3ab3833d0059b3
keywords: ["test pyramid", "e2e tests", "jest", "php integration tests", "api tests", "unit tests", "flakiness", "playwright", "test quarantine", "test suite performance", "merge trains"]
summary: "ADR: Shopware commits to the test pyramid, cutting E2E tests in favor of more jest/unit and PHP integration tests."
lastBuilt: 2026-09-15
---
## What it is
An architecture decision record committing Shopware's test suite to follow the "test pyramid" best practice, moving away from an E2E/integration-heavy "reversed pyramid".

## When to use
Relevant when deciding what kind of test (unit, jest, PHP integration/API, or E2E) to write for a new feature or CRUD operation.

## Key steps / config
- Context: the E2E suite grew to over 6 hours of real-time execution when run serially; E2E/integration tests are also flaky and non-deterministic, worsened by machine load, causing distrust in the pipeline especially during high merge-request volume.
- Decision: follow the [test pyramid], cutting E2E tests that can instead be covered by jest tests or PHP integration/API tests.
- Consequences:
  - Coverage may decrease slightly, mostly for admin CRUD modules previously covered end-to-end — considered low risk.
  - More unit tests will be written; deleted E2E tests covering basic CRUD get replaced by jest tests; only E2E tests that test an important feature end-to-end are kept/added.
  - New E2E tests must be high quality and tested at least 50 times before merging.
  - Performance work: refactor tests to avoid a database reset after every test case, consider moving to Playwright, reduce/disable E2E test retries, and move flaky tests into quarantine quickly.

## Essential identifiers
- test pyramid (testing strategy)
- Playwright (candidate E2E tool)
