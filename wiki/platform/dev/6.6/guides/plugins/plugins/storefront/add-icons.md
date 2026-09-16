---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-icons.md
title: Add custom icons
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-icons.html
sourceHash: 8d4eae977eb85c0ac2d862806e3698a35329f950
keywords: ["custom icons", "sw_icon", "icon renderer", "namespace parameter", "pack parameter", "solid icon pack", "default icon pack", "icon style", "theme icons", "icon directory", "storefront icon"]
summary: How to add and render custom Storefront icons in Shopware 6 via the sw_icon twig action, its namespace and pack parameters.
lastBuilt: 2026-09-15
---
## What it is

This guide explains how to use the icon renderer component and add custom icons to the Storefront, in either a plugin or a theme.

## When to use

Use this when a plugin or theme needs to display a custom icon (not one of Shopware's default icons) in the Storefront.

## Key steps / config

1. Save the icon file under the default icon path in the plugin/theme:

```text
<YourPlugin>/src/Resources/app/storefront/dist/assets/icon/default
```

Custom pack names (e.g. "solid") can be used instead by creating a differently named folder:

```text
<YourPlugin>/src/Resources/app/storefront/dist/assets/icon/<pack-name>
```

By default Shopware looks inside the `default` folder.

2. Render the icon with the `sw_icon` twig action, configuring a `style` object:

```twig
{% sw_icon 'done-outline-24px' style {
    'size': 'lg',
    'namespace': 'TestPlugin',
    'pack': 'solid'
} %}
```

The `style` object supports these parameters:

| Configuration | Description |
| :--- | :--- |
| `size` | Sets the size of the icon |
| `namespace` | Selects the namespace (source) the icon is searched in — key for custom icons |
| `pack` | Selects the icon pack (e.g. `default`, `solid`) |
| `color` | Sets the color of the icon |
| `class` | Defines a CSS class on the icon |

Shopware's own default icons are available as `default` and `solid` packs.

## Essential identifiers

- twig action `sw_icon`
- `style` parameters: `size`, `namespace`, `pack`, `color`, `class`
- default asset path `<YourPlugin>/src/Resources/app/storefront/dist/assets/icon/default`

## Gotchas

If no `namespace` is configured, Shopware falls back to displaying the Storefront's own default icons instead of the custom one. Also, icons (and other custom assets) are not included in theme inheritance — placing an icon in a directory mirroring the core structure inside a theme does not automatically override the core icon, unlike other theme-inherited files.
