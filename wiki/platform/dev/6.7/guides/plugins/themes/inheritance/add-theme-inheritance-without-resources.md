---
id: platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md
title: Theme with Bootstrap styling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.html
sourceHash: cbd4694ec7ef5bd2c57d4a530a178669dac9a170
codeCheckedAgainst: "6.7.15.1"
keywords: ["@StorefrontBootstrap", "@Storefront", "@Plugins", "theme.json", "style", "bootstrap only theme", "without default styling", "storefront skin", "scss", "$sw-color-brand-primary", "ThemeFileResolver", "theme inheritance"]
summary: Build a theme on plain Bootstrap SCSS by using @StorefrontBootstrap instead of @Storefront in the theme.json style section, without the Shopware skin.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md"]
---
## What it is

The Shopware default theme is Bootstrap plus a custom Shopware "skin". The `@StorefrontBootstrap` placeholder lets a theme pull in the Storefront's Bootstrap-based SCSS without that skin, so the theme starts from Bootstrap styling instead of the Shopware look.

## When to use

When you build a theme that should not inherit the Shopware default styling (the SCSS under the Storefront bundle's `Resources/app/storefront/src/scss/skin` directory) but still wants Bootstrap and the Storefront theme variables.

## Key steps / config

In `<plugin root>/src/Resources/theme.json`, replace `@Storefront` with `@StorefrontBootstrap` in the `style` section and add `@Plugins` yourself:

```json
{
  "style": [
    "@StorefrontBootstrap",
    "@Plugins",
    "app/storefront/src/scss/base.scss"
  ]
}
```

What the installed code does with each entry:

- `@StorefrontBootstrap` resolves to the single file `Resources/app/storefront/src/scss/base.scss` of the Storefront bundle (imports `vendor/bootstrap` plus the Storefront base, component, layout and page styles), with the `vendor` import mapping. It does not add `skin/shopware/_base.scss`.
- `@Storefront` resolves to the Storefront theme's own `style` list: `base.scss`, `skin/shopware/_base.scss` and `@Plugins`.
- `@Plugins` adds the style files of all non-theme plugins.

Then compile the theme (`bin/console theme:compile`).

## Essential identifiers

- `@StorefrontBootstrap` — Bootstrap-only style placeholder
- `@Storefront` — full default theme including the skin
- `@Plugins` — styles of installed plugins
- `theme.json` `style` section
- `$sw-color-brand-primary` — example theme variable, still available

## Gotchas

- `@StorefrontBootstrap` is meant for the `style` section only; do not use it in `views` or `script` (it always resolves to an SCSS file).
- Use either `@StorefrontBootstrap` or `@Storefront`, never both: `@Storefront` already includes the Bootstrap SCSS.
- `@StorefrontBootstrap` does not include `@Plugins`; add it explicitly or plugin styles are missing.
- Theme variables such as `$sw-color-brand-primary` stay available, because the compiler prepends the dumped theme config variables to all style files regardless of the placeholder.
- Variables declared only in the Shopware skin (for example `$font-weight-semibold`, `$disabled-btn-bg`) are not defined without the skin.

## Code check (6.7.15.1)
- confirmed `@StorefrontBootstrap` — handled as a namespace include in the file resolver — vendor/shopware/storefront/Theme/ThemeFileResolver.php:302
- confirmed `ThemeFileResolver::addStorefrontBootstrapFile()` — adds only `Resources/app/storefront/src/scss/base.scss` with vendor mapping, no skin, no plugins — vendor/shopware/storefront/Theme/ThemeFileResolver.php:339
- confirmed `@Plugins` — resolves style files of all non-theme plugins — vendor/shopware/storefront/Theme/ThemeFileResolver.php:296
- confirmed `style` — `@Storefront` style list is `base.scss`, `skin/shopware/_base.scss` and `@Plugins` — vendor/shopware/storefront/Resources/theme.json:9
- confirmed `sw-color-brand-primary` — defined as a theme config field of the default theme — vendor/shopware/storefront/Resources/theme.json:33
- confirmed `ThemeCompiler::dumpVariables()` — theme variables are prepended before the concatenated styles — vendor/shopware/storefront/Theme/ThemeCompiler.php:598
- confirmed `$font-weight-semibold` — declared only in the Shopware skin variables — vendor/shopware/storefront/Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_custom.scss:21
