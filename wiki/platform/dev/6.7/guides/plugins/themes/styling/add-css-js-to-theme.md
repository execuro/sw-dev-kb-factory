---
id: platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md
title: Add SCSS Styling and JavaScript to a Theme
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/styling/add-css-js-to-theme.html
sourceHash: a0e3f68e15660b38344d541ee7052d4efb9d51e8
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme.json", "style", "base.scss", "main.js", "bin/console theme:compile", "shopware-cli project storefront-build", "shopware-cli project storefront-watch", "composer run storefront:dev-server", "composer run watch:storefront", "scss", "javascript", "hot reload", "dev-server", "theme styling"]
summary: "Add theme SCSS via theme.json style entries and JS via app/storefront/src/main.js; compile with theme:compile, build JS, live reload on port 9998."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md"]
---
## What it is

How to add custom SCSS and JavaScript to an installed, activated theme assigned to a sales channel (see [Create a first theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md)). SCSS is compiled server-side by a PHP SASS compiler during theme compilation; JavaScript is compiled with webpack and must be shipped pre-built.

## When to use

When a theme needs its own styles or Storefront JavaScript, or when you want live reload while developing a theme.

## Key steps / config

**SCSS**

1. SCSS entry points are the files listed in the `style` section of `<plugin root>/src/Resources/theme.json`; paths are relative to `src/Resources`. The conventional entry is `app/storefront/src/scss/base.scss`:

```json
{
  "style": [
    "app/storefront/src/scss/overrides.scss",
    "@Storefront",
    "app/storefront/src/scss/base.scss"
  ]
}
```

2. Put styles in `<plugin root>/src/Resources/app/storefront/src/scss/base.scss`.
3. Run `bin/console theme:compile`, then check the Storefront.

**JavaScript**

1. Create the entry `src/Resources/app/storefront/src/main.js` (the code also accepts `main.ts`, which is checked first).
2. Build with `shopware-cli project storefront-build`. The output lands in `src/Resources/app/storefront/dist/storefront/js/<asset-name>/<asset-name>.js`, where `<asset-name>` is the bundle's technical name in kebab-case (e.g. `swag-basic-example-theme`).
3. The source states the compiled file is detected and included automatically. In the code, that auto-detection is the path for plugins without a `theme.json`; a theme's JS files come from its `theme.json` `script` list, so keep the dist file listed there.

**Live reload (dev-server)**

- Project template: `shopware-cli project storefront-watch`
- Platform contribution setup: `composer run storefront:dev-server` (since 6.7.11.0), `composer run watch:storefront` (before 6.7.11.0)

The dev-server proxies the Storefront on port `9998` (open `localhost:9998`); pages update on theme file changes. The port can be overridden with the `STOREFRONT_PROXY_PORT` env var.

## Essential identifiers

- `theme.json` → `style`, `script`
- `app/storefront/src/scss/base.scss`, `app/storefront/src/main.js`
- `bin/console theme:compile`
- `shopware-cli project storefront-build`, `shopware-cli project storefront-watch`
- `composer run storefront:dev-server`, `composer run watch:storefront`
- `STOREFRONT_PROXY_PORT` (default `9998`)

## Gotchas

- SCSS changes need `theme:compile` (or the dev-server); JS changes need a storefront build — PHP cannot compile JS.
- To consume an npm package directly from theme SCSS (e.g. `@fortawesome/fontawesome-free`), `shopware-cli project storefront-build` does not install it unless the theme also has a JS entry point, and even then the storefront-root `node_modules` is removed before `theme:compile` runs; use the `postinstall` copy-out workaround in [Using npm dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md).
- The source gives the default SCSS entry once as `<plugin root>/app/storefront/src/scss/base.scss`; the actual location is under `src/Resources/`.

## Version notes

- 6.7.11.0 renamed the platform-only dev-server script from `watch:storefront` to `storefront:dev-server`.

## Code check (6.7.13.0)
- confirmed `theme:compile` — console command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `ScssPhp\ScssPhp\Compiler` — PHP SASS compiler used for theme SCSS — vendor/shopware/storefront/Theme/ScssPhpCompiler.php:5
- confirmed `style` — theme.json style entries resolved as SCSS files — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:81
- confirmed `script` — theme JS files taken from the theme.json script list — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:85
- corrected `main.js` — docs: main.js is the entry; code checks main.ts first, then main.js — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:186
- corrected `StorefrontPluginConfiguration::getAssetName()` — docs: dist JS auto-detected; code auto-detects the kebab-case dist path only for non-theme plugins (factory line 131) — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfiguration.php:243
- confirmed `STOREFRONT_PROXY_PORT` — dev-server proxy port defaults to 9998 — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:45
- unverified `shopware-cli project storefront-build` — shopware-cli is outside the vendor/shopware roots
- unverified `composer run storefront:dev-server` — platform root composer.json scripts, out of scope
