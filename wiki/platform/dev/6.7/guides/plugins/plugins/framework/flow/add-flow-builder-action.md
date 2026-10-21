---
id: platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md
title: Add Flow Builder Action
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-action.html
sourceHash: 852b1ba5fa5ce183aa03cdca9605645dc20aff7e
codeCheckedAgainst: "6.7.15.1"
keywords: ["FlowAction", "flow.action", "StorableFlow", "IsFlowEventAware", "FlowEventAware", "BusinessEventCollector", "BusinessEventCollectorEvent", "/api/_info/flow-actions.json", "sw-flow-sequence-action", "flowBuilderService", "custom flow action", "flow builder action", "action.create.tag", "aware interface"]
summary: Custom Flow Builder action - FlowAction subclass tagged flow.action, requirements() via aware interfaces, admin sw-flow-sequence-action override.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/flow-concept.md", "platform/dev/6.7/guides/development/troubleshooting/flow-reference.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How to add a custom action to the Flow Builder: a PHP `FlowAction` registered as a tagged service (example: `action.create.tag`, which creates tags) plus an Administration extension that labels the action and provides its configuration UI. Existing triggers and actions: [Flow reference](platform/dev/6.7/guides/development/troubleshooting/flow-reference.md); background: [Flow Builder concept](platform/dev/6.7/concepts/framework/flow-concept.md).

## When to use

A plugin must perform its own business task when a flow fires, selectable by the shop owner in the Flow Builder. Requires a plugin, [Dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) and an event subscriber ([Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)).

## Key steps / config

**1. Aware interface** - marks events carrying the data the action needs. The installed code detects awareness by the `#[IsFlowEventAware]` attribute on the interface:

```php
use Shopware\Core\Framework\Event\IsFlowEventAware;

#[IsFlowEventAware]
interface TagAware
{
    public const TAG = 'tag';
    public const TAG_ID = 'tagId';
    public function getTag();
}
```

**2. Action class** extending `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`:

```php
class CreateTagAction extends FlowAction
{
    public function __construct(private EntityRepository $tagRepository) {}
    public static function getName(): string { return 'action.create.tag'; }
    public function requirements(): array { return [TagAware::class]; }
    public function handleFlow(StorableFlow $flow): void
    {
        $config = $flow->getConfig();               // config saved with the sequence
        $tagId = $flow->getStore(TagAware::TAG_ID); // data from aware interfaces
        $tag = $flow->getData(TagAware::TAG);       // data from the original event
        /* ... $this->tagRepository->create($tagData, $flow->getContext()); */
    }
}
```

**3. Register** in `src/Resources/config/services.php`; tag `key` must equal `getName()`, `priority` orders the action in `/api/_info/flow-actions.json`:

```php
$services->set(CreateTagAction::class)
    ->args([service('tag.repository')])
    ->tag('flow.action', ['priority' => 600, 'key' => 'action.create.tag']);
```

**4. Scope** via `requirements()`: `[]` = all events; `[OrderAware::class, CustomerAware::class]` = events with that awareness; `[TagAware::class]` = a new plugin event implementing `TagAware` and `FlowEventAware` (`getName()`, static `getAvailableData()`, `getContext()`). Add that event to the trigger list with a `kernel.event_subscriber` on `BusinessEventCollectorEvent::NAME` that calls `BusinessEventCollector::define(BasicExampleEvent::class)` and sets the result into `$event->getCollection()`. Trigger label snippet: `sw-flow.triggers.*` in `src/Resources/app/administration/src/module/sw-flow/snippet/en-GB.json`.

**5. Administration** (`src/Resources/app/administration/src/`):

- constants `ACTION = { CREATE_TAG: 'action.create.tag' }`, `GROUP = 'customer'`; snippets `create-tag-action.*` (en-GB, de-DE).
- `Component.override('sw-flow-sequence-action', ...)`: computed `groups()`, `modalName()` (return `'sw-flow-create-tag-modal'` for the action, else `this.$super('modalName')`); methods `getActionDescriptions(sequence)`, `getActionTitle(actionName)` returning `{ value, icon, label, group }`.
- `Component.register('sw-flow-create-tag-modal', ...)` with prop `sequence`; emits `process-finish` with `{ ...this.sequence, config }` and `modal-close`. Import both in `main.js`.
- Without a modal: override `openDynamicModal(value)`, set `this.selectedAction`, call `this.onSaveActionSuccess({ config })`.
- Groups: `general` (default), `tag`, `customer`, `order`.

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`, `Shopware\Core\Content\Flow\Dispatching\StorableFlow`
- `Shopware\Core\Framework\Event\IsFlowEventAware`, `Shopware\Core\Framework\Event\FlowEventAware`
- `Shopware\Core\Framework\Event\BusinessEventCollector`, `BusinessEventCollectorEvent::NAME`
- DI tag `flow.action` (`priority`, `key`); `/api/_info/flow-actions.json`
- Admin: `sw-flow-sequence-action`, `flowBuilderService`, `onSaveActionSuccess`, `openDynamicModal`

## Gotchas

- The source says the aware interface extends the misspelled `Shopware\Core\Framework\Event\FLowEventAware`; that name does not exist. Core aware interfaces (e.g. `CustomerAware`) carry `#[IsFlowEventAware]` and do not extend `FlowEventAware`; only the event class implements it.
- `BusinessEventCollector::define()` instantiates the event without its constructor and calls `getName()`; an empty name skips the event.
- The source's `groups()` override does `this.actionGroups.unshift(GROUP)`, but `actionGroups` is rebuilt from `flowBuilderService.getGroups()` on each access, so the push does not persist; `flowBuilderService.addGroups()` registers a new group.
- `flowBuilderService.getActionName('CREATE_TAG')` only resolves keys added via `addActionNames()`.
- The modal-less example uses `Component.register('sw-flow-sequence-action', ...)`, while the rest of the guide extends that core component with `Component.override`.

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\Event\FLowEventAware` — misspelling; correct name is `Shopware\Core\Framework\Event\FlowEventAware`
- confirmed `FlowAction::requirements()` — abstract, with `handleFlow()` and static `getName()` — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:14
- confirmed `FlowEventAware::getAvailableData()` — static, with `getName()`; extends `ShopwareEvent` (`getContext()`) — vendor/shopware/core/Framework/Event/FlowEventAware.php:11
- corrected `IsFlowEventAware` — docs: aware interface extends FlowEventAware; awareness read from attribute — vendor/shopware/core/Framework/Event/BusinessEventCollector.php:74
- confirmed `BusinessEventCollector::define()` — instantiates without constructor, requires `FlowEventAware` — vendor/shopware/core/Framework/Event/BusinessEventCollector.php:55
- confirmed `BusinessEventCollectorEvent::NAME` — `collect.business-events` — vendor/shopware/core/Framework/Event/BusinessEventCollectorEvent.php:14
- confirmed `flow.action` — actions collected by tagged iterator indexed by `key` — vendor/shopware/core/Content/DependencyInjection/flow.php:164
- confirmed `/api/_info/flow-actions.json` — route `api.info.actions` — vendor/shopware/core/Framework/Api/Controller/InfoController.php:238
- corrected `actionGroups` — docs: unshift into it; getter rebuilt from `getGroups()` — vendor/shopware/administration/Resources/app/administration/src/module/sw-flow/store/flow.store.ts:162
- confirmed `addGroups` — registers action groups in `flowBuilderService` — vendor/shopware/administration/Resources/app/administration/src/module/sw-flow/service/flow-builder.service.ts:190
