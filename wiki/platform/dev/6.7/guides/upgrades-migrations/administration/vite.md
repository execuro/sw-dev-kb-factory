---
id: platform/dev/6.7/guides/upgrades-migrations/administration/vite.md
title: Changing from Webpack to Vite
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vite.html
sourceHash: ddcfc74c50f14c50f53350297ae32fd8a8e0e218
codeCheckedAgainst: "6.7.15.1"
keywords: ["vite", "webpack", "vite.config.mts", "webpack.config.js", "bundle:dump", "BundleDumpCommand", "var/plugins.json", "composer build:js:admin", "composer watch:admin", "plugins.vite.ts", "sw-plugin-dev.json", "hmr", "admin build"]
summary: Shopware 6.7 builds the Administration with Vite instead of Webpack; plugins move a custom webpack.config.js to vite.config.mts. Covers build internals.
lastBuilt: 2026-10-21
---
## What it is

Describes the switch of the Administration build from Webpack to Vite in Shopware 6.7. It covers what plugin authors must change and how the core, extension and dev-server builds work internally. The source marks timelines and implementation details as subject to change.

## When to use

Your plugin ships a custom `webpack.config.js` for the Administration. You also need this page when debugging how extension bundles are built, served in dev mode, or loaded at runtime.

## Key steps / config

Apps are not affected because their build is decoupled from Shopware. Plugins only need action if they extend the webpack config:

1. Create `vite.config.mts` in `YourApp/src/Resources/app/administration/src`. The old file was `YourApp/src/Resources/app/administration/build/webpack.config.js`.
2. Delete the old `webpack.config.js`.
3. Remove webpack-related dependencies from `package.json`.
4. Add the Vite dependencies to `package.json`.

Minimal migration of an alias:

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: { alias: { '@example': 'src/example' } },
});
```

Build pipeline:

- `Shopware\Core\Framework\Plugin\Command\BundleDumpCommand` (`php bin/console bundle:dump`) writes all active bundles/plugins to `<shopwareRoot>/var/plugins.json`. It also runs as part of `build:js:admin`, `build:js:storefront`, `watch:admin` and `watch:storefront`.
- Full Administration build: `composer build:js:admin`. Dev/HMR server: `composer watch:admin`.
- Core build: `<shopwareRoot>/src/Administration/Resources/app/administration/vite.config.mts`. It builds the core only, not extensions.
- Extensions build: `<shopwareRoot>/src/Administration/Resources/app/administration/build/plugins.vite.ts` reads `var/plugins.json` and calls Vite's `build` for each plugin. In dev mode it calls `createServer` instead. Vite picks up each plugin's `vite.config` from the entry file's path.
- Asset loading: the core uses the `pentatrion_vite` Symfony bundle with the `entrypoints.json` produced by `vite-plugin-symfony`. In production, `application.ts` injects plugin entry files from the `/api/_info/config` response. In dev mode it uses `sw-plugin-dev.json`, served by `shopware-vite-plugin-serve-multiple-static`.

Shopware's Vite plugins, all prefixed `shopware-vite-plugin-`:

- `asset-path`: prepends `window.__sw__.assetPath` to chunk paths, for S3/cluster setups.
- `static-assets`: copies `static` to the output directory.
- `serve-multiple-static`: serves static assets in dev mode.
- `vue-globals`: rewrites Vue imports to destructure from `Shopware.Vue`, which avoids multiple Vue instances.
- `override-component`: auto-imports `*.override.vue` files and registers them via `Shopware.Component.registerOverrideComponent`.
- `twigjs`: makes `*.html.twig` files loadable by Vite.

## Essential identifiers

- `vite.config.mts`, `plugins.vite.ts`, `var/plugins.json`, `sw-plugin-dev.json`
- `bundle:dump` / `Shopware\Core\Framework\Plugin\Command\BundleDumpCommand`
- `composer build:js:admin`, `composer watch:admin`
- `pentatrion_vite`, `vite-plugin-symfony`, `shopware-vite-plugin-*`

## Gotchas

- HMR only reloads `*.vue` files. Full HMR benefit needs components migrated to SFCs.
- Webpack config migrations can vary a lot. The alias example is the minimal case.
- The source says the setup could be tested via the feature flag `ADMIN_VITE`. That flag no longer exists in 6.7.15.1, where Vite is the build.
- The source names an entry file `src/index.vite.ts`, a `*.vite.ts` duplicate. In 6.7.15.1 the Administration entry is `src/index.ts`, and no `index.vite.ts` exists under `src`.

## Version notes

- 6.7: Vite replaces Webpack for the Administration build. The source reports a core build of about 18s, more than 50% faster than Webpack.

## Code check (6.7.15.1)
- absent `ADMIN_VITE` — no feature flag of that name anywhere in the installed code
- confirmed `BundleDumpCommand` — console command class in `Shopware\Core\Framework\Plugin\Command` — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:20
- confirmed `bundle:dump` — command name; aliases `administration:dump:plugins`, `administration:dump:bundles` — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:16
- confirmed `var/plugins.json` — default `dumpFilePath` argument — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:37
- confirmed `sw-plugin-dev.json` — fetched by `loadPlugins()` in development mode — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:626
- confirmed `plugins.vite.ts` — referenced as the source of dev plugin metadata — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:629
- confirmed `registerOverrideComponent` — `Shopware.Component` hook marked @private — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:159
- confirmed `Vue` — exposed as `Shopware.Vue` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:231
- unverified `index.vite.ts` — not present under administration `src`; entry is `src/index.ts`
- unverified `vite.config.mts` — lives outside the administration `src` root, out of scope
