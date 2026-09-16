---
docType: developer
id: platform/dev/6.6/guides/plugins/plugins/framework/flow/add-flow-builder-action.md
sourceHash: bfc7f40e3230dd2fb385245eff796a622ff56db8
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/flow/add-flow-builder-action.html
title: Add Flow Builder action
version: "6.6"
versions:
  - "6.6"
keywords: ["flow builder action", "FlowAction", "flow.action", "handleFlow", "StorableFlow", "FlowEventAware", "requirements()", "getName", "flow-actions.json", "sw-flow-sequence-action", "custom action", "tag aware", "action.create.tag"]
summary: "How to create a custom Flow Builder action in PHP (FlowAction) and register its label/config in the Administration."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is
This guide shows how to add a custom Flow Builder action: a PHP class handling the action logic plus an Administration UI (label, config modal) for it.

## When to use
When a plugin needs a new action a shop owner can pick in a Flow Builder sequence (e.g. an action that creates tags), beyond the actions Shopware ships with.

## Key steps / config
1. Create an "Aware" interface for the action's data, extending `Shopware\Core\Framework\Event\FlowEventAware`, marked with `#[IsFlowEventAware]`:
```php
#[IsFlowEventAware]
interface TagAware extends FlowEventAware
{
    public const TAG = 'tag';
    public const TAG_ID = 'tagId';
    public function getTag();
}
```
2. Create the action class extending `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`, implementing:
   - `getName(): string` — unique technical name, e.g. `'action.create.tag'`.
   - `requirements(): array` — the Aware interfaces required (e.g. `[TagAware::class]`, `[]` for all events, or `[OrderAware::class, CustomerAware::class]` for a subset).
   - `handleFlow(StorableFlow $flow): void` — use `$flow->getConfig()`, `$flow->getStore($key)` (data from Aware interfaces), `$flow->getData($key)` (data from events).
3. Register the action as a service tagged `flow.action`, with a `priority` and `key`:
```xml
<service id="Swag\CreateTagAction\Core\Content\Flow\Dispatching\Action\CreateTagAction">
    <argument type="service" id="tag.repository" />
    <tag name="flow.action" priority="600" key="action.create.tag"/>
</service>
```
   This tag makes the action appear in the response of `/api/_info/flow-actions.json`; `priority` orders it there.
4. To expose the action to a *new* event, the event class must implement the Aware interface, and a `BusinessEventCollectorSubscriber` (subscribing to `BusinessEventCollectorEvent::NAME`) must register the event with `BusinessEventCollector::define()`.
5. In Administration: define a JS constant for the action name, add snippet translations (`en-GB.json`/`de-DE.json`), then override `sw-flow-sequence-action` (via `Component.override`) to add a `modalName()` case pointing at a custom modal component, and register a description via `getActionDescriptions`.
6. If the action needs configuration, create a modal component (`Component.register`) with a Twig template overriding `sw_condition_value_content`-style blocks, or skip the modal and set config directly by overriding `openDynamicModal()` and calling `onSaveActionSuccess({ config })`.
7. Import new extension/component files from `main.js`.

## Essential identifiers
- `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction` (base class)
- `Shopware\Core\Content\Flow\Dispatching\StorableFlow`
- `Shopware\Core\Framework\Event\FlowEventAware`, `#[IsFlowEventAware]`
- Service tag `flow.action` (attributes `priority`, `key`)
- `Shopware\Core\Framework\Event\BusinessEventCollector`, `BusinessEventCollectorEvent`
- `/api/_info/flow-actions.json`
- `Component.override('sw-flow-sequence-action', ...)`, `modalName()`, `openDynamicModal()`

## Gotchas
- An action displays in the list without a label until the Administration snippet/constant/override steps are done.
- If no modal is defined and `openDynamicModal` isn't overridden, Shopware expects a modal name matching the one referenced in `modalName()`, which errors if it doesn't exist.
- Default action group is "General" unless a `GROUP` constant is defined and passed to `addCondition`.
