---
id: platform/dev/6.7/guides/plugins/themes/inheritance/_index.md
title: Inheritance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/inheritance/
sourceHash: acf3d99c4bd4baf7e715490032a4e11cc372df9e
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme inheritance", "views", "@Storefront", "@Plugins", "theme.json", "parent theme", "extend theme", "compose themes", "child theme", "theme without resources"]
summary: Section index for Shopware theme inheritance - extending and composing themes, including inheritance without own resources.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md
  - platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md
---
## What it is

Section index for Shopware's theme inheritance system: how one Storefront theme extends or composes another.

## When to use

When a new theme should build on an existing theme's templates, styles, scripts or configuration instead of starting from the default Storefront theme alone.

## Key steps / config

- [Theme inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) — extending another theme via the inheritance lists in `theme.json` (e.g. `views` with `@Storefront`, `@Plugins` and theme namespaces).
- [Add theme inheritance without resources](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md) — inheriting from a theme without shipping own resources.

## Essential identifiers

- `theme.json`
- `views`, `@Storefront`, `@Plugins`

## Code check (6.7.15.1)
- confirmed `views` — `theme.json` key sets the template inheritance — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:102
- confirmed `@Plugins` — inheritance slot filled with non-theme plugin bundles — vendor/shopware/storefront/Theme/Twig/ThemeInheritanceBuilder.php:54
- confirmed `@Storefront` — default inheritance slot — vendor/shopware/storefront/Theme/Twig/ThemeInheritanceBuilder.php:96
