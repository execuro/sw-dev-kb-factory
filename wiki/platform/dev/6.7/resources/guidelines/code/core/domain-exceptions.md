---
id: platform/dev/6.7/resources/guidelines/code/core/domain-exceptions.md
title: Domain exceptions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/domain-exceptions.html
sourceHash: 8429953052e6341028786410a07c6c1c6ae0160f
codeCheckedAgainst: "6.7.15.1"
keywords: ["domain exceptions", "HttpException", "Shopware\\Core\\Framework\\HttpException", "CustomerException", "CustomerNotFoundException", "CUSTOMER_GROUP_NOT_FOUND", "customerGroupNotFound", "error code", "http status code", "exception factory", "static factory method", "catchable exception"]
summary: "Core guideline: one HttpException subclass per top-level domain acts as factory for its exceptions, with unique error codes and HTTP status."
lastBuilt: 2026-10-21
---
## What it is

The Shopware core coding guideline for domain exceptions: every top-level domain has one exception class that serves as a factory for all exceptions of that domain. Each domain exception extends `Shopware\Core\Framework\HttpException`, which carries an HTTP status code and a unique error code. The error codes are defined as constants on the domain exception and are unique within the domain. The decision was taken in the 2022-02-24 domain-exceptions ADR.

## When to use

- You throw an exception anywhere inside a Shopware domain and need consistent error code and HTTP handling.
- You need an exception that other code can actually catch in a `try`/`catch` — then a dedicated subclass is added (see below).

## Key steps / config

1. Place the domain exception directly in the top-level domain of the area, e.g. `Checkout\Cart`, `Checkout\Customer`, `Content\Category`, `Content\Product`.
2. Extend `HttpException`, define the error code constants, and add one static factory method per exception. The `HttpException` constructor takes `(int $statusCode, string $errorCode, string $message, array $parameters = [], ?\Throwable $previous = null)`; `{{ placeholder }}` tokens in the message are filled from `$parameters`.

```php
namespace Shopware\Core\Checkout\Customer;

#[Package('checkout')]
class CustomerException extends HttpException
{
    public const CUSTOMER_GROUP_NOT_FOUND = 'CHECKOUT__CUSTOMER_GROUP_NOT_FOUND';

    public static function customerGroupNotFound(string $id): self
    {
        return new self(Response::HTTP_BAD_REQUEST, self::CUSTOMER_GROUP_NOT_FOUND, /* message */, ['id' => $id]);
    }
}
```

3. For exceptions meant to be caught, create a class in the domain's `Exception` subfolder that extends the domain exception (e.g. `Shopware\Core\Checkout\Customer\Exception\CustomerNotFoundException extends CustomerException`) and return it from a factory method of the domain exception.
4. Give each specific exception type a specific, official HTTP status code (the guideline refers to the MDN HTTP status reference).

## Essential identifiers

- `Shopware\Core\Framework\HttpException` — `getErrorCode()`, `getStatusCode()`, `is(string ...$code)`
- `Shopware\Core\Checkout\Customer\CustomerException`
- `CustomerException::CUSTOMER_GROUP_NOT_FOUND` = `CHECKOUT__CUSTOMER_GROUP_NOT_FOUND`
- `CustomerException::customerGroupNotFound()`
- `Shopware\Core\Checkout\Customer\Exception\CustomerNotFoundException`

## Gotchas

- The docs say the constructor of the domain exception is `private` so only factory methods can instantiate it. In 6.7.15.1 the `HttpException` constructor is `public`, and `CustomerNotFoundException` calls `parent::__construct(...)` from its own public constructor — the "factory only" rule is a convention, not enforced by visibility.
- Domain exceptions are not necessarily intended to be caught; only the dedicated subclasses are.
- The installed `customerGroupNotFound()` uses the shared `HttpException::$couldNotFindMessage` template (`entity`/`field`/`value` parameters) rather than the docs' literal message.
- The docs example uses `#[Package('customer-order')]`; the installed class is `#[Package('checkout')]`.

## Code check (6.7.15.1)
- confirmed `HttpException` — abstract base for domain exceptions — vendor/shopware/core/Framework/HttpException.php:8
- corrected `HttpException::__construct()` — docs: constructor is private; installed constructor is public — vendor/shopware/core/Framework/HttpException.php:12
- confirmed `HttpException::getStatusCode()` — exposes the HTTP status — vendor/shopware/core/Framework/HttpException.php:27
- confirmed `CustomerException` — extends HttpException in Checkout\Customer — vendor/shopware/core/Checkout/Customer/CustomerException.php:38
- corrected `Package` — docs: Package('customer-order'); installed Package('checkout') — vendor/shopware/core/Checkout/Customer/CustomerException.php:37
- confirmed `CustomerException::CUSTOMER_GROUP_NOT_FOUND` — value CHECKOUT__CUSTOMER_GROUP_NOT_FOUND — vendor/shopware/core/Checkout/Customer/CustomerException.php:42
- confirmed `CustomerException::customerGroupNotFound()` — static factory, HTTP 400 — vendor/shopware/core/Checkout/Customer/CustomerException.php:88
- confirmed `CustomerNotFoundException` — catchable subclass in Exception subfolder — vendor/shopware/core/Checkout/Customer/Exception/CustomerNotFoundException.php:13
