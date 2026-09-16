---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/versioning-entities.md
title: Versioning Entities
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/versioning-entities.html
sourceHash: b4fd04e7ea4981b30e5d176dd179c09132402a9f
codeCheckedAgainst: "6.7.13.0"
keywords: ["VersionField", "ReferenceVersionField", "createVersion", "merge", "createWithVersionId", "version_id", "parent_version_id", "entity versioning", "drafts", "dal version", "composite primary key", "EntityRepository"]
summary: Make a custom DAL entity versionable - version_id column, VersionField/ReferenceVersionField, createVersion, versioned Context and merge.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/data-abstraction-layer.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md"]
---
## What it is

How to add versioning to a custom DAL entity so that multiple versions of one record (e.g. drafts) can exist side by side and later be merged into the live version. Builds on [Adding custom complex data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md); concept background in [Data abstraction layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md).

## When to use

- Your plugin entity needs draft/preview versions that do not affect the live record until merged.
- A versioned entity has foreign keys (including a self-referencing `parent_id` for [inheritance](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md)) that must point at a specific version.

## Key steps / config

1. **Migration** - add a `version_id` column; together with `id` it replaces the primary key:

```sql
ALTER TABLE `swag_example`
    ADD `version_id` BINARY(16) NOT NULL AFTER `id`,
    ADD PRIMARY KEY `id_version_id` (`id`, `version_id`),
    DROP INDEX `PRIMARY`;
```

2. **Definition** - add `Shopware\Core\Framework\DataAbstractionLayer\Field\VersionField` (no constructor arguments; it maps storage `version_id` to property `versionId`) in `defineFields()`:

```php
return new FieldCollection([
    new VersionField(),
    // ...
]);
```

3. **Create, update and merge a version** (service with `swag_example.repository` injected):
   - `$versionId = $repo->createVersion($id, $context);` returns the new version id. Optional extra args: `?string $name`, `?string $versionId`.
   - `$versionContext = $context->createWithVersionId($versionId);`
   - `$repo->update([...], $versionContext);` writes only to that version.
   - `search(new Criteria([$id]), $context)` still returns the live record; the same search with `$versionContext` returns the modified version.
   - `$repo->merge($versionId, $context);` makes the version live. The docs say this deletes all versions before the merged one, so the merged data is then found with the normal context.

4. **Foreign keys on versioned entities** - each FK needs a matching version column, and the constraint covers both columns:

```sql
ADD `parent_version_id` BINARY(16) NOT NULL,
CONSTRAINT `fk.swag_example.parent_id` FOREIGN KEY (`parent_id`, `parent_version_id`)
    REFERENCES `swag_example` (`id`, `version_id`) ON DELETE CASCADE ON UPDATE CASCADE
```

   In the definition add `Shopware\Core\Framework\DataAbstractionLayer\Field\ReferenceVersionField`:

```php
new VersionField(),
(new ReferenceVersionField(self::class, 'parent_version_id')),
```

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Field\VersionField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ReferenceVersionField`
- `EntityRepository::createVersion()`, `EntityRepository::merge()`
- `Context::createWithVersionId()`
- columns `version_id`, `parent_version_id`

## Gotchas

- `VersionField` is always required for a versioned entity; without it the DAL does not know the entity has versions.
- `ReferenceVersionField`'s second argument is optional: when omitted, the storage name defaults to `<entity_name>_version_id`, so pass `'parent_version_id'` explicitly for a self-reference named after `parent`.
- Writing with the original context after `createVersion` changes the live record, not the draft; always pass the versioned context for draft writes.

## Code check (6.7.13.0)
- confirmed `VersionField` — no-arg constructor, maps `version_id`/`versionId` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/VersionField.php:12
- confirmed `ReferenceVersionField::__construct()` — `(string $definition, ?string $storageName = null)` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ReferenceVersionField.php:19
- confirmed `$storageName` — defaults to entity name plus `_version_id` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ReferenceVersionField.php:28
- confirmed `EntityRepository::createVersion()` — returns string version id, optional name/versionId args — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:161
- confirmed `EntityRepository::merge()` — `(string $versionId, Context $context): void` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:172
- confirmed `Context::createWithVersionId()` — returns a new Context — vendor/shopware/core/Framework/Context.php:172
- confirmed `EntityRepository::update()` — `(array $data, Context $context)` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:99
- confirmed `EntityRepository::search()` — `(Criteria $criteria, Context $context)` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:62
