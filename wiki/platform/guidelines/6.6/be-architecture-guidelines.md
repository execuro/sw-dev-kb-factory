---
id: platform/guidelines/6.6/be-architecture-guidelines.md
title: Backend architecture guidelines
docType: guideline
version: "6.6"
summary: "Rules for DAL vs plain SQL, entity modelling, migrations, indexers, message queue, scheduled tasks and Rule/Flow Builder extension points in 6.6"
keywords: ["dal", "plain sql", "entity extension", "custom fields", "versioning", "inheritance", "translation", "migration", "entity indexer", "message queue", "scheduled task", "rule builder", "flow builder"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html", hash: "fb40de448f661d3ab61526c6eef2a93aa76ca2171b85adb743dcd89319564e77"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-15
---

## dal or plain sql

- Use the DAL (entity repositories) for all data returned via Store API, Admin API, and Storefront page loaders/controllers. Third parties must be able to extend and load additional data, and ACL must apply.
- Write data exclusively through the DAL. Its validation, event and indexing system guarantees data integrity. Entity indexers are the only exception.
- Use the `Doctrine\DBAL\Connection` directly inside entity indexers. They sit behind the repository layer, must re-index everything after an update without hydration/event overhead, and are not an extension point.
- Use plain SQL in deep core components (e.g. theme compiler, request transformer). Their data is for processing only and must not be affected by plugin entity schemas, which may be unstable during updates.

Enforced by: review
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html
Read more: platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md

## custom field or entity extension

- Store merchant-editable scalar data in custom fields. On a custom entity add `EntityCustomFieldsTrait` to the entity, a `CustomFields` field to the definition, and a `custom_fields JSON DEFAULT NULL` column via migration.
- For translatable custom fields use `new TranslatedField('customFields')` on the main definition and `CustomFields` on the translation definition.
- Never rely on a custom field set existing: merchants can delete it. Writes without a defined set skip validation.
- Attach technical or non-scalar data to an existing entity with an `EntityExtension` (`getDefinitionClass()`, `extendFields()`), persisted in its own table via a `OneToOneAssociationField`.
- Set `autoload` on the association in only one place (extension or definition); setting it on both recurses until out of memory.
- Extensions added at runtime via `addExtension()` must be a `Struct`, never a scalar.
- `EntityExtension` subclasses get the `shopware.entity.extension` tag and `BulkEntityExtension` subclasses (`collect(): \Generator`) get `shopware.bulk.entity.extension` through autoconfiguration.

Read more: platform/dev/6.6/guides/plugins/plugins/framework/custom-field/add-custom-field.md
Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md

## versioning inheritance and translation

- Make an entity versionable only when it needs drafts: add a `version_id BINARY(16)` column into the primary key (`id`, `version_id`) and a `VersionField` to the definition. Reference versioned entities with `ReferenceVersionField` plus a matching version column.
- Work on a version with `createVersion()`, a context from `Context::createWithVersionId()`, then `merge()`. Reads with the original context keep returning the live version until merge.
- For parent/child fallback, add `ParentFkField`, `ParentAssociationField`, `ChildrenAssociationField`, return `true` from `isInheritanceAware()`, make the columns nullable and flag each inheritable field with `Inherited`.
- For inherited associations flag both the FK field and the association field, and create the inheritance column in a migration with `InheritanceUpdaterTrait::updateInheritance()`.
- Translate fields through a `<entity>_translation` table, an `EntityTranslationDefinition` returning the parent from `getParentDefinitionClass()`, and `TranslatedField` plus `TranslationsAssociationField` on the main definition. Register the translation definition after its entity.

Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/versioning-entities.md
Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/field-inheritance.md
Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-data-translations.md

## migrations

- Create schema changes only as `MigrationStep` subclasses (`bin/console database:create-migration`). Put reversible changes in `update(Connection $connection)` and destructive ones (drop column/table) in `updateDestructive(Connection $connection)`.
- Never edit a migration that has already run; each runs once. Add a new migration instead.
- Do not put revert logic into a migration; clean up in the plugin's `uninstall` lifecycle.

Enforced by: review
Read more: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/database-migrations.md
Read more: platform/dev/6.6/concepts/framework/migrations.md

## entity indexers

- Precompute expensive read values in an `EntityIndexer` (`getName()`, `iterate()`, `update()`, `handle()`, `getTotal()`, `getDecorated()`) instead of calculating on every read.
- Prefer subscribing to an existing indexer's event (e.g. `CustomerIndexerEvent`) over writing a new indexer.
- Query with `Connection` inside `handle()`. If you must write via the DAL there, add `EntityIndexerRegistry::DISABLE_INDEXING` to the context state, or the write re-triggers indexing in a loop.
- `update()` messages are handled synchronously by default; pass `forceQueue: true` to `EntityIndexingMessage` to process them via the queue.

Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-data-indexer.md

## message queue and scheduled tasks

- Dispatch background work as a message on `messenger.default_bus`. Messages are synchronous unless they implement `AsyncMessageInterface` (or `LowPriorityMessageInterface` for the `low_priority` transport).
- Re-route a message class with `shopware.messenger.routing_overwrite` in `shopware.yaml` rather than changing its interface.
- Run recurring work as a `ScheduledTask` (static `getTaskName()` with a vendor prefix, `getDefaultInterval()`) plus a `ScheduledTaskHandler` implementing `run()`.
- Run CLI workers (`messenger:consume`) in production; the admin worker is for development only. Make workers also consume the failure transport, or failed messages are never retried.

Read more: platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md
Read more: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md
Read more: platform/dev/6.6/guides/hosting/infrastructure/message-queue.md

## rule and flow builder before hardcoding

- Before hardcoding a merchant-facing condition, expose it as a `Rule` (`match(RuleScope $scope)`, `getConstraints()`) usable in the Rule Builder.
- Never query the database inside a rule. Only read data provided by the scope (`CartRuleScope`, `LineItemScope`).
- Model merchant-configurable automation as a `FlowAction` (`getName()`, `requirements()`, `handleFlow(StorableFlow $flow)`) tagged `flow.action` with `priority` and `key`, instead of hardcoding it in an event subscriber.

Read more: platform/dev/6.6/resources/guidelines/code/context-rules-rule-systems.md
Read more: platform/dev/6.6/guides/plugins/plugins/framework/rule/add-custom-rules.md
Read more: platform/dev/6.6/guides/plugins/plugins/framework/flow/add-flow-builder-action.md

## Code check (6.6.10.24+87965325)

- confirmed `EntityIndexer` — abstract indexer with getName/iterate/update/handle — core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9
- confirmed `DISABLE_INDEXING` — context state constant — core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:29
- confirmed `forceQueue` — EntityIndexingMessage constructor parameter — core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:40
- confirmed `updateDestructive` — non-abstract on MigrationStep — core/Framework/Migration/MigrationStep.php:36
- confirmed `EntityCustomFieldsTrait` — entity trait — core/Framework/DataAbstractionLayer/EntityCustomFieldsTrait.php:10
- confirmed `CustomFields` — JSON field — core/Framework/DataAbstractionLayer/Field/CustomFields.php:10
- confirmed `shopware.entity.extension` — autoconfigured tag — core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:70
- confirmed `BulkEntityExtension` — abstract bulk extension class — core/Framework/DataAbstractionLayer/BulkEntityExtension.php:9
- confirmed `createVersion` — repository method — core/Framework/DataAbstractionLayer/EntityRepository.php:154
- confirmed `createWithVersionId` — context factory — core/Framework/Context.php:132
- confirmed `isInheritanceAware` — definition hook — core/Framework/DataAbstractionLayer/EntityDefinition.php:331
- confirmed `updateInheritance` — migration trait method — core/Framework/Migration/InheritanceUpdaterTrait.php:11
- confirmed `EntityTranslationDefinition` — translation base — core/Framework/DataAbstractionLayer/EntityTranslationDefinition.php:18
- confirmed `getDefaultInterval` — scheduled task contract — core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:42
- confirmed `LowPriorityMessageInterface` — low priority marker — core/Framework/MessageQueue/LowPriorityMessageInterface.php:8
- confirmed `match` — Rule contract — core/Framework/Rule/Rule.php:60
- confirmed `flow.action` — flow action tag — core/Content/DependencyInjection/flow.xml:40
