---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/using-assets.md
title: Using Assets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/using-assets.html
sourceHash: d4c137c5e632cb7d762b351b1718d7226219a5cd
codeCheckedAgainst: "6.7.13.0"
keywords: ["assets", "images", "static files", "Resources/app/administration/static", "assets:install", "public/bundles", "asset filter", "Shopware.Filter.getByName", "assetFilter", "assetsPath", "administration", "plugin assets"]
summary: "Ship images/static files in a plugin's Resources/app/administration/static, publish with bin/console assets:install, and resolve URLs via the asset filter."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md"]
---
## What it is

How a plugin provides custom images or other static files for use in the Administration: store them in the plugin's Administration `static` folder, publish them to `public/bundles`, and build their URL with the `asset` filter.

## When to use

A plugin's Administration module or component needs to display its own image or reference another static file. Requires an existing plugin (see [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## Key steps / config

1. Put the file into `src/Resources/app/administration/static`:

```
<plugin root>
├── composer.json
└── src
    ├── Resources/app/administration/static/your-image.png
    └── SwagBasicExample.php
```

2. Publish assets (same as for the Storefront, see [add custom assets](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md)):

```bash
bin/console assets:install
```

The command copies each bundle's `Resources/public` directory to `public/bundles/<bundle name lowercased, trailing "bundle" stripped>`, e.g. `public/bundles/swagbasicexample/`. Add `--force` to copy regardless of the asset manifest state.

3. Expose the filter as a computed property:

```javascript
computed: {
    assetFilter() {
        return Shopware.Filter.getByName('asset');
    },
}
```

4. Use it in the template (`twig`/`html`):

```html
<img :src="assetFilter('/<plugin root>/administration/static/your-image.png')">
```

The `asset` filter strips one leading `/` and prefixes `Shopware.Context.api.assetsPath`, which is `<installation path>/bundles/` (`/bundles/` in dev mode). The argument is therefore a path below `public/bundles` — core itself builds `administration/static/img/...` URLs this way, so a plugin image resolves as `<plugin name lowercased>/administration/static/your-image.png`.

## Essential identifiers

- `Resources/app/administration/static`
- `bin/console assets:install`
- `public/bundles`
- `Shopware.Filter.getByName('asset')`
- `Shopware.Context.api.assetsPath`

## Gotchas

- In the installed code `assets:install` copies from each bundle's `Resources/public`, not directly from `Resources/app/administration/static`; how the static folder ends up under `Resources/public/administration/static` (the plugin's Administration build) was not verified in the checked code.
- The filter returns an empty string for an empty value.

## Code check (6.7.13.0)
- confirmed `assets:install` — Shopware `AssetInstallCommand` with `--force` option — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:22
- corrected `Resources/public` — docs: assets copied from the `static` folder; code copies each bundle's `Resources/public` — vendor/shopware/core/Framework/Plugin/Util/AssetService.php:41
- confirmed `bundles` — target `bundles/<lowercased name without bundle suffix>` — vendor/shopware/core/Framework/Plugin/Util/AssetService.php:251
- deprecated `AssetService` — `@deprecated tag:v6.8.0` becomes internal — vendor/shopware/core/Framework/Plugin/Util/AssetService.php:39
- confirmed `asset` — filter strips leading slash, prefixes assetsPath — vendor/shopware/administration/Resources/app/administration/src/app/filter/asset.filter.ts:5
- confirmed `Shopware.Filter.getByName` — used with `'asset'` in core modules — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-services/page/sw-settings-services-index/index.ts:46
- confirmed `getAssetsPath` — returns `/bundles/` in dev mode, else installation path plus `/bundles/` — vendor/shopware/administration/Resources/app/administration/src/core/factory/api-context.factory.js:73
- confirmed `assetsPath` — core builds `administration/static/img/...` URLs from it — vendor/shopware/administration/Resources/app/administration/src/core/factory/router.factory.js:391
- unverified `Resources/app/administration/static` — copy into `Resources/public` happens in the Administration build config, outside the checked roots
