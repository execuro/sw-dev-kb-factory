---
id: platform/dev/6.7/guides/development/troubleshooting/rules-reference.md
title: Rules Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/rules-reference.html
sourceHash: 11335ad2f5035890319406a511da6420fabf80e3
codeCheckedAgainst: "6.7.15.1"
keywords: ["rule builder", "rule conditions", "rule classes", "Shopware\\Core\\Checkout\\Cart\\Rule", "Shopware\\Core\\Checkout\\Customer\\Rule", "CartAmountRule", "LineItemRule", "AndRule", "OrRule", "CurrencyRule", "DaysSinceFirstLoginRule", "RULE_NAME", "b2b rules"]
summary: List of core rule condition classes (cart, line item, customer, container, date/time, currency) and B2B employee rules, with what each one matches.
lastBuilt: 2026-10-21
---
## What it is

A catalogue of the rule condition classes that ship with Shopware 6 (used by the Rule Builder for prices, shipping, payment, promotions and flows), grouped by namespace, plus the B2B Employee Management rules.

## When to use

When you need the exact class of a built-in condition — to reuse it in code, to decorate or extend it, or to check whether a condition already exists before writing a custom rule.

## Key steps / config

### `Shopware\Core\Checkout\Cart\Rule`

- `AlwaysValidRule` — always matches
- Cart totals: `CartAmountRule` (total price), `GoodsPriceRule` (goods price), `GoodsCountRule` (goods count), `CartWeightRule` (total weight), `CartHasDeliveryFreeItemRule` (has a free-delivery item), `LineItemsInCartCountRule` (line item count)
- Line item attributes: `LineItemRule` (one of several identifiers matches), `LineItemOfTypeRule`, `LineItemTagRule`, `LineItemPropertyRule`, `LineItemCustomFieldRule`, `LineItemGroupRule`, `LineItemInCategoryRule`, `LineItemOfManufacturerRule`, `LineItemTaxationRule`, `LineItemIsNewRule`, `LineItemPromotedRule`, `LineItemClearanceSaleRule`, `LineItemCreationDateRule`, `LineItemReleaseDateRule`
- Line item dimensions: `LineItemDimensionHeightRule`, `LineItemDimensionLengthRule`, `LineItemDimensionWeightRule`, `LineItemDimensionWidthRule`
- Line item prices/quantity: `LineItemUnitPriceRule`, `LineItemTotalPriceRule`, `LineItemListPriceRule`, `LineItemPurchasePriceRule`, `LineItemWithQuantityRule`
- `LineItemWrapperRule` — internal scope changes
- `PaymentMethodRule`, `ShippingMethodRule` — specific method in use

### `Shopware\Core\Checkout\Customer\Rule`

- Billing address: `BillingCountryRule`, `BillingStreetRule`, `BillingZipCodeRule`
- Shipping address: `ShippingCountryRule`, `ShippingStreetRule`, `ShippingZipCodeRule`
- Customer: `CustomerGroupRule`, `CustomerNumberRule`, `CustomerTagRule`, `LastNameRule` (exact match), `IsCompanyRule`, `DifferentAddressesRule` (active billing address is not the default)
- Orders: `OrderCountRule`, `DaysSinceLastOrderRule`
- New customer: `DaysSinceFirstLoginRule` (rule name `customerDaysSinceFirstLogin`, compares days since `firstLogin`)

### `Shopware\Core\Framework\Rule`

- Containers (`...\Rule\Container`): `AndRule` (all match), `OrRule` (at least one), `XorRule` (exactly one), `NotRule` (negates one rule)
- `DateRangeRule`, `TimeRangeRule`, `WeekdayRule` — compare to now
- `SalesChannelRule` — current sales channel

### `Shopware\Core\System\Currency\Rule`

- `CurrencyRule` — current context currency

### B2B (Employee Management)

`EmployeeOrderRule`, `EmployeeOfBusinessPartnerRule`, `EmployeeRoleRule`, `EmployeeStatusRule`, `IsEmployeeRule`.

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule` — base class; subclasses implement `match(RuleScope $scope): bool` and `getConstraints(): array`, and set `RULE_NAME`
- `Shopware\Core\Checkout\Cart\Rule\CartAmountRule`, `Shopware\Core\Checkout\Cart\Rule\LineItemRule`
- `Shopware\Core\Framework\Rule\Container\AndRule`, `Shopware\Core\Framework\Rule\Container\OrRule`
- `Shopware\Core\System\Currency\Rule\CurrencyRule`

## Gotchas

- The source lists `Shopware\Core\Checkout\Customer\Rule\IsNewCustomerRule`; it no longer exists. A 6.6 migration rewrites `customerIsNewCustomer` conditions to `customerDaysSinceFirstLogin` with `daysPassed: 0`.
- The source lists `LineItemsInCartCountRule` twice; the second row ("matches multiple identifiers to a cart's line item identifier") has no separate class in 6.7.
- The installed code has many more conditions than this page lists (e.g. `CartVolumeRule`, `CartShippingCostRule`, `LineItemStockRule`, `EmailRule`, `CustomerLoggedInRule`, `IsGuestCustomerRule`, `OrderTotalAmountRule`).
- B2B rules live in the B2B Components, not in core.

## Code check (6.7.15.1)
- absent `IsNewCustomerRule` — class removed; only the migration class name references it
- confirmed `Migration1673249981MigrateIsNewCustomerRule` — rewrites `customerIsNewCustomer` to `customerDaysSinceFirstLogin` — vendor/shopware/core/Migration/V6_6/Migration1673249981MigrateIsNewCustomerRule.php:14
- confirmed `DaysSinceFirstLoginRule::RULE_NAME` — `customerDaysSinceFirstLogin` — vendor/shopware/core/Checkout/Customer/Rule/DaysSinceFirstLoginRule.php:16
- confirmed `Rule::match()` — abstract — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `CartAmountRule::RULE_NAME` — `cartCartAmount` — vendor/shopware/core/Checkout/Cart/Rule/CartAmountRule.php:19
- confirmed `LineItemsInCartCountRule::RULE_NAME` — `cartLineItemsInCartCount`, single class — vendor/shopware/core/Checkout/Cart/Rule/LineItemsInCartCountRule.php:18
- confirmed `AndRule::RULE_NAME` — `andContainer` — vendor/shopware/core/Framework/Rule/Container/AndRule.php:14
- confirmed `CurrencyRule::RULE_NAME` — `currency` — vendor/shopware/core/System/Currency/Rule/CurrencyRule.php:19
- unverified `EmployeeOrderRule` — B2B Components, outside the checked packages
