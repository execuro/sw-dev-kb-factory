---
id: platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md
title: Apply OpenSearch globally for admin-api
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.html
sourceHash: eaffbf32bed7449b76694ce6647858778b299f22
codeCheckedAgainst: "6.7.13.0"
keywords: ["ENABLE_OPENSEARCH_FOR_ADMIN_API", "AdminElasticsearchEntitySearcher", "EntitySearcherInterface", "AdminSearchRegistry", "ProductAdminSearchIndexer", "AbstractAdminIndexer", "shopware.elastic.admin-searcher-index", "es:admin:index", "loaded-by-opensearch", "opensearch", "elasticsearch", "admin search", "admin api listing"]
summary: "ADR (2026-01-28): behind ENABLE_OPENSEARCH_FOR_ADMIN_API, Admin API DAL searches on admin-indexed entities go to OpenSearch, falling back to MySQL."
lastBuilt: 2026-09-15
---
## What it is

Inventory ADR: Admin API entity searches (listings, filters, component lookups such as `sw-search-bar`, `sw-entity-single-select`, `sw-data-grid`) reuse the admin OpenSearch index instead of MySQL whenever the entity and all queried fields are supported. `Shopware\Elasticsearch\Admin\AdminElasticsearchEntitySearcher` decorates the DAL `EntitySearcherInterface`; unsupported searches fall back to the MySQL searcher.

## When to use

- Speeding up Administration listings/filters on large catalogs with admin OpenSearch configured.
- Adding fields to an admin index, or making a custom entity searchable through it.
- Diagnosing whether an Admin API search hit OpenSearch or SQL.

## Key steps / config

1. Enable the feature flag `ENABLE_OPENSEARCH_FOR_ADMIN_API` (default `false`, toggleable, experimental) and make sure admin OpenSearch itself is enabled.
2. Reindex the admin indexes: `bin/console es:admin:index` (also after changing mappings or adding/removing fields).
3. A search is forwarded to OpenSearch only if all of these hold:
   - feature flag active and admin ES enabled;
   - the context source is `AdminApiSource`;
   - no explicit ID criteria;
   - the `AdminSearchRegistry` has an indexer for the entity;
   - either a term search without other fields, or the indexer mapping is non-empty and every field used in the criteria is in the indexer's supported search fields.
4. Supported entities out of the box: `category`, `customer`, `landing_page`, `product_manufacturer`, `media`, `newsletter_recipient`, `order`, `product`, `promotion`, `property_group`.
5. More fields: decorate the concrete indexer (e.g. `Shopware\Elasticsearch\Admin\Indexer\ProductAdminSearchIndexer`), call the inner `mapping()` and add keyword fields to `$mapping['properties']`, and extend `fetch(array $ids)` to add the field values per row.
6. Register the decorator; custom entities additionally need the indexer tag:

```xml
<service id="Foo\Your\Custom\ProductAdminSearchIndexerDecorator"
         decorates="Shopware\Elasticsearch\Admin\Indexer\ProductAdminSearchIndexer"
         on-invalid="ignore">
  <argument type="service" id=".inner"/>
</service>
<tag name="shopware.elastic.admin-searcher-index" key="<your_entity_name>"/>
```

7. Troubleshooting: results loaded by OpenSearch carry the state `loaded-by-opensearch`, exposed in the JSON response under `meta.states`:

```json
{ "data": [], "meta": { "states": ["loaded-by-opensearch"], "total": 200 } }
```

## Essential identifiers

- `ENABLE_OPENSEARCH_FOR_ADMIN_API`
- `Shopware\Elasticsearch\Admin\AdminElasticsearchEntitySearcher`
- `EntitySearcherInterface`, `AdminApiSource`
- `AdminSearchRegistry`, `AbstractAdminIndexer`, `Shopware\Elasticsearch\Admin\Indexer\ProductAdminSearchIndexer`
- `shopware.elastic.admin-searcher-index`
- `bin/console es:admin:index`
- `meta.states` / `loaded-by-opensearch`

## Gotchas

- The ADR's XML sample shows `on-invalid="null"`, but its text requires `on-invalid="ignore"` so the decorator is dropped when the Elasticsearch bundle is not registered.
- Admin indexes store only commonly used fields as keyword fields; filters or sorts on other fields silently fall back to SQL.
- New filters or admin modules must declare their requirements in `AdminSearchRegistry` and index the fields, otherwise no performance gain.
- Index size and indexing time of admin indexes grow; hosting should monitor them.

## Code check (6.7.13.0)
- confirmed `ENABLE_OPENSEARCH_FOR_ADMIN_API` — feature flag, default false, toggleable; read by Administration list modules — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:54
- confirmed `EntitySearcherInterface` — DAL searcher interface that is decorated — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearcherInterface.php:13
- confirmed `AdminApiSource` — context source required for forwarding — vendor/shopware/core/Framework/Api/Context/AdminApiSource.php:9
- confirmed `shopware.elastic.admin-searcher-index` — tag contract requires AbstractAdminIndexer — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:92
- unverified `AdminElasticsearchEntitySearcher` — lives in the Elasticsearch package, outside the checked vendor roots
- unverified `AdminSearchRegistry` — Elasticsearch package, out of scope
- unverified `ProductAdminSearchIndexer` — Elasticsearch package, out of scope
- unverified `es:admin:index` — console command in the Elasticsearch package, out of scope
- unverified `loaded-by-opensearch` — not found in core/storefront/administration src; set in the Elasticsearch package per docs
