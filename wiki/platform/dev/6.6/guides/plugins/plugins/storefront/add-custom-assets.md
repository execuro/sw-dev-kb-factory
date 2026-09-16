---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-assets.md
title: Add custom assets
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-custom-assets.html
sourceHash: 60c2481c447f107001dbdecb951b5d12cfaccb9f
keywords: ["custom assets", "public folder", "assets:install", "bin/console assets:install", "public/bundles", "asset function", "sw-asset-public-url", "storefront images", "base.html.twig", "add-assets-to-theme", "twig asset"]
summary: How to store custom plugin assets in a public folder and link to them from Storefront templates and CSS via Symfony's asset function.
lastBuilt: 2026-09-15
---
## What it is

This guide describes how to add and use custom images or other assets — such as icons or files — in a Shopware 6 Storefront plugin.

## When to use

Use this when a plugin needs to ship its own static asset files (images, etc.) and reference them from Storefront templates or CSS.

## Key steps / config

1. Create a `public` folder inside `src/Resources` of the plugin and place the asset file there:

```text
.
├── composer.json
└── src
    ├── Resources
    │   ├── public
    │   │   └── your-image.png
    └── SwagBasicExample.php
```

2. Run `bin/console assets:install` to copy plugin assets into `public/bundles`, where each plugin gets its own subfolder (e.g. `swagbasicexample`):

```text
# shopware-root/public/bundles
.
├── administration
├── framework
├── storefront
└── swagbasicexample
    └── your-image.png
```

3. Link the asset in a Storefront template using Symfony's `asset` function:

```twig
{% sw_extends '@Storefront/storefront/base.html.twig' %}
{% block base_main %}
    <img src="{{ asset('bundles/swagbasicexample/image.png', 'asset') }}">
    {{ parent() }}
{% endblock %}
```

4. Or reference the same path from a CSS file using the `$sw-asset-public-url` variable:

```css
body {
    background-image: url("#{$sw-asset-public-url}/bundles/swagbasicexample/image.png");
}
```

Custom assets used inside a theme (as opposed to a plugin) follow a different integration path, covered separately in the theme guide on adding assets to a theme.

## Essential identifiers

- `src/Resources/public/` — plugin asset source folder
- `bin/console assets:install` — copies assets to `public/bundles/<plugin-name>/`
- Symfony `asset()` twig function
- `$sw-asset-public-url` — SCSS variable for the asset base path

## Gotchas

Assets are not copied manually; only `bin/console assets:install` moves them into `public/bundles`, where the folder name matches the plugin's technical name (e.g. `swagbasicexample`).
