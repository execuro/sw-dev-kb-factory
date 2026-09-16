---
id: platform/dev/6.7/guides/development/testing/_index.md
title: Testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/
sourceHash: cb1a4cb9e16db031300564b29b1f7deb8b0bdff3
codeCheckedAgainst: "6.7.13.0"
keywords: ["testing", "Playwright", "PHPUnit", "Jest", "e2e", "end-to-end tests", "unit tests", "continuous integration", "ci", "store review", "quality guidelines", "page objects", "fixtures"]
summary: "Testing overview for extensions: Playwright E2E, PHPUnit for PHP, Jest for Storefront/Admin JS, CI pipelines, and Shopware Store review testing criteria."
lastBuilt: 2026-09-15
---
## What it is

Entry page for automated testing strategies and quality requirements for Shopware extensions: end-to-end tests, unit tests (PHP and JavaScript), CI, and the testing criteria of the Shopware Store review.

## When to use

When choosing how to test an extension, or preparing an extension for publication in the Shopware Store.

## Key steps / config

- **End-to-End (E2E)**: Playwright is the officially supported tool for simulating real user journeys and integration scenarios across the application. It provides preconfigured fixtures, Storefront and Administration page objects, API clients and test data helpers (sub-page `testing/e2e-playwright`).
- **PHP unit tests**: PHPUnit for backend logic (sub-page `testing/unit/php-unit`).
- **JavaScript unit tests**: Jest for Storefront JS and Vue components (`testing/unit/jest-storefront`) and for custom Administration modules/components with the Shopware admin setup (`testing/unit/jest-admin`).
- **Continuous Integration**: automate static analysis, test execution, builds and artifact promotion for projects and plugins (`testing/ci`).
- **Store publication**: follow the testing criteria used in the Shopware Store review — scope, code quality, storefront, SEO, cookies, content, installation (`testing/store/`) — and the official publication requirements, legal conditions and compliance rules (`testing/store/quality-guidelines`).

## Essential identifiers

- Playwright (E2E), PHPUnit (PHP unit), Jest (Storefront and Administration JS unit)

## Code check (6.7.13.0)
- unverified `Playwright` — external test tool and its fixtures package, outside the vendor/shopware code roots
- unverified `PHPUnit` — external test framework, outside the vendor/shopware code roots
- unverified `Jest` — JS test runner configuration, outside the checked administration src root
