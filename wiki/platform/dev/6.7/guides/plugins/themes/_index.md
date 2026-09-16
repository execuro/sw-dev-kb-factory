---
id: platform/dev/6.7/guides/plugins/themes/_index.md
title: Storefront Themes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/
sourceHash: 392a59ba4ac2e544fb8a0616024ba3e2e9d9af99
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware\\Storefront\\Framework\\ThemeInterface", "ThemeInterface", "theme manager", "storefront theme", "theme vs plugin", "theme vs app", "sales channel theme", "bootstrap 5", "theme inheritance", "theme configuration", "scss styling", "template override"]
summary: Overview of Storefront themes - plugins or apps implementing ThemeInterface, assigned per sales channel in the Theme Manager, no backend logic.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/architecture/storefront-concept.md", "platform/dev/6.7/guides/plugins/themes/theme-base-guide.md", "platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/themes/configuration/_index.md"]
---
## What it is

Entry page for Storefront themes: extensions that change the visual appearance of the Shopware Storefront. A theme is not a separate extension type; it is a plugin (not for Cloud) or an app (Cloud-ready) that is marked as a theme.

```text
Extensions
├── Plugin
│   └── can include a Theme (not for Cloud)
└── App
    └── can include a Theme (Cloud-ready)
```

The default Storefront theme is built on Bootstrap 5; see the [Storefront concept](platform/dev/6.7/concepts/framework/architecture/storefront-concept.md).

## When to use

Deciding whether to build a theme or a regular plugin/app, and finding the theme guides. Themes cover:

- overriding Twig templates
- custom SCSS/CSS (layout, typography, colors, images)
- configurable theme settings in the Administration
- controlling the inheritance order of styles and templates

## Key steps / config

- A plugin or app becomes a theme by implementing `Shopware\Storefront\Framework\ThemeInterface`.
- Once activated, a theme appears in the Theme Manager and is assigned to specific sales channels; regular plugins and apps are activated globally.
- A theme can [inherit](platform/dev/6.7/guides/plugins/themes/inheritance/_index.md) from other themes, override default configuration values (colors, fonts, media) and add its own [configuration](platform/dev/6.7/guides/plugins/themes/configuration/_index.md) options.
- Start with the [Theme Base Guide](platform/dev/6.7/guides/plugins/themes/theme-base-guide.md) and [Create a first theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md). For plugins/apps in general see the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md) and [App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md).

## Essential identifiers

- `Shopware\Storefront\Framework\ThemeInterface`
- Theme Manager (Administration, per sales channel assignment)

## Gotchas

- Themes contain no backend logic and need no PHP code; if the extension requires PHP logic, build a plugin instead.
- A regular plugin can also override templates and ship SCSS/JavaScript; the difference is scope — a theme only affects the sales channels it is assigned to.

## Code check (6.7.13.0)
- confirmed `ThemeInterface` — interface in the Storefront Framework namespace marking a bundle as theme — vendor/shopware/storefront/Framework/ThemeInterface.php:8
- confirmed `bootstrap` — Storefront depends on Bootstrap 5.3.8 — vendor/shopware/storefront/Resources/app/storefront/package.json:41
