---
id: platform/dev/6.7/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md
title: Adding the `StorableFlow` instead of the `FlowEvent` for implementing the flow DelayAction in flow builder
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.html
sourceHash: 1207894a0cf63eb8495819adbf23c59dcbf1e246
codeCheckedAgainst: "6.7.15.1"
keywords: ["StorableFlow", "FlowStorer", "FlowFactory", "OrderStorer", "ScalarValuesStorer", "flow.storer", "FlowEventAware", "delay action", "flow builder", "storer", "lazy loading", "FlowDispatcher"]
summary: "ADR: Flow Builder actions get a serializable StorableFlow built by FlowFactory and FlowStorer classes instead of the original event, enabling delayed actions."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-07-21) that detaches the Flow Builder from the Symfony event system so actions can be delayed. Instead of receiving the original business event, actions receive a `StorableFlow`: scalar data extracted from the event (the "store", serializable) plus restored object data (the "data", rebuilt from the store). Per-aware `Storer` classes do the extraction and restoration.

## When to use

When writing a flow action, writing a storer for a new aware interface, or persisting and later re-executing a flow (delay actions), and you need to know how event data reaches actions.

## Key steps / config

1. The flow dispatcher no longer passes the event to the executor; `FlowFactory::create($event)` runs every storer's `store()` over the event, then `restore()` builds a `StorableFlow` from the result.
2. Each aware interface has its own storer (`OrderStorer`, `MailStorer`, `CustomerStorer`, ...). A storer extends the abstract `FlowStorer` and implements both members; installed storers are tagged `flow.storer`.

```php
class OrderStorer extends FlowStorer
{
    public function store(FlowEventAware $event, array $stored): array
    { /* if OrderAware: $stored[OrderAware::ORDER_ID] = $event->getOrderId(); return $stored; */ }

    public function restore(StorableFlow $storable): void
    { /* if hasStore(ORDER_ID): setData(...), lazy(OrderAware::ORDER, loader) */ }
}
```

3. `restore()` may register a closure with `StorableFlow::lazy($key, $closure)` so large entities are only loaded when an action reads them; the loader must add the associations each entity needs.
4. Actions read values via `StorableFlow::getData($key)` / `getStore($key)` / `hasStore($key)` instead of the event's `getAvailableData`:

```php
if ($flow->hasStore('customerId')) {
    $customerId = $flow->getStore('customerId');
}
```

5. Delayed execution persists `$flow->stored()` (e.g. JSON in a queue table) and later calls `FlowFactory::restore($name, $context, $stored)` to rebuild a `StorableFlow`. In 6.7.15.1 `restore()` takes the event name and a `Context` first, and rebuilds the context with a system source.

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\StorableFlow` — `__construct(string $name, Context $context, array $store = [], array $data = [])`, `setStore`, `hasStore`, `getStore`, `stored`, `setData`, `hasData`, `getData`, `data`, `lazy`
- `Shopware\Core\Content\Flow\Dispatching\Storer\FlowStorer` — `store(FlowEventAware $event, array $stored): array`, `restore(StorableFlow $storable): void`
- `Shopware\Core\Content\Flow\Dispatching\FlowFactory` — `create()`, `restore()`
- `OrderStorer`, `CustomerStorer`, `MailStorer`, `ScalarValuesStorer`
- Service tag `flow.storer`

## Gotchas

- Actions must not access the original event; `getAvailableData` must not be used to fetch data.
- The ADR shows `FlowStorer` as an empty interface and `OrderStorer implements FlowStorer`; the installed `FlowStorer` is an abstract class, so storers `extend` it.
- The ADR's `AdditionalStorer` (generic storage of extra `availableData` entries, entity/scalar/serialized object types) does not exist under that name in 6.7.15.1; `ScalarValuesStorer` is the installed storer for extra scalar values.
- Values used as object types must implement serialization before being stored.
- Symfony event listeners can keep using the aware interfaces (the store is not filled yet at that point); inside the Flow Builder, use only the store because the interfaces might not be implemented.

## Version notes

The ADR planned to remove the `FlowEvent`-based path in the next major. In 6.7.15.1 `StorableFlow` also carries the event name, `Context`, config and flow state, and `FlowFactory` adds `createBuffered()`/`restoreBuffered()`.

## Code check (6.7.15.1)
- corrected `FlowStorer` — docs: empty interface implemented by storers; code: abstract class with abstract store()/restore() — vendor/shopware/core/Content/Flow/Dispatching/Storer/FlowStorer.php:10
- confirmed `OrderStorer` — extends FlowStorer, stores ORDER_ID, lazy-loads order — vendor/shopware/core/Content/Flow/Dispatching/Storer/OrderStorer.php:19
- corrected `StorableFlow::__construct()` — docs: (array $store, array $data); code adds leading $name and Context — vendor/shopware/core/Content/Flow/Dispatching/StorableFlow.php:29
- confirmed `StorableFlow::hasStore()` — checks key in store — vendor/shopware/core/Content/Flow/Dispatching/StorableFlow.php:52
- confirmed `StorableFlow::stored()` — returns serializable store array — vendor/shopware/core/Content/Flow/Dispatching/StorableFlow.php:68
- confirmed `StorableFlow::lazy()` — registers lazy loader closure — vendor/shopware/core/Content/Flow/Dispatching/StorableFlow.php:113
- confirmed `FlowFactory::create()` — runs storers then restore — vendor/shopware/core/Content/Flow/Dispatching/FlowFactory.php:29
- corrected `FlowFactory::restore()` — docs: restore(array $stored, array $data); code: restore(string $name, Context $context, array $stored, array $data) — vendor/shopware/core/Content/Flow/Dispatching/FlowFactory.php:47
- confirmed `flow.storer` — DI tag on storer services — vendor/shopware/core/Content/DependencyInjection/flow.php:337
- absent `AdditionalStorer` — no class of this name in the installed code; ScalarValuesStorer covers extra scalar values
