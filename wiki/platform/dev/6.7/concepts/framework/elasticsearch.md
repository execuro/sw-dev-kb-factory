---
id: platform/dev/6.7/concepts/framework/elasticsearch.md
title: Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/elasticsearch.html
sourceHash: 9cbcc6f527ddca089b21ef77b689a949b522398e
codeCheckedAgainst: "6.7.15.1"
keywords: ["elasticsearch", "opensearch", "search engine", "STATE_ELASTICSEARCH_AWARE", "ElasticsearchDefinition", "ElasticsearchEntitySearcher", "CriteriaParser", "ProductSearchBuilder", "SHOPWARE_ES_THROW_EXCEPTION", "SHOPWARE_ES_INDEX_PREFIX", "es:index", "es:reset", "es:index:cleanup", "es:create:alias", "es:status"]
summary: "Elasticsearch concept: enabling ES per Criteria state, ElasticsearchDefinition/EntitySearcher/Aggregator/CriteriaParser, env vars and es:* CLI commands."
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md"]
---
## What it is

Shopware's Elasticsearch integration moves product and category searches to Elasticsearch (a NoSQL database focused on search) to improve search performance. It is only used for searches that explicitly opt in. Setup is covered in the [Elasticsearch hosting guide](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md).

## When to use

Read this when you need to route your own DAL search through Elasticsearch, understand which classes map DAL criteria to Elasticsearch, or operate the indices with the `es:*` console commands.

## Key steps / config

Opt-in per search: by default the product search, listing and suggest routes are Elasticsearch-aware. For your own search add the state to the criteria:

```php
$criteria = new \Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria();
$context = \Shopware\Core\Framework\Context::createDefaultContext();
// Enables Elasticsearch for this search
$criteria->addState(\Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria::STATE_ELASTICSEARCH_AWARE);

$repository->search($criteria, $context);
```

Failure handling: a failing Elasticsearch query throws by default (`SHOPWARE_ES_THROW_EXCEPTION=1`); set `SHOPWARE_ES_THROW_EXCEPTION=0` to log the error and fall back to MySQL.

Architecture:

- `ElasticsearchDefinition` - one per entity exposed to Elasticsearch; defines fields and their aggregation. Product uses `ProductElasticsearchDefinition`.
- `ElasticsearchEntitySearcher` - decorates the DAL `EntitySearcher`, returns an `IdSearchResult` hydrated by `ElasticsearchEntitySearchHydrator`; found ids are then read from the database.
- `ElasticsearchEntityAggregator` - same for aggregations.
- `CriteriaParser` - converts criteria to Elasticsearch notation.
- `ProductSearchBuilder` - the core builder has an Elasticsearch extension mapping its queries to Elasticsearch notation.
- `ProductUpdater` - listens to `ProductIndexerEvent` and triggers `ElasticsearchIndexer` when a `ProductEntity` changes.

Console commands:

| Command | Effect |
|---|---|
| `es:index:cleanup` | delete outdated indices; `-f` skips confirmation |
| `es:create:alias` | refresh current index and point alias (name without timestamp) at it; normally automatic |
| `es:index` | re-index all configured entities |
| `es:reset` | reset all active indices with prefix `SHOPWARE_ES_INDEX_PREFIX` and clear the queue |
| `es:status` | status of all current indices |
| `es:test:analyzer` | run an analyzer on your indices |

To add fields or entities, see [extending the Elasticsearch product definition](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md).

## Essential identifiers

- `Criteria::STATE_ELASTICSEARCH_AWARE`
- `ProductSearchRoute`, `ProductListingRoute`, `ProductSuggestRoute`
- `ElasticsearchDefinition`, `ProductElasticsearchDefinition`, `ElasticsearchEntitySearcher`, `ElasticsearchEntityAggregator`, `ElasticsearchEntitySearchHydrator`, `CriteriaParser`, `ProductUpdater`, `ElasticsearchIndexer`
- `SHOPWARE_ES_THROW_EXCEPTION`, `SHOPWARE_ES_INDEX_PREFIX`

## Gotchas

- Only use `es:reset` when an index is corrupted or must be rebuilt from scratch.
- Several Shopware instances sharing one Elasticsearch host should use different `SHOPWARE_ES_INDEX_PREFIX` values.
- In 6.7.15.1 the listing state is set in `ProductListingLoader`, and `ProductDetailRoute` also marks its criteria Elasticsearch-aware.

## Code check (6.7.15.1)
- confirmed `Criteria::STATE_ELASTICSEARCH_AWARE` — value `elasticsearchAware` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:29
- confirmed `ProductSearchRoute` — adds the Elasticsearch-aware state — vendor/shopware/core/Content/Product/SalesChannel/Search/ProductSearchRoute.php:47
- confirmed `ProductListingLoader` — listing criteria marked Elasticsearch-aware — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingLoader.php:36
- confirmed `ResolvedCriteriaProductSuggestRoute` — suggest criteria marked Elasticsearch-aware — vendor/shopware/core/Content/Product/SalesChannel/Suggest/ResolvedCriteriaProductSuggestRoute.php:21
- confirmed `EntitySearcher` — DAL searcher decorated by the Elasticsearch searcher — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:32
- confirmed `IdSearchResult` — search result type — vendor/shopware/core/Framework/DataAbstractionLayer/Search/IdSearchResult.php:17
- confirmed `ProductSearchBuilder` — core product search builder — vendor/shopware/core/Content/Product/SearchKeyword/ProductSearchBuilder.php:20
- confirmed `ProductIndexerEvent` — event the product updater listens to — vendor/shopware/core/Content/Product/Events/ProductIndexerEvent.php:13
- confirmed `SHOPWARE_ES_THROW_EXCEPTION` — installer default `1`, prefix default `sw` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:51
- unverified `ElasticsearchEntitySearcher` — Elasticsearch bundle classes and `es:*` commands live outside the core/storefront/administration roots
