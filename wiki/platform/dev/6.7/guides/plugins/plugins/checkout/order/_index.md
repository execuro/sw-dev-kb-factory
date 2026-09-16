---
id: platform/dev/6.7/guides/plugins/plugins/checkout/order/_index.md
title: Order
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/order/
sourceHash: d3cd375fe06bcba0e266b4fa0a4d03a4769b2a41
codeCheckedAgainst: "6.7.13.0"
keywords: ["order", "orders", "checkout", "order management", "order status", "order state", "order history", "order notifications", "OrderDefinition", "OrderEvents", "StateMachineRegistry", "plugin order extension"]
summary: Section index for plugin guides on Shopware 6.7 orders - placement, management, status tracking, customization, notifications and history.
lastBuilt: 2026-09-15
---
## What it is

Section landing page for the plugin guides about orders in Shopware 6.7. Orders cover the capabilities for managing and processing orders in the platform: order placement, order management, order status tracking, order customization, order notifications and order history.

## When to use

Start here when a plugin has to extend or customize order handling beyond what the Shopware core provides for a specific business need. The concrete how-to pages in this section cover reacting to order changes via events and changing order, transaction and delivery states through the state machine.

## Essential identifiers

Core entry points in the installed code that the section's guides build on (confirmed in vendor, not named on this index page itself):

- `Shopware\Core\Checkout\Order\OrderDefinition` — the `order` entity (`OrderDefinition::ENTITY_NAME`)
- `Shopware\Core\Checkout\Order\OrderEvents` — order entity event names, e.g. `OrderEvents::ORDER_WRITTEN_EVENT`
- `Shopware\Core\System\StateMachine\StateMachineRegistry` — state transitions for orders, transactions, deliveries

## Code check (6.7.13.0)
- confirmed `OrderDefinition::ENTITY_NAME` — value `order` — vendor/shopware/core/Checkout/Order/OrderDefinition.php:58
- confirmed `OrderEvents::ORDER_WRITTEN_EVENT` — value `order.written` — vendor/shopware/core/Checkout/Order/OrderEvents.php:11
- confirmed `StateMachineRegistry::transition()` — takes `Transition` and `Context` — vendor/shopware/core/System/StateMachine/StateMachineRegistry.php:117
