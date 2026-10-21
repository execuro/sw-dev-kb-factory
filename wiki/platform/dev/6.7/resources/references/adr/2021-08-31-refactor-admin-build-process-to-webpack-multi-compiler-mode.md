---
id: platform/dev/6.7/resources/references/adr/2021-08-31-refactor-admin-build-process-to-webpack-multi-compiler-mode.md
title: Refactor admin build process to webpack-multi-compiler mode
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-08-31-refactor-admin-build-process-to-webpack-multi-compiler-mode.html
sourceHash: 90abf3083fe52ec440c5164e7b1801ce8e1f9679
codeCheckedAgainst: "6.7.15.1"
keywords: ["webpack-multi-compiler", "webpack", "administration build", "plugin build isolation", "webpack.config.js", "BundleConfigGenerator", "bundle:dump", "tree-shaking", "custom webpack config", "watch mode", "admin plugin", "adr"]
summary: "ADR 2021-08-31: Administration build uses webpack multi-compiler mode, so each plugin is bundled in isolation from core and other plugins."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area: administration, 2021-08-31) that refactored the Administration build to webpack's multi-compiler mode: core and every plugin are built as separate, independent webpack configurations instead of one combined program.

## When to use

When building Administration code for a plugin, adding a custom webpack configuration to a plugin, or investigating why a plugin's prebuilt files once only worked when built together with the core.

## Key steps / config

- Nothing changes for plugin developers: the refactoring is backward compatible, and watch mode works as before.
- Each plugin is compiled completely isolated and cannot modify or affect other plugins or the core.
- A plugin may customize its own webpack configuration freely. In 6.7.15.1 the core detects it per bundle at `Resources/app/administration/build/` as `webpack.config.ts`, `webpack.config.cts`, `webpack.config.js` or `webpack.config.cjs` (first match wins), and records it under the bundle's `administration.webpack` key in the generated bundle config (`bin/console bundle:dump`).

```php
'administration' => [
    'path' => 'Resources/app/administration/src',
    'entryFilePath' => ..., // main.js or main.ts
    'webpack' => ...,       // build/webpack.config.* or null
],
```

## Essential identifiers

- webpack multi-compiler mode
- `Resources/app/administration/build/webpack.config.js` (also `.ts`, `.cts`, `.cjs`)
- `Shopware\Core\Framework\Plugin\BundleConfigGenerator`
- `bundle:dump`

## Gotchas

- Previous problem: webpack treated core plus plugins as one program, so tree-shaking removed or added dependencies depending on which plugins were installed, and a plugin's custom webpack config was applied to the core too. Plugins built that way could break on systems that only had their built files.
- Webpack was kept rather than switching bundlers, because it is widely known and already in use; a switch would have required deep analysis and forced all plugin developers to learn a new bundler.

## Code check (6.7.15.1)
- confirmed `administration.webpack` — per-bundle admin webpack config entry — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:80
- confirmed `BundleConfigGenerator::getWebpackConfig()` — resolves the plugin's custom config file — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:141
- confirmed `webpack.config.ts` — checked first under `build/` — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:147
- confirmed `webpack.config.js` — checked under `build/` — vendor/shopware/core/Framework/Plugin/BundleConfigGenerator.php:149
- confirmed `bundle:dump` — command that dumps the bundle config — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:16
- unverified `webpack-multi-compiler` — Administration build scripts live outside the checked `src` root
