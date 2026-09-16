---
id: platform/dev/6.7/guides/plugins/themes/assets/_index.md
title: Assets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/assets/
sourceHash: 82639e15da15fb7e9eef9e659cebfaa6bc73a3f3
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme assets", "theme.json", "asset", "images", "fonts", "icon packs", "custom icons", "twig asset function", "scss asset path", "$app-css-relative-asset-path", "theme:compile", "storefront theme"]
summary: Section index for Shopware theme assets - adding images, fonts and icon packs to a theme and referencing them from Twig and SCSS.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md", "platform/dev/6.7/guides/plugins/themes/assets/add-icons.md"]
---
## What it is

Section index for working with assets in a Shopware Storefront theme: adding custom images, fonts and icon packs, and referencing them from Twig templates and SCSS. The section itself contains no instructions; it points to two guides.

## When to use

You are building a theme and need to ship static files with it, or want to use custom icons. Pick the sub-guide:

- [Add assets to a Theme](platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md) — where to store assets (via `theme.json` or the plugin way) and how to link them in Twig and SCSS
- [Add custom icons](platform/dev/6.7/guides/plugins/themes/assets/add-icons.md) — adding icon packs to a theme and rendering them

## Key steps / config

Orientation, as verified in the installed code (details in the add-assets guide):

1. A theme declares its asset directories in the `asset` array of its `theme.json`; relative entries resolve against the theme's `Resources` directory, and the core Storefront theme itself declares `app/storefront/dist/assets`.
2. `bin/console theme:compile` copies those directories into the public `theme/` directory for the theme.
3. Twig links to them through the `theme` asset package, e.g. `asset('/assets/your-image.png', 'theme')`.
4. SCSS references the same folder through the `$app-css-relative-asset-path` variable.

```json
{
  "asset": ["app/storefront/src/assets"]
}
```

## Code check (6.7.13.0)
- confirmed `asset` — theme.json key read into the plugin configuration's asset paths — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:90
- confirmed `app/storefront/dist/assets` — asset path declared by the core Storefront theme.json — vendor/shopware/storefront/Resources/theme.json:29
- confirmed `theme:compile` — console command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `$app-css-relative-asset-path` — SCSS variable with default — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/variables/_custom.scss:34
- confirmed `shopware.asset.theme` — theme asset package service — vendor/shopware/storefront/DependencyInjection/theme.php:310
