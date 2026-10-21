---
id: platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md
title: Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/elasticsearch/
sourceHash: 454f3a9758325e4e43b4922363c68376de623a70
codeCheckedAgainst: "6.7.15.1"
keywords: ["elasticsearch", "opensearch", "search relevance", "core.search.minScore", "dismax_tie_breaker", "elasticsearch.search", "term_max_length", "search_type", "SHOPWARE_ES_NGRAM_MIN_GRAM", "SHOPWARE_ES_USE_LANGUAGE_ANALYZER", "es:index", "shopware.storefront.redirect_on_single_hit_fields", "search redirect", "minimum score"]
summary: Elasticsearch search tuning - core.search.minScore, dismax_tie_breaker, elasticsearch.search keys, analyzer env vars, single-hit redirect.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md"]
---
## What it is

Entry page for extending and tuning Shopware's Elasticsearch/OpenSearch product search. Extending entity fields to the search engine lets users search by additional attributes; several relevance aspects are configurable without custom code.

## When to use

When product search returns too many weak matches, multi-field scoring needs adjusting, analyzer behaviour must change, or the storefront's direct redirect on exact code matches must be restricted or disabled.

## Key steps / config

**Minimum score** - `core.search.minScore` (since 6.7.12.0) is a per-sales-channel system config value, default `0.0` (disabled). Above `0.0`, product-search hits scoring below it are dropped. No universally correct value exists; start low and increase gradually.

```bash
bin/console system:config:set core.search.minScore 5.0
```

**Multi-field tie-breaker** - per-field scores are combined with a `dis_max` query; `tie_breaker` (since 6.7.12.0, default `0.2`, range `0.0`-`1.0`) controls how much non-best field matches contribute. Override in `config/packages/elasticsearch.yaml`:

```yaml
elasticsearch:
    search:
        dismax_tie_breaker: 0.3
        timeout: 5s                    # request timeout per search
        term_max_length: 300           # longer terms are truncated
        search_type: query_then_fetch  # OpenSearch search type
        # precision_threshold: 40000   # cardinality accuracy for grouped counts
```

**Analyzers** - controlled by env vars `SHOPWARE_ES_DIMENSION_NORMALIZE`, `SHOPWARE_ES_NGRAM_MIN_GRAM` / `SHOPWARE_ES_NGRAM_MAX_GRAM`, `SHOPWARE_ES_USE_LANGUAGE_ANALYZER` (see [Environment Variables](platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md)). Any analyzer change requires a full reindex: `bin/console es:index`.

**Direct redirect on exact code match** - the storefront search redirects to the product detail page when the search result has at most one product and the trimmed, lower-cased search term equals one of the product's fields listed in the container parameter `shopware.storefront.redirect_on_single_hit_fields` (default `['productNumber', 'ean', 'manufacturerNumber']`). Applies with Elasticsearch and with database search. Override the parameter to restrict it, or set it to an empty list to disable it.

## Essential identifiers

- `core.search.minScore`
- `elasticsearch.search.dismax_tie_breaker`, `timeout`, `term_max_length`, `search_type`, `precision_threshold`
- `SHOPWARE_ES_DIMENSION_NORMALIZE`, `SHOPWARE_ES_NGRAM_MIN_GRAM`, `SHOPWARE_ES_NGRAM_MAX_GRAM`, `SHOPWARE_ES_USE_LANGUAGE_ANALYZER`
- `bin/console es:index`
- `shopware.storefront.redirect_on_single_hit_fields`

## Gotchas

- Effective score ranges depend on field weights, analyzer configuration and catalogue size, so a `minScore` that works on one shop may drop valid hits on another.
- `elasticsearch.search.term_max_length` is distinct from core's `shopware.search.term_max_length` (DAL search, also default 300).

## Version notes

- 6.7.12.0: `core.search.minScore` and the configurable `dis_max` tie-breaker were added; `ean` and `manufacturerNumber` joined the default redirect fields.

## Code check (6.7.15.1)
- confirmed `shopware.storefront.redirect_on_single_hit_fields` — default `productNumber`, `ean`, `manufacturerNumber` — vendor/shopware/storefront/Resources/config/packages/shopware.php:6
- confirmed `SearchController::handleFirstHit()` — skips redirect when listing total > 1; compares trimmed lower-cased term to each field — vendor/shopware/storefront/Controller/SearchController.php:158
- confirmed `SearchController::$redirectOnSingleHitFields` — constructor default matches the parameter default — vendor/shopware/storefront/Controller/SearchController.php:43
- confirmed `shopware.search.term_max_length` — core DAL search term limit, default 300 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1538
- unverified `core.search.minScore` — not defined in core/storefront/administration; lives in the Elasticsearch package, out of scope
- unverified `elasticsearch.search.dismax_tie_breaker` — Elasticsearch bundle config, out of scope
- unverified `elasticsearch.search.term_max_length` — Elasticsearch bundle config, out of scope
- unverified `SHOPWARE_ES_NGRAM_MIN_GRAM` — not referenced in core/storefront/administration; Elasticsearch package, out of scope
- unverified `es:index` — console command in the Elasticsearch package, out of scope
