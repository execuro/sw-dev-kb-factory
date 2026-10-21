---
id: platform/dev/6.7/resources/references/adr/2022-02-24-domain-exceptions.md
title: Domain exceptions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-02-24-domain-exceptions.html
sourceHash: 38b0e6bf38a4c8ff4a740d8c93137c3d751a155c
codeCheckedAgainst: "6.7.15.1"
keywords: ["domain exception", "exception factory", "error code", "HttpException", "ShopwareHttpException", "CmsException", "ProductException", "ProductNotFoundException", "Shopware\\Core\\Framework\\HttpException", "RuntimeException", "exception handling", "adr"]
summary: "ADR: one exception factory class per domain (extending HttpException) with a unique error code per case; catchable cases get own subclasses."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-02-24, area core) on how Shopware structures exceptions. Instead of many single-purpose exception classes (or falling back to a plain `\RuntimeException`), each domain gets one exception class that acts as a factory for all exceptions of that domain, and every case carries its own unique error code that is passed to external APIs.

## When to use

When throwing an error from core or extension code in a domain (Cms, Product, Checkout, ...), or when deciding whether an error case needs its own catchable exception class.

## Key steps / config

Goals stated by the ADR:

- No more untraceable `\RuntimeException` throws.
- Each exception has its own error code, exposed to external APIs.
- Fewer exception classes that nothing reacts to (e.g. `\InvalidArgumentException`).

Pattern as implemented in 6.7: the domain class extends `Shopware\Core\Framework\HttpException`, defines error-code constants, and exposes static factory methods that return `self` built from status code, error code, message, parameters and the previous throwable:

```php
namespace Shopware\Core\Content\Cms;

use Shopware\Core\Framework\HttpException;
use Symfony\Component\HttpFoundation\Response;

class CmsException extends HttpException
{
    final public const CMS_PAGE_NOT_FOUND = 'CONTENT__CMS_PAGE_NOT_FOUND';

    public static function pageNotFound(string $pageId): self { /* new self(Response::HTTP_NOT_FOUND, self::CMS_PAGE_NOT_FOUND, ...) */ }
}
```

Domain exceptions are not primarily meant to be caught. For cases the system itself must catch in a `try-catch`, a dedicated subclass of the domain exception is placed in the domain's `Exception` subfolder and returned by the factory:

```php
// Shopware\Core\Content\Product\Exception\ProductNotFoundException extends ProductException
try {
    throw ProductException::productNotFound($productId);
} catch (ProductNotFoundException $e) { /* ... */ }
```

## Essential identifiers

- `Shopware\Core\Framework\HttpException` (constructor: `int $statusCode, string $errorCode, string $message, array $parameters = [], ?\Throwable $previous = null`; `getErrorCode()`, `getStatusCode()`, `is(string ...$code)`)
- `Shopware\Core\Framework\ShopwareHttpException` (parent of `HttpException`)
- `Shopware\Core\Content\Cms\CmsException`, `CmsException::pageNotFound()`
- `Shopware\Core\Content\Product\ProductException`, `Shopware\Core\Content\Product\Exception\ProductNotFoundException`

## Gotchas

- The ADR says the constructor is `private` so only factory methods can instantiate; in 6.7 the `HttpException` constructor is public.
- The ADR sample declares factories with return type `void` while returning an object; real factories return `self` or the specific subclass.
- The sample `ProductException extends ShopwareHttpException`; in 6.7 it extends `HttpException`.
- The sample method `anExceptionIDontCatchAnywhere` and the codes `CMS_NOT_FOUND` / `CMS_SOME_FOO` are illustrations only, not real core members.
- Error codes are meant to be specific per case; a generic exception reused everywhere does not help API consumers find the root cause.

## Code check (6.7.15.1)
- absent `anExceptionIDontCatchAnywhere` — illustrative method name from the ADR sample only
- confirmed `HttpException` — abstract base extending ShopwareHttpException — vendor/shopware/core/Framework/HttpException.php:8
- corrected `HttpException::__construct()` — docs: private constructor; code: public constructor (statusCode, errorCode, message, parameters, previous) — vendor/shopware/core/Framework/HttpException.php:12
- confirmed `HttpException::getErrorCode()` — returns the error code — vendor/shopware/core/Framework/HttpException.php:22
- confirmed `ShopwareHttpException` — abstract base class — vendor/shopware/core/Framework/ShopwareHttpException.php:29
- confirmed `CmsException::pageNotFound()` — factory returning self with HTTP 404 — vendor/shopware/core/Content/Cms/CmsException.php:60
- corrected `CmsException::CMS_PAGE_NOT_FOUND` — docs: `NOT_FOUND_CODE = 'CMS_NOT_FOUND'`; code: `CONTENT__CMS_PAGE_NOT_FOUND` — vendor/shopware/core/Content/Cms/CmsException.php:16
- corrected `ProductException` — docs: extends ShopwareHttpException; code: extends HttpException — vendor/shopware/core/Content/Product/ProductException.php:17
- confirmed `ProductException::productNotFound()` — returns ProductNotFoundException — vendor/shopware/core/Content/Product/ProductException.php:144
- confirmed `ProductNotFoundException` — subclass of ProductException — vendor/shopware/core/Content/Product/Exception/ProductNotFoundException.php:14
