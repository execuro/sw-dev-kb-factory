---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-items.md
title: Add Cart Items
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-items.html
sourceHash: 6597a17bc53ebd44010430740ef78f0371bbce7a
codeCheckedAgainst: "6.7.13.0"
keywords: ["LineItemFactoryRegistry", "CartService", "LineItemFactoryInterface", "CartProcessorInterface", "shopware.cart.line_item.factory", "shopware.cart.processor", "LineItem::PRODUCT_LINE_ITEM_TYPE", "CartException::lineItemTypeNotSupported", "add to cart", "line item", "custom line item type", "basket"]
summary: "Add cart line items via LineItemFactoryRegistry::create + CartService::add; custom types need a LineItemFactoryInterface handler and a cart processor."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md
  - platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
  - platform/dev/6.7/resources/references/adr/2021-03-24-nested-line-items.md
---
## What it is

How to create line items (product, promotion, credit, custom or your own type) and add them to the cart in code, and how to register a factory handler plus a cart processor for a custom type.

## When to use

- Adding items to the cart from a Storefront controller ([Adding a custom page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md)) or any service.
- Introducing a custom line item type, e.g. for your own entity.

## Key steps / config

### Add an item

1. Inject `\Shopware\Core\Checkout\Cart\LineItemFactoryRegistry` and `\Shopware\Core\Checkout\Cart\SalesChannel\CartService` ([Dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)).
2. Get the cart: a controller action argument `\Shopware\Core\Checkout\Cart\Cart` is filled by the argument resolver; elsewhere use `CartService::getCart`.
3. Create and add (a Storefront action rendering a template returns `Symfony\Component\HttpFoundation\Response`):

```php
$lineItem = $this->factory->create([
    'type' => LineItem::PRODUCT_LINE_ITEM_TYPE, // 'product'
    'referencedId' => '<product id>',
    'quantity' => 5,
    'payload' => ['key' => 'value'],
], $context);
$this->cartService->add($cart, $lineItem, $context);
```

`type` is mandatory (defaults: `product`, `promotion`, `credit`, `custom`); unknown types throw via `CartException::lineItemTypeNotSupported()`. `referencedId` is the product/promotion ID; `payload` carries arbitrary data (e.g. selected options).

### Custom type

1. Handler implementing `\Shopware\Core\Checkout\Cart\LineItemFactoryHandler\LineItemFactoryInterface`, tagged `shopware.cart.line_item.factory`. `create`/`update` are called by the registry's `create`/`update`:

```php
class ExampleHandler implements LineItemFactoryInterface
{
    public const TYPE = 'example';
    public function supports(string $type): bool { return $type === self::TYPE; }
    public function create(array $data, SalesChannelContext $context): LineItem
    { return new LineItem($data['id'], self::TYPE, $data['referencedId'] ?? null, 1); }
    public function update(LineItem $lineItem, array $data, SalesChannelContext $context): void { /* ... */ }
}
```

2. Processor implementing `Shopware\Core\Checkout\Cart\CartProcessorInterface`, otherwise the item is not persisted; tag it `->tag('shopware.cart.processor', ['priority' => 4800])`:

```php
class ExampleProcessor implements CartProcessorInterface
{
    public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void
    {
        foreach ($original->getLineItems()->filterFlatByType(ExampleHandler::TYPE) as $lineItem) { $toCalculate->add($lineItem); }
    }
}
```

Nested line items need own processing or calls to core processors; see the [nested line items ADR](platform/dev/6.7/resources/references/adr/2021-03-24-nested-line-items.md).

## Essential identifiers

- `LineItemFactoryRegistry::create()`, `CartService::add()`, `CartService::getCart()`
- `LineItemFactoryInterface`, tag `shopware.cart.line_item.factory`
- `CartProcessorInterface::process()`, tag `shopware.cart.processor`
- `LineItem::PRODUCT_LINE_ITEM_TYPE`, `CartException::lineItemTypeNotSupported()`

## Gotchas

- The docs' controller returns `Shopware\Storefront\Framework\Routing\StorefrontResponse`, which does not exist in 6.7.13 — use `Response`.
- The docs' `\Shopware\Core\Checkout\Cart\Exception\LineItemTypeNotSupportedException` does not exist; the registry throws a `CartException`.
- The example `referencedId` is not a valid UUID.

## Code check (6.7.13.0)
- absent `Shopware\Storefront\Framework\Routing\StorefrontResponse` — not in the installed code index; renderStorefront() returns Symfony Response
- absent `Shopware\Core\Checkout\Cart\Exception\LineItemTypeNotSupportedException` — not in the installed code index; replaced by a CartException factory
- confirmed `LineItemFactoryInterface::supports()` — required member (with create, update) — vendor/shopware/core/Checkout/Cart/LineItemFactoryHandler/LineItemFactoryInterface.php:17
- confirmed `LineItemFactoryInterface::update()` — required member — vendor/shopware/core/Checkout/Cart/LineItemFactoryHandler/LineItemFactoryInterface.php:27
- confirmed `CartProcessorInterface::process()` — required member, same signature as docs — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `CartException::lineItemTypeNotSupported()` — thrown by the registry for unknown types — vendor/shopware/core/Checkout/Cart/LineItemFactoryRegistry.php:110
- confirmed `shopware.cart.line_item.factory` — tagged iterator consumed by the registry — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:429
- confirmed `shopware.cart.processor` — processor tag with priorities — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:341
- confirmed `StorefrontController::renderStorefront()` — returns Response — vendor/shopware/storefront/Controller/StorefrontController.php:67
- confirmed `CartService::add()` — accepts LineItem or array — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:89
