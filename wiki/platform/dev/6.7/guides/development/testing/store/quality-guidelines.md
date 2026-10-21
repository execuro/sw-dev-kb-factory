---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/development/testing/store/quality-guidelines.md
relatedPages:
  - platform/dev/6.7/guides/development/testing/store/not-allowed-store-behaviors.md
  - platform/dev/6.7/guides/development/testing/store/store-review-errors.md
  - platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md
  - platform/dev/6.7/guides/development/testing/store/code-quality.md
sourceHash: a942ae4b5b851f930f78b4094d2968ef0d5213d7
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/quality-guidelines.html
title: Quality Guidelines for Store Extensions
version: "6.7"
versions:
  - "6.7"
keywords: ["store review", "quality guidelines", "store extension", "plugin", "app", "config.xml", "shopware/testenv", "phpstan", "sonarqube", "store-plugin-codereview", "shopware cli", "rejection reasons"]
summary: Overview of Shopware Store review for plugins and apps - automated PHPStan/SonarQube review, manual review, test env, and links to each requirement page.
lastBuilt: 2026-10-21
---
## What it is

Entry page of the Shopware Store quality guidelines for all extensions (plugins and apps): the review process and an index of the detailed requirement pages.

## When to use

Before submitting an extension to the Shopware Store, to find which requirement page covers a given area (listing, uninstall, storefront, SEO, Administration, Composer packaging).

## Key steps / config

Terminology:

- **Extension** — umbrella term for plugins and apps.
- **Plugin** — installed in the Shopware instance; PHP code, Composer.
- **App** — integrated via the app system; no direct PHP execution in core.

Review process — every extension is:

1. Automatically code-reviewed (`store-plugin-codereview` from shopwareLabs: PHPStan, SonarQube), with emphasis on Administration and Storefront impact.
2. Manually reviewed for security, coding standards, user experience and functionality.
3. Tested on the latest stable Shopware 6 CE version.

Test against the highest supported Shopware 6 version, e.g. `shopware/testenv:6.7.6`. For apps, reviewers additionally test `config.xml` per sales channel (the app's `Resources/config/config.xml`), install/uninstall behavior and styling/viewport issues.

Requirement pages:

- Architecture boundaries (database, core files, APIs): [Not allowed store behaviors](platform/dev/6.7/guides/development/testing/store/not-allowed-store-behaviors.md)
- Listing copy, languages, images, fallback languages, Administration translations: [Content and translations](platform/dev/6.7/guides/development/testing/store/content-and-translations.md)
- Errors, templates, CSS, accessibility, Lighthouse, console: [Storefront, performance, and errors](platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md)
- Cookies: [Cookies and privacy](platform/dev/6.7/guides/development/testing/store/cookies-and-privacy.md)
- Uninstall options and data cleanup: [Uninstallation and data cleanup](platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md)
- App technical rules, main menu, media folders, API test buttons, validation messages: [Functionality and integration](platform/dev/6.7/guides/development/testing/store/functionality-integration.md)
- Plugin packaging (Composer archive, readable JavaScript, production-only ZIP, logging): [Code quality](platform/dev/6.7/guides/development/testing/store/code-quality.md)
- Sitemaps, canonicals, robots headers, structured data, rich-result checks: [SEO and structured data](platform/dev/6.7/guides/development/testing/store/seo-and-structured-data.md)
- `composer.json`, `composer.lock`, ZIP layout, dependency mistakes: [Store review errors](platform/dev/6.7/guides/development/testing/store/store-review-errors.md)

Use the [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md) to build, validate and upload plugin releases and manage store descriptions and images.

## Essential identifiers

- `shopware/testenv:6.7.6`
- `config.xml` (app configuration, `Resources/config/config.xml`)
- `shopware-platform-plugin` (Composer type of a plugin)

## Gotchas

- An extension may be rejected for violating coding standards, introducing security issues, bundling unauthorized files, breaking storefront behavior, or misrepresenting functionality in the listing.

## Code check (6.7.15.1)
- confirmed `Resources/config/config.xml` — app config file read by the app lifecycle — vendor/shopware/core/Framework/App/Lifecycle/AppManager.php:536
- confirmed `Resources/config/config.xml` — validated per app folder — vendor/shopware/core/Framework/App/Validation/ConfigValidator.php:60
- confirmed `PluginFinder::COMPOSER_TYPE` — plugin Composer type `shopware-platform-plugin` — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `Plugin` — PHP plugin base class extends `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- unverified `shopware/testenv:6.7.6` — Docker image tag, outside the code roots
- unverified `store-plugin-codereview` — external review tooling, outside the code roots
