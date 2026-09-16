---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/build-w-o-db.md
title: Building Without Database
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/build-w-o-db.html
sourceHash: 26576c0e83516e4381043895c01fc3c26611bb0d
codeCheckedAgainst: "6.7.13.0"
keywords: ["build without database", "ComposerPluginLoader", "StaticFileConfigLoader", "StaticFileAvailableThemeProvider", "MD5ThemePathBuilder", "bin/ci", "bundle:dump", "theme:dump", "cache:clear:all", "DbalKernelPluginLoader", "theme-config", "ci asset build", "config_loader_id", "SHOPWARE_SKIP_THEME_COMPILE"]
summary: Build Administration and Storefront assets in CI without a DB - bin/ci with ComposerPluginLoader, bundle:dump, theme:dump plus StaticFileConfigLoader config.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/filesystem.md"]
---
## What it is

How to prebuild Administration and Storefront assets in a CI job that has no database access. Shopware normally reads installed extensions and theme variables from the database; this guide replaces both lookups with Composer-based plugin discovery and statically dumped theme config files. Requires Shopware 6.4.4.0 or higher.

## When to use

When a CI pipeline builds deployable artifacts (admin bundles, storefront JS/CSS) without access to the production database, or when debugging why extensions are missing from a database-less admin build or why cache directories differ between CI and web requests.

## Key steps / config

### Administration without database

1. Require every extension via Composer (`composer req [package/name]`); only Composer-required plugins are found by the `ComposerPluginLoader`, which marks each one active.
2. Use the project file `bin/ci` (uses `ComposerPluginLoader`) instead of `bin/console`, e.g. `bin/ci bundle:dump` to dump plugin bundles for the Administration.
3. Set `CI=1` so the `bin/*.js` scripts call `bin/ci` instead of `bin/console`.

Without this, the Administration is built without extensions when no DB connection exists.

### Storefront without database

1. On a system with a working database, dump the theme config with `bin/console theme:dump` (also written automatically when theme settings change or a theme is assigned). Files go to the private filesystem, local folder `files/theme-config` by default; share it across deployments, e.g. via an [S3 storage adapter](platform/dev/6.7/guides/hosting/infrastructure/filesystem.md).
2. Copy the dumped files to the database-less setup.
3. Create `config/packages/storefront.yaml`:

```yaml
storefront:
    theme:
        config_loader_id: Shopware\Storefront\Theme\ConfigLoader\StaticFileConfigLoader
        available_theme_provider: Shopware\Storefront\Theme\ConfigLoader\StaticFileAvailableThemeProvider
        theme_path_builder_id: Shopware\Storefront\Theme\MD5ThemePathBuilder
```

The installed defaults of these three keys are `DatabaseConfigLoader`, `SeedingThemePathBuilder` and `DatabaseAvailableThemeProvider`.

Dumped file layout in `files/theme-config`:

```text
index.json        {"<salesChannelId>":"<themeId>"}
<themeId>.json    {"extensions":[],"themeConfig":{"fields":{...}},"name":...,
                   "styleFiles":[...],"scriptFiles":[...],"viewInheritance":[...],
                   "technicalName":...}
```

### Partial Storefront build

Build only the JS bundle in CI (no loader change needed):

`CI=1 SHOPWARE_SKIP_THEME_COMPILE=true PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true shopware-cli project storefront-build`

Then run `bin/console theme:dump` on production once the database is available (also happens automatically when theme variables change in the Administration).

### Cache clearing

Use `cache:clear:all` instead of `cache:clear` in deployment scripts (see Gotchas).

## Essential identifiers

- `Shopware\Storefront\Theme\ConfigLoader\StaticFileConfigLoader`
- `Shopware\Storefront\Theme\ConfigLoader\StaticFileAvailableThemeProvider`
- `Shopware\Storefront\Theme\MD5ThemePathBuilder`
- `storefront.theme.config_loader_id`, `storefront.theme.available_theme_provider`, `storefront.theme.theme_path_builder_id`
- `ComposerPluginLoader`, `DbalKernelPluginLoader`
- `bin/ci`, `bundle:dump`, `theme:dump`, `cache:clear:all`
- `files/theme-config/index.json`
- env: `CI`, `SHOPWARE_SKIP_THEME_COMPILE`, `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`

## Gotchas

- You still need a dumped configuration from a system with a working database; the static loader cannot generate it.
- Database error warnings can still appear during the static build; they are caught and can be ignored.
- The kernel cache directory name contains a hash of active plugins and their versions. `ComposerPluginLoader` treats all Composer plugins as active, while `DbalKernelPluginLoader` (web requests) only counts plugins with `active = 1` and an install date. If any plugin is inactive in the DB, web requests use a different cache directory than one warmed via `bin/ci` — hence `cache:clear:all`.

## Version notes

- Minimum Shopware 6.4.4.0.
- The dumped `<themeId>.json` shape differs: the "Since v6.7.1.0" example has field entries without `label`/`helpText` and no `themeConfig.blocks` map; the "Before v6.8.0.0" example still carries labels, help texts and blocks.

## Code check (6.7.13.0)
- confirmed `ComposerPluginLoader` — extends KernelPluginLoader; every Composer plugin gets active true — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:15
- confirmed `DbalKernelPluginLoader` — active only when DB active = 1 and installed_at set — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/DbalKernelPluginLoader.php:13
- confirmed `Kernel::getCacheHash()` — hashes active plugin names/versions into the cache dir name — vendor/shopware/core/Kernel.php:296
- confirmed `config_loader_id` — default DatabaseConfigLoader — vendor/shopware/storefront/DependencyInjection/Configuration.php:26
- confirmed `theme_path_builder_id` — default SeedingThemePathBuilder — vendor/shopware/storefront/DependencyInjection/Configuration.php:27
- confirmed `StaticFileConfigLoader` — reads theme-config/<themeId>.json from the private filesystem — vendor/shopware/storefront/Theme/ConfigLoader/StaticFileConfigLoader.php:15
- confirmed `StaticFileAvailableThemeProvider::THEME_INDEX` — value theme-config/index.json — vendor/shopware/storefront/Theme/ConfigLoader/StaticFileAvailableThemeProvider.php:14
- confirmed `bundle:dump` — core command — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:14
- confirmed `theme:dump` — storefront command — vendor/shopware/storefront/Theme/Command/ThemeDumpCommand.php:29
- confirmed `cache:clear:all` — clears all pools and removes old cache directories — vendor/shopware/core/Framework/Adapter/Command/CacheClearAllCommand.php:14
