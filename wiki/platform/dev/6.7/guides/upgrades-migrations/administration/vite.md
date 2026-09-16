---
id: platform/dev/6.7/guides/upgrades-migrations/administration/vite.md
title: Changing from Webpack to Vite
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vite.html
sourceHash: ddcfc74c50f14c50f53350297ae32fd8a8e0e218
codeCheckedAgainst: "6.7.13.0"
keywords: ["vite", "webpack", "vite.config.mts", "webpack.config.js", "bundle:dump", "BundleDumpCommand", "var/plugins.json", "composer build:js:admin", "composer watch:admin", "pentatrion_vite", "sw-plugin-dev.json", "hmr", "administration build", "shopware-vite-plugin"]
summary: Shopware 6.7 builds the Administration with Vite instead of Webpack; plugins with a custom webpack.config.js must move it to vite.config.mts.
lastBuilt: 2026-09-15
---
## What it is

Explains the switch of the Shopware Administration build from Webpack to Vite in Shopware 6.7: what extension developers must migrate, and how the core, plugin builds, dev server and asset loading work.

## When to use

- A plugin ships its own `webpack.config.js` for the Administration (apps are not affected; their build is decoupled).
- You need to understand how `composer build:js:admin` / `composer watch:admin` find and build plugins.

## Key steps / config

Migrating a custom webpack config:

1. Create `vite.config.mts` in `YourApp/src/Resources/app/administration/src` (previously `webpack.config.js` lived in `YourApp/src/Resources/app/administration/build/`).
2. Remove the old `webpack.config.js`.
3. Remove all webpack-related dependencies from `package.json`.
4. Add the Vite dependencies to `package.json`.

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: { '@example': 'src/example' },
    },
});
```

Build pipeline:

- `php bin/console bundle:dump` (`Shopware\Core\Framework\Plugin\Command\BundleDumpCommand`) writes all active bundles/plugins to `var/plugins.json` (default path argument). It is part of `build:js:admin`, `build:js:storefront`, `watch:admin`, `watch:storefront`.
- `composer build:js:admin` builds the Administration with all extensions. The core config `<shopwareRoot>/src/Administration/Resources/app/administration/vite.config.mts` covers only the core.
- `build/plugins.vite.ts` reads `var/plugins.json`, calls Vite `build` per plugin (Vite loads `vite.config` files from the entry file's path); in `composer watch:admin` it calls `createServer` per plugin instead.
- Asset loading: the core uses the `pentatrion_vite` Symfony bundle with the `entrypoints.json` from `vite-plugin-symfony`. For plugins, `application.ts` injects entry files — production from the `/api/_info/config` call, dev mode from `sw-plugin-dev.json`.

Vite plugins (prefix `shopware-vite-plugin-`): `asset-path` (prepends `window.__sw__.assetPath` to chunk paths, for S3/cluster setups), `static-assets`, `serve-multiple-static`, `vue-globals` (rewrites Vue imports to `Shopware.Vue`), `override-component` (auto-imports `*.override.vue` and calls `Shopware.Component.registerOverrideComponent`), `twigjs` (loads `*.html.twig`).

## Essential identifiers

- `vite.config.mts`, `webpack.config.js`
- `bundle:dump`, `Shopware\Core\Framework\Plugin\Command\BundleDumpCommand`, `var/plugins.json`
- `composer build:js:admin`, `composer watch:admin`
- `pentatrion_vite`, `sw-plugin-dev.json`, `Shopware.Component.registerOverrideComponent`

## Gotchas

- The source says the setup can be tested via the feature flag `ADMIN_VITE`; that flag no longer exists in the installed code — Vite is the build in 6.7.
- HMR only reloads `*.vue` files, so it is limited until components move to SFCs.
- The source mentions `*.vite.ts` duplicates such as `src/index.vite.ts`; no such file exists in the installed admin `src`.
- `Shopware.Component.registerOverrideComponent` is marked `@experimental` (feature `ADMIN_COMPOSITION_API_EXTENSION_SYSTEM`).

## Code check (6.7.13.0)
- absent `ADMIN_VITE` — feature flag not found anywhere in the installed code
- confirmed `bundle:dump` — command name, aliases `administration:dump:plugins`/`administration:dump:bundles` — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:14
- confirmed `BundleDumpCommand` — class in `Shopware\Core\Framework\Plugin\Command` — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:16
- confirmed `var/plugins.json` — default `dumpFilePath` argument — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:33
- confirmed `sw-plugin-dev.json` — fetched in development mode by `loadPlugins()` — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:617
- confirmed `registerOverrideComponent` — `@experimental stableVersion:v6.8.0` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:148
- unverified `index.vite.ts` — not present in admin `src`; referenced only outside the checked roots
- unverified `pentatrion_vite` — bundle config lives outside the checked roots
