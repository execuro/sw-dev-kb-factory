---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/exception.md
title: Exception
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/exception.html
sourceHash: fe2dc47225d255932ea17bf4e9d8d0b24d904565
codeCheckedAgainst: "6.7.15.1"
keywords: ["B2BTranslatableException", "NotAllowedRecordException", "getTranslationMessage", "getTranslationParams", "translationMessage", "translationParams", "b2b suite", "translated exception", "error message translation", "snippet key", "error controller", "exception handling"]
summary: "B2B Suite translatable exceptions: implement B2BTranslatableException so the error controller shows a translated, parameterised message."
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite's mechanism for showing a customer a translated exception message in the Shopware error controller: the thrown exception must implement the `B2BTranslatableException` interface (`Shopware\B2B\Common\B2BTranslatableException`), which exposes a translation message and its parameters.

## When to use

When a B2B Suite extension throws an exception whose message should reach the storefront customer in their language, instead of a raw untranslated exception text.

## Key steps / config

1. Create an exception class that extends a PHP exception (the source example extends `DomainException`) and implements `B2BTranslatableException`.
2. Accept and store a translation message and a parameter array (the source's `NotAllowedRecordException` takes `$message`, `string $translationMessage`, `array $translationParams`, `$code`, `Throwable $previous` and passes `$message, $code, $previous` to the parent constructor).
3. Return them from the two interface methods:

```php
class NotAllowedRecordException extends DomainException implements B2BTranslatableException
{
    public function getTranslationMessage(): string { /* ... */ }

    public function getTranslationParams(): array { /* ... */ }
}
```

4. The snippet key is derived from the translation message, with all non-alphanumeric characters stripped after `ucwords()`:

```php
preg_replace('([^a-zA-Z0-9]+)', '', ucwords($exception->getTranslationMessage()))
```

5. Variables in the message are replaced via the `string_replace()` method (as named in the source); the placeholder identifiers are the keys of the `translationParams` array.

## Essential identifiers

- `Shopware\B2B\Common\B2BTranslatableException`
- `Shopware\B2B\Common\Repository\NotAllowedRecordException` (example implementation)
- `getTranslationMessage(): string`
- `getTranslationParams(): array`

## Gotchas

- The snippet key is not the raw message: words are capitalised and every character outside `a-zA-Z0-9` (spaces, punctuation) is removed, so the snippet must be registered under that transformed key.
- Placeholder names in the message must match the keys of `translationParams` exactly.

## Code check (6.7.15.1)
- unverified `B2BTranslatableException` — B2B Suite plugin namespace `Shopware\B2B`, not part of the installed core/storefront/administration code
- unverified `NotAllowedRecordException` — B2B Suite plugin class, out of scope of the installed code
- unverified `string_replace()` — named by the docs; not a Shopware core method, PHP built-in is out of scope
- confirmed `ErrorController` — the Storefront error controller exists in the installed storefront — vendor/shopware/storefront/Controller/ErrorController.php:23
