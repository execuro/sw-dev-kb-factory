---
id: platform/dev/6.7/products/extensions/b2b-components/quotes-management/guides/quotes-conversion.md
title: Quotes conversion
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/quotes-management/guides/quotes-conversion.html
sourceHash: a5649b304fcd3fa7d44d047a7ba8140900f21057
codeCheckedAgainst: "6.7.15.1"
keywords: ["CartToQuoteConverter", "QuoteToCartConverter", "convertToQuote", "convertToCart", "OrderConverter", "OrderConversionContext", "QuoteLineItemTransformer", "QuoteEntity", "cart to quote", "quote to cart", "quote conversion", "b2b quotes"]
summary: B2B quote conversion services - CartToQuoteConverter turns a cart into a quote via OrderConverter; QuoteToCartConverter rebuilds a cart from a quote.
lastBuilt: 2026-10-21
---
## What it is

The two Commercial plugin services that convert between a shopping cart and a B2B quote: cart to quote (quote request) and quote to cart (ordering from an accepted quote).

## When to use

When decorating or calling the quote conversion, for example to enrich quote data from the cart or to add data to the cart created from a quote.

## Key steps / config

**Cart to quote** — `Shopware\Commercial\B2B\QuoteManagement\Domain\CartToQuote\CartToQuoteConverter::convertToQuote()` first converts the cart with core's `Shopware\Core\Checkout\Cart\Order\OrderConverter`, then enriches the quote and its line items from the result. In the installed core, `convertToOrder()` requires a non-null `OrderConversionContext` and returns an array of order data, not an entity:

```php
// OrderConverter::convertToOrder(Cart $cart, SalesChannelContext $context,
//     OrderConversionContext $conversionContext): array
$orderData = $this->orderConverter->convertToOrder($cart, $context, $orderContext ?? new OrderConversionContext());
// enrich quote data and quote line items from $orderData
```

**Quote to cart** — `Shopware\Commercial\B2B\QuoteManagement\Domain\QuoteToCart\QuoteToCartConverter::convertToCart(QuoteEntity $quote, SalesChannelContext $context): Cart` creates a new cart with a random token, sets the quote price, transforms the quote line items, then enriches the cart:

```php
$cart = new Cart(Uuid::randomHex());
$cart->setPrice($quote->getPrice());          // Cart::setPrice(CartPrice)
$cart->setLineItems(QuoteLineItemTransformer::transformToLineItems($quote->getLineItems())); // LineItemCollection
```

## Essential identifiers

- `Shopware\Commercial\B2B\QuoteManagement\Domain\CartToQuote\CartToQuoteConverter`
- `Shopware\Commercial\B2B\QuoteManagement\Domain\QuoteToCart\QuoteToCartConverter`
- `Shopware\Commercial\B2B\QuoteManagement\Entity\Quote\QuoteEntity`
- `Shopware\Commercial\B2B\QuoteManagement\Domain\Transformer\QuoteLineItemTransformer`
- Core: `Shopware\Core\Checkout\Cart\Order\OrderConverter`, `Shopware\Core\Checkout\Cart\Order\OrderConversionContext`, `Shopware\Core\Checkout\Cart\Cart`, `Shopware\Core\Framework\Uuid\Uuid`

## Gotchas

- The docs snippet declares `OrderConversionContext $orderContext = null` and passes it straight to `convertToOrder()`; the installed core parameter is not nullable, so pass a context instance.
- The docs snippet treats the `convertToOrder()` result as the quote object; it is an array of order data that has to be mapped to the quote.
- `Cart::setPrice()` takes a `CartPrice` and `Cart::setLineItems()` a `LineItemCollection`, so quote price and transformed line items must be of those types.

## Code check (6.7.15.1)
- corrected `OrderConverter::convertToOrder()` — docs: optional `$orderContext = null`, result used as the quote; code: required `OrderConversionContext`, returns `array` — vendor/shopware/core/Checkout/Cart/Order/OrderConverter.php:109
- confirmed `OrderConverter` — core service class — vendor/shopware/core/Checkout/Cart/Order/OrderConverter.php:48
- confirmed `OrderConversionContext` — core struct passed to the converter — vendor/shopware/core/Checkout/Cart/Order/OrderConversionContext.php:10
- confirmed `Cart::__construct()` — takes a string token — vendor/shopware/core/Checkout/Cart/Cart.php:69
- confirmed `Cart::setPrice()` — accepts `CartPrice` — vendor/shopware/core/Checkout/Cart/Cart.php:164
- confirmed `Cart::setLineItems()` — accepts `LineItemCollection` — vendor/shopware/core/Checkout/Cart/Cart.php:110
- confirmed `Uuid::randomHex()` — static random hex id generator — vendor/shopware/core/Framework/Uuid/Uuid.php:26
- unverified `CartToQuoteConverter` — Commercial plugin class, outside the installed core/storefront/administration roots
- unverified `QuoteToCartConverter` — Commercial plugin class, out of scope
- unverified `QuoteLineItemTransformer` — Commercial plugin class, out of scope
