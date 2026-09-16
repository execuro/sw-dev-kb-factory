---
id: platform/dev/6.7/products/tools/cli/extension-commands/configuration.md
title: Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/extension-commands/configuration.html
sourceHash: c90149eb5ff110b4af0f8725ac9a5d3b315285f3
codeCheckedAgainst: "6.7.13.0"
keywords: [".shopware-extension.yml", "compatibility_date", "shopware-cli extension config-schema", "SHOPWARE_PROJECT_ROOT", "SHOPWARE_CLI_PREVIOUS_TAG", "SHOPWARE_CLI_NO_SYMFONY_CLI", "SHOPWARE_CLI_DISABLE_WASM_CACHE", "CI_PROJECT_URL", "APP_ENV", "automatic_bugfix_version_compatibility", "extension config", "environment variables", "shopware-cli"]
summary: ".shopware-extension.yml options (build, zip.assets, changelog, store, validation), compatibility_date fallback, and shopware-cli environment variables."
lastBuilt: 2026-09-15
---
## What it is

Reference for configuring Shopware CLI per extension through a `.shopware-extension.yml` file in the extension root, the `compatibility_date` opt-in mechanism, and the environment variables the CLI reads.

## When to use

- Tuning how `shopware-cli` builds, packages, validates or publishes an extension.
- Opting into newer CLI behaviour changes via `compatibility_date`.
- Controlling the CLI in CI through environment variables.

## Key steps / config

Top-level shape of `.shopware-extension.yml` (editors offer autocompletion from its schema):

```yaml
compatibility_date: '2026-02-11'
build:
  extraBundles:
    - path: src/Foo
    - name: OverrideName
      path: src/Override
  shopwareVersionConstraint: '~6.6.0'
  zip:
    assets:
      enabled: false
      before_hooks: []
      after_hooks: []
      disable_sass: false
      enable_es_build_for_admin: false
      enable_es_build_for_storefront: false
      npm_strict: false
changelog:
  enabled: true
store:
  automatic_bugfix_version_compatibility: true
validation:
  ignore: ['xx']
```

Print the JSON schema of this file with `shopware-cli extension config-schema` (useful for automation and AI agents).

### compatibility_date

- Format `YYYY-MM-DD`.
- New or potentially breaking CLI behaviour activates only for configs whose date is at or after that feature's rollout date.
- Missing field: fallback `2026-02-11`, and a warning is logged during config loading.

### Environment variables

| Variable | Purpose |
|---|---|
| `CI` | Detect CI environment |
| `SHOPWARE_CLI_PREVIOUS_TAG` | Override previous Git tag detection for changelog generation |
| `CI_PROJECT_URL` | GitLab CI project URL for changelog generation |
| `SHOPWARE_CLI_NO_SYMFONY_CLI` | Disable Symfony CLI usage |
| `APP_ENV` | Application environment |
| `SHOPWARE_PROJECT_ROOT` | Build the extension with this Shopware project instead of setting up a new one |
| `SHOPWARE_CLI_DISABLE_WASM_CACHE` | Disable the WASM cache for PHP linting |

## Essential identifiers

- `.shopware-extension.yml`, `compatibility_date`
- `build.extraBundles`, `build.shopwareVersionConstraint`, `build.zip.assets.*`, `changelog.enabled`, `store.automatic_bugfix_version_compatibility`, `validation.ignore`
- `shopware-cli extension config-schema`
- `CI`, `SHOPWARE_CLI_PREVIOUS_TAG`, `CI_PROJECT_URL`, `SHOPWARE_CLI_NO_SYMFONY_CLI`, `APP_ENV`, `SHOPWARE_PROJECT_ROOT`, `SHOPWARE_CLI_DISABLE_WASM_CACHE`

## Gotchas

- Omitting `compatibility_date` silently pins behaviour to `2026-02-11` (with a warning); set it explicitly to opt into newer behaviour.

## Code check (6.7.13.0)
- confirmed `APP_ENV` — read by core with default prod — vendor/shopware/core/Framework/Feature.php:130
- unverified `.shopware-extension.yml` — shopware-cli config file, out of scope
- unverified `compatibility_date` — shopware-cli config key, out of scope
- unverified `SHOPWARE_PROJECT_ROOT` — shopware-cli environment variable, not referenced in vendor/shopware/core
- unverified `SHOPWARE_CLI_PREVIOUS_TAG` — shopware-cli environment variable, out of scope
- unverified `shopware-cli extension config-schema` — shopware-cli command, out of scope
