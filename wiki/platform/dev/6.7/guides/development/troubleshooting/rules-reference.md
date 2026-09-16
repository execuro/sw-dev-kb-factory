---
id: platform/dev/6.7/guides/development/troubleshooting/rules-reference.md
title: Rules Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/rules-reference.html
sourceHash: 11335ad2f5035890319406a511da6420fabf80e3
codeCheckedAgainst: "6.7.13.0"
keywords: ["rule builder", "rule classes", "conditions", "Shopware\\Core\\Checkout\\Cart\\Rule", "Shopware\\Core\\Checkout\\Customer\\Rule", "Shopware\\Core\\Framework\\Rule\\Container", "AndRule", "OrRule", "LineItemRule", "CartAmountRule", "CurrencyRule", "RULE_NAME", "b2b rules", "availability rules"]
summary: List of Shopware 6 rule builder condition classes (cart, line item, customer, container, date/time, currency, B2B) with what each one matches.
lastBuilt: 2026-09-15
---
## What it is

A reference list of the rule condition classes shipped with Shopware 6, grouped by namespace, each with a one-line description of what it matches. These classes back the Rule Builder conditions used by promotions, shipping/payment availability, flows and similar features.

## When to use

Look here when you need the exact class for a rule condition (e.g. to find its source, its `RULE_NAME` condition type, or to model a custom rule on an existing one), or when debugging why a rule does or does not match.

## Key steps / config

Classes by namespace (short names; full FQCN = namespace + name):

- `Shopware\Core\Checkout\Cart\Rule\` — `AlwaysValidRule` (always matches), `CartAmountRule` (cart total price), `CartHasDeliveryFreeItemRule`, `CartWeightRule`, `GoodsCountRule`, `GoodsPriceRule`, `LineItemClearanceSaleRule`, `LineItemCreationDateRule`, `LineItemCustomFieldRule`, `LineItemDimensionHeightRule`, `LineItemDimensionLengthRule`, `LineItemDimensionWeightRule`, `LineItemDimensionWidthRule`, `LineItemGroupRule`, `LineItemInCategoryRule`, `LineItemIsNewRule`, `LineItemListPriceRule`, `LineItemOfManufacturerRule`, `LineItemOfTypeRule`, `LineItemPromotedRule`, `LineItemPropertyRule`, `LineItemPurchasePriceRule`, `LineItemReleaseDateRule`, `LineItemRule` (matches multiple identifiers to a line item; true if one matches), `LineItemTagRule`, `LineItemTaxationRule`, `LineItemTotalPriceRule`, `LineItemUnitPriceRule`, `LineItemWithQuantityRule`, `LineItemWrapperRule` (internal scope changes), `LineItemsInCartCountRule` (cart line item count), `PaymentMethodRule`, `ShippingMethodRule`.
- `Shopware\Core\Checkout\Customer\Rule\` — `BillingCountryRule`, `BillingStreetRule`, `BillingZipCodeRule`, `CustomerGroupRule`, `CustomerNumberRule`, `CustomerTagRule`, `DaysSinceLastOrderRule`, `DifferentAddressesRule` (active billing address is not the default), `IsCompanyRule`, `DaysSinceFirstLoginRule` (new-customer check), `LastNameRule` (exact match), `OrderCountRule`, `ShippingCountryRule`, `ShippingStreetRule`, `ShippingZipCodeRule`.
- `Shopware\Core\Framework\Rule\Container\` — `AndRule` (all match), `OrRule` (at least one), `XorRule` (exactly one), `NotRule` (negates one rule).
- `Shopware\Core\Framework\Rule\` — `DateRangeRule`, `TimeRangeRule`, `WeekdayRule`, `SalesChannelRule`.
- `Shopware\Core\System\Currency\Rule\CurrencyRule` — currency of the current context.
- B2B (Employee Management component, not in the core packages): `EmployeeOrderRule`, `EmployeeOfBusinessPartnerRule`, `EmployeeRoleRule`, `EmployeeStatusRule`, `IsEmployeeRule`.

Each class extends `Shopware\Core\Framework\Rule\Rule` (containers via `Container`) and exposes its condition type as `RULE_NAME`, e.g. `cartCartAmount`, `cartLineItem`, `andContainer`, `currency`.

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule`, `RULE_NAME`
- `Shopware\Core\Checkout\Cart\Rule\LineItemRule`, `LineItemsInCartCountRule`, `CartAmountRule`
- `Shopware\Core\Checkout\Customer\Rule\DaysSinceFirstLoginRule`
- `Shopware\Core\Framework\Rule\Container\AndRule`, `OrRule`, `XorRule`, `NotRule`
- `Shopware\Core\System\Currency\Rule\CurrencyRule`

## Gotchas

- The source lists `LineItemsInCartCountRule` twice; the second row ("matches multiple identifiers to a cart's line item identifier") describes the old line-items-in-cart rule, which no longer exists — its `cartLineItemsInCart` conditions were migrated to `cartLineItem` (`LineItemRule`).
- The source lists `Shopware\Core\Checkout\Customer\Rule\IsNewCustomerRule`; that class is not in the installed code. Its `customerIsNewCustomer` conditions were migrated to `customerDaysSinceFirstLogin` with `daysPassed: 0`.
- The source list is incomplete: the installed core ships more rule classes than listed (e.g. `CartShippingCostRule`, `LineItemStockRule`, `CustomerLoggedInRule`, `EmailRule`, `ScriptRule`).
- B2B rules live in the commercial B2B Components, not in the core package.

## Code check (6.7.13.0)
- confirmed `RULE_NAME` — base constant on the abstract rule class — vendor/shopware/core/Framework/Rule/Rule.php:12
- confirmed `AlwaysValidRule` — `RULE_NAME = 'alwaysValid'` — vendor/shopware/core/Checkout/Cart/Rule/AlwaysValidRule.php:13
- confirmed `CartAmountRule` — `RULE_NAME = 'cartCartAmount'` — vendor/shopware/core/Checkout/Cart/Rule/CartAmountRule.php:17
- confirmed `LineItemsInCartCountRule` — `RULE_NAME = 'cartLineItemsInCartCount'` — vendor/shopware/core/Checkout/Cart/Rule/LineItemsInCartCountRule.php:16
- corrected `cartLineItemsInCart` — docs: second `LineItemsInCartCountRule` row; old type migrated to `cartLineItem` — vendor/shopware/core/Migration/V6_5/Migration1669291632MigrateLineItemsInCartRule.php:28
- corrected `customerIsNewCustomer` — docs: `IsNewCustomerRule` class; migrated to `customerDaysSinceFirstLogin` — vendor/shopware/core/Migration/V6_6/Migration1673249981MigrateIsNewCustomerRule.php:34
- confirmed `DaysSinceFirstLoginRule` — `RULE_NAME = 'customerDaysSinceFirstLogin'` — vendor/shopware/core/Checkout/Customer/Rule/DaysSinceFirstLoginRule.php:14
- confirmed `AndRule` — `RULE_NAME = 'andContainer'` — vendor/shopware/core/Framework/Rule/Container/AndRule.php:12
- confirmed `CurrencyRule` — `RULE_NAME = 'currency'` — vendor/shopware/core/System/Currency/Rule/CurrencyRule.php:17
- unverified `IsEmployeeRule` — B2B Components package, out of scope
