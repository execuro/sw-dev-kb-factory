---
id: platform/dev/6.6/resources/references/core-reference/rules-reference.md
sourceHash: 8431df128b64ace4f618a450b2b3d1018ec424fa
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/core-reference/rules-reference.html
title: Rules Reference
version: "6.6"
versions: ["6.6"]
docType: developer
keywords: ["rules reference", "rule classes", "AlwaysValidRule", "CartAmountRule", "LineItemRule", "AndRule", "OrRule", "CurrencyRule", "PaymentMethodRule", "ShippingMethodRule", "rule builder", "conditions", "B2B rules"]
summary: "Catalogue of every built-in Shopware 6 rule condition class, grouped by Checkout, Framework, System, and B2B, with a one-line description each."
lastBuilt: 2026-09-15
---
## What it is

A reference table listing all rule classes shipped with Shopware 6, grouped into four areas: Checkout, Framework, System, and B2B. Each row gives the fully qualified class name and a short description of what it matches.

## When to use

Consult this page when configuring or building a rule (e.g. for prices, promotions, shipping, or payment availability) and needing to know which built-in condition class matches a given cart, customer, or context property.

## Essential identifiers

Checkout rules (namespace `Shopware\Core\Checkout\Cart\Rule` and `Shopware\Core\Checkout\Customer\Rule`):
- `AlwaysValidRule` — matches always
- `CartAmountRule` — matches the cart's total price
- `GoodsPriceRule`, `GoodsCountRule` — matches cart goods price/count
- `LineItemRule`, `LineItemTagRule`, `LineItemGroupRule`, `LineItemInCategoryRule` — match line item identifiers, tags, groups, categories
- `PaymentMethodRule`, `ShippingMethodRule` — match the selected payment/shipping method
- `CustomerGroupRule`, `CustomerNumberRule`, `CustomerTagRule`, `IsCompanyRule`, `IsNewCustomerRule`, `OrderCountRule`, `DaysSinceLastOrderRule` — match customer attributes
- `BillingCountryRule`, `BillingStreetRule`, `BillingZipCodeRule`, `ShippingCountryRule`, `ShippingStreetRule`, `ShippingZipCodeRule` — match address fields

Framework rules (`Shopware\Core\Framework\Rule`):
- `Container\AndRule`, `Container\OrRule`, `Container\NotRule`, `Container\XorRule` — logical composition of other rules
- `DateRangeRule`, `TimeRangeRule`, `WeekdayRule` — match against the current date/time
- `SalesChannelRule` — matches the active sales channel

System rules (`Shopware\Core\System\Currency\Rule`):
- `CurrencyRule` — matches the current currency

B2B rules (Employee Management component, no namespace given in the source): `EmployeeOrderRule`, `EmployeeOfBusinessPartnerRule`, `EmployeeRoleRule`, `EmployeeStatusRule`, `IsEmployeeRule`.
