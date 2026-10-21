---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/build-w-o-db.md
title: Building Without Database
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/build-w-o-db.html
sourceHash: 26576c0e83516e4381043895c01fc3c26611bb0d
codeCheckedAgainst: "6.7.15.1"
keywords: ["ComposerPluginLoader", "StaticFileConfigLoader", "StaticFileAvailableThemeProvider", "MD5ThemePathBuilder", "bin/ci", "bundle:dump", "theme:dump", "cache:clear:all", "files/theme-config", "config_loader_id", "ci build without database", "prebuild assets", "static theme config"]
summary: Build Administration and Storefront assets in CI without a database via bin/ci, ComposerPluginLoader, theme:dump and StaticFileConfigLoader.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/filesystem.md"]
---
## What it is

How to prebuild Administration and Storefront assets in a CI job that has no access to the production database. Shopware normally reads installed extensions and theme variables from the database; this setup replaces both lookups with Composer metadata and statically dumped theme config files. All extensions must be required via Composer so the `ComposerPluginLoader` can load them. The guide states it requires Shopware 6.4.4.0 or higher.

## When to use

- A CI pipeline builds deployment artifacts (compiled admin JS, storefront theme) before shipping them to production.
- The build environment cannot reach the shop database.

## Key steps / config

### Administration

1. Require every plugin via Composer: `composer req [package/name]`. Without a database, Shopware otherwise builds the Administration without extensions.
2. Use `bin/ci` instead of `bin/console`. It uses `ComposerPluginLoader`, which reads plugins from installed Composer packages (Composer type `shopware-platform-plugin`, `extra.shopware-plugin-class`) and marks each one active.
3. Dump the plugin list for the Administration build: `bin/ci bundle:dump`.
4. Set `CI=1` so the `bin/*.js` build scripts call `bin/ci` instead of `bin/console`.

### Storefront

1. On a system **with** a working database, dump the theme variables: `bin/console theme:dump`. The dump also happens automatically when theme settings change or a theme is assigned. Files go to the private filesystem, by default the local folder `files/theme-config`. Share that folder across deployments, for example with an S3 storage adapter (see [filesystem](platform/dev/6.7/guides/hosting/infrastructure/filesystem.md)).
2. Copy the dumped files into the database-less build setup.
3. Switch the theme loaders to the static file implementations in `config/packages/storefront.yaml`:

```yaml
storefront:
    theme:
        config_loader_id: Shopware\Storefront\Theme\ConfigLoader\StaticFileConfigLoader
        available_theme_provider: Shopware\Storefront\Theme\ConfigLoader\StaticFileAvailableThemeProvider
        theme_path_builder_id: Shopware\Storefront\Theme\MD5ThemePathBuilder
```

Dumped files in `files/theme-config`: an `index.json` and one `<themeId>.json` per theme.

```json
{"<salesChannelId>": "<themeId>"}
```

Skeleton of `<themeId>.json` (6.7.1.0+ format):

```json
{
  "themeConfig": { "fields": { "sw-color-brand-primary": { "type": "color", "value": "...", "editable": true, "block": "themeColors", "order": 100 } } },
  "name": "...", "technicalName": "...", "isTheme": true,
  "styleFiles": [{ "filepath": "@Storefront", "resolveMapping": [] }],
  "scriptFiles": [{ "filepath": "@Storefront", "resolveMapping": [] }],
  "basePath": "...", "assetPaths": ["..."], "viewInheritance": ["@Storefront", "@Plugins"], "iconSets": {}
}
```

### Partial Storefront build

Build only the JavaScript bundle in CI, without the static loaders:

`CI=1 SHOPWARE_SKIP_THEME_COMPILE=true PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true shopware-cli project storefront-build`

Then run `bin/console theme:dump` on production once the database is available.

## Essential identifiers

- `Shopware\Core\Framework\Plugin\KernelPluginLoader\ComposerPluginLoader`
- `Shopware\Core\Framework\Plugin\KernelPluginLoader\DbalKernelPluginLoader`
- `Shopware\Storefront\Theme\ConfigLoader\StaticFileConfigLoader`
- `Shopware\Storefront\Theme\ConfigLoader\StaticFileAvailableThemeProvider`
- `Shopware\Storefront\Theme\MD5ThemePathBuilder`
- `storefront.theme.config_loader_id`, `storefront.theme.available_theme_provider`, `storefront.theme.theme_path_builder_id`
- `bin/ci`, `bin/ci bundle:dump`, `bin/console theme:dump`, `cache:clear:all`
- `files/theme-config/index.json`

## Gotchas

- You still need a dumped config from a system with a working database. If the file is missing, `StaticFileConfigLoader` throws "Cannot find theme configuration. Did you run bin/console theme:dump".
- Database warnings can still occur during the build. They are caught and can be ignored.
- The cache directory hash is built from the active plugins and their versions. `ComposerPluginLoader` (used by `bin/ci`) treats every Composer-installed plugin as active. `DbalKernelPluginLoader` (used by web requests) reads the database `active` column. If any plugin is deactivated in the database, web requests use a different cache directory than the one `bin/ci` warmed. Use `cache:clear:all` instead of `cache:clear` in deployment scripts.

## Version notes

- The source shows two formats for the dumped theme file. Since 6.7.1.0, `themeConfig.fields` entries no longer carry `label`/`helpText` and there is no `blocks` map. The older format (tab labelled "Before v6.8.0.0") still includes them.

## Code check (6.7.15.1)
- confirmed `ComposerPluginLoader` — extends KernelPluginLoader, loads Composer plugin packages and sets each to active — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:15
- confirmed `DbalKernelPluginLoader` — reads the DB `active` column and `installed_at` — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/DbalKernelPluginLoader.php:13
- confirmed `Kernel::getCacheHash()` — hash skips inactive plugins, includes name and version — vendor/shopware/core/Kernel.php:316
- confirmed `StaticFileConfigLoader` — reads `theme-config/<themeId>.json` from the private filesystem — vendor/shopware/storefront/Theme/ConfigLoader/StaticFileConfigLoader.php:15
- confirmed `StaticFileAvailableThemeProvider::THEME_INDEX` — `theme-config/index.json` — vendor/shopware/storefront/Theme/ConfigLoader/StaticFileAvailableThemeProvider.php:14
- confirmed `MD5ThemePathBuilder` — class exists, extends AbstractThemePathBuilder — vendor/shopware/storefront/Theme/MD5ThemePathBuilder.php:14
- confirmed `storefront.theme.config_loader_id` — defaults to DatabaseConfigLoader; `theme_path_builder_id` and `available_theme_provider` sit next to it — vendor/shopware/storefront/DependencyInjection/Configuration.php:27
- confirmed `bundle:dump` — console command exists — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:16
- confirmed `theme:dump` — console command exists — vendor/shopware/storefront/Theme/Command/ThemeDumpCommand.php:30
- confirmed `cache:clear:all` — console command exists — vendor/shopware/core/Framework/Adapter/Command/CacheClearAllCommand.php:14
