---
id: platform/dev/6.7/guides/plugins/themes/styling/_index.md
title: Styling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/styling/
sourceHash: 4f7ef2f29b81e70228735da43be9b6f07a5ded8d
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme styling", "scss", "javascript", "theme.json", "style", "bootstrap variables", "breakpoints", "responsive breakpoints", "theme:compile", "base.scss", "overrides.scss", "storefront theme"]
summary: Section index for Shopware 6.7 theme styling guides - adding SCSS and JS to a theme, overriding Bootstrap variables and responsive breakpoints.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md"]
---
## What it is

Section overview for customizing the visual styling of a Shopware Storefront theme. The source page only lists the guides in this section:

- [Add SCSS Styling and JavaScript to a Theme](platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md) — SCSS entry files listed in the `style` section of the theme's `theme.json` (conventionally `app/storefront/src/scss/base.scss`), compiled with `bin/console theme:compile`; JavaScript from the `app/storefront/src/main.js` entry, built with webpack and shipped pre-compiled; dev-server with live reload.
- [Override Bootstrap variables in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md) — changing Bootstrap SCSS variables from a theme (in the theme inheritance example an `overrides.scss` file is listed first in `style` for this purpose).
- [Override responsive breakpoints in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md) — adjusting the theme's responsive breakpoints.

## When to use

Start here when a theme needs its own styles, JavaScript, Bootstrap variable overrides or custom breakpoints, then open the matching guide.

## Key steps / config

SCSS order is defined by the `style` array in `<plugin root>/src/Resources/theme.json`, typically:

```json
{
  "style": [
    "app/storefront/src/scss/overrides.scss",
    "@Storefront",
    "app/storefront/src/scss/base.scss"
  ]
}
```

## Essential identifiers

- `theme.json` → `style`
- `app/storefront/src/scss/base.scss`, `app/storefront/src/scss/overrides.scss`
- `bin/console theme:compile`

## Code check (6.7.13.0)
- confirmed `style` — theme.json style array resolved as SCSS files — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:81
- confirmed `theme:compile` — console command that compiles theme SCSS — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `ScssPhp\ScssPhp\Compiler` — PHP SASS compiler used for theme SCSS — vendor/shopware/storefront/Theme/ScssPhpCompiler.php:5
