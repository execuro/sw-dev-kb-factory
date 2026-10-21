---
id: platform/dev/6.7/guides/hosting/configurations/_index.md
title: Configurations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/
sourceHash: dd53d1c58a5545547b7a3ff0fb03599b56fe3736
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware.yaml", "config/packages", "bundle configuration", "environment-specific config", "config/packages/dev", "config/packages/prod", "mailer.yaml", "symfony configuration environments", "hosting configuration", "installation settings", "shopware config root"]
summary: Where Shopware 6 installation config lives (config/packages/shopware.yaml) and how to add per-environment files under config/packages/<env>/.
lastBuilt: 2026-10-21
---
## What it is

Overview page for hosting-level configuration of a Shopware 6 installation. Shopware's own options live in the general Symfony bundle configuration, under the `shopware` root key, in `config/packages/shopware.yaml` of the project.

## When to use

When you need to customize an installation (any `shopware:` option, or a Symfony/third-party bundle option such as the mailer) and need to know which file to put it in — globally or only for one kernel environment (`dev`, `prod`).

## Key steps / config

1. Global Shopware config goes in the project root:

   ```text
   <project root>
   └── config
      └── packages
         └── shopware.yaml
   ```

   Top-level key is `shopware:`; Shopware ships its own defaults for the same tree, which your project file overrides.

2. For one environment only, place the file in a subfolder named after the environment, e.g. `config/packages/dev/mailer.yaml` or `config/packages/prod/mailer.yaml`. Symfony loads these in addition to the files directly in `config/packages/`.

3. For the loading rules of environment-specific files, the source refers to the Symfony documentation section "Configuration Environments".

## Essential identifiers

- `config/packages/shopware.yaml` — project-level Shopware bundle config
- `shopware` — root key of the Shopware bundle configuration tree
- `config/packages/<env>/` — environment-specific overrides (`dev`, `prod`)

## Code check (6.7.15.1)
- confirmed `shopware` — bundle configuration tree root is `new TreeBuilder('shopware')` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:23
- confirmed `shopware.logger` — example of a sub-tree shipped with defaults in the core's own packages/shopware.yaml — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:548
- unverified `config/packages/<env>/` — environment-specific loading is Symfony kernel behaviour, out of scope of the vendor/shopware roots
