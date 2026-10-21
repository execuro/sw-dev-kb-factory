---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md
sourceHash: ccd5022c14c651ccb4bd8dbb3a04506c147fcb2b
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-scss-variables.html
title: Add SCSS Variables
version: "6.7"
versions:
  - "6.7"
keywords: ["css", "<css>", "config.xml", "input-field", "defaultValue", "scss variables", "plugin config", "theme compile", "ThemeCompilerEnrichScssVarSubscriber", "ThemeCompilerEnrichScssVariablesEvent", "base.scss", "!default"]
summary: "Expose a plugin config.xml field as an SCSS variable with the <css> element (since 6.4.13.0); the theme must be recompiled after the value changes."
lastBuilt: 2026-10-21
---
## What it is

A plugin `config.xml` input field can be exposed as an SCSS variable by adding a `<css>` child element whose text is the variable name. When the theme compiles, the core injects the configured value, or the field's `<defaultValue>` if none is set. This is the recommended way to add plugin SCSS variables. For more flexibility use a subscriber ([Add SCSS variables via subscriber](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md)).

## When to use

A merchant-editable plugin setting, such as a color, should drive Storefront styling without custom PHP.

## Key steps / config

1. Give the variable a fallback in `<plugin root>/src/Resources/app/storefront/src/scss/base.scss`:
   ```scss
   $sass-plugin-header-bg-color: #ffcc00 !default;
   .header-main { background-color: $sass-plugin-header-bg-color; }
   ```
2. Add `<css>` with the variable name, without `$`, to the field in `config.xml`:
   ```xml
   <input-field>
       <name>sassPluginHeaderBgColor</name>
       <label>Header backgroundcolor</label>
       <label lang="de-DE">Kopfzeile Hintergrundfarbe</label>
       <css>sass-plugin-header-bg-color</css>
       <defaultValue>#eee</defaultValue>
   </input-field>
   ```
3. After changing the value in the Administration, recompile the theme manually.

## Essential identifiers

- `<css>` (child of `<input-field>` in `config.xml`)
- `<defaultValue>`
- `Shopware\Storefront\Theme\Subscriber\ThemeCompilerEnrichScssVarSubscriber` (core handler)

## Gotchas

- A changed value does not apply until the theme is recompiled.
- Plugin configs that declare an SCSS variable show a notice in the Administration that changes can affect the theme.
- In the installed code, the variable is set only when the stored value (or `defaultValue`) is a string. Other value types are silently skipped.
- Values are read per sales channel from `<TechnicalName>.config` for every plugin known to the Storefront plugin registry.

## Version notes

- The `<css>` configuration flag is available from Shopware 6.4.13.0.

## Code check (6.7.15.1)
- confirmed `input-field` — schema allows arbitrary extra children (lax), so `<css>` validates — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:36
- confirmed `css` — element's `config.css` is checked for each config element — vendor/shopware/storefront/Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:92
- confirmed `defaultValue` — used when no value is stored — vendor/shopware/storefront/Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:77
- confirmed `ThemeCompilerEnrichScssVarSubscriber::hasCssValue()` — only string values are added — vendor/shopware/storefront/Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:82
- confirmed `ThemeCompilerEnrichScssVarSubscriber::enrichExtensionVars()` — reads `<technicalName>.config` per sales channel — vendor/shopware/storefront/Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:42
- unverified `Administration notice` — admin hint for css-bearing configs not checked
