---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md
relatedPages:
  - platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md
  - platform/dev/6.7/guides/development/testing/store/seo-and-structured-data.md
  - platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md
sourceHash: fd1445f6dc4d18caa0e7c94b2832c9160c2159c5
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/storefront-performance-and-errors.html
title: Storefront, performance, and errors
version: "6.7"
versions:
  - "6.7"
keywords: ["store review", "storefront", "performance", "lighthouse", "inline css", "!important", "responsive", "accessibility", "console errors", "http 500", "404", "base.scss", "shopping experiences"]
summary: "Store review rules for Storefront extensions: responsive, no inline CSS, no performance regressions (Lighthouse), no JS console errors, 500s or new 404s."
lastBuilt: 2026-09-15
---
## What it is

The Shopware Store review checklist for Storefront quality, performance, and error/HTTP behaviour of an extension.

## When to use

Before submitting an extension that changes the Storefront or checkout, or when a review fails on layout, performance, or errors.

## Key steps / config

Storefront:

- Support mobile, tablet, and desktop viewports; stay responsive and accessible; do not break the store's overall look.
- No inline CSS in Storefront templates. Use your own classes and compile CSS with the plugin — the Storefront picks up a plugin's SCSS entry `base.scss` from `Resources/app/storefront/src/scss`. See [Add SCSS variables](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md).
- Avoid `!important` unless unavoidable.

Performance:

- The extension must not measurably impair store or server performance; avoid severe regressions under load.
- Run a Google Lighthouse audit before and after activating the extension. Significant regressions in performance, accessibility, best practices, or SEO can fail review.

Errors and HTTP behaviour:

- No JavaScript/console errors in Storefront or checkout — test the full Storefront with browser developer tools.
- No HTTP 500 errors and no uncaught 500s in normal operation.
- No 404s introduced by the extension.
- No 400/500 responses except when tied to a documented API call.
- Error messages must state what went wrong or what the user should do.

Tools: Google Lighthouse; Google Rich Results Test together with [SEO and structured data](platform/dev/6.7/guides/development/testing/store/seo-and-structured-data.md) when changing product or listing markup.

After uninstall: [Shopping Experiences](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md) must keep working in the Storefront. Data and CMS cleanup rules (including honouring `UninstallContext::keepUserData()`) are in [Uninstallation and data cleanup](platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md).

## Essential identifiers

- `Resources/app/storefront/src/scss/base.scss`
- `!important`
- `UninstallContext::keepUserData()`

## Code check (6.7.13.0)
- confirmed `Resources/app/storefront/src/scss` — plugin styles path scanned for SCSS entry files — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:126
- confirmed `base.scss` — only `base.scss` at depth 0 is taken as entry — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:202
- confirmed `keepUserData` — `UninstallContext::keepUserData()` tells the plugin whether to keep data — vendor/shopware/core/Framework/Plugin/Context/UninstallContext.php:27
- confirmed `frontend.cms.page` — Storefront CMS route that must keep working after uninstall — vendor/shopware/storefront/Controller/CmsController.php:56
- unverified `Lighthouse` — external audit tool, not in vendor code
