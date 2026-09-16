---
id: platform/dev/6.7/concepts/framework/elasticsearch.md
title: Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/elasticsearch.html
sourceHash: 86bfc2f1b8b1a913c6c8117b570e0580b63cfe71
codeCheckedAgainst: "6.7.13.0"
keywords: ["elasticsearch", "opensearch", "Criteria::STATE_ELASTICSEARCH_AWARE", "ElasticsearchDefinition", "ProductElasticsearchDefinition", "ElasticsearchEntitySearcher", "ElasticsearchEntityAggregator", "CriteriaParser", "SHOPWARE_ES_THROW_EXCEPTION", "SHOPWARE_ES_INDEX_PREFIX", "es:index", "es:reset", "search engine", "product search indexing"]
summary: How Shopware routes DAL searches to Elasticsearch/OpenSearch, the elasticsearchAware criteria state, core ES classes, env vars and es:* console commands.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md"]
---
## What it is

Concept overview of Shopware's Elasticsearch integration: which DAL searches are sent to Elasticsearch instead of MySQL, the classes that translate criteria to Elasticsearch queries, and the `es:*` maintenance commands. Setup is covered in the hosting guide (`platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md`).

## When to use

- You need to know whether a given product/category search hits Elasticsearch or MySQL.
- You want your own repository search to use Elasticsearch.
- You operate indices (cleanup, re-index, reset, status) or plan to extend the indexed fields (see `platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md`).

## Key steps / config

Elasticsearch is only used for searches that explicitly opt in. In core, the product search, listing and suggest paths add the state (`ProductSearchRoute`, `ProductListingLoader` behind `ProductListingRoute`, `ResolvedCriteriaProductSuggestRoute` decorating `ProductSuggestRoute`). To opt in your own search, add the state to the **criteria** — the constant is defined on `Criteria`, not on `Context`:

```php
$criteria = new \Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria();
$context = \Shopware\Core\Framework\Context::createDefaultContext();
// Enables Elasticsearch for this search
$criteria->addState(\Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria::STATE_ELASTICSEARCH_AWARE);

$repository->search($criteria, $context);
```

Fallback: if the Elasticsearch query fails, data is loaded via MySQL. Set `SHOPWARE_ES_THROW_EXCEPTION=1` to throw instead. Other env vars from the installer's `.env` template: `SHOPWARE_ES_ENABLED`, `SHOPWARE_ES_INDEXING_ENABLED`, `SHOPWARE_ES_INDEX_PREFIX` (default `sw`).

Commands:

| Command | Effect |
|---|---|
| `es:index:cleanup` | Deletes outdated indices; `-f` skips confirmation |
| `es:create:alias` | Refreshes the current index and points the alias (index name without timestamp) at it; normally automatic on publish |
| `es:index` | Re-indexes all configured entities |
| `es:reset` | Resets all active indices with the `SHOPWARE_ES_INDEX_PREFIX` prefix and clears the queue; only for corrupted indices or a fresh setup |
| `es:status` | Status of all current indices |
| `es:test:analyzer` | Runs an analyzer on your indices |

## Essential identifiers

- `Criteria::STATE_ELASTICSEARCH_AWARE` (value `elasticsearchAware`)
- `ElasticsearchDefinition` / `ProductElasticsearchDefinition` — defines fields sent to Elasticsearch and their aggregation, per entity
- `ElasticsearchEntitySearcher` — decorates `EntitySearcher`, returns an `IdSearchResult` hydrated by `ElasticsearchEntitySearchHydrator`; ids are then read from the database
- `ElasticsearchEntityAggregator` — same for aggregations
- `CriteriaParser` — converts criteria into Elasticsearch notation
- `ProductSearchBuilder` — core product search builder; the Elasticsearch extension maps its queries to Elasticsearch notation
- `ProductUpdater` — listens to `ProductIndexerEvent`, triggers `ElasticsearchIndexer` on `ProductEntity` changes
- `SHOPWARE_ES_THROW_EXCEPTION`, `SHOPWARE_ES_INDEX_PREFIX`

## Gotchas

- The docs' example calls `$context->addState(Context::STATE_ELASTICSEARCH_AWARE)`; no such constant exists on `Context` in 6.7.13.0. Core code always calls `$criteria->addState(Criteria::STATE_ELASTICSEARCH_AWARE)`.
- Silent MySQL fallback can hide a broken Elasticsearch setup; the installer `.env` template sets `SHOPWARE_ES_THROW_EXCEPTION=1`.
- If multiple Shopware instances share one Elasticsearch host, use distinct `SHOPWARE_ES_INDEX_PREFIX` values — `es:reset` acts on every index with the prefix.

## Code check (6.7.13.0)
- corrected `Criteria::STATE_ELASTICSEARCH_AWARE` — docs: `Context::STATE_ELASTICSEARCH_AWARE` added to the context — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:29
- confirmed `Criteria::addState()` — via `StateAwareTrait`, used by core listing loader — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingLoader.php:144
- confirmed `ProductListingRoute` — core listing route — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingRoute.php:31
- confirmed `ResolvedCriteriaProductSuggestRoute` — decorator that adds the elasticsearchAware state for suggest — vendor/shopware/core/Content/Product/SalesChannel/Suggest/ResolvedCriteriaProductSuggestRoute.php:21
- confirmed `SHOPWARE_ES_THROW_EXCEPTION` — present in installer env template — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:52
- confirmed `SHOPWARE_ES_INDEX_PREFIX` — default `sw` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:51
- confirmed `ProductSearchBuilder` — core class — vendor/shopware/core/Content/Product/SearchKeyword/ProductSearchBuilder.php:20
- confirmed `ProductIndexerEvent` — core event — vendor/shopware/core/Content/Product/Events/ProductIndexerEvent.php:10
- unverified `ElasticsearchEntitySearcher` — lives in shopware/elasticsearch package, outside checked roots
- unverified `es:index` — es:* commands live in shopware/elasticsearch package, outside checked roots
