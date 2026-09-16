---
id: platform/func/tutorials-and-faq/rule-builder-example-rules.md
title: Rule Builder Example Rules
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/rule-builder-example-rules
sourceHash: 615bde8c860da078fa00ae2d8d677f897f321adc87892a6f1a3b55be701de588
revision:
  current: true
  range: "6.4.7.0 - 6.4.20.2"
  swMax: "6.4.20.2"
  swMin: "6.4.7.0"
keywords: ["Rule Builder", "availability rule", "position with tag", "custom field", "price matrix by rules", "customer group", "cart amount", "goods price", "shipping method", "payment method", "priority", "AND link"]
summary: "Worked Rule Builder examples for shipping-by-tag, cash on delivery, postal codes, customer-group payment methods, and cart-value discounts."
lastBuilt: 2026-09-15
---

## What it is

Worked examples of using the Rule Builder for shipping, payment method, and promotion scenarios, each defined by a rule Name, Priority, optional Type, and Conditions, then stored as an availability rule on the relevant method.

## When to use

Reference when configuring the Rule Builder to restrict or activate shipping methods, payment methods, or discounts based on tags, custom fields, customer group, or cart value.

## Key steps / config

- **Freight forwarding by tag**: tag the affected products (e.g. "shipping company"), then use condition `Position with tag | All | Is one of | Forwarding`; select the rule as the shipping method's availability rule. To block other shipping methods when such a product is in the cart, add an AND-linked condition `Position with tag | At least one | Is none of | Forwarder` to those methods' rules.
- **Cash on delivery**: requires both a new payment method and a new shipping method (since payment and shipping methods are always both required). Rule condition: `Applied payment method | Is one of | Cash on delivery`; select it as the shipping method's availability rule, and add the COD surcharge to that method's price matrix.
- **Shipping by postal code**: create a shipping type, then a rule with condition `Shipping address: Zip code | Alphanumeric | Is one of | <Postcode>`, set as the shipping type's availability rule.
- **Special shipping for labelled products**: requires a custom field checkbox (e.g. "special dispatch"). Two rules are needed: one deactivating default shipping when any cart item has the checkbox ticked (`Position with custom field | All | <technical name> | is equal to | (checkbox empty)`, set on default shipping) and one activating special shipping when ticked (same condition inverted, Priority higher, e.g. `2`, set on the special shipping method). A further rule per quantity (`Total number of all products | Is equal to | <n>` plus a custom-field filter) drives the **Price matrix by rules** so shipping cost scales with the number of special-shipping items.
- **Payment method by customer group**: condition `Customer group | Is one of | Retailer`, selected as the payment method's availability rule; an additional AND condition (e.g. `Price shopping basket goods | greater than/equal | 250`) can further restrict it.
- **Discount from basket value x**: condition `Cart amount | greater than/equal | 100` (cart value including shipping, minus discounts) or `Goods price | greater than/equal | 100` (sum of product prices only), selected in the discount's **Preconditions** tab.
- **Free shipping above basket amount x**: a Shopping cart rule `Total > Is greater than/equal to > <amount>` (e.g. 50), used in a Marketing > Promotions discount with Apply to: shipping costs, Type: Percentage, Value: 100.

## Essential identifiers

- `Position with tag`
- `Position with custom field`
- `Applied payment method`
- `Customer group`
- `Cart amount` / `Goods price`
- `Price matrix by rules`

## Gotchas

Clear the cache after making fundamental configuration changes like custom fields or new rules before testing the storefront behavior. When stacking multiple discounts by cart value, set "Do not combine with" and prioritize correctly so the intended discount wins.

## Version notes

This revision applies to Shopware 6.4.7.0 - 6.4.20.2.
