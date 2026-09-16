---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/exception.md
title: Exception
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/exception.html
sourceHash: fe2dc47225d255932ea17bf4e9d8d0b24d904565
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "exception", "translatable exception", "B2BTranslatableException", "Shopware\\B2B\\Common\\B2BTranslatableException", "NotAllowedRecordException", "getTranslationMessage", "getTranslationParams", "translationParams", "error message translation", "snippet key"]
summary: "B2B Suite exceptions implementing B2BTranslatableException get translated messages in the error controller; snippet key from getTranslationMessage()."
lastBuilt: 2026-09-15
---
## What it is

How B2B Suite exceptions show a translated message to the customer in the Shopware error controller: the exception must implement the `Shopware\B2B\Common\B2BTranslatableException` interface.

## When to use

When throwing an exception from B2B Suite code whose message should be displayed to the customer in their language.

## Key steps / config

1. Implement `B2BTranslatableException` on your exception (example: `Shopware\B2B\Common\Repository\NotAllowedRecordException extends DomainException`).
2. Accept a translation message and parameters in the constructor, pass `$message`, `$code`, `$previous` to the parent, and expose them:

```php
class NotAllowedRecordException extends DomainException implements B2BTranslatableException
{
    public function __construct($message = '', string $translationMessage = '',
        array $translationParams = [], $code = 0, Throwable $previous = null) { /* ... */ }

    public function getTranslationMessage(): string { /* ... */ }

    public function getTranslationParams(): array { /* ... */ }
}
```

3. The snippet key is derived from the translation message:

```php
preg_replace('([^a-zA-Z0-9]+)', '', ucwords($exception->getTranslationMessage()))
```

4. Variables in the message are replaced via `string_replace()`; the placeholder identifiers are the keys of the `translationParams` array.

## Essential identifiers

- `Shopware\B2B\Common\B2BTranslatableException`
- `Shopware\B2B\Common\Repository\NotAllowedRecordException`
- `getTranslationMessage()`, `getTranslationParams()`

## Code check (6.7.13.0)
- unverified `Shopware\B2B\Common\B2BTranslatableException` — B2B Suite package not installed; not in vendor/shopware core/storefront/administration
- unverified `Shopware\B2B\Common\Repository\NotAllowedRecordException` — B2B Suite package not installed
- unverified `B2BTranslatableException::getTranslationMessage()` — B2B Suite package not installed
- unverified `B2BTranslatableException::getTranslationParams()` — B2B Suite package not installed
