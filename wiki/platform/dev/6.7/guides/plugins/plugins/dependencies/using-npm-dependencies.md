---
id: platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md
title: Adding NPM Dependencies
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/dependencies/using-npm-dependencies.html
sourceHash: baf6a34d4871896d6df1d91e9093935e1d8a9f6e
codeCheckedAgainst: "6.7.15.1"
keywords: ["npm", "package.json", "node_modules", "vite.config.mts", "webpack.config.js", "composer build:js:admin", "shopware-cli project storefront-build", "PluginBaseClass", "PluginManager", "theme:compile", "postinstall", "npm dependencies", "javascript packages", "vite"]
summary: "Use npm packages in plugin Administration (Vite, no config) and Storefront (build/webpack.config.js), plus a postinstall workaround for SCSS-only themes."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/upgrades-migrations/administration/vite.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md"]
---
## What it is

How to install npm packages into a plugin and make the Administration (Vite, since 6.7) and the Storefront (Webpack) build resolve them, including a workaround for themes that use npm packages only from SCSS.

## When to use

- A plugin's Administration or Storefront JavaScript needs a third-party npm package.
- A theme imports SCSS/webfonts from an npm package and `theme:compile` cannot resolve it.

## Key steps / config

**Install**: run `npm init -y` in `<plugin root>/src/Resources/app/administration/` or `<plugin root>/src/Resources/app/storefront/`, then e.g. `npm install missionlog`.

**Administration (6.7+, Vite)**: no build config needed; `import { log } from 'missionlog';` resolves from the plugin's `node_modules`. Optional custom config (e.g. aliases) goes in `<plugin root>/src/Resources/app/administration/src/vite.config.mts` (next to `main.js`; `package.json` stays one level up):

```typescript
export default defineConfig({
    resolve: { alias: { '@my-module': 'src/my-module' } },
});
```

Build: `composer build:js:admin`. Migration details: [Webpack to Vite](platform/dev/6.7/guides/upgrades-migrations/administration/vite.md).

**Storefront (Webpack)**: create `<plugin root>/src/Resources/app/storefront/build/webpack.config.js` (`.ts`, `.cts`, `.cjs` are also detected). It exports a function receiving `params` (incl. `basePath`):

```javascript
module.exports = (params) => ({
    resolve: {
        modules: [`${params.basePath}/Resources/app/storefront/node_modules`],
    },
});
```

Then import the package in a plugin (`export default class ExamplePlugin extends PluginBaseClass`, with `const { PluginBaseClass } = window;`) and register it in `src/Resources/app/storefront/src/main.js` via `PluginManager.register('ExamplePlugin', ExamplePlugin);`. Build: `shopware-cli project storefront-build`.

**SCSS-only theme workaround**:

1. Add an empty `src/Resources/app/storefront/src/main.js` so `shopware-cli` runs `npm install` and lifecycle scripts.
2. In the storefront `package.json`, a `postinstall` script copies the needed files out of `node_modules` into `.vendor/node_modules/<package>/...` (SCSS) and `../../public/static/fonts/` (webfonts).
3. Point `theme.json` `style` entries and SCSS imports at the copy, e.g. `app/storefront/.vendor/node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss`; set `$fa-font-path: "../static/fonts";`. Point `asset` entries at `public/static/...`.
4. Add `/.vendor/` and `/public/static/fonts/fa-*` to `.gitignore`.

## Essential identifiers

- `<plugin root>/src/Resources/app/storefront/build/webpack.config.js`
- `<plugin root>/src/Resources/app/administration/src/vite.config.mts`
- `PluginBaseClass`, `PluginManager.register()`
- `composer build:js:admin`, `shopware-cli project storefront-build`, `theme:compile`

## Gotchas

- `shopware-cli` runs `npm install` for a storefront extension only if `src/Resources/app/storefront/src/main.js` exists, and deletes the storefront-root `node_modules` after the webpack build but before `theme:compile` — direct `node_modules` SCSS imports then fail with `Unable to compile the theme "MyTheme". Unable to resolve file ...`.
- The copied folder must contain a nested `node_modules` path segment: `shopware-cli project format` / `validate` ignore and the cleanup deletes only the root level.
- The workaround is fragile (depends on lifecycle scripts and cleanup order); tracked in shopware/shopware-cli#1466.

## Version notes

- 6.7 moved the Administration build from Webpack to Vite; a custom `webpack.config.js` is no longer needed there. The Storefront still uses Webpack.

## Code check (6.7.15.1)
- confirmed `build/webpack.config.js` — storefront plugin webpack config detected (also `.ts`/`.cts`/`.cjs`) — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:149
- confirmed `basePath` — passed to the plugin webpack config function — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:347
- confirmed `main.js` — entry file `main.js` or `main.ts` under the app `src` — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:133
- confirmed `PluginBaseClass` — exposed on `window` — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:972
- confirmed `PluginManager` — exposed on `window` — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:971
- unverified `vite.config.mts` — handled by the Administration build tooling, outside the checked roots
- unverified `composer build:js:admin` — project composer script, out of scope
- unverified `shopware-cli project storefront-build` — external CLI, out of scope
