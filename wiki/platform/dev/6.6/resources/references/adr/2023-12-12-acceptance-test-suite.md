---
id: platform/dev/6.6/resources/references/adr/2023-12-12-acceptance-test-suite.md
title: New acceptance test suite
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-12-12-acceptance-test-suite.html"
sourceHash: "26f3506979ffce7837d92fb6e988e4ff8dd2f800"
keywords: ["Playwright", "Cypress", "acceptance testing", "E2E testing", "tests/acceptance", "test automation", "test strategy", "flaky tests", "cloud environment testing", "reusable traces"]
summary: "ADR replacing Cypress-based E2E tests with a new Playwright acceptance test suite built from scratch in `tests/acceptance`."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents replacing the existing Cypress-based E2E test suite with a new acceptance test suite built from scratch on Playwright, developed in `tests/acceptance`.

## When to use
Relevant when writing or migrating an end-to-end/acceptance test for Shopware, or when explaining why both a Cypress suite and a Playwright suite coexist in the codebase.

## Key steps / config
- Problems with the existing Cypress suite: tightly coupled to test-environment state, leading to non-deterministic, slow, flaky tests; tests created without a consistent strategy; no ability to test against the cloud environment.
- Goals for the replacement: deterministic tests runnable against any environment; fast and reliable tests following a defined strategy; tests derived from real product requirements that validate behaviour; a framework with readable syntax approachable by non-technical people.
- Decision: rather than incrementally fixing the Cypress suite, start a new suite from scratch and switch test frameworks.
- Playwright was chosen after evaluation — benchmarked as faster and more stable than Cypress, easy to learn, well documented, readable syntax, and supports reusable traces useful for debugging failing pipeline runs.
- The new suite lives in `tests/acceptance`; see its `README.md` for details.
- The Cypress and Playwright suites will coexist for a period until the new suite reaches equivalent coverage; tests are not mechanically ported but rethought against the new strategy and goals.

## Essential identifiers
- `tests/acceptance` (new Playwright suite location)
- Playwright (chosen test framework)
- Cypress (existing/legacy suite, being phased out)

## Gotchas
Existing Cypress tests are not simply copied over — each test is rewritten to match the new test strategy, so coverage parity between the two suites is reached gradually rather than immediately.
