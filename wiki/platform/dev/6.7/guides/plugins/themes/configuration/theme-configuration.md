---
id: platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md
title: Theme Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/configuration/theme-configuration.html
sourceHash: 92330baff521b506c2e18768867d8b88dece74a0
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme.json", "configInheritance", "config.fields", "previewMedia", "theme:refresh", "labelSnippetKey", "sw-theme snippet keys", "editable", "sw-single-select", "sw-multi-select", "theme config fields", "theme manager", "tabs blocks sections", "theme translations"]
summary: Reference for theme.json keys (views, style, script, asset, config, configInheritance), config field parameters and sw-theme snippet keys.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md
  - platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md
  - platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md
  - platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md
---
## What it is

Reference for a theme's `<plugin root>/src/Resources/theme.json`: the top-level keys Shopware reads, the `config` field definitions that show up in the Administration theme manager, how they are translated via snippet keys, and `configInheritance`.

## When to use

When creating or changing a theme's metadata, template/style/script/asset order, or the configurable fields (colors, fonts, media, switches) merchants edit in the theme manager.

## Key steps / config

Skeleton of `theme.json`:

```json
{
  "name": "SwagBasicExampleTheme",
  "author": "Shopware AG",
  "description": { "en-GB": "...", "de-DE": "..." },
  "views": ["@Storefront", "@Plugins", "@SwagBasicExampleTheme"],
  "previewMedia": "app/storefront/dist/assets/defaultThemePreview.jpg",
  "style": ["app/storefront/src/scss/overrides.scss", "@Storefront", "app/storefront/src/scss/base.scss"],
  "script": ["@Storefront", "app/storefront/dist/storefront/js/swag-basic-example-theme/swag-basic-example-theme.js"],
  "asset": ["@Storefront", "app/storefront/src/assets"],
  "configInheritance": ["@Storefront", "@OtherTheme"],
  "config": { "fields": { "sw-color-brand-primary": { "value": "#00ff00" } } }
}
```

After any change to `theme.json` run `bin/console theme:refresh`.

- `name` / `author` — read unconditionally by the parser (camel-case name recommended); `description` is optional and translatable.
- `previewMedia` — image path relative to the theme root, shown as the theme preview.
- `views` — template inheritance order (see [Theme inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md)).
- `style` — SCSS compilation order. `overrides.scss` comes before `@Storefront` so it can override Shopware/Bootstrap variables and functions ([override Bootstrap variables](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md)); `base.scss` holds your own styles. Entries may be a whole namespace (`@Storefront`, `@BasicTheme`) or a single file from one (`@BasicTheme/app/storefront/src/scss/custom.scss`).
- `script` — JS import order; reference the compiled files from the theme's `dist` directory. Namespace aliases and single-file references work here too.
- `asset` — asset paths (images, fonts); add `@Storefront` to reuse the default theme's assets ([add assets](platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md)).
- `config.fields` — the key of each field is its technical name, used in theme/SCSS files. Your config is merged over the Storefront config, so only provide values you change.

Config field parameters:

| Key | Meaning |
|---|---|
| `type` | `color`, `text`, `number`, `fontFamily`, `media`, `checkbox`, `switch`, `url` |
| `value` | default value |
| `editable` | `false` hides the field in the Administration |
| `tab` / `block` / `section` | grouping in the theme manager (optional; unnamed groups use `default`) |
| `custom` | not processed, available via API; e.g. `componentName: "sw-single-select"` / `"sw-multi-select"` with `options[].value`, or `numberType`/`min`/`max` |
| `scss` | `false` stops injection as an SCSS variable |
| `fullWidth` | `true` renders the Administration component full width |

Translations: store texts in Administration snippet files, e.g. `<plugin root>/src/Resources/app/administration/src/app/snippet/de.json` / `en.json` (locale files like `de-DE.json` override language files). Key structure (fields may end in `.helpText` for the help text):

- Tab: `sw-theme.<technicalName>.<tabName>.label`
- Block: `sw-theme.<technicalName>.<tabName>.<blockName>.label`
- Section: `sw-theme.<technicalName>.<tabName>.<blockName>.<sectionName>.label`
- Field: `sw-theme.<technicalName>.<tabName>.<blockName>.<sectionName>.<fieldName>.label`
- Option: `sw-theme.<technicalName>.<tabName>.<blockName>.<sectionName>.<fieldName>.<index>.label`

The theme manager looks up the key under the theme's own name first, then under each inherited parent theme name.

`configInheritance`: lists themes whose fields and snippets this theme inherits; the Storefront theme is always inherited. Fields from listed themes are available unless overwritten. The list is ordered least to most specific — the last entry other than `@Storefront`/self becomes the stored parent theme.

## Essential identifiers

- `theme.json`, `config.fields`, `configInheritance`, `previewMedia`
- `bin/console theme:refresh`
- `sw-theme.<technicalName>.<tabName>.<blockName>.<sectionName>.<fieldName>.label` snippet keys
- `Shopware\Storefront\Theme\ThemeConfigField` (`labelSnippetKey`, `helpTextSnippetKey`)

## Gotchas

- Overriding config variables of a third-party theme can break compilation if that theme later renames or removes them.
- The `configInheritance` relationship is only created on theme install; re-run `theme:refresh` to update it.
- Per-field `label` and `helpText` translation arrays in `theme.json` (and `label` maps in `config.tabs`/`blocks`/`sections`) are deprecated for v6.8; use snippets instead. The theme manager logs a deprecation warning when it falls back to them.

## Version notes

- `configInheritance` is available since 6.4.8.0.
- The docs show snippet-only examples as "Since v6.7.1.0" and `label`-based examples as "Before v6.8.0.0".
- The docs describe, for 6.7.16.0, an automatic conversion of `label`/`helpText` into snippets under `snippets/administration/<technicalName>/<locale>.json` in `shopware.filesystem.private`, plus `bin/console theme:migrate-translations <technicalName> --strip` (`--dry-run` to preview). That command is not present in 6.7.15.1.

## Code check (6.7.15.1)
- confirmed `previewMedia` — `theme.json` key read by the factory — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:94
- confirmed `configInheritance` — `theme.json` key stored on config and base config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
- confirmed `views` — sets view inheritance — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:102
- confirmed `theme:refresh` — command refreshing theme configuration — vendor/shopware/storefront/Theme/Command/ThemeRefreshCommand.php:15
- confirmed `ThemeConfigField::$fullWidth` — field parameter — vendor/shopware/storefront/Theme/ThemeConfigField.php:68
- confirmed `ThemeConfigField::$labelSnippetKey` — replacement for the deprecated per-field label array — vendor/shopware/storefront/Theme/ThemeConfigField.php:23
- confirmed `ThemeConfigField::$helpTextSnippetKey` — replacement for the deprecated per-field help text array — vendor/shopware/storefront/Theme/ThemeConfigField.php:32
- confirmed `sw-theme.${themeName}.${key}` — theme manager snippet lookup across inherited prefixes — vendor/shopware/storefront/Resources/app/administration/src/modules/sw-theme-manager/page/sw-theme-manager-detail/index.js:763
- confirmed `getConfigInheritance()` — ordered least to most specific, last non-Storefront entry becomes parent theme — vendor/shopware/storefront/Theme/ThemeLifecycleService.php:567
- absent `theme:migrate-translations` — docs mark it 6.7.16.0; not in the 6.7.15.1 code
