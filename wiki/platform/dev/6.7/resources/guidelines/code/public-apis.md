---
id: platform/dev/6.7/resources/guidelines/code/public-apis.md
title: Public APIs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/public-apis.html
sourceHash: 0a9dcb0bbdd02aa3c2a5a94e91404ad9dca23374
codeCheckedAgainst: "6.7.13.0"
keywords: ["@internal", "public api", "backward compatibility", "bc promise", "__construct", "CalculatedPrice", "QuantityPriceDefinition", "dto", "data transfer object", "service decoration", "InternalClassRule", "coding guidelines"]
summary: "What counts as Shopware public API: @internal classes and DI service constructors may change anytime; DTO constructors like CalculatedPrice stay BC."
lastBuilt: 2026-09-15
---
## What it is

A Shopware coding guideline defining the backward-compatibility (BC) boundary of PHP code: which classes and constructors are public API and which may change without notice.

## When to use

When deciding whether a Shopware class can be safely decorated, extended or instantiated from a plugin, or when marking your own core code as not intended for third-party use.

## Key steps / config

- Services not intended for decoration or direct use must be marked `@internal`, with a docblock comment explaining why they should not be used or decorated directly.
- Classes marked `@internal` carry no compatibility guarantee for third-party developers; their public API can change at any time.
- `__construct` methods of services instantiated via the DI container are **not** public API and can change at any time.
- `__construct` of Data Transfer Objects that developers instantiate themselves — e.g. `Shopware\Core\Checkout\Cart\Price\Struct\CalculatedPrice`, `Shopware\Core\Checkout\Cart\Price\Struct\QuantityPriceDefinition` — **is** public API and must stay backward compatible.

In the installed core, the PHPStan rule `InternalClassRule` requires `@internal` (or a `reason:becomes-internal` note) on several class kinds so the BC checker ignores them: test classes, Storefront controllers (their BC promise is checked over the route), bundles, migrations, message handlers, and classes in the `DevOps\StaticAnalyze`, `Core\Maintenance` and `Framework\Demodata` namespaces; event subscribers and subclasses of `@internal` abstract classes need `@internal` or `@final`.

## Essential identifiers

- `@internal`, `@final`
- `__construct`
- `CalculatedPrice`, `QuantityPriceDefinition`
- `InternalClassRule`

## Gotchas

- Constructor signatures of DI-instantiated services are outside the BC promise, so code that calls a Shopware service's `__construct` (e.g. `parent::__construct()` in a subclass) can break on any update.
- Storefront controllers are `@internal` as classes; the compatibility promise applies to their routes.

## Code check (6.7.13.0)
- confirmed `CalculatedPrice` — DTO class in Cart price structs — vendor/shopware/core/Checkout/Cart/Price/Struct/CalculatedPrice.php:12
- confirmed `QuantityPriceDefinition` — DTO class in Cart price structs — vendor/shopware/core/Checkout/Cart/Price/Struct/QuantityPriceDefinition.php:20
- confirmed `InternalClassRule` — PHPStan rule enforcing `@internal` for BC-checker exclusion — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Internal/InternalClassRule.php:35
- confirmed `InternalClassRule::isInternal()` — checks docblock for `@internal` or `reason:becomes-internal` — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Internal/InternalClassRule.php:185
- confirmed `@internal` — Storefront controllers must be flagged, BC promise checked over the route — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Internal/InternalClassRule.php:92
- confirmed `@final` — event subscribers need `@internal` or `@final` — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Internal/InternalClassRule.php:108
