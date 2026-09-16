---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/versioning-entities.md
title: Versioning entities
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/versioning-entities.html
sourceHash: 9407ef389bac8225564137c9f038e6e37d9c470c
keywords: ["versioning entities", "VersionField", "version_id", "createVersion", "createWithVersionId", "merge method", "ReferenceVersionField", "parent_version_id", "entity versioning", "drafts"]
summary: "How to add versioning to a custom entity using VersionField, createVersion/merge repository methods, and versioned foreign keys."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to make a custom entity support versioning, letting multiple versions of the same entity exist (e.g. for drafts) via a `version_id` column.

## When to use
Use when an entity needs to support draft/versioned states before merging into the live version.

## Key steps / config
1. Migration: add a `version_id` column and change the primary key to the `id`+`version_id` pair:
```sql
ALTER TABLE `swag_example`
    ADD `version_id` BINARY(16) NOT NULL AFTER `id`,
    ADD PRIMARY KEY `id_version_id` (`id`, `version_id`),
    DROP INDEX `PRIMARY`;
```
2. Definition: add `new VersionField()` to `defineFields()` — required for a versioned entity.
3. Create and merge:
```php
$versionId = $this->exampleRepository->createVersion($exampleId, $context);
$versionContext = $context->createWithVersionId($versionId);
$this->exampleRepository->update([[ 'id' => $exampleId, 'description' => '...' ]], $versionContext);
$this->exampleRepository->merge($versionId, $context);
```
`createVersion` returns a new version ID; `createWithVersionId` builds a `Context` scoped to that version; searches with the original context still return the original version until `merge` is called, which deletes all versions before the merged one and makes it the new live version.
4. Versioning with foreign keys: add a `parent_version_id` column and a composite FK referencing `(id, version_id)`:
```sql
ALTER TABLE `swag_example`
    ADD `version_id` BINARY(16) NOT NULL AFTER `id`,
    ADD `parent_version_id` BINARY(16) NOT NULL,
    ADD PRIMARY KEY `id_version_id` (`id`, `version_id`),
    DROP INDEX `PRIMARY`,
    CONSTRAINT `fk.swag_example.parent_id` FOREIGN KEY (`parent_id`, `parent_version_id`)
        REFERENCES `swag_example` (`id`, `version_id`) ON DELETE CASCADE ON UPDATE CASCADE
```
5. Add `Shopware\Core\Framework\DataAbstractionLayer\Field\ReferenceVersionField` referencing `self::class` and `'parent_version_id'` to the definition.

## Essential identifiers
- `Shopware\Core\Framework\DataAbstractionLayer\Field\VersionField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ReferenceVersionField`
- `createVersion()`, `createWithVersionId()`, `merge()`
- `version_id`, `parent_version_id`

## Gotchas
- Versioning with foreign keys is demonstrated together with an inherited field, so it assumes familiarity with field inheritance.
