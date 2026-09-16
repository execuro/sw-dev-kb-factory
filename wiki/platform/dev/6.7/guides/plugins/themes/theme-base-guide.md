---
id: platform/dev/6.7/guides/plugins/themes/theme-base-guide.md
title: Theme Base Guide
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/theme-base-guide.html
sourceHash: 0f28ea922a10a82e2c543f90f5c11ac129e8e12b
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme", "storefront theme", "theme.json", "theme:create", "theme:compile", "theme:change", "theme workflow", "theme development", "scss", "bootstrap variables", "breakpoints", "theme inheritance", "icons", "twig templates"]
summary: "Entry point for Storefront theme development: ordered workflow from creating a theme and its theme.json to styling, assets, overrides, templates, inheritance."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md"]
---
## What it is

A navigation page for building a Shopware Storefront theme. It gives the recommended order of the theme guides and links each step to its detailed page; it contains no configuration of its own.

## When to use

You are starting a new Storefront theme and need to know which guide to read next, or you want to jump to a specific theme task (styling, assets, icons, variable or breakpoint overrides, template changes, inheritance).

## Key steps / config

Developer workflow, in order:

1. [Create a theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md). In the installed code, `bin/console theme:create` ("Create a new theme") scaffolds the theme plugin including `src/Resources/theme.json` and `src/Resources/app/storefront/src/scss/overrides.scss`.
2. Configure it via `theme.json`: [Theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md).
3. [Add SCSS styling and JavaScript](platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md).
4. [Add assets](platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md) and [icons](platform/dev/6.7/guides/plugins/themes/assets/add-icons.md).
5. Override [Bootstrap variables](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md) or [responsive breakpoints](platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md).
6. [Customize Storefront templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md).
7. Use [theme inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) if needed.

The next step after this overview is creating the theme (step 1).

Related console commands present in the installed Storefront (not described on the source page): `theme:compile` ("Compile the theme"), `theme:change` ("Change the active theme for a sales channel"), `theme:refresh` ("Refresh the theme configuration").

## Essential identifiers

- `theme.json` (theme configuration file)
- `bin/console theme:create`, `bin/console theme:compile`, `bin/console theme:change`, `bin/console theme:refresh`

## Code check (6.7.13.0)
- confirmed `theme:create` — console command "Create a new theme" — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:20
- confirmed `theme.json` — written to src/Resources of the new theme by theme:create — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:101
- confirmed `overrides.scss` — created by theme:create in the new theme — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:102
- confirmed `theme:compile` — console command "Compile the theme" — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `theme:change` — changes the active theme for a sales channel — vendor/shopware/storefront/Theme/Command/ThemeChangeCommand.php:26
- confirmed `theme:refresh` — refreshes the theme configuration — vendor/shopware/storefront/Theme/Command/ThemeRefreshCommand.php:14
