---
id: platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md
title: Add Assets to a Theme
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/assets/add-assets-to-theme.html
sourceHash: 40c9e3626d13b4e60621272f88a1416d3565e1cb
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme assets", "theme.json", "asset", "theme:compile", "bin/console theme:compile", "asset()", "$app-css-relative-asset-path", "ThemeAssetPackage", "images", "fonts", "public/theme", "scss background image"]
summary: "Theme assets: declare dirs in theme.json asset key, copy via theme:compile, link with asset(path, 'theme') or $app-css-relative-asset-path."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md"]
---
## What it is

How to store custom static assets (images, fonts, etc.) in a Storefront theme and reference them from Twig templates and SCSS. Two ways exist: declare asset directories in the theme's `theme.json`, or use the regular plugin asset mechanism (covered in the plugin guide on custom assets).

## When to use

Your theme needs its own images or other files served from the public theme directory, e.g. a background image in SCSS or an `<img>` in an overridden template.

## Key steps / config

1. Declare the asset directory in `<plugin root>/src/Resources/theme.json` (path relative to `Resources/`; see [Theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md)):

   ```json
   {
     "asset": [
       "app/storefront/src/assets"
     ]
   }
   ```

   An entry starting with `@` (e.g. `"@Storefront"`) pulls in the asset paths of that named theme.

2. Run `bin/console theme:compile`. It copies every file of each listed directory to `public/theme/<theme-id>/<directory-basename>/...`, separately from the compiled CSS/JS:

   ```text
   public/theme
   ├── <theme-prefix>/css/all.css, js/...
   └── <theme-id>
       └── assets
           └── your-image.png
   ```

3. Link from Twig with the `asset` function and the `theme` package:

   ```twig
   <img src="{{ asset('/assets/your-image.png', 'theme') }}">
   ```

4. Link from SCSS with the `$app-css-relative-asset-path` variable:

   ```scss
   body {
       background-image: url('#{$app-css-relative-asset-path}/your-image.png');
   }
   ```

Alternative: the plugin way of adding assets (see the plugin storefront guide on custom assets). Next step: [Customize templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md).

## Essential identifiers

- `theme.json` key `asset`
- `bin/console theme:compile`
- Twig `asset('/assets/...', 'theme')` (service `shopware.asset.theme`, class `ThemeAssetPackage`)
- SCSS `$app-css-relative-asset-path`

## Gotchas

- The target sub-folder is the basename of the configured directory. The `theme` asset package only maps paths starting with `/assets` to `/theme/<theme-id>`, and `$app-css-relative-asset-path` defaults to `<theme-id>/assets`, so name the source directory `assets` (as in the example) for both links to resolve.
- The docs' tree shows the copied folder as `asset`; with the example config the installed code writes it as `assets`.
- `theme:compile` deletes `theme/<theme-id>` before copying assets again, so do not place files there by hand.

## Code check (6.7.15.1)
- confirmed `asset` — theme.json key mapped to setAssetPaths — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:90
- confirmed `@` — asset entries prefixed with @ resolve another theme's assets — vendor/shopware/storefront/Theme/ThemeCompiler.php:564
- corrected `$parentName` — docs: assets copied to `<theme-asset-uuid>/asset/`; code uses theme/<theme-id>/<basename of dir> — vendor/shopware/core/Framework/Adapter/Filesystem/Plugin/CopyBatchInputFactory.php:30
- confirmed `$assetPath` — asset target is theme/<themeId>, deleted before copying — vendor/shopware/storefront/Theme/ThemeCompiler.php:867
- confirmed `theme:compile` — console command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- confirmed `shopware.asset.theme` — asset package registered as `theme` — vendor/shopware/storefront/DependencyInjection/theme.php:327
- confirmed `/assets` — theme package maps /assets paths to /theme/<themeId> — vendor/shopware/storefront/Theme/ThemeAssetPackage.php:64
- confirmed `$app-css-relative-asset-path` — SCSS default points at <theme-id>/assets — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/variables/_custom.scss:34
