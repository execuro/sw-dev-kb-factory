---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-validator.md
sourceHash: 5e1cfaf0eae5d0d488aa34eca491aa9d49deef58
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-validator.html
title: Add Cart Validator
version: "6.7"
versions:
  - "6.7"
keywords: ["cart validator", "CartValidatorInterface", "shopware.cart.validator", "ErrorCollection", "Shopware\\Core\\Checkout\\Cart\\Error\\Error", "cart error", "blockOrder", "blockResubmit", "getMessageKey", "LEVEL_ERROR", "checkout error message", "snippet"]
summary: "Custom cart validator: CartValidatorInterface tagged shopware.cart.validator adds an Error subclass to the ErrorCollection, shown via snippets."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md"]
---
## What it is

A guide for adding a custom cart validator: a service that inspects the cart (line items, addresses, other attributes) during validation and adds a custom cart error, plus the error class and the snippets that render its message.

## When to use

When checkout must be blocked or the customer warned based on custom cart conditions, e.g. line items missing a required custom payload value.

## Key steps / config

1. Create the validator (placed by domain, e.g. `<plugin root>/src/Core/Checkout/Cart/Custom/CustomCartValidator.php`) implementing `Shopware\Core\Checkout\Cart\CartValidatorInterface`:

```php
class CustomCartValidator implements CartValidatorInterface
{
    public function validate(Cart $cart, ErrorCollection $errorCollection, SalesChannelContext $salesChannelContext): void
    {
        foreach ($cart->getLineItems()->getFlat() as $lineItem) {
            if (($lineItem->getPayload()['customPayload'] ?? null) !== 'example') {
                $errorCollection->add(new CustomCartBlockedError($lineItem->getId()));
                return;
            }
        }
    }
}
```

2. Register it with the DI tag `shopware.cart.validator` (`->tag('shopware.cart.validator')` in `services.php`).
3. Create the error class extending the abstract `Shopware\Core\Checkout\Cart\Error\Error` (e.g. in `.../Cart/Custom/Error/`):

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

   - `getId`: unique ID; the error is stored under it in the collection.
   - `getMessageKey`: snippet key suffix.
   - `getLevel`: `self::LEVEL_NOTICE`, `self::LEVEL_WARNING` or `self::LEVEL_ERROR` (blue/yellow/red box).
   - `blockOrder`: whether checkout can be completed.
   - `blockResubmit`: optional override; by default returns `blockOrder()`.
   - `getParameters`: extra payload; also passed to the translated message as `%key%` placeholders.
4. Add storefront snippets (see [adding translations](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md)):

```json
{
    "checkout": { "custom-line-item-blocked": "..." },
    "error": { "custom-line-item-blocked": "..." }
}
```

## Essential identifiers

- `Shopware\Core\Checkout\Cart\CartValidatorInterface::validate`
- `Shopware\Core\Checkout\Cart\Error\Error`, `Shopware\Core\Checkout\Cart\Error\ErrorCollection`
- DI tag `shopware.cart.validator`
- Snippet keys `checkout.custom-line-item-blocked`, `error.custom-line-item-blocked`

## Gotchas

- Returning after the first added error yields one message; without it every invalid line item adds its own error.
- The docs say `blockResubmit` defaults to `true`; in code it returns `blockOrder()`.
- Storefront flash messages translate cart errors with the `checkout.` prefix; the `error.` prefix lookup is used for warnings/errors in the `component/checkout/cart-alerts.html.twig` template, which is marked deprecated for v6.8.0.
- `Error::getRoute()` is deprecated (removed in v6.8.0); do not rely on it for links.

## Code check (6.7.13.0)
- confirmed `CartValidatorInterface::validate()` — (Cart, ErrorCollection, SalesChannelContext): void — vendor/shopware/core/Checkout/Cart/CartValidatorInterface.php:12
- confirmed `shopware.cart.validator` — tagged_iterator injected into the cart Validator — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:330
- confirmed `Error::getMessageKey()` — abstract, alongside getId/getLevel/blockOrder — vendor/shopware/core/Checkout/Cart/Error/Error.php:53
- confirmed `Error::getParameters()` — abstract — vendor/shopware/core/Checkout/Cart/Error/Error.php:67
- confirmed `LEVEL_ERROR` — value 20; LEVEL_NOTICE 0, LEVEL_WARNING 10 — vendor/shopware/core/Checkout/Cart/Error/Error.php:28
- corrected `Error::blockResubmit()` — docs: true by default; code returns blockOrder() — vendor/shopware/core/Checkout/Cart/Error/Error.php:59
- deprecated `Error::getRoute()` — tag:v6.8.0, removed without replacement — vendor/shopware/core/Checkout/Cart/Error/Error.php:72
- confirmed `getMessageKey` — storefront flash messages translated with checkout. prefix and %param% placeholders — vendor/shopware/storefront/Controller/StorefrontController.php:261
- confirmed `CartValidatorInterface` — autoconfigured with tag shopware.cart.validator — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:97
- confirmed `ErrorCollection` — validator receives the shared error collection — vendor/shopware/core/Checkout/Cart/CartValidatorInterface.php:12
