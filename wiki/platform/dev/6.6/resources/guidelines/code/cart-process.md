---
id: "platform/dev/6.6/resources/guidelines/code/cart-process.md"
title: "Cart Process"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/cart-process.html"
sourceHash: "46fd86c351068be7c42efe273b81b41aa521df24"
keywords: ["cart process", "CartProcessorInterface", "CartDataCollectorInterface", "LineItemFactoryHandler", "PriceCalculator", "shopping cart", "cart calculation", "store API route", "CartDataCollection", "line items"]
summary: "Coding rules for Shopware's cart pipeline: no queries in CartProcessorInterface::process, data caching in collectors, and price calculators."
lastBuilt: "2026-09-15"
---
## What it is

Coding rules for implementing shopping cart logic in Shopware's cart pipeline.

## When to use

Apply these rules when writing or modifying cart processors, cart data collectors, line item creation, price calculation, or store API routes for the cart.

## Key steps / config

- `\Shopware\Core\Checkout\Cart\CartProcessorInterface::process` must never execute queries, because it runs several times in a row to resolve dependencies between cart line items.
- `\Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect` must always check whether the required data was already loaded, to avoid redundant database queries; loaded data is appended to the passed `CartDataCollection`.
- Line items must always be created via a `LineItemFactoryHandler` class.
- Price calculations must always go through an appropriate `PriceCalculator`; all price calculators live in the `Shopware\Core\Checkout\Cart\Price` class.
- Every shopping cart function must be mapped via a corresponding store API route, located in the `Shopware\Core\Checkout\Cart\SalesChannel` namespace.

## Essential identifiers

- `\Shopware\Core\Checkout\Cart\CartProcessorInterface::process`
- `\Shopware\Core\Checkout\Cart\CartDataCollectorInterface::collect`
- `CartDataCollection`
- `LineItemFactoryHandler`
- `Shopware\Core\Checkout\Cart\Price`
- `Shopware\Core\Checkout\Cart\SalesChannel`
