---
id: platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/using-assets.md
title: Using assets
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/templates-styling/using-assets.html
sourceHash: ed1c6ee0d8432c8b3da780c7a790b78b48e3c77b
keywords: ["asset filter", "Shopware.Filter.getByName", "bin/console assets:install", "Resources/app/administration/static", "public/bundles", "administration assets", "Vue filters", "computed property", "plugin assets", "twig template", "custom images", "static folder"]
summary: "How to add plugin image/static assets under Resources/app/administration/static and use them in the Administration via the asset filter."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-assets.md"]
---
## What it is

This guide explains how to add custom assets (images or other static files) to a plugin and use them inside the Shopware Administration.

## When to use

When a plugin's own Administration UI needs custom images or other static assets, rather than relying on core assets.

## Key steps / config

1. Place assets under `Resources/app/administration/static` in the plugin:

```text
# PluginRoot
.
└── src
    ├── Resources
    │   └── app
    │       └── administration
    │             └── static
    │                   └── your-image.png
    └── SwagBasicExample.php
```

2. Run `bin/console assets:install` to copy the plugin assets into `public/bundles` (e.g. `shopware-root/public/bundles/swagbasicexample/your-image.png`).
3. In the Administration, use the `asset` filter. Since Vue filters are unsupported in Vue3, wrap it in a computed property:

```javascript
computed: {
    assetFilter() {
        return Shopware.Filter.getByName('asset');
    },
}
```

4. Reference the asset in the template:

```html
<img :src="assetFilter('/<plugin root>/static/your-image.png')">
```

## Essential identifiers

- `Resources/app/administration/static` — plugin asset folder
- `bin/console assets:install`
- `Shopware.Filter.getByName('asset')`
- `public/bundles`

## Gotchas

Vue filters (the classic `{{ value | filter }}` syntax) are no longer supported in Vue3 and therefore do not function in Shopware 6.6 and above — use `Shopware.Filter.getByName` in a computed property instead.
