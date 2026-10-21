---
id: platform/dev/6.7/guides/hosting/configurations/shopware/_index.md
title: Shopware
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/
sourceHash: 8b6987e0596eae4e34a6bcb837a1a571f391dbee
codeCheckedAgainst: "6.7.15.1"
relatedPages: ["platform/dev/6.7/guides/hosting/configurations/shopware/static-system-config.md"]
keywords: ["shopware configuration", "system config", "static system config", "shopware.system_config", "config/packages", "environment variables", ".env.local", "bin/console", "shopware-cli project console", "symfony bundle configuration", "SystemConfigService", "read-only settings"]
summary: Overview of where Shopware 6 config lives - DB system config, static shopware.system_config, Symfony YAML, env vars, CLI - and which one wins.
lastBuilt: 2026-10-21
---
## What it is

Entry page for Shopware 6 hosting configuration (security, performance, structural settings). It explains the five places configuration can come from and when to use each.

## When to use

When deciding where a setting belongs — Administration, versioned YAML, or the deployment environment — or when a value set in the Administration is unexpectedly locked or ignored.

## Key steps / config

| Mechanism | Use it for | Where it lives |
|---|---|---|
| Database-backed system configuration | Shop settings changeable in the Administration, via Admin API, or by app/plugin code | Database, read through Shopware's system configuration |
| Static system configuration | Settings that must be fixed, versioned, or per-environment | `config/packages/*.yaml` under `shopware.system_config` |
| Symfony / bundle configuration | Technical runtime config for Shopware, Symfony, bundles | `config/packages/*.yaml`, incl. `config/packages/prod/` |
| Environment variables | Secrets, infrastructure and deployment-specific values | `.env`, `.env.local`, server/container env, deployment platform |
| CLI commands | Reading/writing/inspecting config in dev, deployment, maintenance | `bin/console` / `shopware-cli project console` |

Rule of thumb: merchant-changeable shop settings go to the Administration / database system config; fixed or version-controlled values go to static system configuration; deployment and infrastructure settings go to environment variables or Symfony configuration.

Static system configuration is an overlay on the database-loaded values. Shape (scope `default` or a sales channel ID, then config keys):

```yaml
shopware:
    system_config:
        default:
            <config.key>: <value>
```

Details: [Static System Configuration](platform/dev/6.7/guides/hosting/configurations/shopware/static-system-config.md).

## Essential identifiers

- `shopware.system_config`
- `config/packages/*.yaml`, `config/packages/prod/`
- `.env`, `.env.local`
- `bin/console`, `shopware-cli project console`

## Gotchas

- If a key is set both in the database and under `shopware.system_config`, the `config/packages` value wins and the setting can no longer be changed in the Administration.

## Code check (6.7.15.1)
- confirmed `system_config` — root `shopware.system_config` node, keyed by scope then config key — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1316
- confirmed `ConfiguredSystemConfigLoader::load()` — overlays static config on top of the decorated DB loader — vendor/shopware/core/System/SystemConfig/ConfiguredSystemConfigLoader.php:24
- confirmed `SymfonySystemConfigService::getConfig()` — falls back to the `default` scope when no sales channel ID is given — vendor/shopware/core/System/SystemConfig/SymfonySystemConfigService.php:23
- confirmed `SystemConfigService::setMultiple()` — checks statically configured keys before writing, so they stay read-only — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:217
