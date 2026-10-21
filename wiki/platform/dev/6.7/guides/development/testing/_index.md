---
id: platform/dev/6.7/guides/development/testing/_index.md
title: Testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/
sourceHash: cb1a4cb9e16db031300564b29b1f7deb8b0bdff3
codeCheckedAgainst: "6.7.15.1"
keywords: ["testing", "phpunit", "jest", "playwright", "e2e", "end-to-end tests", "unit tests", "continuous integration", "ci", "store review", "quality guidelines", "TestBootstrapper"]
summary: Overview of Shopware extension testing - Playwright E2E, PHPUnit and Jest unit tests, CI pipelines and Store review testing criteria.
lastBuilt: 2026-10-20
---
## What it is

Entry page for automated testing strategies and quality requirements for Shopware extensions. It routes to the sub-guides for end-to-end tests, PHP and JavaScript unit tests, Continuous Integration, and the Shopware Store testing criteria.

## When to use

You are deciding how to test an extension (plugin, app, theme) or preparing it for Shopware Store review and need to know which tool covers which layer.

## Key steps / config

- **End-to-end (E2E)**: Playwright is the officially supported tool for automating full user journeys and integration scenarios. It provides preconfigured fixtures, Storefront and Administration page objects, API clients and test data helpers (see the Playwright E2E testing guide).
- **PHP unit tests**: PHPUnit for backend logic in your extension (guide: unit/php-unit). The core ships `Shopware\Core\TestBootstrapper` to bootstrap a test kernel, e.g. with `addCallingPlugin()` / `addActivePlugins()` and `bootstrap()`.
- **JavaScript unit tests**: Jest, both for Storefront JS / Vue components (unit/jest-storefront) and for custom Administration modules and components using the Shopware admin setup (unit/jest-admin).
- **Continuous Integration**: automate quality checks, builds and artifact creation; structure CI for projects and plugins with static analysis, test execution and artifact promotion (guide: ci).
- **Store testing guidelines**: to publish in the Shopware Store, follow the criteria used in Store review - scope, code quality, storefront, SEO, cookies, content, installation - and the official quality guidelines for publication requirements, legal conditions and compliance.

## Essential identifiers

- Playwright (E2E), PHPUnit (PHP unit), Jest (Storefront and Administration JS)
- `Shopware\Core\TestBootstrapper`

## Code check (6.7.15.1)
- confirmed `TestBootstrapper` — PHPUnit bootstrap helper class in namespace `Shopware\Core` — vendor/shopware/core/TestBootstrapper.php:23
- confirmed `TestBootstrapper::bootstrap()` — boots the test environment — vendor/shopware/core/TestBootstrapper.php:48
- confirmed `TestBootstrapper::addActivePlugins()` — registers plugins to activate for tests — vendor/shopware/core/TestBootstrapper.php:194
- confirmed `TestBootstrapper::addCallingPlugin()` — adds the plugin whose composer.json calls the bootstrap — vendor/shopware/core/TestBootstrapper.php:206
- unverified `Playwright` — acceptance test suite is a separate package, not in core/storefront/administration src
- unverified `Jest` — test tooling config outside the checked administration src root
