---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md
relatedPages:
  - platform/dev/6.7/guides/plugins/themes/_index.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md
sourceHash: 1f57b68d4799d0f08ac11dba2397c618cb309ccc
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-icons.html
title: Add Custom Icons
version: "6.7"
versions:
  - "6.7"
keywords: ["sw_icon", "icon", "svg icon", "custom icons", "icon pack", "namespace", "pack", "solid", "default", "icon.html.twig", "IconTokenParser", "dist/assets/icon", "storefront twig"]
summary: "Render SVG icons in Storefront Twig with the sw_icon tag; custom icons live in dist/assets/icon/<pack> and need the plugin or theme namespace."
lastBuilt: 2026-10-21
---
## What it is

The `sw_icon` Twig tag renders an SVG icon inline in the Storefront. Plugins and [themes](platform/dev/6.7/guides/plugins/themes/_index.md) can ship their own icons and point the tag at them with the `namespace` and `pack` options.

## When to use

You need to show an icon in a Storefront template, either a core icon (the `default` and `solid` packs) or one shipped with your plugin or theme. You need a working plugin first ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)). Handling other assets is covered in [Add custom assets](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md).

## Key steps / config

1. Save the SVG in your extension under the pack folder:
   - default pack: `<YourPlugin>/src/Resources/app/storefront/dist/assets/icon/default`
   - custom pack: `<YourPlugin>/src/Resources/app/storefront/dist/assets/icon/<pack-name>`
2. Render it. The first argument is the file name without `.svg`. Set `namespace` to your bundle (plugin or theme) name:
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
3. Options of the `style` object:

| Option | Effect |
|---|---|
| `size` | adds `icon-<size>` class |
| `namespace` | Twig namespace the SVG is loaded from (default `Storefront`) |
| `pack` | icon folder (default `default`) |
| `color` | adds `icon-<color>` class |
| `class` | extra CSS class |

The installed template also reads `rotation`, `flip`, `ariaHidden` (default `true`) and `ariaLabel`.

## Essential identifiers

- `sw_icon` (Twig tag) with a `style` object
- `@Storefront/storefront/utilities/icon.html.twig`
- `src/Resources/app/storefront/dist/assets/icon/<pack>`
- packs `default`, `solid`

## Gotchas

- Without a `namespace`, Shopware loads from `Storefront`, so the core icon with that name is shown or nothing renders.
- Icons and other custom assets are not part of theme inheritance. A theme cannot override a core icon by placing a file at the matching path. Reference your own namespace explicitly instead.
- The SVG is loaded with `ignore_missing = true`, so a wrong name, pack or namespace renders an empty `span` without an error.
- When the active theme defines an icon config for the requested pack (`themeIconConfig[pack]`), that config's namespace and path are used instead of the `namespace` option.

## Code check (6.7.15.1)
- confirmed `sw_icon` — Twig tag registered by IconTokenParser — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:44
- confirmed `style` — optional keyword after the icon name, parsed as a variables array — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:25
- confirmed `icon.html.twig` — tag includes `@Storefront/storefront/utilities/icon.html.twig` — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:21
- confirmed `pack` — defaults to `default` — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:7
- confirmed `namespace` — defaults to `Storefront` — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:11
- confirmed `assets/icon` — path `@<namespace>/assets/icon/<pack>/<name>.svg`, ignore_missing — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:29
- confirmed `themeIconConfig` — theme pack config overrides namespace/path — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:18
- confirmed `app/storefront/dist` — registered as the bundle's Twig namespace path — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/TwigLoaderConfigCompilerPass.php:31
