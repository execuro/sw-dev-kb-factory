---
id: platform/dev/6.7/resources/references/adr/2021-03-24-nested-line-items.md
title: Processing of nested line items
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-03-24-nested-line-items.html
sourceHash: 1a0df9e315754a80cc27a099c3e43cd077bbc0eb
codeCheckedAgainst: "6.7.13.0"
keywords: ["nested line items", "CartProcessorInterface", "CartDataCollectorInterface", "ProductCartProcessor", "CreditCartProcessor", "getFlat", "filterType", "LineItem::getChildren", "IncompleteLineItemError", "child line items", "cart processor", "adr"]
summary: "ADR: core cart collectors read nested line items, but process() handles only root-level items; plugins calculate their own nested children."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (checkout area) on how the cart handles nested line items (a line item with children). Core data loading covers all nesting levels, while core `process` logic only takes care of first-level line items; plugins that introduce nested structures calculate their children themselves.

## When to use

- Building a plugin line item type that contains product or credit line items as children (bundles, sets, configurators).
- Debugging why children of a custom line item are not priced or not added to the calculated cart.

## Key steps / config

Decision, as implemented in the installed core:

1. Data loading walks all levels. The ADR says "enrich" uses `getFlat()`; in 6.7 this is the `collect()` method of `Shopware\Core\Checkout\Cart\CartDataCollectorInterface`. `ProductCartProcessor::collect()` recursively gathers product items from every `LineItem::getChildren()` level, so the required product data for nested items is already in the `CartDataCollection`.
2. `process()` only moves first-level items into `$toCalculate`. `CreditCartProcessor::process()` uses `filterType(LineItem::CREDIT_LINE_ITEM_TYPE)` on the root collection; `ProductCartProcessor::process()` prices products flat, but adds only root-level products (`filterType`) to `$toCalculate`.
3. A plugin processor implementing `Shopware\Core\Checkout\Cart\CartProcessorInterface` handles its own type and delegates children to the core processors via temporary carts:

```php
class PluginCartProcessor implements CartProcessorInterface
{
    public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void
    {
        foreach ($original->getLineItems()->filterType('plugin-line-item-type') as $lineItem) {
            // no children: $original->remove(id) + addErrors(new IncompleteLineItemError(id, 'children'))
            $tempOriginal = new Cart($original->getToken());
            $tempCalculate = new Cart($original->getToken());
            $tempOriginal->setLineItems($lineItem->getChildren());
            $this->productCartProcessor->process($data, $tempOriginal, $tempCalculate, $context, $behavior);
            $this->creditCartProcessor->process($data, $tempOriginal, $tempCalculate, $context, $behavior);
            $lineItem->setChildren($tempCalculate->getLineItems());
            $toCalculate->add($lineItem);
        }
    }
}
```

Order matters: products first, then credits, because the credit is scoped to the already calculated product prices (`$toCalculate->getLineItems()->getPrices()`).

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartProcessorInterface::process()`
- `Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect()`
- `Shopware\Core\Content\Product\Cart\ProductCartProcessor`
- `Shopware\Core\Checkout\Cart\CreditCartProcessor`
- `LineItemCollection::getFlat()`, `LineItemCollection::filterType()`, `LineItemCollection::filterFlatByType()`
- `LineItem::getChildren()`, `LineItem::setChildren()`, `LineItem::hasChildren()`
- `Shopware\Core\Checkout\Cart\Error\IncompleteLineItemError`

## Gotchas

- The ADR sample constructs `new Cart('temp-original', $original->getToken())`; in 6.7 `Cart::__construct()` takes only the token.
- The ADR calls the data-loading step "enrich"; the interface method is `collect()`.
- Consequence stated by the ADR: plugins must implement their own processing logic, or extend the core cart processors, for their nested line item implementation.

## Code check (6.7.13.0)
- confirmed `CartProcessorInterface::process()` — signature (data, original, toCalculate, context, behavior): void — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- corrected `CartDataCollectorInterface::collect()` — docs: data loading happens in "enrich" — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `ProductCartProcessor::collect()` — recursively collects products from all child levels — vendor/shopware/core/Content/Product/Cart/ProductCartProcessor.php:82
- confirmed `ProductCartProcessor::process()` — adds only root-level products to toCalculate via filterType — vendor/shopware/core/Content/Product/Cart/ProductCartProcessor.php:145
- confirmed `CreditCartProcessor::process()` — filters first-level credit items only — vendor/shopware/core/Checkout/Cart/CreditCartProcessor.php:22
- confirmed `LineItemCollection::getFlat()` — returns flattened list — vendor/shopware/core/Checkout/Cart/LineItem/LineItemCollection.php:154
- confirmed `LineItemCollection::filterType()` — first-level type filter — vendor/shopware/core/Checkout/Cart/LineItem/LineItemCollection.php:99
- confirmed `LineItem::hasChildren()` — exists alongside getChildren/setChildren — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:403
- corrected `Cart::__construct()` — docs: new Cart(name, token) — vendor/shopware/core/Checkout/Cart/Cart.php:69
- confirmed `IncompleteLineItemError` — constructor (key, property) — vendor/shopware/core/Checkout/Cart/Error/IncompleteLineItemError.php:11
