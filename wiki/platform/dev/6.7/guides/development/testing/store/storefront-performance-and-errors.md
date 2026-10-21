---
id: platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md
title: Storefront, performance, and errors
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/storefront-performance-and-errors.html
sourceHash: fd1445f6dc4d18caa0e7c94b2832c9160c2159c5
codeCheckedAgainst: "6.7.15.1"
keywords: ["store review", "extension quality guidelines", "storefront requirements", "responsive", "inline css", "!important", "google lighthouse", "performance regression", "console errors", "http 500", "404", "accessibility", "ThemeCompiler"]
summary: Shopware Store review rules for extensions - responsive storefront, no inline CSS, Lighthouse before/after, no JS console errors, no 404/500 responses.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md", "platform/dev/6.7/guides/development/testing/store/seo-and-structured-data.md", "platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md"]
---
## What it is

Part of the Shopware Store extension quality checklist: the storefront, performance, and error/HTTP-behaviour requirements an extension must meet to pass review.

## When to use

Before submitting an extension to the Shopware Store, or when self-testing an extension that changes storefront templates, styles, JavaScript, or product/listing markup.

## Key steps / config

Storefront:

- Support mobile, tablet, and desktop viewports; the extension must be responsive.
- No inline CSS in storefront templates. Use your own classes and compile the CSS with the plugin (plugin SCSS is compiled into the theme by the storefront theme compiler) — see [Add SCSS variables](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md).
- Avoid `!important` unless it is unavoidable.
- Design for accessibility; the extension must not break the overall look of the store.

Performance:

- The extension must not measurably impair store or server performance, and must stay stable under load (no severe regressions).
- Run a Google Lighthouse audit before and after activating the extension. Significant regressions in performance, accessibility, best practices, or SEO can fail review.

Errors and HTTP behaviour:

- No JavaScript or console errors in the storefront or checkout — test the full Storefront with the browser developer tools.
- No HTTP 500 errors; no uncaught 500 errors in normal operation.
- No 404s introduced by the extension.
- No 400/500 responses except when tied to a documented API call.
- Error messages must clearly state what went wrong or what the user should do.

Tools:

- Google Lighthouse — performance and quality audits.
- Google Rich Results Test — use together with [SEO and structured data](platform/dev/6.7/guides/development/testing/store/seo-and-structured-data.md) when changing product or listing markup.

## Gotchas

- After the extension is uninstalled, [Shopping Experiences](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md) must keep working in the storefront. Data and CMS cleanup rules are in [Uninstallation and data cleanup](platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md).
- Lighthouse regressions in accessibility, best practices, or SEO count, not just performance.

## Code check (6.7.15.1)
- confirmed `ThemeCompiler` — storefront class that compiles theme and plugin SCSS — vendor/shopware/storefront/Theme/ThemeCompiler.php:33
- confirmed `ThemeCompiler::compileTheme()` — compile entry point for a theme — vendor/shopware/storefront/Theme/ThemeCompiler.php:75
- confirmed `ThemeCompilerEnrichScssVariablesEvent::addVariable()` — plugin hook for SCSS variables instead of inline styles — vendor/shopware/storefront/Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:23
- confirmed `ErrorController::error()` — storefront renders thrown exceptions as error pages (source of 404/500 responses) — vendor/shopware/storefront/Controller/ErrorController.php:35
- unverified `Google Lighthouse` — external audit tool, not part of the Shopware code
- unverified `Google Rich Results Test` — external tool, out of scope
