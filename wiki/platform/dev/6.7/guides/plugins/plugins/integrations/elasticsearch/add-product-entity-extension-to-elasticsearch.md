---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
sourceHash: 33247c52d5f1e10223a643c96cebb912911bd635
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.html
title: Add Product Entity Extension to Elasticsearch
version: "6.7"
versions:
  - "6.7"
keywords: ["ElasticsearchProductDefinition", "AbstractElasticsearchDefinition", "EntityExtension", "EntityDefinition", "OneToOneAssociationField", "OneToManyAssociationField", "ApiAware", "Runtime", "getMapping", "fetch", "shopware.entity.extension", "elasticsearch mapping", "opensearch", "product search index", "decorator"]
summary: Decorate ElasticsearchProductDefinition to add product entity extension fields and associations to the Elasticsearch mapping and indexed documents.
lastBuilt: 2026-10-21
---
## What it is

How to make fields added to the product entity via an `EntityExtension` searchable in Elasticsearch, by decorating `Shopware\Elasticsearch\Product\ElasticsearchProductDefinition`. The example extends the product with a runtime string `customString`, a `OneToOneAssociationField` (`oneToOneExampleExtension`) and a `OneToManyAssociationField` (`oneToManyExampleExtension`).

## When to use

You have extended `ProductDefinition` (see [Adding complex data to existing entities](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md)) and need those values in the product search index. Builds on the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## Key steps / config

1. Register the extension, the extension definitions, the subscriber and the decorator:

```php
$services->set(CustomExtension::class)->tag('shopware.entity.extension');
$services->set(OneToOneExampleExtensionDefinition::class)
    ->tag('shopware.entity.definition', ['entity' => 'one_to_one_swag_example_extension']);
$services->set(OneToManyExampleExtensionDefinition::class)
    ->tag('shopware.entity.definition', ['entity' => 'one_to_many_swag_example_extension']);
$services->set(MyProductEsDecorator::class)
    ->decorate(ElasticsearchProductDefinition::class)
    ->args([service(MyProductEsDecorator::class . '.inner'), service(Connection::class)]);
```

2. In the `EntityExtension`, flag associations with `ApiAware` so they can be indexed; `Runtime` fields are not searchable:

```php
class CustomExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void { /* OneToOne/OneToMany + ApiAware, ObjectField + Runtime */ }
    public function getEntityName(): string { return ProductDefinition::ENTITY_NAME; }
}
```

3. Each association target is an `EntityDefinition` (`IdField` + `FkField('product_id', 'productId', ProductDefinition::class)` + `ReferenceVersionField(ProductDefinition::class)` + `StringField('custom_string', 'customString')` + back-reference):

```php
class OneToManyExampleExtensionDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'one_to_many_swag_example_extension';
    public function getEntityName(): string { return self::ENTITY_NAME; }
    protected function defineFields(): FieldCollection { /* ... */ }
}
```

4. `MyProductEsDecorator extends AbstractElasticsearchDefinition`, wraps the inner definition and delegates `getEntityDefinition()` and `buildTermQuery()`.
5. `getMapping(Context $context)`: call the inner `getMapping()` first, then add properties — `customString` as `AbstractElasticsearchDefinition::KEYWORD_FIELD`; associations as `'type' => 'nested'` with their own `properties`.
6. `fetch(array $ids, Context $context)`: call the inner `fetch()`, then load extra data with a single query over all ids (`array_column($documents, 'id')`) via `Connection::fetchAllKeyValue` and map values onto each document (`oneToOneExampleExtension.customString`, `oneToManyExampleExtension` as a list of `['id' => ...]`). The runtime `customString` must be filled with the same value the `ProductSubscriber` sets at load time.

## Essential identifiers

- `Shopware\Elasticsearch\Product\ElasticsearchProductDefinition`, `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition`
- `AbstractElasticsearchDefinition::KEYWORD_FIELD`, `getMapping()`, `fetch()`, `buildTermQuery()`, `getEntityDefinition()`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension`, `EntityDefinition`
- `OneToOneAssociationField`, `OneToManyAssociationField`, `ObjectField`, `ApiAware`, `Runtime`
- Tags `shopware.entity.extension`, `shopware.entity.definition`, `kernel.event_subscriber`

## Gotchas

- The source decorator calls `ProductSubscriber::getRuntimeValue($document['id'])` — that is a helper of the example plugin's own subscriber, not a Shopware API; it is not defined anywhere in the installed code. Implement your own way of computing the runtime value.
- The source `CustomExtension` snippet uses `ApiAware` without importing `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware`, and the decorator uses `Criteria`/`BoolQuery` without imports — add them.
- Always start from the inner mapping/documents; replacing them drops the core product index fields.

## Code check (6.7.15.1)
- absent `getRuntimeValue` — example-plugin helper on `ProductSubscriber`, not present in the installed code
- confirmed `EntityExtension::getEntityName()` — abstract, must be implemented — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:48
- confirmed `EntityExtension::extendFields()` — overridable hook taking a `FieldCollection` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:18
- confirmed `EntityDefinition::getEntityName()` — abstract — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:143
- confirmed `EntityDefinition::defineFields()` — abstract protected — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:476
- confirmed `shopware.entity.extension` — also added automatically by autoconfiguration for `EntityExtension` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:75
- confirmed `OneToOneAssociationField` — constructor (propertyName, storageName, referenceField, referenceClass, autoload = true) — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:13
- confirmed `OneToManyAssociationField` — constructor (propertyName, referenceClass, referenceField, localField = 'id') — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToManyAssociationField.php:15
- confirmed `Runtime` — DAL field flag — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Runtime.php:12
- unverified `AbstractElasticsearchDefinition` — lives in the shopware/elasticsearch package, outside the checked roots
