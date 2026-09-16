---
id: platform/dev/6.6/concepts/framework/elasticsearch.md
title: Elasticsearch
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/framework/elasticsearch.html
sourceHash: b3193fdc92f9f12492c403323ffe48b974bafadc
keywords: ["elasticsearch", "productsearchroute", "productlistingroute", "productsuggestroute", "elasticsearchdefinition", "productelasticsearchdefinition", "elasticsearchentitysearcher", "elasticsearchentityaggregator", "criteriaparser", "productsearchbuilder", "productupdater", "state_elasticsearch_aware", "shopware_es_throw_exception", "es:index"]
summary: "Explains Shopware's Elasticsearch integration: enabling per-criteria, key classes, and es:* console commands."
lastBuilt: "2026-09-15"
---
## What it is

Elasticsearch is a NoSQL search-engine database; Shopware's implementation improves the performance of product and category searches, used explicitly on `ProductSearchRoute`, `ProductListingRoute`, and `ProductSuggestRoute` by default.

## When to use

Use when your shop needs faster product/category search, when enabling Elasticsearch for custom searches, or when extending Elasticsearch with your own entities/fields.

## Key steps / config

To enable Elasticsearch on a custom search, add the Elasticsearch-aware state to the criteria's context:

```php
$criteria = new \Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria();
$context = \Shopware\Core\Framework\Context::createDefaultContext();
// Enables Elasticsearch for this search
$context->addState(\Shopware\Core\Framework\Context::STATE_ELASTICSEARCH_AWARE);

$repository->search($criteria, $context);
```

Core classes:
- `ElasticsearchDefinition` — defines the fields provided for an entity and how they're aggregated; Shopware ships `ProductElasticsearchDefinition` for products.
- `ElasticsearchEntitySearcher` — decorates `EntitySearcher`, mapping the entity search to the Elasticsearch structure, returning an `IdSearchResult` hydrated by `ElasticsearchEntitySearchHydrator`.
- `ElasticsearchEntityAggregator` — does the same as `ElasticsearchEntitySearcher` for aggregations.
- `CriteriaParser` — parses criteria into Elasticsearch-specific notation.
- `ProductSearchBuilder` — has an Elasticsearch-specific extension matching core query construction to Elasticsearch notation.
- `ProductUpdater` — listens to `ProductIndexerEvent` and triggers `ElasticsearchIndexer` on `ProductEntity` changes.

Console commands: `es:index:cleanup` (deletes outdated indexes, `-f` skips confirmation), `es:create:alias` (refreshes the current index and sets its alias, forcing alias creation), `es:index` (re-indexes all configured entities), `es:reset` (resets all active indices with the `SHOPWARE_ES_INDEX_PREFIX` prefix and clears the queue — use only when an index is corrupted), `es:status` (returns status of current indices), `es:test:analyzer` (runs an analyzer on your indices).

## Essential identifiers

- `Context::STATE_ELASTICSEARCH_AWARE` — criteria/context state flag
- `SHOPWARE_ES_THROW_EXCEPTION` — env var to disable MySQL fallback on query failure
- `SHOPWARE_ES_INDEX_PREFIX` — env var used by `es:reset`
- `es:index`, `es:reset`, `es:status`, `es:index:cleanup`, `es:create:alias`, `es:test:analyzer`

## Gotchas

If the Elasticsearch query fails, data is loaded from MySQL instead by default; set `SHOPWARE_ES_THROW_EXCEPTION=1` to disable that fallback and throw instead. `es:reset` should only be used if an index is corrupted or needs rebuilding from scratch; if multiple Shopware instances share one Elasticsearch host, consider changing the index prefix.
