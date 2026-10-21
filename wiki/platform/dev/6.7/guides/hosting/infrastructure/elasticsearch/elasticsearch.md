---
id: platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch.md
title: Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch.html
sourceHash: 2d33607f748e7ac70b5d331eb83cee085614b628
codeCheckedAgainst: "6.7.15.1"
keywords: ["SHOPWARE_ES_THROW_EXCEPTION", "SHOPWARE_ES_NGRAM_MIN_GRAM", "SHOPWARE_ES_NGRAM_MAX_GRAM", "es:index", "system:update:finish", "n-gram tokenizer", "split search term", "mysql fallback", "error handling", "search precision", "fuzzy search", "opensearch"]
summary: Elasticsearch error handling via SHOPWARE_ES_THROW_EXCEPTION (MySQL fallback) and n-gram tuning with SHOPWARE_ES_NGRAM_MIN_GRAM/MAX_GRAM.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md"]
---
## What it is

Operational settings for Shopware's Elasticsearch/OpenSearch integration: how errors are handled (exception vs. MySQL fallback) and how the n-gram tokenizer used for "Split search term" fields is tuned. For troubleshooting see [Debugging and Troubleshooting Elasticsearch](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md).

## When to use

Deciding how a production vs. development shop should react to search-server failures, or making search matches fuzzier or stricter.

## Key steps / config

**Error handling** — set per environment:

- Production: `SHOPWARE_ES_THROW_EXCEPTION=0` — errors are not thrown; Shopware falls back to the default MySQL-based search when the search server is unreachable. The same applies when product updates in the Administration fail to sync to the search server.
- Development: `SHOPWARE_ES_THROW_EXCEPTION=1` — errors surface as exceptions.

**N-gram settings** — used for searchable fields with the "Split search term" option enabled. Defaults:

```bash
SHOPWARE_ES_NGRAM_MIN_GRAM=4
SHOPWARE_ES_NGRAM_MAX_GRAM=5
```

With these, `"shopware"` is tokenized into `["shop", "hopw", "opwa", "pwar", "ware", "shopw", "hopwa", "opwar", "pware"]`, so searching `"ware"` finds `"shopware"`. Lower/raise the values to make matching fuzzier or stricter, then run a full reindex:

```bash
bin/console es:index
```

## Essential identifiers

- `SHOPWARE_ES_THROW_EXCEPTION`
- `SHOPWARE_ES_NGRAM_MIN_GRAM`, `SHOPWARE_ES_NGRAM_MAX_GRAM`
- `bin/console es:index`, `bin/console system:update:finish`

## Gotchas

- System updates (web UI or `bin/console system:update:finish`) can change index mappings and require a reindex; the resulting expected errors should not block production updates — another reason to keep exceptions disabled there.
- N-gram changes only take effect after a full reindex.
- The installer writes `SHOPWARE_ES_THROW_EXCEPTION=1`, so production `.env` files need it set to `0` explicitly.

## Code check (6.7.15.1)
- confirmed `SHOPWARE_ES_THROW_EXCEPTION` — installer env template writes `1` by default — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:51
- confirmed `system:update:finish` — command name of SystemUpdateFinishCommand — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:30
- unverified `SHOPWARE_ES_NGRAM_MIN_GRAM` — read by the shopware/elasticsearch package, outside the checked roots
- unverified `SHOPWARE_ES_NGRAM_MAX_GRAM` — shopware/elasticsearch package, out of scope
- unverified `es:index` — shopware/elasticsearch package, out of scope
