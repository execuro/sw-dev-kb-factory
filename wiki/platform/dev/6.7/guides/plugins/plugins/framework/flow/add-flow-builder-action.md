---
id: platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md
title: Add Flow Builder Action
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-action.html
sourceHash: 852b1ba5fa5ce183aa03cdca9605645dc20aff7e
codeCheckedAgainst: "6.7.13.0"
keywords: ["FlowAction", "flow.action", "action.create.tag", "StorableFlow", "FlowEventAware", "IsFlowEventAware", "BusinessEventCollector", "BusinessEventCollectorEvent", "sw-flow-sequence-action", "/api/_info/flow-actions.json", "custom flow action", "flow builder", "aware interface", "flow trigger", "requirements"]
summary: "Create a custom Flow Builder action: FlowAction subclass tagged flow.action (key + priority), aware interface, custom trigger event, and admin UI override."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/flow-concept.md", "platform/dev/6.7/guides/development/troubleshooting/flow-reference.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

Walkthrough for a custom flow action (example `action.create.tag`, plugin `CreateTagAction`): PHP action and registration, scoping via aware interfaces, an optional custom trigger event, and the Administration UI (label, group, config modal).

## When to use

A plugin adds its own action to Flow Builder. Prerequisites: [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md), [DI container](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md), [event subscribers](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md). Existing triggers/actions: [Flow reference](platform/dev/6.7/guides/development/troubleshooting/flow-reference.md).

## Key steps / config

1. **Aware interface** (for scoping) `src/Core/Framework/Event/TagAware.php`: extends `Shopware\Core\Framework\Event\FlowEventAware`, marked `#[IsFlowEventAware]`, constants `TAG = 'tag'`, `TAG_ID = 'tagId'`, method `getTag()`.
2. **Action** `src/Core/Content/Flow/Dispatching/Action/CreateTagAction.php`:

```php
class CreateTagAction extends FlowAction
{
    public function __construct(private EntityRepository $tagRepository) {}
    public static function getName(): string { return 'action.create.tag'; }
    public function requirements(): array { return [TagAware::class]; }
    public function handleFlow(StorableFlow $flow): void
    {
        $config = $flow->getConfig(); // sequence config, e.g. $config['tags']
        // $flow->hasStore(TagAware::TAG_ID), $flow->getStore($key), $flow->getData($key)
        // $this->tagRepository->create($tagData, $flow->getContext());
    }
}
```

   `getStore($key)` reads aware-interface values; `getData($key)` reads original event or additional data.
3. **Register** in `src/Resources/config/services.php`; `priority` sets the order in `/api/_info/flow-actions.json`, `key` must equal `getName()`:

```php
$services->set(Swag\CreateTagAction\Core\Content\Flow\Dispatching\Action\CreateTagAction::class)
    ->args([service('tag.repository')])
    ->tag('flow.action', ['priority' => 600, 'key' => 'action.create.tag']);
```

4. **Scope** via `requirements()`: `[]` = all triggers; `[OrderAware::class, CustomerAware::class]` = only those events; `[TagAware::class]` = events implementing `TagAware`.
5. **Custom trigger** (optional): `BasicExampleEvent extends Event implements TagAware` with `EVENT_NAME = 'example.event'`, `getName()`, static `getAvailableData()` (`(new EventDataCollection())->add('tag', new EntityType(TagDefinition::class))`), `getContext()`, `getTag()`. A subscriber on `BusinessEventCollectorEvent::NAME` calls `$this->businessEventCollector->define(BasicExampleEvent::class)` and adds the definition to `$event->getCollection()`; register it with argument `Shopware\Core\Framework\Event\BusinessEventCollector` and tag `kernel.event_subscriber`. Trigger label: `sw-flow.triggers` in `src/Resources/app/administration/src/module/sw-flow/snippet/en-GB.json`.
6. **Admin label and group**: constant file with `ACTION = { CREATE_TAG: 'action.create.tag' }` and `GROUP = 'customer'`; snippets `create-tag-action.*`. `Component.override('sw-flow-sequence-action', …)` overriding computed `groups` (only for a new group) and `modalName` (returns `'sw-flow-create-tag-modal'`), and methods `getActionDescriptions(sequence)` and `getActionTitle(actionName)` (returns `{ value, icon, label, group }`), falling back to `this.$super(...)`; import in `main.js`. Groups: `general` (default), `tag`, `customer`, `order`.
7. **Config modal**: `Component.register('sw-flow-create-tag-modal', …)` (index.js + twig using `sw-modal`, `sw-entity-tag-select`), prop `sequence`, emits `process-finish` with `{ ...this.sequence, config }` and `modal-close`; import in `main.js`.
8. **No modal**: override `openDynamicModal(value)`; when `value` is your action, set `this.selectedAction`, call `this.onSaveActionSuccess({ config })`, then `return`.

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`, `Shopware\Core\Content\Flow\Dispatching\StorableFlow`
- `Shopware\Core\Framework\Event\FlowEventAware`, `Shopware\Core\Framework\Event\IsFlowEventAware`
- `flow.action` tag (`priority`, `key`), `/api/_info/flow-actions.json`
- `Shopware\Core\Framework\Event\BusinessEventCollector`, `BusinessEventCollectorEvent::NAME`
- Admin: `sw-flow-sequence-action`, `flowBuilderService`

## Gotchas

- The docs' prose names the parent interface `Shopware\Core\Framework\Event\FLowEventAware` (capital L); that spelling does not exist in code.
- `TagAware` snippet namespace `Swag\ExamplePlugin\...` differs from the action's import `Swag\CreateTagAction\...`; keep them consistent.
- `FlowExecutor` indexes `flow.action` services by `key`; omitting it breaks execution.
- The no-modal example uses `Component.register('sw-flow-sequence-action', …)`, but core already registers it — use `Component.override`. `flowBuilderService.getActionName('CREATE_TAG')` only resolves after `flowBuilderService.addActionNames({ CREATE_TAG: 'action.create.tag' })`.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Event\FLowEventAware` — wrong casing; the interface is FlowEventAware
- confirmed `FlowEventAware::getAvailableData()` — static; with getName() and ShopwareEvent::getContext() — vendor/shopware/core/Framework/Event/FlowEventAware.php:11
- confirmed `IsFlowEventAware` — class-level attribute — vendor/shopware/core/Framework/Event/IsFlowEventAware.php:9
- confirmed `FlowAction::requirements()` — abstract; getName() static abstract at line 18 — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:14
- confirmed `flow.action` — tagged_iterator index-by key in FlowExecutor — vendor/shopware/core/Content/DependencyInjection/flow.xml:61
- confirmed `/api/_info/flow-actions.json` — InfoController route api.info.actions — vendor/shopware/core/Framework/Api/Controller/InfoController.php:231
- confirmed `StorableFlow::getStore()` — reads aware store values — vendor/shopware/core/Content/Flow/Dispatching/StorableFlow.php:60
- confirmed `BusinessEventCollector::define()` — returns ?BusinessEventDefinition — vendor/shopware/core/Framework/Event/BusinessEventCollector.php:55
- corrected `sw-flow-sequence-action` — docs: Component.register in no-modal example; core already registers it — vendor/shopware/administration/Resources/app/administration/src/module/sw-flow/index.js:17
- confirmed `addActionNames` — needed before getActionName('CREATE_TAG') resolves — vendor/shopware/administration/Resources/app/administration/src/module/sw-flow/service/flow-builder.service.ts:185
