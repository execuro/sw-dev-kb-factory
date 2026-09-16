---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md
title: Adding complex data to existing entities
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.html
sourceHash: d7e1ff09d754db903816b91c1e2a9dc27e97a9b3
keywords: ["EntityExtension", "extendFields", "getDefinitionClass", "OneToOneAssociationField", "shopware.entity.extension", "shopware.entity.definition", "ProductEvents::PRODUCT_LOADED_EVENT", "addExtension", "BulkEntityExtension", "shopware.bulk.entity.extension", "ReferenceVersionField", "FkField"]
summary: "Extend an existing entity (e.g. product) with a new field, either backed by a database table or added at runtime via a DAL event."
lastBuilt: "2026-09-15"
---
## What it is

Guide for extending an existing entity, such as `product`, with custom data via an entity extension class — either persisted in a new table (with an association) or added at runtime without a database column.

## When to use

When custom information (technical, not admin-configurable, and possibly non-scalar) needs to be attached to an existing entity such as `product`.

## Key steps / config

Create an extension class extending `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension`, implementing `getDefinitionClass()` (points to the entity being extended, e.g. `ProductDefinition::class`) and `extendFields(FieldCollection $collection)`. Register it with the `shopware.entity.extension` tag.

**With a database table:** add a `OneToOneAssociationField('exampleExtension', 'id', 'product_id', ExampleExtensionDefinition::class, true)` in `extendFields`, and create `ExampleExtensionDefinition` (with `IdField`, `FkField('product_id', ...)`, a `StringField`, a `ReferenceVersionField(ProductDefinition::class, 'product_version_id')` for versioned entities, and the inverse `OneToOneAssociationField`). Register the definition with `shopware.entity.definition entity="swag_example_extension"`, and create the matching migration/table with `product_id`, `product_version_id`, foreign keys. Write via:

```php
$this->productRepository->upsert([[
    'id' => '<product ID>',
    'exampleExtension' => ['customString' => 'foo bar']
]], $context);
```

**Without a database table (runtime only):** subscribe to `Shopware\Core\Content\Product\ProductEvents::PRODUCT_LOADED_EVENT` and call `$productEntity->addExtension('custom_string', new ArrayEntity([...]))` in the listener; register the subscriber with `kernel.event_subscriber`. Extension values added this way must be a `Struct`, not a scalar.

**Bulk extensions (since Shopware 6.6.10.0):** register a `BulkEntityExtension` subclass implementing `collect(): \Generator`, yielding `EntityName::ENTITY_NAME => [fields...]` per entity, tagged `shopware.bulk.entity.extension`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\OneToOneAssociationField`
- `Shopware\Core\Content\Product\ProductEvents::PRODUCT_LOADED_EVENT`
- `shopware.entity.extension`, `shopware.entity.definition`, `shopware.bulk.entity.extension` tags
- `BulkEntityExtension::collect()`

## Gotchas

Setting `autoload` to `true` on both the `EntityExtension` and the `EntityDefinition` for the same association leads to recursion / out-of-memory errors; only set it in the extension if the association should load automatically. `addExtension`'s value parameter must be a struct, not a scalar or plain string.

## Version notes

Bulk entity extensions (`BulkEntityExtension`, `shopware.bulk.entity.extension`) are available since Shopware 6.6.10.0.
