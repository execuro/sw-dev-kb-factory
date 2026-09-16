---
id: platform/dev/6.6/products/paas/shopware-paas/elasticsearch.md
title: Elasticsearch
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/paas/shopware-paas/elasticsearch.html
sourceHash: 9143723bf8732c637deefdddc376d2b95d55b4e7
keywords: ["Elasticsearch", "OpenSearch", "shopware-paas-meta", "SHOPWARE_ES_HOSTS", "SHOPWARE_ES_ENABLED", "platformsh-env.php", "services.yaml", "app.yaml relationships", "PaaS search"]
summary: "Enable OpenSearch on Shopware PaaS by declaring the service, wiring a relationship, and setting SHOPWARE_ES_ENABLED."
lastBuilt: "2026-09-15"
---
## What it is

Steps for activating Elasticsearch (via an OpenSearch service) in a Shopware PaaS environment.

## Key steps / config

1. Add (or uncomment) the service in `.platform/services.yaml`:
   ```yaml
   elasticsearch:
      type: opensearch:2
      disk: 256
   ```
2. Add (or uncomment) the relationship in `.platform.app.yaml`:
   ```yaml
   relationships:
       elasticsearch: "elasticsearch:opensearch"
   ```
3. Follow the setup/indexing steps to prepare the Shopware instance for Elasticsearch (linked from the hosting guide). The `shopware/paas-meta` composer package then provides the `SHOPWARE_ES_HOSTS` environment variable.
4. Enable Elasticsearch by setting the `SHOPWARE_ES_ENABLED` environment variable to `1`, either by uncommenting the corresponding line in `platformsh-env.php` or in the app configuration's variables section.

## Essential identifiers

- `.platform/services.yaml` service key `elasticsearch` (`type: opensearch:2`)
- `.platform.app.yaml` relationship `elasticsearch: "elasticsearch:opensearch"`
- `SHOPWARE_ES_HOSTS`, `SHOPWARE_ES_ENABLED`
- `platformsh-env.php`
- composer package `shopware/paas-meta`
