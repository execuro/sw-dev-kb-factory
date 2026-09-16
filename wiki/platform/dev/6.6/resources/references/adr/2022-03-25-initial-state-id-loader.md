---
id: "platform/dev/6.6/resources/references/adr/2022-03-25-initial-state-id-loader.md"
title: "Initial state id loader"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-initial-state-id-loader.html"
sourceHash: "29f90121ca46b0f4c660b7446dc3995bff93e0d2"
keywords: ["InitialStateIdLoader", "StateMachineRegistry::getInitialState", "state-machine-initial-state-ids", "OrderStates::STATE_MACHINE", "OrderDeliveryStates::STATE_MACHINE", "OrderTransactionStates::STATE_MACHINE", "ResetInterface", "state machine cache", "checkout performance"]
summary: "ADR: InitialStateIdLoader replaces the deprecated, heavier StateMachineRegistry::getInitialState for cheap initial-state-ID lookups during checkout."
lastBuilt: "2026-09-15"
---
## What it is

This ADR introduces a lightweight `InitialStateIdLoader` service to replace the expensive `StateMachineRegistry::getInitialState` lookup used during checkout only to determine a state machine's initial state ID.

## When to use

Relevant when checkout code needs the initial state ID for `order.state`, `order_delivery.state`, or `order_transaction.state`, or when investigating checkout database load caused by repeated state-machine lookups.

## Key steps / config

- Problem: `\Shopware\Core\System\StateMachine\StateMachineRegistry::getInitialState` was commonly called just to read an ID, e.g.:
```php
$this->stateMachineRegistry->getInitialState(OrderStates::STATE_MACHINE, $context->getContext())->getId();
$this->stateMachineRegistry->getInitialState(OrderDeliveryStates::STATE_MACHINE, $context->getContext())->getId();
$this->stateMachineRegistry->getInitialState(OrderTransactionStates::STATE_MACHINE, $context->getContext())->getId();
```
- Internally `getInitialState` loaded the entire `StateMachine` object, including all `transitions` and their `from`/`to` states, via a `Criteria` with associations on `transitions` and `states` — far more data than needed just for an ID.
- Decision: `getInitialState` was marked `@deprecated` for `v6.5.0.0`, all core usages were replaced, and a new, smaller service, `Shopware\Core\System\StateMachine\Loader\InitialStateIdLoader` (implementing `ResetInterface`), was introduced.
- `InitialStateIdLoader::get(string $name): string` returns the cached initial state ID for a given state machine technical name; internally it lazily loads and caches a name-to-ID map under the cache key `state-machine-initial-state-ids` by querying `SELECT technical_name, LOWER(HEX(initial_state_id)) as initial_state_id FROM state_machine`.
- The cache is invalidated by a DAL written event on the `state_machine` entity.

## Essential identifiers

- `Shopware\Core\System\StateMachine\Loader\InitialStateIdLoader`
- `InitialStateIdLoader::get()`
- `state-machine-initial-state-ids` cache key
- `\Shopware\Core\System\StateMachine\StateMachineRegistry::getInitialState` (deprecated for this use)

## Gotchas

`StateMachineRegistry::getInitialState` is `@deprecated` as of v6.5.0.0 for this purpose — new code that only needs the initial state ID should use `InitialStateIdLoader::get()` instead, since the old method still loads the full state machine graph.

## Version notes

`StateMachineRegistry::getInitialState` was deprecated for ID-only lookups starting with v6.5.0.0, with core usages already migrated to `InitialStateIdLoader`.
