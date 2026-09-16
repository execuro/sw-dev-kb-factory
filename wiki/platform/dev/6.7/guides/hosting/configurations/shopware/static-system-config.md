---
id: platform/dev/6.7/guides/hosting/configurations/shopware/static-system-config.md
title: Static System Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/static-system-config.html
sourceHash: 73db618d1f8ea3f65325f59aa132090953bfef61
codeCheckedAgainst: "6.7.13.0"
keywords: ["static system config", "shopware.system_config", "system_config", "config/packages", "ConfiguredSystemConfigLoader", "SymfonySystemConfigService", "override system config yaml", "read-only config", "sales channel config", "core.listing.allowBuyInListing", "environment variables", "SystemConfigService"]
summary: "shopware.system_config in config/packages YAML overrides database system config per default or sales channel ID and makes those keys read-only in admin."
lastBuilt: 2026-09-15
---
## What it is

Static system configuration (since 6.6.4.0) lets you set system config values in `config/packages/*.yaml`. They are an overlay on the database-loaded config: database values load first, the YAML value wins for any key set in both, and an overridden key can no longer be changed in the Administration.

## When to use

- A setting must be fixed and not changeable by shop users.
- You want the configuration versioned in the repository.
- You need different values per environment (development, staging, production) without touching the database.

## Key steps / config

1. Create `config/packages/<name>.yaml`.
2. Add values under `shopware.system_config`, keyed by scope (`default` or a sales channel ID), then by the full config key:

```yaml
shopware:
  system_config:
    default:
      core.listing.allowBuyInListing: true
    # sales channel specific
    0188da12724970b9b4a708298259b171:
      core.listing.allowBuyInListing: false
```

3. Symfony config processors work, e.g. environment variables:

```yaml
shopware:
  system_config:
    default:
      core.listing.allowBuyInListing: '%env(bool:ALLOW_BUY_IN_LISTING)%'
```

with `ALLOW_BUY_IN_LISTING=true` in `.env.local`.

How core applies it: `Shopware\Core\System\SystemConfig\SymfonySystemConfigService` receives the `%shopware.system_config%` parameter; `Shopware\Core\System\SystemConfig\ConfiguredSystemConfigLoader` decorates `SystemConfigLoader` and merges the static values over the loaded ones (sales-channel values on top of `default`). The shipped default of `shopware.system_config` is `default: []`.

## Essential identifiers

- `shopware.system_config` (scopes: `default`, sales channel UUID)
- `Shopware\Core\System\SystemConfig\ConfiguredSystemConfigLoader`
- `Shopware\Core\System\SystemConfig\SymfonySystemConfigService`
- `%env(bool:ALLOW_BUY_IN_LISTING)%`

## Gotchas

- Scope keys other than `default` must be valid UUIDs; anything else fails config validation (`Key must be "default" or a valid UUID`).
- Writing a statically managed key via `SystemConfigService::setMultiple()` (also used by `set()`) throws a "managed by system" exception unless the submitted value equals the static one; admin settings pages send the full config, so equal values are silently dropped. The method signature carries a v6.8.0 deprecation note (new optional `$silent` parameter).
- The read-only check looks at the key in any scope: a key set statically only for one sales channel is also locked for other scopes.

## Version notes

- Available since Shopware 6.6.4.0.

## Code check (6.7.13.0)
- confirmed `system_config` — shipped default `default: []` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:676
- confirmed `default` — scope keys must be "default" or valid UUID — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1293
- confirmed `ConfiguredSystemConfigLoader` — decorates SystemConfigLoader, priority -1500 — vendor/shopware/core/System/DependencyInjection/configuration.xml:74
- confirmed `ConfiguredSystemConfigLoader::load()` — overrides loaded config with static values — vendor/shopware/core/System/SystemConfig/ConfiguredSystemConfigLoader.php:24
- confirmed `SymfonySystemConfigService` — receives `%shopware.system_config%` — vendor/shopware/core/System/DependencyInjection/configuration.xml:65
- confirmed `SymfonySystemConfigService::override()` — sales-channel values merged over default — vendor/shopware/core/System/SystemConfig/SymfonySystemConfigService.php:59
- confirmed `SymfonySystemConfigService::has()` — true if key set in any scope — vendor/shopware/core/System/SystemConfig/SymfonySystemConfigService.php:43
- deprecated `SystemConfigService::setMultiple()` — throws for statically managed keys; v6.8.0 deprecation note on signature — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:225
- confirmed `core.listing.allowBuyInListing` — existing config key — vendor/shopware/core/Migration/V6_3/Migration1562228335SetConfigDefaults.php:39
- unverified `%env(bool:ALLOW_BUY_IN_LISTING)%` — Symfony env processor, vendor/symfony out of scope
