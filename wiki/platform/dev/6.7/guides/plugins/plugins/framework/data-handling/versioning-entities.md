---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/versioning-entities.md
title: Versioning Entities
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/versioning-entities.html
sourceHash: b4fd04e7ea4981b30e5d176dd179c09132402a9f
codeCheckedAgainst: "6.7.15.1"
keywords: ["entity versioning", "drafts", "VersionField", "ReferenceVersionField", "version_id", "parent_version_id", "createVersion", "merge", "createWithVersionId", "versioned context", "DAL", "migration"]
summary: Make a custom DAL entity version-aware - version_id column and VersionField, createVersion/merge on the repository, versioned Context.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/data-abstraction-layer.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to make a custom entity version-aware in the Data Abstraction Layer, so multiple versions of a record can exist side by side (for example drafts), and how to create, edit and merge a version. Concept background: [Data Abstraction Layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md). Builds on [Adding custom complex data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md) and needs a plugin ([Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## When to use

When your plugin's entity needs draft/live versions, or an entity with foreign keys (e.g. a self-referencing parent) has to be versioned.

## Key steps / config

1. **Migration** - add `version_id`; together with `id` it replaces the primary key:

```sql
ALTER TABLE `swag_example`
    ADD `version_id` BINARY(16) NOT NULL AFTER `id`,
    ADD PRIMARY KEY `id_version_id` (`id`, `version_id`),
    DROP INDEX `PRIMARY`;
```

2. **Definition** - add `Shopware\Core\Framework\DataAbstractionLayer\Field\VersionField` to `defineFields()` (`new VersionField()`, no arguments). It maps `version_id`/`versionId` and is flagged `PrimaryKey` + `Required`. The repository treats a definition as version-aware only when it has a `versionId` field.
3. **Create a version** - `$versionId = $repository->createVersion($id, $context)` (optional `$name`, `$versionId` arguments) returns the new version id.
4. **Write to it** - `$versionContext = $context->createWithVersionId($versionId)`; pass `$versionContext` to `update()`. Searching with the original `$context` still returns the live record; searching with `$versionContext` returns the changed one.
5. **Merge** - `$repository->merge($versionId, $context)` applies the version's changes to the version of `$context` (live), then deletes the versioned records. Afterwards the change is found without a versioned context.

### Versioning with foreign keys

Foreign keys must be versioned too. For an inherited `parent_id`, add `parent_version_id` and a composite constraint:

```sql
ADD `parent_version_id` BINARY(16) NOT NULL,
CONSTRAINT `fk.swag_example.parent_id` FOREIGN KEY (`parent_id`, `parent_version_id`)
    REFERENCES `swag_example` (`id`, `version_id`) ON DELETE CASCADE ON UPDATE CASCADE
```

In the definition add `Shopware\Core\Framework\DataAbstractionLayer\Field\ReferenceVersionField`: `new ReferenceVersionField(self::class, 'parent_version_id')`. The first argument is the referenced definition, the second the storage name; if omitted, the storage name defaults to `<entity_name>_version_id`. See [Field inheritance](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md).

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Field\VersionField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ReferenceVersionField`
- `version_id`, `parent_version_id`
- `EntityRepository::createVersion()`, `EntityRepository::merge()`
- `Context::createWithVersionId()`

## Gotchas

- `createVersion()` and `merge()` throw if the definition is not version-aware (no `VersionField`).
- `merge()` throws when the version id equals the context's own version id, and when another merge of the same version holds the lock.
- The docs say merging deletes "all versions before the merged version"; the installed code merges the given version into the context's version and deletes that version's cloned records.

## Code check (6.7.15.1)
- confirmed `VersionField` — no-arg constructor, `version_id` with PrimaryKey and Required flags — vendor/shopware/core/Framework/DataAbstractionLayer/Field/VersionField.php:14
- confirmed `ReferenceVersionField` — args `(definition, ?storageName)`, default `<entity>_version_id` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ReferenceVersionField.php:11
- confirmed `EntityRepository::createVersion()` — returns version id, requires version-aware definition — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:174
- confirmed `EntityRepository::merge()` — requires version-aware definition — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:185
- corrected `VersionManager::merge()` — docs: deletes all versions before the merged one; code merges into the context version and deletes the merged version's clones — vendor/shopware/core/Framework/DataAbstractionLayer/VersionManager.php:167
- confirmed `Context::createWithVersionId()` — returns a new Context with that version — vendor/shopware/core/Framework/Context.php:173
- confirmed `EntityDefinition::isVersionAware()` — true when fields contain `versionId` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:394
