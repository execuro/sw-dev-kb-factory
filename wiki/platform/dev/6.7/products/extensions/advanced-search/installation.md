---
id: platform/dev/6.7/products/extensions/advanced-search/installation.md
title: Installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/installation.html
sourceHash: e232d814d3e300f73493c89c59c49a1361f1dce3
codeCheckedAgainst: "6.7.15.1"
keywords: ["advanced search", "advanced search 2.0", "installation", "requirements", "opensearch", "elasticsearch", "OPENSEARCH_URL", "SHOPWARE_ES_ENABLED", "SHOPWARE_ES_INDEXING_ENABLED", "SHOPWARE_ES_INDEX_PREFIX", "Shopware\\Elasticsearch\\Elasticsearch", "commercial plugin", "config/bundles.php"]
summary: Requirements for Advanced Search 2.0 - Commercial plugin 5.5.0+, Evolve/Beyond plan, running OpenSearch, Elasticsearch bundle and SHOPWARE_ES_* env vars.
lastBuilt: 2026-10-21
---
## What it is

The prerequisites for running Advanced Search 2.0, a licensed feature of the Shopware Commercial package that runs on top of OpenSearch.

## When to use

Before enabling Advanced Search in a shop, or when debugging why Advanced Search is not active on an on-prem installation.

## Key steps / config

1. Licence: Advanced Search 2.0 is part of the Commercial package and available for the `Evolve` and `Beyond` plans.
2. An OpenSearch server is up and running and reachable from the shop.
3. The `Shopware\Elasticsearch\Elasticsearch` bundle is enabled in `config/bundles.php`.
4. On-prem environment configuration (`.env`); `OPENSEARCH_URL` points at the OpenSearch host (the docs example uses a local host on port `9200`):

```text
OPENSEARCH_URL=<opensearch host>:9200
SHOPWARE_ES_ENABLED=1
SHOPWARE_ES_INDEXING_ENABLED=1
SHOPWARE_ES_INDEX_PREFIX=sw
```

5. The Commercial plugin, version 5.5.0 onward, is installed and activated.

The installed core's `system:setup` command writes the same variables; its defaults are `SHOPWARE_ES_ENABLED=0`, `SHOPWARE_ES_INDEXING_ENABLED=0` and `SHOPWARE_ES_INDEX_PREFIX=sw`, so both ES switches must be set to `1` explicitly.

## Essential identifiers

- `Shopware\Elasticsearch\Elasticsearch` (bundle class, registered in `config/bundles.php`)
- `OPENSEARCH_URL`
- `SHOPWARE_ES_ENABLED`
- `SHOPWARE_ES_INDEXING_ENABLED`
- `SHOPWARE_ES_INDEX_PREFIX`

## Gotchas

- The docs' env block also lists `ES_MULTILINGUAL_INDEX=1`. No code in the installed 6.7.15.1 core, storefront or administration reads this variable; setting it is harmless but has no effect there.
- Both `SHOPWARE_ES_ENABLED` and `SHOPWARE_ES_INDEXING_ENABLED` default to `0` in a fresh install; leaving either at `0` disables search or indexing via OpenSearch.
- A Commercial plugin older than 5.5.0 does not ship Advanced Search 2.0.

## Code check (6.7.15.1)
- confirmed `OPENSEARCH_URL` — option `es-hosts` default read from env — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:60
- confirmed `SHOPWARE_ES_ENABLED` — env default `0` in setup command — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:59
- confirmed `SHOPWARE_ES_INDEXING_ENABLED` — env default `0` in setup command — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:61
- confirmed `SHOPWARE_ES_INDEX_PREFIX` — env default `sw` in setup command — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:62
- confirmed `SHOPWARE_ES_INDEX_PREFIX` — installer writes `sw` into `.env` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:50
- absent `ES_MULTILINGUAL_INDEX` — not referenced anywhere in the installed code
- unverified `Shopware\Elasticsearch\Elasticsearch` — Elasticsearch package, outside the checked roots
- unverified `Commercial plugin 5.5.0` — commercial plugin, not part of the installed code
