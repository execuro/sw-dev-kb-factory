---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md
sourceHash: 6c8e31eb34d9e6032cb7d1ceff88505eb9d92d5d
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-custom-styling.html
title: Add Custom Styling
version: "6.7"
versions:
  - "6.7"
keywords: ["base.scss", "scss", "css", "storefront styling", "plugin styles", "scss variables", "shopware-cli project storefront-build", "shopware-cli project storefront-watch", "composer run build:js:storefront", "composer run watch:storefront", "hot-proxy", "StorefrontPluginConfigurationFactory", "theme compile"]
summary: "Add Storefront styles from a plugin: base.scss in src/Resources/app/storefront/src/scss, SCSS variables, build and hot-proxy watch commands."
lastBuilt: 2026-10-21
---
## What it is

How a plugin ships custom SCSS for the Storefront. Shopware picks up a single entry file named `base.scss` from the plugin's Storefront SCSS directory and compiles it into the theme.

## When to use

Your plugin changes Storefront templates and needs its own styles, or you want reusable SCSS variables for those styles.

## Key steps / config

1. Create the entry file `<plugin root>/src/Resources/app/storefront/src/scss/base.scss`. Only a file with exactly this name, directly in that directory, is registered as the plugin's style entry.
   ```scss
   body {
       background: blue;
   }
   ```
2. Optional: put variables in `<plugin root>/src/Resources/app/storefront/src/scss/abstract/variables.scss` and import them from `base.scss`:
   ```scss
   // abstract/variables.scss
   $sw-storefront-assets-color-background: blue;

   // base.scss
   @import 'abstract/variables.scss';
   body { background: $sw-storefront-assets-color-background; }
   ```
3. Build the Storefront so the SCSS is compiled:
   - project template: `shopware-cli project storefront-build`
   - platform contribution setup: `composer run build:js:storefront`
4. For live reloading use the hot-proxy:
   - project template: `shopware-cli project storefront-watch`
   - platform contribution setup: `composer run watch:storefront`

   With the hot-proxy running, open the shop on port `9998` (e.g. `domainToYourEnvironment.in:9998`).

To override Shopware's default (Bootstrap) variables instead of defining your own, see [Override Bootstrap Variables in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md). Creating the plugin itself is covered in the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## Essential identifiers

- `base.scss` (style entry file)
- `<plugin root>/src/Resources/app/storefront/src/scss`
- `shopware-cli project storefront-build` / `shopware-cli project storefront-watch`
- `composer run build:js:storefront` / `composer run watch:storefront`

## Gotchas

- Partials in subdirectories such as `abstract/` are not auto-loaded. Only the top-level `base.scss` is found (the finder uses depth 0), so import everything else from it.
- Styles appear only after a Storefront build or with the watcher running. Editing the files alone changes nothing.

## Code check (6.7.15.1)
- confirmed `Resources/app/storefront/src/scss` — style directory scanned per plugin — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:126
- confirmed `base.scss` — only file name accepted as entry, depth 0 — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:202
- unverified `shopware-cli project storefront-build` — shopware-cli tool, outside the vendor roots
- unverified `composer run build:js:storefront` — root composer script, outside the vendor roots
- unverified `9998` — hot-proxy port lives in the Storefront build tooling, not checked
