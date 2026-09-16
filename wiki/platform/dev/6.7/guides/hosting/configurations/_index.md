---
id: platform/dev/6.7/guides/hosting/configurations/_index.md
title: Configurations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/
sourceHash: dd53d1c58a5545547b7a3ff0fb03599b56fe3736
codeCheckedAgainst: "6.7.13.0"
keywords: ["configuration", "bundle configuration", "shopware.yaml", "config/packages", "environment config", "config/packages/prod", "config/packages/dev", "mailer.yaml", "symfony configuration environments", "shopware"]
summary: Where Shopware 6 bundle configuration lives (config/packages/shopware.yaml) and how to scope config files to an environment such as dev or prod.
lastBuilt: 2026-09-15
---
## What it is

Entry page for Shopware 6 hosting configuration: it states where the Shopware bundle configuration is placed and how environment-specific configuration files are organised.

## When to use

When you need to change Shopware or Symfony bundle settings for an installation, or apply a setting only in one environment (e.g. `dev` or `prod`).

## Key steps / config

1. General Shopware bundle configuration goes into `<project root>/config/packages/shopware.yaml`, under the `shopware:` root key.
2. For a specific environment, place the file in an environment subfolder, e.g. `config/packages/dev/mailer.yaml` or `config/packages/prod/mailer.yaml`.

```text
config/
└── packages/
    ├── shopware.yaml
    ├── dev/mailer.yaml
    └── prod/mailer.yaml
```

Environment folders follow Symfony's configuration-environments mechanism (see the Symfony documentation section "Configuration Environments").

## Essential identifiers

- `config/packages/shopware.yaml`
- `config/packages/<env>/`
- `shopware` (bundle config root key)

## Code check (6.7.13.0)
- confirmed `shopware` — bundle configuration tree root name — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:23
- confirmed `shopware.yaml` — core docs refer to project config in `config/packages/shopware.yaml` — vendor/shopware/core/Framework/MessageQueue/Stats/README.md:93
- confirmed `shopware.yaml` — profilers are activated via the shopware.yaml file — vendor/shopware/core/Profiling/Profiler.php:15
- unverified `config/packages/prod` — Symfony kernel environment loading, vendor/symfony out of scope
