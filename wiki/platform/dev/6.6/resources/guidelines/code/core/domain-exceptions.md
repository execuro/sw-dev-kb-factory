---
id: "platform/dev/6.6/resources/guidelines/code/core/domain-exceptions.md"
title: "Domain exceptions"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/domain-exceptions.html"
sourceHash: "8ca9c914254af9444e035b14a5d5f5c99985768c"
keywords: ["domain exceptions", "HttpException", "CustomerException", "error codes", "exception factory", "http status code", "top level domain", "exception subfolder", "private constructor"]
summary: "Shopware's domain exception pattern: one factory exception class per domain extending HttpException, with private constructors and unique error codes."
lastBuilt: "2026-09-15"
---
## What it is

Describes Shopware's domain exception pattern: a single factory exception class per domain used to construct all exceptions within that domain.

## When to use

Use when adding a new exception type within an existing domain (or creating a new domain's exception factory), or when deciding whether an exception should be directly catchable.

## Key steps / config

Each domain exception class extends `Shopware\Core\Framework\HttpException`, which guarantees a unique error code and HTTP handling; error codes are unique within the domain and defined on the domain exception class itself. The `__construct` is `private`, so instances can only be created via static factory methods. Domain exception classes live directly inside the top-level domain, e.g. `Checkout\Cart`, `Checkout\Customer`, `Content\Category`, `Content\Product`.

```php
namespace Shopware\Core\Checkout\Customer;

#[Package('customer-order')]
class CustomerException extends HttpException
{
    public const CUSTOMER_GROUP_NOT_FOUND = 'CHECKOUT__CUSTOMER_GROUP_NOT_FOUND';

    public static function customerGroupNotFound(string $id): self { /* ... */ }
}
```

If an exception needs to be caught and handled via try-catch, implement a separate exception class in an `Exception` subfolder that extends the domain exception:

```php
namespace Shopware\Core\Checkout\Customer\Exception;

class CustomerNotFoundException extends CustomerException {}
```

Each specific exception type should carry a specific HTTP status code, using the official codes documented by MDN.

## Essential identifiers

- `Shopware\Core\Framework\HttpException`
- `CustomerException`
- `CustomerNotFoundException`
- `#[Package(...)]`

## Gotchas

- Domain exceptions are not necessarily meant to be caught in a try-catch; only the separate `Exception` subfolder classes extending them are intended to be caught.
