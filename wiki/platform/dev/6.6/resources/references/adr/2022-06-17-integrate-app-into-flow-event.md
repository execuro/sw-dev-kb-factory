---
id: "platform/dev/6.6/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md"
title: "Integrate an app into the flow event"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-06-17-integrate-app-into-flow-event.html"
sourceHash: "1804186959bda05065ff4e03e4cf0b35efdb4553"
keywords: ["CustomAppAware", "CustomAppEvent", "CustomAppStorer", "FlowStorer", "FlowEventAware", "BusinessEventCollector", "flow.xml", "StorableFlow", "flow builder", "app system", "trigger-event API", "aware"]
summary: "ADR: apps can add custom flow-builder trigger events via flow.xml, CustomAppEvent, and a trigger API, using FlowStorer to persist data."
lastBuilt: "2026-09-15"
---
## What it is
ADR describing how apps extend the Flow Builder's list of trigger events, so a 3rd-party app can define and dispatch its own event that appears in the flow trigger tree.

## When to use
When an app needs to register a custom trigger event for the Flow Builder (instead of relying only on core-dispatched events) and needs data from that event available to flow actions.

## Key steps / config
- Apps declare a `CustomAppAware`-style interface (e.g. with a `getCustomAppData()` method) so flow storers know what data the app event carries.
- A `CustomAppStorer` (a `FlowStorer`) copies data supplied via the trigger API into the flow store by key so flow actions can read it later.
- `CustomAppEvent` (extends `Event`, implements `CustomAppAware`, `FlowEventAware`) is the event class apps dispatch.
- `BusinessEventCollector` is extended to also collect `CustomAppEvent`s registered by active apps.
- A REST endpoint triggers custom events: `POST /api/_action/trigger-event/{eventName}` (route name `api.action.trigger_event`, since `6.5.2.0`) accepts a body with `flowAppEventId`/`flowId` and dispatches a `CustomAppEvent`.
- Apps declare events in `<appRoot>/src/Resources/flow.xml` using a `<flow-event>` block with a `<name>` (technical name, vendor-prefixed) and one or more `<aware>` tags choosing which flow actions become available (`orderAware`, `customerAware`, `mailAware`, `userAware`, `salesChannelAware`, `productAware`, `customerGroupAware`).

```xml
<flow-extensions xsi:noNamespaceSchemaLocation="https://test-flow.com/flow-1.0.xsd">
  <flow-events>
    <flow-event>
      <name>swag.before.open.the.doors</name>
      <aware>customerAware</aware>
      <aware>orderAware</aware>
    </flow-event>
  </flow-events>
</flow-extensions>
```

- Trigger-tree/trigger-list translations for the custom event go in a snippet file under `<appRoot>/src/Resources/app/administration/snippet/`, nested under the fixed keys `sw-flow-custom-event`, `event-tree`, and `flow-list`.
- A new table `app_flow_event` (columns `id`, `app_id`, `name`, `aware`, `created_at`, `updated_at`) persists events declared in `flow.xml`.

## Essential identifiers
`CustomAppAware`, `CustomAppEvent`, `CustomAppStorer`, `FlowStorer`, `FlowEventAware`, `BusinessEventCollector`, `app_flow_event` table, `flow.xml`, `api.action.trigger_event` route, `sw-flow-custom-event` snippet key.

## Gotchas
Flow actions must go through the `FlowStorer`/`StorableFlow` mechanism since apps cannot provide native PHP event objects the core recognizes directly; the trigger API returns HTTP 404 if the referenced flow app event is empty/not found.
