---
id: platform/dev/6.7/guides/development/testing/legacy/_index.md
title: Legacy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/legacy/
sourceHash: 26e00fa81afb4f3a23a6d685fa13efaa591c1790
codeCheckedAgainst: "6.7.15.1"
keywords: ["legacy testing", "cypress", "deprecated", "e2e testing", "end-to-end tests", "playwright", "test migration", "unmaintained"]
summary: Legacy testing section - Cypress E2E testing is deprecated and unmaintained; use Playwright for new projects.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/testing/e2e-playwright/_index.md"]
supersededBy: platform/dev/6.7/guides/development/testing/e2e-playwright/_index.md
---
## What it is

Index of the legacy testing section, which holds the Cypress end-to-end testing guides. Cypress has been deprecated and is no longer maintained.

## When to use

Only when maintaining existing Cypress-based E2E tests. For new projects, use Playwright: see [E2E testing with Playwright](platform/dev/6.7/guides/development/testing/e2e-playwright/_index.md).

## Gotchas

- Cypress testing is deprecated and receives no further maintenance; do not start new test suites on it.

## Code check (6.7.15.1)
- unverified `cypress` — no reference in the Administration `src` root; the E2E test folders live outside the scanned vendor roots
