---
id: platform/dev/6.6/resources/references/adr/2022-03-25-available-stock.md
title: Available stock improvements
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-available-stock.html"
sourceHash: "94c18e8d486e02182da1a282bd13539eb4294e79"
keywords: ["available stock", "StockUpdater", "CheckoutOrderPlaced", "lineItemWritten", "ProductIndexer", "RetryableQuery", "context state", "checkout-order-route", "stock calculation", "minPurchase", "isCloseout"]
summary: "ADR: available stock is now decremented directly in CheckoutOrderPlaced via a fast SQL update, avoiding the costly full StockUpdater path on order placement."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record describing how available-stock recalculation was optimized to avoid a database bottleneck when many orders for the same products are placed concurrently.

## When to use
When investigating stock-update performance under load, or hooking into product stock changes during checkout.

## Key steps / config
- Previously every order triggered `StockUpdater::lineItemWritten`, which recomputed available stock by subtracting quantities of all open orders — a bottleneck under high concurrent order volume.
- Now the `CheckoutOrderPlacedEvent` listener decrements available stock directly with a lightweight query instead of the full update logic:

```php
$query = new RetryableQuery(
    $this->connection,
    $this->connection->prepare('UPDATE product SET available_stock = available_stock - :quantity WHERE id = :id')
);
```

- To avoid running `lineItemWritten` logic again for the same write, `CartOrderRoute` sets a context state flag (`checkout-order-route`) that the listener checks and skips on.
- `ProductIndexer::update` now only triggers a stock update when one of `stock`, `minPurchase`, or `isCloseout` actually changed, via `getPrimaryKeysWithPropertyChange(ProductDefinition::ENTITY_NAME, ['stock', 'isCloseout', 'minPurchase'])`.

## Essential identifiers
- `StockUpdater::lineItemWritten`
- `CheckoutOrderPlacedEvent`
- `RetryableQuery`
- `ProductIndexer`
- `ProductDefinition::ENTITY_NAME`
- context state key `checkout-order-route`
