---
id: platform/func/extensions/advanced-search.md
title: Advanced Search
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/advanced-search
sourceHash: e49f5c83157d936bc9711fad7897d65795074807c7c4ffd88609439da170356c
revision:
  current: true
  range: "3.1.1 - 3.3.4"
  swMax: "3.3.4"
  swMin: "3.1.1"
keywords: ["Advanced Search", "Elasticsearch", "OpenSearch", "Advanced Search 2.0", "preserved_chars", "shopware.yaml", "es:index", "es:create:alias", "SHOPWARE_ES_INDEXING_ENABLED", "boosting", "synonyms", "Rule Builder", "product boosting"]
summary: "Evolve-plan Elasticsearch search extension: field indexing/boosting config, synonyms, and console indexing commands; superseded by Advanced Search 2.0."
lastBuilt: "2026-09-15"
---

## What it is

Advanced Search is a Shopware Evolve-plan extension providing Elasticsearch-based configuration of product/category/manufacturer search relevance, boosting, actions and synonyms.

## When to use

When configuring Elasticsearch-backed search relevance, special-character handling, boosting rules, redirect actions, or synonyms for storefront search — up to Shopware 6.4.20.2 via the standalone extension.

## Key steps / config

- Install via **Extension > My Extensions**, then activate.
- If installation fails with `Could not install plugin, got 1 failure(s). Required plugin/package "shopware/platform >=v6.0"`, adjust the `shopware/platform` constraint in the `composer.json` of `/custom/plugins/SwagEnterpriseSearchPlatform`.
- Special characters indexed by default are defined in `/src/Core/Framework/Resources/config/packages/shopware.yaml` under `preserved_chars`:
```yaml
preserved_chars: ['-', '_', '+', '.', '@']
```
Override by creating `config/packages/shopware.yaml`:
```yaml
shopware:
  search:
    preserved_chars: ['-', '_', '+', '.', '@', '/']
```
- Configure under **Settings > Extensions > Shopware Advanced Search**: Overview tab sets which fields per entity (products, categories, manufacturers) are not searched / searched / prioritized, plus partial-hit and compound-word matching; hit counts for quicksearch and the results page.
- Preview tab tests the configured search per sales channel and entity, showing result ranking.
- Boostings: product boosting uses dynamic product groups; category/manufacturer boosting uses Rule Builder rules, with optional active-from/active-to windows.
- Actions: redirect a matched search phrase to a URL, product, or category.
- Synonyms: define Equivalent/Defining synonym term pairs per language.
- Indexing (server console, 3 steps): `php bin/console es:index` creates/updates the indices; the message queue processes it (usually automatic); if products are still missing from the storefront after indexing, run `php bin/console es:create:alias`.
- Set `SHOPWARE_ES_INDEXING_ENABLED=1` in `.env` so new/changed products are taken into the index; rebuild the index after config or search-setting changes.

## Essential identifiers

`preserved_chars`, `config/packages/shopware.yaml`, `php bin/console es:index`, `php bin/console es:create:alias`, `SHOPWARE_ES_INDEXING_ENABLED`, `/custom/plugins/SwagEnterpriseSearchPlatform`, Advanced Search 2.0

## Gotchas

- The standalone Advanced Search extension can no longer be installed from Shopware 6.5.x.x onward.
- New Shopware projects may ship only a `lock.yaml` under `config/packages/`; you must create `shopware.yaml` yourself to override `preserved_chars`.
- Indexed-data configuration is currently not possible per individual sales channel.

## Version notes

Advanced Search usable as a separate extension up to Shopware 6.4.20.2. Its successor, Advanced Search 2.0, is available from Shopware 6.5.4.0 and requires OpenSearch from Shopware 6.5.6.0; it is enabled automatically in the admin once the Commercial plugin is installed and activated.
