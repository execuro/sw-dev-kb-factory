---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md
sourceHash: 21a465105e6635bc3ef63dd89e0289ab54296a94
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/field-inheritance.html
title: Field Inheritance
version: "6.7"
versions:
  - "6.7"
keywords: ["field inheritance", "ParentFkField", "ParentAssociationField", "ChildrenAssociationField", "isInheritanceAware", "Inherited", "InheritanceUpdaterTrait", "updateInheritance", "parent_id", "parent child entity", "variant inheritance", "translation inheritance", "association inheritance"]
summary: "Make custom DAL entity fields, translations and associations inherit from a parent: ParentFkField, isInheritanceAware(), Inherited flag, updateInheritance."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md"]
---
## What it is

How to let a custom DAL entity inherit field values (and translations and associations) from a parent entity of the same definition, as products do with variants.

## When to use

You have a custom entity (e.g. `swag_example`) and want child records to fall back to the parent's values whenever their own value is `null`.

## Key steps / config

1. **Make inheritable columns nullable and add `parent_id`** in a migration (see [Database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)):
   ```php
   class Migration1615363012MakeInheritedColumnsNullable extends MigrationStep
   {
       public function getCreationTimestamp(): int { return 1615363012; }
       public function update(Connection $connection): void
       {
           $connection->executeStatement('ALTER TABLE `swag_example`
               ADD `parent_id` BINARY(16) NULL, MODIFY `description` VARCHAR(255) NULL');
       }
   }
   ```
2. **Add the parent/children fields** to `defineFields()`, all referencing `self::class`:
   `Shopware\Core\Framework\DataAbstractionLayer\Field\ParentFkField`, `Shopware\Core\Framework\DataAbstractionLayer\Field\ParentAssociationField`, `Shopware\Core\Framework\DataAbstractionLayer\Field\ChildrenAssociationField`.
   ```php
   new ParentFkField(self::class),              // storage parent_id, property parentId
   new ParentAssociationField(self::class, 'id'), // property parent
   new ChildrenAssociationField(self::class),     // property children
   ```
3. **Enable inheritance**: override `isInheritanceAware(): bool` in the definition to return `true` (base returns `false`).
4. **Flag inheritable fields** with `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Inherited`, e.g. `(new StringField('name', 'name'))->addFlags(new Inherited())`.
5. **Entity class**: add `?self $parent`, `?string $parentId`, `?ExampleCollection $children` with getters/setters.

**Translations**: add `Inherited` to each `TranslatedField` and to the `TranslationsAssociationField`. Lookup order for a child with language de-CH inheriting de-DE: child de-CH, child de-DE, parent de-CH, parent de-DE.

**Association inheritance**: flag both the `FkField` (e.g. `tax_id`) and the `ManyToOneAssociationField` (`tax`) with `Inherited`. In the migration, add the FK column, then `use InheritanceUpdaterTrait;` and call `$this->updateInheritance($connection, 'swag_example', 'tax');`.

## Essential identifiers

- `ParentFkField`, `ParentAssociationField`, `ChildrenAssociationField`
- `EntityDefinition::isInheritanceAware()`
- `Inherited` flag
- `Shopware\Core\Framework\Migration\InheritanceUpdaterTrait` / `updateInheritance(Connection, string $entity, string $propertyName)`
- `MigrationStep::getCreationTimestamp()`, `MigrationStep::update()`

## Gotchas

- `ParentFkField` is hard-wired to the `parent_id` column; the table column must use that name.
- `updateInheritance` adds a hidden `binary(16) NULL` column named after the association property (here `tax`). It stores the resolved join reference (for ToOne: the referenced entity id; for ToMany: the base entity id, parent's if inherited). It is required for inheritance to work, allows a child to override with `null`, and is not visible in the definition or entity.
- `ChildrenAssociationField` adds `CascadeDelete` itself: deleting a parent deletes its children.
- The source's association migration SQL contains a stray trailing `'` after `ON UPDATE CASCADE`; remove it.

## Code check (6.7.13.0)
- confirmed `ParentFkField` — constructor fixes storage `parent_id`, property `parentId` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ParentFkField.php:8
- confirmed `ParentAssociationField` — `$referenceField` defaults to `'id'`, property `parent` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ParentAssociationField.php:8
- confirmed `ChildrenAssociationField` — property `children`, adds `CascadeDelete` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ChildrenAssociationField.php:9
- confirmed `EntityDefinition::isInheritanceAware()` — base returns false — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:371
- confirmed `Inherited` — flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Inherited.php:11
- confirmed `InheritanceUpdaterTrait::updateInheritance()` — adds binary(16) NULL column named after property — vendor/shopware/core/Framework/Migration/InheritanceUpdaterTrait.php:11
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, required — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, required — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
