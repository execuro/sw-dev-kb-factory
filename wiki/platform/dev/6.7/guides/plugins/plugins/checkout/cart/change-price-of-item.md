---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md
title: Change Price of Items in Cart
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/change-price-of-item.html
sourceHash: e56a48c484fdfb45af577ae3749ae36d10af825e
codeCheckedAgainst: "6.7.15.1"
keywords: ["CartDataCollectorInterface", "CartProcessorInterface", "QuantityPriceCalculator", "QuantityPriceDefinition", "CartDataCollection", "shopware.cart.processor", "shopware.cart.collector", "OverwritePriceCollector", "setPriceDefinition", "overwrite line item price", "live shopping price", "cart price change"]
summary: Overwrite product line item prices in the cart with one class implementing collector and processor, recalculated via QuantityPriceCalculator.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

How to dynamically replace the price of product line items in the cart: a cart collector gathers the new prices, a cart processor recalculates them (taxes) and sets them on the line items. The example uses one class for both roles.

## When to use

- Rare cases where an item's price itself must change, e.g. a live-shopping plugin.
- Not for discounts or surcharges — use [adding cart discounts](platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md) instead.

## Key steps / config

1. Collector (`Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect`): take the product IDs from `$original`, skip IDs already present in the `CartDataCollection`, fetch the new price (source is up to you — entity extension, external API) and store it under a prefixed key:

```php
$productIds = $original->getLineItems()
    ->filterType(LineItem::PRODUCT_LINE_ITEM_TYPE)->getReferenceIds();
foreach ($this->filterAlreadyFetchedPrices($productIds, $data) as $id) {
    $data->set('price-overwrite-' . $id, $newPrice); // set a value for every id
}
```

`filterAlreadyFetchedPrices` checks `$data->has($key)`, because `collect` can run several times per request; drop it if prices may change between runs. Prefixing the key avoids collisions with other collectors.

2. Processor (`Shopware\Core\Checkout\Cart\CartProcessorInterface::process`), with `Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator` injected:

```php
class OverwritePriceCollector implements CartDataCollectorInterface, CartProcessorInterface
{
    public function __construct(private QuantityPriceCalculator $calculator) {}
    public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void { /* step 1 */ }
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

3. Register with both tags, after the product collector/processor:

```php
$services->set(OverwritePriceCollector::class)
    ->args([service(QuantityPriceCalculator::class)])
    ->tag('shopware.cart.processor', ['priority' => 4500])
    ->tag('shopware.cart.collector', ['priority' => 4500]);
```

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartDataCollectorInterface`, `Shopware\Core\Checkout\Cart\CartProcessorInterface`
- `Shopware\Core\Checkout\Cart\LineItem\CartDataCollection` (`set`, `has`, `get`)
- `Shopware\Core\Checkout\Cart\Price\QuantityPriceCalculator::calculate()`
- `Shopware\Core\Checkout\Cart\Price\Struct\QuantityPriceDefinition`
- `LineItem::PRODUCT_LINE_ITEM_TYPE`, `LineItem::setPrice()`, `LineItem::setPriceDefinition()`
- Tags `shopware.cart.processor`, `shopware.cart.collector`

## Gotchas

- Change prices with caution; prefer discounts/surcharges.
- Never query the database in `process`; do all fetching in `collect`.
- Apply changes to `$toCalculate`, not `$original` — only `$toCalculate` is the resulting cart.
- Priority 4500 is below core's `ProductCartProcessor` (5000), so product prices exist when the processor runs.
- `doSomethingToGetNewPrice()` in the docs example is a placeholder, not an API.

## Code check (6.7.15.1)
- confirmed `CartDataCollectorInterface::collect()` — signature as in the example — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `CartProcessorInterface::process()` — signature as in the example — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `QuantityPriceCalculator::calculate()` — `(QuantityPriceDefinition, SalesChannelContext): CalculatedPrice` — vendor/shopware/core/Checkout/Cart/Price/QuantityPriceCalculator.php:25
- confirmed `QuantityPriceDefinition::__construct()` — `(float $price, TaxRuleCollection $taxRules, int $quantity = 1)` — vendor/shopware/core/Checkout/Cart/Price/Struct/QuantityPriceDefinition.php:33
- confirmed `QuantityPriceCalculator` — registered under its class name — vendor/shopware/core/Checkout/DependencyInjection/cart.php:311
- confirmed `shopware.cart.processor` — `ProductCartProcessor` priority 5000 — vendor/shopware/core/Checkout/DependencyInjection/cart.php:527
- confirmed `LineItemCollection::filterType()` — returns a `LineItemCollection` — vendor/shopware/core/Checkout/Cart/LineItem/LineItemCollection.php:99
- confirmed `LineItemCollection::getReferenceIds()` — used to collect product IDs — vendor/shopware/core/Checkout/Cart/LineItem/LineItemCollection.php:223
