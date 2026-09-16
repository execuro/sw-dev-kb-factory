---
id: platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md
title: Add Assets to a Theme
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/assets/add-assets-to-theme.html
sourceHash: 40c9e3626d13b4e60621272f88a1416d3565e1cb
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme.json", "asset", "theme:compile", "asset()", "$app-css-relative-asset-path", "app/storefront/src/assets", "public/theme", "theme assets", "images", "fonts", "scss background image", "twig asset function"]
summary: Declare theme asset folders in the theme.json asset array, run theme:compile, and link them from Twig via asset() or from SCSS.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md"]
---
## What it is

How a Storefront theme ships custom assets (images, fonts, etc.) and how templates and stylesheets reference them. Two options exist: declare asset paths in `theme.json`, or use the regular plugin asset mechanism.

## When to use

Your theme needs its own static files — for example a background image referenced from SCSS or an image rendered in a Twig template. Builds on "create a first theme".

## Key steps / config

1. **Declare the asset directory** in `<plugin root>/src/Resources/theme.json` (see [Theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md)). Relative paths are resolved against the theme's `Resources` directory:

```json
{
  "asset": [
    "app/storefront/src/assets"
  ]
}
```

   An entry starting with `@` (e.g. `@Storefront`) pulls in the assets of that named theme configuration.
2. **Compile:** `bin/console theme:compile`. The compiler copies the declared asset directories into `<shopware root>/public/theme/<theme-id>`, while the compiled CSS/JS (`css/all.css`, `js/all.js`) go into a separate folder under `public/theme/` built from sales channel, theme and hash.
3. **Link from Twig** with the `asset` function and the `theme` package:

```twig
<img src="{{ asset('/assets/your-image.png', 'theme') }}">
```

   Paths starting with `/assets` are prefixed with `/theme/<theme-id>`.
4. **Link from SCSS:**

```scss
body {
    background-image: url('#{$app-css-relative-asset-path}/your-image.png');
}
```

Alternative: add assets the plugin way — see the plugin custom-assets guide.

## Essential identifiers

- `theme.json` key `asset` (array of directories)
- `bin/console theme:compile`
- `asset('/assets/…', 'theme')` — Twig asset function with the `theme` package (`shopware.asset.theme`)
- `$app-css-relative-asset-path` — SCSS variable pointing at the theme's asset folder
- `<shopware root>/public/theme/`

## Gotchas

- Assets from `theme.json` are only published by `theme:compile`; re-run it after adding files.
- The docs label the asset target folder `<theme-asset-uuid>`; in code it is the theme id, and the compiler deletes and re-copies that folder on each compile.

## Code check (6.7.13.0)
- confirmed `asset` — theme.json key stored via setAssetPaths — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:90
- confirmed `@` — asset entries prefixed with @ resolve another theme's assets — vendor/shopware/storefront/Theme/ThemeCompiler.php:562
- corrected `theme` — docs: separate theme-asset-uuid folder; code copies assets to theme/ plus the theme id — vendor/shopware/storefront/Theme/ThemeCompiler.php:858
- confirmed `$compileLocation` — compiled CSS/JS go to theme/ plus the generated theme prefix — vendor/shopware/storefront/Theme/ThemeCompiler.php:829
- confirmed `theme:compile` — console command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `/assets` — theme package prefixes /assets paths with /theme/ plus the theme id — vendor/shopware/storefront/Theme/ThemeAssetPackage.php:64
- confirmed `shopware.asset.theme` — service backing the theme asset package — vendor/shopware/storefront/DependencyInjection/theme.php:310
- confirmed `$app-css-relative-asset-path` — SCSS variable default — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/variables/_custom.scss:34
