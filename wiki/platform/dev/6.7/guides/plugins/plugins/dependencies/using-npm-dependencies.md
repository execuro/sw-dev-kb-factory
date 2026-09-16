---
id: platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md
title: Adding NPM Dependencies
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/dependencies/using-npm-dependencies.html
sourceHash: baf6a34d4871896d6df1d91e9093935e1d8a9f6e
codeCheckedAgainst: "6.7.13.0"
keywords: ["npm install", "package.json", "node_modules", "vite.config.mts", "webpack.config.js", "composer build:js:admin", "shopware-cli project storefront-build", "PluginBaseClass", "PluginManager.register", "theme:compile", "postinstall", "javascript dependency", "vite", "webpack"]
summary: "Plugin npm packages: Admin via Vite (auto-resolved), Storefront via build/webpack.config.js resolve.modules, SCSS-only theme postinstall workaround."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/upgrades-migrations/administration/vite.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md"]
---
## What it is

How to install npm packages in a plugin and make them importable in the Administration (Vite since 6.7) and in the Storefront (Webpack), including a workaround for themes that consume npm packages only from SCSS.

## When to use

Plugin JavaScript or theme SCSS needs a third-party npm package (example: `missionlog`, `@fortawesome/fontawesome-free`).

## Key steps / config

1. Run `npm init -y` in `<plugin root>/src/Resources/app/administration/` or `<plugin root>/src/Resources/app/storefront/`, then `npm install missionlog`.

### Administration (6.7+, Vite)

- No `webpack.config.js` needed: Vite resolves packages from the plugin's `node_modules` via standard Node resolution. Just `import { log } from 'missionlog';`.
- Optional custom config (e.g. aliases) in `<plugin root>/src/Resources/app/administration/src/vite.config.mts` (next to `main.js`; `package.json` stays one level up):

```typescript
export default defineConfig({ resolve: { alias: { '@my-module': 'src/my-module' } } });
```

- Build: `composer build:js:admin`. Migration details: [Webpack to Vite](platform/dev/6.7/guides/upgrades-migrations/administration/vite.md).

### Storefront (Webpack)

- Create `<plugin root>/src/Resources/app/storefront/build/webpack.config.js`; Shopware passes it a params object including `basePath`:

```javascript
module.exports = (params) => ({
    resolve: { modules: [`${params.basePath}/Resources/app/storefront/node_modules`] },
});
```

- Import in a plugin class (`const { PluginBaseClass } = window;` … `export default class ExamplePlugin extends PluginBaseClass { init() {} }`) and register it in `main.js`: `PluginManager.register('ExamplePlugin', ExamplePlugin);`.
- Build: `shopware-cli project storefront-build`.

### Pure-SCSS theme workaround

1. Add an empty `src/Resources/app/storefront/src/main.js` so `shopware-cli` runs `npm install` and lifecycle scripts.
2. In the storefront `package.json`, a `postinstall` script copies the package SCSS to `.vendor/node_modules/@fortawesome/fontawesome-free/scss/` and webfonts to `../../public/static/fonts/`.
3. Point `theme.json` `style` entries and SCSS `@import` at the copy, e.g. `app/storefront/.vendor/node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss`; set `$fa-font-path: "../static/fonts";`.
4. Git-ignore `/.vendor/` and `/public/static/fonts/fa-*`.

## Essential identifiers

- `npm init -y`, `npm install`
- `vite.config.mts`, `composer build:js:admin`
- `src/Resources/app/storefront/build/webpack.config.js`, `params.basePath`, `resolve.modules`
- `window.PluginBaseClass`, `PluginManager.register`
- `shopware-cli project storefront-build`, `theme:compile`, `postinstall`

## Gotchas

- `shopware-cli` only runs `npm install` for a storefront extension with a JS entry point (`main.js`), and after the webpack build it deletes the storefront-root `node_modules` before `theme:compile`, so SCSS imports from `node_modules` fail with "Unable to compile the theme ... Unable to resolve file".
- The copy must sit under a nested `node_modules` path segment: `shopware-cli project format`/`validate` only ignore the storefront-root `node_modules`, and only that level is deleted.
- Runtime assets exposed via the `theme.json` `asset` block through `node_modules/...` must point at the `public/static/...` copy; fonts land in `public/bundles/<theme>/static/fonts/`.
- The workaround is fragile; tracked in shopware/shopware-cli#1466.

## Version notes

- Since 6.7 the Administration uses Vite instead of Webpack; plugin admin `webpack.config.js` is no longer needed. The Storefront still uses Webpack.

## Code check (6.7.13.0)
- confirmed `webpack.config.js` — plugin storefront webpack config is detected under Resources/app/storefront/build/ — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:149
- confirmed `basePath` — passed to the plugin webpack config function — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:347
- confirmed `entryFilePath` — storefront entry file resolved from Resources/app/storefront/src (main.js or main.ts) — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:84
- confirmed `window.PluginBaseClass` — exposed globally by the plugin manager — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:799
- confirmed `PluginManager.register` — registration call used in storefront main.js — vendor/shopware/storefront/Resources/app/storefront/src/main.js:53
- confirmed `theme.json` — presence marks the bundle as theme — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:124
- unverified `vite.config.mts` — admin Vite build tooling lies outside the checked vendor roots
- unverified `composer build:js:admin` — project composer script, not in checked vendor roots
- unverified `shopware-cli project storefront-build` — shopware-cli tool, out of scope
