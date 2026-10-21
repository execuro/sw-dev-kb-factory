---
id: platform/dev/6.7/resources/references/adr/2025-01-29-make-rule-classes-internal.md
title: Make Rule classes internal
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-01-29-make-rule-classes-internal.html
sourceHash: 7597f40553d26fc1d8e5be21fe8365dbf0562204
codeCheckedAgainst: "6.7.15.1"
keywords: ["rule classes", "rule builder", "internal", "@final", "LineItemOfTypeRule", "PromotionCodeOfTypeRule", "ZipCodeRule", "BillingZipCodeRule", "ShippingZipCodeRule", "LineItemProductStatesRule", "custom rule", "extend rule", "adr"]
summary: "ADR: core Rule classes are closed to third-party extension (@final in 6.7); a few config-driven rules stay open. Write a new Rule instead."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2025-01-29, area core) that closes the existing rule classes of the rule system to direct third-party use and extension. The rule system is described as flexible but complex; unrestricted extension of rule classes slows down improvements. The RFC is linked as https://github.com/shopware/shopware/discussions/5785.

## When to use

- Your plugin extends (subclasses) or directly instantiates a core rule class such as a customer or cart rule.
- You plan a custom rule condition and want to know whether to build on an existing class or create a new one.

## Key steps / config

- Do not modify or subclass existing rule classes; create a new rule class (extending the base `Rule`) for your own condition.
- Nearly all rule classes are closed. The ADR keeps these open because they rely on configuration that third parties are expected to extend:

```
LineItemOfTypeRule
PromotionCodeOfTypeRule
ZipCodeRule
BillingZipCodeRule
ShippingZipCodeRule
```

(The ADR's list contains one more class; see Gotchas.)

- How the installed 6.7 code implements "internal": the closed classes carry a class docblock `@final` (e.g. `Shopware\Core\Checkout\Customer\Rule\IsActiveRule`, `CustomerGroupRule`, `LineItemProductTypeRule`) and their constructors are marked `@internal`. The exception classes have no `@final` marker; `ZipCodeRule` is an `abstract class` in `Shopware\Core\Framework\Rule\Container`, with `BillingZipCodeRule` and `ShippingZipCodeRule` (in `Shopware\Core\Checkout\Customer\Rule`) extending it. Their constructors are also `@internal`, so instantiate rules through the rule system rather than calling constructors yourself.

## Essential identifiers

- `LineItemOfTypeRule`, `PromotionCodeOfTypeRule` — open exceptions
- `ZipCodeRule`, `BillingZipCodeRule`, `ShippingZipCodeRule` — open zip code rule hierarchy
- `@final` — class marker used on closed rule classes in 6.7

## Gotchas

- Consequences named by the ADR: faster evolution of the rule system, clearer extension mechanisms, potential migration effort for plugins currently extending rule classes, and internal rule implementations may change.
- The ADR also lists `LineItemProductStatesRule` as staying public, but in 6.7 that class is `@deprecated tag:v6.8.0` with the hint to use `LineItemProductTypeRule` instead; do not build on it.
- Docs say "internal"; the installed code uses `@final` on the class, not `@internal`, so static analysis reports subclassing rather than all usage.

## Code check (6.7.15.1)
- corrected `IsActiveRule` — docs: rule classes marked internal; code marks the class `@final` — vendor/shopware/core/Checkout/Customer/Rule/IsActiveRule.php:13
- confirmed `IsActiveRule::__construct()` — constructor marked `@internal` — vendor/shopware/core/Checkout/Customer/Rule/IsActiveRule.php:23
- confirmed `CustomerGroupRule` — closed rule class with `@final` docblock — vendor/shopware/core/Checkout/Customer/Rule/CustomerGroupRule.php:18
- confirmed `LineItemOfTypeRule` — no `@final` marker, stays open — vendor/shopware/core/Checkout/Cart/Rule/LineItemOfTypeRule.php:14
- confirmed `PromotionCodeOfTypeRule` — no `@final` marker, stays open — vendor/shopware/core/Checkout/Promotion/Rule/PromotionCodeOfTypeRule.php:17
- confirmed `ZipCodeRule` — abstract base of the zip code rules — vendor/shopware/core/Framework/Rule/Container/ZipCodeRule.php:13
- confirmed `BillingZipCodeRule` — extends ZipCodeRule, no `@final` — vendor/shopware/core/Checkout/Customer/Rule/BillingZipCodeRule.php:12
- confirmed `ShippingZipCodeRule` — extends ZipCodeRule, no `@final` — vendor/shopware/core/Checkout/Customer/Rule/ShippingZipCodeRule.php:12
- deprecated `LineItemProductStatesRule` — deprecated for v6.8.0, use LineItemProductTypeRule — vendor/shopware/core/Checkout/Cart/Rule/LineItemProductStatesRule.php:16
- confirmed `LineItemProductTypeRule` — replacement rule class, marked `@final` — vendor/shopware/core/Checkout/Cart/Rule/LineItemProductTypeRule.php:19
