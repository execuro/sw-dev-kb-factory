---
id: platform/dev/6.7/resources/references/adr/2023-12-12-acceptance-test-suite.md
title: New acceptance test suite
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-12-12-acceptance-test-suite.html
sourceHash: 26f3506979ffce7837d92fb6e988e4ff8dd2f800
codeCheckedAgainst: "6.7.13.0"
keywords: ["playwright", "cypress", "acceptance tests", "e2e tests", "end-to-end testing", "tests/acceptance", "test automation", "traces", "adr", "quality", "test strategy"]
summary: "ADR: Shopware replaces the Cypress E2E suite with a new Playwright-based acceptance test suite in tests/acceptance; both co-exist during the transition."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (quality area, 2023-12-12): Shopware stops investing in the Cypress-based E2E test suite and builds a new acceptance test suite from scratch on Playwright.

## When to use

- Deciding where and with which framework to write end-to-end/acceptance tests for the Shopware platform.
- Understanding why Cypress E2E tests are no longer extended.

## Key steps / config

- New tests go into `tests/acceptance`; its `README.md` describes the suite.
- Tests are not copied from the old suite but rethought based on a test strategy and product requirements.
- Goals the suite must meet: deterministic tests that run against any environment (including cloud), fast and reliable tests following a test strategy, tests derived from real product requirements that validate behaviour, and a readable syntax that non-technical people can follow.

## Gotchas

- The old Cypress suite was tightly coupled to the state of the test environment, which made tests non-deterministic, slow and flaky, and it could not test against the cloud environment.
- The Cypress and Playwright suites co-exist until the new suite has the necessary coverage.
- Playwright was chosen because first benchmarks showed it faster and more stable than Cypress; it also produces reusable traces for debugging failing pipeline tests.

## Code check (6.7.13.0)
- unverified `tests/acceptance` — repository-level test directory, not part of the installed vendor/shopware core, storefront or administration src roots
- unverified `playwright` — test tooling lives outside the three checked vendor roots; no normative code claim in this ADR
