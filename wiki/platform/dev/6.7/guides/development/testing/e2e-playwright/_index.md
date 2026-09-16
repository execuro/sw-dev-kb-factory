---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/_index.md
title: Playwright E2E testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/
sourceHash: 8b954198908cf8ed9c30aedfdb190c7c7176a346
codeCheckedAgainst: "6.7.13.0"
keywords: ["playwright", "e2e testing", "end-to-end tests", "acceptance test suite", "ats", "fixtures", "page objects", "api clients", "test data", "storefront tests", "administration tests"]
summary: Overview of the Shopware Acceptance Test Suite (ATS) - Playwright fixtures, page objects, API clients and test data for E2E testing plugins and themes.
lastBuilt: 2026-09-15
---
## What it is

Entry page for the Shopware Acceptance Test Suite (ATS), a Playwright-based toolkit for end-to-end testing of Shopware plugins and themes. Playwright automates browser interactions; the ATS adds Shopware-specific Playwright fixtures so tests can start against a shop right away.

The suite provides:

- page contexts for Storefront and Administration,
- page objects (Page Object Model) for Storefront and Administration,
- API clients,
- test data creation,
- reusable test logic.

## When to use

Writing browser-driven E2E/acceptance tests for a Shopware plugin or theme that should exercise Storefront or Administration flows rather than PHP units.

## Code check (6.7.13.0)
- unverified `Shopware Acceptance Test Suite` — separate npm package, not part of vendor/shopware core/storefront/administration; no occurrence in the installed code
- unverified `Playwright fixtures` — provided by the external Playwright/ATS packages, out of scope
