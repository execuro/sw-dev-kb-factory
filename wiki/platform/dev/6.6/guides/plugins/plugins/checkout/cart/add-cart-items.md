---
id: platform/dev/6.6/guides/plugins/plugins/checkout/cart/add-cart-items.md
title: Add cart items
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/cart/add-cart-items.html
sourceHash: 484ddcd6c2da9690d3356d2f7d18d9e391653e65
keywords: ["LineItemFactoryRegistry", "CartService", "LineItemFactoryInterface", "shopware.cart.line_item.factory", "LineItemTypeNotSupportedException", "line item type", "referencedId", "product line item", "promotion", "nested line items", "cart processor", "PRODUCT_LINE_ITEM_TYPE"]
summary: "Add line items to the cart via LineItemFactoryRegistry, and build a custom LineItemFactoryInterface handler for a new type."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/resources/references/adr/2021-03-24-nested-line-items.md"]
---
## What it is

This guide shows how to create line items (products, promotions, and other types) and add them to the cart, and how to build a custom line item handler.

## When to use

When a plugin needs to add a product, promotion, credit, custom or new custom-typed line item to the cart programmatically, e.g. from a Storefront controller or service.

## Key steps / config

Fetch the current cart via a `Cart` method argument in a controller, or `\Shopware\Core\Checkout\Cart\SalesChannel\CartService::getCart`. Create a line item via `LineItemFactoryRegistry::create()`:

```php
$lineItem = $this->factory->create([
    'type' => LineItem::PRODUCT_LINE_ITEM_TYPE,
    'referencedId' => 'myExampleId',
    'quantity' => 5,
    'payload' => ['key' => 'value']
], $context);
$this->cartService->add($cart, $lineItem, $context);
```

Built-in `type` values: `product`, `promotion`, `credit`, `custom`. An unsupported type throws `\Shopware\Core\Checkout\Cart\Exception\LineItemTypeNotSupportedException`.

To add a new type, implement `\Shopware\Core\Checkout\Cart\LineItemFactoryHandler\LineItemFactoryInterface` (`supports`, `create`, `update`) and register it with tag `shopware.cart.line_item.factory`:

```xml
<service id="Swag\BasicExample\Service\ExampleHandler">
    <tag name="shopware.cart.line_item.factory" />
</service>
```

A processor must also persist the new type into the calculated cart, filtering by `filterFlatByType(ExampleHandler::TYPE)` and registered with tag `shopware.cart.processor`.

## Essential identifiers

- `\Shopware\Core\Checkout\Cart\LineItemFactoryRegistry`
- `\Shopware\Core\Checkout\Cart\SalesChannel\CartService::getCart`
- `\Shopware\Core\Checkout\Cart\LineItemFactoryHandler\LineItemFactoryInterface`
- tag `shopware.cart.line_item.factory`
- `\Shopware\Core\Checkout\Cart\Exception\LineItemTypeNotSupportedException`

## Gotchas

Nested line items require a plugin to implement its own processing logic or extend Shopware's core cart processors; see the nested line items ADR for details.
