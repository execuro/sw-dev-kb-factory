---
id: platform/dev/6.6/guides/plugins/plugins/checkout/cart/add-cart-validator.md
title: Add cart validator
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/cart/add-cart-validator.html
sourceHash: 940c78b434414a0559309cbbf7316299af79a85d
keywords: ["CartValidatorInterface", "validate method", "Error class", "ErrorCollection", "shopware.cart.validator", "getMessageKey", "getLevel", "blockOrder", "blockResubmit", "getParameters", "checkout.custom-line-item-blocked", "cart validation"]
summary: "Add a custom cart validator implementing CartValidatorInterface, plus a custom Error subclass and its snippet."
lastBuilt: "2026-09-15"
---
## What it is

This guide covers adding a custom cart validator, which checks the cart for invalid state (e.g. missing line item labels or invalid shipping address) and adds errors to the error collection.

## When to use

When a plugin needs to block or flag checkout based on custom conditions in the cart, such as required custom line item payload data.

## Key steps / config

1. Implement `Shopware\Core\Checkout\Cart\CartValidatorInterface`'s `validate` method:

```php
class CustomCartValidator implements CartValidatorInterface
{
    public function validate(Cart $cart, ErrorCollection $errorCollection, SalesChannelContext $salesChannelContext): void
    {
        foreach ($cart->getLineItems()->getFlat() as $lineItem) {
            if (!array_key_exists('customPayload', $lineItem->getPayload()) || $lineItem->getPayload()['customPayload'] !== 'example') {
                $errorCollection->add(new CustomCartBlockedError($lineItem->getId()));
                return;
            }
        }
    }
}
```

2. Register it with tag `shopware.cart.validator`.
3. Create an error class extending `Shopware\Core\Checkout\Cart\Error\Error`, implementing `getId`, `getMessageKey`, `getLevel` (`notice`/`warning`/`error`), `blockOrder`, optionally `blockResubmit` (defaults to `true`), and `getParameters`.
4. Add snippets: the cart looks up `checkout.<messageKey>` and the checkout steps look up `error.<messageKey>`, e.g. `checkout.custom-line-item-blocked` / `error.custom-line-item-blocked`.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartValidatorInterface`
- `Shopware\Core\Checkout\Cart\Error\Error`
- tag `shopware.cart.validator`
- `getMessageKey`, `getLevel`, `blockOrder`, `blockResubmit`, `getParameters`

## Gotchas

Not returning after adding the first error means one error is added per invalid line item, which can show multiple duplicate messages — return after the first match if only one message is desired. `blockResubmit` defaults to `true` if not overridden.
