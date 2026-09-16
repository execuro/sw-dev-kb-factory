---
id: platform/dev/6.7/concepts/framework/rule-system/_index.md
title: Rule system
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/rule-system/
sourceHash: 8c77c2154d2e260f464db9026373458e565124bf
codeCheckedAgainst: "6.7.13.0"
keywords: ["rule system", "rule builder", "rules", "conditions", "business rules", "Rule", "RuleDefinition", "availability_rule_id", "promotion rules", "flow builder", "shipping method availability", "payment method availability", "product prices"]
summary: Overview of Shopware's cross-domain rule system (composable conditions evaluated against cart/order/customer) and the Admin Rule Builder that configures it.
lastBuilt: 2026-09-15
---
## What it is

Shopware's generic **rule system** describes business conditions as composable rules, evaluated against a specific context (cart, order, customer). The **Rule Builder** is the Administration feature for configuring and combining rule conditions visually. In code, a rule is stored as a `rule` entity with `rule_condition` records and evaluated as a tree of `Shopware\Core\Framework\Rule\Rule` objects.

## When to use

When business logic must depend on runtime state (cart content, line item quantity, customer) without hard-coding that logic into the cart or other domains — e.g. "if a customer orders a car, a pair of sunglasses is free in the same order". The rule system maps from "`car` is in the cart" to "`sunglasses` are free".

## Key steps / config

Where rules are consumed (cross-domain):

- **Checkout and cart** — availability and behaviour of shipping methods and payment methods (entity field `availability_rule_id`), and product prices (`product_price.rule_id`), based on the current cart and customer.
- **Promotions** — applying or restricting promotions by customer, cart content or other criteria (associations `personaRules`, `orderRules`, `cartRules` on the promotion; `discountRules` on promotion discounts).
- **Flow Builder** — rule conditions controlling flow behaviour (`flow_sequence.rule_id`), based on order, checkout, customer or product context.

The example scenario combines persistent data (products "car" and "sunglasses", stored in the database, independently buyable) with runtime data (the whole cart state, a line item's quantity); the resulting price adjustment of one line item changes the whole cart calculation.

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule`
- `Shopware\Core\Content\Rule\RuleDefinition` (entity `rule`)
- `RuleConditionDefinition` (entity `rule_condition`)
- `availability_rule_id`
- `shopware.rule.definition` (DI tag for rule condition classes)

## Code check (6.7.13.0)
- confirmed `Rule` — abstract base of all rule conditions — vendor/shopware/core/Framework/Rule/Rule.php:10
- confirmed `RuleDefinition::ENTITY_NAME` — entity name `rule` — vendor/shopware/core/Content/Rule/RuleDefinition.php:49
- confirmed `RuleConditionDefinition::ENTITY_NAME` — entity name `rule_condition` — vendor/shopware/core/Content/Rule/Aggregate/RuleCondition/RuleConditionDefinition.php:26
- confirmed `availability_rule_id` — shipping method availability rule — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:81
- confirmed `availability_rule_id` — payment method availability rule — vendor/shopware/core/Checkout/Payment/PaymentMethodDefinition.php:76
- confirmed `rule_id` — product prices per rule — vendor/shopware/core/Content/Product/Aggregate/ProductPrice/ProductPriceDefinition.php:65
- confirmed `cartRules` — promotion cart rules association — vendor/shopware/core/Checkout/Promotion/PromotionDefinition.php:115
- confirmed `rule_id` — flow sequence rule — vendor/shopware/core/Content/Flow/Aggregate/FlowSequence/FlowSequenceDefinition.php:66
- confirmed `shopware.rule.definition` — tagged iterator feeding the condition registry — vendor/shopware/core/Framework/DependencyInjection/rule.xml:7
