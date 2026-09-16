---
id: platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md
title: Apps as themes
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/storefront/apps-as-themes.html
sourceHash: fca16042b545d37b56f942c1841164b0594b190d
keywords: ["Apps as themes", "theme.json", "manifest.xml", "theme", "Resources folder", "sales channel", "migrating themes", "ordinary app", "theme assignment", "Storefront appearance", "plugin migration", "theme configuration"]
summary: "An app becomes a theme by shipping a theme.json in its Resources folder; without it, changes apply to all sales channels."
lastBuilt: "2026-09-15"
---
## What it is

This page describes shipping a whole theme inside an app: including a `theme.json` theme-configuration file inside the app's `Resources` folder turns the app into a theme.

## When to use

Use this when packaging Storefront look-and-feel changes as an app-based theme instead of a plugin theme, or when migrating an existing plugin-based Shopware 6 theme to the app system.

## Key steps / config

A theme app's folder structure looks like this:

```text
DemoTheme
  Resources
    ...
    theme.json
  manifest.xml
```

- Themes vs. ordinary apps: if the app provides a `theme.json` file, it is treated as a theme, and its Storefront changes are only visible when the theme is assigned to the Storefront. Without a `theme.json` file, the app is an "ordinary" app and its changes apply automatically to all sales channels as long as the app is active.
- Migrating existing themes: instead of providing a `composer.json` and a plugin base class, provide a `manifest.xml` with the app's metadata. Copy the `YourThemePlugin/src/Resources` folder from the plugin into the `YourThemeApp/Resources` folder of the app; template and JavaScript code should not need to change.

## Essential identifiers

- `theme.json` — theme configuration file that makes an app a theme.
- `manifest.xml` — app metadata file replacing `composer.json` and the plugin base class when migrating.
- `Resources` folder — location of the theme configuration and assets inside the app.
