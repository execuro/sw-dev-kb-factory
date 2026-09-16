---
id: platform/dev/6.6/guides/plugins/plugins/checkout/order/using-the-state-machine.md
title: Using the state machine
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/order/using-the-state-machine.html"
sourceHash: "648ca9cd92ed1a2eba917f4ed4ce4bdd3706114b"
keywords: ["StateMachineRegistry", "Transition", "state machine", "order state", "order_transaction", "order_delivery", "stateId", "getAvailableTransitions", "OrderTransactionStateHandler", "transition", "OrderDefinition", "OrderTransactionDefinition", "OrderDeliveryDefinition"]
summary: "Explains using StateMachineRegistry::transition and Transition to change order, order_transaction and order_delivery states, plus getAvailableTransitions."
lastBuilt: "2026-09-15"
---
## What it is
Explains the three order-related states in Shopware — `order`, `order_transaction`, `order_delivery` — and how to change them using `Shopware\Core\System\StateMachine\StateMachineRegistry`.

## When to use
Use whenever plugin logic needs to move an order, its transaction, or its delivery to a different state (e.g. marking a transaction as paid, or a delivery as shipped), respecting the allowed transitions between states.

## Key steps / config
1. Inject `Shopware\Core\System\StateMachine\StateMachineRegistry` and call `transition(new Transition(...), $context)`.
2. `Shopware\Core\System\StateMachine\Transition` constructor parameters: entity name (`OrderDefinition::ENTITY_NAME`, `OrderTransactionDefinition::ENTITY_NAME`, or `OrderDeliveryDefinition::ENTITY_NAME`), the entity's ID, the transition name (e.g. `process`, `do_pay`, `ship`), and the state field name — always `stateId` for these definitions.
```php
$this->stateMachineRegistry->transition(new Transition(
    OrderDefinition::ENTITY_NAME,
    '<ID here>',
    'process',
    'stateId'
), $context);
```
3. Order transitions: `reopen`→open, `process`→in_progress, `cancel`→cancelled, `complete`→completed.
4. Order transaction transitions: `reopen`→open, `fail`→failed, `authorize`→authorized, `refund_partially`→refunded_partially, `refund`→refunded, `do_pay`→in_progress, `paid`→paid, `paid_partially`→paid_partially, `remind`→reminded, `cancel`→cancelled.
5. Order delivery transitions: `reopen`→open, `ship`→shipped, `ship_partially`→shipped_partially, `cancel`→cancelled, `retour`→returned, `retour_partially`→returned_partially.
6. To find currently possible transitions, call `getAvailableTransitions(<entityName>, <id>, 'stateId', $context)` on the registry.
7. `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler` offers a helper method per transaction transition, e.g. `cancel()`, `refund()`, `fail()`, `paid()`, `payPartially()`, `process()`, `refundPartially()`, `remind()`, `reopen()`, each taking the transaction ID and context.

## Essential identifiers
- `Shopware\Core\System\StateMachine\StateMachineRegistry` (`transition`, `getAvailableTransitions`)
- `Shopware\Core\System\StateMachine\Transition`
- `Shopware\Core\Checkout\Order\OrderDefinition::ENTITY_NAME`
- `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionDefinition::ENTITY_NAME`
- `Shopware\Core\Checkout\Order\Aggregate\OrderDelivery\OrderDeliveryDefinition::ENTITY_NAME`
- `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler`
- Field name `stateId`

## Gotchas
Not every state can transition to every other state — invalid transitions (e.g. `refund` on a delivery that was never shipped) are rejected. When using `first()` on a collection of deliveries or transactions, there may be more than one, so `first()` may not return the intended one; add filters/sorting instead.
