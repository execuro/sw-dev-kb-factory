---
id: platform/dev/6.7/products/paas/shopware-paas/elasticsearch.md
title: Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/elasticsearch.html
sourceHash: 9143723bf8732c637deefdddc376d2b95d55b4e7
codeCheckedAgainst: "6.7.15.1"
keywords: ["elasticsearch", "opensearch", "shopware paas", ".platform/services.yaml", ".platform.app.yaml", "relationships", "SHOPWARE_ES_HOSTS", "SHOPWARE_ES_ENABLED", "shopware/paas-meta", "platformsh-env.php", "search service"]
summary: "Enabling Elasticsearch/OpenSearch on Shopware PaaS: services.yaml service, app relationship, SHOPWARE_ES_HOSTS and SHOPWARE_ES_ENABLED=1."
lastBuilt: 2026-10-21
---
## What it is

Steps to activate Elasticsearch (OpenSearch 2 service) for a Shopware PaaS environment.

## When to use

When a PaaS-hosted shop should use Elasticsearch/OpenSearch for search and listing instead of MySQL.

## Key steps / config

1. Enable the service in `.platform/services.yaml` (add or uncomment):
   ```yaml
   elasticsearch:
      type: opensearch:2
      disk: 256
   ```
2. Add the relationship in `.platform.app.yaml`:
   ```yaml
   relationships:
       elasticsearch: "elasticsearch:opensearch"
   ```
3. Prepare the instance with the Shopware Elasticsearch setup and indexing steps (the general Elasticsearch setup guide).
4. The Composer package `shopware/paas-meta` then provides the environment variable `SHOPWARE_ES_HOSTS`.
5. Activate Elasticsearch by setting `SHOPWARE_ES_ENABLED` to `1` — either by uncommenting the line in `platformsh-env.php` or in the variables section of the app configuration.

## Essential identifiers

- `.platform/services.yaml`, `.platform.app.yaml`
- `opensearch:2`, `elasticsearch:opensearch`
- `shopware/paas-meta`, `platformsh-env.php`
- `SHOPWARE_ES_HOSTS`, `SHOPWARE_ES_ENABLED`

## Gotchas

- `SHOPWARE_ES_ENABLED` defaults to `0` in Shopware's installer-generated env and `system:setup`; it must be set to `1` explicitly.

## Code check (6.7.15.1)
- confirmed `SHOPWARE_ES_ENABLED` — `system:setup` option `--es-enabled` defaults to `0` — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:59
- confirmed `SHOPWARE_ES_ENABLED` — installer env writer emits `SHOPWARE_ES_ENABLED=0` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:48
- unverified `SHOPWARE_ES_HOSTS` — consumed by the Elasticsearch bundle, outside the three checked package roots
- unverified `shopware/paas-meta` — PaaS Composer package, out of scope
- unverified `opensearch:2` — PaaS service definition, out of scope
