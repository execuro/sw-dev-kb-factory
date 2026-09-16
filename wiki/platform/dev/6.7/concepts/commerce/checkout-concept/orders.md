---
id: platform/dev/6.7/concepts/commerce/checkout-concept/orders.md
title: Orders
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/orders.html
sourceHash: 24850df3a3e9c58233a38e348b1db1fffebc1882
codeCheckedAgainst: "6.7.13.0"
keywords: ["order", "order state machine", "order.state", "order_transaction.state", "order_delivery.state", "OrderStates", "OrderTransactionStates", "OrderDeliveryStates", "StateMachineTransitionActions", "payment status", "delivery status", "state transitions", "denormalization"]
summary: "Order concept: denormalized, workflow-optimized orders and the default order, order_transaction and order_delivery state machines with their transitions."
lastBuilt: 2026-09-15
---
## What it is

Concept page for orders: an `Order` is created from a cart and the whole cart structure is persisted in the database. Unlike the calculation-optimized cart, the order is workflow-optimized; its progress is tracked by at least three state machines started during order placement.

## When to use

When you need the default order, payment (transaction) or delivery states and the allowed transitions, e.g. for flows, payment integrations, customer notifications or status handling.

## Key steps / config

Design goals:
- Denormalization: line items with all their data and all calculated prices are stored with the order; the order does not depend on catalog/products and is only recalculated when triggered explicitly through the API.
- Workflow dependent: state changes follow defined, configurable transitions; other transitions are blocked. The state machines can be modified through the API; the following is the default setup.

Order state machine `order.state` (`OrderStates`): `open`, `in_progress`, `completed` (label "Done", final), `cancelled` (final).
- open -process-> in_progress; open/in_progress -cancel-> cancelled; in_progress -complete-> completed; cancelled/completed -reopen-> open.

Transaction state machine `order_transaction.state` (`OrderTransactionStates`): `open`, `paid`, `paid_partially`, `cancelled`, `reminded`, `refunded` (final), `refunded_partially`, `in_progress`, `failed`, `authorized`, `chargeback`, `unconfirmed`.
- Transitions: `pay`, `pay_partially`, `paid`, `paid_partially`, `fail`, `authorize`, `remind`, `refund`, `refund_partially`, `chargeback` (from paid/paid_partially), `process_unconfirmed` (-> unconfirmed), `cancel`, `reopen` (-> open).
- `unconfirmed` can move to paid, paid_partially, failed, cancelled, authorized or open; `authorized` to paid, paid_partially, failed or cancelled.

Delivery state machine `order_delivery.state` (`OrderDeliveryStates`): `open`, `shipped`, `shipped_partially`, `returned` (final), `returned_partially`, `cancelled` (final).
- open -ship/ship_partially-> shipped/shipped_partially; shipped/shipped_partially -retour/retour_partially-> returned/returned_partially; shipped_partially -ship-> shipped; returned_partially -retour-> returned; `cancel` from open/shipped/shipped_partially; `reopen` from any non-open state.

## Essential identifiers

- `order.state`, `order_transaction.state`, `order_delivery.state`
- `Shopware\Core\Checkout\Order\OrderStates`
- `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStates`
- `Shopware\Core\Checkout\Order\Aggregate\OrderDelivery\OrderDeliveryStates`
- `Shopware\Core\System\StateMachine\Aggregation\StateMachineTransition\StateMachineTransitionActions` (`ACTION_PROCESS`, `ACTION_PROCESS_UNCONFIRMED`, `ACTION_RETOUR_PARTIALLY`, `ACTION_CHARGEBACK`)

## Gotchas

- The diagrams show labels ("Done", "Paid partially"); technical names are `completed`, `paid_partially`, `shipped_partially`, `returned_partially`, `refunded_partially`.
- The transaction diagram also shows a `do_pay` transition (open/reminded/failed/paid_partially -> in_progress). The constant `StateMachineTransitionActions::ACTION_DO_PAY` is deprecated for 6.8.0; the code says to use `ACTION_PROCESS` instead.
- Transitions not defined in the state machine are rejected; custom setups may differ from these defaults.

## Version notes

- 6.8.0: `ACTION_DO_PAY` (`do_pay`) is announced for removal in the 6.7 code.

## Code check (6.7.13.0)
- confirmed `OrderStates::STATE_MACHINE` — value order.state — vendor/shopware/core/Checkout/Order/OrderStates.php:10
- confirmed `OrderStates::STATE_COMPLETED` — technical name completed for "Done" — vendor/shopware/core/Checkout/Order/OrderStates.php:13
- confirmed `OrderTransactionStates::STATE_MACHINE` — value order_transaction.state — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStates.php:10
- confirmed `OrderTransactionStates::STATE_UNCONFIRMED` — value unconfirmed — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStates.php:22
- confirmed `OrderDeliveryStates::STATE_MACHINE` — value order_delivery.state — vendor/shopware/core/Checkout/Order/Aggregate/OrderDelivery/OrderDeliveryStates.php:10
- confirmed `OrderDeliveryStates::STATE_PARTIALLY_RETURNED` — value returned_partially — vendor/shopware/core/Checkout/Order/Aggregate/OrderDelivery/OrderDeliveryStates.php:15
- deprecated `StateMachineTransitionActions::ACTION_DO_PAY` — removed in 6.8.0, use ACTION_PROCESS — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:16
- confirmed `StateMachineTransitionActions::ACTION_PROCESS_UNCONFIRMED` — value process_unconfirmed — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:21
- confirmed `StateMachineTransitionActions::ACTION_RETOUR_PARTIALLY` — value retour_partially — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:27
- confirmed `StateMachineTransitionActions::ACTION_CHARGEBACK` — value chargeback — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:31
