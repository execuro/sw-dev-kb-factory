---
id: platform/dev/6.6/products/cli/extension-commands/build.md
title: Building extensions and creating archives
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/extension-commands/build.html
sourceHash: 7d4f8a9d7deb67820780aeb8b5c0beaa1ad79a91
keywords: ["shopware-cli extension build", "shopware-cli extension zip", "shopware-extension.yml", "getAdditionalBundles", "shopware-bundle-name", "enable_es_build_for_admin", "enable_es_build_for_storefront", "SHOPWARE_PROJECT_ROOT", "composer run watch", "npm_strict", "release mode", "changelog generation"]
summary: shopware-cli extension build compiles assets; extension zip packages an extension archive, both configurable via .shopware-extension.yml.
lastBuilt: "2026-09-15"
---
## What it is

This page documents `shopware-cli extension build` (compiling an extension's PHP/JS/CSS assets) and `shopware-cli extension zip` (packaging a release archive), along with the `.shopware-extension.yml` options that control the process.

## When to use

Use `extension build` to release an extension to the Shopware Store or upload it without needing to rebuild Storefront/Administration; use `extension zip` to produce a distributable archive.

## Key steps / config

Build an extension:

```bash
shopware-cli extension build <path>
```

Shopware CLI reads the `shopware/core` requirement from `composer.json` or `manifest.xml` and builds using the lowest compatible Shopware version, unless overridden:

```yaml
# .shopware-extension.yml
build:
  shopwareVersionConstraint: '6.6.9.0'
```

For extra bundles (via `getAdditionalBundles`):

```yaml
build:
  extraBundles:
    - path: src/Foo
    - path: src/Foo
      name: Foo
```

An extension that is itself a bundle needs composer `"type": "shopware-bundle"` and `"extra": { "shopware-bundle-name": "MyBundle" }`.

Use esbuild for faster JS bundling (works standalone, without the Shopware codebase):

```yaml
build:
  zip:
    assets:
      enable_es_build_for_admin: true
      enable_es_build_for_storefront: true
```

Create an archive:

```bash
shopware-cli extension zip <path>
```

By default the latest released git tag is used; disable with `--disable-git`, or pin with `--git-commit`.

Other `.shopware-extension.yml` options: disable composer bundling (`build.zip.composer.enabled: false`), exclude extra files (`build.zip.pack.excludes.paths`), `npm_strict: true` for JS build optimization, and `changelog.enabled: true` with `pattern`/`variables`/`template` for changelog generation.

Overwrite fields during zipping:

```bash
shopware-cli extension zip --overwrite-version=1.0.0 <path>
shopware-cli extension zip --overwrite-app-backend-url=https://example.com <path>
shopware-cli extension zip --overwrite-app-backend-secret=MySecret <path>
```

Release mode (`--release`) removes the App secret from `manifest.xml` and can generate changelogs.

## Essential identifiers

- `shopware-cli extension build <path>`
- `shopware-cli extension zip <path>`
- `.shopware-extension.yml`
- `SHOPWARE_PROJECT_ROOT` (env var to point at an existing Shopware project for the build)
- `--disable-git`, `--git-commit`, `--release`, `--overwrite-version`, `--overwrite-app-backend-url`, `--overwrite-app-backend-secret`

## Gotchas

- Building with esbuild works completely standalone: files imported from Shopware must be copied into the extension.
- Before Shopware 6.5, bundling composer dependencies into the zip was required; this is automatically disabled for plugins targeting 6.5+, where `executeComposerCommands` should be used instead.
- `shopware-cli project ci` automatically detects a bundle-type extension and builds its assets too.
