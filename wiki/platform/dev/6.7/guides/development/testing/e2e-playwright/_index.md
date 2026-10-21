---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/_index.md
title: Playwright E2E testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/
sourceHash: 8b954198908cf8ed9c30aedfdb190c7c7176a346
codeCheckedAgainst: "6.7.15.1"
keywords: ["playwright", "e2e", "end-to-end tests", "acceptance test suite", "fixtures", "page objects", "api clients", "test data", "storefront tests", "administration tests", "browser automation"]
summary: Shopware Acceptance Test Suite for Playwright - fixtures, Storefront/Administration page objects, API clients and test data for E2E tests of plugins and themes.
lastBuilt: 2026-10-20
---
## What it is

Entry page for the Shopware Acceptance Test Suite built on [Playwright](https://playwright.dev/), the end-to-end testing tool that automates browser interactions. It is used to test the functionality of Shopware plugins and themes.

## When to use

You need browser-level E2E tests for a Shopware plugin or theme, covering Storefront and/or Administration flows.

## Key steps / config

The suite provides ready-made Playwright [fixtures](https://playwright.dev/docs/test-fixtures) so tests can start against Shopware immediately:

- page contexts for Storefront and Administration
- [page objects](https://playwright.dev/docs/pom) for Storefront and Administration
- API clients
- test data creation helpers
- reusable test logic

## Code check (6.7.15.1)
- unverified `Playwright` — the acceptance test suite is a separate package; no reference in core/storefront/administration src
- unverified `fixtures` — provided by the acceptance test suite package, out of scope
