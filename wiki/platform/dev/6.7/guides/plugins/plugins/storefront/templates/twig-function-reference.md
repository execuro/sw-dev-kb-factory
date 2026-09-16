---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md
title: Twig Functions Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/twig-function-reference.html
sourceHash: 4089ba1c9f18236c1731cfed670439753929369e
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw_extends", "sw_include", "sw_use", "sw_icon", "sw_thumbnails", "theme_config", "config", "sw_sanitize", "sw_convert_unit", "replace_recursive", "sw_breadcrumb_full", "seoUrl", "searchMedia", "rawUrl", "twig extensions"]
summary: Shopware's custom Twig tags (sw_extends, sw_include, sw_icon...), functions (config, theme_config), filters (currency, sw_sanitize) and extensions.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/resources/references/adr/2025-05-12-implement-measurement-system.md"]
---
## What it is

Reference list of the Twig tags, functions, filters and extension functions Shopware adds on top of Twig. The `sw_*` tags and functions mirror Twig's defaults but resolve templates through Shopware's multi-inheritance (plugin/theme) hierarchy.

## When to use

Writing or overriding Storefront templates in a plugin, app or theme and you need to know which Shopware-specific Twig constructs exist and what they map to.

## Key steps / config

**Tags** (same API as the Twig tag without prefix, but inheritance-aware):

- `sw_extends` — like `extends`
- `sw_include` — like `include`, limited to one file at once
- `sw_embed` — like `embed`
- `sw_use` — like `use` (import blocks without rendering)
- `sw_import` — like `import` (all macros)
- `sw_from` — like `from` (single macros)
- `sw_icon` — renders an icon from an icon set (see [Add icons](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md))
- `sw_thumbnails` — renders a tag with configured `srcset`/`sizes` (see [media thumbnails](platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md))

**Functions:**

- `config` — system config value (plugins, global settings) for the sales channel
- `theme_config` — value from the current theme ([theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md))
- `sw_block` — like Twig `block()`, inheritance-aware
- `sw_source` — like Twig `source()`
- `sw_include` — function form of `include`

**Filters:**

- `replace_recursive` — recursive variant of `replace`
- `currency` — currency symbol and decimal formatting
- `sw_sanitize` — strips tags/attributes, allowing basic HTML despite auto-escaping
- `sw_convert_unit` — converts between measurement units

**Extension functions:**

- `sw_breadcrumb_full()` — all categories of the breadcrumb as an array
- `seoUrl()` — SEO URL of a given route
- `searchMedia()` — resolves media ids to media objects
- `rawUrl()` — full URL

## Essential identifiers

`sw_extends`, `sw_include`, `sw_embed`, `sw_use`, `sw_import`, `sw_from`, `sw_icon`, `sw_thumbnails`, `config`, `theme_config`, `sw_block`, `sw_source`, `replace_recursive`, `currency`, `sw_sanitize`, `sw_convert_unit`, `sw_breadcrumb_full`, `seoUrl`, `searchMedia`, `rawUrl`

## Gotchas

- Templates imported via `sw_use` must not contain Twig statements outside of blocks; core template changes in templates you import this way can break your extension.
- The docs still list `sw_breadcrumb()`, `sw_breadcrumb_types()` and `sw_breadcrumb_build_types()` (deprecated in 6.5.0); none of them is registered in the installed code — use `sw_breadcrumb_full()`.

## Version notes

- Full Twig multi-inheritance through the `sw_*` equivalents is officially supported since 6.7.
- `sw_convert_unit` is available since 6.7.1.0 (see the [measurement system ADR](platform/dev/6.7/resources/references/adr/2025-05-12-implement-measurement-system.md)).

## Code check (6.7.13.0)
- confirmed `sw_use` — tag of the Shopware use token parser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/UseTokenParser.php:70
- confirmed `sw_embed` — tag of the Shopware embed token parser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/EmbedTokenParser.php:81
- confirmed `sw_thumbnails` — Storefront token parser tag — vendor/shopware/storefront/Framework/Twig/TokenParser/ThumbnailTokenParser.php:41
- confirmed `sw_icon` — Storefront token parser tag — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:44
- confirmed `sw_include` — also registered as a Twig function with `sw_block` and `sw_source` — vendor/shopware/core/Framework/Adapter/Twig/Extension/TwigFeaturesWithInheritanceExtension.php:42
- confirmed `theme_config` — Storefront Twig function — vendor/shopware/storefront/Framework/Twig/Extension/ConfigExtension.php:28
- confirmed `sw_convert_unit` — Twig filter — vendor/shopware/core/Content/MeasurementSystem/TwigExtension/MeasurementConvertUnitTwigFilter.php:28
- confirmed `sw_breadcrumb_full` — Twig function — vendor/shopware/core/Framework/Adapter/Twig/Extension/BuildBreadcrumbExtension.php:46
- absent `sw_breadcrumb_types` — not registered anywhere in the installed code (removed)
- absent `sw_breadcrumb_build_types` — not registered anywhere in the installed code (removed)
