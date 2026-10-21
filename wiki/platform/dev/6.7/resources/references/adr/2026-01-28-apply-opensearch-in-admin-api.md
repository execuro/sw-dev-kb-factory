---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md
sourceHash: eaffbf32bed7449b76694ce6647858778b299f22
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.html
title: Apply OpenSearch globally for admin-api
version: "6.7"
versions:
  - "6.7"
keywords: ["ENABLE_OPENSEARCH_FOR_ADMIN_API", "AdminElasticsearchEntitySearcher", "AdminSearchRegistry", "ProductAdminSearchIndexer", "AbstractAdminIndexer", "shopware.elastic.admin-searcher-index", "es:admin:index", "loaded-by-opensearch", "EntitySearcherInterface", "admin search", "opensearch", "elasticsearch", "admin api listing"]
summary: "ADR: behind ENABLE_OPENSEARCH_FOR_ADMIN_API, Admin API DAL searches on admin-indexed entities go to OpenSearch, falling back to MySQL otherwise."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2026-01-28, area inventory) that lets Admin API / administration listings, filters and component lookups (e.g. `sw-search-bar`, `sw-entity-single-select`, `sw-data-grid`) reuse the admin OpenSearch index instead of MySQL. `Shopware\Elasticsearch\Admin\AdminElasticsearchEntitySearcher` decorates the DAL `EntitySearcherInterface` and forwards criteria to OpenSearch when the entity is supported; everything else keeps using the decorated MySQL searcher.

## When to use

- Admin listings on large catalogs are slow and you run admin OpenSearch.
- You add fields, filters or a custom entity to the admin index and want them served from OpenSearch.
- You debug whether an Admin API search hit OpenSearch or SQL.

## Key steps / config

1. Enable the feature flag `ENABLE_OPENSEARCH_FOR_ADMIN_API` (experimental, default off) and have admin OpenSearch configured and enabled. The administration list pages only use the admin ES path when the flag is active and `Context.app.adminEsEnable` is true.
2. Reindex the admin indexes after enabling the flag and after every mapping/field change: `bin/console es:admin:index`.
3. A search is forwarded to OpenSearch only if all hold: flag on, admin ES enabled, the context source is `AdminApiSource`, the criteria carry no explicit IDs, the `AdminSearchRegistry` has an indexer for the entity, and either it is a pure term search or every field the criteria use (filters, sorts) is in the indexer's `getSupportedSearchFields()`; an indexer whose `mapping([])` is empty is skipped.
4. Supported entities out of the box: `category`, `customer`, `landing_page`, `product_manufacturer`, `media`, `newsletter_recipient`, `order`, `product`, `promotion`, `property_group`.
5. Additional fields: decorate the concrete indexer (e.g. `Shopware\Elasticsearch\Admin\Indexer\ProductAdminSearchIndexer`), extending `AbstractAdminIndexer`, call the inner `mapping()`/`fetch()` and append your field (e.g. as `AbstractElasticsearchDefinition::KEYWORD_FIELD`) and its data:

   ```xml
   <service id="Foo\Your\Custom\ProductAdminSearchIndexerDecorator"
            decorates="Shopware\Elasticsearch\Admin\Indexer\ProductAdminSearchIndexer"
            on-invalid="ignore">
     <argument type="service" id=".inner"/>
   </service>
   ```

6. Custom entity: register its indexer service with `<tag name="shopware.elastic.admin-searcher-index" key="<your_entity_name>"/>`.
7. Troubleshooting: results from the OpenSearch path carry the state `loaded-by-opensearch`, exposed in the JSON response as `meta.states`:

   ```json
   { "data": [], "meta": { "states": ["loaded-by-opensearch"], "total": 200 } }
   ```

## Essential identifiers

- `ENABLE_OPENSEARCH_FOR_ADMIN_API`
- `Shopware\Elasticsearch\Admin\AdminElasticsearchEntitySearcher`, `EntitySearcherInterface`
- `AdminSearchRegistry`, `AbstractAdminIndexer`, `Shopware\Elasticsearch\Admin\Indexer\ProductAdminSearchIndexer`
- `shopware.elastic.admin-searcher-index`
- `bin/console es:admin:index`
- `loaded-by-opensearch` (`meta.states`)

## Gotchas

- The ADR's text requires `on-invalid="ignore"` on the decorator (so the project still boots without the Elasticsearch bundle), while its XML sample shows `on-invalid="null"`; follow the text.
- Admin index fields are stored as keyword fields and only commonly used admin fields are indexed; projects needing more must extend mapping and indexing themselves, otherwise those queries fall back to SQL.
- New filters or admin modules must declare their requirements in `AdminSearchRegistry` and index the needed fields, or they lose the OpenSearch path.
- Index size and indexing time of admin indexes grow with more fields; hosting should monitor index size.
- A missing `loaded-by-opensearch` state on a slow request means it bypassed OpenSearch.

## Code check (6.7.15.1)
- confirmed `ENABLE_OPENSEARCH_FOR_ADMIN_API` — experimental, default false, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:54
- confirmed `adminEsEnable` — admin product list uses ES only with flag active and Context.app.adminEsEnable — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-list/index.js:290
- confirmed `shopware.elastic.admin-searcher-index` — tag contract maps to AbstractAdminIndexer — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:100
- unverified `AdminElasticsearchEntitySearcher` — lives in the Elasticsearch bundle, out of scope
- unverified `AdminSearchRegistry` — Elasticsearch bundle, out of scope
- unverified `ProductAdminSearchIndexer` — Elasticsearch bundle, out of scope
- unverified `loaded-by-opensearch` — not found in core/storefront/administration roots; set in the Elasticsearch bundle per ADR
- unverified `es:admin:index` — command defined in the Elasticsearch bundle, out of scope
