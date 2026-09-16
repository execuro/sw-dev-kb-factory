---
id: platform/dev/6.7/guides/development/testing/store/quality-guidelines.md
title: Quality Guidelines for Store Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/quality-guidelines.html
sourceHash: a942ae4b5b851f930f78b4094d2968ef0d5213d7
codeCheckedAgainst: "6.7.13.0"
keywords: ["quality guidelines", "shopware store", "store review process", "extension", "plugin", "app", "shopware/testenv:6.7.6", "config.xml", "phpstan", "sonarqube", "store-plugin-codereview", "shopware cli", "rejection reasons", "store submission"]
summary: Overview of Shopware Store quality guidelines for plugins and apps - review process (PHPStan, SonarQube, manual), test on latest version, topic page map.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/testing/store/not-allowed-store-behaviors.md", "platform/dev/6.7/guides/development/testing/store/functionality-integration.md", "platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md", "platform/dev/6.7/guides/development/testing/store/code-quality.md"]
---
## What it is

Entry page of the Shopware Store quality guidelines, which apply to all extensions distributed via the Store. It defines terms, describes the review process, and points to the topic pages holding the detailed requirements.

## When to use

When preparing any plugin or app for Store submission and you need to know how it is reviewed and which topic page covers a given requirement.

## Key steps / config

**Terminology** (requirements apply to all extensions unless stated otherwise)
- **Extension**: umbrella term for plugins and apps.
- **Plugin**: installed in the Shopware instance; PHP code, Composer.
- **App**: integrated via the app system; no direct PHP execution in core.

**Review process** — every extension is:
1. Automatically code-reviewed (`shopwareLabs/store-plugin-codereview`: PHPStan, SonarQube), with emphasis on Administration and Storefront impact.
2. Manually reviewed for security, coding standards, user experience and functionality.
3. Tested on the latest stable Shopware 6 CE version.

Always test against the highest supported Shopware 6 version, e.g. the image `shopware/testenv:6.7.6`. For apps, reviewers additionally test `config.xml` per sales channel, install/uninstall behavior, and styling/viewport issues.

**Where the requirements live**
- Architecture boundaries (database, core files, APIs): [Not allowed store behaviors](platform/dev/6.7/guides/development/testing/store/not-allowed-store-behaviors.md).
- Listing copy, languages, images, previews, manufacturer profile, fallback languages, Administration translations: [Content and translations](platform/dev/6.7/guides/development/testing/store/content-and-translations.md).
- Storefront templates, CSS, accessibility, Lighthouse, console checks: [Storefront, performance and errors](platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md).
- Cookies: [Cookies and privacy](platform/dev/6.7/guides/development/testing/store/cookies-and-privacy.md).
- Uninstall options: [Uninstallation and data cleanup](platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md).
- Main menu, media folders, API test buttons, `config.xml` per sales channel: [Functionality and integration](platform/dev/6.7/guides/development/testing/store/functionality-integration.md).
- Plugin packaging (Composer archive, readable JavaScript, production-only ZIP, logging): [Code quality](platform/dev/6.7/guides/development/testing/store/code-quality.md).
- Sitemaps, canonicals, robots headers, structured data, rich-snippet checks: [SEO and structured data](platform/dev/6.7/guides/development/testing/store/seo-and-structured-data.md).
- `composer.json`, `composer.lock`, ZIP layout and dependency mistakes: [Common Store review errors](platform/dev/6.7/guides/development/testing/store/store-review-errors.md).
- Build, validate and upload plugin releases, manage store descriptions and images: [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md).

## Essential identifiers

- `shopware/testenv:6.7.6`
- `config.xml`
- `composer.json`, `composer.lock`

## Gotchas

- An extension may be rejected for violating coding standards, introducing security issues, bundling unauthorized files, breaking storefront behavior, or misrepresenting functionality in the listing.
- Dependencies must be traceable and archives must respect Store size limits.

## Code check (6.7.13.0)
- confirmed `Resources/config/config.xml` — app configuration file read by core for per-sales-channel settings — vendor/shopware/core/System/SystemConfig/Service/AppConfigReader.php:26
- confirmed `SystemConfigService::get()` — config values resolvable per sales channel — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:59
- confirmed `shopware-platform-plugin` — composer type core uses to discover plugins — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `Plugin` — abstract plugin base class (extends Bundle) — vendor/shopware/core/Framework/Plugin.php:17
- unverified `shopware/testenv:6.7.6` — Docker image tag, not part of vendor/shopware
- unverified `store-plugin-codereview` — external review tooling (PHPStan, SonarQube), out of scope
