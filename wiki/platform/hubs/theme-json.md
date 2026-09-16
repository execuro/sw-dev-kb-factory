---
id: platform/hubs/theme-json.md
title: theme.json
summary: "Navigation hub for theme.json: structure, config fields, inheritance, assets, icons, styling and app-as-theme migration across 6.6 and 6.7."
keywords: ["theme.json", "theme inheritance", "configInheritance", "theme configuration", "storefront theme", "apps as themes", "theme assets", "theme icons", "theme styling", "bootstrap variables", "theme:create", "theme:compile"]
members: ["platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md", "platform/dev/6.6/guides/plugins/plugins/bundle.md", "platform/dev/6.6/guides/plugins/themes/add-icons.md", "platform/dev/6.6/guides/plugins/themes/add-theme-inheritance-without-resources.md", "platform/dev/6.6/guides/plugins/themes/add-theme-inheritance.md", "platform/dev/6.6/guides/plugins/themes/theme-configuration.md", "platform/dev/6.6/products/cli/validation.md", "platform/dev/6.6/resources/references/adr/2021-09-22-refactor-theme-inheritance.md", "platform/dev/6.7/guides/plugins/apps/storefront/apps-as-themes.md", "platform/dev/6.7/guides/plugins/themes/assets/_index.md", "platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md", "platform/dev/6.7/guides/plugins/themes/assets/add-icons.md", "platform/dev/6.7/guides/plugins/themes/configuration/_index.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md", "platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/themes/inheritance/_index.md", "platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md", "platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md", "platform/dev/6.7/guides/plugins/themes/styling/_index.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md", "platform/dev/6.7/guides/plugins/themes/theme-base-guide.md", "platform/dev/6.7/resources/references/adr/2021-09-22-refactor-theme-inheritance.md"]
lastBuilt: 2026-09-15
---

`theme.json` is the manifest that turns a plugin or app's `Resources` folder into a
Shopware Storefront theme: it declares views/style/script/asset entries, exposes
Administration-editable config fields, and controls inheritance from other themes via
`configInheritance`. Come to this hub instead of grepping when you need to know which
`theme.json` key does what, how theme inheritance and config inheritance differ, how to
scaffold or migrate a theme, or how assets/icons/SCSS/breakpoints hook into the file —
each linked page below covers one slice in detail.

## 6.6

- [Apps as themes](platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md) — an app becomes a theme only if it ships a `theme.json` in its `Resources` folder; otherwise its Storefront changes apply to all sales channels.
- [Bundle](platform/dev/6.6/guides/plugins/plugins/bundle.md) — using a Symfony/Shopware Bundle (with `ThemeInterface` support) instead of a plugin for project code not managed via the Administration.
- [Add custom icons](platform/dev/6.6/guides/plugins/themes/add-icons.md) — adding custom icons via the `sw_icon` Twig action and the `iconSets` key in `theme.json`.
- [Theme with Bootstrap styling](platform/dev/6.6/guides/plugins/themes/add-theme-inheritance-without-resources.md) — using the `@StorefrontBootstrap` placeholder in the `style` section to build on plain Bootstrap SCSS without Shopware's default skin.
- [Theme inheritance](platform/dev/6.6/guides/plugins/themes/add-theme-inheritance.md) — extending another theme by adding its placeholder to `views`, `style`, `script`, `asset` and `configInheritance`.
- [Theme configuration](platform/dev/6.6/guides/plugins/themes/theme-configuration.md) — full `theme.json` structure: `name`/`style`/`views`/`asset` keys, config field types, tabs/blocks/sections, and `configInheritance`.
- [Validation](platform/dev/6.6/products/cli/validation.md) — `shopware-cli extension validate` lints extensions (including `theme.json`) in CI; `--full` runs all tools, `--only` picks specific ones.
- [Refactor theme inheritance (ADR)](platform/dev/6.6/resources/references/adr/2021-09-22-refactor-theme-inheritance.md) — the design decision adding `configInheritance` so themes inherit config fields from other themes in order, dynamically instead of via snapshot.

## 6.7

Theme docs were reorganized into `assets/`, `configuration/`, `inheritance/` and `styling/`
sub-sections in 6.7; several pages are the same topic as their 6.6 counterpart above,
reworked for the new layout (noted per entry).

- [Apps as Themes](platform/dev/6.7/guides/plugins/apps/storefront/apps-as-themes.md) — same requirement as 6.6: ship `Resources/theme.json` or Storefront changes apply globally; also covers migrating a plugin theme to an app.
- [Assets (index)](platform/dev/6.7/guides/plugins/themes/assets/_index.md) — section index for theme assets (images, fonts, icon packs).
- [Add Assets to a Theme](platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md) — declare asset folders in the `theme.json` `asset` array, run `theme:compile`, reference them via Twig `asset()` or SCSS.
- [Add Custom Icons](platform/dev/6.7/guides/plugins/themes/assets/add-icons.md) — near-duplicate of 6.6's "Add custom icons", updated for the `assets/` layout: `sw_icon` tag plus `iconSets` in `theme.json`.
- [Configuration (index)](platform/dev/6.7/guides/plugins/themes/configuration/_index.md) — section index for theme configuration topics.
- [Theme Configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md) — near-duplicate of 6.6's "Theme configuration", moved into `configuration/`: `views`/`style`/`script`/`asset`/`previewMedia`, config field types, `configInheritance`.
- [Theme Inheritance Configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md) — using `configInheritance` so an extending theme inherits config fields from a base theme, overriding or adding only what it needs.
- [Create a Theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md) — scaffold a plugin-based theme with `bin/console theme:create`, install/activate it, assign via `theme:change`; generated directory layout.
- [Inheritance (index)](platform/dev/6.7/guides/plugins/themes/inheritance/_index.md) — section index for theme inheritance guides.
- [Theme with Bootstrap styling](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md) — near-duplicate of 6.6's "Theme with Bootstrap styling", moved into `inheritance/`: use `@StorefrontBootstrap` instead of `@Storefront` and add `@Plugins` yourself.
- [Theme Inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) — near-duplicate of 6.6's "Theme inheritance", moved into `inheritance/`: extend a theme via its `@ThemeName` placeholder in `views`/`style`/`script`/`asset`/`configInheritance`.
- [Styling (index)](platform/dev/6.7/guides/plugins/themes/styling/_index.md) — section index for theme styling guides.
- [Add SCSS Styling and JavaScript to a Theme](platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md) — add SCSS via `theme.json` `style` entries and JS via `app/storefront/src/main.js`; compile with `theme:compile` or `shopware-cli project storefront-watch`.
- [Override Bootstrap variables in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md) — override Bootstrap/Storefront SCSS `!default` variables by listing `overrides.scss` before `@Storefront` in the theme's `style` array.
- [Override responsive breakpoints in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md) — override breakpoints via hidden `sw-breakpoint-xs`..`xxl` `theme.json` fields (6.7.8.0+), mirrored into Bootstrap `$grid-breakpoints`.
- [Theme Base Guide](platform/dev/6.7/guides/plugins/themes/theme-base-guide.md) — entry point for Storefront theme development: ordered workflow from creating a theme and its `theme.json` through styling, assets, overrides and inheritance.
- [Refactor theme inheritance (ADR)](platform/dev/6.7/resources/references/adr/2021-09-22-refactor-theme-inheritance.md) — the same ADR as the 6.6 entry above, carried into the 6.7 tree unchanged: `configInheritance` lists themes whose config fields are inherited dynamically, in order.
