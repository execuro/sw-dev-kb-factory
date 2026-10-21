---
id: platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md
title: Add SCSS Styling and JavaScript to a Theme
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/styling/add-css-js-to-theme.html
sourceHash: a0e3f68e15660b38344d541ee7052d4efb9d51e8
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme.json", "style", "base.scss", "overrides.scss", "main.js", "theme:compile", "shopware-cli project storefront-build", "shopware-cli project storefront-watch", "composer run storefront:dev-server", "watch:storefront", "scss", "live reload", "hot reload", "webpack"]
summary: "Theme SCSS via theme.json style entries and base.scss, JS via the main.js entry; compile with theme:compile, live reload on port 9998."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md", "platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md"]
---
## What it is

How a theme ships its own SCSS (compiled server-side by a PHP SASS compiler during theme compilation) and its own JavaScript (pre-built with webpack and shipped compiled), and how to use the dev-server for live reload.

## When to use

You have an installed, activated theme assigned to a sales channel (see [Create a first theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md)) and want to add styles or scripts to it.

## Key steps / config

**SCSS.** SCSS entry points are the files listed in the `style` section of `<plugin root>/src/Resources/theme.json`; paths are relative to `src/Resources`:

```json
{
  "style": [
    "app/storefront/src/scss/overrides.scss",
    "@Storefront",
    "app/storefront/src/scss/base.scss"
  ]
}
```

1. Add your styles to `<plugin root>/src/Resources/app/storefront/src/scss/base.scss` (or define other entry files in `style`).
2. Run `bin/console theme:compile`, then reload the Storefront.

**JavaScript.**

1. Create the entry file `src/Resources/app/storefront/src/main.js` (the installed code also accepts `main.ts`, which takes precedence).
2. Build with `shopware-cli project storefront-build`.
3. The compiled file lands at `src/Resources/app/storefront/dist/storefront/js/<asset-name>/<asset-name>.js`, where `<asset-name>` is the kebab-cased technical name (e.g. `swag-basic-example-theme`). Shopware includes it automatically; do not embed it yourself.

**Live reload.** Start the dev-server instead of re-running `theme:compile`:

- Production template: `shopware-cli project storefront-watch`
- Platform-only (contribution) setup: `composer run storefront:dev-server` (since 6.7.11.0), `composer run watch:storefront` before that.

It serves the Storefront on port `9998` (overridable via `STOREFRONT_PROXY_PORT`) and updates the page on file changes.

## Essential identifiers

- `theme.json` `style` section; `app/storefront/src/scss/base.scss`
- `app/storefront/src/main.js` — JS entry
- `bin/console theme:compile`
- `shopware-cli project storefront-build`, `shopware-cli project storefront-watch`
- `composer run storefront:dev-server` / `composer run watch:storefront`
- `STOREFRONT_PROXY_PORT` — dev-server port, default `9998`

## Gotchas

- The JS entry must be `app/storefront/src/main.js` directly under `src/`; the source's test snippet comment shows `src/js/main.js`, which is not detected as the entry.
- To use an npm package from pure SCSS, `shopware-cli project storefront-build` does not install it unless the theme also has a JS entry point, and the storefront-root `node_modules` is removed before `theme:compile` runs. See [Using npm packages in a pure-SCSS theme](platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md) for the `postinstall` copy-out workaround.

## Version notes

- 6.7.11.0: the platform-only dev-server script is `composer run storefront:dev-server`; earlier versions use `composer run watch:storefront`.

## Code check (6.7.15.1)
- confirmed `style` — theme.json `style` entries become the theme's style files — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:81
- confirmed `main.js` — JS entry looked up at `Resources/app/storefront/src/main.js`, after `main.ts` — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:186
- confirmed `StorefrontPluginConfiguration::getAssetName()` — kebab-cased technical name used for the dist JS path — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfiguration.php:243
- confirmed `ScssPhpCompiler` — SCSS is compiled in PHP via scssphp — vendor/shopware/storefront/Theme/ScssPhpCompiler.php:13
- confirmed `theme:compile` — console command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- confirmed `STOREFRONT_PROXY_PORT` — dev-server proxy port defaults to 9998 — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:45
- unverified `shopware-cli project storefront-build` — shopware-cli is a separate tool, out of scope
- unverified `composer run storefront:dev-server` — root composer.json scripts, outside the checked package roots
