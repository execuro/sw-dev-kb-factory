---
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/_index.md
title: Styling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/
sourceHash: 51927d0f5d777d322d9648ecbffe6f88066d816e
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront styling", "scss", "css", "base.scss", "custom assets", "icons", "sw_icon", "scss variables", "ThemeCompilerEnrichScssVariablesEvent", "translations", "snippets", "plugin storefront look"]
summary: Section index for Storefront styling in plugins - custom SCSS, assets, icons, SCSS variables (config or subscriber) and translations.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md"]
---
## What it is

Overview page of the Storefront styling guides for plugins: how a plugin customizes the visual appearance of the Storefront. It only links to the individual guides; the details live on those pages.

## When to use

Start here when a plugin needs to change how the Storefront looks and you need to pick the right guide:

- [Add custom styling](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md) — ship your own SCSS with the plugin.
- [Add custom assets](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md) — images, fonts and other static files.
- [Add custom icons](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md) — icons rendered in Twig templates.
- [Add SCSS variables](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md) — expose values to the SCSS compilation.
- [Add SCSS variables via Subscriber](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md) — inject SCSS variables from PHP during theme compilation.
- [Add translations](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md) — Storefront text snippets.

## Essential identifiers

Anchors confirmed in the installed code that the linked guides build on:

- `Resources/app/storefront/src/scss/base.scss` — SCSS entry file a plugin's style files are collected from (only `base.scss` directly in that directory).
- `Resources/app/storefront/src/main.js` / `main.ts` — the plugin's Storefront JS entry, resolved by the same configuration factory.
- `Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent` — event used to add SCSS variables from a subscriber.
- `sw_icon` — Twig tag for rendering icons.

## Code check (6.7.13.0)
- confirmed `Resources/app/storefront/src/scss` — plugin styles path used for style files — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:126
- confirmed `base.scss` — only base.scss at depth 0 is picked up as SCSS entry — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:202
- confirmed `main.ts` — preferred over main.js as Storefront entry — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:183
- confirmed `ThemeCompilerEnrichScssVariablesEvent` — event class exists — vendor/shopware/storefront/Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:11
- confirmed `sw_icon` — Twig tag name of IconTokenParser — vendor/shopware/storefront/Framework/Twig/TokenParser/IconTokenParser.php:44
