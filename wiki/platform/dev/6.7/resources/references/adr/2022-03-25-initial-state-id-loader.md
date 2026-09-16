---
id: platform/dev/6.7/resources/references/adr/2022-03-25-initial-state-id-loader.md
title: Initial state id loader
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-initial-state-id-loader.html
sourceHash: 29f90121ca46b0f4c660b7446dc3995bff93e0d2
codeCheckedAgainst: "6.7.13.0"
keywords: ["InitialStateIdLoader", "Shopware\\Core\\System\\StateMachine\\Loader\\InitialStateIdLoader", "state-machine-initial-state-ids", "OrderStates::STATE_MACHINE", "OrderDeliveryStates::STATE_MACHINE", "OrderTransactionStates::STATE_MACHINE", "state machine", "initial state id", "order state", "checkout performance", "cache invalidation", "adr"]
summary: "ADR: InitialStateIdLoader resolves a state machine's initial state id from a cached technical_name map instead of loading the full StateMachine entity."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2022) about performance: determining the initial state id of a state machine used to load the whole state machine with all transitions and states. It was replaced by a small cached service, `Shopware\Core\System\StateMachine\Loader\InitialStateIdLoader`, which returns only the id.

## When to use

- Your code (e.g. a custom order/checkout flow) needs the initial state id for `order.state`, `order_delivery.state` or `order_transaction.state` (or any other state machine) when creating records.
- You see a stale initial state after changing a state machine's initial state and want to know how the cache is invalidated.

## Key steps / config

1. Inject `Shopware\Core\System\StateMachine\Loader\InitialStateIdLoader` (registered as a service in core) and call `get()` with the state machine's technical name:

```php
$this->initialStateIdLoader->get(OrderStates::STATE_MACHINE);            // 'order.state'
$this->initialStateIdLoader->get(OrderDeliveryStates::STATE_MACHINE);    // 'order_delivery.state'
$this->initialStateIdLoader->get(OrderTransactionStates::STATE_MACHINE); // 'order_transaction.state'
```

   Core's `OrderConverter` uses exactly these three calls during checkout.
2. How it works: `get(string $name): string` returns from an in-memory array if present; otherwise it loads a map `technical_name => initial_state_id` (hex, lower case) from the cache under the key `state-machine-initial-state-ids` (`InitialStateIdLoader::CACHE_KEY`). On cache miss it runs a single query:

```sql
SELECT technical_name, LOWER(HEX(`initial_state_id`)) as initial_state_id FROM state_machine
```

3. The class implements Symfony's `ResetInterface`; `reset()` clears the in-memory map between requests/messages.
4. Cache invalidation: `CacheInvalidationSubscriber::invalidateInitialStateIdLoader()` invalidates `InitialStateIdLoader::CACHE_KEY` whenever an entity-written event contains primary keys of the `state_machine` entity.

## Essential identifiers

- `Shopware\Core\System\StateMachine\Loader\InitialStateIdLoader`
- `InitialStateIdLoader::get(string $name): string`
- `InitialStateIdLoader::CACHE_KEY` = `state-machine-initial-state-ids`
- `OrderStates::STATE_MACHINE`, `OrderDeliveryStates::STATE_MACHINE`, `OrderTransactionStates::STATE_MACHINE`

## Gotchas

- `get()` indexes the map directly; an unknown technical name is not guarded against (no fallback value).
- Writing to `state_machine` through the DAL triggers invalidation; changing the table directly via SQL bypasses it.
- The ADR describes the old approach, `\Shopware\Core\System\StateMachine\StateMachineRegistry::getInitialState`, which loaded the full `StateMachine` with `transitions` (including `fromStateMachineState`/`toStateMachineState`) and `states`. It was deprecated for `v6.5.0.0`; in the installed 6.7 code `StateMachineRegistry` no longer declares it. Only the entity getter `StateMachineEntity::getInitialState()` remains, which requires the association to be loaded.

## Version notes

- Deprecation of the registry method was announced for `v6.5.0.0`; all core usages were switched to `InitialStateIdLoader`.

## Code check (6.7.13.0)
- confirmed `InitialStateIdLoader` — class implements ResetInterface — vendor/shopware/core/System/StateMachine/Loader/InitialStateIdLoader.php:11
- confirmed `InitialStateIdLoader::CACHE_KEY` — value state-machine-initial-state-ids (now final) — vendor/shopware/core/System/StateMachine/Loader/InitialStateIdLoader.php:13
- confirmed `InitialStateIdLoader::get()` — returns id string by technical name — vendor/shopware/core/System/StateMachine/Loader/InitialStateIdLoader.php:34
- confirmed `InitialStateIdLoader::reset()` — clears in-memory ids — vendor/shopware/core/System/StateMachine/Loader/InitialStateIdLoader.php:29
- confirmed `InitialStateIdLoader::load()` — cached fetchAllKeyValue over state_machine — vendor/shopware/core/System/StateMachine/Loader/InitialStateIdLoader.php:50
- confirmed `CacheInvalidationSubscriber::invalidateInitialStateIdLoader()` — invalidates CACHE_KEY on state_machine writes — vendor/shopware/core/Framework/Adapter/Cache/CacheInvalidationSubscriber.php:86
- confirmed `OrderStates::STATE_MACHINE` — value order.state — vendor/shopware/core/Checkout/Order/OrderStates.php:10
- confirmed `OrderDeliveryStates::STATE_MACHINE` — value order_delivery.state — vendor/shopware/core/Checkout/Order/Aggregate/OrderDelivery/OrderDeliveryStates.php:10
- confirmed `OrderTransactionStates::STATE_MACHINE` — value order_transaction.state — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStates.php:10
- confirmed `StateMachineEntity::getInitialState()` — only remaining getInitialState, an entity getter, not on StateMachineRegistry — vendor/shopware/core/System/StateMachine/StateMachineEntity.php:84
