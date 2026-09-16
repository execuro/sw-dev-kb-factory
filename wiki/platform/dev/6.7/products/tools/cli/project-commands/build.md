---
id: platform/dev/6.7/products/tools/cli/project-commands/build.md
title: Build a Complete Project
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/build.html
sourceHash: "7b50d926371ee2d5bebb14e017dff7314d02329d"
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project ci", ".shopware-project.yml", "build.hooks", "build.mjml", "build.bundles", "compatibility_date", "sbom.cdx.json", "SHOPWARE_PACKAGES_TOKEN", "extra.shopware-bundles", "shopware-bundle", "browserslist", "deployment artifact", "ci build", "software bill of materials"]
summary: "shopware-cli project ci builds a deployable artifact: composer install, assets, cleanup, SBOM; .shopware-project.yml build config, hooks, MJML, bundles."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/sbom.md"]
---
## What it is

`shopware-cli project ci <path>` prepares a Shopware project for deployment in one step: installs Composer dependencies, compiles required assets, removes files not needed in the artifact, and writes an SBOM. Build behavior is configured in `.shopware-project.yml`.

## When to use

After cloning a project repository in CI, PaaS/SaaS pipelines or a Docker build, to produce a deployable artifact with dependencies and compiled assets.

## Key steps / config

```bash
shopware-cli project ci <path>
```

What it does:
- `composer install` (production only by default; `--with-dev-dependencies` includes dev).
- Compiles missing extension assets (skips rebuilds), merges extension snippets for the Administration.
- Removes `node_modules`, source files of compiled assets, etc.
- Generates a CycloneDX 1.7 SBOM `sbom.cdx.json` from `composer.lock` (for SBOM only, use [`shopware-cli project sbom`](platform/dev/6.7/products/tools/cli/project-commands/sbom.md)).
- Outside CI it refuses to run with uncommitted Git changes unless `--force` is passed. CI environments are auto-detected.

Private repositories: set `SHOPWARE_PACKAGES_TOKEN` for packages.shopware.com; for others add `auth.json` to the project root or set `COMPOSER_AUTH`.

`.shopware-project.yml` shape (not exhaustive):

```yaml
compatibility_date: '2026-02-11'
build:
  browserslist: 'defaults'
  cleanup_paths: ['node_modules']
  disable_asset_copy: false        # skip bin/console assets:install at end
  exclude_extensions: ['SwagExample']
  keep_extension_source: false
  keep_source_maps: false
  remove_extension_assets: false   # remove extension assets after assets:install
  force_extension_build: [{ name: 'SomePlugin' }]
  bundles: [{ path: src/MyBundle }, { path: src/MyFancyBundle, name: MyGreatFancyBundle }]
  mjml: { enabled: false, search_paths: [custom/plugins, custom/static-plugins] }
  hooks: { pre: [], pre-composer: [], post-composer: [], pre-assets: [], post-assets: [], post: [] }
```

MJML (for FroshPlatformTemplateMail; needs npm `mjml` in the build env): with `build.mjml.enabled: true`, each `html.mjml` under `search_paths` (default `custom/plugins`, `custom/static-plugins`) is compiled to `html.twig` and the `.mjml` removed; failures are logged, left as `html.mjml`, and the build continues.

Hooks: `pre`, `pre-composer`, `post-composer`, `pre-assets`, `post-assets`, `post`. Each is an array of shell commands run sequentially with `sh -c`; a non-zero exit fails the build. `PROJECT_ROOT` (absolute project root) is set; parent env vars (e.g. `SHOPWARE_PACKAGES_TOKEN`) are inherited.

`compatibility_date` (`YYYY-MM-DD`): opts into CLI behavior changes rolled out on or before that date. Missing → fallback `2026-02-11` plus a warning.

Custom bundles (classes extending Shopware's bundle class) are not auto-detected, since the CLI does not execute PHP; declare them in `build.bundles` (`path` relative to project root, `name` defaults to directory basename). A bundle shipped as its own Composer package uses:

```json
{ "type": "shopware-bundle", "extra": { "shopware-bundle-name": "MyBundle" } }
```

This also enables `shopware-cli extension build` for it.

Docker build pattern: `FROM ghcr.io/shopware/shopware-cli:latest-php-8.3 AS shopware-cli`, `ARG SHOPWARE_PACKAGES_TOKEN`, then `RUN --mount=type=secret,id=composer_auth,dst=/src/auth.json ... /usr/local/bin/entrypoint.sh shopware-cli project ci /src`, and copy `/src` into `ghcr.io/shopware/docker-base:8.3` at `/var/www/html` with `--chown=82`.

## Essential identifiers

- `shopware-cli project ci`, `--with-dev-dependencies`, `--force`
- `.shopware-project.yml`: `compatibility_date`, `build.browserslist`, `build.cleanup_paths`, `build.disable_asset_copy`, `build.exclude_extensions`, `build.keep_extension_source`, `build.keep_source_maps`, `build.remove_extension_assets`, `build.force_extension_build`, `build.bundles`, `build.mjml`, `build.hooks`
- `sbom.cdx.json`, `SHOPWARE_PACKAGES_TOKEN`, `COMPOSER_AUTH`, `PROJECT_ROOT`
- Composer type `shopware-bundle`, `extra.shopware-bundle-name`

## Gotchas

- The command modifies the target directory and deletes files — commit first.
- `extra.shopware-bundles` in `composer.json` is deprecated (still supported, emits a warning); both sources are merged and a duplicate path is processed once.
- The docs name the Shopware asset command `asset:install`; the installed core command is `assets:install`.

## Code check (6.7.13.0)
- corrected `assets:install` — docs: `bin/console asset:install` — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:22
- confirmed `Bundle` — Shopware's bundle base class that custom bundles extend — vendor/shopware/core/Framework/Bundle.php:32
- confirmed `custom/plugins` — core default plugin directory, matching the MJML default search path — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
- confirmed `PROJECT_ROOT` — env var also honored by core's kernel factory — vendor/shopware/core/Framework/Adapter/Kernel/KernelFactory.php:76
- unverified `shopware-bundle` — Composer type not referenced in vendor/shopware/core; handled by shopware-cli
- unverified `project ci` — implemented in shopware-cli (Go), out of scope
- unverified `compatibility_date` — shopware-cli config key, out of scope
- unverified `build.hooks` — shopware-cli config key, out of scope
- unverified `extra.shopware-bundles` — shopware-cli deprecation, out of scope
- unverified `secrets:decrypt-to-local` — Symfony command, vendor/symfony out of scope
