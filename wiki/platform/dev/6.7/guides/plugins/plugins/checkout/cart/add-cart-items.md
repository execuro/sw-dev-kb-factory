---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-items.md
title: Add Cart Items
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-items.html
sourceHash: a4e55fcc654c3b153a0471d8727d06f45a65b5ca
codeCheckedAgainst: "6.7.15.1"
keywords: ["LineItemFactoryRegistry", "CartService", "LineItemFactoryInterface", "CartProcessorInterface", "shopware.cart.line_item.factory", "shopware.cart.processor", "LineItem::PRODUCT_LINE_ITEM_TYPE", "referencedId", "payload", "add product to cart", "line item handler", "custom line item type"]
summary: Create line items via LineItemFactoryRegistry, add them with CartService, and register a custom LineItemFactoryInterface handler plus cart processor.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/resources/references/adr/2021-03-24-nested-line-items.md"]
---
## What it is

How to create cart line items (product, promotion, credit, custom or your own type) in code and add them to the cart, and how to register a custom line item factory handler with a matching cart processor.

## When to use

- Adding a product or other line item to the cart programmatically (controller, service, subscriber).
- Introducing a new line item type, e.g. for a bundle entity.
- Background: [custom page / controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md), [dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md).

## Key steps / config

1. Inject `\Shopware\Core\Checkout\Cart\LineItemFactoryRegistry` and `\Shopware\Core\Checkout\Cart\SalesChannel\CartService`.
2. Get the cart: in a controller add a `\Shopware\Core\Checkout\Cart\Cart` argument (filled by the cart argument resolver); elsewhere call `CartService::getCart`.
3. Create and add the item; in a `StorefrontController` the action returns `Symfony\Component\HttpFoundation\Response` (what `renderStorefront()` returns):

```php
$lineItem = $this->factory->create([
    'type' => LineItem::PRODUCT_LINE_ITEM_TYPE, // 'product'
    'referencedId' => $productId,  // promotion: the promotion code
    'quantity' => 5,
    'payload' => ['key' => 'value'],
], $context);
$this->cartService->add($cart, $lineItem, $context);
```

`type` is required; default types: `product`, `promotion`, `credit`, `custom`. `id` is also required by validation but generated if missing. Other accepted fields: `stackable`, `removable`, `label`, `coverId`, `priceDefinition`.

4. Custom type: implement `\Shopware\Core\Checkout\Cart\LineItemFactoryHandler\LineItemFactoryInterface` and tag it `shopware.cart.line_item.factory`:

```php
class ExampleHandler implements LineItemFactoryInterface
{
    public const TYPE = 'example';
    public function supports(string $type): bool { return $type === self::TYPE; }
    public function create(array $data, SalesChannelContext $context): LineItem { /* new LineItem($data['id'], self::TYPE, ...) */ }
    public function update(LineItem $lineItem, array $data, SalesChannelContext $context): void { /* ... */ }
}
```

5. Add a processor, otherwise the item is not kept in the calculated cart. It copies items of your type from `$original` to `$toCalculate`; register with `->tag('shopware.cart.processor', ['priority' => 4800])`:

```php
class ExampleProcessor implements CartProcessorInterface
{
    public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void
    {
        foreach ($original->getLineItems()->filterFlatByType(ExampleHandler::TYPE) as $lineItem) {
            $toCalculate->add($lineItem);
        }
    }
}
```

## Essential identifiers

- `LineItemFactoryRegistry::create()` / `::update()`
- `CartService::getCart()` / `CartService::add()`
- `LineItemFactoryInterface` (`supports`, `create`, `update`)
- `CartProcessorInterface::process()`
- `shopware.cart.line_item.factory`, `shopware.cart.processor`
- `CartException::lineItemTypeNotSupported()` (`CHECKOUT__CART_LINE_ITEM_TYPE_NOT_SUPPORTED`)

## Gotchas

- An unsupported `type` throws `CartException` with code `CHECKOUT__CART_LINE_ITEM_TYPE_NOT_SUPPORTED`; the `\Shopware\Core\Checkout\Cart\Exception\LineItemTypeNotSupportedException` named in the docs does not exist.
- The docs' controller return type `Shopware\Storefront\Framework\Routing\StorefrontResponse` does not exist in 6.7; use `Response`.
- `referencedId` in the docs example (`myExampleId`) is not a valid UUID — use a real product ID.
- With autoconfiguration enabled, implementing the interfaces adds the tags automatically; explicit tags are still needed to set a priority.
- Nested line items need their own processing logic or reuse of core processors — see the [nested line items ADR](platform/dev/6.7/resources/references/adr/2021-03-24-nested-line-items.md).

## Code check (6.7.15.1)
- absent `Shopware\Storefront\Framework\Routing\StorefrontResponse` — not in the installed code; `renderStorefront()` returns `Response`
- absent `Shopware\Core\Checkout\Cart\Exception\LineItemTypeNotSupportedException` — replaced by the `CartException` factory below
- confirmed `CartException::lineItemTypeNotSupported()` — thrown when no handler supports the type — vendor/shopware/core/Checkout/Cart/LineItemFactoryRegistry.php:110
- confirmed `StorefrontController::renderStorefront()` — returns `Response` — vendor/shopware/storefront/Controller/StorefrontController.php:68
- confirmed `LineItemFactoryRegistry::create()` — generates `id` when missing, then validates — vendor/shopware/core/Checkout/Cart/LineItemFactoryRegistry.php:44
- confirmed `LineItemFactoryInterface::update()` — interface declares `supports`, `create`, `update` — vendor/shopware/core/Checkout/Cart/LineItemFactoryHandler/LineItemFactoryInterface.php:27
- confirmed `shopware.cart.line_item.factory` — tagged iterator injected into the registry — vendor/shopware/core/Checkout/DependencyInjection/cart.php:612
- confirmed `CartProcessorInterface::process()` — signature as in the example — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `LineItem::PRODUCT_LINE_ITEM_TYPE` — value `product` — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:24
- confirmed `CartService::add()` — accepts `LineItem|array` — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:89
