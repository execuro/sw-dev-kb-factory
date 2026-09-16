---
id: platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md
title: Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/
sourceHash: b75a254cd109900d7d3a156faf563b7d09a6ce27
codeCheckedAgainst: "6.7.13.0"
keywords: ["elasticsearch", "opensearch", "search engine", "search server", "and/or search", "indexing", "search performance", "hosting search", "es"]
summary: "Overview of the Elasticsearch/OpenSearch hosting guides for Shopware: setup, configuration, debugging, indexing issues and performance."
lastBuilt: 2026-09-15
---
## What it is

Section landing page for running Elasticsearch (or OpenSearch) with Shopware. Elasticsearch is an external search engine integrated into Shopware for advanced search, including AND/OR operations.

## When to use

Entry point when a shop needs a dedicated search server: the pages in this section cover setup, configuration, debugging, resolving indexing issues and performance optimisation.

## Code check (6.7.13.0)
- confirmed `SHOPWARE_ES_ENABLED` — env var written by the installer's default .env template (default 0) — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:49
- unverified `shopware/elasticsearch` — the Elasticsearch bundle is a separate package outside the checked core/storefront/administration roots
