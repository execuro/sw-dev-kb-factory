---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-validator.md
title: Add Cart Validator
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-validator.html
sourceHash: 5e1cfaf0eae5d0d488aa34eca491aa9d49deef58
codeCheckedAgainst: "6.7.15.1"
keywords: ["CartValidatorInterface", "shopware.cart.validator", "Shopware\\Core\\Checkout\\Cart\\Error\\Error", "ErrorCollection", "getMessageKey", "blockOrder", "blockResubmit", "LEVEL_ERROR", "cart error", "checkout validation", "error snippet", "block checkout"]
summary: Add a custom cart validator (CartValidatorInterface, tag shopware.cart.validator) with an Error subclass and storefront snippets for its message.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md"]
---
## What it is

How to add a custom cart validator that inspects the cart (line items, addresses, other attributes), adds a custom cart error to the error collection, and shows a translated message in the Storefront.

## When to use

You need to flag an invalid cart state — e.g. a line item missing a required payload value — and optionally block the order.

## Key steps / config

1. Validator (place it by domain, e.g. `<plugin root>/src/Core/Checkout/Cart/Custom`), implementing `Shopware\Core\Checkout\Cart\CartValidatorInterface`:

```php
class CustomCartValidator implements CartValidatorInterface
{
    public function validate(Cart $cart, ErrorCollection $errorCollection, SalesChannelContext $salesChannelContext): void
    {
        foreach ($cart->getLineItems()->getFlat() as $lineItem) {
            if (($lineItem->getPayload()['customPayload'] ?? null) !== 'example') {
                $errorCollection->add(new CustomCartBlockedError($lineItem->getId()));
                return; // one error instead of one per item
            }
        }
    }
}
```

2. Register with `$services->set(CustomCartValidator::class)->tag('shopware.cart.validator');`
3. Error class extending abstract `Shopware\Core\Checkout\Cart\Error\Error` (in `.../Custom/Error`):

```php
class CustomCartBlockedError extends Error
{
    private const KEY = 'custom-line-item-blocked';
    public function __construct(private string $lineItemId) { parent::__construct(); }
    public function getId(): string { return $this->lineItemId; }
    public function getMessageKey(): string { return self::KEY; }
    public function getLevel(): int { return self::LEVEL_ERROR; }
    public function blockOrder(): bool { return true; }
    public function getParameters(): array { return ['lineItemId' => $this->lineItemId]; }
}
```

Members: `getId` (unique key in the error collection), `getMessageKey` (snippet key), `getLevel` (`LEVEL_NOTICE`, `LEVEL_WARNING`, `LEVEL_ERROR` — blue/yellow/red box), `blockOrder` (blocks finishing checkout), `getParameters` (extra payload), optional `blockResubmit`.

4. Snippets (`<plugin root>/src/Resources/snippet/en_GB/example.en-GB.json`), see [adding translations](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md):

```json
{
    "checkout": { "custom-line-item-blocked": "..." },
    "error": { "custom-line-item-blocked": "..." }
}
```

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartValidatorInterface::validate()`
- `Shopware\Core\Checkout\Cart\Error\Error`, `Shopware\Core\Checkout\Cart\Error\ErrorCollection`
- Tag `shopware.cart.validator`
- Snippet keys `checkout.<messageKey>`, `error.<messageKey>`

## Gotchas

- Only `Error` subclasses can be added to the collection, not arbitrary exceptions.
- Without the early `return`, one error per invalid item is shown.
- `blockResubmit()` is not hardcoded `true` as the docs say: the base implementation returns `blockOrder()`.
- The docs say `checkout.` is used in the cart and `error.` in checkout steps; the (deprecated) `cart-alerts.html.twig` template instead picks the prefix by level — notices use `checkout.`, warnings and errors use `error.`. Define both keys.
- The docs example always fails until line items carry the `customPayload` payload.

## Code check (6.7.15.1)
- confirmed `CartValidatorInterface::validate()` — `(Cart, ErrorCollection, SalesChannelContext): void` — vendor/shopware/core/Checkout/Cart/CartValidatorInterface.php:12
- confirmed `shopware.cart.validator` — tagged iterator injected into the cart `Validator` — vendor/shopware/core/Checkout/DependencyInjection/cart.php:501
- confirmed `Error::getId()` — abstract — vendor/shopware/core/Checkout/Cart/Error/Error.php:51
- confirmed `Error::getMessageKey()` — abstract — vendor/shopware/core/Checkout/Cart/Error/Error.php:53
- confirmed `Error::getLevel()` — abstract — vendor/shopware/core/Checkout/Cart/Error/Error.php:55
- confirmed `Error::blockOrder()` — abstract — vendor/shopware/core/Checkout/Cart/Error/Error.php:57
- corrected `Error::blockResubmit()` — docs: `true` by default; returns `blockOrder()` — vendor/shopware/core/Checkout/Cart/Error/Error.php:59
- confirmed `Error::getParameters()` — abstract — vendor/shopware/core/Checkout/Cart/Error/Error.php:67
- confirmed `Error::LEVEL_ERROR` — value 20; `LEVEL_NOTICE` 0, `LEVEL_WARNING` 10 — vendor/shopware/core/Checkout/Cart/Error/Error.php:28
- corrected `error.messageKey` — docs: prefix by cart vs checkout step; template picks `checkout.`/`error.` by level — vendor/shopware/storefront/Resources/views/storefront/component/checkout/cart-alerts.html.twig:16
