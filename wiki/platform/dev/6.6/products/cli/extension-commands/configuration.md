---
id: platform/dev/6.6/products/cli/extension-commands/configuration.md
title: Configuration
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/extension-commands/configuration.html
sourceHash: 886ec833bbea7dfe8434f2c61b74950731493bb9
keywords: ["shopware-extension.yml", "SHOPWARE_CLI_PREVIOUS_TAG", "CI_PROJECT_URL", "SHOPWARE_CLI_NO_SYMFONY_CLI", "APP_ENV", "SHOPWARE_PROJECT_ROOT", "SHOPWARE_CLI_DISABLE_WASM_CACHE", "environment variables", "extraBundles", "shopwareVersionConstraint"]
summary: .shopware-extension.yml configures build, changelog, store and validation behavior for Shopware CLI; environment variables can also alter its behavior.
lastBuilt: "2026-09-15"
---
## What it is

This page documents the `.shopware-extension.yml` configuration file and the environment variables Shopware CLI reads.

## When to use

Use this as a reference when customizing extension build, changelog, store, or validation behavior for Shopware CLI.

## Key steps / config

Example `.shopware-extension.yml`:

```yaml
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
  ignore:
    - 'xx'
```

Editing this file in an editor gives autocompletion and hints for the available options.

## Essential identifiers

- `.shopware-extension.yml`
- Environment variables: `CI`, `SHOPWARE_CLI_PREVIOUS_TAG`, `CI_PROJECT_URL`, `SHOPWARE_CLI_NO_SYMFONY_CLI`, `APP_ENV`, `SHOPWARE_PROJECT_ROOT`, `SHOPWARE_CLI_DISABLE_WASM_CACHE`

## Gotchas

- `SHOPWARE_CLI_PREVIOUS_TAG` overrides the previous Git tag detection used for changelog generation.
- `SHOPWARE_PROJECT_ROOT` makes the CLI use an existing Shopware project to build the extension instead of setting up a new one.
- `SHOPWARE_CLI_DISABLE_WASM_CACHE` disables the WASM cache used for PHP linting.
