---
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md
title: Add Custom Assets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-custom-assets.html
sourceHash: 9a87e07ece698c5812d3680f6551b553a8d2d5c6
codeCheckedAgainst: "6.7.13.0"
keywords: ["assets:install", "src/Resources/public", "public/bundles", "asset()", "$sw-asset-public-url", "sw_extends", "base_main", "custom assets", "plugin images", "static files", "scss asset url", "storefront"]
summary: Put plugin images/files in src/Resources/public, copy them with bin/console assets:install, link via Twig asset() or SCSS $sw-asset-public-url.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md"]
---
## What it is

How a Shopware plugin ships its own static assets (images and other files), gets them published under `public/bundles`, and references them from Storefront Twig templates and SCSS.

## When to use

Your plugin needs a custom image or other static file in the Storefront, either in a template (`<img>`) or in a stylesheet (for example a `background-image`). For media, see [Media and thumbnails](platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md). Prerequisite: a working plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## Key steps / config

1. Create the folder `src/Resources/public` in the plugin and store the asset there:

   ```text
   <plugin root>
   ├── composer.json
   └── src
       ├── Resources/public/your-image.png
       └── SwagBasicExample.php
   ```

2. Copy plugin assets into `public/bundles` with `bin/console assets:install` (do not copy by hand). The bundle folder is the lowercased plugin name, e.g. `public/bundles/swagbasicexample/your-image.png`.

3. Link from a Storefront template with Symfony's `asset()` function, using the `asset` package:

   ```twig
   {% sw_extends '@Storefront/storefront/base.html.twig' %}
   {% block base_main %}
       <img src="{{ asset('bundles/swagbasicexample/image.png', 'asset') }}">
       {{ parent() }}
   {% endblock %}
   ```

4. Link from SCSS (e.g. `src/Resources/app/storefront/src/scss/base.scss`) with the theme compiler variable for the `public` asset package:

   ```scss
   body {
       background-image: url("#{$sw-asset-public-url}/bundles/swagbasicexample/image.png");
   }
   ```

   The theme compiler generates one `sw-asset-<package>-url` SCSS variable per asset package tagged `shopware.asset`; core registers packages named `public`, `asset` and `sitemap`, Storefront adds `theme`.

## Essential identifiers

- `bin/console assets:install`
- `src/Resources/public` → `public/bundles/<pluginname>/`
- Twig: `asset('bundles/<pluginname>/<file>', 'asset')`
- SCSS: `$sw-asset-public-url`
- `shopware.asset.public`, `shopware.asset.asset` (asset package services)

## Gotchas

- Assets placed in `src/Resources/public` are not served until `assets:install` has run.
- Themes can use custom assets the same way, and additionally have another integration mechanism described in the theme guide on adding assets to a theme.

## Code check (6.7.13.0)
- confirmed `assets:install` — console command in core — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:22
- confirmed `sw-asset-%s-url` — SCSS variable generated per asset package before the enrich event — vendor/shopware/storefront/Theme/ThemeCompiler.php:728
- confirmed `shopware.asset.public` — asset package tagged with asset="public", source of `$sw-asset-public-url` — vendor/shopware/core/Framework/DependencyInjection/filesystem.xml:71
- confirmed `shopware.asset.asset` — asset package tagged asset="asset", used by `asset(..., 'asset')` — vendor/shopware/core/Framework/DependencyInjection/filesystem.xml:98
- confirmed `base_main` — block exists in Storefront base template — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:64
- unverified `asset()` — Twig function provided by Symfony, out of scope
