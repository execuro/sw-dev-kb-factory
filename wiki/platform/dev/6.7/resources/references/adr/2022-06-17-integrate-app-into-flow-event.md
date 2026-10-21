---
id: platform/dev/6.7/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md
title: Integrate an app into the flow event
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-06-17-integrate-app-into-flow-event.html
sourceHash: 1804186959bda05065ff4e03e4cf0b35efdb4553
codeCheckedAgainst: "6.7.15.1"
keywords: ["CustomAppAware", "CustomAppEvent", "CustomAppStorer", "FlowEventAware", "BusinessEventCollector", "api.action.trigger_event", "flow.xml", "app_flow_event", "custom trigger", "flow builder", "app flow event", "sw-flow-custom-event"]
summary: "ADR: apps add custom Flow Builder triggers via flow.xml flow-event entries, CustomAppEvent, CustomAppStorer and the trigger-event Admin API route."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-10-11) describing how apps extend the list of trigger events in the Flow Builder. An app declares custom flow events in `flow.xml`; the core stores them in the `app_flow_event` table, lists them as triggers, and dispatches a `CustomAppEvent` when the app calls an Admin API route with the event name and a data payload.

## When to use

When building an app that needs its own Flow Builder trigger (for example `swag.before.open.the.doors`) and wants to pass arbitrary data into flow actions and mail templates.

## Key steps / config

1. Declare events in the app's `Resources/flow.xml` (loaded relative to the app root). `<name>` is the unique technical name, prefixed with the app vendor prefix; one or more `<aware>` elements decide which flow actions are offered after the trigger. Several events can be defined in one file.

```xml
<flow-extensions xmlns:xsi="..." xsi:noNamespaceSchemaLocation="https://test-flow.com/flow-1.0.xsd">
    <flow-events>
        <flow-event>
            <name>swag.before.open.the.doors</name>
            <aware>customerAware</aware>
            <aware>orderAware</aware>
        </flow-event>
    </flow-events>
</flow-extensions>
```

   Aware values listed by the ADR: `orderAware`, `customerAware`, `mailAware`, `userAware`, `salesChannelAware`, `productAware`, `customerGroupAware`. `orderAware` unlocks e.g. `action.add.order.tag`, `action.generate.document`, `action.set.order.state`; `customerAware` unlocks e.g. `action.add.customer.tag`, `action.change.customer.group`; `action.stop.flow` is available in both.

2. Trigger the event: `POST /api/_action/trigger-event/{eventName}` (route `api.action.trigger_event`, ACL privilege `flow:dispatch`). The request body is the data, e.g. `{"customerId": "...", "salesChannelId": "...", "shopName": "...", "url": "..."}`. The controller looks up an `app_flow_event` row with that `name` whose app is active, then dispatches `new CustomAppEvent($eventName, $data, $context)`; unknown names raise a not-found error.

3. `CustomAppStorer` copies each body key into the flow store (both under `ScalarValuesAware::STORE_VALUES` and at the top level), so actions read it via the `StorableFlow` and mail templates can use `{{ shopName }}`, `{{ url }}`.

4. Translate trigger names in an admin snippet file under the app's `src/Resources/app/administration/snippet/`:

```json
{ "sw-flow-custom-event": {
    "event-tree": { "swag": "Swag", "before": "Before", "openTheDoors": "Open the doors" },
    "flow-list": { "swag_before_open_the_doors": "Before open the doors" } } }
```

Shape of the storer (per installed `FlowStorer`):

```php
class CustomAppStorer extends FlowStorer
{
    public function store(FlowEventAware $event, array $stored): array { /* ... */ }
    public function restore(StorableFlow $storable): void { /* no-op */ }
}
```

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\Aware\CustomAppAware` — `CUSTOM_DATA = 'customAppData'`, `getCustomAppData(): ?array`
- `Shopware\Core\Framework\App\Event\CustomAppEvent` (implements `CustomAppAware`, `FlowEventAware`)
- `Shopware\Core\Content\Flow\Dispatching\Storer\CustomAppStorer`
- `Shopware\Core\Framework\Event\BusinessEventCollector::collect()` — merges active app events from `app_flow_event`
- `Shopware\Core\Content\Flow\Controller\TriggerFlowController::trigger()` — `api.action.trigger_event`
- Table `app_flow_event`: `id`, `app_id`, `name` (unique), `aware` (JSON), `custom_fields`, `created_at`, `updated_at`

## Gotchas

- The ADR's pseudocode names the constant `APP_DATA`, the storer `CustomAppStore`, and the controller method `flowCustomTrigger` filtering by `flowAppEventId`/`flowId`; the installed code uses `CUSTOM_DATA`, `CustomAppStorer`, and `trigger()` filtering by `name` and `app.active`.
- The XSD restricts `<name>` to the pattern `[a-z][a-z._]*[a-z]`; at least one `<aware>` is required.
- App events are only listed while the app is active.

## Version notes

The ADR pseudocode annotates the trigger route with `@Since("6.5.2.0")`; the `app_flow_event` table is created by a `V6_5` migration.

## Code check (6.7.15.1)
- corrected `CustomAppAware::CUSTOM_DATA` — docs: constant `APP_DATA`, `getCustomAppData(): array`; code returns `?array` — vendor/shopware/core/Content/Flow/Dispatching/Aware/CustomAppAware.php:12
- corrected `CustomAppStorer` — docs: `CustomAppStore`; store() returns `$stored` — vendor/shopware/core/Content/Flow/Dispatching/Storer/CustomAppStorer.php:12
- confirmed `FlowStorer` — abstract `store()` and `restore()` — vendor/shopware/core/Content/Flow/Dispatching/Storer/FlowStorer.php:10
- confirmed `CustomAppEvent` — extends Event, implements CustomAppAware and FlowEventAware — vendor/shopware/core/Framework/App/Event/CustomAppEvent.php:16
- corrected `api.action.trigger_event` — docs: method `flowCustomTrigger` filtering by flowId; code `trigger()` filters by name, ACL `flow:dispatch` — vendor/shopware/core/Content/Flow/Controller/TriggerFlowController.php:37
- confirmed `BusinessEventCollector::fetchAppEvents()` — reads active app events from `app_flow_event` — vendor/shopware/core/Framework/Event/BusinessEventCollector.php:88
- corrected `app_flow_event` — docs omit `custom_fields` JSON column — vendor/shopware/core/Migration/V6_5/Migration1655697288AppFlowEvent.php:23
- corrected `Resources/flow.xml` — docs: `<appRoot>/src/Resources/flow.xml`; loaded as `Resources/flow.xml` from the app filesystem — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowEventLifecycleHandler.php:91
- confirmed `flow-event` — XSD element with `name` and repeatable `aware` — vendor/shopware/core/Framework/App/Flow/Schema/flow-1.0.xsd:153
- confirmed `sw-flow-custom-event` — admin snippet key for event-tree labels — vendor/shopware/administration/Resources/app/administration/src/module/sw-flow/component/sw-flow-trigger/index.js:743
