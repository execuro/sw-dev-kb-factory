---
id: "platform/dev/6.6/guides/plugins/themes/theme-configuration.md"
title: "Theme configuration"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/themes/theme-configuration.html"
sourceHash: "9b591ce139148b179da72ed22aa7fd84e2774477"
keywords: ["theme.json", "theme:refresh", "config.fields", "configInheritance", "sw-color-brand-primary", "theme config blocks", "theme config tabs", "theme config sections", "views inheritance", "style compile order", "theme field types", "previewMedia"]
summary: "Documents theme.json's structure: name/style/views/asset keys, config field types, tabs/blocks/sections, and configInheritance."
lastBuilt: "2026-09-15"
---
## What it is
Explains the structure of a theme's `theme.json` configuration file — its top-level keys, config field definitions and types, tabs/blocks/sections for organizing config fields in the Administration, and config inheritance between themes.

## When to use
Use this when defining or editing a theme's `theme.json`: naming the theme, wiring style/script/asset/view sources, exposing configurable fields to merchants in the Administration, or inheriting configuration and snippets from another theme.

## Key steps / config
The theme configuration lives in `<plugin root>/src/Resources/theme.json`:

```javascript
{
  "name": "SwagBasicExampleTheme",
  "author": "Shopware AG",
  "description": { "en-GB": "...", "de-DE": "..." },
  "views": ["@Storefront", "@Plugins", "@SwagBasicExampleTheme"],
  "previewMedia": "app/storefront/dist/assets/defaultThemePreview.jpg",
  "style": ["app/storefront/src/scss/overrides.scss", "@Storefront", "app/storefront/src/scss/base.scss"],
  "script": ["@Storefront", "app/storefront/dist/storefront/js/<theme>/<theme>.js"],
  "asset": ["@Storefront", "app/storefront/src/assets"],
  "configInheritance": ["@Storefront", "@OtherTheme"]
}
```

After changing `theme.json`, run `bin/console theme:refresh` to apply the changes.

- `name`/`author` — identify the theme; `description` is optional and translatable per locale.
- `views` — controls template inheritance (covered separately in the theme inheritance guide).
- `previewMedia` — path to a preview image shown in the Administration/theme marketplace.
- `style` — controls SCSS compile order; `overrides.scss` is for overriding Shopware/Bootstrap variables and functions, `base.scss` is for the theme's own styles.
- `asset` — paths to custom assets (images, fonts); add `@Storefront` to also use the default theme's assets.

Config fields are declared under a `config` object containing `fields`, and optionally `blocks`, `sections`, `tabs`:

```javascript
"config": {
  "fields": {
    "sw-color-brand-primary": { "value": "#00ff00" }
  }
}
```

Each field's key is also its technical name, used to access the value in the theme or SCSS files; fields inherit from and merge with the storefront config, so only overridden values need to be provided. Supported per-field parameters: `label` (translated), `type` (`color`, `text`, `number`, `fontFamily`, `media`, `checkbox`, `switch`, `url`), `editable` (hides the field from the Administration if `false`), `tab`, `block`, `section`, `custom` (arbitrary data not otherwise processed, available via API), `scss` (set `false` to skip SCSS variable injection), `fullWidth`.

Field type examples include a text field (`"type": "text"`), a number field (`"type": "number"` with `custom.numberType`/`min`/`max`), and boolean fields using either `"type": "switch"` or `"type": "checkbox"`. Custom single- and multi-select fields use `"type": "text"` combined with `"custom": { "componentName": "sw-single-select" | "sw-multi-select", "options": [...] }`.

`tabs`, `blocks` and `sections` group related fields in the Administration; each field references them via its `tab`/`block`/`section` properties (tab and section are optional, block groups are required to organize fields visually).

`configInheritance` lists additional themes whose field configuration and snippets this theme inherits; every theme always inherits from `Storefront`. Values from inherited themes are merged unless explicitly overwritten in the current theme, which lets custom themes extend a shared corporate-design theme without copying its whole configuration. The inheritance relationship is created when the theme is installed; run `bin/console theme:refresh` to update it later.

## Essential identifiers
- `theme.json` — the theme configuration file, in `<plugin root>/src/Resources`
- `bin/console theme:refresh` — applies `theme.json` changes and updates `configInheritance` relationships
- `config.fields` — theme configuration field definitions
- `configInheritance` — array of theme names this theme inherits configuration/snippets from
- `sw-color-brand-primary` — example built-in config field key

## Gotchas
Overwriting variables of a third-party theme can break compilation if that theme later renames or removes them.

## Version notes
`configInheritance` is available from Shopware version 6.4.8.0 onward.
