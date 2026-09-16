---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/resources/guidelines/code/core/domain-exceptions.md
sourceHash: 8429953052e6341028786410a07c6c1c6ae0160f
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/domain-exceptions.html
title: Domain exceptions
version: "6.7"
versions:
  - "6.7"
keywords: ["domain exceptions", "HttpException", "Shopware\\Core\\Framework\\HttpException", "CustomerException", "CustomerNotFoundException", "error code", "exception factory", "static factory method", "CHECKOUT__CUSTOMER_GROUP_NOT_FOUND", "http status code", "catchable exception", "exception handling"]
summary: Shopware domain exception convention - one HttpException subclass per top-level domain with static factories, unique error codes, catchable subclasses.
lastBuilt: 2026-09-15
---
## What it is

Shopware core coding guideline for domain exceptions: each top-level domain has one exception class that acts as a factory (static methods) for all exceptions of that domain, extending `Shopware\Core\Framework\HttpException` for a unique error code and HTTP status handling (per the 2022-02-24 domain-exceptions ADR).

## When to use

When throwing exceptions from Shopware core code or an extension that follows core conventions, adding a new error to a domain, or deciding whether an exception needs its own catchable class.

## Key steps / config

1. Place the domain exception directly in the top-level domain of its area, e.g. `Checkout\Cart` (`CartException`), `Checkout\Customer` (`CustomerException`), `Content\Category` (`CategoryException`), `Content\Product` (`ProductException`).
2. Extend `Shopware\Core\Framework\HttpException`. Its constructor takes `int $statusCode, string $errorCode, string $message, array $parameters = [], ?\Throwable $previous = null`.
3. Define error codes as constants in the domain class (unique within the domain, prefixed by domain) and create instances only through static factory methods, each returning a specific HTTP status.

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

4. For exceptions that code should catch in a try-catch, create a dedicated class in the domain's `Exception` sub-namespace extending the domain exception, and return it from a factory method:

```php
namespace Shopware\Core\Checkout\Customer\Exception;

class CustomerNotFoundException extends CustomerException
{
    public function __construct(string $email) { parent::__construct(/* status, code, message, params */); }
}
// CustomerException::customerNotFound(string $email): CustomerNotFoundException
```

5. Choose an official HTTP status code (MDN HTTP status reference) that fits each exception type.

## Essential identifiers

- `Shopware\Core\Framework\HttpException`
- `Shopware\Core\Checkout\Customer\CustomerException`, `CustomerException::customerGroupNotFound()`, `CUSTOMER_GROUP_NOT_FOUND`
- `Shopware\Core\Checkout\Customer\Exception\CustomerNotFoundException`, `CustomerException::customerNotFound()`

## Gotchas

- The guideline says the domain exception constructor is `private`; in the installed code `HttpException::__construct` is `public` and `CustomerException` does not override it, so the factory-only rule is a convention, not enforced by visibility.
- Domain exceptions are not primarily meant to be caught; only exceptions intended for try-catch get their own subclass.
- The guideline's samples use `#[Package('customer-order')]`; the installed `CustomerException` uses `#[Package('checkout')]`. Its installed `customerGroupNotFound()` uses the shared `$couldNotFindMessage` template with `entity`/`field`/`value` parameters instead of a custom message.
- The guideline's catchable sample builds `CustomerNotFoundException` with the group-not-found code; the installed subclass takes an `$email` and uses `CUSTOMER_NOT_FOUND` with `HTTP_UNAUTHORIZED`.

## Code check (6.7.13.0)
- confirmed `HttpException` — abstract base for domain exceptions — vendor/shopware/core/Framework/HttpException.php:8
- corrected `HttpException::__construct()` — docs: constructor is private; installed constructor is public — vendor/shopware/core/Framework/HttpException.php:12
- corrected `CustomerException` — docs: Package customer-order; installed Package('checkout') — vendor/shopware/core/Checkout/Customer/CustomerException.php:37
- confirmed `CustomerException::CUSTOMER_GROUP_NOT_FOUND` — value CHECKOUT__CUSTOMER_GROUP_NOT_FOUND — vendor/shopware/core/Checkout/Customer/CustomerException.php:41
- confirmed `CustomerException::customerGroupNotFound()` — static factory, HTTP_BAD_REQUEST — vendor/shopware/core/Checkout/Customer/CustomerException.php:87
- confirmed `CustomerException::customerNotFound()` — returns CustomerNotFoundException — vendor/shopware/core/Checkout/Customer/CustomerException.php:232
- corrected `CustomerNotFoundException` — docs: group-not-found code; installed uses CUSTOMER_NOT_FOUND, takes $email — vendor/shopware/core/Checkout/Customer/Exception/CustomerNotFoundException.php:13
- confirmed `CartException` — top-level domain exception extends HttpException — vendor/shopware/core/Checkout/Cart/CartException.php:23
- confirmed `ProductException` — top-level domain exception extends HttpException — vendor/shopware/core/Content/Product/ProductException.php:16
- confirmed `CategoryException` — top-level domain exception extends HttpException — vendor/shopware/core/Content/Category/CategoryException.php:14
