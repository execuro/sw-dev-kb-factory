---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-scss-variables.md
title: Add SCSS variables
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-scss-variables.html
sourceHash: bc4217d9d1cbf29cd30633a50ceeb70604ea2d68
keywords: ["SCSS variables", "config.xml", "css tag", "input-field", "sass-plugin-header-bg-color", "default value", "theme recompile", "plugin configuration scss", "base.scss", "add-scss-variables-via-subscriber", "Administration notice"]
summary: How to expose a plugin config.xml input field as an SCSS variable using the css tag, with a default fallback declared in base.scss.
lastBuilt: 2026-09-15
---
## What it is

This guide shows how to configure a plugin's `config.xml` input field to be exposed as an SCSS variable, so store administrators can control styling values from the Administration configuration screen.

## When to use

Use this when a plugin's SCSS should read a color, size, or other value that a merchant can change without editing code, instead of (or in addition to) driving that value from a subscriber.

## Key steps / config

The `css` configuration flag is available from Shopware version 6.4.13.0.

1. Provide a fallback value for the custom SCSS variable in the plugin's `base.scss`, using `!default`:

```css
// The value will be overwritten when the plugin is installed and activated
$sass-plugin-header-bg-color: #ffcc00 !default;

.header-main {
    background-color: $sass-plugin-header-bg-color;
}
```

2. Declare the config field in `config.xml` using the `<css>` tag, whose value is the name of the SCSS variable:

```xml
<input-field>
    <name>sassPluginHeaderBgColor</name>
    <label>Header backgroundcolor</label>
    <label lang="de-DE">Kopfzeile Hintergrundfarbe</label>
    <css>sass-plugin-header-bg-color</css>
    <defaultValue>#eee</defaultValue>
</input-field>
```

The value set in the Administration (or the `defaultValue` if unset) is then exposed as the SCSS variable named by `<css>`.

An alternative approach — using a subscriber instead of `config.xml` declarations, for more flexibility — is documented separately.

## Essential identifiers

- `config.xml` `<css>` tag — maps an input field to an SCSS variable name
- `<defaultValue>` — fallback used when the merchant has not set a value
- SCSS `!default` modifier for local fallback values

## Gotchas

When the config value is changed in the Administration, the theme must still be recompiled manually for the change to take effect — it is not applied automatically. Plugin configurations that declare an SCSS variable via `config.xml` show a notice in the Administration warning that changes can affect the theme.
