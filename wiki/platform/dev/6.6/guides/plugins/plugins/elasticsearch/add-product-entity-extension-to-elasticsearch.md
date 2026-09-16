---
id: platform/dev/6.6/guides/plugins/plugins/elasticsearch/add-product-entity-extension-to-elasticsearch.md
title: Add product entity extension to elasticsearch
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/elasticsearch/add-product-entity-extension-to-elasticsearch.html
sourceHash: 74627021c4d11ed526cbdb3a0f7511c0146f88d2
keywords: ["ElasticsearchProductDefinition", "MyProductEsDecorator", "AbstractElasticsearchDefinition", "EntityExtension", "OneToOneAssociationField", "OneToManyAssociationField", "getMapping", "fetch", "buildTermQuery", "shopware.entity.extension", "shopware.entity.definition", "customString", "KEYWORD_FIELD"]
summary: "Decorate ElasticsearchProductDefinition to extend the product mapping and fetch logic with a custom entity extension's fields."
lastBuilt: "2026-09-15"
---
## What it is

Guide for adding an extended product entity field (and its associations) to the Elasticsearch index by decorating the product's Elasticsearch definition.

## When to use

When a product entity extension (e.g. a custom string field or association) also needs to be searchable via Elasticsearch, on top of the extension described in "Adding Complex data to existing entities".

## Key steps / config

1. Extend `ProductDefinition` with the new fields via an `EntityExtension` (as in the entity-extension guide) and register the extension and definitions with `shopware.entity.extension` / `shopware.entity.definition` tags.
2. Decorate `Shopware\Elasticsearch\Product\ElasticsearchProductDefinition` with a class extending `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition`:

```xml
<service id="Swag\BasicExample\Elasticsearch\Product\MyProductEsDecorator" decorates="Shopware\Elasticsearch\Product\ElasticsearchProductDefinition">
    <argument type="service" id="Swag\BasicExample\Elasticsearch\Product\MyProductEsDecorator.inner"/>
    <argument type="service" id="Doctrine\DBAL\Connection"/>
</service>
```

3. In `getMapping(Context $context): array`, get the default mapping via `$this->productDefinition->getMapping($context)` first, then add entries, e.g.:

```php
$mapping['properties']['customString'] = AbstractElasticsearchDefinition::KEYWORD_FIELD;
$mapping['properties']['oneToOneExampleExtension'] = ['type' => 'nested', 'properties' => [...]];
```

4. In `fetch(array $ids, Context $context): array`, call the decorated `fetch()`, then fetch associated data for all `$ids` with a single query and merge it into each `$document`.
5. Delegate `getEntityDefinition()` and `buildTermQuery()` to the decorated definition.

## Essential identifiers

- `Shopware\Elasticsearch\Product\ElasticsearchProductDefinition`
- `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition`
- `AbstractElasticsearchDefinition::KEYWORD_FIELD`
- `getMapping()`, `fetch()`, `buildTermQuery()`, `getEntityDefinition()`
- `shopware.entity.extension`, `shopware.entity.definition` tags

## Gotchas

Runtime fields (added with the `Runtime` flag) are not searchable by default in the DAL and need to be added to the Elasticsearch mapping explicitly, as shown for `customString` here; association fields need the `ApiAware` flag to be searchable at all.
