---
id: platform/dev/6.7/resources/references/adr/2022-03-25-available-stock.md
title: Available stock improvements
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-available-stock.html
sourceHash: 94c18e8d486e02182da1a282bd13539eb4294e79
codeCheckedAgainst: "6.7.13.0"
keywords: ["available_stock", "available stock", "stock update", "inventory", "StockStorage", "AbstractStockStorage", "OrderStockSubscriber", "ProductIndexer", "checkout-order-route", "CartOrderRoute", "isCloseout", "minPurchase", "adr", "performance"]
summary: "ADR (2022): cheaper available-stock updates on order placement; in 6.7 stock changes run via AbstractStockStorage and OrderStockSubscriber."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022-03-25) about the performance of product `available_stock` calculation. Originally the stock was recalculated on every product update and on every order line item write, subtracting open-order quantities — a bottleneck when many orders for the same products are placed at once. The ADR describes decrementing `available_stock` directly by the ordered quantity at order placement and skipping the expensive recalculation during the order route.

## When to use

Read this when you need to understand why stock/available stock changes happen where they do during checkout, or when debugging stock values after orders under load. For extension work in 6.7, the installed code (below) is the reference, not the ADR's code snippets.

## Key steps / config

How the installed 6.7.13.0 code implements the decision:

1. `CartOrderRoute::order()` adds the context state `checkout-order-route` before placing the order (`$context->addState('checkout-order-route')`).
2. `Shopware\Core\Content\Product\Stock\OrderStockSubscriber` listens to `EntityWriteEvent` (`beforeWriteOrderItems`) and `StateMachineTransitionEvent` (`stateChanged`). It computes per-line-item `StockAlteration`s (added, removed, product or quantity changed; cancelling/un-cancelling an order) and passes them to `AbstractStockStorage::alter()`. It only runs when stock management is enabled and for the live version.
3. `Shopware\Core\Content\Product\Stock\StockStorage::alter()` runs a `RetryableQuery`: `UPDATE product SET stock = stock + :quantity, sales = sales - :quantity, available_stock = stock ...`, then updates the `available` flag and dispatches `ProductStockAlteredEvent` (and `ProductNoLongerAvailableEvent` when availability flips).
4. `ProductIndexer::update()` only re-indexes stock when one of the three relevant fields changed:

```php
$stocks = $event->getPrimaryKeysWithPropertyChange(ProductDefinition::ENTITY_NAME, ['stock', 'isCloseout', 'minPurchase']);
$this->stockStorage->index(array_values($stocks), $event->getContext());
```

Stock management toggle: `shopware.stock.enable_stock_management` (default `true`).

To customise stock handling, decorate `AbstractStockStorage` (abstract `getDecorated()`, `load()`, `alter()`, `index()`).

## Essential identifiers

- `Shopware\Core\Content\Product\Stock\AbstractStockStorage`
- `Shopware\Core\Content\Product\Stock\StockStorage`
- `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`
- `Shopware\Core\Content\Product\Stock\StockAlteration`
- `ProductIndexer::update()` with `getPrimaryKeysWithPropertyChange(..., ['stock', 'isCloseout', 'minPurchase'])`
- Context state `checkout-order-route` (set in `CartOrderRoute`)
- `shopware.stock.enable_stock_management`

## Gotchas

- The ADR's `StockUpdater::lineItemWritten` and `StockUpdater::orderPlaced` (on `CheckoutOrderPlacedEvent`) no longer exist in 6.7; the class is gone from the installed code. Code decorating or calling `StockUpdater` must move to `AbstractStockStorage`.
- `StockStorage::alter()` sets `available_stock = stock`; it no longer subtracts open-order quantities as the ADR's snippet did.
- `OrderStockSubscriber` is `@internal`; extend via `AbstractStockStorage` decoration, not the subscriber.
- `CartOrderRoute` still sets `checkout-order-route`, but no consumer of that state is left in core.

## Version notes

The ADR dates from 2022 (6.4 era). In the installed 6.7 code, the stock handling was rewritten around `AbstractStockStorage`/`OrderStockSubscriber`; only the `ProductIndexer` field filter and the `checkout-order-route` state survive from the ADR.

## Code check (6.7.13.0)
- absent `StockUpdater` — no class of that name in the installed code; replaced by AbstractStockStorage/OrderStockSubscriber
- confirmed `checkout-order-route` — state added in CartOrderRoute::order() — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:87
- corrected `ProductIndexer::update()` — docs: calls $this->stockUpdater->update(); code calls stockStorage->index() — vendor/shopware/core/Content/Product/DataAbstractionLayer/ProductIndexer.php:97
- confirmed `getPrimaryKeysWithPropertyChange` — filter on stock, isCloseout, minPurchase — vendor/shopware/core/Content/Product/DataAbstractionLayer/ProductIndexer.php:109
- corrected `OrderStockSubscriber::beforeWriteOrderItems()` — docs: CheckoutOrderPlaced listener orderPlaced; code reacts to EntityWriteEvent — vendor/shopware/core/Content/Product/Stock/OrderStockSubscriber.php:49
- confirmed `StockStorage::alter()` — RetryableQuery update of stock, sales, available_stock — vendor/shopware/core/Content/Product/Stock/StockStorage.php:43
- confirmed `AbstractStockStorage` — abstract getDecorated/load/alter/index — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:10
- confirmed `enable_stock_management` — boolean, default true, under shopware.stock — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1180
