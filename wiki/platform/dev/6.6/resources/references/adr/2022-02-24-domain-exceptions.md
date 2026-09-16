---
id: platform/dev/6.6/resources/references/adr/2022-02-24-domain-exceptions.md
title: Domain exceptions
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-02-24-domain-exceptions.html"
sourceHash: "4b4f96801cf2550971ae2dea6317116dce5c26b3"
keywords: ["domain exceptions", "DomainException", "CmsException", "ShopwareHttpException", "HttpException", "error code", "exception factory", "RuntimeException", "InvalidArgumentException", "ProductException", "try-catch", "architecture decision record"]
summary: "ADR: each domain gets one exception class as a factory with a private constructor and unique error codes instead of scattered RuntimeExceptions."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record describing the pattern for domain-specific exception classes in Shopware core, replacing ad-hoc use of generic exceptions like `\RuntimeException`.

## When to use
When adding or reviewing error handling in a Shopware core domain: deciding how to raise and structure a new exception instead of throwing a generic PHP exception.

## Key steps / config
- Implement one exception class per domain (e.g. `CmsException`) that extends `HttpException` and acts as a static factory for all exceptions in that domain.
- The class `__construct` is `private`, so instances can only be created via its static factory methods (e.g. `CmsException::notFound()`).
- Each exception case gets its own error-code constant, e.g. `NOT_FOUND_CODE = 'CMS_NOT_FOUND'`, passed to external APIs.
- For cases that must be caught with `try-catch`, implement a separate exception class extending the domain exception (e.g. `ProductException` extends `ShopwareHttpException`, with `ProductNotFoundException` extending `ProductException`), stored in an exception subfolder.

```php
class CmsException extends HttpException
{
    public const NOT_FOUND_CODE = 'CMS_NOT_FOUND';

    public static function notFound(?\Throwable $e = null): void { /* ... */ }
}
```

## Essential identifiers
- `Shopware\Core\Framework\HttpException`
- `Shopware\Core\Framework\ShopwareHttpException`
- `CmsException::notFound()`
- `ProductException`, `ProductNotFoundException`

## Gotchas
Domain exceptions are not necessarily meant to be caught in a try-catch; classes that need catchable exceptions must implement a dedicated subclass instead of relying on the domain exception factory directly.
