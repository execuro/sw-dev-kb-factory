---
id: platform/dev/6.7/resources/references/adr/2022-03-25-available-stock.md
title: Available stock improvements
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-available-stock.html
sourceHash: 94c18e8d486e02182da1a282bd13539eb4294e79
codeCheckedAgainst: "6.7.15.1"
keywords: ["available_stock", "availableStock", "StockStorage", "AbstractStockStorage", "OrderStockSubscriber", "ProductIndexer", "CartOrderRoute", "checkout-order-route", "RetryableQuery", "stock update", "inventory", "order placed stock", "isCloseout", "minPurchase"]
summary: "ADR (2022): cheaper available-stock updates on order placement. In 6.7 stock changes go through OrderStockSubscriber and StockStorage::alter()."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-25, area: inventory) about a performance bottleneck in the product available-stock calculation. Originally the available stock was recalculated on every product update, including on every order, by subtracting the quantity of all open orders from the stock. With many open orders and many concurrent orders for the same products this became a bottleneck. The ADR's fix: reduce the available stock directly by the ordered quantity when the order is placed, skip the expensive recalculation inside the order process, and only recalculate when a stock-relevant field changes.

## When to use

- You investigate how `product.available_stock`, `stock` and the `available` flag change when an order is placed, edited or cancelled.
- You decorate stock handling or need to know which product fields trigger a stock re-index.

## Key steps / config

The ADR's ideas, as they exist in the installed 6.7.15.1 code (the stock classes it names were later replaced):

1. **Direct, cheap update on order write.** `Shopware\Core\Content\Product\Stock\OrderStockSubscriber` listens to `EntityWriteEvent` (`beforeWriteOrderItems`) and `StateMachineTransitionEvent` (`stateChanged`). It computes `StockAlteration` changesets for added, deleted or changed product order line items (and for transitions into or out of the cancelled state) and passes them to `AbstractStockStorage::alter()`.
2. **Plain SQL with retry.** `StockStorage::alter()` runs one `RetryableQuery` per alteration instead of a full recalculation:

```sql
UPDATE product
SET stock = stock + :quantity, sales = sales - :quantity, available_stock = stock, updated_at = NOW()
WHERE id = :id AND version_id = :version
```

   It then updates the `available` flag (based on `is_closeout`, `stock`, `min_purchase`, with parent inheritance) and dispatches `ProductStockAlteredEvent`; `ProductNoLongerAvailableEvent` is dispatched for products whose flag changed.
3. **Order-route context state.** `CartOrderRoute` adds the context state `checkout-order-route` while the order is created (the ADR used this state to skip the old recalculation).
4. **Re-index only on relevant changes.** `ProductIndexer::update()` collects changed products with:

```php
$stocks = $event->getPrimaryKeysWithPropertyChange(ProductDefinition::ENTITY_NAME, ['stock', 'isCloseout', 'minPurchase']);
```

   and calls `$this->stockStorage->index(...)`, which only refreshes the availability flag.

Stock handling is skipped when stock management is disabled (`enableStockManagement` constructor flag of `OrderStockSubscriber`) and for non-live versions.

## Essential identifiers

- `Shopware\Core\Content\Product\Stock\OrderStockSubscriber` (`beforeWriteOrderItems`, `stateChanged`)
- `Shopware\Core\Content\Product\Stock\StockStorage` / `AbstractStockStorage` (`alter`, `index`)
- `StockAlteration`, `ProductStockAlteredEvent`, `ProductNoLongerAvailableEvent`
- `ProductIndexer`, `CartOrderRoute`, context state `checkout-order-route`
- `RetryableQuery`, `LineItem::PRODUCT_LINE_ITEM_TYPE`

## Gotchas

- Only product line items (`LineItem::PRODUCT_LINE_ITEM_TYPE`) affect stock.
- The ADR's snippets show `StockUpdater::lineItemWritten` and an `orderPlaced(CheckoutOrderPlacedEvent $event)` listener running `UPDATE product SET available_stock = available_stock - :quantity`. Neither `StockUpdater` nor `lineItemWritten` exists in 6.7.15.1; do not try to decorate or call them.

## Version notes

- In 6.7 `StockStorage::alter()` sets `available_stock = stock` after adjusting `stock`, instead of subtracting from `available_stock` as in the ADR snippet.

## Code check (6.7.15.1)
- absent `StockUpdater` — class named by the ADR is not in the installed code
- absent `lineItemWritten` — listener method from the ADR is not in the installed code
- confirmed `OrderStockSubscriber` — listens to EntityWriteEvent and StateMachineTransitionEvent — vendor/shopware/core/Content/Product/Stock/OrderStockSubscriber.php:24
- confirmed `OrderStockSubscriber::beforeWriteOrderItems()` — passes changesets to the stock storage — vendor/shopware/core/Content/Product/Stock/OrderStockSubscriber.php:49
- confirmed `StockStorage::alter()` — RetryableQuery UPDATE of stock, sales, available_stock — vendor/shopware/core/Content/Product/Stock/StockStorage.php:43
- corrected `available_stock` — docs: `available_stock = available_stock - :quantity` — vendor/shopware/core/Content/Product/Stock/StockStorage.php:55
- confirmed `checkout-order-route` — context state added in CartOrderRoute — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:91
- confirmed `getPrimaryKeysWithPropertyChange` — stock, isCloseout, minPurchase trigger stock indexing — vendor/shopware/core/Content/Product/DataAbstractionLayer/ProductIndexer.php:119
- corrected `StockStorage::index()` — docs: `$this->stockUpdater->update(...)` — vendor/shopware/core/Content/Product/Stock/StockStorage.php:80
