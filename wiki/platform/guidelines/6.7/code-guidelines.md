---
id: platform/guidelines/6.7/code-guidelines.md
title: Code guidelines
docType: guideline
version: "6.7"
summary: "Cross-area code rules: domain exceptions with unique error codes, static-analysis-friendly typing, and deprecation annotations with runtime notices."
keywords: ["domain exception", "httpexception", "error code", "http status", "phpstan", "static analysis", "assert", "type narrowing", "phpdoc", "list type", "deprecation", "feature flag"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/domain-exceptions.html", hash: "d9f1765a1129360bb8882959a0c9d5a741f71a92cff97de022d2e894d3d34a5b"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/core/writing-code-for-static-analysis.html", hash: "267d5bc6c5be5461a5f91a900abd7f4d0c0178907cd3ae8e9971258d46eb48af"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2022-02-24-domain-exceptions.html", hash: "4134ac518f013cacd1e20faeeffde45bb6b55eeb555abfe410fa510bb1ba5a5d"}]
codeVersion: "6.7.13.0+8da531fe"
lastBuilt: 2026-09-15
---

## Index

- [platform/guidelines/6.7/be-code-guidelines.md](platform/guidelines/6.7/be-code-guidelines.md) — read before backend PHP work: decoration/DI, entity definitions, migrations, routes, ACL, bounded Criteria.
- [platform/guidelines/6.7/admin-code-guidelines.md](platform/guidelines/6.7/admin-code-guidelines.md) — read before Administration work: registries, modules and ACL, repository/Criteria, Twig blocks, Meteor components, Pinia.
- [platform/guidelines/6.7/storefront-code-guidelines.md](platform/guidelines/6.7/storefront-code-guidelines.md) — read before Storefront work: `sw_extends`, Controller -> PageLoader -> Page, JS plugins, cache-safe and accessible rendering.

## domain exceptions

- Create one exception factory class per top-level domain (e.g. `Checkout\Cart`, `Checkout\Customer`, `Content\Category`, `Content\Product`), stored directly in that domain's namespace root, named `<Domain>Exception`.
- Extend `Shopware\Core\Framework\HttpException` (abstract; constructor takes `int $statusCode, string $errorCode, string $message, array $parameters = [], ?\Throwable $previous = null`).
- Expose every error as a `public static function` factory returning the exception; throw via the factory (`throw CustomerException::customerGroupNotFound($id)`), never `new \RuntimeException(...)` or a generic `\InvalidArgumentException`.
- Pass dynamic values as `{{ placeholder }}` parameters in the message plus the `$parameters` array, not by string concatenation.
- Rationale: every failure gets a traceable code that is passed to API consumers; fewer exception classes nobody reacts to.

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

Enforced by: review
Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/domain-exceptions.html
Read more: https://developer.shopware.com/docs/resources/references/adr/2022-02-24-domain-exceptions.html

## catchable exceptions

- Do not add a dedicated class for an error that nothing catches; the factory method returning `self` is enough.
- When code must `try`/`catch` a specific case, add a subclass of the domain exception under the domain's `Exception` sub-namespace (e.g. `Shopware\Core\Checkout\Customer\Exception\CustomerNotFoundException extends CustomerException`) and let the domain factory return it (`CustomerException::customerNotFound()` returns `CustomerNotFoundException`).
- Catch the subclass, not the domain class, so unrelated errors from the same domain are not swallowed.
- To branch on a caught `HttpException` without a subclass, compare its code with `$e->is(CustomerException::CUSTOMER_GROUP_NOT_FOUND)` or `getErrorCode()`.

Read more: https://developer.shopware.com/docs/resources/references/adr/2022-02-24-domain-exceptions.html
Read more: platform/dev/6.7/resources/guidelines/code/core/domain-exceptions.md

## error codes and http status

- Declare each error code as a `public const` on the domain exception; keep codes unique within the domain.
- Prefix code values with the area and domain in upper snake case, as core does (`CHECKOUT__CUSTOMER_GROUP_NOT_FOUND`); in a plugin use your own unique prefix.
- Give each exception a specific HTTP status via `Symfony\Component\HttpFoundation\Response` constants (`Response::HTTP_NOT_FOUND`, `Response::HTTP_BAD_REQUEST`, ...), not a blanket 500.
- `getStatusCode()` and `getErrorCode()` are what the API error response exposes, so never reuse one code for two different failures.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/domain-exceptions.html
Read more: platform/dev/6.7/resources/references/adr/2022-02-24-domain-exceptions.md

## static analysis type narrowing

Narrow mixed or nullable types in this order of preference (PHPStan must understand the code):

1. Explicit runtime checks: `if ($foo === null)`, `!is_string($foo)`, `!$foo instanceof Foo`, then handle the error case (throw a domain exception, return a default). Preferred in production code.
2. `assert($foo !== null)` / `assert($foo instanceof Foo)` when the mismatch cannot happen in practice. Asserts are usually disabled in production, so they give no runtime guarantee.
3. `/** @var Foo $foo */` only as a last resort; it is ignored at runtime and a wrong annotation hides real type errors.

- Use type casts (`(string) $foo`) only when every possible input is known; casts hide unexpected conversions such as `null` to `''`.
- In unit tests use PHPUnit asserts (`static::assertNotNull()`, `static::assertIsString()`, `static::assertInstanceOf()`) instead of any of the above.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/writing-code-for-static-analysis.html
Read more: platform/dev/6.7/resources/references/adr/2022-05-12-remove-static-analysis-with-psalm.md

## phpdoc type annotations

- Use native types (including union and intersection types) wherever the language supports them; add `@var`/`@param`/`@return` only for what native types cannot express: generics, array shapes, `class-string`, integer ranges and similar PHPStan types.
- Type sequential value collections as `list<T>`, not `array<T>`.
- After `array_merge(...)`, `array_unique(...)` or similar, restore list shape with `array_values(...)` before returning a `list<T>`.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/writing-code-for-static-analysis.html

## deprecation annotations

- Mark deprecated code with `@deprecated tag:v<next-major> - <what to use instead>`, as core does (`@deprecated tag:v6.8.0 - Use MISSING_OPTION instead`).
- Pair every `@deprecated` method or class with a runtime notice: `Feature::triggerDeprecationOrThrow('v6.8.0.0', Feature::deprecatedMethodMessage(self::class, __METHOD__, 'v6.8.0.0', 'NewClass::method()'))`; use `Feature::deprecatedClassMessage()` for classes.
- Write messages that name the deprecated symbol, the removal version and the replacement.
- Expect deprecated code to throw once the major feature flag is active; never call deprecated core code from new code.

Read more: platform/dev/6.7/resources/references/adr/2022-02-28-consistent-deprecation-notices-in-core.md

## Code check (6.7.13.0+8da531fe)

- confirmed `HttpException` — abstract base with public constructor (statusCode, errorCode, message, parameters, previous) — core/Framework/HttpException.php:8
- corrected `private __construct` — code uses a public `HttpException::__construct` instead, core/Framework/HttpException.php:12
- confirmed `HttpException::is()` — compares error codes — core/Framework/HttpException.php:32
- confirmed `CustomerException::CUSTOMER_GROUP_NOT_FOUND` — error code constant — core/Checkout/Customer/CustomerException.php:41
- confirmed `CustomerException::customerGroupNotFound()` — factory returning self — core/Checkout/Customer/CustomerException.php:87
- confirmed `CustomerException::customerNotFound()` — factory returning catchable subclass — core/Checkout/Customer/CustomerException.php:232
- confirmed `CustomerNotFoundException` — extends CustomerException — core/Checkout/Customer/Exception/CustomerNotFoundException.php:13
- confirmed `Feature::triggerDeprecationOrThrow()` — flag first, message second — core/Framework/Feature.php:267
- confirmed `Feature::deprecatedMethodMessage()` — builds method deprecation message — core/Framework/Feature.php:295
- confirmed `Feature::deprecatedClassMessage()` — builds class deprecation message — core/Framework/Feature.php:315
- absent `anExceptionIDontCatchAnywhere` — placeholder name from the ADR example, not present in this codeVersion
