---
id: platform/hubs/theme-json.md
title: "theme.json"
summary: "Hub for theme.json: Storefront theme structure, config fields, inheritance, assets, icons, styling and app themes in 6.6 and 6.7."
keywords: ["theme.json", "storefront theme", "configInheritance", "theme inheritance", "theme configuration", "iconSets", "app theme", "ThemeInterface", "theme:compile", "overrides.scss", "sw_icon", "sales channel"]
members: ["platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md", "platform/dev/6.6/guides/plugins/plugins/bundle.md", "platform/dev/6.6/guides/plugins/themes/add-icons.md", "platform/dev/6.6/guides/plugins/themes/add-theme-inheritance-without-resources.md", "platform/dev/6.6/guides/plugins/themes/add-theme-inheritance.md", "platform/dev/6.6/guides/plugins/themes/theme-configuration.md", "platform/dev/6.6/products/cli/validation.md", "platform/dev/6.6/resources/references/adr/2021-09-22-refactor-theme-inheritance.md", "platform/dev/6.7/guides/plugins/apps/storefront/apps-as-themes.md", "platform/dev/6.7/guides/plugins/plugins/bundle.md", "platform/dev/6.7/guides/plugins/themes/_index.md", "platform/dev/6.7/guides/plugins/themes/assets/_index.md", "platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md", "platform/dev/6.7/guides/plugins/themes/assets/add-icons.md", "platform/dev/6.7/guides/plugins/themes/configuration/_index.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md", "platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/themes/inheritance/_index.md", "platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md", "platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md", "platform/dev/6.7/guides/plugins/themes/styling/_index.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md", "platform/dev/6.7/guides/plugins/themes/theme-base-guide.md", "platform/dev/6.7/resources/references/adr/2021-09-22-refactor-theme-inheritance.md"]
lastBuilt: 2026-10-21
---

# theme.json

`theme.json` is the file that defines a Storefront theme: which views, styles, scripts and assets it contributes, which configuration fields appear in the Administration theme manager, which icon sets it registers, and which other themes it inherits from. Come to this hub when a question involves any `theme.json` key (`views`, `style`, `script`, `asset`, `config`, `configInheritance`, `iconSets`), or when you need to choose between a plugin-based theme (implementing `ThemeInterface`) and an app theme (shipping `Resources/theme.json`). The 6.6 docs keep theme guides flat; the 6.7 docs split them into sub-sections (assets, configuration, inheritance, styling). Several 6.6 and 6.7 pages cover the same topic and are near-duplicates across versions; prefer the version matching the target install.

## Shopware 6.7

Overview and workflow
- [Storefront Themes](platform/dev/6.7/guides/plugins/themes/_index.md) — overview: plugin themes vs. app themes, per-sales-channel assignment.
- [Theme Base Guide](platform/dev/6.7/guides/plugins/themes/theme-base-guide.md) — ordered workflow from creation to styling, assets, templates and inheritance.
- [Create a Theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md) — scaffold with `theme:create`, activate, assign with `theme:change`.
- [Apps as Themes](platform/dev/6.7/guides/plugins/apps/storefront/apps-as-themes.md) — an app becomes a theme by shipping `Resources/theme.json`.
- [Symfony Bundles](platform/dev/6.7/guides/plugins/plugins/bundle.md) — project code as a bundle, including the theme interface.

Configuration
- [Configuration](platform/dev/6.7/guides/plugins/themes/configuration/_index.md) — section index.
- [Theme Configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md) — reference for keys, config field parameters and snippet keys.
- [Theme Inheritance Configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md) — worked example of inheriting config fields via `configInheritance`.

Inheritance
- [Inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/_index.md) — section index.
- [Theme Inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) — extend a theme through placeholders in each section.
- [Theme with Bootstrap styling](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md) — `@StorefrontBootstrap` instead of `@Storefront`.
- [Refactor theme inheritance](platform/dev/6.7/resources/references/adr/2021-09-22-refactor-theme-inheritance.md) — ADR introducing `configInheritance`.

Styling
- [Styling](platform/dev/6.7/guides/plugins/themes/styling/_index.md) — section index.
- [Add SCSS Styling and JavaScript to a Theme](platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md) — `style` entries, `main.js`, `theme:compile`.
- [Override Bootstrap variables in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md) — `overrides.scss` before `@Storefront`.
- [Override responsive breakpoints in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md) — `sw-breakpoint-*` fields (6.7.8.0+).

Assets and icons
- [Assets](platform/dev/6.7/guides/plugins/themes/assets/_index.md) — section index.
- [Add Assets to a Theme](platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md) — the `asset` key and referencing files from Twig and SCSS.
- [Add Custom Icons](platform/dev/6.7/guides/plugins/themes/assets/add-icons.md) — `sw_icon` and the `iconSets` key (required for app themes).

## Shopware 6.6

- [Apps as themes](platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md) — app themes; without `theme.json` changes apply to all sales channels.
- [Bundle](platform/dev/6.6/guides/plugins/plugins/bundle.md) — Symfony/Shopware Bundle instead of a plugin.
- [Theme configuration](platform/dev/6.6/guides/plugins/themes/theme-configuration.md) — structure, field types, tabs/blocks/sections, `configInheritance`.
- [Theme inheritance](platform/dev/6.6/guides/plugins/themes/add-theme-inheritance.md) — extending another theme.
- [Theme with Bootstrap styling](platform/dev/6.6/guides/plugins/themes/add-theme-inheritance-without-resources.md) — `@StorefrontBootstrap` placeholder.
- [Add custom icons](platform/dev/6.6/guides/plugins/themes/add-icons.md) — `sw_icon` and `iconSets`.
- [Validation](platform/dev/6.6/products/cli/validation.md) — `shopware-cli extension validate`, which also checks `theme.json`.
- [Refactor theme inheritance](platform/dev/6.6/resources/references/adr/2021-09-22-refactor-theme-inheritance.md) — ADR for `configInheritance`.
