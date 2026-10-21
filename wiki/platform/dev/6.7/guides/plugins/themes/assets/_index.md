---
id: platform/dev/6.7/guides/plugins/themes/assets/_index.md
title: Assets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/assets/
sourceHash: 82639e15da15fb7e9eef9e659cebfaa6bc73a3f3
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme assets", "images", "fonts", "icon packs", "custom icons", "theme.json", "asset", "iconSets", "sw_icon", "twig asset", "scss asset path", "storefront theme"]
summary: "Section index for theme assets: adding images, fonts and icon packs to a Storefront theme and referencing them from Twig and SCSS."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md", "platform/dev/6.7/guides/plugins/themes/assets/add-icons.md"]
---
## What it is

Section index for working with assets in a Shopware Storefront theme: adding custom images, fonts and icon packs, and referencing them in Twig and SCSS.

## When to use

You are building a theme and need to ship static files with it, or want to render your own icons with `sw_icon`. Pick the child page that matches the task:

- [Add assets to a Theme](platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md) — declare asset directories in `theme.json` (`asset` key), compile them with `bin/console theme:compile`, link them via Twig `asset(..., 'theme')` or SCSS.
- [Add custom icons](platform/dev/6.7/guides/plugins/themes/assets/add-icons.md) — place SVG icons in icon pack folders or declare custom packs with the `iconSets` key in `theme.json`, then render them with the `sw_icon` tag.

## Key steps / config

The two `theme.json` keys covered by this section:

```json
{
  "asset": ["app/storefront/src/assets"],
  "iconSets": { "custom-icons": "app/storefront/src/assets/icon-pack/custom-icons" }
}
```

## Essential identifiers

`theme.json`, `asset`, `iconSets`, `sw_icon`, `theme:compile`

## Code check (6.7.15.1)
- confirmed `asset` — theme.json key read into the theme's asset paths — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:90
- confirmed `iconSets` — theme.json key read into the theme's icon sets — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:113
- confirmed `sw_icon` — Storefront Twig tag — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:44
- confirmed `theme:compile` — console command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
