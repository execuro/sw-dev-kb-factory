---
id: platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch.md
title: Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch.html
sourceHash: 2d33607f748e7ac70b5d331eb83cee085614b628
codeCheckedAgainst: "6.7.13.0"
keywords: ["SHOPWARE_ES_THROW_EXCEPTION", "SHOPWARE_ES_NGRAM_MIN_GRAM", "SHOPWARE_ES_NGRAM_MAX_GRAM", "es:index", "system:update:finish", "n-gram tokenizer", "split search term", "mysql fallback", "opensearch error handling", "search precision", "fuzzy search"]
summary: "Shopware Elasticsearch error handling (SHOPWARE_ES_THROW_EXCEPTION, MySQL fallback) and n-gram tuning via SHOPWARE_ES_NGRAM_MIN_GRAM/MAX_GRAM plus reindex."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md"]
---
## What it is

Configuration notes for Shopware's Elasticsearch/OpenSearch integration: how exception handling affects fallback behaviour, and how the n-gram tokenizer settings control search precision. Troubleshooting is covered in platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md.

## When to use

- Deciding whether search-server errors should throw or fall back silently in a given environment.
- Partial-word search matches too much (or too little) on fields using "Split search term".

## Key steps / config

**Error handling.** Set `SHOPWARE_ES_THROW_EXCEPTION=0` in production and `SHOPWARE_ES_THROW_EXCEPTION=1` in development.

- Search server unreachable: with `0`, Shopware falls back to the MySQL-based search; the same applies when product updates in the Administration fail to sync to the search server.
- System updates (web UI or `bin/console system:update:finish`) may change index mappings and require a reindex; with `0` these expected errors do not block the update.

**N-gram settings.** A field marked *searchable* with "Split search term" enabled is indexed and searched with an n-gram tokenizer. Defaults:

```bash
SHOPWARE_ES_NGRAM_MIN_GRAM=4
SHOPWARE_ES_NGRAM_MAX_GRAM=5
```

With these, `"shopware"` becomes `shop, hopw, opwa, pwar, ware, shopw, hopwa, opwar, pware`, so searching `"ware"` finds `"shopware"`. Lower values make search fuzzier; higher values make it stricter. After changing them, reindex fully:

```bash
bin/console es:index
```

## Essential identifiers

- `SHOPWARE_ES_THROW_EXCEPTION`
- `SHOPWARE_ES_NGRAM_MIN_GRAM`, `SHOPWARE_ES_NGRAM_MAX_GRAM`
- `bin/console es:index`, `bin/console system:update:finish`

## Gotchas

- The installer's default `.env` template writes `SHOPWARE_ES_THROW_EXCEPTION=1`; switch it to `0` for production as recommended here.
- N-gram changes have no effect until a full reindex.

## Code check (6.7.13.0)
- confirmed `SHOPWARE_ES_THROW_EXCEPTION` — env var in the installer's default .env template, written as 1 — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:52
- confirmed `system:update:finish` — core CLI command — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:29
- unverified `SHOPWARE_ES_NGRAM_MIN_GRAM` — read by shopware/elasticsearch, outside the checked roots
- unverified `SHOPWARE_ES_NGRAM_MAX_GRAM` — read by shopware/elasticsearch, outside the checked roots
- unverified `es:index` — command ships in shopware/elasticsearch, outside the checked roots
