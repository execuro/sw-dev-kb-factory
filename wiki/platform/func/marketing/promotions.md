---
id: platform/func/marketing/promotions.md
title: Promotions
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/marketing/promotions"
sourceHash: "82c76fcb0856c4a34b3c2248869a3c34307c7b58855a07b7e8c905bf429b3237"
revision:
  current: true
  range: "6.6.0.0 - 6.6.10.15"
  swMin: "6.6.0.0"
  swMax: "6.6.10.15"
keywords: ["promotions", "Discounts & Promotions", "voucher", "promotion code", "rule builder", "shopping cart rules", "customer rules", "order rules", "product sets", "set group", "discount type", "maximum discount value", "individual promotion codes"]
summary: "Documents the merchant Promotions module: general settings, conditions via the Rule Builder, discounts, and voucher-code redemption."
lastBuilt: "2026-09-15"
---
## What it is

The **Promotions** module (menu **Marketing > Promotions**) lets a merchant create discount actions for sales channels, restrict them with rules, and limit them to a time frame.

## When to use

When setting up a discount campaign — a storewide sale, a minimum-order-value discount, a "3 for 2" bundle, or a code-based voucher — that customers redeem in the storefront shopping cart.

## Key steps / config

Creating a promotion (button **Create action**) unlocks two further tabs after the first save:

- **General**: `Name`, `Priority` (higher priority applies first when several rules match), `Valid from`/`Valid until`, `Max. total uses`, `Max. uses per customer`, `Active`.
- **Promotion codes**: choose "No promotional code required", a single **Fixed promotion code** (or a system-generated random one), or **Individual promotion codes** generated per order (via **generate codes** / **add codes**). Individual codes are single-use. Custom code patterns use `%s` for a random letter (A-Z) and `%d` for a random digit (0-9), e.g. `SW-%s%d%s%d%s-TEST`.
- **Conditions**: sales channel restriction, "Prevent combination with other promotions", "Do not combine with" (explicit exclusion list), and rule-based conditions built with the Rule Builder for **customer rules**, **shopping cart rules**, **order rules**, and **product sets** (a set group is defined by Mode — Number/Value(Gross)/Value(Net) —, Value, Sorting, and Product rules). If several rules of the same type are selected, only one needs to match.
- **Discounts**: `Apply to` (entire cart, shipping costs, entire product set, or a specific set group), optionally restricted with `Apply to specific range of products only` (adds Product rules / Apply to / Sort by), a discount `Type` (absolute, percentage, or fixed price/unit price), a `Value`, and an optional `Maximum discount value` for percentage discounts.

Storefront redemption: customers enter the code in the **Enter voucher code** field of the OffCanvas or full shopping cart and confirm with the tick button; the applied discount then appears in the article overview.

## Essential identifiers

- Menu path `Marketing > Promotions`
- Tabs: General, Conditions, Discounts
- Rule scopes: customer rules, shopping cart rules, order rules, product sets/set groups
- Discount `Type` values: absolute, percentage, fixed price, fixed unit price
- Code pattern placeholders: `%s`, `%d`

## Gotchas

- Only one individual code from a promotion can be redeemed per order at a time.
- Regenerating promotion codes invalidates the previously generated codes.
- Discount settings cannot be changed once the promotion has been used in an order.
- Excluding products via a shopping-cart-rule condition (instead of a discount product rule) blocks the whole promotion whenever an excluded product is present in the cart, rather than merely excluding that product from the discount.

## Version notes

Redeemed individual and fixed promotion codes can be looked up per order from the promotion's **Redeemed** list, or by filtering the order overview on the **promotion code** field.
