---
id: platform/dev/6.6/products/extensions/advanced-search/How-to-add-more-fields-to-product-search.md
title: Add more fields to product search
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/advanced-search/How-to-add-more-fields-to-product-search.html"
sourceHash: a6101e52e936172abf9e52540f63e2d684041eb6
keywords: ["ElasticsearchProductDefinitionDecorator", "AbstractElasticsearchDefinition", "es:mapping:update", "es:index", "advanced_search_config_field", "MigrationStep", "getMapping", "fetch", "product search", "custom field mapping", "Elasticsearch decorator"]
summary: "3-step guide to add a custom searchable field to product Elasticsearch search: decorate definition, reindex, add search config migration."
lastBuilt: "2026-09-15"
---
## What it is

This page documents adding a new searchable field (example: `productNumberPrefix`) to product or any Elasticsearch definition, in 3 steps.

## When to use

Use when a plugin needs to make an additional field searchable via Elasticsearch/Advanced Search.

## Key steps / config

1. **Decorate the ElasticsearchDefinition** by extending `AbstractElasticsearchDefinition` and decorating `Shopware\Elasticsearch\Product\ElasticsearchProductDefinition`:

```xml
<service id="YourPluginNameSpace\ElasticsearchProductDefinitionDecorator" decorates="Shopware\Elasticsearch\Product\ElasticsearchProductDefinition">
    <argument type="service" id=".inner"/>
    <argument type="service" id="Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic"/>
</service>
```

The decorator overrides `getMapping()` (adds `'prefixProductNumber' => self::KEYWORD_FIELD` to `properties`) and `fetch()` (adds the derived value to each document).

2. **Run the commands** to update the mapping and reindex:

```bash
bin/console es:mapping:update
bin/console es:index --no-queue
```

`es:mapping:update` is available since 6.5.4.0.

3. **Insert the new field** into `advanced_search_config_field` via a migration extending `MigrationStep`, using `bin/console database:create-migration --name <Name> --plugin YourPlugin`, inserting a row referencing `AdvancedSearchConfigFieldDefinition::ENTITY_NAME` with `field`, `config_id`, `entity`, `tokenize`, `searchable`, `ranking`.

## Essential identifiers

- `Shopware\Elasticsearch\Product\ElasticsearchProductDefinition`
- `AbstractElasticsearchDefinition`
- `bin/console es:mapping:update`
- `bin/console es:index --no-queue`
- `bin/console database:create-migration`
- `advanced_search_config_field` table
- `AdvancedSearchConfigFieldDefinition::ENTITY_NAME`
