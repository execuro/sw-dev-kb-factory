---
id: platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md
title: Theme Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/configuration/theme-configuration.html
sourceHash: 3b10c28c6b7b177c2482429261ae99975245db6d
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme.json", "configInheritance", "config.fields", "theme:refresh", "views", "style", "script", "asset", "previewMedia", "sw-theme snippet keys", "theme manager", "config field types", "sw-single-select", "sw-multi-select", "theme settings"]
summary: "theme.json keys: views, style, script, asset, previewMedia, config fields (types, tabs/blocks/sections, snippet labels) and configInheritance."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md", "platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md", "platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md"]
---
## What it is

Reference for a theme's `<plugin root>/src/Resources/theme.json`: basic information, template/style/script/asset inheritance lists, Administration-editable `config` fields and `configInheritance` between themes.

## When to use

- Setting up or changing a theme's `theme.json`.
- Adding theme settings merchants edit in the Administration theme manager.
- Letting a theme inherit config fields from another theme.

## Key steps / config

Skeleton (values elided):

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

After any change run `bin/console theme:refresh`.

- `name`, `author`: required by the installed code (read unconditionally). Name in camel case recommended. `description` is optional and translatable.
- `previewMedia`: image path relative to the theme root, shown as preview in the Administration.
- `views`: template inheritance order.
- `style`: SCSS compilation order. `overrides.scss` (before `@Storefront`) overrides Shopware/Bootstrap variables and functions; `base.scss` holds your styles. Reference whole namespaces (`@Storefront`, `@BasicTheme`) or single files (`@BasicTheme/app/storefront/src/scss/custom.scss`).
- `script`: JS import order; reference compiled files from `dist`. Namespace aliases and single-file references (`@BasicTheme/app/storefront/dist/storefront/custom-plugin.js`) work here too.
- `asset`: asset paths (images, fonts); add `@Storefront` to reuse default Storefront assets.
- `config.fields`: each key is the technical name used in theme/SCSS files. Values merge with the Storefront config; provide only what you change.

Field item parameters: `type` (`color`, `text`, `number`, `fontFamily`, `media`, `checkbox`, `switch`, `url`), `value`, `editable` (false hides it in the Administration), `tab`, `block`, `section` (grouping; `tab` and `section` are optional), `custom` (not processed, available via API; e.g. `numberType`/`min`/`max`, or `componentName` `sw-single-select`/`sw-multi-select` with `options[].value`), `scss` (false = not injected as SCSS variable), `fullWidth` (full-width Administration component).

```json
"my-single-select-field": {
  "type": "text", "value": "24", "editable": true,
  "custom": { "componentName": "sw-single-select", "options": [{ "value": "16" }, { "value": "24" }] },
  "block": "exampleBlock", "section": "exampleSection"
}
```

`configInheritance`: additional themes whose fields and snippets this theme inherits; the Storefront theme's fields are always inherited. Inherited fields stay available unless overwritten. The relationship is created at theme install; update it later with `theme:refresh`.

## Essential identifiers

- `theme.json`, `config.fields`, `configInheritance`
- `views`, `style`, `script`, `asset`, `previewMedia`
- `bin/console theme:refresh`
- `sw-single-select`, `sw-multi-select`

## Gotchas

- Overwriting variables of a third-party theme can break compilation if that theme later renames or removes them.
- Fields with `editable: false` or `scss: false` are skipped when saving/validating config changes.

## Version notes

- `configInheritance` is available since 6.4.8.0.
- Since 6.7.1.0 field `label`/`helpText` arrays (and `label` entries under `config.blocks`/`sections`/`tabs`) are deprecated for v6.8; translations come from Administration snippet files, e.g. `<plugin root>/src/Resources/app/administration/src/app/snippet/en.json` (`en-GB.json` style locale files override base files).
- Snippet keys start with `sw-theme`, then the technical name (or a parent theme name from `configInheritance`), then tab, block, section, field (and option index); unnamed parts become `default`; end with `label` (fields may use `helpText`):
  - `sw-theme.<technicalName>.<tabName>.<blockName>.<sectionName>.<fieldName>.label`
  - `sw-theme.<technicalName>.<tabName>.<blockName>.<sectionName>.<fieldName>.<index>.label`
  - Example: `sw-theme.justAnotherTheme.default.exampleBlock.exampleSection.my-single-select-field.0.label`
- The Administration looks up the theme's own technical name first, then `configInheritance` names (last listed first) with `@` stripped; the technical name is used as-is.

## Code check (6.7.13.0)
- confirmed `author` — name and author read unconditionally from theme.json — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:79
- confirmed `previewMedia` — optional key read from theme.json — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:94
- confirmed `configInheritance` — stored and copied into theme config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
- confirmed `theme:refresh` — console command — vendor/shopware/storefront/Theme/Command/ThemeRefreshCommand.php:14
- deprecated `ThemeConfigField::$label` — tag:v6.8.0, use labelSnippetKey — vendor/shopware/storefront/Theme/ThemeConfigField.php:19
- deprecated `ThemeConfigField::$helpText` — tag:v6.8.0, use helpTextSnippetKey — vendor/shopware/storefront/Theme/ThemeConfigField.php:28
- confirmed `ThemeConfigField::$scss` — field option exists — vendor/shopware/storefront/Theme/ThemeConfigField.php:64
- confirmed `ThemeConfigField::$fullWidth` — field option exists — vendor/shopware/storefront/Theme/ThemeConfigField.php:66
- confirmed `sw-theme` — snippet key prefix built from technical name and inherited names — vendor/shopware/storefront/Resources/app/administration/src/modules/sw-theme-manager/page/sw-theme-manager-detail/index.js:785
- confirmed `fontFamily` — mapped to a text input in the theme manager — vendor/shopware/storefront/Resources/app/administration/src/modules/sw-theme-manager/page/sw-theme-manager-detail/index.js:46
