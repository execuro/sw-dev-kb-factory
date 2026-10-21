---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/using-assets.md
title: Using Assets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/using-assets.html
sourceHash: d4c137c5e632cb7d762b351b1718d7226219a5cd
codeCheckedAgainst: "6.7.15.1"
keywords: ["assets", "images", "static files", "asset filter", "Shopware.Filter.getByName", "assets:install", "bin/console assets:install", "Resources/app/administration/static", "public/bundles", "assetsPath", "administration", "plugin assets"]
summary: Ship images and other static files with a plugin for the Administration via Resources/app/administration/static, assets:install and the asset filter.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md"]
---
## What it is

How a plugin provides its own images or other static assets and references them from Administration components and templates. Prerequisite: a plugin (see [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## When to use

Your Administration module or component needs a custom image, icon or other static file shipped with the plugin.

## Key steps / config

1. Put the asset in the plugin's `src/Resources/app/administration/static` folder:

```text
<plugin root>
├── composer.json
└── src
    ├── Resources/app/administration/static/your-image.png
    └── SwagBasicExample.php
```

2. Copy assets into the public folder, as for [Storefront assets](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md):

```bash
bin/console assets:install
```

`assets:install` copies the bundle's `Resources/public` directory to `public/bundles/<bundle name lowercased, "bundle" suffix stripped>`, e.g. `public/bundles/swagbasicexample`. Administration `static` files end up below `administration/static/` inside that bundle directory (the Administration build output), so the public URL is `bundles/swagbasicexample/administration/static/your-image.png`.

3. Expose the `asset` filter as a computed property:

```javascript
computed: {
    assetFilter() {
        return Shopware.Filter.getByName('asset');
    },
}
```

4. Use it in a template; the filter prefixes the path with the bundles base URL (`Shopware.Context.api.assetsPath`) and strips a leading `/`:

```html
<img :src="assetFilter('/swagbasicexample/administration/static/your-image.png')">
```

## Essential identifiers

- `Resources/app/administration/static`
- `bin/console assets:install`
- `Shopware.Filter.getByName('asset')`, `Shopware.Context.api.assetsPath`
- `public/bundles/<bundle>/administration/static/`

## Gotchas

- The source writes the filter argument as `'/<plugin root>/administration/static/your-image.png'`; the first segment is the lowercased bundle directory under `public/bundles` (Shopware's own files use `/administration/administration/static/...` — "administration" twice is intended).
- The source's tree shows `your-image.png` directly in `public/bundles/swagbasicexample`; the code paths it under `administration/static/`.

## Code check (6.7.15.1)
- confirmed `assets:install` — command registered — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:23
- confirmed `EXTENSION_RESOURCES_DIRECTORY` — assets copied from the bundle's `Resources/public` — vendor/shopware/core/Framework/Plugin/Util/AssetService.php:40
- confirmed `AssetService::getTargetDirectory()` — target is `bundles/` + lowercased name without `bundle` suffix — vendor/shopware/core/Framework/Plugin/Util/AssetService.php:248
- confirmed `asset` — filter registered, prefixes `Shopware.Context.api.assetsPath`, strips leading slash — vendor/shopware/administration/Resources/app/administration/src/app/filter/asset.filter.ts:5
- confirmed `Shopware.Filter.getByName` — maps to `FilterFactory.getByName` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:193
- corrected `administration/static` — docs: asset lands at `bundles/swagbasicexample/your-image.png`; code: `<assetsPath><bundle>/administration/static/…` — vendor/shopware/administration/Resources/app/administration/src/core/factory/router.factory.js:395
- confirmed `assetFilter` — core template uses `/administration/administration/static/...` — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-payment/component/sw-settings-payment-sorting-modal/sw-settings-payment-sorting-modal.html.twig:42
- unverified `Resources/app/administration/static` — copying into `Resources/public` is done by the Administration build, outside the checked roots
