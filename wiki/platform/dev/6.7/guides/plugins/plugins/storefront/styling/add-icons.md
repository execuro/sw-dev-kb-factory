---
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md
title: Add Custom Icons
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-icons.html
sourceHash: 1f57b68d4799d0f08ac11dba2397c618cb309ccc
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw_icon", "icon.html.twig", "namespace", "pack", "dist/assets/icon/default", "solid icons", "svg icons", "icon pack", "custom icons", "twig tag", "theme icons", "storefront"]
summary: Render Storefront SVG icons with the sw_icon Twig tag; custom icons live in Resources/app/storefront/dist/assets/icon/<pack> and need a namespace.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md", "platform/dev/6.7/guides/plugins/themes/_index.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to render icons in the Storefront with the `sw_icon` Twig tag and how a plugin or [theme](platform/dev/6.7/guides/plugins/themes/_index.md) provides its own SVG icons and icon packs.

## When to use

You want to show a built-in Storefront icon, or ship custom SVG icons from your plugin/theme. Prerequisites: a plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)); the [custom assets guide](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md) is useful background.

## Key steps / config

1. Save the SVG files in the plugin under the default pack folder:

   ```text
   <YourPlugin>/src/Resources/app/storefront/dist/assets/icon/default
   ```

   Other packs (e.g. `solid` or any custom name) are sibling folders: `<YourPlugin>/src/Resources/app/storefront/dist/assets/icon/<pack-name>`.

2. Render the icon with `sw_icon`, passing the icon file name (without `.svg`) and a `style` object:

   ```twig
   {% sw_extends '@Storefront/storefront/base.html.twig' %}
   {% block base_body %}
       {% sw_icon 'done-outline-24px' style {
           'size': 'lg',
           'namespace': 'TestPlugin',
           'pack': 'solid'
       } %}
       {{ parent() }}
   {% endblock %}
   ```

3. Set `namespace` to the bundle (plugin/theme) name holding the icon. The tag includes `@Storefront/storefront/utilities/icon.html.twig`, which loads `@<namespace>/assets/icon/<pack>/<name>.svg`; the plugin's `Resources/app/storefront/dist` directory is registered as that Twig namespace.

`style` parameters:

| Key | Effect |
|---|---|
| `size` | icon size (adds CSS class `icon-<size>`) |
| `namespace` | bundle the icon is loaded from; default `Storefront` |
| `pack` | icon pack folder; default `default` |
| `color` | icon color (adds CSS class `icon-<color>`) |
| `class` | extra class for the icon |

The template also reads `rotation`, `flip`, `ariaHidden` (default true) and `ariaLabel`.

## Essential identifiers

- `sw_icon` Twig tag, `style` object
- `@Storefront/storefront/utilities/icon.html.twig`
- `src/Resources/app/storefront/dist/assets/icon/<pack>`
- Packs shipped by Storefront: `default`, `solid`

## Gotchas

- Without a `namespace`, Shopware renders the Storefront's own icon of that name, not yours.
- Icons and other custom assets are not part of theme inheritance: placing an icon in your theme at a path mirroring the core folder structure does not override the core icon.
- A missing SVG does not raise an error; the template uses `source(..., ignore_missing = true)` and renders an empty span.

## Code check (6.7.13.0)
- confirmed `sw_icon` — Twig tag registered by IconTokenParser — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:44
- confirmed `@Storefront/storefront/utilities/icon.html.twig` — template included by the tag — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:21
- confirmed `pack` — defaults to `default` — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:7
- confirmed `namespace` — defaults to `Storefront` — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:11
- confirmed `assets/icon/` — lookup path `@namespace/assets/icon/pack/name.svg` — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:29
- confirmed `size` — style keys size, color, rotation, flip, class — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:4
- confirmed `app/storefront/dist` — registered as the bundle's Twig namespace path — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/TwigLoaderConfigCompilerPass.php:31
