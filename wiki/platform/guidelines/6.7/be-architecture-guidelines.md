---
id: platform/guidelines/6.7/be-architecture-guidelines.md
title: Backend architecture guidelines
docType: guideline
version: "6.7"
summary: Backend architecture rules for Shopware 6.7 - DAL vs plain SQL, migrations, indexers, inheritance and Admin data-layer persistence.
keywords: ["dal", "plain sql", "migration", "updatedestructive", "entity indexer", "expand and contract", "blue-green", "inheritance", "repository", "changeset", "translations", "migration test"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/database-migations.html", hash: "36f6f5681eb586bf345f02ec15dc97dd5927c433d6675ba04f1b36066302c422"}, {url: "code:administration/Resources/app/administration/technical-docs/04-data-layer/**", hash: "d550f43508f6c0ec4064f052014913ce0e1af4ddd30a22fd2632c72e81285881"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html", hash: "fb40de448f661d3ab61526c6eef2a93aa76ca2171b85adb743dcd89319564e77"}]
codeVersion: "6.7.15.1+7d4303db"
lastBuilt: 2026-10-21
---

## dal or plain sql

- Use the DAL (entity repositories) for everything returned through the Store API, the Admin API, and Storefront page loaders/controllers. Third parties must be able to extend the data, load extra associations, and rely on ACL.
- Write data only through the DAL. Its validation, event and indexing pipeline keeps data consistent; a raw `INSERT`/`UPDATE` bypasses events and indexers.
- Use plain SQL via the Doctrine `Connection` inside entity indexers (subclasses of `EntityIndexer`). Indexers sit behind the repository layer, must re-index everything without hydration/event overhead, and are not an extension point.
- Use plain SQL in internal core components (theme compiler, request transformer) where data is processing-only and must not depend on plugin entity schemas.

Read more: https://developer.shopware.com/docs/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html

## migration structure

- Create migrations with `bin/console database:create-migration`; core migrations live in the major namespace (`Shopware\Core\Migration\V6_7`).
- Extend `MigrationStep`. Put only backward-compatible changes in `update()`; put non-reversible changes (drop table, drop column) only in `updateDestructive()`.
- Keep minor and patch releases non-destructive and blue-green safe with expand and contract: add the new column, copy the data, remove the old column later in `updateDestructive()`.
- Destructive execution is mode-controlled: `mode=all` (up to current major), `mode=blue-green` (up to previous major), `mode=safe` (default, up to two majors back). Do not rely on your destructive step running soon.
- When a migration changes data an indexer derives from, queue that indexer with `registerIndexer()` instead of recomputing in SQL.
- Name tables descriptively in singular snake case; no vendor prefixes such as `swag_`.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/database-migations.html

## migration safety rules

- Never change a released or executed migration; write a new one. Exception: a broken migration that causes errors.
- Make every migration re-runnable. Use `IF [NOT] EXISTS` for `CREATE TABLE`/`DROP TABLE`, and the `MigrationStep` helpers `dropTableIfExists()`, `dropColumnIfExists()`, `addColumn()` and `columnExists()`. `ALTER TABLE` has no `IF EXISTS` - check the column first.
- Never hardcode identifiers; query ids on the target system.
- Never assume data exists or has a given shape on customer systems; write defensive, exact queries.
- Never overwrite merchant-customized data; restrict updates, e.g. `WHERE updated_at IS NULL`.
- Keep runtime under 10 seconds locally and test with large data sets; customer timeouts are unknown.
- Assume no default language - neither English nor German. Insert translations with `ImportTranslationsTrait::importTranslation()`.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/database-migations.html

## migration tests

- Test every migration with meaningful `update()` or destructive behaviour; an empty `updateDestructive()` needs none. Place it under `tests/Migration/V6_*`.
- Do not use `IntegrationTestBehaviour`/`KernelTestBehaviour` or a booted container; get the connection via `KernelLifecycleManager::getConnection()` and keep the test unit-like.
- Run `update()` twice to prove idempotence where feasible. Prefer `MultiInsertQueryQueue` for bulk fixtures.
- DDL triggers an implicit commit: run DDL outside transactions and undo it manually after the test.
- Never assume a schema state - all migrations have already run. Build the needed state explicitly (rename the table, recreate it, test, restore).

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/database-migations.html

## inheritance modelling

- Inheritance resolves parent to child (variants, sales channel config, child themes, custom fields): a scalar inherits when the child value is `null`/`undefined`; a collection inherits when empty. `false` is a real value, not inherited.
- To restore inheritance, write `null` (or empty the association); for an explicitly empty override, `sw-inherit-wrapper` sets `forceInheritanceRemove`.
- In the Admin, pass `hasParent` to `sw-inherit-wrapper` explicitly and take inherited values from `parentEntity.translated` for translatable fields.

Read more: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md

## admin data persistence

- Access entities only through `repositoryFactory.create('<entity_name>')`; never manipulate entities outside a repository.
- Batch field changes and call `save()` once - the changeset generator sends only changed fields. Use `saveAll()` or `syncService` for bulk writes.
- Reload the entity with `get()` after `save()` so origin state matches the server and `hasChanges()` stays correct.
- Load associations in the same request via `Criteria.addAssociation()`; keep page sizes small and disable total count when unused.
- Map field errors with `mapPropertyErrors`; repositories already reset and map API errors on save.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md

## Code check (6.7.15.1+7d4303db)

- confirmed `updateDestructive` — default no-op on `MigrationStep` — core/Framework/Migration/MigrationStep.php:38
- confirmed `registerIndexer` — queues indexers from a migration — core/Framework/Migration/MigrationStep.php:82
- confirmed `addColumn` — returns false when column exists — core/Framework/Migration/AddColumnTrait.php:26
- corrected `AddColumnTrait::columnExists` — code uses `ColumnExistsTrait::columnExists` instead, core/Framework/Migration/ColumnExistsTrait.php:16
- confirmed `importTranslation` — translation helper — core/Migration/Traits/ImportTranslationsTrait.php:13
- confirmed `database:create-migration` — command name — core/Framework/Migration/Command/CreateMigrationCommand.php:19
- confirmed `EntityIndexer` — indexer base class — core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9
- confirmed `KernelLifecycleManager::getConnection` — test connection — core/Framework/Test/TestCaseBase/KernelLifecycleManager.php:201
- confirmed `hasChanges` — changeset plus deletion queue — administration/core/data/repository.data.ts:294
- confirmed `mapPropertyErrors` — field error helper — administration/app/service/map-errors.service.ts:11
