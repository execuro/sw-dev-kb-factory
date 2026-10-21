---
id: platform/guidelines/6.6/be-architecture-guidelines.md
title: Backend architecture guidelines
docType: guideline
version: "6.6"
summary: "Rules for DAL vs plain SQL, entity modelling, migrations, indexers, message queue, scheduled tasks and Rule/Flow Builder extension points in 6.6"
keywords: ["dal", "plain sql", "entity extension", "custom fields", "versioning", "inheritance", "translation", "migration", "entity indexer", "message queue", "scheduled task", "rule builder", "flow builder"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/concepts/framework/data-abstraction-layer.html", hash: "a6c4f08306eef48422c0a51219128108ada29f3e9014785ac197af9f0a4630a3"}, {url: "https://developer.shopware.com/docs/v6.6/concepts/framework/migrations.html", hash: "d32f91daf26e32f9cc182cb13768f95269b1060a9af30d915ab39557b0ab478f"}, {url: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/add-data-indexer.html", hash: "2033ed55c032f09f6dec544819226902b0eaca2d451bf03f5baa8a7c7d447ad2"}, {url: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/message-queue/", hash: "a725c8638912af9fcd121f6e3bb692fcd513405e5637df55ceace5976426b9ea"}, {url: "https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/scheduled-task.html", hash: "e2be828e415d7e67808a637c84fa7de503bd02cef283e4d472c387f807f4b715"}, {url: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/rule/", hash: "2478ca4297ef28e378f2f597bf93fc73da4db08b58ce6e3353fc35d4ae3567c4"}, {url: "https://developer.shopware.com/docs/v6.6/guides/plugins/apps/flow-builder/", hash: "c443e35f8f3df89a1ce895b9989541c106ba89a752f2318d66b29f7f68bab281"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html", hash: "fb40de448f661d3ab61526c6eef2a93aa76ca2171b85adb743dcd89319564e77"}]
codeVersion: "6.6.10.29+c8b59f9d"
lastBuilt: 2026-10-21
---

## dal or plain sql

- Read and write through an injected `EntityRepository` (e.g. `product.repository`) for everything served via Store API, Admin API and Storefront page loaders/controllers. Third parties must be able to extend the data and ACL must apply.
- Write data exclusively through the DAL; its validation, event and indexing system guarantees integrity. Entity indexers are the only exception.
- Use `Doctrine\DBAL\Connection` directly in entity indexers and deep core components (theme compiler, request transformer). They are not extension points and must not depend on plugin schemas, which may be unstable during updates.

Enforced by: review
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.html

## custom field or entity extension

- Store merchant-editable scalar data in custom fields: `EntityCustomFieldsTrait` on the entity, a `CustomFields` field on the definition, a JSON `custom_fields` column via migration. Translatable: `new TranslatedField('customFields')` on the main definition, `CustomFields` on the translation definition.
- Never rely on a custom field set existing; merchants can delete it.
- Attach technical or non-scalar data to an existing entity with an `EntityExtension` (`extendFields()`) persisted in its own table via a `OneToOneAssociationField`. Implement `getEntityName()` besides `getDefinitionClass()` (deprecated for 6.7), or use a `BulkEntityExtension` (`collect(): \Generator`).
- Set `autoload` on the association in only one place (extension or definition); both recurse until out of memory.
- Runtime extensions added via `addExtension()` must be a `Struct`, never a scalar.

Read more: platform/dev/6.6/guides/plugins/plugins/framework/custom-field/add-custom-field.md
Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md

## versioning inheritance and translation

- Make an entity versionable only for drafts/previews: primary key (`id`, `version_id`) with a `VersionField`; reference it with `ReferenceVersionField`, so every FK is two columns (`product_id`, `product_version_id`).
- A live version must exist first: `createVersion()`, a context from `Context::createWithVersionId()`, then `merge()`. You cannot create an entity directly in a non-live version.
- For parent/child fallback add `ParentFkField`, `ParentAssociationField`, `ChildrenAssociationField`, return `true` from `isInheritanceAware()`, make columns nullable and flag inheritable fields `Inherited`; add inherited association columns with `InheritanceUpdaterTrait::updateInheritance()`.
- Translate via a `<entity>_translation` table, an `EntityTranslationDefinition` (`getParentDefinitionClass()`), and `TranslatedField` plus `TranslationsAssociationField` on the main definition. Reads fall back current, parent, then system language.

Read more: https://developer.shopware.com/docs/v6.6/concepts/framework/data-abstraction-layer.html
Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/versioning-entities.md
Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/field-inheritance.md

## migrations

- Create schema changes only as `MigrationStep` subclasses in the plugin's `Migration` directory, generated with `bin/console database:create-migration`.
- Put reversible changes in `update(Connection $connection)`, destructive ones (drop column/table) in `updateDestructive(Connection $connection)`.
- Never edit a migration that has already run; add a new one.

Enforced by: review
Read more: https://developer.shopware.com/docs/v6.6/concepts/framework/migrations.html
Read more: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/database-migrations.md

## entity indexers

- Precompute expensive read values in an `EntityIndexer` (`getName()`, `iterate()`, `update()`, `handle()`, `getTotal()`, `getDecorated()`); extending it autoconfigures the `shopware.entity_indexer` tag.
- For existing entities prefer subscribing to the indexer's event (e.g. `CustomerIndexerEvent`) over a new indexer.
- Filter `EntityWrittenContainerEvent::getPrimaryKeys()` in `update()` as tightly as possible.
- Write with `Connection` (or `MultiInsertQueryQueue`) in `handle()`. A DAL write there re-triggers indexing in a loop unless the context has `EntityIndexerRegistry::DISABLE_INDEXING` via `addState()`.
- `update()` messages run synchronously; pass `forceQueue: true` to `EntityIndexingMessage` to queue them. Full reindex: `bin/console dal:refresh:index`.

Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/add-data-indexer.html

## message queue and scheduled tasks

- Dispatch background work (mails, indexing, sitemap) as a message on `messenger.default_bus`. Messages are synchronous unless they implement `AsyncMessageInterface`, or `LowPriorityMessageInterface` for the `low_priority` transport.
- Re-route a message class with `shopware.messenger.routing_overwrite` rather than changing its interface.
- Run recurring non-time-critical work as a `ScheduledTask` (static `getTaskName()` with a vendor prefix, `getDefaultInterval()` in seconds) plus a `ScheduledTaskHandler` implementing `run()`.
- Run `bin/console scheduled-task:run` next to a worker, or `scheduled-task:run --no-wait` from cron. `messenger:consume scheduler_shopware` is experimental in 6.6; deactivate a task there by setting `ScheduledTaskDefinition::STATUS_INACTIVE` and restarting the consumer.

Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/message-queue/
Read more: https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/scheduled-task.html
Read more: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md

## rule and flow builder before hardcoding

- Expose a merchant-facing condition as a `Rule` (`match(RuleScope $scope)`, `getConstraints()`) for the Rule Builder instead of hardcoding it.
- Never query the database inside a rule; read only what the scope (`CartRuleScope`, `LineItemScope`) provides.
- Model merchant-configurable automation as a `FlowAction` (`requirements()`, `handleFlow(StorableFlow $flow)`) tagged `flow.action` with `priority` and `key`, or as an app flow action, not an event subscriber.

Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/rule/
Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/flow-builder/
Read more: platform/dev/6.6/resources/guidelines/code/context-rules-rule-systems.md

## Code check (6.6.10.29+c8b59f9d)

- confirmed `DISABLE_INDEXING` — context state constant — core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:29
- confirmed `forceQueue` — EntityIndexingMessage parameter — core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:40
- confirmed `shopware.entity_indexer` — autoconfigured tag — core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:110
- confirmed `updateDestructive` — MigrationStep method — core/Framework/Migration/MigrationStep.php:36
- deprecated `getDefinitionClass` — replaced by getEntityName in 6.7 — core/Framework/DataAbstractionLayer/EntityExtension.php:39
- confirmed `createVersion` — repository method — core/Framework/DataAbstractionLayer/EntityRepository.php:154
- confirmed `updateInheritance` — migration trait method — core/Framework/Migration/InheritanceUpdaterTrait.php:11
- confirmed `STATUS_INACTIVE` — task status — core/Framework/MessageQueue/ScheduledTask/ScheduledTaskDefinition.php:30
- confirmed `match` — Rule contract — core/Framework/Rule/Rule.php:60
- confirmed `handleFlow` — FlowAction contract — core/Content/Flow/Dispatching/Action/FlowAction.php:16
