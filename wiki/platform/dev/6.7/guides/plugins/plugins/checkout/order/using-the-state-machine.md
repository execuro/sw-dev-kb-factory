---
id: platform/dev/6.7/guides/plugins/plugins/checkout/order/using-the-state-machine.md
title: Using the State Machine
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/order/using-the-state-machine.html
sourceHash: 73e26eacc93c4e50bd3832543fc74ca24365dc44
codeCheckedAgainst: "6.7.13.0"
keywords: ["StateMachineRegistry", "Transition", "getAvailableTransitions", "OrderTransactionStateHandler", "StateMachineTransitionActions", "stateId", "order_transaction", "order_delivery", "order state", "payment status", "delivery status", "state transition"]
summary: "Change order, order_transaction and order_delivery states via StateMachineRegistry::transition() with a Transition; list allowed transitions."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

How to change the three order-related states in Shopware with the state machine: the order state (`order`), the order transaction/payment state (`order_transaction`) and the order delivery state (`order_delivery`). Allowed moves between states are called transitions; you cannot jump from any state to any other (e.g. not to "refunded" before "paid").

## When to use

- A plugin must mark an order as in progress, a payment as paid/refunded, or a delivery as shipped.
- You need to know which transitions are currently allowed for an entity.

## Key steps / config

1. Inject `Shopware\Core\System\StateMachine\StateMachineRegistry` into your service via the [DI container](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md).
2. Call `transition(Transition $transition, Context $context)` with a `Shopware\Core\System\StateMachine\Transition` and `Shopware\Core\Framework\Context`. `Transition` constructor arguments: entity name (use `OrderDefinition::ENTITY_NAME`, `OrderTransactionDefinition::ENTITY_NAME`, `OrderDeliveryDefinition::ENTITY_NAME`), entity id, transition action name, state field name (`stateId` in all three core definitions). An optional internal comment follows.

```php
$this->stateMachineRegistry->transition(new Transition(
    OrderDeliveryDefinition::ENTITY_NAME,
    $orderDeliveryId,
    'ship',
    'stateId'
), $context);
```

3. Transition action names (constants in `StateMachineTransitionActions`):
   - Order: `reopen` (open), `process` (in_progress), `cancel` (cancelled), `complete` (completed).
   - Order transaction: `reopen`, `fail`, `authorize`, `refund_partially`, `refund`, `process` (in_progress), `paid`, `paid_partially`, `remind`, `cancel`.
   - Order delivery: `reopen`, `ship`, `ship_partially`, `cancel`, `retour` (returned), `retour_partially`.
4. List allowed transitions from the current state: `getAvailableTransitions(string $entityName, string $entityId, string $stateFieldName, Context $context)` returns an array of possible actions (an open order yields `cancel` and `process`).
5. To find a delivery id from an order id, search `order_delivery.repository` with `new EqualsFilter('orderId', $orderId)` and `searchIds(...)->firstId()`, or load the order with `new Criteria([$orderId])`, `addAssociation('deliveries')` and use `getDeliveries()->first()->getId()`.
6. For payment states only, `OrderTransactionStateHandler` offers one method per transition taking `(string $transactionId, Context $context)`: `reopen`, `fail`, `process`, `processUnconfirmed`, `paid`, `paidPartially`, `refund`, `refundPartially`, `cancel`, `remind`, `authorize`, `chargeback`.

## Essential identifiers

- `Shopware\Core\System\StateMachine\StateMachineRegistry` — `transition()`, `getAvailableTransitions()`
- `Shopware\Core\System\StateMachine\Transition`
- `StateMachineTransitionActions`, `OrderTransactionStateHandler`
- Entity names `order`, `order_transaction`, `order_delivery`; state field `stateId`

## Gotchas

- An order can have several deliveries or transactions; `first()` may pick the wrong one — add filters or sorting (e.g. to get the latest delivery).
- The docs use action `do_pay` (`StateMachineTransitionActions::ACTION_DO_PAY`) for open to in_progress on transactions; it is deprecated for 6.8.0 — use `process` (`ACTION_PROCESS`).
- The docs list `OrderTransactionStateHandler::payPartially()`; it is deprecated for 6.8.0 — use `paidPartially()`.

## Code check (6.7.13.0)
- confirmed `StateMachineRegistry::transition()` — takes Transition and Context — vendor/shopware/core/System/StateMachine/StateMachineRegistry.php:117
- confirmed `StateMachineRegistry::getAvailableTransitions()` — entityName, entityId, stateFieldName, context — vendor/shopware/core/System/StateMachine/StateMachineRegistry.php:98
- confirmed `Transition::__construct()` — entityName, entityId, transitionName, stateFieldName, optional internalComment — vendor/shopware/core/System/StateMachine/Transition.php:10
- deprecated `StateMachineTransitionActions::ACTION_DO_PAY` — removed in 6.8.0, use ACTION_PROCESS — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:16
- confirmed `StateMachineTransitionActions::ACTION_PROCESS` — value process — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:20
- deprecated `OrderTransactionStateHandler::payPartially()` — use paidPartially — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStateHandler.php:122
- confirmed `OrderTransactionStateHandler::paidPartially()` — replacement method — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStateHandler.php:137
- confirmed `OrderDefinition::ENTITY_NAME` — value order — vendor/shopware/core/Checkout/Order/OrderDefinition.php:58
- confirmed `OrderDeliveryDefinition::ENTITY_NAME` — value order_delivery — vendor/shopware/core/Checkout/Order/Aggregate/OrderDelivery/OrderDeliveryDefinition.php:35
- confirmed `stateId` — StateMachineStateField property name on order transaction — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionDefinition.php:69
