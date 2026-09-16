# `dev-16` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-16` · `dev` · `Orders` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-12-21` |
| Core version | `6.7.13.0` |

**Query:** How do I run plugin logic whenever an order is written, and find out exactly which fields changed?

**Expected answer — every fact an answer must contain:**

1. Implement `EventSubscriberInterface` and subscribe to `Shopware\Core\Checkout\Order\OrderEvents::ORDER_WRITTEN_EVENT` (`'order.written'`); the handler receives an `EntityWrittenEvent` whose `getWriteResults()` returns `EntityWriteResult` objects. `EntityWriteResult::getPayload()` holds only the fields that were part of the write, keyed by property name — it is not a before/after diff and does not prove a value actually changed. `[code: Checkout/Order/OrderEvents.php:11]` `[code: Framework/DataAbstractionLayer/Write/EntityWriteResultFactory.php:500-509]`
2. A change set is opt-in: additionally subscribe to `Shopware\Core\Framework\DataAbstractionLayer\Write\Validation\PreWriteValidationEvent`, and for each command from `$event->getCommands()` / `getCommandsForEntity('order')` that is an instance of `ChangeSetAware`, call `$command->requestChangeSet()` (optionally guarded by `$command->hasField('<storage_name>')`); only then is `$result->getChangeSet()` non-null in the `order.written` handler — otherwise it returns `null`. `[code: Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:18-22]` `[code: Framework/DataAbstractionLayer/EntityWriteResult.php:76]` `[code: Content/Rule/DataAbstractionLayer/RuleAreaUpdater.php:55-85]`
3. Only `UpdateCommand` and `DeleteCommand` implement `ChangeSetAware` — an insert never yields a change set. The `ChangeSet` is read with `getBefore()` / `getAfter()` / `hasChanged()`, and its keys are **database storage names** (snake_case columns), not DAL property names, because the before state is a `SELECT *` on the entity table. `[code: Framework/DataAbstractionLayer/Write/Command/UpdateCommand.php:14]` `[code: Framework/DataAbstractionLayer/Write/Command/InsertCommand.php:12]` `[code: Framework/DataAbstractionLayer/Dbal/EntityWriteGateway.php:513-519]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/checkout/order/listen-to-order-changes.html
<!-- expected:end -->

## Evidence — code (decisive)

Source version `6.7.13.0`.

| fact | citation | excerpt |
| --- | --- | --- |
| The per-entity written event constant for orders | `Checkout/Order/OrderEvents.php:11` | `final public const ORDER_WRITTEN_EVENT = 'order.written';` |
| The event name is derived from the entity name | `Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:55` | `$this->name = $this->entityName . '.written';` |
| Per-row detail lives in `EntityWriteResult` | `Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:162` | `public function getWriteResults(): array` |
| `getChangeSet()` is nullable | `Framework/DataAbstractionLayer/EntityWriteResult.php:76` | `public function getChangeSet(): ?ChangeSet` |
| The payload carries only written fields, keyed by property name, decoded by the serializer — not a diff | `Framework/DataAbstractionLayer/Write/EntityWriteResultFactory.php:500-509` | `$convertedPayload[$field->getPropertyName()] = $field->getSerializer()->decode($field, $value);` |
| Only `UpdateCommand` (and `DeleteCommand`) implement `ChangeSetAware` | `Framework/DataAbstractionLayer/Write/Command/UpdateCommand.php:14` | `class UpdateCommand extends WriteCommand implements ChangeSetAware` |
| `InsertCommand` is not `ChangeSetAware` | `Framework/DataAbstractionLayer/Write/Command/InsertCommand.php:12` | `class InsertCommand extends WriteCommand` |
| `requestChangeSet()` is the opt-in; the set is computed before the command executes and exposed on the write result | `Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:18-22` | `public function requestChangeSet(): void;` |
| `ChangeSetAware`/`ChangeSetAwareTrait` are annotated `@internal` in 6.7.13.0 although plugins must call `requestChangeSet()` | `Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:7-11` | `/**\n * @internal\n */` |
| Core's in-tree two-step pattern: opt in on `PreWriteValidationEvent`, consume on the written event | `Content/Rule/DataAbstractionLayer/RuleAreaUpdater.php:55-85` | `PreWriteValidationEvent::class => 'triggerChangeSet',` … `$command->requestChangeSet();` |
| Command filtering helper on the pre-write event | `Framework/DataAbstractionLayer/Write/Validation/PreWriteValidationEvent.php:47-53` | `public function getCommandsForEntity(string $entity): array` |
| For deletes the opt-in event is `EntityDeleteEvent`; the change set is read with `getBefore()` | `Checkout/Customer/Subscriber/ProductReviewSubscriber.php:36-67` | `$changeset = $result->getChangeSet(); \assert($changeset !== null); $id = $changeset->getBefore('customer_id');` |
| The extra `SELECT` only happens for opted-in commands | `Framework/DataAbstractionLayer/Dbal/EntityWriteGateway.php:487-520` | `if (!$command->requiresChangeSet()) { continue; }` |
| Change-set keys are DB storage names — the before state comes from `SELECT *` | `Framework/DataAbstractionLayer/Dbal/EntityWriteGateway.php:513-519` | `$query->addSelect('*'); $query->from(EntityDefinitionQueryHelper::escape($entity));` |
| `after` is computed only for keys in both payload and previous row, and only when the string casts differ | `Framework/DataAbstractionLayer/Write/Command/ChangeSet.php:31-43` | `$changes = array_intersect_key($payload, $state);` |
| `ChangeSet` API; `hasChanged()` is true for every property on a delete | `Framework/DataAbstractionLayer/Write/Command/ChangeSet.php:70-73` | `return \array_key_exists($property, $this->after) \|\| $this->isDelete;` |
| The change set reaches the subscriber via the write-result factory | `Framework/DataAbstractionLayer/Write/EntityWriteResultFactory.php:392-399` | `$command instanceof ChangeSetAware ? $command->getChangeSet() : null` |
| Lighter alternative without a change set — presence in the payload, not a real change | `Framework/DataAbstractionLayer/Event/EntityWrittenContainerEvent.php:179-192` | `public function getPrimaryKeysWithPropertyChange(string $entity, array $properties): array` |
| `EntityWriteEvent` wraps the transaction with `addSuccess()`/`addError()` and is recommended when the before state is needed | `Framework/DataAbstractionLayer/Event/EntityWriteEvent.php:12-17` | `This event is useful when you need the before state of the entity.` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `EntityWrittenEvent` alone tells you which fields changed | absent | Its methods are `getName`, `getContext`, `getErrors`, `getIds`, `getEntityName`, `getPayloads`, `getWriteResults`; no diff API. `Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:58-165` |
| A change set is available for newly inserted orders | absent | `InsertCommand` does not implement `ChangeSetAware`; the factory passes `null`. `Framework/DataAbstractionLayer/Write/Command/InsertCommand.php:12` |
| There is an order-specific write extension point beyond the generic DAL events | absent | `OrderEvents` declares only event-name constants; no order-specific write hook in core. `Checkout/Order/OrderEvents.php:9-49` |
| `ChangeSet` is part of the stable public plugin API | partial | `ChangeSet` is an unmarked Struct, but `ChangeSetAware`/`ChangeSetAwareTrait` — which you must touch to opt in — are `@internal`. `Framework/DataAbstractionLayer/Write/Command/ChangeSetAwareTrait.php:7-11` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Core in-tree usage of the two-step opt-in/consume pattern (the dist package ships no DAL tests) | `Content/Rule/DataAbstractionLayer/RuleAreaUpdater.php:61-85` |
| Core usage of `ChangeSet::getBefore()` on a delete, asserting the change set is non-null once requested | `Checkout/Customer/Subscriber/ProductReviewSubscriber.php:58-61` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `WriteCommand::getDefinition()` removed in 6.6.3.0 with no UPGRADE hint while the order guide still told readers to call it; corrected via shopware/docs PR #2070/#2069 | 6.6.3.0 onward | closed | https://github.com/shopware/shopware/issues/13924 |
| DAL post-write events (`EntityWrittenContainerEvent`, `<entity>.written`) dispatched in system scope, original context source preserved | 6.6.x backport 2026-06-24 | merged | https://github.com/shopware/shopware/pull/17716 |
| Request for a central pre-write enrichment event; reporter notes writing inside `EntityWrittenEvent` causes recursion | 6.4-era, closed 2024 | closed | https://github.com/shopware/shopware/issues/2677 |
| Change-set data reported wrong when several entities are updated in one write | 6.2-era | closed | https://github.com/shopware/shopware/issues/1258 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `WriteCommand` still declare `getDefinition()` in 6.7, or only `getEntityName()`? | code | Core filters on `$command->getEntityName()` (`Content/Rule/DataAbstractionLayer/RuleAreaUpdater.php:55-85`, `Framework/DataAbstractionLayer/Dbal/EntityWriteGateway.php:487-520`); the facts use `getEntityName()`, no `getDefinition()` call remains |
| Is the opt-in still `ChangeSetAware::requestChangeSet()`, and do inserts implement it? | code | Yes; `UpdateCommand`/`DeleteCommand` implement it, `InsertCommand` does not |
| Is `getChangeSet()` null unless requested earlier? | code | `EntityWriteResult.php:76` is nullable; the factory passes `null` for non-`ChangeSetAware` commands |
| Does `OrderEvents::ORDER_WRITTEN_EVENT` still exist and equal `'order.written'`? | code | Yes, `Checkout/Order/OrderEvents.php:11` |
| Does the change set expose snake_case DB column names? | code | Yes — the before state is `SELECT *` on the entity table |
| After PR #17716, what context scope does an `order.written` listener see in 6.7? | not settled by code | The code lane did not trace the dispatch scope; no fact depends on it, so it was not escalated to round 2 |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Listen to `ORDER_WRITTEN_EVENT`, receiving an `EntityWrittenEvent` | "the event `ORDER_WRITTEN_EVENT` is the one to choose" | `listen-to-order-changes.md:24` | yes — `Checkout/Order/OrderEvents.php:11` |
| The change set is not attached by default, for performance | "a changeset of the write operation is not automatically added to the event parameter" | `listen-to-order-changes.md:60` | yes — extra `SELECT` only for opted-in commands, `EntityWriteGateway.php:487-520` |
| Request it via `PreWriteValidationEvent`, triggered before the write result set | "which is triggered **before** the write result set is generated" | `listen-to-order-changes.md:63` | yes — `ChangeSetAware.php:18-22`, `RuleAreaUpdater.php:55-85` |
| Command must be `ChangeSetAware`, filtered by entity, then `requestChangeSet()` | "Afterward we execute the method `requestChangeSet` on the command." | `listen-to-order-changes.md:136` | yes |
| An insert command cannot generate a change set | "an \"insert\" command cannot generate a changeset" | `listen-to-order-changes.md:126` | yes — `InsertCommand.php:12` |
| Read it back via `$result->getChangeSet()` | "now reading the newly generated change set" | `listen-to-order-changes.md:138` | yes — `EntityWriteResult.php:76` |
| Filter on the live version, because admin edits create a draft version | "a new draft version of the order is created, which will be merged with the live version on save" | `listen-to-order-changes.md:132` | not examined by the code lane — dropped from the facts rather than asserted |
| `<entity>.written` refers to `EntityWrittenEvent` and provides no change set | "The written event refers to `…EntityWrittenEvent` and provides the following information" | `using-database-events.md:160-166` | yes |
| `EntityWriteEvent` is the alternative hook when the before state is needed | "This event is useful when you need the before state of the entity." | `using-database-events.md:35` | yes — `Event/EntityWriteEvent.php:12-17` |
| DAL post-write dispatch runs in `Context::SYSTEM_SCOPE`, source preserved | "DAL post-write event dispatch runs in `Context::SYSTEM_SCOPE`" | `adr/2026-06-23-dal-write-events-system-scope.md:29-31` | not examined by the code lane |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The order guide's examples link core sources at tag `v6.6.9.0` and carry no version marker, while the case pins 6.7 | The mechanism the guide describes (`ChangeSetAware` + `requestChangeSet()` on `PreWriteValidationEvent`, consumed via `EntityWriteResult::getChangeSet()`) is unchanged in 6.7.13.0; commands are filtered with `getEntityName()` | `Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:18-22`, `Content/Rule/DataAbstractionLayer/RuleAreaUpdater.php:55-85` |
| Neither the guide nor the DAL-events page mentions that the change-set opt-in API is `@internal` | `ChangeSetAware` and `ChangeSetAwareTrait` are annotated `@internal` in 6.7.13.0, even though a plugin must call `requestChangeSet()` | `Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:7-11` |
| The guide does not state in what form change-set keys appear | Keys are DB storage names (snake_case), unlike `EntityWriteResult::getPayload()`, which is keyed by property name | `Framework/DataAbstractionLayer/Dbal/EntityWriteGateway.php:513-519` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Implement `EventSubscriberInterface` and subscribe to `Shopware\Core\Checkout\Order\OrderEvents::ORDER_WRITTEN_EVENT`, whose handler receives an `EntityWrittenEvent`. | rewritten | kept and extended: code confirms the constant, and adds the load-bearing point that `getPayload()` is not a diff (`EntityWriteResultFactory.php:500-509`) |
| Changesets are not generated by default; additionally subscribe to `PreWriteValidationEvent::class` and, for every command in `$event->getCommands()` that is `ChangeSetAware` and whose `getEntityName()` equals `OrderDefinition::ENTITY_NAME`, call `$command->requestChangeSet()`; then read `$result->getChangeSet()` from `$event->getWriteResults()`. | kept, tagged | confirmed by `ChangeSetAware.php:18-22`, `EntityWriteResult.php:76` and core's `RuleAreaUpdater`; `getEntityName()` (not the removed `getDefinition()`) is what core uses |
| Guard against draft versions with `$event->getContext()->getVersionId() !== Defaults::LIVE_VERSION` (admin edits write a draft version merged into live on save); an insert command can never produce a changeset. | partially removed | the live-version guard is a docs claim the code lane did not examine, so it is not asserted as a fact; the insert clause is retained and moved into fact 3, backed by `InsertCommand.php:12`. Replaced by the code-backed point that change-set keys are DB storage names (`EntityWriteGateway.php:513-519`) |
