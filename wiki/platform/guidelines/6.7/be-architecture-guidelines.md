---
id: platform/guidelines/6.7/be-architecture-guidelines.md
title: Backend architecture guidelines
docType: guideline
version: "6.7"
summary: DAL vs plain SQL, entity modelling, migrations, indexers, Messenger, scheduled tasks, Rule and Flow Builder, admin data layer
keywords: ["dal", "plain sql", "entity extension", "custom fields", "versioning", "inheritance", "migrations", "entity indexer", "message queue", "scheduled task", "rule builder", "flow builder"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/database-migations.html", hash: "251c4ce00237d146b47d3ad2bf62b3d70f77129ccbfe998da5107e011cad5758"}, {url: "code:administration/Resources/app/administration/technical-docs/04-data-layer/**", hash: "5b86c345a6d37b8f56928247fb0325f8a2623053b0ab0ac7867897887f519aba"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html", hash: "fb40de448f661d3ab61526c6eef2a93aa76ca2171b85adb743dcd89319564e77"}]
codeVersion: "6.7.13.0+8da531fe"
lastBuilt: 2026-09-15
---

## dal or plain sql

- Use entity repositories in Store API routes, storefront loaders/controllers and Admin API code; data there must stay extensible and ACL-protected.
- Write only through the DAL. Exception: entity indexers and deep core components may use `Doctrine\DBAL\Connection`.

Read more: https://developer.shopware.com/docs/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html

## entity modelling

- Custom fields (`CustomFields` field) for scalar, merchant-configurable values.
- `EntityExtension` (`getEntityName()`, `extendFields()`) for associations/complex data, stored in your own table via `OneToOneAssociationField`; never add columns to core tables. `BulkEntityExtension` has a final constructor: inject nothing.
- Versioning: `VersionField` plus `version_id` in the primary key, `ReferenceVersionField` on foreign keys to versioned entities; write drafts via `Context::createWithVersionId()`, then `EntityRepository::merge()`.
- Inheritance: nullable columns, `ParentFkField`, `ParentAssociationField`, `ChildrenAssociationField`, `isInheritanceAware()` returning `true`, `Inherited` flag per field; call `updateInheritance()` (`InheritanceUpdaterTrait`) in the migration for inherited associations.

Read more: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md
Read more: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/versioning-entities.md
Read more: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md

## database migrations

- Create with `bin/console database:create-migration` in the current major namespace (`Core\Migration\V6_7`).
- Minor/patch changes stay non-destructive: expand, migrate data, drop old structures only in `updateDestructive()`.
- Never edit a released migration; write a new one.
- Be idempotent (`IF [NOT] EXISTS`, `columnExists()`); never hardcode IDs, assume data or a default language (use `ImportTranslationsTrait::importTranslation()`); never overwrite customised rows.
- Run `update()` twice in the migration test; DDL commits implicitly, so undo it manually.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/database-migations.html
Read more: platform/dev/6.7/concepts/framework/migrations.md

## entity indexers

- Keep derived data in an `EntityIndexer`; for core entities subscribe to existing indexer events first.
- Write in `handle()` via `Connection`; if you must use the DAL, add `EntityIndexerRegistry::DISABLE_INDEXING` to the context to avoid re-index loops.
- Pass `forceQueue: true` to `EntityIndexingMessage` for heavy updates.

Read more: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md

## messenger and scheduled tasks

- Move slow work off the request: implement `AsyncMessageInterface` or `LowPriorityMessageInterface` and dispatch via `MessageBusInterface`; unrouted messages run synchronously.
- Pass IDs, not entities. Reroute with `shopware.messenger.routing_overwrite`.
- Recurring work: extend `ScheduledTask` (vendor-prefixed `getTaskName()`, `getDefaultInterval()`) and `ScheduledTaskHandler`; custom intervals via `DynamicallyScheduledTaskHandler::getNextExecutionTime()`. Production needs a `messenger:consume` worker.

Read more: platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md
Read more: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md

## rule builder and flow builder first

- Before hardcoding a merchant condition, add a `Rule` subclass (`match()`, `getConstraints()`); `match()` reads only the `RuleScope`, no queries.
- Before hardcoding event automation, expose a `FlowEventAware` event or a `FlowAction`. Flows are skipped when the context has `Context::SKIP_TRIGGER_FLOW`.

Read more: platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md
Read more: platform/dev/6.7/concepts/framework/flow-concept.md

## admin data layer consumers

- Use `repositoryFactory.create('<entity_name>')` with `Criteria`; never call entity CRUD endpoints with a raw HTTP client.
- Batch changes into one `save()` (bulk: `saveAll()`), check `hasChanges(entity)`, reload after saving, map field errors with `mapPropertyErrors`.
- Load associations via `addAssociation()`, keep page sizes small.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md

## Code check (6.7.13.0+8da531fe)

- confirmed `MigrationStep::updateDestructive` — destructive step — core/Framework/Migration/MigrationStep.php:38
- corrected `AddColumnTrait::columnExists` — code uses `ColumnExistsTrait::columnExists` instead, core/Framework/Migration/ColumnExistsTrait.php:17
- confirmed `EntityIndexerRegistry::DISABLE_INDEXING` — context state — core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:31
- confirmed `Context::SKIP_TRIGGER_FLOW` — suppresses flows — core/Framework/Context.php:25
- confirmed `hasChanges` — admin repository — administration/core/data/repository.data.ts:252
