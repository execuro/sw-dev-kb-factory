---
id: platform/dev/6.6/guides/plugins/themes/theme-inheritance-configuration.md
title: Theme inheritance configuration
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/themes/theme-inheritance-configuration.html
sourceHash: 3f4b72153a7eab6505a0370e8a15b00b123a4d11
keywords: ["configInheritance", "theme.json config fields", "sw-color-brand-primary", "sw-brand-icon", "SwagBasicExampleThemeExtend", "field inheritance", "corporate design theme", "inherit anchor Administration", "field override"]
summary: How configInheritance in theme.json lets a theme reuse and override config fields from parent themes, e.g. a seasonal theme extending a corporate base theme.
lastBuilt: "2026-09-15"
---
## What it is

This guide shows how theme config field inheritance works via `configInheritance`, using an example of a corporate base theme and a seasonal theme that extends it.

## When to use

Use this when a theme should reuse a parent theme's config fields (colors, icons, etc.) and only override or add a few of them, e.g. a holiday-specific variant of a corporate theme.

## Key steps / config

Base theme (`SwagBasicExampleTheme`) defines config fields:

```javascript
// <plugin root>/src/Resources/theme.json
{
  "config": {
    "blocks": { "colors": { "themeColors": { "en-GB": "Theme colours" } } },
    "sections": { "importantColors": { "label": { "en-GB": "Important colors" } } },
    "tabs": { "colors": { "label": { "en-GB": "Colours" } } },
    "fields": {
      "sw-color-brand-primary": { "type": "color", "value": "#399", "editable": true },
      "sw-brand-icon": { "type": "url", "value": "/our-logo.png", "editable": true }
    }
  }
}
```

Extending theme (`SwagBasicExampleThemeExtend`) declares `configInheritance` and overrides/adds fields:

```javascript
{
  "configInheritance": ["@Storefront", "@SwagBasicExampleTheme"],
  "config": {
    "fields": {
      "sw-brand-icon": { "type": "url", "value": "/our-logo-holidays.png", "editable": true },
      "sw-advent-calendar-background-color": { "type": "color", "value": "#399", "editable": true }
    }
  }
}
```

All configuration fields from `Storefront` and `SwagBasicExampleTheme` are used as inherited values in the extending theme and shown in the Administration with an inherit anchor, using the parent value until explicitly set differently. Overriding `sw-brand-icon`'s value means it is no longer inherited even though it exists in the parent theme.

## Essential identifiers

- `configInheritance` (theme.json key)
- `sw-color-brand-primary`, `sw-brand-icon`, `sw-advent-calendar-background-color` (example config field names)

## Version notes

`configInheritance` is available from Shopware Version 6.4.8.0.
