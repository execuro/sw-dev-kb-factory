---
id: platform/dev/6.7/guides/plugins/themes/assets/add-icons.md
title: Add Custom Icons
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/assets/add-icons.html
sourceHash: 592b53ad35bca01c458bf4c11d012255d1395aff
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw_icon", "iconSets", "theme.json", "icon pack", "namespace", "pack", "custom icons", "svg icons", "storefront icons", "themeIconConfig", "solid icons", "twig icon tag"]
summary: Render Storefront SVG icons with the sw_icon Twig tag (namespace, pack, size, color, class) and register custom icon packs via iconSets in theme.json.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to display icons in the Storefront with the `sw_icon` Twig tag and how a plugin or theme ships its own SVG icons, either in the default icon folder or in custom icon packs declared under `iconSets` in `theme.json`. Everything applies to themes as well as plugins.

## When to use

- You need an SVG icon (core or your own) in a Storefront template.
- You ship a theme as an App and need custom icons to load (the `iconSets` setup is mandatory there).

## Key steps / config

1. Place SVG files in your plugin where Shopware finds them. Default location:
   `<YourPlugin>/src/Resources/app/storefront/dist/assets/icon/default`
   Other packs (e.g. `solid` or a custom name) go in a sibling folder:
   `<YourPlugin>/src/Resources/app/storefront/dist/assets/icon/<pack-name>`
2. Render the icon by file name (without `.svg`) and set `namespace` to your theme/plugin name; without it the Storefront's own icons are used:

```twig
{% sw_icon 'done-outline-24px' style {
    'size': 'lg',
    'namespace': 'TestPlugin',
    'pack': 'solid'
} %}
```

3. `style` parameters:
   - `size` — icon size
   - `namespace` — source of the icon; defaults to `Storefront`
   - `pack` — icon pack folder; defaults to `default`
   - `color` — bootstrap-like variants (`primary`, `danger`, ...) or style via CSS
   - `class` — additional class
4. Custom locations (since 6.4.1.0): declare packs in `theme.json` under `iconSets` (pack name mapped to a path), then reference only the pack:

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

In the installed code, a pack listed in `iconSets` is resolved against the declaring theme's technical name, so `namespace` is not needed for it.

## Essential identifiers

- `sw_icon` (Twig tag, renders `@Storefront/storefront/utilities/icon.html.twig`)
- `style` parameters: `size`, `namespace`, `pack`, `color`, `class`
- `iconSets` (theme.json key)
- `dist/assets/icon/default`, `dist/assets/icon/solid` (core packs)

## Gotchas

- Icons and other custom assets are not part of theme inheritance: putting an icon at a path mirroring the core folder structure does not override the core icon.
- Without a deviating `namespace`, the Storefront's default icons are displayed.
- Themes shipped as Apps must use `iconSets`, otherwise custom icons cannot be loaded.
- Core icons are available as the `default` and `solid` packs.

## Version notes

- `iconSets` in `theme.json` is available since Shopware 6.4.1.0.

## Code check (6.7.13.0)
- confirmed `sw_icon` — Twig tag registered by IconTokenParser, includes utilities/icon.html.twig — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:44
- confirmed `pack` — defaults to 'default' when not set — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:7
- confirmed `namespace` — defaults to 'Storefront' when not set — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:11
- confirmed `size` — size, color and class are rendered as icon-* CSS classes — vendor/shopware/storefront/Resources/views/storefront/utilities/icon.html.twig:4
- confirmed `iconSets` — read from theme.json by the plugin configuration factory — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:113
- confirmed `StorefrontPluginConfiguration::getTechnicalName()` — used as namespace for every iconSets pack — vendor/shopware/storefront/Theme/ThemeRuntimeConfigService.php:244
- confirmed `themeIconConfig` — iconSets exposed to templates as themeIconConfig — vendor/shopware/storefront/Framework/Routing/TemplateDataSubscriber.php:96
