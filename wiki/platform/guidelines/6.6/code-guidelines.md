---
id: platform/guidelines/6.6/code-guidelines.md
title: Code guidelines
docType: guideline
version: "6.6"
summary: "Cross-cutting Shopware 6.6 code rules: domain exceptions with unique error codes, PHPStan-friendly type narrowing, deprecation annotations."
keywords: ["code guidelines", "domain exceptions", "httpexception", "error code", "factory method", "phpstan", "static analysis", "type narrowing", "assert", "phpdoc", "deprecation", "backward compatibility"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/domain-exceptions.html", hash: "5e8e71b69f4cc607c00d5b4f87877a846290e166138f7b69b816108fd9fd1a68"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/writing-code-for-static-analysis.html", hash: "696de3dd7a78cccdda190b70557743e0a400b27744e84c7f14dbbe8aca876c24"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-02-24-domain-exceptions.html", hash: "3990cfe177e4f85b1adaca91ff2316f06cbd49e3f02b7cb5a7f32461e838e30f"}]
codeVersion: "6.6.10.29+c8b59f9d"
lastBuilt: 2026-10-21
---

## Index

- [platform/guidelines/6.6/be-code-guidelines.md](platform/guidelines/6.6/be-code-guidelines.md) — backend PHP: decoration/DI (`AbstractX`, `getDecorated()`), entity definitions and flags, migrations, routes, route scope, ACL, bounded Criteria.
- [platform/guidelines/6.6/admin-code-guidelines.md](platform/guidelines/6.6/admin-code-guidelines.md) — Administration: registries and `$super`, module structure and ACL, repository/Criteria, Twig blocks, Meteor components and Pinia.
- [platform/guidelines/6.6/storefront-code-guidelines.md](platform/guidelines/6.6/storefront-code-guidelines.md) — Storefront: Controller to PageLoader to Page, route defaults and HTTP cache, JS plugin system, styling, assets, snippets, cache-safe rendering.

## domain exceptions

- Never throw a bare `\RuntimeException`, `\InvalidArgumentException` or other untraceable generic exception from domain code. Throw through the domain's exception factory instead.
- One exception class per top-level domain, placed directly in that domain's namespace root (e.g. `Shopware\Core\Checkout\Customer\CustomerException`, `Shopware\Core\Content\Product\ProductException`). Top-level domains are areas like `Checkout\Cart`, `Checkout\Customer`, `Content\Category`, `Content\Product`.
- The domain class extends `Shopware\Core\Framework\HttpException` (abstract, itself extending `ShopwareHttpException`) and acts as a factory: one `public static function` per failure case, returning `self` or a catchable subclass.
- Create instances only through those static factories. The docs describe a `private` constructor, but in 6.6 `HttpException::__construct(int $statusCode, string $errorCode, string $message, array $parameters = [], ?\Throwable $previous = null)` is `public` — the factory-only rule is a convention, enforced by review, not by visibility.
- Declare every error code as a `public const` on the domain class, unique within the domain, prefixed with the area (e.g. `CUSTOMER_GROUP_NOT_FOUND = 'CHECKOUT__CUSTOMER_GROUP_NOT_FOUND'`). The code is passed to API consumers as `code` in the error response — one code per distinct failure, never a shared generic one.
- Use `{{ placeholder }}` tokens in the message and pass values via the `$parameters` array; never interpolate values into the message string.
- Give each exception a specific HTTP status from `Symfony\Component\HttpFoundation\Response` constants (`Response::HTTP_BAD_REQUEST`, `Response::HTTP_NOT_FOUND`, ...), not a blanket 500.
- Tag the class with `#[Package('<area>')]` matching its domain's owning package.

```php
#[Package('checkout')]
class CustomerException extends HttpException
{
    public const CUSTOMER_GROUP_NOT_FOUND = 'CHECKOUT__CUSTOMER_GROUP_NOT_FOUND';

    public static function customerGroupNotFound(string $id): self
    {
        return new self(
            Response::HTTP_BAD_REQUEST,
            self::CUSTOMER_GROUP_NOT_FOUND,
            self::$couldNotFindMessage,
            ['entity' => 'customer group', 'field' => 'id', 'value' => $id]
        );
    }
}
```

Rationale: a unique, documented code per error lets API consumers identify the root cause; a generic not-found exception everywhere does not.

Enforced by: review

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/domain-exceptions.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-02-24-domain-exceptions.html

## catchable exception subclasses

- Domain exceptions are not meant to be caught. Only when the system itself must `try`/`catch` a case, add a dedicated subclass of the domain exception in the domain's `Exception` subfolder, and return it from the factory with the subclass as return type.
- Example in code: `Shopware\Core\Checkout\Customer\Exception\AddressNotFoundException extends CustomerException`, created by `CustomerException::addressNotFound(string $id): AddressNotFoundException`.
- To branch on a caught `HttpException`, compare codes with `$e->is(CustomerException::CUSTOMER_GROUP_NOT_FOUND)` or `getErrorCode()` rather than adding a subclass only for matching.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/domain-exceptions.html
Read more: platform/dev/6.6/resources/guidelines/code/core/domain-exceptions.md

## static analysis and type narrowing

Write code PHPStan can type-check: native types everywhere possible. When a value is wider than expected (`Foo|null`, `mixed`, `object`), narrow it in this order of preference:

1. Explicit runtime checks — `if ($foo === null)`, `!is_string($foo)`, `!$foo instanceof Foo` — and handle the failure (throw a domain exception, return a default). Preferred: no type mismatch can propagate.
2. `assert($foo !== null)` / `assert(is_string($foo))` / `assert($foo instanceof Foo)` — for cases that cannot happen in practice. Asserts are disabled in production, so they give no runtime guarantee there.
3. `/** @var Foo $foo */` — last resort only; it is not checked at runtime and a wrong annotation hides real mismatches.

- Avoid type casts like `(string) $foo` as a narrowing tool — PHP juggling can silently turn `null` into `''` and hide the root cause. Cast only when every possible input and its result are known.
- In unit tests use PHPUnit asserts — `static::assertNotNull()`, `static::assertIsString()`, `static::assertInstanceOf()` — instead of any of the above.
- Use `@var`/`@param`/`@return` only for what the language cannot express: generics, array shapes, PHPStan-specific types (`class-string`, integer ranges). Write union and intersection types natively.

Enforced by: PHPStan

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/writing-code-for-static-analysis.html

## deprecation annotations

- Mark public code scheduled for removal with `@deprecated tag:v<major>.0 - <reason or replacement>` in its docblock, as core does (e.g. `@deprecated tag:v6.7.0 - Constant CUSTOMER_IS_INACTIVE will be removed as it is unused`).
- Never remove or break public API (constants, method signatures, class names, Twig blocks) in a minor release; deprecate first and remove in the tagged major.

Enforced by: review

Read more: platform/dev/6.6/resources/guidelines/code/backward-compatibility.md

## Code check (6.6.10.29+c8b59f9d)

- confirmed `HttpException` — abstract base for domain exceptions, extends `ShopwareHttpException` — core/Framework/HttpException.php:8
- corrected `private __construct` — code uses `public function __construct(int $statusCode, string $errorCode, ...)` instead, core/Framework/HttpException.php:12
- confirmed `is` — compares the error code against given codes — core/Framework/HttpException.php:32
- confirmed `CUSTOMER_GROUP_NOT_FOUND` — domain-prefixed error code constant — core/Checkout/Customer/CustomerException.php:36
- confirmed `customerGroupNotFound` — static factory returning `self` — core/Checkout/Customer/CustomerException.php:65
- corrected `customer-order` — code uses `#[Package('checkout')]` instead, core/Checkout/Customer/CustomerException.php:26
- confirmed `addressNotFound` — factory returning catchable subclass — core/Checkout/Customer/CustomerException.php:145
- confirmed `AddressNotFoundException` — subclass in `Exception` subfolder — core/Checkout/Customer/Exception/AddressNotFoundException.php:10
- confirmed `getErrorCode` — emitted as `code` in the error response — core/Framework/ShopwareHttpException.php:69
- absent `anExceptionIDontCatchAnywhere` — ADR placeholder method, not present in this codeVersion
