---
id: platform/dev/6.7/products/paas/shopware-paas/elasticsearch.md
title: Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/elasticsearch.html
sourceHash: 9143723bf8732c637deefdddc376d2b95d55b4e7
codeCheckedAgainst: "6.7.13.0"
keywords: ["elasticsearch", "opensearch", "shopware paas", "upsun", "platform.sh", ".platform/services.yaml", ".platform.app.yaml", "relationships", "SHOPWARE_ES_HOSTS", "SHOPWARE_ES_ENABLED", "shopware/paas-meta", "search service"]
summary: "Enable Elasticsearch/OpenSearch on Shopware PaaS: opensearch:2 service, elasticsearch relationship, SHOPWARE_ES_HOSTS and SHOPWARE_ES_ENABLED=1."
lastBuilt: 2026-09-15
---
## What it is

The steps to activate Elasticsearch (provisioned as an OpenSearch service) in a Shopware PaaS (Platform.sh/Upsun) environment: declare the service, link it to the app, prepare the instance, then switch Elasticsearch on via an environment variable.

## When to use

When a Shopware PaaS project should use Elasticsearch/OpenSearch for search and listing instead of the default MySQL-based search.

## Key steps / config

1. Enable the service — add (or uncomment) it in `.platform/services.yaml`:
   ```yaml
   elasticsearch:
      type: opensearch:2
      disk: 256
   ```
2. Add the relationship in the app configuration (`.platform.app.yaml`):
   ```yaml
   relationships:
       elasticsearch: "elasticsearch:opensearch"
   ```
3. Configure the instance — follow the general Shopware Elasticsearch setup and indexing steps ("prepare Shopware for Elasticsearch" in the hosting guide). The Composer package `shopware/paas-meta` then provides the environment variable `SHOPWARE_ES_HOSTS`.
4. Enable Elasticsearch by setting `SHOPWARE_ES_ENABLED` to `1` — either uncomment the corresponding line in `platformsh-env.php` or set it in the `variables` section of the app configuration.

## Essential identifiers

- `.platform/services.yaml` — service `elasticsearch`, `type: opensearch:2`
- `.platform.app.yaml` — `relationships.elasticsearch: "elasticsearch:opensearch"`
- `shopware/paas-meta` — provides `SHOPWARE_ES_HOSTS`
- `SHOPWARE_ES_ENABLED` — `1` activates Elasticsearch
- `platformsh-env.php`

## Gotchas

- `SHOPWARE_ES_ENABLED` defaults to `0` in the core `.env` template, so the service alone does not activate search; the variable must be set to `1`.
- The installed core's `.env` template and `system:setup` defaults name the host variable `OPENSEARCH_URL` (and `ADMIN_OPENSEARCH_URL` for admin search); `SHOPWARE_ES_HOSTS` is not read in core, storefront or administration — verify which variable your `shopware/paas-meta` version exports.
- The core template also carries `SHOPWARE_ES_INDEXING_ENABLED=0`; indexing must be enabled as part of the instance preparation step before search can serve results.

## Code check (6.7.13.0)
- confirmed `SHOPWARE_ES_ENABLED` — core .env template default is 0 — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:49
- confirmed `SHOPWARE_ES_ENABLED` — read as default of `system:setup --es-enabled` — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:59
- confirmed `SHOPWARE_ES_INDEXING_ENABLED` — core .env template default is 0 — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:50
- confirmed `OPENSEARCH_URL` — host variable in core .env template — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:48
- confirmed `ADMIN_OPENSEARCH_URL` — admin search host default for `system:setup` — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:63
- unverified `SHOPWARE_ES_HOSTS` — not read in core/storefront/administration; set by shopware/paas-meta, out of scope
- unverified `opensearch:2` — PaaS service type, infrastructure config outside vendor scope
- unverified `platformsh-env.php` — file from the PaaS recipe, outside vendor scope
