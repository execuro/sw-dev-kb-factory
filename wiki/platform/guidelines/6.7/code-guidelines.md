---
id: platform/guidelines/6.7/code-guidelines.md
title: Code guidelines
docType: guideline
version: "6.7"
summary: Cross-cutting Shopware 6.7 code rules - domain exception factories, error codes, and type-safe PHP written for PHPStan.
keywords: ["domain exceptions", "httpexception", "error codes", "exception factory", "phpstan", "static analysis", "assert", "type narrowing", "phpdoc", "list type", "package attribute", "code guidelines"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/domain-exceptions.html", hash: "d9f1765a1129360bb8882959a0c9d5a741f71a92cff97de022d2e894d3d34a5b"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/core/writing-code-for-static-analysis.html", hash: "267d5bc6c5be5461a5f91a900abd7f4d0c0178907cd3ae8e9971258d46eb48af"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2022-02-24-domain-exceptions.html", hash: "4134ac518f013cacd1e20faeeffde45bb6b55eeb555abfe410fa510bb1ba5a5d"}]
codeVersion: "6.7.15.1+7d4303db"
lastBuilt: 2026-10-21
---

## Index

- [platform/guidelines/6.7/be-code-guidelines.md](platform/guidelines/6.7/be-code-guidelines.md) — read before backend PHP work: decoration/DI (`AbstractX`, `getDecorated()`), entity definitions and flags, migrations, routes, route scope, ACL, bounded Criteria.
- [platform/guidelines/6.7/admin-code-guidelines.md](platform/guidelines/6.7/admin-code-guidelines.md) — read before Administration work: registries and `$super`, module structure and ACL, repository/Criteria, Twig blocks, Meteor components and Pinia.
- [platform/guidelines/6.7/storefront-code-guidelines.md](platform/guidelines/6.7/storefront-code-guidelines.md) — read before Storefront work: Controller to PageLoader to Page, route defaults and HTTP cache, JS plugin system, styling, assets, snippets, cache-safe and accessible rendering.

## domain exceptions

- Throw domain exceptions, never a bare `\RuntimeException` or `\InvalidArgumentException`. Every error must carry its own traceable error code that is passed to API consumers.
- Create one exception class per top-level domain (e.g. `Checkout\Cart`, `Checkout\Customer`, `Content\Category`, `Content\Product`) and store it directly in that domain's namespace, named `<Domain>Exception` (e.g. `Shopware\Core\Checkout\Customer\CustomerException`).
- Extend `Shopware\Core\Framework\HttpException`. Its constructor takes `(int $statusCode, string $errorCode, string $message, array $parameters = [], ?\Throwable $previous = null)`.
- Use the class as a factory: add one `public static function` per error case that returns the exception, and call sites throw the factory result: `throw CustomerException::customerGroupNotFound($id);`. Do not call `new` on the exception from outside the class.
- The 6.7 code does not make the constructor private: `HttpException::__construct` is `public`. Enforce factory-only creation by review, not by visibility.
- Declare each error code as a `public const` on the domain exception, unique within the domain, prefixed with the area and domain, e.g. `CUSTOMER_GROUP_NOT_FOUND = 'CHECKOUT__CUSTOMER_GROUP_NOT_FOUND'`.
- Use message placeholders with a parameters array (`'... "{{ id }}" ...'`, `['id' => $id]`) instead of string interpolation. For "not found" cases, core reuses the inherited `self::$couldNotFindMessage` with `entity`/`field`/`value` parameters.
- Return a specific HTTP status per exception type via `Symfony\Component\HttpFoundation\Response::HTTP_*` constants (e.g. `HTTP_BAD_REQUEST`, `HTTP_NOT_FOUND`).
- Tag the class with the `#[Package('<area>')]` attribute (`Shopware\Core\Framework\Log\Package`) like every core class.
- Test an error code with `HttpException::is(string ...$code)` rather than comparing messages.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/domain-exceptions.html
Read more: https://developer.shopware.com/docs/resources/references/adr/2022-02-24-domain-exceptions.html

## catchable exceptions

- Domain exceptions are not meant to be caught. When code needs to catch a specific case in a `try`/`catch`, create a dedicated subclass of the domain exception in the domain's `Exception` subfolder, and return it from the factory method.
- Pattern in core: `Shopware\Core\Checkout\Customer\Exception\CustomerNotFoundException extends CustomerException`, returned by `CustomerException::customerNotFound(string $email): CustomerNotFoundException`. Declare the narrowed return type on the factory so callers and PHPStan see the concrete class.
- Catch the subclass (`catch (CustomerNotFoundException $e)`), never the generic domain exception, unless you deliberately handle every error of that domain.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/domain-exceptions.html

## type narrowing for static analysis

Write code PHPStan can follow: use native types everywhere, and narrow `Foo|null`, `mixed` or `object` values with the first option that fits.

1. Explicit runtime checks, preferred in production code: `if ($foo === null)`, `if (!\is_string($foo))`, `if (!$foo instanceof Foo)`, then handle the error case (throw a domain exception, return a default).
2. In unit tests, use PHPUnit asserts: `static::assertNotNull()`, `static::assertIsString()`, `static::assertInstanceOf()`. Tests should not need the options below.
3. `assert($foo !== null)` / `assert($foo instanceof Foo)` when the mismatch is theoretical only. Asserts are typically disabled in production, so they give no runtime safety there; on failure they throw `AssertionError`.
4. `/** @var Foo $foo */` only as a last resort. It is ignored at runtime and a wrong annotation hides real type errors.

- Avoid type casts such as `(string) $foo` unless every possible input and its cast result are known. PHP's juggling (e.g. `null` to `''`) hides the root cause and static analysis cannot detect it.

Enforced by: PHPStan

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/writing-code-for-static-analysis.html

## phpdoc annotations

- Write `@var`, `@param` and `@return` only for what the language cannot express: generics, array shapes, and PHPStan-specific types (`class-string`, integer ranges).
- Use native union and intersection types, never a PHPDoc-only union.
- For sequential value collections without semantic keys, annotate `list<T>` instead of `array<T>`, e.g. `@return list<string>` on a method returning `array`.
- After `array_merge(...)`, `array_unique(...)` or similar, re-normalize with `array_values(...)` so the value really is a `list`.

Enforced by: PHPStan

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/writing-code-for-static-analysis.html

## Code check (6.7.15.1+7d4303db)

- confirmed `HttpException` — abstract base for domain exceptions, extends `ShopwareHttpException` — core/Framework/HttpException.php:8
- corrected `private __construct` — code uses `public function __construct` instead, core/Framework/HttpException.php:12
- confirmed `HttpException::is` — matches the exception's error code against given codes — core/Framework/HttpException.php:32
- confirmed `CustomerException::CUSTOMER_GROUP_NOT_FOUND` — value `CHECKOUT__CUSTOMER_GROUP_NOT_FOUND` — core/Checkout/Customer/CustomerException.php:42
- confirmed `CustomerException::customerGroupNotFound` — static factory using `self::$couldNotFindMessage` — core/Checkout/Customer/CustomerException.php:88
- confirmed `CustomerException::customerNotFound` — returns the catchable subclass — core/Checkout/Customer/CustomerException.php:233
- confirmed `CustomerNotFoundException` — extends `CustomerException` in the `Exception` subfolder — core/Checkout/Customer/Exception/CustomerNotFoundException.php:13
- confirmed `Package` — class attribute used on core classes — core/Framework/Log/Package.php:16
- absent `anExceptionIDontCatchAnywhere` — ADR illustration only, not present in this codeVersion
