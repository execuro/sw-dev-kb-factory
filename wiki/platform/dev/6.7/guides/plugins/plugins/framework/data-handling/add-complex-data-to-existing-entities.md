---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md
title: Adding Complex Data to Existing Entities
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.html
sourceHash: 6b3a88c059e84bbed1bcb3568353657859f86785
codeCheckedAgainst: "6.7.15.1"
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md
  - platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
  - platform/dev/6.7/resources/references/adr/2020-07-02-control-clone-behavior.md
  - platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
keywords: ["EntityExtension", "extendFields", "BulkEntityExtension", "shopware.entity.extension", "shopware.bulk.entity.extension", "OneToOneAssociationField", "CascadeDelete", "ReferenceVersionField", "addExtension", "ProductEvents::PRODUCT_LOADED_EVENT", "entity extension", "extend product entity", "add field to existing entity"]
summary: Extend core entities like product via EntityExtension (OneToOne to own table or runtime addExtension) or BulkEntityExtension.
lastBuilt: 2026-10-21
---
## What it is

How to attach plugin data to an existing (core) entity, e.g. `product`, through a DAL entity extension. Extensions are technical (not admin-configurable) and can hold complex types and associations, unlike custom fields. Two variants: persisted in an own table via an association, or added at load time without a database.

## When to use

You need extra data or an association on a core entity. Use custom fields instead when the admin user should configure scalar values in the Administration.

## Key steps / config

### 1. Extension class

`<plugin root>/src/Extension/Content/Product/CustomExtension.php`, extending `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension`. `getEntityName()` is abstract (return the extended entity, `ProductDefinition::ENTITY_NAME`); add fields by overriding `extendFields()`:

```php
class CustomExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add(
            (new OneToOneAssociationField('exampleExtension', 'id', 'product_id', ExampleExtensionDefinition::class, true))
                ->addFlags(new CascadeDelete())
        );
    }

    public function getEntityName(): string { return ProductDefinition::ENTITY_NAME; }
}
```

Register in `services.php`: `$services->set(CustomExtension::class)->tag('shopware.entity.extension');`

`OneToOneAssociationField` arguments: `propertyName` (camelCase), `storageName` (`id` of product), `referenceField` (`product_id` in your table), `referenceClass`, `autoload`.

### 2. With a database: own definition + table

Never add a column to the `product` table; create a new table linked one-to-one. `ExampleExtensionDefinition` extends `EntityDefinition` (`ENTITY_NAME = 'swag_example_extension'`), implements `getEntityName()` and `defineFields()`, optionally `getEntityClass()`. Fields:

```php
(new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
new FkField('product_id', 'productId', ProductDefinition::class),
new StringField('custom_string', 'customString'),
new ReferenceVersionField(ProductDefinition::class, 'product_version_id'), // only for versioned entities
new OneToOneAssociationField('product', 'product_id', 'id', ProductDefinition::class, false)
```

The inverse association swaps storage/reference columns and uses `autoload` `false`. Register with `->tag('shopware.entity.definition', ['entity' => 'swag_example_extension'])`.

Migration `Migration1614903457ExampleExtension extends MigrationStep` with `getCreationTimestamp()` and `update(Connection $connection)`, creating `swag_example_extension` (`id`, `product_id`, `product_version_id`, `custom_string`, `created_at`, `updated_at`) with a unique key on (`product_id`, `product_version_id`) and a foreign key to `product` (`id`, `version_id`) `ON DELETE CASCADE`.

Write via the product repository using the extension property name:

```php
$this->productRepository->upsert([[
    'id' => '<product id>',
    'exampleExtension' => ['customString' => 'foo bar'],
]], $context);
```

### 3. Without a database

Subscribe to `ProductEvents::PRODUCT_LOADED_EVENT` (class `Shopware\Core\Content\Product\ProductEvents`), loop `$event->getEntities()` and call `$productEntity->addExtension('custom_string', new ArrayEntity(['foo' => 'bar']))`; register the subscriber with tag `kernel.event_subscriber`.

### 4. Bulk entity extensions (since 6.6.10.0)

Extend `Shopware\Core\Framework\DataAbstractionLayer\BulkEntityExtension` and implement `collect(): \Generator`, yielding entity name => field array:

```php
public function collect(): \Generator
{
    yield ProductDefinition::ENTITY_NAME => [new FkField('main_category_id', 'mainCategoryId', CategoryDefinition::class)];
    yield CategoryDefinition::ENTITY_NAME => [/* fields */];
}
```

Tag it `shopware.bulk.entity.extension`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension` (`getEntityName()`, `extendFields()`)
- `Shopware\Core\Framework\DataAbstractionLayer\BulkEntityExtension` (`collect()`)
- Tags `shopware.entity.extension`, `shopware.bulk.entity.extension`, `shopware.entity.definition`
- `OneToOneAssociationField`, `FkField`, `ReferenceVersionField`, `CascadeDelete`
- `Shopware\Core\Content\Product\ProductEvents::PRODUCT_LOADED_EVENT`, `Shopware\Core\Framework\Struct\ArrayEntity`

## Gotchas

- `addExtension()` requires a `Struct` value, not a scalar; wrap scalars in `ArrayEntity`.
- `CascadeDelete` associations are included when cloning (`cloneRelevant` defaults to `true`); use `new CascadeDelete(false)` or drop the flag to exclude them. See [clone behaviour](platform/dev/6.7/resources/references/adr/2020-07-02-control-clone-behavior.md).
- `OneToOneAssociationField` autoloads by default (`autoload = true`); pass `false` explicitly on the inverse side in the extension definition to avoid loading the product from the extension entity.
- `ReferenceVersionField` and `product_version_id` are only needed when the extended entity is versioned (as `product` is). The source's definition snippet omits the `ReferenceVersionField` import; the bulk snippet omits imports for `BulkEntityExtension`, `FkField`, `ManyToOneAssociationField`.
- Add foreign key constraints in the migration so extension rows are removed with the product.
- Classes extending `EntityDefinition`, `EntityExtension` or `BulkEntityExtension` get their tag automatically when the service is autoconfigured; explicit tags are needed otherwise.

## Version notes

`BulkEntityExtension` is available since Shopware 6.6.10.0.

## Code check (6.7.15.1)
- confirmed `EntityExtension::getEntityName()` — abstract, must be implemented — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:48
- confirmed `EntityExtension::extendFields()` — overridable, receives the `FieldCollection` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:18
- confirmed `BulkEntityExtension::collect()` — abstract, returns `\Generator` — vendor/shopware/core/Framework/DataAbstractionLayer/BulkEntityExtension.php:21
- confirmed `shopware.entity.extension` — autoconfigured tag for `EntityExtension` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:75
- confirmed `shopware.bulk.entity.extension` — autoconfigured tag for `BulkEntityExtension` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:79
- confirmed `shopware.entity.definition` — autoconfigured tag for `EntityDefinition` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:59
- confirmed `OneToOneAssociationField::__construct()` — `(propertyName, storageName, referenceField, referenceClass, autoload = true)` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:17
- confirmed `CascadeDelete::__construct()` — `cloneRelevant` defaults to `true` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/CascadeDelete.php:13
- confirmed `ReferenceVersionField::__construct()` — `(string $definition, ?string $storageName = null)` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ReferenceVersionField.php:19
- confirmed `ExtendableTrait::addExtension()` — second argument typed `Struct` — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
