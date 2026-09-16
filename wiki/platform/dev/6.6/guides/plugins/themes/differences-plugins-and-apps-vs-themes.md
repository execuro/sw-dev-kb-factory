---
id: "platform/dev/6.6/guides/plugins/themes/differences-plugins-and-apps-vs-themes.md"
title: "Differences Plugins and Apps vs Themes"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/themes/differences-plugins-and-apps-vs-themes.html"
sourceHash: "03f0853ab66a7444855b2d22050f4d98a220c9f0"
keywords: ["ThemeInterface", "theme manager", "sales channel theme", "plugin vs theme", "app vs theme", "global plugin activation", "theme configuration inheritance", "Shopware\\Storefront\\Framework\\ThemeInterface", "theme appearance", "regular plugin"]
summary: "Explains that a theme is a plugin/app implementing ThemeInterface, scoped per sales channel, unlike globally activated plugins/apps."
lastBuilt: "2026-09-15"
---
## What it is
Explains the technical distinction between a theme and a "regular" plugin or app in Shopware: a theme is a special type of plugin/app focused on changing the Storefront's visual appearance.

## When to use
Use this to decide whether new functionality belongs in a theme or in a regular plugin/app: choose a theme when the goal is purely visual/appearance changes scoped to a sales channel, and a plugin/app when new behavior, features, or PHP logic is required.

## Key steps / config
Regular plugins or apps add new functions and change shop behavior, and may also ship SCSS/CSS and JavaScript to embed new features into the Storefront. A theme is technically also a plugin/app, but becomes visible in the theme manager once activated and can be assigned to a specific sales channel, whereas plugins/apps are activated globally across the whole Shopware installation.

To distinguish a theme from a regular plugin/app, it must implement the interface `Shopware\Storefront\Framework\ThemeInterface`. A theme can inherit from other themes, overwrite the default configuration (colors, fonts, media) and add new configuration options.

A theme does not require any PHP code — if PHP code is needed, a plugin should be used instead. Themes are specific to a sales channel and must be assigned to it to take effect, unlike plugins and apps which apply globally to the Shopware installation.

## Essential identifiers
- `Shopware\Storefront\Framework\ThemeInterface` — interface that marks a plugin/app as a theme
- theme manager — administration area where activated themes appear and can be assigned to sales channels

## Gotchas
A plugin/app without this interface is treated as a regular plugin/app: it will not appear in the theme manager or be assignable per sales channel, and cannot inherit theme configuration.
