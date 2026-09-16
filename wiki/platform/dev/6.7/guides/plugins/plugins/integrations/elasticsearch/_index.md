---
id: platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md
title: Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/elasticsearch/
sourceHash: 454f3a9758325e4e43b4922363c68376de623a70
codeCheckedAgainst: "6.7.13.0"
keywords: ["elasticsearch", "opensearch", "search relevance", "core.search.minScore", "dismax_tie_breaker", "tie_breaker", "elasticsearch.search", "term_max_length", "SHOPWARE_ES_NGRAM_MIN_GRAM", "SHOPWARE_ES_USE_LANGUAGE_ANALYZER", "es:index", "shopware.storefront.redirect_on_single_hit_fields", "single hit redirect", "min score", "analyzer"]
summary: "Elasticsearch product search tuning in 6.7: core.search.minScore, dis_max tie_breaker, elasticsearch.search settings, analyzer env vars, single-hit redirect"
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md"]
---
## What it is

Overview of how product search relevance is tuned when Shopware uses Elasticsearch/OpenSearch: a minimum-score cutoff, the multi-field tie-breaker, other `elasticsearch.search` settings, analyzer environment variables, and the storefront redirect on exact code matches. Extending entity fields into the index is covered in the sub-guides of this section.

## When to use

- Search returns too many weak matches, or multi-field matches rank poorly.
- You need to change analyzer behaviour (n-grams, language analyzers) or search timeouts.
- You want to restrict or disable the storefront jump to a product page on an exact number/EAN match.

## Key steps / config

1. **Minimum score** (since 6.7.12.0): system config `core.search.minScore`, per sales channel, default `0.0` (disabled). Hits below the threshold are dropped. No universal value — start low, raise gradually.
   ```bash
   bin/console system:config:set core.search.minScore 5.0
   ```
2. **Tie-breaker** (since 6.7.12.0): per-field scores are combined via a `dis_max` query; `tie_breaker` default `0.2`, range `0.0`–`1.0`, controls how much non-best field matches add. Override in `config/packages/elasticsearch.yaml`.
3. **Other search settings** in the same file:
   ```yaml
   elasticsearch:
       search:
           dismax_tie_breaker: 0.3
           timeout: 5s                     # per search request
           term_max_length: 300            # longer terms truncated
           search_type: query_then_fetch
           # precision_threshold: 40000    # cardinality accuracy for grouped counts
   ```
4. **Analyzer settings** via env vars: `SHOPWARE_ES_DIMENSION_NORMALIZE`, `SHOPWARE_ES_NGRAM_MIN_GRAM` / `SHOPWARE_ES_NGRAM_MAX_GRAM`, `SHOPWARE_ES_USE_LANGUAGE_ANALYZER` (see [Environment Variables](platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md)). Any change requires a full reindex: `bin/console es:index`.
5. **Direct redirect on single hit**: when a search returns exactly one product whose `productNumber`, `ean` or `manufacturerNumber` equals the query, the storefront redirects to the product page — for both Elasticsearch and database search. Controlled by container parameter `shopware.storefront.redirect_on_single_hit_fields` (default `['productNumber', 'ean', 'manufacturerNumber']`); override it with fewer fields, or an empty list to disable.

## Essential identifiers

- `core.search.minScore`
- `elasticsearch.search.dismax_tie_breaker`, `timeout`, `term_max_length`, `search_type`, `precision_threshold`
- `SHOPWARE_ES_DIMENSION_NORMALIZE`, `SHOPWARE_ES_NGRAM_MIN_GRAM`, `SHOPWARE_ES_NGRAM_MAX_GRAM`, `SHOPWARE_ES_USE_LANGUAGE_ANALYZER`
- `bin/console es:index`
- `shopware.storefront.redirect_on_single_hit_fields`

## Gotchas

- The effective score range depends on field weights, analyzers and catalog size, so a `minScore` that works in one shop can hide valid results in another.
- Analyzer env var changes have no effect until `es:index` rebuilds the index.
- The `elasticsearch.*` keys, the analyzer env vars and `es:index` belong to the separate `shopware/elasticsearch` package; they could not be checked against core/storefront/administration code (see Code check). Core has its own, distinct `shopware.search.term_max_length` (default 300) for the DAL search.

## Version notes

- 6.7.12.0: `core.search.minScore` and the configurable `tie_breaker` were introduced; `ean` and `manufacturerNumber` were added to the default redirect fields.

## Code check (6.7.13.0)
- confirmed `shopware.storefront.redirect_on_single_hit_fields` — parameter defaults to productNumber, ean, manufacturerNumber — vendor/shopware/storefront/Resources/config/packages/shopware.php:6
- confirmed `system:config:set` — console command exists in core — vendor/shopware/core/System/SystemConfig/Command/ConfigSet.php:15
- confirmed `shopware.search.term_max_length` — core DAL search setting (distinct from elasticsearch.search.term_max_length), default 300 in shopware.yaml — vendor/shopware/core/Content/DependencyInjection/product.xml:377
- unverified `core.search.minScore` — not found in core/storefront/administration; presumably defined by the shopware/elasticsearch package, out of scope
- unverified `elasticsearch.search.dismax_tie_breaker` — shopware/elasticsearch package, out of scope
- unverified `elasticsearch.search.precision_threshold` — shopware/elasticsearch package, out of scope
- unverified `SHOPWARE_ES_NGRAM_MIN_GRAM` — analyzer env vars not referenced in core/storefront/administration; shopware/elasticsearch package, out of scope
- unverified `es:index` — command lives in shopware/elasticsearch package, out of scope
