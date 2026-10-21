---
id: platform/dev/6.7/resources/guidelines/code/public-apis.md
title: Public APIs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/public-apis.html
sourceHash: 0a9dcb0bbdd02aa3c2a5a94e91404ad9dca23374
codeCheckedAgainst: "6.7.15.1"
keywords: ["public api", "@internal", "backward compatibility", "bc promise", "__construct", "CalculatedPrice", "QuantityPriceDefinition", "dto", "data transfer object", "decoration", "InternalClassRule", "bc checker"]
summary: Which Shopware code is public API - @internal classes and DI-service constructors may change anytime; DTO constructors like CalculatedPrice stay BC.
lastBuilt: 2026-10-21
---
## What it is

A coding guideline defining what counts as Shopware's public API, i.e. what must stay backward compatible for third-party developers, and how code opts out of that promise with the `@internal` docblock tag.

## When to use

When writing or reviewing platform code and deciding whether a class, service or constructor may change without a deprecation cycle; or, as an extension developer, when judging whether it is safe to decorate, extend or instantiate a Shopware class.

## Key steps / config

1. Services that are not meant to be decorated or used directly get `@internal` in their class docblock, plus a comment explaining why they should not be used or decorated.
2. Anything marked `@internal` carries no compatibility promise for third parties; its public surface can change at any time.
3. `__construct` of services instantiated by the DI container is not public API and may change at any time — do not instantiate such services yourself; get them from the container.
4. `__construct` of Data Transfer Objects that developers instantiate themselves (e.g. `CalculatedPrice`, `QuantityPriceDefinition`) is public API and must stay backward compatible.

The installed PHPStan rule `InternalClassRule` additionally requires `@internal` (or `@final` where noted) on certain class kinds so the BC checker skips them: test classes, Storefront controllers (their BC promise is the route), bundles, non-final event subscribers, migrations, message handlers, classes in `DevOps\StaticAnalyze`/`Core\Maintenance`, and most of `Framework\Demodata`.

## Essential identifiers

- `@internal` docblock tag
- `__construct`
- `Shopware\Core\Checkout\Cart\Price\Struct\CalculatedPrice`
- `Shopware\Core\Checkout\Cart\Price\Struct\QuantityPriceDefinition`
- `Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\Internal\InternalClassRule`

## Gotchas

- A class can also be treated as internal without the docblock tag when it carries the `BecomesInternal` BC-change marker; `InternalClassRule::isInternal()` accepts either.
- Classes extending an `@internal` abstract class must themselves be `@internal` or `@final`.

## Code check (6.7.15.1)
- confirmed `InternalClassRule::isInternal()` — checks docblock for `@internal` or a `BecomesInternal` marker — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Internal/InternalClassRule.php:190
- confirmed `InternalClassRule` — enforces `@internal` on tests, Storefront controllers, bundles, subscribers, migrations, handlers — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Internal/InternalClassRule.php:38
- confirmed `Storefront controllers must be flagged @internal` — BC promise is checked over the route — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Internal/InternalClassRule.php:95
- confirmed `Classes that extend an @internal abstract class` — must be @internal or @final — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Internal/InternalClassRule.php:151
- confirmed `CalculatedPrice::__construct()` — public constructor on the DTO — vendor/shopware/core/Checkout/Cart/Price/Struct/CalculatedPrice.php:14
- confirmed `QuantityPriceDefinition::__construct()` — public constructor on the DTO — vendor/shopware/core/Checkout/Cart/Price/Struct/QuantityPriceDefinition.php:33
