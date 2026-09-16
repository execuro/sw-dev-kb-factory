---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/_index.md
sourceHash: f6300964821c981f925605fb587989b78953c44e
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/
title: Cart
version: "6.7"
versions:
  - "6.7"
keywords: ["cart", "shopping cart", "line item", "CartService", "LineItem", "CartProcessorInterface", "CartDataCollectorInterface", "CartValidatorInterface", "AbstractCartPersister", "AbstractTaxProvider", "shopware.cart.processor", "custom price", "cart discount", "tax rate"]
summary: "Overview of cart plugin topics: add/update line items, discounts, custom prices, tax rates, cart persistence, validation and hand-off to checkout."
lastBuilt: 2026-09-15
---
## What it is

Entry page of the Shopware 6.7 plugin guides for the cart. It lists the cart functions a plugin can enhance or customize: adding products to the cart, displaying cart contents, adding discounts to line items, updating cart items, adding custom prices to line items, applying tax rates, proceeding to checkout, persisting cart data, integrating with the checkout process and validating the cart. These exist in core; plugins adapt them to business needs.

## When to use

- Orienting before writing a plugin that changes cart contents, prices, taxes, persistence or validation.
- Picking which cart extension point a requirement maps to.

## Essential identifiers

The source names only functions. Installed core code provides them through these classes (verified, see Code check):

- Add / update / remove items: `Shopware\Core\Checkout\Cart\SalesChannel\CartService` — `add()`, `update()`, `remove()`, `getCart()`, `order()`; items are `Shopware\Core\Checkout\Cart\LineItem\LineItem`.
- Enrich data and recalculate (discounts, custom prices): `CartDataCollectorInterface::collect()` and `CartProcessorInterface::process()`, services tagged `shopware.cart.collector` / `shopware.cart.processor` (tag `priority` sets order, e.g. promotions use `4900`).
- Validation: `CartValidatorInterface::validate()`, tagged `shopware.cart.validator`.
- Persistence: `Shopware\Core\Checkout\Cart\AbstractCartPersister` — `load(string $token, SalesChannelContext $context)`, `save(Cart $cart, SalesChannelContext $context)`.
- Tax rates: `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider`.

## Code check (6.7.13.0)
- confirmed `CartService::add()` — accepts LineItem or array — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:89
- confirmed `CartService::update()` — updates items — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:118
- confirmed `CartService::remove()` — removes by identifier — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:131
- confirmed `LineItem` — class extends Struct — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:21
- confirmed `CartDataCollectorInterface::collect()` — collector contract — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:12
- confirmed `CartProcessorInterface::process()` — processor contract — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `shopware.cart.collector` — tag with priority 4900 on promotion collector — vendor/shopware/core/Checkout/DependencyInjection/promotion.xml:81
- confirmed `shopware.cart.validator` — tag on a validator service — vendor/shopware/core/Checkout/DependencyInjection/payment.xml:149
- confirmed `AbstractCartPersister::save()` — abstract persistence member — vendor/shopware/core/Checkout/Cart/AbstractCartPersister.php:23
- confirmed `AbstractTaxProvider` — abstract tax provider base — vendor/shopware/core/Checkout/Cart/TaxProvider/AbstractTaxProvider.php:11
