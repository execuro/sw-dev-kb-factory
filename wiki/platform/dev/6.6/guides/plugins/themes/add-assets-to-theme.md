---
id: "platform/dev/6.6/guides/plugins/themes/add-assets-to-theme.md"
title: "Add assets to a Theme"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/themes/add-assets-to-theme.html"
sourceHash: "8c9dc5f4db70c2892df8bce8dec083cb17847b11"
keywords: ["theme assets", "theme.json asset", "theme:compile", "twig asset function", "app-css-relative-asset-path", "theme images", "custom assets", "public/theme", "theme-asset-uuid", "storefront assets", "SCSS asset linking"]
summary: "Explains configuring a theme's asset path in theme.json, compiling it, and linking assets from Twig and SCSS."
lastBuilt: "2026-09-15"
---
## What it is
Explains the two ways to add custom assets — such as images — to a theme, and how to reference them from Twig templates and SCSS files.

## When to use
Use this when a theme needs to ship its own images, fonts, or other static assets, either as a dedicated theme asset path or reused from the default plugin asset mechanism.

## Key steps / config
There are two ways to add assets to a theme: configuring the `asset` path in `theme.json`, or using the default plugin way of handling assets.

To use the `theme.json` approach, configure the `asset` key with the path to the custom assets directory:

```javascript
// <plugin root>/src/Resources/theme.json
{
  "asset": [
     "app/storefront/src/assets"
   ]
}
```

Then run `bin/console theme:compile`. This copies the assets declared in `theme.json` to `<shopware root>/public/theme/<theme-asset-uuid>/asset`, alongside the compiled CSS and JS which are stored separately under `<theme-uuid>/css` and `<theme-uuid>/js`.

To link an asset from Twig, use the `asset` Twig function:

```html
<img src="{{ asset('/assets/your-image.png', 'theme') }}">
```

To link an asset from SCSS, use the `$app-css-relative-asset-path` variable:

```css
body {
    background-image: url('#{$app-css-relative-asset-path}/your-image.png');
}
```

The alternative "plugin way" of adding assets follows the same default mechanism used by regular plugins for storefront assets, rather than the theme-specific `asset` configuration in `theme.json`.

## Essential identifiers
- `theme.json` `asset` key — declares custom asset paths for a theme
- `bin/console theme:compile` — compiles the theme and copies assets to `public/theme/<theme-asset-uuid>`
- `{{ asset(path, 'theme') }}` — Twig function used to link a theme asset
- `$app-css-relative-asset-path` — SCSS variable for linking theme assets
