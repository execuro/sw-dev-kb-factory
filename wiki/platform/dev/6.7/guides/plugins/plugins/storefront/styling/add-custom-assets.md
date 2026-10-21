---
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md
title: Add Custom Assets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-custom-assets.html
sourceHash: 9a87e07ece698c5812d3680f6551b553a8d2d5c6
codeCheckedAgainst: "6.7.15.1"
keywords: ["assets:install", "src/Resources/public", "public/bundles", "asset()", "$sw-asset-public-url", "sw_extends", "base_main", "custom assets", "plugin images", "static files", "scss background image", "AssetInstallCommand"]
summary: "Plugin static assets: put files in src/Resources/public, run assets:install, reference them via Twig asset() or SCSS."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md"]
---
## What it is

How a plugin ships its own static assets (images and other files) and links to them from Storefront Twig templates and SCSS.

## When to use

When a plugin needs its own images or other static files in the Storefront. Assumes a running plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)). For media managed in the shop (thumbnails), see [Media and thumbnails](platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md).

## Key steps / config

1. Put the files into `<plugin root>/src/Resources/public/` (e.g. `src/Resources/public/your-image.png`).
2. Run `bin/console assets:install` — do not copy by hand. It copies each bundle's `Resources/public` to `public/bundles/<name>`, where `<name>` is the lowercased bundle name with a trailing `bundle` stripped (`SwagBasicExample` → `public/bundles/swagbasicexample/`).
3. Link from Twig with the `asset()` function and the `asset` package:

```twig
{% sw_extends '@Storefront/storefront/base.html.twig' %}

{% block base_main %}
    <img src="{{ asset('bundles/swagbasicexample/image.png', 'asset') }}">
    {{ parent() }}
{% endblock %}
```

4. Link from SCSS (e.g. `src/Resources/app/storefront/src/scss/base.scss`) using the theme compiler variable:

```scss
body {
    background-image: url("#{$sw-asset-public-url}/bundles/swagbasicexample/image.png");
}
```

## Essential identifiers

- `bin/console assets:install` (Shopware `AssetInstallCommand`; `--force` ignores the asset manifest)
- `src/Resources/public` → `public/bundles/<lowercased-name>/`
- Twig `asset('<path>', 'asset')`, `sw_extends`, block `base_main`
- SCSS variable `$sw-asset-public-url`

## Gotchas

- The source example stores `your-image.png` but references `image.png`; the path in `asset()`/`url()` must match the actual filename under `bundles/<name>/`.
- `assets:install` also copies assets for active apps and the Installer, not only plugins.
- Themes have an additional way to integrate assets (theme guide on adding assets to a theme, not linked here).

## Code check (6.7.15.1)
- confirmed `assets:install` — Shopware's own command — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:23
- confirmed `AssetInstallCommand::configure()` — `--force` option — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:41
- confirmed `Resources/public` — source directory constant — vendor/shopware/core/Framework/Plugin/Util/AssetService.php:40
- confirmed `getTargetDirectory()` — `bundles/` + lowercased name minus `bundle` — vendor/shopware/core/Framework/Plugin/Util/AssetService.php:248
- confirmed `shopware.asset.asset` — asset package tagged `asset` — vendor/shopware/core/Framework/DependencyInjection/filesystem.php:127
- confirmed `sw-asset-%s-url` — theme compiler emits one SCSS variable per asset package — vendor/shopware/storefront/Theme/ThemeCompiler.php:737
- confirmed `public` — asset package that yields `$sw-asset-public-url` — vendor/shopware/core/Framework/DependencyInjection/filesystem.php:104
- confirmed `base_main` — block in Storefront base template — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:64
- unverified `asset()` — Twig function provided by Symfony, outside vendor/shopware roots
