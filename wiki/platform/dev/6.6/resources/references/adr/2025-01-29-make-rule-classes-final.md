---
id: platform/dev/6.6/resources/references/adr/2025-01-29-make-rule-classes-final.md
title: Make Rule classes final
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2025-01-29-make-rule-classes-final.html
sourceHash: b747fd5c9fada3fda6d500b8eef2835317d7e655
keywords: ["Rule", "final class", "LineItemOfTypeRule", "LineItemProductStatesRule", "PromotionCodeOfTypeRule", "ZipCodeRule", "BillingZipCodeRule", "ShippingZipCodeRule", "rule builder", "extension", "rule system"]
summary: "ADR marking nearly all Rule classes final except six configurable exceptions like ZipCodeRule, to simplify the rule system."
lastBuilt: 2026-09-15
---
## What it is

This ADR decides to mark nearly all existing `Rule` classes as `final`, restricting third-party extension of the rule system, because unrestricted extension slowed down improvements and increased complexity.

## When to use

When considering extending a Shopware `Rule` class by subclassing it; check whether it is one of the still-extendable exceptions before doing so, otherwise implement a new rule class instead.

## Key steps / config

Nearly all rule classes are marked `final`, except these, which remain extendable because they rely on configuration reasonably expected to be extended by third parties:

```
LineItemOfTypeRule
LineItemProductStatesRule
PromotionCodeOfTypeRule
ZipCodeRule
BillingZipCodeRule
ShippingZipCodeRule
```

## Essential identifiers

- `LineItemOfTypeRule`
- `LineItemProductStatesRule`
- `PromotionCodeOfTypeRule`
- `ZipCodeRule`
- `BillingZipCodeRule`
- `ShippingZipCodeRule`

## Gotchas

Third-party developers currently extending a now-`final` rule class need to migrate to creating a new rule class instead of extending the existing one.
