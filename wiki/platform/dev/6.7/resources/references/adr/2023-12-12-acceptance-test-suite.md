---
id: platform/dev/6.7/resources/references/adr/2023-12-12-acceptance-test-suite.md
title: New acceptance test suite
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-12-12-acceptance-test-suite.html
sourceHash: 26f3506979ffce7837d92fb6e988e4ff8dd2f800
codeCheckedAgainst: "6.7.15.1"
keywords: ["acceptance tests", "playwright", "cypress", "e2e tests", "end-to-end testing", "tests/acceptance", "test automation", "test strategy", "deterministic tests", "traces", "quality", "adr"]
summary: "ADR: Shopware replaces the Cypress E2E suite with a new Playwright-based acceptance test suite in tests/acceptance; both coexist during migration."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-12-12, area quality) to stop investing in the existing Cypress-based E2E test suite and build a new acceptance test suite from scratch on Playwright. The goal is to reduce manual testing in favour of test automation.

## When to use

- You need to know which end-to-end/acceptance test framework Shopware uses for the platform and where those tests live.
- You consider extending the old Cypress E2E tests and want to know their status.
- You write acceptance tests and need the requirements they are expected to fulfil.

## Key steps / config

1. New acceptance tests are written with Playwright and live in `tests/acceptance`; that directory's `README.md` documents the suite.
2. Tests are not simply copied from the Cypress suite; each is rethought based on a defined test strategy and the goals below.
3. Requirements for the new suite:
   - deterministic tests that can run against any environment (including cloud);
   - fast and reliable tests following a defined test strategy;
   - tests derived from real product requirements that validate behaviour;
   - a framework that is easy to learn, with a readable syntax that non-technical people can follow.

## Gotchas

- Problems that led to the decision: the Cypress suite is tightly coupled to the state of the test environment, so tests are not deterministic and tend to be slow and flaky; tests were written in different ways without a common strategy; and the suite could not run against the cloud environment.
- Why Playwright: first benchmarks showed it faster and more stable than Cypress; it is easy to learn, well documented, and produces reusable traces that help debug failing pipeline tests.
- The old Cypress suite and the new Playwright suite co-exist for a while, until the new suite reaches the necessary coverage; no further effort goes into the Cypress suite.

## Code check (6.7.15.1)
- unverified `tests/acceptance` — repository test directory, outside the checked vendor/shopware package roots
- unverified `playwright` — no Playwright reference in core or administration src; tooling lives outside the checked package roots
- unverified `cypress` — no Cypress reference in core or administration src; legacy E2E suite lives outside the checked package roots
