---
id: platform/dev/6.6/guides/plugins/themes/add-icons.md
title: Add custom icons
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/themes/add-icons.html
sourceHash: b43f664d2c29300f790e899bb9336f871ed49254
keywords: ["sw_icon", "icon renderer", "theme.json", "iconSets", "custom icons", "storefront icons", "namespace parameter", "icon pack", "solid icon pack", "default icon pack", "twig action", "storefront theme"]
summary: How to add custom icons to the Storefront via the sw_icon twig action and theme.json iconSets configuration.
lastBuilt: "2026-09-15"
---
## What it is

This guide explains how to render icons in the Storefront using the `sw_icon` twig action, and how to add custom icon packs to a plugin or theme.

## When to use

Use this when a plugin or theme needs to display an icon in the Storefront, either reusing Shopware's built-in icons or shipping custom ones.

## Key steps / config

- Save custom icon images under the default path:

```text
<YourPlugin>/src/Resources/app/storefront/dist/assets/icon/default
```

- To provide additional icon packs (e.g. "solid"), create a folder named after the pack:

```text
<YourPlugin>/src/Resources/app/storefront/dist/assets/icon/<pack-name>
```

- Render an icon with the `sw_icon` twig action:

```twig
{% sw_icon 'done-outline-24px' style {
    'namespace': 'TestPlugin'
} %}
```

- `style` object parameters: `size`, `namespace` (theme name to search the icon in), `pack`, `color`, `class`.
- Since Shopware 6.4.1.0, custom icon locations can be defined in `theme.json` under `iconSets`:

```json
{
  "iconSets": {
    "custom-icons": "app/storefront/src/assets/icon-pack/custom-icons"
  }
}
```

- Use the custom pack by name: `{% sw_icon 'done-outline-24px' style { 'pack': 'custom-icons' } %}`.
- By default, Shopware looks inside the `default` folder for icons; built-in icons are available as `default` and `solid` packs.

## Essential identifiers

- `sw_icon` (twig action)
- `iconSets` (theme.json key)
- `namespace`, `pack`, `size`, `color`, `class` (style parameters)

## Gotchas

- Icons and other custom assets are not included in theme inheritance — a theme cannot override a core icon just by placing a file at the same relative path.
- If no deviating `namespace` is configured, Shopware displays the Storefront's default icons instead of the custom ones.
- Defining custom icon locations via `iconSets` is mandatory when the theme is shipped as an App, otherwise the custom icons cannot be loaded.

## Version notes

`iconSets` support in `theme.json` is available since Shopware 6.4.1.0.
