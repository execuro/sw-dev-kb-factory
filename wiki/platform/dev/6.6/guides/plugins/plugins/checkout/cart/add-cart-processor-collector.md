---
id: platform/dev/6.6/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md
title: Add cart collector/processor
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.html
sourceHash: d726d5d06f5fde94ef71725ddc887ca1f399e40b
keywords: ["CartDataCollectorInterface", "CartProcessorInterface", "collect method", "process method", "shopware.cart.collector", "shopware.cart.processor", "CartDataCollection", "CartBehavior", "SalesChannelContext", "cart runtime", "toCalculate cart"]
summary: "Custom cart collectors gather data (via collect), custom cart processors apply changes (via process) to the toCalculate cart."
lastBuilt: "2026-09-15"
---
## What it is

This guide explains the two building blocks for changing the cart at runtime: a custom collector and a custom processor.

## When to use

When a plugin needs to fetch extra data for the cart (collector) and then apply changes based on it (processor) — e.g. anything beyond a simple discount.

## Key steps / config

A collector implements `Shopware\Core\Checkout\Cart\CartDataCollectorInterface` and its `collect` method, storing new data via `$data->set('uniqueKey', $newData)`:

```php
class CustomCartCollector implements CartDataCollectorInterface
{
    public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void
    {
        $data->set('uniqueKey', $this->collectData());
    }
}
```

Register with tag `shopware.cart.collector`.

A processor implements `Shopware\Core\Checkout\Cart\CartProcessorInterface` and its `process` method, applying changes on the `$toCalculate` cart (not `$original`):

```php
public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void
{
    $newData = $data->get('uniqueKey');
    foreach ($toCalculate->getLineItems()->getFlat() as $lineItem) {
        $lineItem->setPayload($newData['stuff']);
    }
}
```

Register with tag `shopware.cart.processor`.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartDataCollectorInterface` (`collect`)
- `Shopware\Core\Checkout\Cart\CartProcessorInterface` (`process`)
- tag `shopware.cart.collector`
- tag `shopware.cart.processor`

## Gotchas

Never query data (e.g. the database) inside `process` — the process method may run many times; always fetch data via a collector's `collect` method instead. Always mutate `$toCalculate`, never `$original`.
