---
id: platform/dev/6.7/products/tools/cli/extension-commands/build.md
title: Building Extensions and Creating Archives
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/extension-commands/build.html
sourceHash: d0992371d1c1c9ee6d6dbfe86a0f44fa82ab1b69
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli extension build", "shopware-cli extension package", "shopwareVersionConstraint", "extraBundles", "enable_es_build_for_admin", "npm_strict", "checksum.json", "SHOPWARE_PROJECT_ROOT", "--release", "getAdditionalBundles", "shopware-bundle", "esbuild", "extension zip archive", "build assets"]
summary: shopware-cli extension build/package compile extension assets and create a store-ready ZIP; build/zip/changelog keys in .config/shopware-extension.yml.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/configuration.md"]
---
## What it is

Shopware CLI commands to compile an extension's Administration/Storefront assets (`shopware-cli extension build`) and to produce a distributable ZIP (`shopware-cli extension package`), so the extension can be uploaded to the Shopware Store or a shop without rebuilding Storefront and Administration there. Options live in `.config/shopware-extension.yml` (see [configuration file lookup](platform/dev/6.7/products/tools/cli/configuration.md)).

## When to use

Before releasing an extension, in CI pipelines that build ZIPs, or when an extension has multiple bundles, is itself a bundle, or needs faster esbuild-based bundling.

## Key steps / config

1. Build assets: `shopware-cli extension build <path>`. The CLI reads the `shopware/core` requirement from `composer.json` or `manifest.xml` and builds against the lowest compatible Shopware version. Override (build only, not installation) with `build.shopwareVersionConstraint`, or set `SHOPWARE_PROJECT_ROOT` to an existing Shopware project to build with that installation.
2. Multiple bundles (plugin implements `getAdditionalBundles`): list them under `build.extraBundles` (`path`, optional `name`; name defaults to the directory name).
3. Extension that is a bundle: Composer `type` `shopware-bundle` plus `extra.shopware-bundle-name`; `shopware-cli project ci` then detects and builds it too.
4. Package: `shopware-cli extension package <path>` copies to a temp dir, builds assets, deletes unneeded files, zips into the current directory. Uses the latest git tag by default; `--disable-git` uses the working tree, `--git-commit` picks a tag/commit.
5. Release build: `shopware-cli extension package <path> --release` strips secrets and generates the changelog when `changelog.enabled: true`.
6. Overwrites: `--overwrite-version=1.0.0`, `--overwrite-app-backend-url=https://example.com`, `--overwrite-app-backend-secret=MySecret`.

```yaml
# .config/shopware-extension.yml
build:
  shopwareVersionConstraint: '6.6.9.0'
  extraBundles:
    - path: src/Foo
      name: Foo
  zip:
    assets: { enable_es_build_for_admin: true, enable_es_build_for_storefront: true, npm_strict: true }
    composer: { enabled: false }
    pack: { excludes: { paths: [<path>] } }
    checksum: { ignore: [src/Resources/config/services.php] }
changelog:
  enabled: true
  pattern: '^NEXT-\d+'
  variables: { ticket: '^(NEXT-\d+)\s' }
  template: <go template looping over .Commits>
```

## Essential identifiers

- `shopware-cli extension build`, `shopware-cli extension package`, `shopware-cli project ci`
- `build.zip.checksum.ignore`, `checksum.json`, `changelog.template`
- `--release`, `--disable-git`, `--git-commit`

## Gotchas

- esbuild builds run fully standalone: anything you import from Shopware must be copied into the extension.
- With esbuild, hashed `<name>-<hash>.js` files are emitted next to unhashed ones; an existing `.vite/manifest.json` is overwritten on each build.
- `npm_strict` requires runtime packages in `dependencies` and tooling in `devDependencies`; it then skips needless `npm install`/`npm ci`.
- Composer dependency bundling is automatically off for plugins targeting 6.5+; use `executeComposerCommands` instead.

## Version notes

- Shopware 6.7+: `.vite/manifest.json` and `.vite/entrypoints.json` reference the hashed esbuild files, so caches invalidate automatically. Below 6.7 the unhashed files are still loaded.
- Before 6.5, bundling Composer dependencies into the ZIP was required.

## Code check (6.7.15.1)
- confirmed `Plugin::executeComposerCommands()` — defaults to false; true makes Shopware run `composer require` on install — vendor/shopware/core/Framework/Plugin.php:92
- confirmed `Bundle::getAdditionalBundles()` — returns `[]` by default, overridden to register extra bundles — vendor/shopware/core/Framework/Bundle.php:101
- confirmed `manifest.xml` — a ZIP is detected as an app if its top-level folder holds `manifest.xml` — vendor/shopware/core/Framework/Plugin/PluginZipDetector.php:62
- confirmed `composer.json` — a ZIP is a plugin if the top-level folder has `composer.json` and no `manifest.xml` — vendor/shopware/core/Framework/Plugin/PluginZipDetector.php:45
- unverified `shopware-cli extension package` — Go-based shopware-cli, out of scope of vendor/shopware
- unverified `shopwareVersionConstraint` — shopware-cli config key, out of scope
- unverified `enable_es_build_for_admin` — shopware-cli config key, out of scope
- unverified `SHOPWARE_PROJECT_ROOT` — read by shopware-cli; not found in vendor/shopware roots
- unverified `shopware-bundle-name` — composer extra read by shopware-cli; not found in vendor/shopware core
