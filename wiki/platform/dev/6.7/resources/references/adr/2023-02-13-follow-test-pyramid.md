---
id: platform/dev/6.7/resources/references/adr/2023-02-13-follow-test-pyramid.md
title: Follow test pyramid
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-13-follow-test-pyramid.html
sourceHash: de9c9f45f84ef99a29b6ee2bee3ab3833d0059b3
codeCheckedAgainst: "6.7.13.0"
keywords: ["test pyramid", "e2e tests", "end-to-end", "jest", "unit tests", "php integration tests", "api tests", "flaky tests", "test quarantine", "playwright", "test retries", "test performance"]
summary: "ADR (2023): Shopware follows the test pyramid - fewer, higher-quality E2E tests; more unit, Jest and PHP integration tests to cut runtime and flakiness."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (area: product operations) committing Shopware 6 development to the test pyramid. The existing suite was an inverted pyramid: too many end-to-end and integration tests, too few unit tests.

## When to use

When deciding which kind of test to write for a Shopware core or administration change, or when judging whether a new E2E test is justified.

## Key steps / config

Problems that motivated the decision:

- **Performance**: the E2E suite took more than 6 hours of real time when run serially.
- **Flakiness**: E2E/integration tests with many moving parts were non-deterministic and load-dependent, which, combined with the test matrix and merge trains, caused distrust in the suite.

Decisions and consequences:

1. Cut every E2E test that can be covered by Jest tests or is better implemented as a PHP integration/API test.
2. Write more unit tests; replace deleted E2E coverage of basic (mostly CRUD admin module) behaviour with Jest tests.
3. Only add E2E tests that test an important feature end to end, and only high-quality ones — run them thoroughly (at least 50 times) before merging.
4. Refactor tests so they do not require a database reset after each test case; reconsider moving to Playwright.
5. Reduce or disable E2E test retries to fight performance creep.
6. Move flaky tests into quarantine as fast as possible.

## Gotchas

- Accepted trade-off: coverage decreases and some bugs a deleted E2E test might have caught can slip through; the ADR considers this unlikely since most deleted tests only exercised admin CRUD modules.

## Code check (6.7.13.0)
- unverified `jest` — test runner and spec files are not part of the installed administration src tree checked
- unverified `playwright` — E2E tooling lives in the upstream repository, not in vendor/shopware packages
