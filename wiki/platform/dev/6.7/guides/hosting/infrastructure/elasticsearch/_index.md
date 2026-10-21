---
id: platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md
title: Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/
sourceHash: b75a254cd109900d7d3a156faf563b7d09a6ce27
codeCheckedAgainst: "6.7.15.1"
keywords: ["elasticsearch", "opensearch", "search engine", "hosting", "infrastructure", "AND/OR search", "indexing", "search performance", "troubleshooting", "OPENSEARCH_URL", "SHOPWARE_ES_ENABLED"]
summary: Hosting section overview for Elasticsearch/OpenSearch in Shopware 6.7 - setup, configuration, debugging, indexing issues and performance.
lastBuilt: 2026-10-21
---
## What it is

Section index for the Elasticsearch hosting guides. Elasticsearch (and OpenSearch) is a search engine that can be integrated into Shopware to provide advanced search capabilities, including AND/OR operations. The pages under this section cover setting it up, configuring it, debugging it, resolving indexing issues and optimizing performance.

## When to use

Start here when a shop needs a dedicated search engine instead of the default MySQL-based search and you need the setup, configuration or troubleshooting guide. The connection is driven by env vars such as `OPENSEARCH_URL` and `SHOPWARE_ES_ENABLED` (see the setup guide in this section).

## Code check (6.7.15.1)
- confirmed `OPENSEARCH_URL` — installer writes this env var with a localhost:9200 default — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:47
- confirmed `SHOPWARE_ES_ENABLED` — installer writes it disabled (`0`) by default — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:48
- unverified `shopware/elasticsearch` — the integration itself lives in a separate package, outside the checked roots
