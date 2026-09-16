---
id: "platform/dev/6.6/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md"
title: "Adding the `StorableFlow` instead of the `FlowEvent` for implementing the flow DelayAction in flow builder"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.html"
sourceHash: "1207894a0cf63eb8495819adbf23c59dcbf1e246"
keywords: ["StorableFlow", "FlowEvent", "FlowStorer", "FlowFactory", "FlowDispatcher", "OrderStorer", "AdditionalStorer", "flow builder", "DelayAction", "aware interface", "getData", "getStore"]
summary: "ADR: Flow Builder replaces FlowEvent with StorableFlow, decoupling actions from original events so delayed actions can restore data."
lastBuilt: "2026-09-15"
---
## What it is
ADR to replace `FlowEvent` with a new `StorableFlow` class as the data actions in Flow Builder operate on, decoupling the Flow system from the Event system so a delayed action can still access event data after the original event object is gone.

## When to use
Relevant when implementing a Flow Builder action that must run after a delay (e.g. `DelayAction`), or any flow action that previously read data via an Aware interface directly on the original event.

## Key steps / config
- `StorableFlow` holds two arrays: `$store` (serializable scalar values) and `$data` (restored objects, not serializable but rebuildable from `$store`), with `setStore`/`getStore`/`setData`/`getData`.
- Each Aware interface gets a corresponding `Storer` class (e.g. `OrderStorer`, `MailStorer`, `CustomerStorer`) implementing `FlowStorer`, with a `store(FlowEventAware $event, array $stored): array` and `restore(StorableFlow $flow): void` method.
- An `AdditionalStorer` covers event data declared via `getAvailableData()` that isn't covered by any Aware interface; entity/collection values store `id`+`entity`, scalar values store directly, and object values must implement `/Serializable`.
- `FlowFactory::create(FlowEventAware $event)` runs all storers' `store()` to build a `StorableFlow`; `FlowFactory::restore(array $stored)` rebuilds a `StorableFlow` from previously persisted `$stored` data (used for delayed actions, e.g. loaded back from a queue table).
- `FlowDispatcher::dispatch()` now creates/restores a `StorableFlow` via `FlowFactory` and executes actions against it instead of the raw event.
- Flow actions read data with `$event->hasStore('key')` / `$event->getStore('key')` instead of casting the original event to an Aware interface.

```php
class FlowFactory
{
    public function create(FlowEventAware $event) { /* runs storer->store() for each storer */ }
    public function restore(array $stored = [], array $data = []) { /* rebuilds StorableFlow */ }
}
```

## Essential identifiers
`StorableFlow`, `FlowStorer`, `FlowFactory`, `FlowDispatcher`, `AdditionalStorer`, `FlowEventAware`.

## Gotchas
Flow Builder actions can no longer access the original event object; only the `StorableFlow` store/data is available. Symfony event listeners (outside Flow Builder) may still use the original `FlowEvent` and its Aware interfaces, since the store is not filled for them — that support is planned for removal in a future major version.
