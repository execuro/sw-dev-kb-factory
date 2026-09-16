---
id: platform/dev/6.7/products/extensions/b2b-components/quotes-management/guides/quotes-conversion.md
title: Quotes conversion
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/quotes-management/guides/quotes-conversion.html
sourceHash: a5649b304fcd3fa7d44d047a7ba8140900f21057
codeCheckedAgainst: "6.7.13.0"
keywords: ["CartToQuoteConverter", "QuoteToCartConverter", "convertToQuote", "convertToCart", "OrderConverter", "OrderConversionContext", "QuoteEntity", "QuoteLineItemTransformer", "transformToLineItems", "cart to quote", "quote to cart", "b2b quotes"]
summary: B2B CartToQuoteConverter::convertToQuote builds a quote from a cart via OrderConverter; QuoteToCartConverter::convertToCart rebuilds a cart from a quote.
lastBuilt: 2026-09-15
---
## What it is

Describes the two B2B Components (Commercial) services that convert a shopping cart into a quote and a quote back into a cart for checkout.

## When to use

When customizing or decorating the quote request flow (cart to quote) or the order-from-quote flow (quote to cart), or when debugging data missing on either side.

## Key steps / config

### Cart to quote

`Shopware\Commercial\B2B\QuoteManagement\Domain\CartToQuote\CartToQuoteConverter::convertToQuote(Cart $cart, SalesChannelContext $context, ...)`:

1. Calls core `OrderConverter::convertToOrder($cart, $context, $orderContext)` to convert the cart into order data.
2. Enriches that data as quote data.
3. Enriches the quote line items and returns the quote.

In core 6.7 `convertToOrder()` requires a non-null `OrderConversionContext` and returns an `array` (order write payload), so the enrichment works on array data.

### Quote to cart

`Shopware\Commercial\B2B\QuoteManagement\Domain\QuoteToCart\QuoteToCartConverter::convertToCart(QuoteEntity $quote, SalesChannelContext $context): Cart`:

```php
$cart = new Cart(Uuid::randomHex());
$cart->setPrice($quote->getPrice());

$lineItems = QuoteLineItemTransformer::transformToLineItems($quote->getLineItems());
$cart->setLineItems($lineItems);
// enrich the cart
return $cart;
```

Relevant classes: `Shopware\Commercial\B2B\QuoteManagement\Entity\Quote\QuoteEntity`, `Shopware\Commercial\B2B\QuoteManagement\Domain\Transformer\QuoteLineItemTransformer`, `Shopware\Core\Checkout\Cart\Cart`, `Shopware\Core\Checkout\Cart\Order\OrderConverter`, `Shopware\Core\Checkout\Cart\Order\OrderConversionContext`, `Shopware\Core\Framework\Uuid\Uuid`.

## Essential identifiers

- `Shopware\Commercial\B2B\QuoteManagement\Domain\CartToQuote\CartToQuoteConverter::convertToQuote`
- `Shopware\Commercial\B2B\QuoteManagement\Domain\QuoteToCart\QuoteToCartConverter::convertToCart`
- `QuoteLineItemTransformer::transformToLineItems`
- `QuoteEntity`
- `OrderConverter::convertToOrder`, `OrderConversionContext`
- `Cart::setPrice()`, `Cart::setLineItems()`, `Uuid::randomHex()`

## Gotchas

- The docs snippet declares `OrderConversionContext $orderContext = null` and assigns the `convertToOrder()` result directly as the quote; the installed core signature takes a mandatory `OrderConversionContext` and returns an array, so do not pass `null` or treat the result as an entity.
- The snippets are abbreviated; the real enrichment steps are not documented.

## Code check (6.7.13.0)
- corrected `OrderConverter::convertToOrder()` — docs: optional `OrderConversionContext` (null default); code requires it and returns `array` — vendor/shopware/core/Checkout/Cart/Order/OrderConverter.php:112
- confirmed `OrderConversionContext` — core struct class — vendor/shopware/core/Checkout/Cart/Order/OrderConversionContext.php:10
- confirmed `Cart::__construct()` — takes a string token — vendor/shopware/core/Checkout/Cart/Cart.php:69
- confirmed `Cart::setPrice()` — accepts `CartPrice` — vendor/shopware/core/Checkout/Cart/Cart.php:147
- confirmed `Cart::setLineItems()` — accepts `LineItemCollection` — vendor/shopware/core/Checkout/Cart/Cart.php:93
- confirmed `Uuid::randomHex()` — static, returns string — vendor/shopware/core/Framework/Uuid/Uuid.php:26
- unverified `CartToQuoteConverter` — Commercial plugin, outside the installed vendor/shopware roots
- unverified `QuoteToCartConverter` — Commercial plugin, outside the installed vendor/shopware roots
- unverified `QuoteLineItemTransformer` — Commercial plugin, outside the installed vendor/shopware roots
- unverified `QuoteEntity` — Commercial plugin, outside the installed vendor/shopware roots
