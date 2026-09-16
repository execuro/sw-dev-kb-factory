---
docType: developer
id: platform/dev/6.6/guides/hosting/installation-updates/deployments/build-w-o-db.md
sourceHash: e6605050847d95b1ea74e2639a86b4183c016a35
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/installation-updates/deployments/build-w-o-db.html
title: Building without Database
version: "6.6"
versions: ["6.6"]
keywords: ["build without database", "ComposerPluginLoader", "bin/ci", "bundle:dump", "theme:dump", "StaticFileConfigLoader", "StaticFileAvailableThemeProvider", "MD5ThemePathBuilder", "static file config loader", "theme compiler", "storefront theme build", "administration build", "files/theme-config"]
summary: "How to prebuild Administration and Storefront assets in CI without a database connection, using ComposerPluginLoader and static dumped theme config."
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to prebuild Administration and Storefront assets in a CI job that has no access to the production database, using static dumped files instead of live database lookups. It requires Shopware 6.4.4.0 or higher.

## When to use

Use this when a CI job builds deployment artifacts but cannot reach the production database to look up installed extensions or theme variables.

## Key steps / config

Administration: all extensions must be required via Composer to be loaded by `ComposerPluginLoader`, installed with `composer req [package/name]`. The file `bin/ci` uses `ComposerPluginLoader` (use it instead of `bin/console` in `bin/*.js` scripts, or set env var `CI=1`). Dump plugins for the Administration with:

```
bin/ci bundle:dump
```

Storefront: dump theme variables from a system with database access using `bin/console theme:dump` (also happens automatically when theme settings change), then copy the dumped files (found under `files/theme-config`) to the database-less build environment. Switch the loader by creating `config/packages/storefront.yaml`:

```yaml
storefront:
    theme:
        config_loader_id: Shopware\Storefront\Theme\ConfigLoader\StaticFileConfigLoader
        available_theme_provider: Shopware\Storefront\Theme\ConfigLoader\StaticFileAvailableThemeProvider
        theme_path_builder_id: Shopware\Storefront\Theme\MD5ThemePathBuilder
```

The dumped directory contains an `index.json` mapping a hash to a per-theme JSON config file (e.g. `a729322c1f4e4b4e851137c807b4f363.json`) with keys like `extensions`, `themeConfig`, `name`, `author`, `isTheme`, `styleFiles`, `scriptFiles`, `basePath`, `assetPaths`, `viewInheritance`, `technicalName`.

To build just the JavaScript bundle without the loader switch, run in CI:

```
CI=1 SHOPWARE_SKIP_THEME_COMPILE=true PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true bin/build-storefront.sh
```

Then run `bin/console theme:dump` afterward on the production system once the database is available.

## Essential identifiers

- `ComposerPluginLoader`
- `bin/ci` / `bin/ci bundle:dump`
- `bin/console theme:dump`
- `Shopware\Storefront\Theme\ConfigLoader\StaticFileConfigLoader`
- `Shopware\Storefront\Theme\ConfigLoader\StaticFileAvailableThemeProvider`
- `Shopware\Storefront\Theme\MD5ThemePathBuilder`
- `config/packages/storefront.yaml`
- `files/theme-config`

## Gotchas

Database warnings can still occur during this process but are caught and should be ignored when running in this static-file mode. A dumped configuration from a system with a working database is still required as the source of the copied files.

## Version notes

This guide requires Shopware 6.4.4.0 or higher.
