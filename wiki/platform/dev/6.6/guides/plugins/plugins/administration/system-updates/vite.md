---
id: platform/dev/6.6/guides/plugins/plugins/administration/system-updates/vite.md
title: Changing from Webpack to Vite
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/system-updates/vite.html
sourceHash: 201c958e248fdd4a62a854053e276598c55ebca1
keywords: ["Vite", "Webpack", "vite.config.mts", "webpack.config.js", "ADMIN_VITE", "BundleDumpCommand", "bundle:dump", "build:js:admin", "watch:admin", "plugins.json", "shopware-vite-plugin", "pentatrion_vite", "vite-plugin-symfony", "entrypoints.json"]
summary: Roadmap for Shopware 6.7's switch from Webpack to Vite for building the Administration, and how to migrate a custom webpack config.
lastBuilt: 2026-09-15
---
## What it is
This page documents Shopware's planned switch, in 6.7, from Webpack to Vite for building the Vue.js Administration, and its implementation details.

## When to use
Use when a plugin defines its own `webpack.config.js` and needs to migrate it to Vite, or when investigating how Administration assets are built/served.

## Key steps / config
Apps are unaffected (build process already decoupled). For plugins with a custom webpack config:
1. Create `vite.config.mts` in `YourApp/src/Resources/app/administration/src` (previously `webpack.config.js` lived in `.../administration/build/`).
2. Remove the old `webpack.config.js`.
3. Remove webpack-related dependencies from `package.json`; add Vite dependencies.

```typescript
import { defineConfig } from 'vite';
export default defineConfig({
    resolve: { alias: { '@example': 'src/example' } },
});
```

Feature flag: `ADMIN_VITE`. Bundle metadata is written to `<shopwareRoot>/var/plugins.json` by `Shopware\Core\Framework\Plugin\Command\BundleDumpCommand`, triggerable via `php bin/console bundle:dump`, and is also part of `composer build:js:admin`/`build:js:storefront`/`watch:admin`/`watch:storefront`. Core build config lives at `<shopwareRoot>/src/Administration/Resources/app/administration/vite.config.mts`; extension builds run through `.../administration/build/plugins.vite.ts`. Dev mode uses `composer watch:admin`. Assets are loaded via the `pentatrion_vite` Symfony bundle and its `vite-plugin-symfony` counterpart, reading `entrypoints.json`; in dev mode the `shopware-vite-plugin-serve-multiple-static` plugin serves a `sw-plugin-dev.json` file.

Shopware's own Vite plugins (all prefixed `shopware-vite-plugin-`): `asset-path` (prepends `window.__sw__.assetPath` to chunk paths for cluster/S3 setups), `static-assets`, `serve-multiple-static`, `vue-globals` (aliases Vue imports to `Shopware.Vue`), `override-component` (auto-registers `*.override.vue` files via `Shopware.Component.registerOverrideComponent`), `twigjs` (transforms `*.html.twig` for Vite).

## Essential identifiers
- `vite.config.mts`, `webpack.config.js`
- `ADMIN_VITE` feature flag
- `Shopware\Core\Framework\Plugin\Command\BundleDumpCommand`, `bundle:dump`
- `composer build:js:admin`, `composer watch:admin`
- `pentatrion_vite`, `vite-plugin-symfony`, `entrypoints.json`

## Gotchas
Vite's HMR only reloads `*.vue` files, so full hot-reload benefits only apply once components are converted to Single File Components.

## Version notes
This switch to Vite is planned for Shopware 6.7; the source notes timelines and implementation details are subject to change.
