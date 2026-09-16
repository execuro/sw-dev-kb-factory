---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/field-inheritance.md
title: Field inheritance
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/field-inheritance.html
sourceHash: 88f79fcd9e10808c0cb8239e63bacf2e4db0f41f
keywords: ["field inheritance", "ParentFkField", "ParentAssociationField", "ChildrenAssociationField", "isInheritanceAware", "Inherited flag", "inheritance columns", "updateInheritance", "InheritanceUpdaterTrait", "parent_id", "association inheritance", "translation inheritance"]
summary: "Explains how to make entity fields and associations inherit values from a parent entity using the Inherited flag and DAL inheritance fields."
lastBuilt: "2026-09-15"
---
## What it is
Field inheritance lets an entity's fields (and associations) inherit values from a parent entity when the child's own value is not set.

## When to use
Use when a custom entity needs a parent/child relationship where child rows should fall back to parent values for certain fields (e.g. variant-style entities).

## Key steps / config
1. Make the fields you want inheritable nullable in the migration, and add a `parent_id` column:
```sql
ALTER TABLE `swag_example` ADD `parent_id` BINARY(16) NULL;
ALTER TABLE `swag_example` MODIFY `description` VARCHAR(255) NULL;
```
2. Add `Shopware\Core\Framework\DataAbstractionLayer\Field\ParentFkField`, `ParentAssociationField`, and `ChildrenAssociationField` to `defineFields()`, referencing `self::class` (`ParentAssociationField`'s second parameter is the reference field, e.g. `'id'`).
3. Override `isInheritanceAware(): bool` to return `true`.
4. Add the `Inherited` flag (`Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Inherited`) to each field that should inherit, e.g. `(new StringField('name', 'name'))->addFlags(new Inherited())`.
5. Add `getParent()`/`setParent()`/`getParentId()`/`setParentId()`/`getChildren()`/`setChildren()` to the entity class.
6. For translated fields, add `Inherited` to the `TranslatedField` and to the `TranslationsAssociationField`.
7. For association inheritance, add `Inherited` to both the FK field (e.g. `FkField`) and the association field (e.g. `ManyToOneAssociationField`), then add the FK column via a migration using `InheritanceUpdaterTrait::updateInheritance($connection, 'swag_example', 'tax')`.

## Essential identifiers
- `ParentFkField`, `ParentAssociationField`, `ChildrenAssociationField`
- `isInheritanceAware()`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Inherited`
- `InheritanceUpdaterTrait::updateInheritance()`

## Gotchas
- Translation lookup order for inherited languages is: Child (target locale), Child (parent locale), Parent (target locale), Parent (parent locale) — falling through if not found.
- "Inheritance columns" created by `updateInheritance` are internal-only, not visible in the entity definition/class, and cannot be accessed directly; they store the concrete join reference (parent ID for inherited `ToMany`, referenced entity ID for `ToOne`).
- These extra columns exist to allow overriding an association with `null` in a child, and to avoid extra queries to load the parent when inherited.
