---
id: platform/dev/6.7/guides/plugins/themes/_index.md
title: Storefront Themes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/
sourceHash: 392a59ba4ac2e544fb8a0616024ba3e2e9d9af99
codeCheckedAgainst: "6.7.15.1"
keywords: ["storefront theme", "ThemeInterface", "Shopware\\Storefront\\Framework\\ThemeInterface", "theme.json", "theme manager", "sales channel", "bootstrap 5", "theme vs plugin", "app theme", "theme inheritance", "theme configuration", "scss"]
summary: "Storefront themes overview: plugins implementing ThemeInterface or apps with theme.json, assigned per sales channel, no PHP logic."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/architecture/storefront-concept.md", "platform/dev/6.7/guides/plugins/themes/theme-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md"]
---
## What it is

Overview of Storefront themes: extensions that change only the visual appearance of the [Storefront](platform/dev/6.7/concepts/framework/architecture/_index.md). A theme is not a separate extension type — it is a plugin (not available in Cloud) or an app (Cloud-ready) that the Theme Manager recognises as a theme and that is assigned per sales channel.

```text
Extensions
├── Plugin
│   └── can include a Theme (not for Cloud)
└── App
    └── can include a Theme (Cloud-ready)
```

## When to use

You want to restyle the Storefront for specific sales channels — templates, SCSS/CSS, configurable theme settings in the Administration, inheritance order of styles and templates — without adding backend behaviour. If the extension needs PHP logic, build a regular [plugin](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md) or [app](platform/dev/6.7/guides/plugins/apps/app-base-guide.md) instead.

## Key steps / config

- Plugin-based theme: the plugin base class implements `Shopware\Storefront\Framework\ThemeInterface` (an empty marker interface) and ships `Resources/theme.json`.
- App-based theme: the app ships `Resources/theme.json`; that file is what makes Shopware treat the app as a theme.
- After activation the theme appears in the Theme Manager and is assigned to individual sales channels; plain plugins and apps take effect globally.
- Typical theme tasks: override Twig templates, add SCSS/CSS (layout, typography, colours, images), define configurable theme settings, control style/template [inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/_index.md), override default [configuration](platform/dev/6.7/guides/plugins/themes/configuration/_index.md) values such as colours, fonts and media.
- The default Storefront theme is built on Bootstrap 5 (see the [Storefront concept](platform/dev/6.7/concepts/framework/architecture/storefront-concept.md)).
- Getting started: [Theme Base Guide](platform/dev/6.7/guides/plugins/themes/theme-base-guide.md), [Create a first theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md).

## Essential identifiers

- `Shopware\Storefront\Framework\ThemeInterface`
- `Resources/theme.json`
- Theme Manager (Administration)

## Gotchas

- A regular plugin can also override templates and ship SCSS/JS; what distinguishes a theme is the theme marker plus per-sales-channel assignment.
- A plugin implementing `ThemeInterface` without a `Resources/theme.json` is rejected as an invalid theme bundle.
- Themes need no PHP code; if you need PHP, use a plugin.

## Code check (6.7.15.1)
- confirmed `ThemeInterface` — empty marker interface — vendor/shopware/storefront/Framework/ThemeInterface.php:8
- confirmed `Storefront` — default Storefront bundle itself implements ThemeInterface — vendor/shopware/storefront/Storefront.php:21
- confirmed `ThemeInterface::class` — plugin is a theme when its base class implements the interface — vendor/shopware/storefront/Framework/Store/Subscriber/ExtensionThemeDetectionSubscriber.php:75
- confirmed `createFromBundle` — ThemeInterface bundles get a theme configuration — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:38
- confirmed `Resources/theme.json` — an app is treated as a theme when this file exists — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:61
- confirmed `invalidThemeBundle` — thrown when a theme bundle lacks Resources/theme.json — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:147
- confirmed `bootstrap` — Storefront depends on Bootstrap 5.3.8 — vendor/shopware/storefront/Resources/app/storefront/package.json:41
