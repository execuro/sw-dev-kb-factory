---
id: platform/dev/6.7/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md
title: Adding the `StorableFlow` instead of the `FlowEvent` for implementing the flow DelayAction in flow builder
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.html
sourceHash: 1207894a0cf63eb8495819adbf23c59dcbf1e246
codeCheckedAgainst: "6.7.13.0"
keywords: ["StorableFlow", "FlowStorer", "FlowFactory", "OrderStorer", "ScalarValuesStorer", "FlowEventAware", "flow builder", "delay action", "storer", "hasStore", "getStore", "lazy loading", "aware interface", "restore flow data"]
summary: ADR introducing StorableFlow, FlowStorer and FlowFactory so Flow Builder actions use scalar-stored, restorable data instead of original events (delay action).
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022) that decouples the Flow Builder from the event system: flow actions receive a `Shopware\Core\Content\Flow\Dispatching\StorableFlow` instead of the original `FlowEvent`. Event data is stored as scalar values by storer classes and restored (possibly lazily) later, which makes delayed actions possible — stored data can be serialized, persisted and turned back into a flow after the delay, with fresh data.

## When to use

When writing a flow action or a custom storer, when passing data from a `FlowEventAware` event to flow actions, or when you need to understand why actions must not access the original event.

## Key steps / config

1. For each aware interface there is a storer extending the abstract `Shopware\Core\Content\Flow\Dispatching\Storer\FlowStorer`. It must declare `store()` (copy the scalar representation from the event into the stored array and return it) and `restore()` (rebuild data on the flow):

```php
class OrderStorer extends FlowStorer
{
    public function store(FlowEventAware $event, array $stored): array
    {
        if ($event instanceof OrderAware) { $stored[OrderAware::ORDER_ID] = $event->getOrderId(); }
        return $stored;
    }

    public function restore(StorableFlow $storable): void
    {
        if ($storable->hasStore(OrderAware::ORDER_ID)) { $storable->lazy(OrderAware::ORDER, /* loader closure */); }
    }
}
```

2. `FlowFactory::create(FlowEventAware $event)` runs every storer's `store()`, then `restore($name, $context, $stored)` builds a `StorableFlow` and runs every storer's `restore()`.
3. In actions read data from the flow, not the event: `$flow->hasStore('customerId')` / `$flow->getStore('customerId')`, or `$flow->getData($key)` (resolves lazy closures).
4. Delayed execution: persist `json_encode($flow->stored())`, later call `FlowFactory::restore($name, $context, $stored)` to get a new `StorableFlow`.

`StorableFlow` API: `setStore`, `hasStore`, `getStore($key, $default = null)`, `stored()`, `setData`, `hasData`, `getData($key, $default = null)`, `data()`, `lazy($key, callable)`, plus `getName()`, `getContext()`.

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\StorableFlow`
- `Shopware\Core\Content\Flow\Dispatching\Storer\FlowStorer` (`store()`, `restore()`)
- `Shopware\Core\Content\Flow\Dispatching\FlowFactory` (`create()`, `restore()`)
- `OrderStorer`, `ScalarValuesStorer`, `FlowEventAware`, `OrderAware`

## Gotchas

- The ADR sketches `FlowStorer` as an empty interface and `StorableFlow` with a `(array $store, array $data)` constructor; in code `FlowStorer` is an abstract class and `StorableFlow` takes `(string $name, Context $context, array $store = [], array $data = [])` with an `@internal` constructor — obtain it via `FlowFactory`.
- The ADR's `AdditionalStorer` is not in the installed code; generic scalar values from `ScalarValuesAware` events are stored and restored as flow data by `ScalarValuesStorer`.
- `FlowFactory::restore()` needs the event name and a `Context`, not only the stored array; it rebuilds the context with a `SystemSource`.
- Symfony event listeners may still use aware interfaces; inside the Flow Builder only use the store, since interfaces might not be implemented.
- `getAvailableData` must not be used to access data.

## Code check (6.7.13.0)
- corrected `FlowStorer` — docs: `interface FlowStorer {}`; abstract class — vendor/shopware/core/Content/Flow/Dispatching/Storer/FlowStorer.php:10
- confirmed `FlowStorer::store()` — abstract `store(FlowEventAware $event, array $stored): array` — vendor/shopware/core/Content/Flow/Dispatching/Storer/FlowStorer.php:17
- confirmed `FlowStorer::restore()` — abstract `restore(StorableFlow $storable): void` — vendor/shopware/core/Content/Flow/Dispatching/Storer/FlowStorer.php:19
- corrected `StorableFlow::__construct()` — docs: `(array $store, array $data)`; also requires name and Context — vendor/shopware/core/Content/Flow/Dispatching/StorableFlow.php:29
- confirmed `StorableFlow::lazy()` — stores closure resolved by getData — vendor/shopware/core/Content/Flow/Dispatching/StorableFlow.php:113
- confirmed `StorableFlow::stored()` — returns stored scalar array — vendor/shopware/core/Content/Flow/Dispatching/StorableFlow.php:68
- confirmed `FlowFactory::create()` — builds flow from FlowEventAware event — vendor/shopware/core/Content/Flow/Dispatching/FlowFactory.php:29
- corrected `FlowFactory::restore()` — docs: `restore(array $stored = [], array $data = [])`; needs name and Context — vendor/shopware/core/Content/Flow/Dispatching/FlowFactory.php:47
- confirmed `OrderStorer` — extends FlowStorer, stores OrderAware::ORDER_ID — vendor/shopware/core/Content/Flow/Dispatching/Storer/OrderStorer.php:19
- confirmed `ScalarValuesStorer` — stores ScalarValuesAware values, restores them via setData — vendor/shopware/core/Content/Flow/Dispatching/Storer/ScalarValuesStorer.php:11
