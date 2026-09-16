---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/resources/references/adr/2021-09-22-refactor-theme-inheritance.md
sourceHash: 9c60619f1882edda938619560e944bf4665e82d5
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-09-22-refactor-theme-inheritance.html
title: Refactor theme inheritance
version: "6.7"
versions:
  - "6.7"
keywords: ["configInheritance", "theme.json", "theme inheritance", "theme config inheritance", "@Storefront", "@Plugins", "StorefrontPluginConfiguration", "ThemeMergedConfigBuilder", "configFields", "editable", "child theme", "composer require", "adr", "storefront theme"]
summary: "ADR: the theme.json configInheritance key lists themes (e.g. @Storefront) whose config fields a theme inherits dynamically, in the given order."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2021-09-22, area storefront) introducing the `configInheritance` key in a theme's `theme.json`. It lets a theme inherit its config fields from one or more other themes in a given order, instead of only copying the default Storefront theme's config once at activation time.

## When to use

- You build a theme that should reuse config fields (blocks, sections, fields) of the Storefront theme and of other, previously installed themes.
- You need to understand why theme config changes in a parent theme show up in a child theme without re-activation.
- You debug which theme's config values the theme manager in the Administration shows as inherited.

## Key steps / config

1. In `theme.json`, add `configInheritance` as an ordered list of theme references (the `@<ThemeName>` notation also used by `views`, `style`, `script`, `asset`):

```json
{
    "name": "MyDevelopmentTheme",
    "views": ["@Storefront", "@Plugins", "@MyDevelopmentTheme"],
    "configInheritance": ["@Storefront", "@PreviousTheme", "@MyDevelopmentTheme"],
    "config": {
        "blocks": { "exampleBlock": { "label": { "en-GB": "..." } } },
        "sections": { "exampleSection": { "label": { "en-GB": "..." } } },
        "fields": {
            "my-single-test-select-field": { "editable": false },
            "my-single-select-field": { "type": "text", "value": "24", "editable": true, "block": "exampleBlock", "section": "exampleSection" }
        }
    }
}
```

2. An inherited field can be overridden per field; `"editable": false` hides a field from editing in the theme manager.
3. If the theme depends on a theme other than the default Storefront theme, require that theme's package in the theme's `composer.json`, e.g. `"require": { "swag/previous-theme": "~1.1" }`.

The installed code reads the key in `StorefrontPluginConfigurationFactory::createFromThemeJson()`, stores it via `StorefrontPluginConfiguration::setConfigInheritance()` and also copies it into the theme's base config, where `ThemeMergedConfigBuilder` resolves it when building the merged config.

## Essential identifiers

- `configInheritance` (theme.json key)
- `@Storefront`, `@Plugins` (theme/inheritance references)
- `config.blocks`, `config.sections`, `config.fields`, `editable`
- `StorefrontPluginConfiguration::setConfigInheritance()`
- `ThemeMergedConfigBuilder`

## Gotchas

- Inheritance is dynamic, not a snapshot: changes to inherited themes are picked up automatically.
- It can still cause incompatibility errors when a dependent theme lacks a subset of the inherited config.
- Missing `composer.json` requirements on dependent themes lead to incomplete setups.
- In the installed code, a theme without `configInheritance` still inherits from `@Storefront` (every theme except the base Storefront theme); database copies of a theme without their own base config use the parent theme's inheritance.

## Code check (6.7.13.0)
- confirmed `configInheritance` — read from theme.json data — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
- confirmed `StorefrontPluginConfiguration::setConfigInheritance()` — setter storing the ordered list — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfiguration.php:214
- confirmed `ThemeMergedConfigBuilder::getConfigInheritance()` — resolves inheritance from base config, parent copy, or fallback — vendor/shopware/storefront/Theme/ThemeMergedConfigBuilder.php:291
- confirmed `StorefrontPluginRegistry::BASE_THEME_NAME` — value `Storefront`, used as default `@Storefront` inheritance — vendor/shopware/storefront/Theme/StorefrontPluginRegistry.php:20
- confirmed `@Plugins` — special reference resolved by the theme file resolver — vendor/shopware/storefront/Theme/ThemeFileResolver.php:296
- confirmed `editable` — fields with `editable` false are skipped — vendor/shopware/storefront/Theme/ThemeService.php:297
- confirmed `baseConfig.configInheritance` — theme manager checks whether `@Storefront` is inherited — vendor/shopware/storefront/Resources/app/administration/src/modules/sw-theme-manager/page/sw-theme-manager-detail/index.js:87
