---
id: platform/dev/6.7/products/tools/cli/extension-commands/configuration.md
title: Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/extension-commands/configuration.html
sourceHash: 360d3ea9a970333867bcb96188b94cd7929e038b
codeCheckedAgainst: "6.7.15.1"
keywords: [".config/shopware-extension.yml", "compatibility_date", "shopware-cli extension config-schema", "shopwareVersionConstraint", "extraBundles", "automatic_bugfix_version_compatibility", "SHOPWARE_CLI_PREVIOUS_TAG", "SHOPWARE_PROJECT_ROOT", "SHOPWARE_CLI_NO_SYMFONY_CLI", "SHOPWARE_CLI_DISABLE_WASM_CACHE", "extension config", "environment variables", "json schema"]
summary: Shopware CLI extension config file .config/shopware-extension.yml (build, changelog, store, validation, compatibility_date) and CLI environment variables.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/configuration.md"]
---
## What it is

Reference for the Shopware CLI extension configuration file `.config/shopware-extension.yml` in the extension root (legacy fallbacks: see [configuration file lookup priority](platform/dev/6.7/products/tools/cli/configuration.md)) and for the environment variables that change CLI behavior. Editors give autocompletion and hints for the file's options.

## When to use

When tuning how Shopware CLI builds, packages, validates or publishes an extension, or when scripting/AI tooling needs the config schema.

## Key steps / config

Top-level sections and keys of `.config/shopware-extension.yml`:

```yaml
compatibility_date: '2026-02-11'
build:
  extraBundles:
    - path: src/Foo
    - name: OverrideName
      path: src/Override
  shopwareVersionConstraint: '~6.6.0'
  zip:
    assets: { enabled, before_hooks, after_hooks, disable_sass, enable_es_build_for_admin, enable_es_build_for_storefront, npm_strict }
changelog: { enabled: true }
store: { automatic_bugfix_version_compatibility: true }
validation: { ignore: ['xx'] }
```

- Print the JSON schema of this file with `shopware-cli extension config-schema` (useful for automation and AI agents).
- `compatibility_date` (format `YYYY-MM-DD`) opts the config in to CLI behavior changes rolled out on or before that date; newer or potentially breaking changes only apply to configs with a date at or after the feature's rollout date.

Environment variables:

| Variable | Effect |
|---|---|
| `CI` | Detect CI environment |
| `SHOPWARE_CLI_PREVIOUS_TAG` | Override previous Git tag detection for changelog generation |
| `CI_PROJECT_URL` | GitLab CI project URL used for changelog generation |
| `SHOPWARE_CLI_NO_SYMFONY_CLI` | Disable Symfony CLI usage |
| `APP_ENV` | Application environment |
| `SHOPWARE_PROJECT_ROOT` | Build the extension with this Shopware project instead of setting up a new one |
| `SHOPWARE_CLI_DISABLE_WASM_CACHE` | Disable the WASM cache for PHP linting |

## Essential identifiers

- `.config/shopware-extension.yml`
- `compatibility_date`, `build`, `changelog`, `store`, `validation`
- `shopware-cli extension config-schema`
- `SHOPWARE_CLI_PREVIOUS_TAG`, `SHOPWARE_PROJECT_ROOT`, `SHOPWARE_CLI_NO_SYMFONY_CLI`, `SHOPWARE_CLI_DISABLE_WASM_CACHE`

## Gotchas

- If `compatibility_date` is missing, the CLI falls back to `2026-02-11` and logs a warning while loading the config.

## Code check (6.7.15.1)
- unverified `.config/shopware-extension.yml` — read by the Go-based shopware-cli; no occurrence in vendor/shopware core/storefront/administration
- unverified `compatibility_date` — shopware-cli config key, not found in vendor/shopware roots
- unverified `shopware-cli extension config-schema` — shopware-cli command, out of scope
- unverified `SHOPWARE_CLI_PREVIOUS_TAG` — shopware-cli env var, out of scope
- unverified `SHOPWARE_PROJECT_ROOT` — shopware-cli env var, not found in vendor/shopware roots
- unverified `automatic_bugfix_version_compatibility` — shopware-cli store config key, out of scope
