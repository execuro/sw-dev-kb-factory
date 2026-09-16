---
id: "platform/dev/6.6/guides/plugins/themes/add-css-js-to-theme.md"
title: "Add SCSS Styling and JavaScript to a Theme"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/themes/add-css-js-to-theme.html"
sourceHash: "853a65190dfeb8294788e49dd7d0d44648c9c0b8"
keywords: ["theme.json style", "base.scss", "overrides.scss", "theme:compile", "webpack", "main.js", "hot-proxy", "watch-storefront.sh", "watch:storefront", "SASS compiler", "theme SCSS", "theme JavaScript", "live reload"]
summary: "Explains adding custom SCSS via base.scss and JS via main.js to a theme, compiling both, and the hot-proxy live-reload workflow."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to add custom SCSS styling and custom JavaScript to a theme, including compiling styles, compiling JavaScript, and using the hot-proxy live-reload workflow.

## When to use
Use this when a theme needs its own styling or scripting beyond what the default Storefront theme provides, and the theme is already installed, activated and assigned to a sales channel.

## Key steps / config
CSS/SCSS is processed by a PHP SASS compiler. The entry point for SCSS is declared in the `theme.json` `style` section, defaulting to `<plugin root>/app/storefront/src/scss/base.scss`:

```javascript
// <plugin root>/src/Resources/theme.json
{
  "style": [
    "app/storefront/src/scss/overrides.scss",
    "@Storefront",
    "app/storefront/src/scss/base.scss"
  ]
}
```

Edit `base.scss` under `<plugin root>/src/Resources/app/storefront/src/scss` to add custom styles, then compile with `bin/console theme:compile`; changes can then be checked by opening the Storefront in a browser.

JavaScript cannot be compiled by PHP, so webpack is used instead; all JS is written in EcmaScript 6, though EcmaScript 5 also works. The default entry point is `main.js`, located at `src/Resources/app/storefront/src/`. The theme ships its JavaScript already compiled; Shopware automatically detects and includes the compiled output, by default saved as `<plugin root>/src/resources/app/storefront/dist/storefront/js/<theme-name>/<theme-name>.js`, produced by running `bin/build-storefront.sh`.

For faster iteration, the `hot-proxy` option gives live reload during development, since recompiling with `bin/console theme:compile` on every change is tedious. Start it with `./bin/watch-storefront.sh` (template setup) or `composer run watch:storefront` (platform/contribution setup). This starts a Node.js web server on port `9998`; opening the Storefront at `localhost:9998` then auto-updates on theme changes.

## Essential identifiers
- `theme.json` `style` key — declares SCSS entry points, e.g. `base.scss`, `overrides.scss`
- `bin/console theme:compile` — compiles SCSS into CSS
- `main.js` — default JavaScript entry point under `src/Resources/app/storefront/src/`
- `bin/build-storefront.sh` — builds and compiles the theme's JavaScript
- `./bin/watch-storefront.sh` / `composer run watch:storefront` — starts the hot-proxy live-reload server on port `9998`
