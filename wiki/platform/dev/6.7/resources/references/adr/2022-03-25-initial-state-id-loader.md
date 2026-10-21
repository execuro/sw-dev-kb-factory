---
id: platform/dev/6.7/resources/references/adr/2022-03-25-initial-state-id-loader.md
title: Initial state id loader
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-initial-state-id-loader.html
sourceHash: 29f90121ca46b0f4c660b7446dc3995bff93e0d2
codeCheckedAgainst: "6.7.15.1"
keywords: ["InitialStateIdLoader", "StateMachineRegistry", "getInitialState", "state-machine-initial-state-ids", "CACHE_KEY", "OrderStates::STATE_MACHINE", "OrderDeliveryStates::STATE_MACHINE", "OrderTransactionStates::STATE_MACHINE", "initial state", "state machine", "order state", "checkout performance", "cache invalidation"]
summary: "ADR: InitialStateIdLoader returns cached initial state ids per state machine, replacing the heavy StateMachineRegistry::getInitialState lookup."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-25) introducing `Shopware\Core\System\StateMachine\Loader\InitialStateIdLoader`, a small cached service that returns the initial state id of a state machine by its technical name. It replaced `\Shopware\Core\System\StateMachine\StateMachineRegistry::getInitialState`, which loaded the complete `StateMachine` object (all `transitions` with their `fromStateMachineState`/`toStateMachineState` and all `states`) only to read one id.

## When to use

When code needs the initial state id of `order.state`, `order_delivery.state` or `order_transaction.state` (or any other state machine) — for example when creating an order, delivery or transaction during checkout. During checkout all three are needed, which is why the old lookup caused unnecessary database load.

## Key steps / config

1. Inject `InitialStateIdLoader` (service id = FQCN). Its constructor takes a `Doctrine\DBAL\Connection` and a Symfony `CacheInterface`; the constructor is `@internal`, so rely on DI.
2. Call `get(string $name): string` with the state machine's technical name:

```php
$this->initialStateIdLoader->get(OrderStates::STATE_MACHINE);
$this->initialStateIdLoader->get(OrderDeliveryStates::STATE_MACHINE);
$this->initialStateIdLoader->get(OrderTransactionStates::STATE_MACHINE);
```

3. Internally the loader keeps an in-memory `$ids` map; on a miss it loads all ids at once from the cache key `state-machine-initial-state-ids` (`InitialStateIdLoader::CACHE_KEY`), filled by:

```sql
SELECT technical_name, LOWER(HEX(`initial_state_id`)) as initial_state_id FROM state_machine
```

4. The cache entry is invalidated whenever a DAL write touches the `state_machine` entity (`CacheInvalidationSubscriber::invalidateInitialStateIdLoader`, listening on `EntityWrittenContainerEvent`). The loader implements `ResetInterface`; `reset()` clears the in-memory map between requests.

## Essential identifiers

- `Shopware\Core\System\StateMachine\Loader\InitialStateIdLoader`
- `InitialStateIdLoader::get()`, `InitialStateIdLoader::CACHE_KEY` (`state-machine-initial-state-ids`)
- `OrderStates::STATE_MACHINE`, `OrderDeliveryStates::STATE_MACHINE`, `OrderTransactionStates::STATE_MACHINE`
- `CacheInvalidationSubscriber::invalidateInitialStateIdLoader()`

## Gotchas

- `get()` returns the array entry directly; an unknown technical name is not guarded and does not return null.
- Changing a state machine's initial state outside the DAL (raw SQL) bypasses the written event, so the cached ids stay stale until the cache is cleared.

## Version notes

The ADR deprecated `StateMachineRegistry::getInitialState` for `v6.5.0.0` and replaced all core usages. In 6.7.15.1 the registry no longer has this method; only the entity getter `StateMachineEntity::getInitialState()` (an association accessor) remains.

## Code check (6.7.15.1)
- confirmed `InitialStateIdLoader` — implements `ResetInterface` — vendor/shopware/core/System/StateMachine/Loader/InitialStateIdLoader.php:11
- confirmed `InitialStateIdLoader::CACHE_KEY` — `'state-machine-initial-state-ids'`, now `final public const` — vendor/shopware/core/System/StateMachine/Loader/InitialStateIdLoader.php:13
- confirmed `InitialStateIdLoader::get()` — `get(string $name): string` with in-memory map — vendor/shopware/core/System/StateMachine/Loader/InitialStateIdLoader.php:34
- confirmed `InitialStateIdLoader::reset()` — clears the `$ids` map — vendor/shopware/core/System/StateMachine/Loader/InitialStateIdLoader.php:29
- confirmed `initial_state_id` — same SQL against `state_machine` as in the ADR — vendor/shopware/core/System/StateMachine/Loader/InitialStateIdLoader.php:51
- confirmed `CacheInvalidationSubscriber::invalidateInitialStateIdLoader()` — invalidates `CACHE_KEY` on `state_machine` writes — vendor/shopware/core/Framework/Adapter/Cache/CacheInvalidationSubscriber.php:86
- confirmed `invalidateInitialStateIdLoader` — registered on `EntityWrittenContainerEvent`, priority 2017 — vendor/shopware/core/Framework/DependencyInjection/cache.php:221
- confirmed `OrderStates::STATE_MACHINE` — core order creation uses the loader — vendor/shopware/core/Checkout/Cart/Order/OrderConverter.php:130
- corrected `StateMachineEntity::getInitialState()` — docs: `StateMachineRegistry::getInitialState` deprecated; in 6.7 the registry method is gone and only this entity getter remains — vendor/shopware/core/System/StateMachine/StateMachineEntity.php:84
