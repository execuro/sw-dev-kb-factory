---
id: platform/func/tutorials-and-faq/promotions-example.md
title: Promotions Example
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/promotions-example
sourceHash: 733c9058ebbfe55546c54550f81ef27cbef582bdf9785e182820206775d3828f
revision:
  current: true
  range: "6.4.10.0 - 6.4.20.2"
  swMax: "6.4.20.2"
  swMin: "6.4.10.0"
keywords: ["promotions", "discounts", "Marketing > Promotions", "Rule Builder", "promotion code", "Discounts tab", "Conditions tab", "product rules", "set groups", "fixed item price", "free shipping", "VIP customers", "dynamic product group", "rule based conditions"]
summary: "Worked examples for building Shopware promotions: free shipping, percentage/fixed discounts, product sets, bundles, and rule-based targeting."
lastBuilt: 2026-09-15
---

## What it is

Worked examples of creating discount promotions under **Marketing > Promotions**, illustrating common configurations of validity, promotion codes, conditions, and discount types.

## When to use

Reference when configuring a specific kind of promotion in the Admin (e.g. free shipping, percentage discounts, fixed prices on selected items, bundles, or rule-targeted discounts) rather than building from scratch.

## Key steps / config

General workflow for every example: create a promotion under **Marketing > Promotions**, set name/validity/max uses/active, optionally set a **Promotion codes** type (`No promotion code required` or `Fixed promotion code`), choose the sales channel(s) under **Conditions**, then define one or more entries under **Discounts** (`Apply to`, `Type`, `Value`).

Representative examples:
- **Free shipping**: Discounts tab — Apply to: Shipping costs, Type: Percentage, Value: 100, no promotion code required.
- **25% off all items**: Fixed promotion code `2022_25`; Discounts — Apply to: Cart, Type: Percentage, Value: 25.
- **Fixed price for certain items**: a Rule Builder rule (e.g. `Items in cart > At least one > Is one of`) selects eligible items; Discounts — Apply to: Cart, Apply only to selected products: active, Product rules: the created rule, Apply to: All items, Type: Fixed item price, Value: 10.
- **Multiple discounts**: several discount entries combined under one promotion code (e.g. free shipping + 25% off).
- **VIP customers**: a Rule Builder customer rule (`Count of orders is greater than/equal to 100`) applied under **Rule based conditions > Customer Rules**, no promotion code, Discounts — Apply to: Cart, Type: Percentage, Value: 5.
- **Packages** (e.g. buy 3, pay for cheaper unit price): under Conditions, enable **Promote sets of products**, Mode: Quantity, Value: 3, Sorting: Price ascending, Product rules: a rule selecting eligible items; Discounts — Apply to: Set-Group-1, Type: Fixed item price, Value: 10.
- **Bundles**: two set groups (e.g. pants + t-shirt rules) combined; Discounts — Apply to: Entire set, Type: Fixed price, Value: 50.
- **Buy 3 Pay 2**: Promote sets of products, Mode: Set, Value: 3, Sort order: Ascending; Discounts — Apply to: Shopping Cart, Apply to a specific range of products only: active, Apply to: 1. item, Sort by: Price ascending, Type: Percentage, Value: 100.
- **Newsletter recipients**: a customer rule restricts eligibility; Discounts — Apply to: Shopping cart, Type: Percentage, Value: 10, Maximum discount value: 30.
- **Customer group**: a customer rule filters by customer group; Discounts — Apply to: Cart, Type: Percentage, Value e.g. 10.
- **Basket amount threshold**: Shopping cart rule `Total > Is greater than/equal to > <amount>` (e.g. 50); Discounts — Apply to: shipping costs, Type: Percentage, Value: 100.
- **Category or manufacturer discount**: a Rule Builder rule (`Item in category | At least one | is one of | <category>` or `Item with manufacturer | At least one | is one of | <manufacturer>`) is selected as a Shopping cart rule under Conditions.
- **Free article**: the free item gets a `tag` and is deposited as Cross Selling on a dynamic product group of eligible items, created under **Catalogues > Dynamic product groups**; the Discounts tab then applies the free-item configuration.
- **Discount on one target item**: a rule (`Item | At least one | is one of | <item>`) is used as a Product rule under Discounts, Apply to: Cart, Type: Percentage.

## Essential identifiers

- Marketing > Promotions
- Settings > Rule Builder
- Discounts tab fields: `Apply to`, `Type`, `Value`, `Product rules`, `Maximum discount value`
- Conditions tab: `Promote sets of products`, `Rule based conditions`

## Gotchas

When several discounts apply to overlapping conditions, set "Do not combine with" appropriately and give the highest discount the highest priority to control which one wins.

## Version notes

This revision of the article applies to Shopware 6.4.10.0 - 6.4.20.2.
