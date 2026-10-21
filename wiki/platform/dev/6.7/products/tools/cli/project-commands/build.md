---
id: platform/dev/6.7/products/tools/cli/project-commands/build.md
title: Build a Complete Project
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/build.html
sourceHash: 622971db3dd581b74c988e4041247fed22b42520
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project ci", ".config/shopware-project.yml", "build.hooks", "build.bundles", "build.mjml", "compatibility_date", "extra.shopware-bundles", "shopware-bundle", "SHOPWARE_PACKAGES_TOKEN", "sbom.cdx.json", "deployment artifact", "build hooks", "browserslist", "ci build"]
summary: shopware-cli project ci builds a deploy artifact (composer install, assets, cleanup, SBOM), configured in .config/shopware-project.yml
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/sbom.md"]
---
## What it is

`shopware-cli project ci <path>` prepares a cloned Shopware project for deployment in one step: installs Composer dependencies, compiles required assets, removes files not needed in the artifact and generates an SBOM. Its behavior is configured in `.config/shopware-project.yml`.

## When to use

Building a deployment artifact or Docker image in CI, PaaS or SaaS workflows, or locally before shipping a release.

## Key steps / config

```bash
shopware-cli project ci <path>
```

What it does:

- `composer install` — production dependencies only unless `--with-dev-dependencies`.
- Compiles only missing extension assets.
- Removes unneeded files (e.g. `node_modules`) and the sources of compiled assets.
- Merges extension snippets for the Administration.
- Writes a CycloneDX 1.7 SBOM `sbom.cdx.json` from `composer.lock` (SBOM only: [`shopware-cli project sbom`](platform/dev/6.7/products/tools/cli/project-commands/sbom.md)).

Outside CI it refuses to run with uncommitted Git changes; `--force` overrides. CI environments are detected automatically.

Private repositories: set `SHOPWARE_PACKAGES_TOKEN` for `packages.shopware.com`; for others add `auth.json` to the project root or set `COMPOSER_AUTH` to its contents.

`.config/shopware-project.yml` skeleton (not exhaustive):

```yaml
compatibility_date: '2026-02-11'
build:
  browserslist: 'defaults'
  cleanup_paths: ['node_modules']
  disable_asset_copy: false      # skip bin/console assets:install at the end
  exclude_extensions: ['SwagExample']
  keep_extension_source: false
  keep_source_maps: false
  remove_extension_assets: false # drop extension assets after assets:install, keep only public/
  force_extension_build: [{ name: 'SomePlugin' }]
  bundles: [{ path: src/MyBundle }, { path: src/MyFancyBundle, name: MyGreatFancyBundle }]
  mjml: { enabled: false, search_paths: [custom/plugins, custom/static-plugins] }
  hooks: { pre: [], pre-composer: [], post-composer: [], pre-assets: [], post-assets: [], post: [] }
```

Build hooks — arrays of shell commands run sequentially with `sh -c`; any non-zero exit fails the build:

| Hook | Runs |
|---|---|
| `pre` | before the build |
| `pre-composer` / `post-composer` | around `composer install` |
| `pre-assets` / `post-assets` | around asset building |
| `post` | after the whole build |

Hooks get `PROJECT_ROOT` (absolute project root) and inherit the parent environment (e.g. `SHOPWARE_PACKAGES_TOKEN`).

MJML (for FroshPlatformTemplateMail projects; needs the npm `mjml` package in the build environment): with `build.mjml.enabled: true`, each `html.mjml` under `search_paths` (default `custom/plugins`, `custom/static-plugins`) is compiled to `html.twig` and the `html.mjml` removed; failures are logged, the file is kept, the build continues.

Custom bundles (classes extending Shopware's bundle class) cannot be auto-detected because the CLI does not execute PHP; declare them under `build.bundles` (`path` relative to project root, optional `name` defaulting to the directory basename). A bundle shipped as its own Composer package uses:

```json
{ "type": "shopware-bundle", "extra": { "shopware-bundle-name": "MyBundle" } }
```

and can then be built with `shopware-cli extension build`.

Docker build stage (excerpt):

```dockerfile
FROM ghcr.io/shopware/shopware-cli:latest-php-8.3 AS build
ARG SHOPWARE_PACKAGES_TOKEN
RUN --mount=type=secret,id=composer_auth,dst=/src/auth.json \
 /usr/local/bin/entrypoint.sh shopware-cli project ci /src
```

The result is copied (`--chown=82`) onto `ghcr.io/shopware/docker-base:8.3` at `/var/www/html`.

## Essential identifiers

- `shopware-cli project ci`, `--with-dev-dependencies`, `--force`
- `.config/shopware-project.yml`, `compatibility_date`, `build.hooks`, `build.bundles`, `build.mjml`
- `shopware-bundle`, `shopware-bundle-name`
- `SHOPWARE_PACKAGES_TOKEN`, `COMPOSER_AUTH`, `PROJECT_ROOT`, `sbom.cdx.json`
- `assets:install`

## Gotchas

- The command modifies the target directory and deletes files — commit first.
- `compatibility_date` (`YYYY-MM-DD`) gates new/breaking CLI behavior; if missing, `2026-02-11` is used and a warning is logged.
- `extra.shopware-bundles` in `composer.json` is deprecated (still supported, emits a deprecation warning); migrate to `build.bundles`. Both sources are merged and a path in both is processed once.
- The source's config comments name the console command `asset:install`; the installed core registers it as `assets:install`.

## Version notes

- Declaring bundles via `extra.shopware-bundles` in `composer.json` is deprecated in favor of `build.bundles` in `.config/shopware-project.yml`.

## Code check (6.7.15.1)
- corrected `assets:install` — docs: `bin/console asset:install` — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:23
- confirmed `Bundle` — Shopware's abstract bundle base class custom bundles extend — vendor/shopware/core/Framework/Bundle.php:33
- confirmed `Plugin` — plugins extend the same bundle base, hence auto-detectable as plugins — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `custom/static-plugins` — static plugin directory known to core — vendor/shopware/core/TestBootstrapper.php:341
- confirmed `PROJECT_ROOT` — env var core also reads as project dir — vendor/shopware/core/Framework/Adapter/Kernel/KernelFactory.php:83
- unverified `shopware-cli project ci` — Go CLI command, outside the Shopware package roots
- unverified `shopware-bundle` — Composer type handled by shopware-cli; not present in core PHP, out of scope
- unverified `extra.shopware-bundles` — shopware-cli composer.json convention, out of scope
- unverified `compatibility_date` — shopware-cli project config key, out of scope
- unverified `build.hooks` — shopware-cli project config key, out of scope
