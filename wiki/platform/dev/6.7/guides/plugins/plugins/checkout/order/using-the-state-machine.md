---
id: platform/dev/6.7/guides/plugins/plugins/checkout/order/using-the-state-machine.md
title: Using the State Machine
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/order/using-the-state-machine.html
sourceHash: 4a74919943a7266e147c276441422613fb8e7745
codeCheckedAgainst: "6.7.15.1"
keywords: ["StateMachineRegistry", "Transition", "getAvailableTransitions", "OrderTransactionStateHandler", "state-machine:dump", "FORCE_TRANSITION", "SetOrderStateAction", "stateId", "order_transaction", "order_delivery", "order state", "payment status", "delivery status", "state transition"]
summary: Change order, order_transaction and order_delivery states via StateMachineRegistry::transition(), list allowed transitions, dump graphs, force transitions.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

How to change the three order-related states in code with `Shopware\Core\System\StateMachine\StateMachineRegistry`: the order state (`order`), the transaction/payment state (`order_transaction`) and the delivery state (`order_delivery`). States can only move along defined `transitions`.

## When to use

A plugin must set an order to in progress, mark a payment paid/refunded, mark a delivery shipped, inspect which transitions are currently allowed, or (for recovery tooling) force a state.

## Key steps / config

1. Inject `Shopware\Core\System\StateMachine\StateMachineRegistry` via the [Dependency Injection container](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md).
2. Call `transition(Transition $transition, Context $context)`. `Shopware\Core\System\StateMachine\Transition` takes:
   - entity name — use `OrderDefinition::ENTITY_NAME`, `OrderTransactionDefinition::ENTITY_NAME` or `OrderDeliveryDefinition::ENTITY_NAME`;
   - entity ID (order, order transaction or order delivery ID);
   - transition (action) name;
   - state field name — `stateId` in all three default definitions;
   - optional fifth argument: an internal comment (`?string`, default `null`).

```php
$this->stateMachineRegistry->transition(new Transition(
    OrderTransactionDefinition::ENTITY_NAME,
    '<Order transaction ID here>',
    'process',
    'stateId'
), $context);
```

3. Transition names per state machine:
   - Order: `reopen` (open), `process` (in_progress), `cancel` (cancelled), `complete` (completed).
   - Transaction: `reopen`, `fail`, `authorize`, `refund_partially`, `refund`, `process` (in_progress), `paid`, `paid_partially`, `remind`, `cancel`.
   - Delivery: `reopen`, `ship`, `ship_partially`, `cancel`, `retour`, `retour_partially`.
4. Allowed transitions from the current state: `getAvailableTransitions(string $entityName, string $entityId, string $stateFieldName, Context $context)` returns an array of possible actions (an open order yields `cancel` and `process`).
5. Inspect a machine as a Graphviz DOT graph (includes extensions' states/transitions):
   `bin/console state-machine:dump order.state | dot -Tpng > order.png` — other names: `order_delivery.state`, `order_transaction.state`.
6. Forcing (recovery only): `$context->addState(SetOrderStateAction::FORCE_TRANSITION);` (`Shopware\Core\Content\Flow\Dispatching\Action\SetOrderStateAction`), call `transition()` with the target state's technical name (e.g. `in_progress`), and remove the state in a `finally` block with `$context->removeState(...)`.
7. Finding a delivery ID from an order ID: search `order_delivery.repository` with `new Criteria()` + `EqualsFilter('orderId', $orderId)` and `searchIds(...)->firstId()`, or load the order with `new Criteria([$orderId])`, `addAssociation('deliveries')` and use `getDeliveries()->first()->getId()`.
8. Transaction helper: `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStateHandler` exposes per-state methods taking `(string $transactionId, Context $context)`: `reopen`, `fail`, `process`, `processUnconfirmed`, `paid`, `paidPartially`, `refund`, `refundPartially`, `cancel`, `remind`, `authorize`, `chargeback`.

## Essential identifiers

- `Shopware\Core\System\StateMachine\StateMachineRegistry::transition()` / `::getAvailableTransitions()`
- `Shopware\Core\System\StateMachine\Transition`
- `Shopware\Core\Framework\Context`
- `OrderDefinition::ENTITY_NAME` (`order`), `OrderTransactionDefinition::ENTITY_NAME` (`order_transaction`), `OrderDeliveryDefinition::ENTITY_NAME` (`order_delivery`)
- `SetOrderStateAction::FORCE_TRANSITION`
- `OrderTransactionStateHandler`
- `bin/console state-machine:dump`

## Gotchas

- You cannot jump between arbitrary states (e.g. `refunded` requires `paid` first); illegal transitions throw.
- Forced mode bypasses guards and business rules. In the installed code it is only consulted when the given name is not a regular action from the current state; it then looks up a state whose technical name equals the name. Always remove the context state afterwards.
- `first()` on deliveries/transactions may not return the one you want when an order has several — add filters or sorting.

## Version notes

- 6.7.0.0 renamed the transaction action `do_pay` to `process`; `do_pay` and `StateMachineTransitionActions::ACTION_DO_PAY` are deprecated and removed in 6.8.0.

## Code check (6.7.15.1)
- confirmed `StateMachineRegistry::transition()` — takes `Transition` and `Context` — vendor/shopware/core/System/StateMachine/StateMachineRegistry.php:124
- confirmed `StateMachineRegistry::getAvailableTransitions()` — entity name, id, state field, context — vendor/shopware/core/System/StateMachine/StateMachineRegistry.php:105
- corrected `Transition::__construct()` — docs: four parameters; code adds optional `internalComment` — vendor/shopware/core/System/StateMachine/Transition.php:10
- deprecated `StateMachineTransitionActions::ACTION_DO_PAY` — removed in 6.8.0, use ACTION_PROCESS — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:16
- confirmed `StateMachineTransitionActions::ACTION_PROCESS` — value `process` — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:20
- confirmed `SetOrderStateAction::FORCE_TRANSITION` — value `force_transition` — vendor/shopware/core/Content/Flow/Dispatching/Action/SetOrderStateAction.php:28
- confirmed `FORCE_TRANSITION` — checked only after no regular destination matched — vendor/shopware/core/System/StateMachine/StateMachineRegistry.php:383
- confirmed `state-machine:dump` — console command name — vendor/shopware/core/System/StateMachine/Command/WorkflowDumpCommand.php:18
- confirmed `OrderTransactionStateHandler::paidPartially()` — helper method exists — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStateHandler.php:137
- confirmed `OrderTransactionDefinition::ENTITY_NAME` — value `order_transaction` — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionDefinition.php:34
