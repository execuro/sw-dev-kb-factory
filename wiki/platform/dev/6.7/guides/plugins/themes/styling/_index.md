---
id: platform/dev/6.7/guides/plugins/themes/styling/_index.md
title: Styling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/styling/
sourceHash: 4f7ef2f29b81e70228735da43be9b6f07a5ded8d
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme styling", "scss", "css", "javascript", "bootstrap variables", "breakpoints", "responsive", "theme.json", "overrides.scss", "storefront theme"]
summary: Index of the Shopware theme styling guides - adding SCSS and JS, overriding Bootstrap variables, overriding responsive breakpoints.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md"]
---
## What it is

Section index for customising the visual styling of a Shopware theme. It lists three guides:

- [Add SCSS Styling and JavaScript to a Theme](platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md) — SCSS entry points in the `theme.json` `style` section, the JS entry point, compiling and the dev-server.
- [Override Bootstrap variables in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md) — the `overrides.scss` entry declared before `@Storefront`.
- [Override responsive breakpoints in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md) — changing the theme's breakpoints.

## When to use

As the entry point when a task concerns a theme's look (SCSS, JS, variables, breakpoints) rather than its templates or configuration fields.

## Code check (6.7.15.1)
- confirmed `style` — theme.json `style` section is read as the theme's style files — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:81
- confirmed `theme:compile` — console command name of the theme compile command — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
