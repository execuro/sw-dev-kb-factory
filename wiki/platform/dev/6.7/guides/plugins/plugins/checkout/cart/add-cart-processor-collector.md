---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md
title: Add Cart Collector/Processor
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.html
sourceHash: 35195d91ac2c1367061c2f31bd05efcdc57a2878
codeCheckedAgainst: "6.7.15.1"
keywords: ["CartDataCollectorInterface", "CartProcessorInterface", "shopware.cart.collector", "shopware.cart.processor", "CartDataCollection", "CartBehavior", "collect", "process", "$toCalculate", "cart collector", "cart processor", "modify cart at runtime"]
summary: Implement CartDataCollectorInterface (collect data) and CartProcessorInterface (change $toCalculate cart), tagged shopware.cart.collector/processor.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md"]
---
## What it is

The two extension points for changing the cart at runtime: a collector, which fetches additional data for the cart, and a processor, which applies changes to the cart using that data.

## When to use

- You need extra data (database query, API call) for cart calculation — write a collector.
- You need to change line items, payloads or prices during calculation — write a processor, usually fed by a collector.
- A fuller example is in [Change Price of Items in Cart](platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md).

## Key steps / config

1. Collector: implement `Shopware\Core\Checkout\Cart\CartDataCollectorInterface` and store data in the `CartDataCollection` under a unique key:

```php
class CustomCartCollector implements CartDataCollectorInterface
{
    public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void
    {
        $data->set('uniqueKey', $newData);
    }
}
```

2. Register the collector with tag `shopware.cart.collector`.
3. Processor: implement `Shopware\Core\Checkout\Cart\CartProcessorInterface`, read the collected data and change only `$toCalculate`:

```php
class CustomCartProcessor implements CartProcessorInterface
{
    public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void
    {
        $newData = $data->get('uniqueKey');
        foreach ($toCalculate->getLineItems()->getFlat() as $lineItem) { /* ... */ }
    }
}
```

4. Register the processor with tag `shopware.cart.processor`.

Parameters: `CartDataCollection` (shared key/value store, available in all processors), `Cart` (current cart and line items), `SalesChannelContext` (currency, country, ...), `CartBehavior` (cart state/permissions, e.g. the product processor checks whether stock validation is skipped).

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect()`
- `Shopware\Core\Checkout\Cart\CartProcessorInterface::process()`
- `Shopware\Core\Checkout\Cart\LineItem\CartDataCollection` (`set`, `get`)
- `Shopware\Core\Checkout\Cart\CartBehavior`
- Tags `shopware.cart.collector`, `shopware.cart.processor`

## Gotchas

- Do not query data in `process` — it may run many times; fetch in a collector's `collect`.
- Changes on `$original` are not used; only `$toCalculate` is the resulting cart.
- Both tagged iterators are ordered by tag priority; core's `ProductCartProcessor` is registered at priority 5000, so use a lower priority to run after product data is loaded.
- With service autoconfiguration, implementing either interface adds the tag automatically; declare the tag explicitly to set a priority.

## Code check (6.7.15.1)
- confirmed `CartDataCollectorInterface::collect()` — signature as in the example — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `CartProcessorInterface::process()` — signature as in the example — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `shopware.cart.processor` — tagged iterator injected into the cart `Processor` — vendor/shopware/core/Checkout/DependencyInjection/cart.php:512
- confirmed `shopware.cart.collector` — tagged iterator injected into the cart `Processor` — vendor/shopware/core/Checkout/DependencyInjection/cart.php:513
- confirmed `shopware.cart.collector` — product processor/collector priority 5000 — vendor/shopware/core/Checkout/DependencyInjection/cart.php:528
- confirmed `CartProcessorInterface` — autoconfigured with tag `shopware.cart.processor` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:82
- confirmed `CartDataCollectorInterface` — autoconfigured with tag `shopware.cart.collector` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:86
