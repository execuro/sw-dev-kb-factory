---
id: platform/dev/6.6/resources/references/storefront-reference/twig-function-reference.md
sourceHash: 486bb45d993819658847eb9b392612409b645d36
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/storefront-reference/twig-function-reference.html
title: Shopware's twig functions
version: "6.6"
versions: ["6.6"]
docType: developer
keywords: ["twig functions", "sw_extends", "sw_include", "sw_icon", "sw_thumbnails", "sw_sanitize", "sw_breadcrumb", "seoUrl", "searchMedia", "rawUrl", "replace_recursive", "twig filters", "twig extensions", "storefront templating"]
summary: "Reference of Shopware's custom twig functions, filters, and extensions for storefront templates, including deprecated breadcrumb helpers."
lastBuilt: 2026-09-15
---
## What it is

Reference of the custom Twig functions, filters, and extensions Shopware adds on top of Twig for storefront template customization.

## Key steps / config

Functions:
- `sw_extends` — inherits from another file with multi-inheritance support; same API as Twig's default `extends`.
- `sw_include` — includes template partials with multi-inheritance support; same API as Twig's default `include`.
- `sw_icon` — displays an icon from a given icon set.
- `sw_thumbnails` — renders a tag with correctly configured `srcset`/`sizes` attributes.
- `config` — gets a value from the system config for the given sales channel.
- `theme_config` — gets a value from the current theme.

Filters:
- `replace_recursive` — recursive replacement, in addition to Twig's default `replace` filter.
- `currency` — applies currency symbol and comma formatting.
- `sw_sanitize` — filters tags/attributes from a string; explicitly allows basic HTML tags like `<i>`, `<b>` since Twig auto-escaping is on by default.

Extensions:
- `sw_breadcrumb_full()` — returns all categories defined in the breadcrumb as an array; contains the functionality of `sw_breadcrumb_types` and `sw_breadcrumb_build_types`.
- `sw_breadcrumb()` — returns the category tree as an array, filtering out SalesChannel entry points (e.g. footer, navigation). Deprecated in 6.5.0.
- `sw_breadcrumb_types()` — yields the types of categories within the breadcrumb. Deprecated in 6.5.0.
- `sw_breadcrumb_build_types()` — same as `sw_breadcrumb_types`, without an extra repository call. Deprecated in 6.5.0.
- `seoUrl()` — returns the SEO URL of a given route.
- `searchMedia()` — resolves media ids to media objects.
- `rawUrl()` — returns the full URL.

## Essential identifiers

`sw_extends`, `sw_include`, `sw_icon`, `sw_thumbnails`, `config`, `theme_config`, `replace_recursive`, `currency`, `sw_sanitize`, `sw_breadcrumb_full()`, `sw_breadcrumb()`, `sw_breadcrumb_types()`, `sw_breadcrumb_build_types()`, `seoUrl()`, `searchMedia()`, `rawUrl()`.

## Gotchas

Avoid importing blocks from core templates with Twig's `{% use %}` tag for horizontal reuse: it does not honor template inheritance the way `sw_extends` does, and templates imported via `{% use %}` cannot have additional Twig statements outside blocks — changes to core templates imported this way can break plugins/apps.

## Version notes

`sw_breadcrumb()`, `sw_breadcrumb_types()`, and `sw_breadcrumb_build_types()` are deprecated as of 6.5.0 in favor of `sw_breadcrumb_full()`.
