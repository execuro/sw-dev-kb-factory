---
id: platform/dev/6.7/concepts/framework/rule-system/_index.md
title: Rule system
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/rule-system/
sourceHash: 8c77c2154d2e260f464db9026373458e565124bf
codeCheckedAgainst: "6.7.15.1"
keywords: ["rule system", "rule builder", "rules", "conditions", "Rule", "RuleScope", "CartRuleScope", "RuleEntity", "RuleAreas", "business conditions", "promotions", "flow builder", "shipping methods", "payment methods"]
summary: "Shopware's generic rule system: composable business conditions evaluated against a cart, order or customer scope, used by checkout, promotions and Flow Builder."
lastBuilt: 2026-10-20
---
## What it is

Shopware's **rule system** describes business conditions as composable rules that are evaluated against a specific context such as a cart, an order or a customer. The **Rule Builder** is the Administration feature on top of it for configuring and combining rule conditions visually.

Example: "If a customer orders a car, a pair of sunglasses will be free in the same order." This combines persistent data (the products "car" and "sunglasses", stored in the database) with runtime state (the whole cart, a line item's quantity). The rule system maps from "car is in the cart" to "sunglasses are free" — adjusting one line item's price and thereby the cart calculation — without embedding that logic in the cart itself.

## When to use

Rules are cross-domain; among others they are used for:

- **Checkout and cart** — availability and behavior of shipping methods, payment methods and product prices based on the current cart and customer.
- **Promotions** — applying or restricting promotions by customer, cart content or other criteria.
- **Flow Builder** — rule conditions that control flow behavior and outcome based on order, checkout, customer or product context.

## Essential identifiers

Verified in the installed code (not named in the source page):

- `Shopware\Core\Framework\Rule\Rule` — base condition class; subclasses implement `match(RuleScope $scope): bool` and `getConstraints(): array`.
- `Shopware\Core\Framework\Rule\RuleScope` — evaluation context (`getContext()`, `getSalesChannelContext()`); `CartRuleScope` for cart evaluation.
- `Shopware\Core\Content\Rule\RuleEntity` — a stored rule configured in the Rule Builder.
- `RuleAreas` — areas a rule is used in: `product`, `payment`, `shipping`, `promotion`, `flow`, `flow-condition`, `category`, `landing-page`.

## Code check (6.7.15.1)
- confirmed `Rule` — abstract base class — vendor/shopware/core/Framework/Rule/Rule.php:10
- confirmed `Rule::match()` — abstract, takes `RuleScope` — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `RuleScope` — abstract evaluation scope — vendor/shopware/core/Framework/Rule/RuleScope.php:11
- confirmed `CartRuleScope` — cart scope, extends `CheckoutRuleScope` — vendor/shopware/core/Checkout/Cart/Rule/CartRuleScope.php:11
- confirmed `RuleEntity` — persisted rule entity — vendor/shopware/core/Content/Rule/RuleEntity.php:23
- confirmed `RuleAreas::PAYMENT_AREA` — `payment` area — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/RuleAreas.php:11
- confirmed `RuleAreas::PROMOTION_AREA` — `promotion` area — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/RuleAreas.php:13
- confirmed `RuleAreas::FLOW_AREA` — `flow` area — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/RuleAreas.php:14
