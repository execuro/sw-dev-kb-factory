---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/exception.md
title: Exception
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/exception.html"
sourceHash: "fe2dc47225d255932ea17bf4e9d8d0b24d904565"
keywords: ["exception", "B2BTranslatableException", "translatable exception", "translationMessage", "translationParams", "getTranslationMessage", "getTranslationParams", "snippet key", "error controller", "b2b suite"]
summary: "B2B Suite exceptions implement B2BTranslatableException to show a translated message in Shopware's error controller."
lastBuilt: "2026-09-15"
---
## What it is

Describes how to make a B2B Suite exception show a translated message to the customer in Shopware's error controller, by implementing the `B2BTranslatableException` interface.

## Key steps / config

Implement `Shopware\B2B\Common\B2BTranslatableException`, storing a `translationMessage` and `translationParams`, and exposing them via `getTranslationMessage()`/`getTranslationParams()`:

```php
namespace Shopware\B2B\Common\Repository;

class NotAllowedRecordException extends DomainException implements B2BTranslatableException
{
    public function __construct($message = '', string $translationMessage = '', array $translationParams = [], $code = 0, Throwable $previous = null)
    public function getTranslationMessage(): string
    public function getTranslationParams(): array
}
```

The snippet key is derived from `translationMessage` via `preg_replace('([^a-zA-Z0-9]+)', '', ucwords($exception->getTranslationMessage()))`. Variables in the message are substituted using the `string_replace()` method, with `translationParams` array keys as the identifiers.

## Essential identifiers

- `Shopware\B2B\Common\B2BTranslatableException`
- `getTranslationMessage()` / `getTranslationParams()`
