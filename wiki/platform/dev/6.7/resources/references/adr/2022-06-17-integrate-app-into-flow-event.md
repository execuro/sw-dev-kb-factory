---
id: platform/dev/6.7/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md
title: Integrate an app into the flow event
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-06-17-integrate-app-into-flow-event.html
sourceHash: 1804186959bda05065ff4e03e4cf0b35efdb4553
codeCheckedAgainst: "6.7.13.0"
keywords: ["flow builder", "custom trigger", "app flow event", "CustomAppEvent", "CustomAppAware", "CustomAppStorer", "FlowEventAware", "BusinessEventCollector", "app_flow_event", "flow.xml", "api.action.trigger_event", "/api/_action/trigger-event/{eventName}", "sw-flow-custom-event", "adr"]
summary: "ADR: apps declare custom Flow Builder trigger events in flow.xml (app_flow_event) and fire them via POST /api/_action/trigger-event/{eventName}."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (area services-settings) letting apps add their own Flow Builder trigger events. Apps declare events in `flow.xml`; core stores them in `app_flow_event`, lists them as triggers, and dispatches a `CustomAppEvent` when the app calls an Admin API endpoint with the event name and data.

## When to use

When an app needs a custom Flow Builder trigger whose payload is usable in flow actions and mail templates, or when an app trigger is missing from the trigger list.

## Key steps / config

1. Declare events in the app's `Resources/flow.xml` (schema: core `Framework/App/Flow/Schema/flow-1.0.xsd`). `<name>` is unique and vendor-prefixed; each repeatable `<aware>` decides which actions are offered: `orderAware`, `customerAware`, `mailAware`, `userAware`, `salesChannelAware`, `productAware`, `customerGroupAware`.

```xml
<flow-extensions>
    <flow-events>
        <flow-event>
            <name>swag.before.open.the.doors</name>
            <aware>customerAware</aware>
            <aware>orderAware</aware>
        </flow-event>
    </flow-events>
</flow-extensions>
```

2. On app install/update the events are persisted to `app_flow_event` (`id`, `appId`, `name` max 255, `aware` list, `customFields`).
3. `BusinessEventCollector` adds every `app_flow_event` of an active app as a trigger backed by `CustomAppEvent`.
4. Trigger: `POST /api/_action/trigger-event/{eventName}` (route `api.action.trigger_event`), body = data such as `{ "customerId": "...", "shopName": "...", "url": "..." }`. The controller requires an `app_flow_event` with that `name` on an active app, then dispatches `new CustomAppEvent($eventName, $data, $context)`.
5. `CustomAppStorer` copies each key of `getCustomAppData()` into the stored flow data (also under `ScalarValuesAware::STORE_VALUES`), so actions read it via `$flow->getData(...)` and mail templates via `{{ shopName }}`.
6. Admin snippets: key `sw-flow-custom-event` with fixed sub-keys `event-tree` (name segments, e.g. `openTheDoors`) and `flow-list` (e.g. `swag_before_open_the_doors`).

## Essential identifiers

- `Shopware\Core\Framework\App\Event\CustomAppEvent`
- `Shopware\Core\Content\Flow\Dispatching\Aware\CustomAppAware::getCustomAppData()`
- `Shopware\Core\Content\Flow\Dispatching\Storer\CustomAppStorer`
- `BusinessEventCollector`, `TriggerFlowController`
- `app_flow_event`, `api.action.trigger_event`

## Gotchas

- The ADR pseudocode is outdated: the constant is `CUSTOM_DATA` (not `APP_DATA`), `getCustomAppData()` returns `?array`, the storer is `CustomAppStorer` (not `CustomAppStore`), and the controller looks events up by `name`, not `flowAppEventId`/`flowId`.
- The ADR's XML sample uses a placeholder schema location.

## Version notes

`app_flow_event` and the trigger API exist since `6.5.2.0`.

## Code check (6.7.13.0)
- corrected `CustomAppAware::CUSTOM_DATA` — docs: APP_DATA constant — vendor/shopware/core/Content/Flow/Dispatching/Aware/CustomAppAware.php:12
- corrected `CustomAppAware::getCustomAppData()` — docs: returns array; code returns ?array — vendor/shopware/core/Content/Flow/Dispatching/Aware/CustomAppAware.php:17
- corrected `CustomAppStorer` — docs: CustomAppStore — vendor/shopware/core/Content/Flow/Dispatching/Storer/CustomAppStorer.php:12
- confirmed `FlowStorer` — abstract store() and restore() — vendor/shopware/core/Content/Flow/Dispatching/Storer/FlowStorer.php:10
- confirmed `FlowEventAware` — requires getAvailableData() and getName() — vendor/shopware/core/Framework/Event/FlowEventAware.php:9
- confirmed `CustomAppEvent` — extends Event, implements CustomAppAware, FlowEventAware — vendor/shopware/core/Framework/App/Event/CustomAppEvent.php:13
- corrected `api.action.trigger_event` — docs: lookup by flowAppEventId; code filters by name and app.active — vendor/shopware/core/Content/Flow/Controller/TriggerFlowController.php:37
- confirmed `BusinessEventCollector::fetchAppEvents()` — reads app_flow_event of active apps — vendor/shopware/core/Framework/Event/BusinessEventCollector.php:88
- confirmed `app_flow_event` — entity name, since 6.5.2.0 — vendor/shopware/core/Framework/App/Aggregate/FlowEvent/AppFlowEventDefinition.php:24
- corrected `Resources/flow.xml` — docs: src/Resources/flow.xml; read relative to app filesystem — vendor/shopware/core/Framework/App/Lifecycle/Handler/FlowEventLifecycleHandler.php:91
