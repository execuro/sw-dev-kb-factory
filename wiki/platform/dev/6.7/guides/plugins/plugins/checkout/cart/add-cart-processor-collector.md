---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md
sourceHash: 35195d91ac2c1367061c2f31bd05efcdc57a2878
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.html
title: Add Cart Collector/Processor
version: "6.7"
versions:
  - "6.7"
keywords: ["cart collector", "cart processor", "CartDataCollectorInterface", "CartProcessorInterface", "CartDataCollection", "CartBehavior", "shopware.cart.collector", "shopware.cart.processor", "collect", "process", "toCalculate", "modify cart at runtime"]
summary: Cart collectors (CartDataCollectorInterface, tag shopware.cart.collector) fetch data; processors (CartProcessorInterface) change the cart.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md"]
---
## What it is

Reference for the two extension points used to change the cart at runtime: a collector, which loads additional data for the cart, and a processor, which applies changes to the cart using that data.

## When to use

When a plugin must alter line items, prices or payloads during cart calculation. Use a collector for any data fetching (database, API) and a processor for the actual modification. A full worked example is [Change price of items in cart](platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md).

## Key steps / config

1. Collector: implement `Shopware\Core\Checkout\Cart\CartDataCollectorInterface` and its `collect` method; store results in `CartDataCollection` under a unique key (`set`). That collection is passed to all processors.

```php
class CustomCartCollector implements CartDataCollectorInterface
{
    public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void
    {
        $data->set('uniqueKey', $this->collectData());
    }
}
```

2. Register the collector with the DI tag `shopware.cart.collector`.
3. Processor: implement `Shopware\Core\Checkout\Cart\CartProcessorInterface` and its `process` method; read collected data with `$data->get('uniqueKey')` and apply changes to `$toCalculate`.

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

4. Register the processor with the DI tag `shopware.cart.processor`.

`collect` parameters: `CartDataCollection` (shared data store), `Cart` (current cart and line items), `SalesChannelContext` (currency, country, etc.), `CartBehavior` (cart state/permissions, e.g. whether product stock validation is skipped). `process` receives the same plus a second `Cart $toCalculate`.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect`
- `Shopware\Core\Checkout\Cart\CartProcessorInterface::process`
- `Shopware\Core\Checkout\Cart\LineItem\CartDataCollection`
- `Shopware\Core\Checkout\Cart\CartBehavior`
- DI tags `shopware.cart.collector`, `shopware.cart.processor`

## Gotchas

- Do not query data in `process`; it may run many times per request. Fetch in `collect`.
- Make all changes on `$toCalculate`; that is the cart that counts in the end. `$original` is input only.
- Tag priority decides order (higher first). Core registers the product collector/processor at `5000` and the delivery collector/processor at `-5000`; pick a priority between them if you need product data but must run before delivery calculation.
- Core autoconfigures both interfaces with their tags (no priority), so with `autoconfigure` enabled an explicit tag is only needed to set a priority.

## Code check (6.7.13.0)
- confirmed `CartDataCollectorInterface::collect()` — (CartDataCollection, Cart $original, SalesChannelContext, CartBehavior): void — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `CartProcessorInterface::process()` — (CartDataCollection, Cart $original, Cart $toCalculate, SalesChannelContext, CartBehavior): void — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `shopware.cart.processor` — tagged_iterator injected into the cart Processor service — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:341
- confirmed `shopware.cart.collector` — tagged_iterator injected into the cart Processor service — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:342
- confirmed `shopware.cart.collector` — product collector/processor priority 5000 — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:356
- confirmed `shopware.cart.processor` — delivery collector/processor priority -5000 — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:311
- confirmed `CartProcessorInterface` — autoconfigured with tag shopware.cart.processor — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:81
- confirmed `CartDataCollectorInterface` — autoconfigured with tag shopware.cart.collector — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:85
- confirmed `Collection::set()` — CartDataCollection extends Collection providing set/get/has — vendor/shopware/core/Framework/Struct/Collection.php:46
- confirmed `LineItemCollection::getFlat()` — returns flattened line items incl. children — vendor/shopware/core/Checkout/Cart/LineItem/LineItemCollection.php:154
