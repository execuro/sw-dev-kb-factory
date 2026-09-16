---
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md
title: Add SCSS Variables
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-scss-variables.html
sourceHash: ccd5022c14c651ccb4bd8dbb3a04506c147fcb2b
codeCheckedAgainst: "6.7.13.0"
keywords: ["<css>", "config.xml", "input-field", "defaultValue", "ThemeCompilerEnrichScssVarSubscriber", "ThemeCompilerEnrichScssVariablesEvent", "theme:compile", "scss variables", "plugin configuration", "base.scss", "!default", "storefront theme"]
summary: "Expose a plugin config.xml field as an SCSS variable with the <css> tag; value or defaultValue is injected at theme compile, recompile after changes."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md"]
---
## What it is

The declarative way for a plugin to turn a plugin configuration field (`config.xml`) into an SCSS variable: add a `<css>` element naming the variable. This is the recommended approach; for more flexibility see [Add SCSS Variables via Subscriber](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md).

## When to use

A merchant should control a Storefront style value (color, size, etc.) through the plugin's configuration in the Administration, without writing an event subscriber.

## Key steps / config

1. Provide a fallback value in the plugin's `src/Resources/app/storefront/src/scss/base.scss`, marked `!default` so the configured value can replace it:

   ```scss
   $sass-plugin-header-bg-color: #ffcc00 !default;

   .header-main {
       background-color: $sass-plugin-header-bg-color;
   }
   ```

2. In `src/Resources/config/config.xml`, add `<css>` to the input field; its content is the SCSS variable name (without `$`):

   ```xml
   <input-field>
       <name>sassPluginHeaderBgColor</name>
       <label>Header backgroundcolor</label>
       <label lang="de-DE">Kopfzeile Hintergrundfarbe</label>
       <css>sass-plugin-header-bg-color</css>
       <defaultValue>#eee</defaultValue>
   </input-field>
   ```

3. Recompile the theme (e.g. `bin/console theme:compile`) after changing the value.

How it works in the installed code: during theme compilation `ThemeCompilerEnrichScssVarSubscriber` listens to `ThemeCompilerEnrichScssVariablesEvent`, loads the resolved `<TechnicalName>.config` of every registered Storefront plugin for the sales channel being compiled, and for each element with a `css` entry calls `addVariable(<css>, value ?? defaultValue)`. Values are therefore per sales channel.

## Essential identifiers

- `<css>` element inside `<input-field>` in `config.xml`
- `<defaultValue>` — used when no value is saved
- `Shopware\Storefront\Theme\Subscriber\ThemeCompilerEnrichScssVarSubscriber`
- `bin/console theme:compile`

## Gotchas

- Changing the configured value does not recompile the theme; recompile manually for it to take effect.
- Plugin configurations with a `<css>` field show a notice in the Administration that changes can affect the theme.
- Only string values are applied: an element whose `value ?? defaultValue` is not a string is skipped.
- If loading the plugin configuration fails with a database error, a warning is written and plugin CSS customizations are ignored.

## Version notes

- The `css` configuration flag is available since Shopware 6.4.13.0.

## Code check (6.7.13.0)
- confirmed `ThemeCompilerEnrichScssVarSubscriber::enrichExtensionVars()` — subscribed to the enrich event — vendor/shopware/storefront/Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:35
- confirmed `css` — `addVariable($element['config']['css'], value ?? defaultValue)` — vendor/shopware/storefront/Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:77
- confirmed `defaultValue` — fallback when no value is saved; non-string values skipped — vendor/shopware/storefront/Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:96
- confirmed `getSalesChannelId()` — config resolved per compiled sales channel — vendor/shopware/storefront/Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:57
- confirmed `input-field` — XSD allows arbitrary child elements (lax any), so `<css>` validates — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:33
- confirmed `nodeName` — unknown option elements are stored by element name — vendor/shopware/core/System/SystemConfig/Util/ConfigReader.php:251
- confirmed `theme:compile` — console command to recompile themes — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
