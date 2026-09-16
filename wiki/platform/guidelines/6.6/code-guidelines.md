---
id: platform/guidelines/6.6/code-guidelines.md
title: Code guidelines
docType: guideline
version: "6.6"
summary: "Cross-area Shopware 6.6 code rules: domain exceptions, static-analysis-friendly types, Context propagation, no hardcoded IDs, deprecations."
keywords: ["code guidelines", "domain exceptions", "httpexception", "error code", "phpstan", "static analysis", "type narrowing", "assert", "phpdoc", "context", "defaults", "deprecation", "feature flag"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/domain-exceptions.html", hash: "5e8e71b69f4cc607c00d5b4f87877a846290e166138f7b69b816108fd9fd1a68"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/writing-code-for-static-analysis.html", hash: "696de3dd7a78cccdda190b70557743e0a400b27744e84c7f14dbbe8aca876c24"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-02-24-domain-exceptions.html", hash: "3990cfe177e4f85b1adaca91ff2316f06cbd49e3f02b7cb5a7f32461e838e30f"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-15
---
## Index

- [platform/guidelines/6.6/be-code-guidelines.md](platform/guidelines/6.6/be-code-guidelines.md) — read before backend PHP work: decoration/DI, entity definitions, migrations, routes, ACL, bounded Criteria.
- [platform/guidelines/6.6/admin-code-guidelines.md](platform/guidelines/6.6/admin-code-guidelines.md) — read before Administration work: registries and `$super`, modules and ACL, repositories, Twig blocks, Meteor components, Pinia.
- [platform/guidelines/6.6/storefront-code-guidelines.md](platform/guidelines/6.6/storefront-code-guidelines.md) — read before Storefront work: `sw_extends`, Controller -> PageLoader -> Page, JS plugins, cache-safe accessible rendering.

## domain exceptions

- Throw domain-specific exceptions only; never throw a bare `\RuntimeException` or `\InvalidArgumentException` from domain code. Rationale: every failure must carry a unique, traceable error code that reaches API consumers.
- Use one exception factory class per top-level domain (e.g. `Checkout\Cart` -> `CartException`, `Checkout\Customer` -> `CustomerException`, `Content\Product` -> `ProductException`, `Content\Cms` -> `CmsException`), stored directly in that domain's namespace root.
- Extend `Shopware\Core\Framework\HttpException` and create instances through `public static` factory methods, e.g. `CustomerException::customerGroupNotFound(string $id): self`. In 6.6 the `HttpException` constructor is `public`, not private — still create instances only via the factories.
- Declare each error code as a `public const` on the domain class, prefixed with the area and unique within the domain, e.g. `CUSTOMER_GROUP_NOT_FOUND = 'CHECKOUT__CUSTOMER_GROUP_NOT_FOUND'`.
- Pass message placeholders as `{{ name }}` with a parameters array; reuse `self::$couldNotFindMessage` (`Could not find {{ entity }} with {{ field }} "{{ value }}"`) for not-found cases.
- Mark the class with `#[Package('<area>')]` (`Shopware\Core\Framework\Log\Package`).

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

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/domain-exceptions.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-02-24-domain-exceptions.html

## catchable exceptions

- Only when code must `catch` a specific case, add a dedicated subclass of the domain exception in the domain's `Exception\` subfolder (e.g. `Shopware\Core\Checkout\Customer\Exception\CustomerNotFoundException extends CustomerException`), and still return it from a factory on the domain class (`CustomerException::customerNotFound(string $email): CustomerNotFoundException`).
- Do not create a subclass for exceptions nobody catches; a factory method returning `self` is enough.
- To branch on a non-subclassed domain exception, check its code with `HttpException::is(string ...$code)` (e.g. `$e->is(CustomerException::CUSTOMER_GROUP_NOT_FOUND)`) instead of adding a class.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-02-24-domain-exceptions.html

## http status codes

- Give every factory a specific status from `Symfony\Component\HttpFoundation\Response` constants (`Response::HTTP_NOT_FOUND`, `Response::HTTP_BAD_REQUEST`, ...); use `HTTP_INTERNAL_SERVER_ERROR` only for genuine server faults.
- The status is exposed via `getStatusCode()` and the code via `getErrorCode()`; do not override them per factory.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/domain-exceptions.html

## static analysis type narrowing

Narrow mixed/nullable types in this order of preference:

1. Explicit runtime checks — `if ($foo === null)`, `if (!is_string($foo))`, `if (!$foo instanceof Foo)` — and handle the error case (throw a domain exception or return a default). Preferred: mismatches cannot propagate.
2. `assert($foo !== null)` / `assert($foo instanceof Foo)` — only where a mismatch is theoretical; asserts are disabled in production, so they give no runtime safety there.
3. `/** @var Foo $foo */` — last resort; it is ignored at runtime and a wrong annotation hides real mismatches.

- Avoid type casts such as `(string) $foo` unless every possible input is known; PHP juggling (e.g. `null` -> `''`) hides root causes and is invisible to PHPStan.
- In unit tests use PHPUnit asserts (`static::assertNotNull()`, `static::assertIsString()`, `static::assertInstanceOf()`) instead of any of the above.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/writing-code-for-static-analysis.html

## phpdoc annotations

- Write native types (including union and intersection types) in signatures; do not duplicate them in `@param`/`@return`/`@var`.
- Add PHPDoc types only for what the language cannot express: generics, array shapes, and PHPStan types such as `class-string` or integer ranges.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/writing-code-for-static-analysis.html

## context and ids

- Propagate the `Shopware\Core\Framework\Context` (or `SalesChannelContext`) received from the caller through every repository and service call; never create a fresh one mid-request. `Context::createDefaultContext()` is `@internal` — outside tests use the context you were given, or `Context::createCLIContext()` in CLI commands.
- Never hardcode UUIDs of system records; reference `Shopware\Core\Defaults` constants (`Defaults::LANGUAGE_SYSTEM`, `Defaults::LIVE_VERSION`, `Defaults::CURRENCY`, `Defaults::SALES_CHANNEL_TYPE_STOREFRONT`) or resolve IDs via the DAL.

Read more: platform/dev/6.6/concepts/framework/data-abstraction-layer.md

## deprecations in code

- Pair every `@deprecated tag:v6.7.0 - <reason / replacement>` annotation with a runtime notice at the start of the deprecated code path: `Feature::triggerDeprecationOrThrow('v6.7.0.0', $message)` — flag first, message second.
- Build messages with `Feature::deprecatedMethodMessage($class, $method, $majorVersion, $replacement)` or `Feature::deprecatedClassMessage($class, $majorVersion, $replacement)` so they name the element, the removal version and the replacement.

Read more: platform/dev/6.6/resources/references/adr/2022-02-28-consistent-deprecation-notices-in-core.md

## Code check (6.6.10.24+87965325)

- absent `anExceptionIDontCatchAnywhere` — ADR placeholder, not present in this codeVersion
- corrected `private __construct` — code uses a `public` constructor on `HttpException` instead, core/Framework/HttpException.php:12
- confirmed `HttpException` — abstract base of domain exceptions — core/Framework/HttpException.php:8
- confirmed `HttpException::is` — error-code check — core/Framework/HttpException.php:32
- confirmed `CustomerException::customerGroupNotFound` — factory returning self — core/Checkout/Customer/CustomerException.php:65
- confirmed `CUSTOMER_GROUP_NOT_FOUND` — domain error code — core/Checkout/Customer/CustomerException.php:36
- confirmed `CustomerException::customerNotFound` — returns catchable subclass — core/Checkout/Customer/CustomerException.php:205
- confirmed `CustomerNotFoundException` — subclass in Exception folder — core/Checkout/Customer/Exception/CustomerNotFoundException.php:10
- confirmed `Context::createDefaultContext` — marked internal — core/Framework/Context.php:79
- confirmed `Defaults::LANGUAGE_SYSTEM` — system language constant — core/Defaults.php:18
- corrected `Feature::triggerDeprecationOrThrow(message, majorFlag)` — code uses `triggerDeprecationOrThrow(string $majorFlag, string $message)` instead, core/Framework/Feature.php:236
- confirmed `Feature::deprecatedMethodMessage` — message builder — core/Framework/Feature.php:259
