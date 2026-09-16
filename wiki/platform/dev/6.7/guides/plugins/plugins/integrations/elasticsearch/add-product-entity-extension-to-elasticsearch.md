---
id: platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md
title: Add Product Entity Extension to Elasticsearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.html
sourceHash: 8db8d1687d358fb0dbecbc88428be823766e4353
codeCheckedAgainst: "6.7.13.0"
keywords: ["elasticsearch", "ElasticsearchProductDefinition", "AbstractElasticsearchDefinition", "EntityExtension", "EntityDefinition", "getMapping", "fetch", "KEYWORD_FIELD", "shopware.entity.extension", "shopware.entity.definition", "OneToOneAssociationField", "OneToManyAssociationField", "decorate", "search index mapping", "product extension"]
summary: "Index product entity extensions in Elasticsearch by decorating ElasticsearchProductDefinition: extend getMapping() and fill values in fetch()"
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to make fields added to the `product` entity through an entity extension searchable in Elasticsearch: register the extension and its association definitions, then decorate `Shopware\Elasticsearch\Product\ElasticsearchProductDefinition` to add the fields to the index mapping and fill them in the indexed documents.

## When to use

You extended `ProductDefinition` with a plain field, a `OneToOneAssociationField` or a `OneToManyAssociationField` (see [Adding complex data to existing entities](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md)) and those values must be searchable in Elasticsearch.

## Key steps / config

1. Register services:
   ```php
   $services->set(CustomExtension::class)->tag('shopware.entity.extension');
   $services->set(OneToOneExampleExtensionDefinition::class)
       ->tag('shopware.entity.definition', ['entity' => 'one_to_one_swag_example_extension']);
   $services->set(MyProductEsDecorator::class)
       ->decorate(ElasticsearchProductDefinition::class)
       ->args([service(MyProductEsDecorator::class . '.inner'), service(Connection::class)]);
   ```
   (`OneToManyExampleExtensionDefinition` is tagged the same way with entity `one_to_many_swag_example_extension`.)
2. Entity extension — the target entity is named via `getEntityName()`:
   ```php
   class CustomExtension extends EntityExtension
   {
       public function extendFields(FieldCollection $collection): void { /* associations with ApiAware; ObjectField 'customString' with Runtime */ }
       public function getEntityName(): string { return ProductDefinition::ENTITY_NAME; }
   }
   ```
3. The two association definitions extend `EntityDefinition`, declaring `getEntityName()` and `defineFields()` (`IdField`, `FkField('product_id', 'productId', ProductDefinition::class)`, `ReferenceVersionField`, `StringField('custom_string', 'customString')`, association back to `product`).
4. `MyProductEsDecorator extends AbstractElasticsearchDefinition`; delegate `getEntityDefinition()` and `buildTermQuery()` to the inner definition.
5. `getMapping(Context $context)`: take the inner mapping, then add
   ```php
   $mapping['properties']['customString'] = AbstractElasticsearchDefinition::KEYWORD_FIELD;
   $mapping['properties']['oneToOneExampleExtension'] = ['type' => 'nested', 'properties' => ['customString' => AbstractElasticsearchDefinition::KEYWORD_FIELD]];
   $mapping['properties']['oneToManyExampleExtension'] = ['type' => 'nested', 'properties' => ['id' => AbstractElasticsearchDefinition::KEYWORD_FIELD]];
   ```
6. `fetch(array $ids, Context $context)`: call the inner `fetch()`, load association data with one query per association for all ids (`fetchAllKeyValue`, `Connection::PARAM_STR_ARRAY`), then set on each document `customString` (the value your runtime logic assigns), `oneToOneExampleExtension.customString`, and `oneToManyExampleExtension` as a list of `['id' => ...]`.

## Essential identifiers

- `Shopware\Elasticsearch\Product\ElasticsearchProductDefinition`, `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition`, `KEYWORD_FIELD`
- `getMapping()`, `fetch()`, `buildTermQuery()`, `getEntityDefinition()`
- `EntityExtension::getEntityName()`, `EntityDefinition::defineFields()`
- Tags `shopware.entity.extension`, `shopware.entity.definition`; flags `ApiAware`, `Runtime`

## Gotchas

- Always extend the inner mapping/documents; replacing them drops the default product index data.
- `Runtime` fields are not searchable by themselves; the document value must be set in `fetch()`.
- The source's `CustomExtension` implements `getDefinitionClass()`, which does not exist in 6.7 — use `getEntityName()`. Its `ProductSubscriber::getRuntimeValue()` is an unshown example-plugin helper, not Shopware API.

## Code check (6.7.13.0)
- absent `getDefinitionClass` — not on EntityExtension in the installed code; replaced by getEntityName()
- absent `getRuntimeValue` — example-plugin helper, not in the installed code
- corrected `EntityExtension::getEntityName()` — docs: extension implements getDefinitionClass() — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:46
- confirmed `EntityExtension::extendFields()` — optional hook with empty default body — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:18
- confirmed `EntityDefinition::getEntityName()` — abstract, must be declared — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:130
- confirmed `EntityDefinition::defineFields()` — abstract protected, must be declared — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:458
- confirmed `shopware.entity.extension` — tag collected for entity extensions — vendor/shopware/core/System/DependencyInjection/CompilerPass/SalesChannelEntityCompilerPass.php:232
- confirmed `ProductDefinition::ENTITY_NAME` — value 'product' — vendor/shopware/core/Content/Product/ProductDefinition.php:85
- confirmed `Runtime` — DAL field flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Runtime.php:12
- unverified `ElasticsearchProductDefinition` — shopware/elasticsearch package, out of scope (AbstractElasticsearchDefinition, KEYWORD_FIELD likewise)
