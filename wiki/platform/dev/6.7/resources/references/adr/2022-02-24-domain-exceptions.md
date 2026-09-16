---
id: platform/dev/6.7/resources/references/adr/2022-02-24-domain-exceptions.md
title: Domain exceptions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-02-24-domain-exceptions.html
sourceHash: 38b0e6bf38a4c8ff4a740d8c93137c3d751a155c
codeCheckedAgainst: "6.7.13.0"
keywords: ["domain exception", "HttpException", "ShopwareHttpException", "CmsException", "ProductException", "ProductNotFoundException", "error code", "exception factory", "RuntimeException", "adr", "exception handling", "try-catch"]
summary: "ADR: one HttpException subclass per domain is a factory of static methods with unique error codes; catchable cases get subclasses in an Exception folder."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2022-02-24) defining the domain-exception pattern in Shopware core: instead of many ad-hoc exception classes or untraceable `\RuntimeException`s, each domain has one exception class that acts as a factory, and every error case gets its own error code that is passed to external APIs.

## When to use

When throwing errors from core or extension code in a domain (CMS, product, checkout, ...), or when deciding whether a dedicated exception class is needed so callers can catch a specific case.

## Key steps / config

Goals stated by the ADR:
- Developers no longer throw a plain `\RuntimeException` that cannot be traced.
- Each exception has its own error code, passed to external APIs.
- Fewer exception classes that the system never reacts to (e.g. `\InvalidArgumentException`).

1. Create one exception class per domain extending `Shopware\Core\Framework\HttpException`. Its constructor takes `(int $statusCode, string $errorCode, string $message, array $parameters = [], ?\Throwable $previous = null)`; `$message` may contain `{{ placeholder }}` tokens filled from `$parameters`.
2. Define a unique error-code constant per case and add a static factory method per case returning `self`:

```php
namespace Shopware\Core\Content\Cms;

use Shopware\Core\Framework\HttpException;
use Symfony\Component\HttpFoundation\Response;

class CmsException extends HttpException
{
    final public const CMS_PAGE_NOT_FOUND = 'CONTENT__CMS_PAGE_NOT_FOUND';

    public static function pageNotFound(string $pageId): self
    {
        return new self(Response::HTTP_NOT_FOUND, self::CMS_PAGE_NOT_FOUND, self::$couldNotFindMessage, ['entity' => 'page', 'field' => 'ID', 'value' => $pageId]);
    }
}
```

3. Domain exceptions are not necessarily meant to be caught. For a case the system itself must catch in a `try-catch`, add a dedicated class in the domain's `Exception` subfolder that extends the domain exception, and let the factory return it:

```php
// Shopware\Core\Content\Product\Exception\ProductNotFoundException extends ProductException
try {
    throw ProductException::productNotFound($productId);
} catch (ProductNotFoundException $e) { /* ... */ }
```

## Essential identifiers

- `Shopware\Core\Framework\HttpException` (base for domain exceptions; `getErrorCode()`, `getStatusCode()`, `is(string ...$code)`)
- `Shopware\Core\Framework\ShopwareHttpException`
- `Shopware\Core\Content\Cms\CmsException`
- `Shopware\Core\Content\Product\ProductException`
- `Shopware\Core\Content\Product\Exception\ProductNotFoundException`

## Gotchas

- The ADR sample's second factory method `anExceptionIDontCatchAnywhere` is illustrative only; it does not exist in the code.
- The ADR says the domain exception's `__construct` is `private`; in the installed code the `HttpException` constructor is public and domain classes like `CmsException` do not override it.
- The ADR's `ProductException` sample extends `ShopwareHttpException` and declares `: void` return types; the installed `ProductException` extends `HttpException` and factories return typed instances.
- In the installed code `ProductNotFoundException` builds its own code: `PRODUCT_PRODUCT_NOT_FOUND` when the `v6.8.0.0` feature flag is active, otherwise `CONTENT__PRODUCT_NOT_FOUND`.

## Code check (6.7.13.0)
- absent `anExceptionIDontCatchAnywhere` — example-only factory name from the ADR, not in the installed code
- confirmed `HttpException` — abstract base extending ShopwareHttpException — vendor/shopware/core/Framework/HttpException.php:8
- corrected `HttpException::__construct()` — docs: constructor is private; code: public (statusCode, errorCode, message, parameters, previous) — vendor/shopware/core/Framework/HttpException.php:12
- confirmed `HttpException::getErrorCode()` — returns the per-case error code — vendor/shopware/core/Framework/HttpException.php:22
- confirmed `ShopwareHttpException` — abstract, extends Symfony HttpException — vendor/shopware/core/Framework/ShopwareHttpException.php:29
- confirmed `CmsException` — extends HttpException — vendor/shopware/core/Content/Cms/CmsException.php:11
- corrected `CmsException::pageNotFound()` — docs: notFound() with CMS_NOT_FOUND code; code: pageNotFound() with CMS_PAGE_NOT_FOUND — vendor/shopware/core/Content/Cms/CmsException.php:60
- corrected `ProductException` — docs: extends ShopwareHttpException; code: extends HttpException — vendor/shopware/core/Content/Product/ProductException.php:16
- confirmed `ProductException::productNotFound()` — returns ProductNotFoundException — vendor/shopware/core/Content/Product/ProductException.php:145
- confirmed `ProductNotFoundException` — extends ProductException in Exception subfolder — vendor/shopware/core/Content/Product/Exception/ProductNotFoundException.php:14
