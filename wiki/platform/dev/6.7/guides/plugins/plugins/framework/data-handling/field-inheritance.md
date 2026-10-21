---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md
title: Field Inheritance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/field-inheritance.html
sourceHash: 21a465105e6635bc3ef63dd89e0289ab54296a94
codeCheckedAgainst: "6.7.15.1"
keywords: ["field inheritance", "parent child entity", "variants", "ParentFkField", "ParentAssociationField", "ChildrenAssociationField", "isInheritanceAware", "Inherited", "InheritanceUpdaterTrait", "updateInheritance", "association inheritance", "translation inheritance", "parent_id"]
summary: "DAL field inheritance: parent_id column, ParentFkField/ParentAssociationField/ChildrenAssociationField, isInheritanceAware, Inherited flag."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md"]
---
## What it is

How to let child records of a custom DAL entity inherit field values, translations and associations from a parent record of the same entity (the mechanism product variants use).

## When to use

Your custom entity (e.g. `swag_example`) has parent/child records and children should fall back to the parent's value when their own value is `null`.

## Key steps / config

1. **Migration** (see [Database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)): add `parent_id BINARY(16) NULL` and make every inheritable column nullable.

```php
class Migration1615363012MakeInheritedColumnsNullable extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1615363012; }
    public function update(Connection $connection): void
    {
        $connection->executeStatement('ALTER TABLE `swag_example` ADD `parent_id` BINARY(16) NULL, MODIFY `description` VARCHAR(255) NULL;');
    }
}
```

2. **Definition fields** (all referencing `self::class`): `new ParentFkField(self::class)` (always maps column `parent_id` / property `parentId`), `new ParentAssociationField(self::class, 'id')`, `new ChildrenAssociationField(self::class)` (property `children`). FQCNs: `Shopware\Core\Framework\DataAbstractionLayer\Field\ParentFkField`, `...\Field\ParentAssociationField`, `...\Field\ChildrenAssociationField`.
3. **Enable inheritance**: override `public function isInheritanceAware(): bool { return true; }` in the definition (default `false`).
4. **Flag fields** with `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Inherited`, e.g. `(new StringField('name', 'name'))->addFlags(new Inherited())`.
5. **Entity class**: add `?self $parent`, `?string $parentId`, `?ExampleCollection $children` with getters/setters.
6. **Translations**: add `Inherited` to `TranslatedField` and to the `TranslationsAssociationField`, e.g. `(new TranslationsAssociationField(ExampleTranslationDefinition::class, 'swag_example_id'))->addFlags(new Inherited())`. Lookup order for de-CH inheriting de-DE: child de-CH, child de-DE, parent de-CH, parent de-DE.
7. **Association inheritance**: flag both the FK and the association, e.g. `(new FkField('tax_id', 'taxId', TaxDefinition::class))->addFlags(new Inherited())` and `(new ManyToOneAssociationField('tax', 'tax_id', TaxDefinition::class, 'id'))->addFlags(new Inherited())`. In the migration add the `tax_id` column/FK, `use InheritanceUpdaterTrait;` (`Shopware\Core\Framework\Migration\InheritanceUpdaterTrait`) and call `$this->updateInheritance($connection, 'swag_example', 'tax');`.

## Essential identifiers

- `ParentFkField`, `ParentAssociationField`, `ChildrenAssociationField`
- `EntityDefinition::isInheritanceAware()`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Inherited`
- `Shopware\Core\Framework\Migration\InheritanceUpdaterTrait::updateInheritance()`
- `Shopware\Core\Framework\Migration\MigrationStep`

## Gotchas

- `updateInheritance()` adds an internal "inheritance column" named after the association property (here a nullable `binary(16)` column `tax` on `swag_example`). The DAL stores the resolved join id there (for ToOne: the referenced entity's id; for ToMany: parent id if inherited, own id if not). It allows a child to override with `null` and avoids extra parent queries; it is not part of the definition or entity class.
- The guide's translation snippet calls `new TranslationsAssociationField(ExampleTranslationDefinition::class)` with one argument; in 6.7.15.1 the second `referenceField` argument has no default and is required.
- The guide's association migration SQL ends with a stray `'` after `ON UPDATE CASCADE`; remove it.
- Inheritable columns must be nullable, otherwise a child cannot leave them empty.

## Code check (6.7.15.1)
- confirmed `ParentFkField` — constructor takes only referenceClass, fixed column parent_id — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ParentFkField.php:10
- confirmed `ParentAssociationField` — (referenceClass, referenceField = 'id') — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ParentAssociationField.php:8
- confirmed `ChildrenAssociationField` — propertyName defaults to 'children' — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ChildrenAssociationField.php:9
- confirmed `EntityDefinition::isInheritanceAware()` — returns false by default — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:389
- confirmed `Inherited` — field flag, optional foreignKey override — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Inherited.php:11
- confirmed `InheritanceUpdaterTrait::updateInheritance()` — adds nullable binary(16) column named after the property — vendor/shopware/core/Framework/Migration/InheritanceUpdaterTrait.php:11
- corrected `TranslationsAssociationField` — docs: constructed with only the definition class; referenceField has no default — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslationsAssociationField.php:10
- confirmed `MigrationStep::getCreationTimestamp()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
