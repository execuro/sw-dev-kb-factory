---
id: platform/dev/6.6/products/extensions/advanced-search/installation.md
title: Installation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/advanced-search/installation.html
sourceHash: e232d814d3e300f73493c89c59c49a1361f1dce3
keywords: ["advanced search", "installation", "opensearch", "elasticsearch bundle", "config/bundles.php", "OPENSEARCH_URL", "ES_MULTILINGUAL_INDEX", "SHOPWARE_ES_ENABLED", "SHOPWARE_ES_INDEXING_ENABLED", "SHOPWARE_ES_INDEX_PREFIX", "commercial plugin", "on-prem"]
summary: "Requirements for installing Advanced Search 2.0: licensed Commercial plan, running Opensearch server, enabled Elasticsearch bundle, and on-prem env vars."
lastBuilt: "2026-09-15"
---
## What it is

This page lists the prerequisites for installing Advanced Search 2.0, a licensed Commercial feature.

## Key steps / config

Requirements before installing:

- Advanced Search 2.0 is a licensed feature available for the `Evolve` and `Beyond` plan.
- An Opensearch server must be up and running.
- The `Shopware\Elasticsearch\Elasticsearch` bundle must be enabled in `config/bundles.php`.
- On-prem environments need the following configuration:

```text
OPENSEARCH_URL=http://localhost:9200
ES_MULTILINGUAL_INDEX=1
SHOPWARE_ES_ENABLED=1
SHOPWARE_ES_INDEXING_ENABLED=1
SHOPWARE_ES_INDEX_PREFIX=sw
```

- Commercial plugin version 5.5.0 onward must be installed and activated.

## Essential identifiers

- `Shopware\Elasticsearch\Elasticsearch` (bundle class)
- `config/bundles.php`
- `OPENSEARCH_URL`, `ES_MULTILINGUAL_INDEX`, `SHOPWARE_ES_ENABLED`, `SHOPWARE_ES_INDEXING_ENABLED`, `SHOPWARE_ES_INDEX_PREFIX` (env config keys)
