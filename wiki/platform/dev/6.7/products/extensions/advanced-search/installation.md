---
id: platform/dev/6.7/products/extensions/advanced-search/installation.md
title: Installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/installation.html
sourceHash: e232d814d3e300f73493c89c59c49a1361f1dce3
codeCheckedAgainst: "6.7.13.0"
keywords: ["advanced search installation", "Shopware\\Elasticsearch\\Elasticsearch", "config/bundles.php", "OPENSEARCH_URL", "ES_MULTILINGUAL_INDEX", "SHOPWARE_ES_ENABLED", "SHOPWARE_ES_INDEXING_ENABLED", "SHOPWARE_ES_INDEX_PREFIX", "opensearch", "elasticsearch", "commercial plugin", "requirements"]
summary: Requirements for Advanced Search 2.0 - Commercial plugin 5.5.0+, running OpenSearch, Elasticsearch bundle enabled, and the SHOPWARE_ES_* env variables.
lastBuilt: 2026-09-15
---
## What it is

The prerequisites and on-prem environment configuration needed before Advanced Search 2.0 (a licensed feature of the Commercial package) works.

## When to use

When installing or troubleshooting Advanced Search on a self-hosted (on-prem) Shopware 6.7 shop.

## Key steps / config

1. Have a Commercial license on the `Evolve` or `Beyond` plan.
2. Run an OpenSearch server.
3. Enable the `Shopware\Elasticsearch\Elasticsearch` bundle in `config/bundles.php`.
4. Set the on-prem environment variables (the source uses the local OpenSearch host on port 9200 as `OPENSEARCH_URL` value):

```text
OPENSEARCH_URL=<opensearch host:9200>
ES_MULTILINGUAL_INDEX=1
SHOPWARE_ES_ENABLED=1
SHOPWARE_ES_INDEXING_ENABLED=1
SHOPWARE_ES_INDEX_PREFIX=sw
```

5. Install and activate the Commercial plugin, version 5.5.0 or later.

## Essential identifiers

- `Shopware\Elasticsearch\Elasticsearch` (bundle), `config/bundles.php`
- `OPENSEARCH_URL`, `ES_MULTILINGUAL_INDEX`, `SHOPWARE_ES_ENABLED`, `SHOPWARE_ES_INDEXING_ENABLED`, `SHOPWARE_ES_INDEX_PREFIX`

## Gotchas

- Shopware's installer writes `SHOPWARE_ES_ENABLED=0` and `SHOPWARE_ES_INDEXING_ENABLED=0` by default; both must be switched to `1` for Advanced Search.
- `ES_MULTILINGUAL_INDEX` is not referenced in the installed core package; it belongs to the separate `shopware/elasticsearch` package and could not be checked here.
- The installer's generated env block also contains admin search variables (`ADMIN_OPENSEARCH_URL`, `SHOPWARE_ADMIN_ES_ENABLED`, `SHOPWARE_ADMIN_ES_INDEX_PREFIX`), which the source does not mention for Advanced Search.

## Code check (6.7.13.0)
- confirmed `OPENSEARCH_URL` — env var written by the installer under the shopware/elasticsearch block — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:48
- corrected `SHOPWARE_ES_ENABLED` — docs: set to 1 (required); installer default is 0 — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:49
- corrected `SHOPWARE_ES_INDEXING_ENABLED` — docs: set to 1 (required); installer default is 0 — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:50
- confirmed `SHOPWARE_ES_INDEX_PREFIX` — installer default `sw` matches docs — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:51
- confirmed `ADMIN_OPENSEARCH_URL` — separate admin search host variable — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:53
- unverified `ES_MULTILINGUAL_INDEX` — not in core; vendor/shopware/elasticsearch is out of scope
- unverified `Shopware\Elasticsearch\Elasticsearch` — bundle lives in vendor/shopware/elasticsearch, out of scope
