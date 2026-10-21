---
id: platform/dev/6.7/resources/references/adr/2023-02-13-follow-test-pyramid.md
title: Follow test pyramid
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-13-follow-test-pyramid.html
sourceHash: de9c9f45f84ef99a29b6ee2bee3ab3833d0059b3
codeCheckedAgainst: "6.7.15.1"
keywords: ["test pyramid", "e2e tests", "end-to-end tests", "jest", "unit tests", "integration tests", "api tests", "flaky tests", "flakiness", "test performance", "playwright", "test quarantine", "adr", "product-operations"]
summary: "ADR (2023): Shopware 6 cuts E2E tests coverable by Jest or PHP integration/API tests and writes more unit tests to fix slow, flaky suites."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (ADR, dated 2023-02-16, area `product-operations`, tags `test`, `structure`, `performance`, `flakiness`) in which Shopware commits to the test pyramid best practice (Martin Fowler's "practical test pyramid" article is the reference). Until then Shopware 6 had a reversed pyramid: too many end-to-end (E2E) and integration tests and too few unit tests. It is mirrored from the `adr/` folder of the Shopware 6 repository (`adr/2023-02-13-follow-test-pyramid.md`).

## When to use

Read it when deciding which kind of test to write for a core or administration contribution, when proposing a new E2E test, or when wondering why many admin CRUD E2E tests were removed in favour of Jest tests.

## Key steps / config

The ADR states two problems with the previous approach:

1. **Performance** — E2E tests, and integration tests to a degree, are slow because they perform many steps to assert required conditions. Run serially, the E2E suite had grown to more than 6 hours of real time.
2. **Flakiness** — tests with many moving parts are not deterministic; failures depend on the performance/load of the executing machine and are hard to reproduce. Combined with the number of tests, the complex test matrix and merge trains, this caused distrust in the suite and pipelines failing for no code reason.

Decision: cut every E2E test that can be covered by Jest tests or is better implemented as a PHP integration test or API test. Consequences the ADR commits to:

- **Test pyramid**: write more unit tests; delete E2E tests that only cover what Jest or PHP integration tests can cover; write Jest tests for the basic (mostly CRUD) behaviour the deleted E2E tests covered; only add E2E tests that test an important feature end to end.
- **Quality**: only add high-quality E2E tests and run each one thoroughly before merging — at least 50 times.
- **Performance**: refactor tests so they do not need a database reset after each test case; reconsider moving to Playwright; reduce or disable E2E test retries to fight performance creep; move flaky tests into quarantine as fast as possible.

## Gotchas

- Coverage is expected to decrease. Some bugs that a deleted E2E test would have caught may slip through; the ADR considers this unlikely because most deleted tests covered admin modules doing CRUD operations rather than whole features.
- A new E2E test is only acceptable when it tests an important feature end to end and has passed repeated runs (50+) before merge.

## Code check (6.7.15.1)
- confirmed `jest.spyOn` — administration Jest unit tests live next to the code as `*.spec.js`/`*.spec.ts` files — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.spec.js:20
- confirmed `describe` — co-located spec for the HTTP factory, an example of the Jest layer the ADR favours — vendor/shopware/administration/Resources/app/administration/src/core/factory/http.factory.spec.js:36
- unverified `playwright` — E2E suites live outside the checked package roots, so the move to Playwright cannot be checked here
- unverified `test pyramid` — process decision, no code identifier
