---
id: platform/dev/6.7/resources/references/adr/2025-01-29-make-rule-classes-internal.md
title: Make Rule classes internal
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-01-29-make-rule-classes-internal.html
sourceHash: 7597f40553d26fc1d8e5be21fe8365dbf0562204
codeCheckedAgainst: "6.7.13.0"
keywords: ["rule classes", "rule builder", "internal", "@final", "LineItemOfTypeRule", "LineItemProductStatesRule", "PromotionCodeOfTypeRule", "ZipCodeRule", "BillingZipCodeRule", "ShippingZipCodeRule", "custom rule", "extend rule", "adr"]
summary: "ADR: core Rule classes are closed to third-party extension; only zip-code, line-item-type and promotion-code rules stay open. Write new Rule classes."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-01-29, area core/rules): nearly all existing rule classes of the rule system are closed for direct third-party use and extension, so the rule system can evolve faster. RFC: https://github.com/shopware/shopware/discussions/5785

## When to use

Read this before extending or subclassing a core rule class (e.g. for a custom Rule Builder condition), or when a plugin that extends a core rule reports static-analysis or upgrade issues.

## Key steps / config

- Do not extend or modify existing core rule classes; create a new rule class extending `Shopware\Core\Framework\Rule\Rule` instead.
- In the installed code the restriction is expressed per class as a class-level `@final` annotation plus an `@internal` constructor (e.g. `CartAmountRule`, `CustomerGroupRule`), not as a class-level `@internal`.
- Classes that stay open because they rely on configuration third parties are expected to extend:

```
LineItemOfTypeRule
PromotionCodeOfTypeRule
ZipCodeRule
BillingZipCodeRule
ShippingZipCodeRule
```

`ZipCodeRule` (`Shopware\Core\Framework\Rule\Container\ZipCodeRule`) is abstract; `BillingZipCodeRule` and `ShippingZipCodeRule` extend it.

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule` — base class for new rules
- `LineItemOfTypeRule`, `PromotionCodeOfTypeRule`
- `ZipCodeRule`, `BillingZipCodeRule`, `ShippingZipCodeRule`

## Gotchas

- Third-party code that extends core rule classes may need migration; internal rule implementations may change without notice.
- `LineItemProductStatesRule` is listed by the ADR as staying public, but in 6.7.13.0 it is `@deprecated tag:v6.8.0` — use `LineItemProductTypeRule` instead.

## Code check (6.7.13.0)
- corrected `CartAmountRule` — docs: rule classes marked internal; code marks the class `@final` with `@internal` constructor — vendor/shopware/core/Checkout/Cart/Rule/CartAmountRule.php:14
- corrected `CustomerGroupRule` — docs: marked internal; code uses class-level `@final` — vendor/shopware/core/Checkout/Customer/Rule/CustomerGroupRule.php:15
- confirmed `Rule` — abstract base class for rules — vendor/shopware/core/Framework/Rule/Rule.php:10
- confirmed `LineItemOfTypeRule` — no @final/@internal class annotation — vendor/shopware/core/Checkout/Cart/Rule/LineItemOfTypeRule.php:14
- deprecated `LineItemProductStatesRule` — deprecated for v6.8.0 in favour of LineItemProductTypeRule — vendor/shopware/core/Checkout/Cart/Rule/LineItemProductStatesRule.php:16
- confirmed `PromotionCodeOfTypeRule` — no @final/@internal class annotation — vendor/shopware/core/Checkout/Promotion/Rule/PromotionCodeOfTypeRule.php:17
- confirmed `ZipCodeRule` — abstract, extendable container rule — vendor/shopware/core/Framework/Rule/Container/ZipCodeRule.php:13
- confirmed `BillingZipCodeRule` — extends ZipCodeRule — vendor/shopware/core/Checkout/Customer/Rule/BillingZipCodeRule.php:12
- confirmed `ShippingZipCodeRule` — extends ZipCodeRule — vendor/shopware/core/Checkout/Customer/Rule/ShippingZipCodeRule.php:12
