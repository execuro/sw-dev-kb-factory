---
id: platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md
title: Theme with Bootstrap styling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.html
sourceHash: cbd4694ec7ef5bd2c57d4a530a178669dac9a170
codeCheckedAgainst: "6.7.13.0"
keywords: ["@StorefrontBootstrap", "@Storefront", "@Plugins", "theme.json", "style", "bootstrap", "bootstrap only theme", "without shopware skin", "scss skin", "$sw-color-brand-primary", "theme variables", "storefront theme"]
summary: Use @StorefrontBootstrap instead of @Storefront in theme.json style to build a theme on Bootstrap SCSS without the Shopware skin; add @Plugins yourself.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md"]
---
## What it is

The Shopware default theme is Bootstrap plus custom Shopware styling (the "skin"). A theme can build only on the Bootstrap SCSS by referencing the `@StorefrontBootstrap` placeholder instead of the `@Storefront` bundle in the `style` section of its `theme.json`. The Storefront skin SCSS is then not part of the theme's compiled styles.

## When to use

When developing a theme that should not carry the Shopware default look but still wants Bootstrap SCSS and the theme variables.

## Key steps / config

1. In `<plugin root>/src/Resources/theme.json`, replace `@Storefront` in `style` with `@StorefrontBootstrap`.
2. Add `@Plugins` yourself if plugin styles should be compiled — `@StorefrontBootstrap` does not include it.
3. Append your own SCSS entry files.

```json
{
  "style": [
    "@StorefrontBootstrap",
    "@Plugins",
    "app/storefront/src/scss/base.scss"
  ]
}
```

What the code does: `@StorefrontBootstrap` adds only the Storefront bundle's `Resources/app/storefront/src/scss/base.scss` (with its `vendor` resolve mapping). `@Storefront` resolves the Storefront `theme.json` `style` list, which additionally contains `app/storefront/src/scss/skin/shopware/_base.scss` and `@Plugins`.

## Essential identifiers

- `@StorefrontBootstrap` — Bootstrap-only style placeholder
- `@Storefront` — full default theme bundle (includes Bootstrap SCSS already)
- `@Plugins` — styles of installed non-theme plugins
- `theme.json` `style` section
- `$sw-color-brand-primary` — example theme variable still available

## Gotchas

- `@StorefrontBootstrap` is only for the `style` section; do not use it in `views` or `script`.
- Use either `@StorefrontBootstrap` or `@Storefront`, never both — `@Storefront` already includes the Bootstrap SCSS.
- `@StorefrontBootstrap` does not include `@Plugins`; omit it and plugin SCSS is missing.
- All theme variables such as `$sw-color-brand-primary` remain available with the Bootstrap option.
- Everything from the Storefront skin directory (`src/scss/skin`) is not available to the theme.

## Code check (6.7.13.0)
- confirmed `@StorefrontBootstrap` — special-cased placeholder in the file resolver — vendor/shopware/storefront/Theme/ThemeFileResolver.php:302
- confirmed `ThemeFileResolver::addStorefrontBootstrapFile()` — adds only Storefront scss/base.scss with vendor mapping — vendor/shopware/storefront/Theme/ThemeFileResolver.php:339
- confirmed `@Plugins` — separate placeholder resolving non-theme plugin files, not added by @StorefrontBootstrap — vendor/shopware/storefront/Theme/ThemeFileResolver.php:296
- confirmed `app/storefront/src/scss/skin/shopware/_base.scss` — skin entry only in the @Storefront style list — vendor/shopware/storefront/Resources/theme.json:16
- confirmed `style` — theme.json style array read by the configuration factory — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:81
- confirmed `sw-color-brand-primary` — theme config field defined in the Storefront theme.json — vendor/shopware/storefront/Resources/theme.json:33
