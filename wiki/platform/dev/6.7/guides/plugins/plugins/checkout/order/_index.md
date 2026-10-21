---
id: platform/dev/6.7/guides/plugins/plugins/checkout/order/_index.md
title: Order
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/order/
sourceHash: d3cd375fe06bcba0e266b4fa0a4d03a4769b2a41
codeCheckedAgainst: "6.7.15.1"
keywords: ["order", "orders", "OrderEntity", "OrderDefinition", "order management", "order placement", "order status", "order history", "order notifications", "checkout", "plugin order extension"]
summary: Index of plugin guides on orders - placement, management, status tracking, customization, notifications and history, extended via plugins.
lastBuilt: 2026-10-21
---
## What it is

Section index for plugin-developer guides about orders in Shopware. Orders cover order placement, order management, order status tracking, order customization, order notifications and order history. These functions are available in the Shopware core; plugins extend or customize them for specific business needs.

## When to use

When a plugin needs to change or extend how orders are placed, managed, tracked or communicated, and you are looking for the order-specific guides under the checkout plugin section.

## Essential identifiers

- `order` entity (`OrderDefinition`, `OrderEntity` in `Shopware\Core\Checkout\Order`)

## Code check (6.7.15.1)
- confirmed `OrderDefinition::ENTITY_NAME` — entity name `order` — vendor/shopware/core/Checkout/Order/OrderDefinition.php:58
- confirmed `OrderEntity` — core order entity class — vendor/shopware/core/Checkout/Order/OrderEntity.php:30
