---
id: platform/dev/6.7/concepts/commerce/checkout-concept/orders.md
title: Orders
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/orders.html
sourceHash: 24850df3a3e9c58233a38e348b1db1fffebc1882
codeCheckedAgainst: "6.7.15.1"
keywords: ["order", "order.state", "order_transaction.state", "order_delivery.state", "OrderStates", "OrderTransactionStates", "OrderDeliveryStates", "StateMachineTransitionActions", "state machine", "order status", "payment status", "delivery status", "denormalization", "recalculate order"]
summary: "Orders: denormalized, workflow-optimized copy of the cart; default order, transaction and delivery state machines with transitions."
lastBuilt: 2026-10-21
---
## What it is

An `Order` is created from a cart instance; the whole cart structure is stored in the database. Where the cart is calculation-optimized and allows a great degree of freedom, the order is workflow-optimized: its state changes in a defined, predictable and configurable way, and other state transitions are blocked.

## When to use

When reasoning about what an order stores after checkout, why it does not follow later catalog or price changes, or which state and transition names exist for order, payment and delivery status.

## Key steps / config

- **Denormalization:** the order does not depend on the catalog or the products. Line items with all their data and all calculated prices are persisted. Orders are only recalculated when triggered explicitly through the API (Admin API `POST /api/_action/order/{orderId}/recalculate`).
- **State machines:** order placement starts at least three state machines, which can be used to track progress and notify the customer. The diagrams below are the default setup; the state machines can be modified through the API. Transitions are triggered via the Admin API:
  - `/api/_action/order/{orderId}/state/{transition}`
  - `/api/_action/order_transaction/{orderTransactionId}/state/{transition}`
  - `/api/_action/order_delivery/{orderDeliveryId}/state/{transition}`

### Order (`order.state`)

States: `open` (initial), `in_progress`, `completed` (shown as "Done", final), `cancelled` (final).
Transitions: open `process` to in_progress; open/in_progress `cancel` to cancelled; in_progress `complete` to completed; cancelled/completed `reopen` to open.

### Order transaction (`order_transaction.state`)

States: `open` (initial), `paid`, `paid_partially`, `cancelled`, `reminded`, `refunded` (final), `refunded_partially`, `in_progress`, `failed`, `authorized`, `chargeback`, `unconfirmed`.
Main transitions: `pay`/`paid` to paid; `pay_partially`/`paid_partially` to paid_partially; `remind` to reminded; `authorize` to authorized; `process_unconfirmed` to unconfirmed; `fail` to failed; `refund`/`refund_partially` from paid, paid_partially or cancelled; `chargeback` from paid or paid_partially; `cancel` to cancelled; `reopen` back to open from most states.

### Order delivery (`order_delivery.state`)

States: `open` (initial), `shipped`, `shipped_partially`, `returned` (final), `returned_partially`, `cancelled` (final).
Transitions: `ship`, `ship_partially`, `retour`, `retour_partially`, `cancel`, and `reopen` from every state back to open.

## Essential identifiers

- `Shopware\Core\Checkout\Order\OrderStates` — `STATE_MACHINE = 'order.state'`
- `Shopware\Core\Checkout\Order\Aggregate\OrderTransaction\OrderTransactionStates` — `order_transaction.state`
- `Shopware\Core\Checkout\Order\Aggregate\OrderDelivery\OrderDeliveryStates` — `order_delivery.state`
- `Shopware\Core\System\StateMachine\Aggregation\StateMachineTransition\StateMachineTransitionActions` — transition name constants

## Gotchas

- The UI label "Done" corresponds to the technical state `completed`; the transition into it is `complete`.
- The docs diagram still shows a `do_pay` transition (from open, failed, reminded, paid_partially to in_progress). In 6.7 the constant `StateMachineTransitionActions::ACTION_DO_PAY` is deprecated for removal in 6.8.0; use `ACTION_PROCESS` (`process`) instead.
- Orders never recalculate on their own; product or price changes after placement do not affect existing orders.

## Code check (6.7.15.1)
- confirmed `OrderStates::STATE_MACHINE` — value `order.state` — vendor/shopware/core/Checkout/Order/OrderStates.php:10
- confirmed `OrderStates::STATE_COMPLETED` — technical name of "Done" is `completed` — vendor/shopware/core/Checkout/Order/OrderStates.php:13
- confirmed `OrderTransactionStates::STATE_MACHINE` — value `order_transaction.state` — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStates.php:10
- confirmed `OrderTransactionStates::STATE_UNCONFIRMED` — states incl. authorized, chargeback, unconfirmed — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStates.php:22
- confirmed `OrderDeliveryStates::STATE_MACHINE` — value `order_delivery.state` — vendor/shopware/core/Checkout/Order/Aggregate/OrderDelivery/OrderDeliveryStates.php:10
- deprecated `StateMachineTransitionActions::ACTION_DO_PAY` — `do_pay` removed in 6.8.0, use ACTION_PROCESS — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:16
- confirmed `StateMachineTransitionActions::ACTION_PROCESS_UNCONFIRMED` — transition `process_unconfirmed` — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:21
- confirmed `/api/_action/order/{orderId}/recalculate` — explicit recalculation via Admin API — vendor/shopware/core/Checkout/Cart/Order/Api/OrderRecalculationController.php:39
- confirmed `/api/_action/order/{orderId}/state/{transition}` — order state transition endpoint — vendor/shopware/core/Checkout/Order/Api/OrderActionController.php:41
- confirmed `/api/_action/order_delivery/{orderDeliveryId}/state/{transition}` — delivery state transition endpoint — vendor/shopware/core/Checkout/Order/Api/OrderActionController.php:123
