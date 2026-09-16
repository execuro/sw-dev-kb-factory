---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md
title: Adding Complex Data to Existing Entities
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.html
sourceHash: be067c63c1c4e44b483a912ffc4fa976e13feb84
codeCheckedAgainst: "6.7.13.0"
keywords: ["entity extension", "EntityExtension", "extendFields", "getEntityName", "shopware.entity.extension", "BulkEntityExtension", "shopware.bulk.entity.extension", "OneToOneAssociationField", "CascadeDelete", "addExtension", "ArrayEntity", "ProductEvents::PRODUCT_LOADED_EVENT", "extend product entity", "association"]
summary: Extend core entities (e.g. product) via EntityExtension with a OneToOne-associated table, runtime addExtension data, or a BulkEntityExtension.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/resources/references/adr/2020-07-02-control-clone-behavior.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

Entity extensions add fields (including associations and non-scalar data) to existing entities such as `product`. They are technical, not admin-configurable. Data is either persisted in a separate plugin table associated to the entity, or attached at runtime without a database.

## When to use

- You need associations or complex data on a core entity (custom fields cover mostly scalar, admin-configurable values).
- You want to add runtime data when an entity is loaded.
- You must extend many entities at once (bulk extension).

## Key steps / config

### 1. Extension class

Extend `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension` (e.g. `src/Extension/Content/Product/CustomExtension.php`). The installed abstract member is `getEntityName()`; add fields in `extendFields()`.

```php
class CustomExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add((new OneToOneAssociationField('exampleExtension', 'id', 'product_id', ExampleExtensionDefinition::class, true))->addFlags(new CascadeDelete()));
    }

    public function getEntityName(): string { return ProductDefinition::ENTITY_NAME; }
}
```

Register: `$services->set(CustomExtension::class)->tag('shopware.entity.extension');` (`EntityExtension` subclasses are also autoconfigured with this tag).

`OneToOneAssociationField` arguments: `propertyName`, `storageName` (product `id`), `referenceField` (`product_id` in your table), `referenceClass`, `autoload` (default `true`).

### 2. With a database

You must not add columns to `product`; create a new table and definition:

```php
class ExampleExtensionDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'swag_example_extension';
    public function getEntityName(): string { return self::ENTITY_NAME; }
    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            new FkField('product_id', 'productId', ProductDefinition::class),
            new StringField('custom_string', 'customString'),
            new ReferenceVersionField(ProductDefinition::class, 'product_version_id'),
            new OneToOneAssociationField('product', 'product_id', 'id', ProductDefinition::class, false),
        ]);
    }
}
```

Register with `->tag('shopware.entity.definition', ['entity' => 'swag_example_extension'])`. The migration (`MigrationStep` with `getCreationTimestamp()` and `update()`) creates `swag_example_extension` (`id`, `product_id`, `product_version_id`, `custom_string`, `created_at`, `updated_at`) with `UNIQUE (product_id, product_version_id)` and a foreign key to `product (id, version_id)` `ON DELETE CASCADE ON UPDATE CASCADE`.

Write through the product repository: `upsert([['id' => $productId, 'exampleExtension' => ['customString' => 'foo bar']]], $context)`.

### 3. Without a database

Subscribe to `ProductEvents::PRODUCT_LOADED_EVENT` (tag `kernel.event_subscriber`); in the `EntityLoadedEvent` handler call `$productEntity->addExtension('custom_string', new ArrayEntity(['foo' => 'bar']));` — the value must be a `Struct`, not a scalar.

### 4. Bulk entity extensions (since 6.6.10.0)

Extend `Shopware\Core\Framework\DataAbstractionLayer\BulkEntityExtension`, implement `collect(): \Generator` yielding `EntityName => [fields...]` (e.g. `yield ProductDefinition::ENTITY_NAME => [new FkField('main_category_id', 'mainCategoryId', CategoryDefinition::class)];`), and tag it `shopware.bulk.entity.extension`.

## Essential identifiers

- `EntityExtension` — `getEntityName()`, `extendFields()`, `modifyFields()`, `extendProtections()`
- `BulkEntityExtension` — `collect()`
- Tags: `shopware.entity.extension`, `shopware.bulk.entity.extension`, `shopware.entity.definition`
- `OneToOneAssociationField`, `FkField`, `ReferenceVersionField`, `CascadeDelete`
- `Shopware\Core\Content\Product\ProductEvents`, `EntityLoadedEvent`, `addExtension()`, `Shopware\Core\Framework\Struct\ArrayEntity`

## Gotchas

- The source's snippets implement `getDefinitionClass()` returning `ProductDefinition::class`; the installed `EntityExtension` has no such method and requires `getEntityName()` instead.
- `CascadeDelete` associations are included when cloning a product; use `new CascadeDelete(false)` or drop the flag to exclude them ([clone behaviour](platform/dev/6.7/resources/references/adr/2020-07-02-control-clone-behavior.md)).
- `ReferenceVersionField` / `product_version_id` are only needed when extending a versioned entity.
- The inverse `OneToOneAssociationField` swaps storage/reference columns; order matters.
- `BulkEntityExtension` has a final, argument-less constructor — no injected dependencies.

## Code check (6.7.13.0)
- absent `getDefinitionClass` — not declared anywhere in the installed code index; replaced by getEntityName()
- corrected `EntityExtension::getEntityName()` — docs: implement getDefinitionClass returning ProductDefinition::class — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:46
- confirmed `EntityExtension::extendFields()` — overridable, empty by default — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:18
- confirmed `BulkEntityExtension::collect()` — abstract generator; constructor final — vendor/shopware/core/Framework/DataAbstractionLayer/BulkEntityExtension.php:21
- confirmed `shopware.entity.extension` — autoconfigured for EntityExtension subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:74
- confirmed `shopware.bulk.entity.extension` — autoconfigured for BulkEntityExtension subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:78
- confirmed `OneToOneAssociationField` — args propertyName, storageName, referenceField, referenceClass, autoload=true — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:10
- confirmed `CascadeDelete` — constructor cloneRelevant defaults to true — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/CascadeDelete.php:11
- confirmed `ExtendableTrait::addExtension()` — value must be a Struct — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, with update() — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
