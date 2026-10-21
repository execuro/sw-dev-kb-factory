---
id: platform/dev/6.7/resources/references/adr/2021-03-24-nested-line-items.md
title: Processing of nested line items
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-03-24-nested-line-items.html
sourceHash: 1a0df9e315754a80cc27a099c3e43cd077bbc0eb
codeCheckedAgainst: "6.7.15.1"
keywords: ["nested line items", "CartProcessorInterface", "CartDataCollectorInterface", "ProductCartProcessor", "CreditCartProcessor", "getFlat", "filterFlatByType", "LineItem children", "IncompleteLineItemError", "cart processor", "bundle", "adr"]
summary: "ADR: core cart processors collect data for nested line items but process only root-level items; plugins calculate their own children."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (area checkout) defining how nested line items (a parent line item with child line items) are handled by the cart. The core processors load data for every item at any depth, but only calculate and add root-level items; nested items are the responsibility of the plugin that creates them.

## When to use

- When a plugin adds a line item type with child items (for example a bundle containing product and credit line items).
- When you wonder why core processors do not put nested children into the calculated cart.

## Key steps / config

Decision in the ADR:

1. The data-loading phase (the ADR calls it "enrich"; in 6.7 this is `CartDataCollectorInterface::collect()`) works on all levels, so the data needed by every nested item is already in the `CartDataCollection`.
2. `CartProcessorInterface::process()` only takes care of first-level line items, so processors do not collide over the same items.
3. A plugin that reuses core line items as children calls the core processors itself for those children.

Pattern from the ADR, reduced to its skeleton:

```php
class PluginCartProcessor implements CartProcessorInterface
{
    public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void
    {
        foreach ($original->getLineItems()->filterType('plugin-line-item-type') as $lineItem) {
            // no children: $original->remove(...) + addErrors(new IncompleteLineItemError($id, 'children'))
            // temp carts: new Cart('temp-original', $token), new Cart('temp-calculate', $token)
            // $tempOriginal->setLineItems($lineItem->getChildren());
            // $this->productCartProcessor->process($data, $tempOriginal, $tempCalculate, $context, $behavior);
            // $this->creditCartProcessor->process($data, $tempOriginal, $tempCalculate, $context, $behavior);
            // $lineItem->setChildren($tempCalculate->getLineItems());
            $toCalculate->add($lineItem);
        }
    }
}
```

Product processing runs before credit processing, because credits are scoped to the already calculated products. The processed children from the temporary cart replace the parent's original children.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartProcessorInterface` — `process(CartDataCollection, Cart $original, Cart $toCalculate, SalesChannelContext, CartBehavior)`
- `Shopware\Core\Checkout\Cart\CartDataCollectorInterface` — `collect()`
- `Shopware\Core\Content\Product\Cart\ProductCartProcessor`, `Shopware\Core\Checkout\Cart\CreditCartProcessor`
- `Shopware\Core\Checkout\Cart\LineItem\CartDataCollection`, `LineItem`, `LineItemCollection::getFlat()`, `filterType()`
- `Shopware\Core\Checkout\Cart\Error\IncompleteLineItemError`
- `LineItem::hasChildren()`, `getChildren()`, `setChildren()`

## Gotchas

- In 6.7, `ProductCartProcessor::process()` computes prices for product items at every depth (`filterFlatByType()`), but adds only root-level product items (`filterType()`) to `$toCalculate`. Nested items still have to be placed into the calculated cart by the owning plugin, as the ADR describes.
- The ADR's example declares `namespace Shopware\Core\Checkout\Cart` and untyped `@var` properties; in a plugin use your own namespace.

## Code check (6.7.15.1)
- confirmed `CartProcessorInterface::process()` — only required member, signature matches the ADR — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- corrected `CartDataCollectorInterface::collect()` — docs: data loading "in enrich"; installed phase is collect() — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `LineItemCollection::getFlat()` — returns all items flattened — vendor/shopware/core/Checkout/Cart/LineItem/LineItemCollection.php:154
- confirmed `LineItemCollection::filterType()` — root-level type filter — vendor/shopware/core/Checkout/Cart/LineItem/LineItemCollection.php:99
- confirmed `ProductCartProcessor` — implements CartProcessorInterface and CartDataCollectorInterface — vendor/shopware/core/Content/Product/Cart/ProductCartProcessor.php:40
- confirmed `filterFlatByType` — ProductCartProcessor::process() prices nested products, adds root-level ones only (line 173) — vendor/shopware/core/Content/Product/Cart/ProductCartProcessor.php:148
- confirmed `CreditCartProcessor` — implements CartProcessorInterface — vendor/shopware/core/Checkout/Cart/CreditCartProcessor.php:13
- confirmed `IncompleteLineItemError` — cart error class — vendor/shopware/core/Checkout/Cart/Error/IncompleteLineItemError.php:9
- confirmed `CartDataCollection` — in Cart\LineItem namespace — vendor/shopware/core/Checkout/Cart/LineItem/CartDataCollection.php:14
- confirmed `LineItem::setChildren()` — takes LineItemCollection — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:388
