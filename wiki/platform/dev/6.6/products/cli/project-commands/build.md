---
id: platform/dev/6.6/products/cli/project-commands/build.md
title: Build a complete Project
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/project-commands/build.html
sourceHash: e8a4ab8ccc5971c337ccd650a9c02322281489e7
keywords: ["shopware-cli", "project ci", "build", "composer install", "SHOPWARE_PACKAGES_TOKEN", "COMPOSER_AUTH", ".shopware-project.yml", "browserslist", "shopware-bundles", "shopware-bundle-name", "extension build", "asset:install"]
summary: "shopware-cli project ci <path> runs composer install, compiles missing assets and strips dev files for deployment builds."
lastBuilt: "2026-09-15"
---
## What it is

`shopware-cli project ci <path>` is a single command that prepares a Shopware project for deployment: it installs Composer dependencies, compiles missing extension assets, and removes unneeded files.

## When to use

Use it when deploying a project, instead of manually running `composer install` and compiling assets.

## Key steps / config

```bash
shopware-cli project ci <path>
```

This command modifies the given directory and deletes files, so commit all changes first. It runs `composer install` (production dependencies only, unless `--with-dev-dependencies` is passed), compiles only missing extension assets, deletes `node_modules` and similar files, deletes compiled-asset source code, and merges extension snippets to speed up the Administration.

Private Composer repositories: set `SHOPWARE_PACKAGES_TOKEN` for `packages.shopware.com`, or use an `auth.json` file / `COMPOSER_AUTH` environment variable for other repositories.

Reduce Storefront JavaScript polyfills by adjusting `browserslist` in `.shopware-project.yml`:

```yaml
build:
  browserslist: 'defaults'
```

Other `.shopware-project.yml` build options: `cleanup_paths`, `disable_asset_copy`, `exclude_extensions`, `keep_extension_source`, `keep_source_maps`, `remove_extension_assets`, `force_extension_build` (list of `{ name: '<Extension>' }`).

Custom bundles (classes extending Shopware's bundle class) must be declared in `composer.json`:

```json
{
  "extra": {
    "shopware-bundles": {
      "src/MyBundle": {}
    }
  }
}
```

Use a `name` key when the folder name doesn't match the bundle name, or declare `"type": "shopware-bundle"` with a `shopware-bundle-name` under `extra` for a bundle packaged as its own Composer package — this also enables `shopware-cli extension build` for it.

## Essential identifiers

- `shopware-cli project ci <path>`
- `--with-dev-dependencies`
- `SHOPWARE_PACKAGES_TOKEN`
- `COMPOSER_AUTH`
- `.shopware-project.yml`
- `shopware-bundles` / `shopware-bundle-name`

## Gotchas

`project ci` deletes files in the target directory (e.g. `node_modules`, compiled-asset sources); commit changes before running it. Custom bundles that Shopware CLI cannot auto-detect must be listed explicitly under `extra.shopware-bundles` in `composer.json`.
