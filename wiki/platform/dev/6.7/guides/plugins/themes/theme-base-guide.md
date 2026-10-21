---
id: platform/dev/6.7/guides/plugins/themes/theme-base-guide.md
title: Theme Base Guide
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/theme-base-guide.html
sourceHash: 0f28ea922a10a82e2c543f90f5c11ac129e8e12b
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme", "theme.json", "storefront theme", "theme development workflow", "scss", "javascript", "theme assets", "icons", "bootstrap variables", "breakpoints", "theme inheritance", "twig templates"]
summary: Ordered developer workflow for building a Storefront theme, from creation and theme.json to styling, assets, templates and inheritance.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md"]
---
## What it is

An entry page for Storefront theme development. It lists the order in which a theme developer usually works through the theme guides.

## When to use

You are starting a new Storefront theme and want to know which guide to read next.

## Key steps / config

1. [Create a theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md).
2. Configure it via `theme.json`. Shopware reads it from the theme's `Resources/theme.json`. See [theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md).
3. [Add SCSS styling and JavaScript](platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md).
4. [Add assets](platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md) and [icons](platform/dev/6.7/guides/plugins/themes/assets/add-icons.md).
5. Override [Bootstrap variables](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md) or [responsive breakpoints](platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md).
6. [Customize Storefront templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md).
7. Use [theme inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) if needed.

The recommended next step is to create a theme.

## Essential identifiers

- `theme.json`: the theme's configuration file, located at `Resources/theme.json`

## Code check (6.7.15.1)
- confirmed `Resources/theme.json` — theme configuration is read from this path when building the storefront plugin configuration — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:144
