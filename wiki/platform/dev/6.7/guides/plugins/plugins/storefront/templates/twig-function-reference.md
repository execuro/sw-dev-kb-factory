---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md
title: Twig Functions Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/twig-function-reference.html
sourceHash: fa16a36f2890f51ba460b2a9836f6a97218aeaa4
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw_extends", "sw_include", "sw_use", "sw_icon", "sw_thumbnails", "config", "theme_config", "sw_sanitize", "sw_convert_unit", "replace_recursive", "currency", "seoUrl", "twig functions", "twig filters", "multi inheritance"]
summary: "Shopware Twig tags, functions, filters and extensions: sw_* multi-inheritance tags, config/theme_config, sw_sanitize, currency, type tests."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md"]
---
## What it is

Reference of the custom Twig tags, functions, filters, extension functions and PHP-like syntax Shopware adds on top of Twig 3. The `sw_*` variants mirror Twig's built-ins but resolve templates through Shopware's multi-inheritance (plugin/app/theme chain).

## When to use

Writing or overriding Storefront (or app/script) Twig templates and you need the exact name of a Shopware-specific tag, function or filter, or need to know which Twig built-in has an inheritance-aware `sw_*` equivalent.

## Key steps / config

### Tags

| Tag | Purpose |
|---|---|
| `sw_extends` | like `extends`, with multi inheritance |
| `sw_include` | like `include`, one file at a time |
| `sw_embed` | like `embed` |
| `sw_use` | like `use` (import blocks without rendering) |
| `sw_import` / `sw_from` | like `import` / `from` (macros) |
| `sw_icon` | renders an icon from an icon pack (see [Add icons](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md)) |
| `sw_thumbnails` | renders an image tag with `srcset`/`sizes` (see [Media thumbnails](platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md)) |

### Functions

- `config` — system config value for the current sales channel (see [configuration](platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md)).
- `theme_config` — value from the current theme (see [theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md)).
- `sw_block`, `sw_source`, `sw_include` — inheritance-aware versions of Twig's `block`, `source`, `include` functions.
- `array` — wraps an array in an `ArrayFacade`; `version_compare` — compares two version strings.

### Filters

- `replace_recursive` — recursive `replace` (example in [add custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md)).
- `currency` — currency symbol and decimal formatting.
- `intval`, `floatval`, `strval`, `boolval` — cast scalar/stringable values.
- `json_encode` — always adds `JSON_PRESERVE_ZERO_FRACTION` and respects entity field visibility.
- `md5`, `sha256` — hash a string or an array (arrays are JSON-encoded first; other types throw).
- `sw_sanitize` — strips tags/attributes, allowing basic HTML.
- `sw_convert_unit` — measurement unit conversion (see the [measurement system ADR](platform/dev/6.7/resources/references/adr/2025-05-12-implement-measurement-system.md)); signature `value|sw_convert_unit(from = 'mm', to, precision)`.

### Extension functions

`seoUrl()` (SEO URL of a route), `searchMedia()` (media ids to media objects), `rawUrl()` (full URL).

### PHP-like syntax

- Control flow: `foreach`, `break`, `continue`, `return`.
- Operators: `===`, `!==`, `&&`, `||`.
- Type tests: `{% if value is <type> %}` with `true`, `false`, `array`, `bool`, `boolean`, `callable`, `float`, `int`, `integer`, `instanceof`, `object`, `scalar`, `string`.

## Essential identifiers

`sw_extends`, `sw_include`, `sw_embed`, `sw_use`, `sw_import`, `sw_from`, `sw_icon`, `sw_thumbnails`, `sw_block`, `sw_source`, `config`, `theme_config`, `array`, `ArrayFacade`, `version_compare`, `replace_recursive`, `currency`, `intval`, `floatval`, `strval`, `boolval`, `json_encode`, `md5`, `sha256`, `sw_sanitize`, `sw_convert_unit`, `seoUrl`, `searchMedia`, `rawUrl`

## Gotchas

- Templates imported via `sw_use` must not contain Twig statements outside of blocks, so core template changes in files you import with `sw_use` can break your extension.
- `sw_breadcrumb_full()` (all breadcrumb categories as array) is still registered but its class is marked `@deprecated tag:v6.8.0 - Will be removed without replacement`; avoid it in new code.
- The older `sw_breadcrumb()`, `sw_breadcrumb_types()` and `sw_breadcrumb_build_types()` are listed by the docs as deprecated in 6.5.0; none of them is registered in 6.7.15.1 any more.

## Version notes

- Full Twig multi inheritance via the `sw_*` equivalents is officially supported since 6.7.
- `sw_convert_unit` is available since 6.7.1.0.

## Code check (6.7.15.1)
- confirmed `sw_extends` — tag registered by ExtendsTokenParser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `sw_use` — tag registered by UseTokenParser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/UseTokenParser.php:70
- confirmed `sw_icon` — Storefront tag, includes utilities/icon.html.twig — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:44
- confirmed `config` — TwigFunction backed by SystemConfigService — vendor/shopware/core/Framework/Adapter/Twig/Extension/ConfigExtension.php:54
- confirmed `theme_config` — Storefront TwigFunction — vendor/shopware/storefront/Framework/Twig/Extension/ConfigExtension.php:28
- confirmed `json_encode` — filter forces JSON_PRESERVE_ZERO_FRACTION and field visibility — vendor/shopware/core/Framework/Adapter/Twig/Extension/PhpSyntaxExtension.php:102
- confirmed `sw_convert_unit` — filter with default `from = 'mm'` — vendor/shopware/core/Content/MeasurementSystem/TwigExtension/MeasurementConvertUnitTwigFilter.php:28
- deprecated `sw_breadcrumb_full` — BuildBreadcrumbExtension class deprecated for v6.8.0 — vendor/shopware/core/Framework/Adapter/Twig/Extension/BuildBreadcrumbExtension.php:44
- absent `sw_breadcrumb_types` — no longer registered anywhere in the installed code
- absent `sw_breadcrumb_build_types` — no longer registered anywhere in the installed code
