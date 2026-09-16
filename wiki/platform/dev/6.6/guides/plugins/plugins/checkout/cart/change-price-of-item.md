---
id: platform/dev/6.6/guides/plugins/plugins/checkout/cart/change-price-of-item.md
title: Change price of items in cart
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/cart/change-price-of-item.html
sourceHash: 49cbce65b6efddcd3b71a4ccd02ae02b0ebcef3f
keywords: ["CartDataCollectorInterface", "CartProcessorInterface", "QuantityPriceCalculator", "QuantityPriceDefinition", "shopware.cart.collector", "shopware.cart.processor", "priority 4500", "OverwritePriceCollector", "price overwrite", "collect method", "process method", "buildKey"]
summary: "Overwrite a line item's price at runtime via a combined collector+processor using QuantityPriceCalculator/QuantityPriceDefinition."
lastBuilt: "2026-09-15"
---
## What it is

This guide shows how to dynamically change (overwrite) the price of a line item in the cart, using a combined collector/processor. It is explicitly not recommended for adding a discount or surcharge — use a discount instead, except in cases like live-shopping.

## When to use

When a plugin needs to replace a line item's price entirely (not add a percentage/absolute discount), sourcing the new price from an external system or entity extension.

## Key steps / config

A single class implements both `Shopware\Core\Checkout\Cart\CartDataCollectorInterface` and `Shopware\Core\Checkout\Cart\CartProcessorInterface`.

`collect()` fetches product IDs from `$original`, skips already-fetched ones (dedupe via a `price-overwrite-<id>` key), and stores new prices:

```php
public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void
{
    $productIds = $original->getLineItems()->filterType(LineItem::PRODUCT_LINE_ITEM_TYPE)->getReferenceIds();
    $filtered = $this->filterAlreadyFetchedPrices($productIds, $data);
    foreach ($filtered as $id) {
        $data->set($this->buildKey($id), $this->doSomethingToGetNewPrice());
    }
}
```

`process()` reads the stored price and applies it to line items in `$toCalculate` (never `$original`) using `Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator` and `Shopware\Core\Checkout\Cart\Price\Struct\QuantityPriceDefinition`:

```php
public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void
{
    foreach ($toCalculate->getLineItems()->filterType(LineItem::PRODUCT_LINE_ITEM_TYPE) as $product) {
        $key = $this->buildKey($product->getReferencedId());
        if (!$data->has($key) || $data->get($key) === null) {
            continue;
        }
        $definition = new QuantityPriceDefinition($data->get($key), $product->getPrice()->getTaxRules(), $product->getPrice()->getQuantity());
        $product->setPrice($this->calculator->calculate($definition, $context));
        $product->setPriceDefinition($definition);
    }
}
```

Register both roles with tags `shopware.cart.processor` and `shopware.cart.collector`, priority `4500`, injecting `Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator` as a constructor argument.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartDataCollectorInterface`
- `Shopware\Core\Checkout\Cart\CartProcessorInterface`
- `Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator`
- `Shopware\Core\Checkout\Cart\Price\Struct\QuantityPriceDefinition`
- tags `shopware.cart.processor`, `shopware.cart.collector`, priority `4500`

## Gotchas

Never query the database inside `process` — always fetch/cache such data in `collect`. Changes must always be applied to `$toCalculate`, never `$original`, since `$original` may still hold data needed elsewhere.
