---
id: platform/dev/6.7/guides/hosting/configurations/shopware/static-system-config.md
title: Static System Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/static-system-config.html
sourceHash: 73db618d1f8ea3f65325f59aa132090953bfef61
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware.system_config", "system_config", "static system config", "SymfonySystemConfigService", "ConfiguredSystemConfigLoader", "SystemConfigService", "config/packages", "core.listing.allowBuyInListing", "read-only config", "override system config", "sales channel config", "env variables"]
summary: "shopware.system_config in config/packages overlays database system config per scope (default or sales channel UUID) and makes those keys read-only."
lastBuilt: 2026-10-21
---
## What it is

The static system configuration lets you set system config values (the `system_config` keys normally edited in the Administration) in YAML under `config/packages` via the `shopware.system_config` bundle key. These values are an overlay: the database configuration is loaded first, then the static values replace it. A statically set key can no longer be changed in the Administration. Available since Shopware 6.6.4.0.

## When to use

- A configuration must be fixed and not changeable by shop users.
- You want configuration versioned in the repository.
- You need different values per environment (development, staging, production) without changing the database.

## Key steps / config

1. Create a file `config/packages/<name>.yaml`.
2. Add values under `shopware.system_config`, keyed by scope: `default` (all sales channels) or a sales channel ID:

```yaml
shopware:
  system_config:
    default:
      core.listing.allowBuyInListing: true
    # Disable it for the specific sales channel
    0188da12724970b9b4a708298259b171:
      core.listing.allowBuyInListing: false
```

3. Regular Symfony configuration processors work, e.g. environment variables:

```yaml
shopware:
  system_config:
    default:
      core.listing.allowBuyInListing: '%env(bool:ALLOW_BUY_IN_LISTING)%'
```

and in `.env.local`: `ALLOW_BUY_IN_LISTING=true`.

How the code applies it: the `shopware.system_config` parameter is passed to `SymfonySystemConfigService`. `ConfiguredSystemConfigLoader` decorates `SystemConfigLoader` and calls `SymfonySystemConfigService::override()` on the loaded database values; for a sales channel the `default` scope is merged first, then the sales-channel scope. `SystemConfigService` applies the same override when reading a config domain.

## Essential identifiers

- `shopware.system_config` — bundle config key / container parameter
- `default` / sales channel UUID — the only allowed scope keys
- `Shopware\Core\System\SystemConfig\SymfonySystemConfigService` — holds the static values (`get()`, `has()`, `override()`)
- `Shopware\Core\System\SystemConfig\ConfiguredSystemConfigLoader` — overlays static values on the loaded config
- `core.listing.allowBuyInListing` — example key used by the docs

## Gotchas

- Scope keys are validated: anything other than `default` or a valid UUID fails with "Key must be "default" or a valid UUID".
- Values are defined as scalar prototypes per scope — each entry must be a scalar value.
- Writing a statically managed key through `SystemConfigService` throws `SystemConfigException::systemConfigKeyIsManagedBySystems`, unless the submitted value equals the static value (the Administration always sends the full config, so unchanged read-only values are silently dropped).
- `SymfonySystemConfigService::has()` checks the key in any scope, so a key set statically only for one sales channel is also guarded on other scopes; there, the comparison falls back to the `default` scope value.
- This is separate from `shopware.staging.system_config`, which belongs to the staging configuration.

## Version notes

- Available since Shopware 6.6.4.0 (per the docs).

## Code check (6.7.15.1)
- confirmed `system_config` — bundle node, scope keys must be `default` or a valid UUID — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1316
- confirmed `shopware.system_config` — parameter injected into SymfonySystemConfigService — vendor/shopware/core/System/DependencyInjection/configuration.php:104
- confirmed `ConfiguredSystemConfigLoader` — decorates SystemConfigLoader — vendor/shopware/core/System/DependencyInjection/configuration.php:113
- confirmed `ConfiguredSystemConfigLoader::load()` — database config loaded first, then static override — vendor/shopware/core/System/SystemConfig/ConfiguredSystemConfigLoader.php:28
- confirmed `SymfonySystemConfigService::override()` — merges `default` then sales-channel scope — vendor/shopware/core/System/SystemConfig/SymfonySystemConfigService.php:59
- confirmed `SymfonySystemConfigService::has()` — true if key is set in any scope — vendor/shopware/core/System/SystemConfig/SymfonySystemConfigService.php:43
- confirmed `systemConfigKeyIsManagedBySystems` — write of a differing value to a static key is rejected — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:239
- confirmed `allowBuyInListing` — existing `core.listing` config field used in the example — vendor/shopware/core/System/Resources/config/listing.xml:9
- unverified `6.6.4.0` — availability version stated by docs, not checkable in the installed code
