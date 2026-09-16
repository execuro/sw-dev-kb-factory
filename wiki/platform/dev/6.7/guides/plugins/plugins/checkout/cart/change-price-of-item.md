---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md
sourceHash: e56a48c484fdfb45af577ae3749ae36d10af825e
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/change-price-of-item.html
title: Change Price of Items in Cart
version: "6.7"
versions:
  - "6.7"
keywords: ["change line item price", "overwrite price", "CartDataCollectorInterface", "CartProcessorInterface", "QuantityPriceCalculator", "QuantityPriceDefinition", "CartDataCollection", "OverwritePriceCollector", "shopware.cart.processor", "shopware.cart.collector", "live shopping", "dynamic price"]
summary: Overwrite line item prices with one class implementing CartDataCollectorInterface and CartProcessorInterface, using QuantityPriceCalculator.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

A guide for dynamically replacing the price of product line items in the cart, using a collector that gathers the new prices and a processor that recalculates and sets them. The example uses one class, `OverwritePriceCollector`, for both roles.

## When to use

Rarely, and with caution — e.g. a live-shopping plugin. For discounts or surcharges, add a discount line item instead ([Add cart discounts](platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md)). Where the new price comes from (entity extension, external API) is up to the plugin.

## Key steps / config

1. Collector part — implement `Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect`:
   - Get product IDs: `$original->getLineItems()->filterType(LineItem::PRODUCT_LINE_ITEM_TYPE)->getReferenceIds()`.
   - Skip IDs whose key already exists in `CartDataCollection` (`$data->has($key)`), because `collect` can run several times per request.
   - For each remaining ID fetch the new price and `$data->set($key, $newPrice)`, using a prefixed key (`'price-overwrite-'.$id`) so other collectors' keys do not clash.
2. Processor part — implement `Shopware\Core\Checkout\Cart\CartProcessorInterface::process`; inject `Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator`:

```php
class OverwritePriceCollector implements CartDataCollectorInterface, CartProcessorInterface
{
    public function __construct(private QuantityPriceCalculator $calculator) {}

    public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void { /* ... */ }

    public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void
    {
        foreach ($toCalculate->getLineItems()->filterType(LineItem::PRODUCT_LINE_ITEM_TYPE) as $product) {
            $key = 'price-overwrite-' . $product->getReferencedId();
            if (!$data->has($key) || $data->get($key) === null) { continue; }
            $definition = new QuantityPriceDefinition($data->get($key), $product->getPrice()->getTaxRules(), $product->getPrice()->getQuantity());
            $product->setPrice($this->calculator->calculate($definition, $context));
            $product->setPriceDefinition($definition);
        }
    }
}
```

3. Register in `services.php` with both tags, after the product collector/processor:

```php
$services->set(OverwritePriceCollector::class)
    ->args([service(QuantityPriceCalculator::class)])
    ->tag('shopware.cart.processor', ['priority' => 4500])
    ->tag('shopware.cart.collector', ['priority' => 4500]);
```

`collect` parameters: `CartDataCollection` (key-value store passed to processors), `Cart` (current cart), `SalesChannelContext` (currency, country, etc.), `CartBehavior` (cart permissions, unused here).

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartDataCollectorInterface`, `Shopware\Core\Checkout\Cart\CartProcessorInterface`
- `Shopware\Core\Checkout\Cart\LineItem\CartDataCollection` (`set`, `has`, `get`)
- `Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator`
- `Shopware\Core\Checkout\Cart\Price\Struct\QuantityPriceDefinition`
- `LineItem::PRODUCT_LINE_ITEM_TYPE`
- DI tags `shopware.cart.processor`, `shopware.cart.collector` (priority `4500`)

## Gotchas

- Do not query the database in `process`; always fetch in a collector.
- Change prices only on `$toCalculate`; `$original` is only a data source.
- Filter to product line items so discounts and custom items keep their prices.
- The duplicate-fetch guard (`has($key)`) can be removed if prices may change between repeated calculations in one request.
- The source prose calls the data store `CartDataCollector`; the actual class passed in is `CartDataCollection`.
- Priority `4500` is below the core product collector/processor (`5000`), so product prices and tax rules already exist when the processor runs.

## Code check (6.7.13.0)
- confirmed `CartDataCollectorInterface::collect()` — (CartDataCollection, Cart $original, SalesChannelContext, CartBehavior): void — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `CartProcessorInterface::process()` — adds Cart $toCalculate — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `QuantityPriceCalculator::calculate()` — (QuantityPriceDefinition, SalesChannelContext): CalculatedPrice — vendor/shopware/core/Checkout/Cart/Price/QuantityPriceCalculator.php:25
- confirmed `QuantityPriceDefinition::__construct()` — (float $price, TaxRuleCollection $taxRules, int $quantity = 1) — vendor/shopware/core/Checkout/Cart/Price/Struct/QuantityPriceDefinition.php:33
- confirmed `CalculatedPrice::getTaxRules()` — used to build the new definition — vendor/shopware/core/Checkout/Cart/Price/Struct/CalculatedPrice.php:43
- confirmed `LineItemCollection::filterType()` — returns LineItemCollection — vendor/shopware/core/Checkout/Cart/LineItem/LineItemCollection.php:99
- confirmed `LineItemCollection::getReferenceIds()` — returns referenced IDs of the items — vendor/shopware/core/Checkout/Cart/LineItem/LineItemCollection.php:223
- confirmed `Collection::has()` — CartDataCollection inherits set/get/has — vendor/shopware/core/Framework/Struct/Collection.php:103
- confirmed `shopware.cart.collector` — product collector/processor priority 5000, so 4500 runs after — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:356
- confirmed `LineItem::setPriceDefinition()` — accepts ?PriceDefinitionInterface — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:321
