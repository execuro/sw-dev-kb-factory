---
id: platform/dev/6.7/resources/references/adr/2021-09-22-refactor-theme-inheritance.md
title: Refactor theme inheritance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-09-22-refactor-theme-inheritance.html
sourceHash: 9c60619f1882edda938619560e944bf4665e82d5
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme inheritance", "configInheritance", "theme.json", "theme config", "parent theme", "@Storefront", "views", "style", "script", "asset", "StorefrontPluginConfiguration", "composer require", "child theme"]
summary: "ADR: theme.json configInheritance lets a theme inherit config fields dynamically from an ordered list of other themes, not just Storefront."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area storefront) introducing the `configInheritance` key in a theme's `theme.json`, so a theme can inherit its config fields from several other themes in a given order instead of only from the default Storefront theme.

## When to use

Read this when building a theme that extends another custom theme (not only `@Storefront`) and should inherit that theme's config fields, or when debugging why inherited theme config values appear or not.

## Key steps / config

Before this change, themes could only inherit config fields from the default Storefront theme, and only as a snapshot copied at activation time; changes to the parent's config did not reach the child without re-activation.

1. Add `configInheritance` to `theme.json`, ordered from least to most specific (the last entry is the nearest ancestor):

```json
{
  "name": "MyDevelopmentTheme",
  "views": ["@Storefront", "@Plugins", "@MyDevelopmentTheme"],
  "style": ["app/storefront/src/scss/overrides.scss", "@Storefront", "..."],
  "script": ["@Storefront", "app/storefront/dist/storefront/js/my-development-theme.js"],
  "asset": ["@Storefront", "app/storefront/src/assets"],
  "configInheritance": ["@Storefront", "@PreviousTheme", "@MyDevelopmentTheme"],
  "config": { "blocks": {}, "sections": {}, "fields": {} }
}
```

2. Declare every non-Storefront theme you inherit from as a Composer dependency of your theme plugin, to prevent incomplete setups:

```json
"require": { "swag/previous-theme": "~1.1" }
```

What the installed code does: `StorefrontPluginConfigurationFactory` reads `configInheritance` from `theme.json` into `StorefrontPluginConfiguration` and also stores it in the theme's base config. On theme lifecycle, the last entry that is neither `@Storefront` nor the theme itself is looked up by technical name and set as the theme's `parentThemeId`. The merged config builder and config loaders resolve inherited values from the stored `configInheritance` at runtime, so parent changes propagate.

## Essential identifiers

- `configInheritance` (theme.json key)
- `views`, `style`, `script`, `asset`, `config` (theme.json part inheritance keys)
- `@Storefront`, `@Plugins` (special inheritance references)
- `StorefrontPluginConfiguration::setConfigInheritance()`, `StorefrontPluginConfigurationFactory`
- `ThemeLifecycleService`, `ThemeMergedConfigBuilder`

## Gotchas

- Inheritance can still cause incompatibility errors when a dependent theme is missing subsets (fields) of its parent.
- Existing themes without `configInheritance` keep working as before.
- Inheritance is dynamic, not a snapshot: changes to inherited themes are picked up automatically.
- The Administration gets an inherit/override toggle per field, similar to product variant inheritance.
- Themes depending on themes other than the default Storefront must list them under `require` in `composer.json`.

## Code check (6.7.15.1)
- confirmed `configInheritance` — read from theme.json and copied into base config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
- confirmed `StorefrontPluginConfiguration::setConfigInheritance()` — setter for the ordered list — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfiguration.php:214
- confirmed `views` — mapped to view inheritance — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:102
- confirmed `script` — script file collection — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:85
- confirmed `asset` — asset paths — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:90
- confirmed `style` — style files resolved — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:81
- confirmed `ThemeLifecycleService::addParentTheme()` — last non-Storefront, non-self entry becomes parentThemeId — vendor/shopware/storefront/Theme/ThemeLifecycleService.php:563
- confirmed `ThemeMergedConfigBuilder::getConfigInheritance()` — reads configInheritance from the stored base config — vendor/shopware/storefront/Theme/ThemeMergedConfigBuilder.php:291
