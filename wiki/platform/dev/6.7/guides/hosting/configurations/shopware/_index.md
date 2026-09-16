---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/hosting/configurations/shopware/_index.md
sourceHash: 8b6987e0596eae4e34a6bcb837a1a571f391dbee
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/
title: Shopware
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware.system_config", "system configuration", "static system config", "config/packages", "environment variables", ".env.local", "bin/console", "shopware-cli project console", "SymfonySystemConfigService", "configuration overview", "admin settings"]
summary: Where Shopware config lives (DB system config, static shopware.system_config overlay, Symfony config, env vars, CLI) and which source wins.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/configurations/shopware/static-system-config.md"]
---
## What it is

Index page for Shopware-specific hosting configuration (security, performance, structure). It explains the configuration mechanisms Shopware uses and which one to pick for a given value.

## When to use

When deciding whether a setting belongs in the Administration/database, in versioned YAML, in environment variables, or is set via CLI.

## Key steps / config

| Mechanism | Use it for | Where it lives |
|---|---|---|
| Database-backed system configuration | Shop settings changed in the Administration, Admin API, or by app/plugin code | Database, read through system configuration |
| Static system configuration | Values that must be fixed, versioned, or per environment | `config/packages/*.yaml` under `shopware.system_config` |
| Symfony / bundle configuration | Technical runtime config for Shopware, Symfony, bundles | `config/packages/*.yaml`, incl. `config/packages/prod/` |
| Environment variables | Secrets, infrastructure, deployment-specific values | `.env`, `.env.local`, server/container env, deployment platform |
| CLI commands | Reading/writing/inspecting config | `bin/console` / `shopware-cli project console` |

Rule of thumb: merchant-changeable shop settings go in the Administration/database; fixed or version-controlled values go in static system configuration; deployment and infrastructure settings go in env vars or Symfony config.

`shopware.system_config` is keyed by scope (`default` or a sales channel UUID), then by config key:

```yaml
shopware:
    system_config:
        default:
            <config.key>: <value>
```

Details: [Static System Configuration](platform/dev/6.7/guides/hosting/configurations/shopware/static-system-config.md).

## Essential identifiers

- `shopware.system_config`
- `Shopware\Core\System\SystemConfig\SymfonySystemConfigService`
- `config/packages/`, `config/packages/prod/`
- `.env`, `.env.local`
- `bin/console`, `shopware-cli project console`

## Gotchas

- Static system configuration overlays the database values: if a key is set in both, the `config/packages` value wins and can no longer be changed in the Administration. When the Administration saves a statically configured key with the identical value, it is silently dropped.

## Code check (6.7.13.0)
- confirmed `shopware.system_config` — core default `default: []` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:676
- confirmed `system_config` — config node keys must be `default` or a valid UUID — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1280
- confirmed `SymfonySystemConfigService` — receives `%shopware.system_config%` — vendor/shopware/core/System/DependencyInjection/configuration.xml:65
- confirmed `SymfonySystemConfigService::override()` — overlays static values on loaded config — vendor/shopware/core/System/SystemConfig/SymfonySystemConfigService.php:59
- confirmed `ConfiguredSystemConfigLoader` — loader applying the static overlay — vendor/shopware/core/System/SystemConfig/ConfiguredSystemConfigLoader.php:11
- confirmed `SymfonySystemConfigService::has()` — writes of identical values for static keys are dropped — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:235
- unverified `shopware-cli project console` — separate CLI tool, out of scope
