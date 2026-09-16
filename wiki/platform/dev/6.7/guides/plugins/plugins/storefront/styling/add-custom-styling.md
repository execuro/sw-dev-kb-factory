---
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md
title: Add Custom Styling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-custom-styling.html
sourceHash: 6c8e31eb34d9e6032cb7d1ceff88505eb9d92d5d
codeCheckedAgainst: "6.7.13.0"
keywords: ["base.scss", "src/Resources/app/storefront/src/scss", "abstract/variables.scss", "shopware-cli project storefront-build", "shopware-cli project storefront-watch", "composer run build:js:storefront", "composer run watch:storefront", "hot proxy", "scss", "css", "plugin styling", "storefront"]
summary: Plugin Storefront styles are loaded from src/Resources/app/storefront/src/scss/base.scss; build with storefront-build or watch via hot proxy on port 9998.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md"]
---
## What it is

How a plugin adds its own (S)CSS to the Storefront: Shopware picks up a `base.scss` entry file from a fixed directory in the plugin and compiles it into the theme.

## When to use

Your plugin changes Storefront templates and needs custom styles for them. To override Shopware's default (Bootstrap) variables instead, see [Override Bootstrap Variables in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md). Prerequisites: a plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and SCSS knowledge.

## Key steps / config

1. Create the entry file `<plugin root>/src/Resources/app/storefront/src/scss/base.scss`. Only a file named `base.scss` directly in that `scss` directory (not in subfolders) is registered as a style entry.

   ```scss
   body {
       background: blue;
   }
   ```

2. Optional: put shared variables in `src/Resources/app/storefront/src/scss/abstract/variables.scss` and import them from `base.scss`:

   ```scss
   // abstract/variables.scss
   $sw-storefront-assets-color-background: blue;

   // base.scss
   @import 'abstract/variables.scss';
   body { background: $sw-storefront-assets-color-background; }
   ```

3. Build the Storefront so the SCSS is compiled:
   - Template project: `shopware-cli project storefront-build`
   - Platform contribution setup: `composer run build:js:storefront`

4. For live style changes use the Storefront hot proxy:
   - Template project: `shopware-cli project storefront-watch`
   - Platform contribution setup: `composer run watch:storefront`

   Then open the shop on port `9998` (e.g. `domainToYourEnvironment.in:9998`).

## Essential identifiers

- `src/Resources/app/storefront/src/scss/base.scss`
- `shopware-cli project storefront-build` / `shopware-cli project storefront-watch`
- `composer run build:js:storefront` / `composer run watch:storefront`
- Hot proxy port `9998`

## Gotchas

- Styles do not appear until the Storefront is rebuilt (or the watcher is running).
- The hot proxy port defaults to `9998` but the Storefront build scripts read `STOREFRONT_PROXY_PORT` to override it.

## Code check (6.7.13.0)
- confirmed `base.scss` — style entry discovered via Finder, depth 0 only — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:202
- confirmed `Resources/app/storefront/src/scss` — directory scanned for the plugin's style entry — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:126
- confirmed `STOREFRONT_PROXY_PORT` — hot proxy port defaults to 9998 — vendor/shopware/storefront/Resources/app/storefront/build/start-hot-reload.js:15
- unverified `shopware-cli project storefront-build` — shopware-cli tool, out of scope
- unverified `composer run build:js:storefront` — platform root composer scripts, out of scope
