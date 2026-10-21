---
id: platform/dev/6.7/guides/plugins/themes/assets/add-icons.md
title: Add Custom Icons
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/assets/add-icons.html
sourceHash: 592b53ad35bca01c458bf4c11d012255d1395aff
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw_icon", "custom icons", "icon pack", "iconSets", "theme.json", "namespace", "pack", "svg icons", "dist/assets/icon", "icon renderer", "solid icons", "storefront icons"]
summary: "sw_icon Twig tag usage and custom SVG icon packs via dist/assets/icon/<pack> or the theme.json iconSets key (required for app themes)."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md"]
---
## What it is

How to render icons in the Storefront with the `sw_icon` Twig tag and how to provide your own SVG icons from a plugin or theme (a theme is a kind of plugin, so both work the same way). The tag includes `@Storefront/storefront/utilities/icon.html.twig`, which inlines `<name>.svg` from the selected pack.

## When to use

You want to show a core icon (packs `default` and `solid` ship with the Storefront) or ship custom icons with your plugin/theme. Prerequisites: a working plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)), basic SCSS, and optionally [handling own assets](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md).

## Key steps / config

1. Store SVGs in your bundle's dist folder; the default pack folder is:

   ```text
   <YourPlugin>/src/Resources/app/storefront/dist/assets/icon/default
   <YourPlugin>/src/Resources/app/storefront/dist/assets/icon/<pack-name>
   ```

2. Render with `sw_icon`, setting `namespace` to your bundle name so the icon is looked up there:

   ```twig
   {% sw_icon 'done-outline-24px' style {
       'size': 'lg',
       'namespace': 'TestPlugin',
       'pack': 'solid'
   } %}
   ```

   Resolved file: `@<namespace>/assets/icon/<pack>/<name>.svg`.

3. `style` parameters: `size`, `namespace`, `pack`, `color` (Bootstrap-like variants such as `primary`, `danger`, or custom CSS), `class`; the installed template additionally reads `rotation`, `flip`, `ariaHidden` (default `true`) and `ariaLabel`.

4. Custom locations (since 6.4.1.0): declare named packs in `theme.json` under `iconSets`, then reference the pack name:

   ```json
   {
     "iconSets": {
       "custom-icons": "app/storefront/src/assets/icon-pack/custom-icons"
     }
   }
   ```

   ```twig
   {% sw_icon 'done-outline-24px' style { 'pack': 'custom-icons' } %}
   ```

## Essential identifiers

- `sw_icon` tag with `style` object (`size`, `namespace`, `pack`, `color`, `class`)
- `Resources/app/storefront/dist/assets/icon/<pack>`
- `theme.json` key `iconSets`
- `@Storefront/storefront/utilities/icon.html.twig`

## Gotchas

- Defaults are `pack` = `default` and `namespace` = `Storefront`; without a different `namespace` you get the Storefront's core icons.
- Icons and other custom assets are not part of theme inheritance: putting an icon at a path mirroring the core structure does not override the core icon.
- The `iconSets` setup is mandatory when the theme is shipped as an app, otherwise the icons cannot be loaded.
- For a pack declared in `iconSets`, the lookup uses the pack's own configured namespace and path, not the `namespace` parameter.

## Version notes

- `iconSets` in `theme.json` is available since Shopware 6.4.1.0.

## Code check (6.7.15.1)
- confirmed `sw_icon` — Storefront Twig tag — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:44
- confirmed `@Storefront/storefront/utilities/icon.html.twig` — template included by the tag — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:21
- confirmed `pack` — defaults to 'default' — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:7
- confirmed `namespace` — defaults to 'Storefront' — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:11
- confirmed `ariaHidden` — defaults to true — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:15
- confirmed `rotation` — extra style entry alongside size, color, flip, class — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:4
- confirmed `/assets/icon/` — lookup path @namespace/assets/icon/pack/name.svg — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:29
- confirmed `/app/storefront/dist` — dist folder registered as the bundle's Twig namespace — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/TwigLoaderConfigCompilerPass.php:31
- confirmed `iconSets` — theme.json key read into the theme configuration — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:113
- confirmed `themeIconConfig` — iconSets exposed to templates — vendor/shopware/storefront/Framework/Routing/TemplateDataSubscriber.php:107
