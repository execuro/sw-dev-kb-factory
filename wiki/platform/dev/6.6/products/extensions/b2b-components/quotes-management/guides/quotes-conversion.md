---
id: platform/dev/6.6/products/extensions/b2b-components/quotes-management/guides/quotes-conversion.md
title: Quotes conversion
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/quotes-management/guides/quotes-conversion.html
sourceHash: a5649b304fcd3fa7d44d047a7ba8140900f21057
keywords: ["CartToQuoteConverter", "convertToQuote", "QuoteToCartConverter", "convertToCart", "cart to quote", "quote to cart", "OrderConverter", "OrderConversionContext", "QuoteLineItemTransformer", "quotes conversion"]
summary: "CartToQuoteConverter::convertToQuote builds a quote from a cart via OrderConverter; QuoteToCartConverter::convertToCart rebuilds a cart from a quote."
lastBuilt: "2026-09-15"
---
## What it is

Documents the two services that convert between a shopping cart and a quote in Quotes Management.

## Key steps / config

- **Cart to quote**: `Shopware\Commercial\B2B\QuoteManagement\Domain\CartToQuote\CartToQuoteConverter::convertToQuote` converts a cart to an order (via `OrderConverter`) and then enriches the result into quote data and line items.

```php
use Shopware\Core\Checkout\Cart\Order\OrderConversionContext;
use Shopware\Core\Checkout\Cart\Cart;
use Shopware\Core\Checkout\Cart\Order\OrderConverter;

public function convertToQuote(Cart $cart, SalesChannelContext $context, OrderConversionContext $orderContext = null): Quote
```

- **Quote to cart**: `Shopware\Commercial\B2B\QuoteManagement\Domain\QuoteToCart\QuoteToCartConverter::convertToCart` builds a new `Cart` from a `QuoteEntity`, setting its price and transforming quote line items via `QuoteLineItemTransformer::transformToLineItems`.

```php
public function convertToCart(QuoteEntity $quote, SalesChannelContext $context): Cart
```

## Essential identifiers

- `Shopware\Commercial\B2B\QuoteManagement\Domain\CartToQuote\CartToQuoteConverter::convertToQuote`
- `Shopware\Commercial\B2B\QuoteManagement\Domain\QuoteToCart\QuoteToCartConverter::convertToCart`
- `QuoteLineItemTransformer::transformToLineItems`
