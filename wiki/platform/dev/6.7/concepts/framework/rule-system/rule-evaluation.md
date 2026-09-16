---
id: platform/dev/6.7/concepts/framework/rule-system/rule-evaluation.md
title: Rule evaluation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/rule-system/rule-evaluation.html
sourceHash: d2178aac1a7a6af29403271b3f1adbd16c1a1ab2
codeCheckedAgainst: "6.7.13.0"
keywords: ["rule evaluation", "RuleValidator", "RuleConditionRegistry", "CartRuleLoader", "AbstractRuleLoader", "filterMatchingRules", "FlowRuleScopeBuilder", "LineItemScope", "AnyRuleLineItemMatcher", "getRuleIds", "availability_rule_id", "rule_condition", "matching rules"]
summary: "Rule lifecycle: RuleValidator on write, CartRuleLoader matching loop, rule IDs on SalesChannelContext, direct Rule::match() against a scope."
lastBuilt: 2026-09-15
---
## What it is

How a Shopware rule goes from the Rule Builder to a runtime decision: stored as `rule` + `rule_condition` records, validated on write, hydrated into `Rule` objects, then matched upfront (checkout) or evaluated directly (flows, line items).

## When to use

Debugging why a shipping/payment method or promotion is (not) available, why a rule condition is rejected on save, or when a feature must evaluate a rule against its own scope.

## Key steps / config

1. **Storage** — the tree becomes one `rule` entity and `rule_condition` records (containers and leaves), linked via `parent_id`. Each condition has a `type` (maps to a `Rule` class) and a `value` JSON field (operator, thresholds, IDs).
2. **Validation** — `RuleValidator` subscribes to `PreWriteValidationEvent`, resolves each condition `type` via `RuleConditionRegistry::getRuleInstance()` and checks the payload against the rule's `getConstraints()`. Wrong fields, types or operators reject the write.
3. **Scopes** — rules only evaluate a provided `RuleScope`: `CheckoutRuleScope`, `CartRuleScope` (cart), `FlowRuleScope` (order), `LineItemScope` (one line item).
4. **Scope owners** — cart/checkout: `CartRuleLoader`; flows: `FlowRuleScopeBuilder::build(OrderEntity $order, Context $context)` (rebuilds a cart from the order, runs data collectors); line items: `AnyRuleLineItemMatcher` creates a `LineItemScope`.
5. **Matching (checkout)** — `CartRuleLoader` loads candidates via `AbstractRuleLoader::load()`, narrows with `filterForContext()`, then `RuleCollection::filterMatchingRules(Cart, SalesChannelContext)` keeps rules whose payload matches a `CartRuleScope`. If the cart changed (promotions, shipping), it recalculates and re-matches, at most `MAX_ITERATION` (7) times. Matching IDs go to the `SalesChannelContext`.
6. **Consumption** — ID-based: `shipping_method`, `payment_method`, `tax_provider` have `availability_rule_id`; allowed when the ID is in `SalesChannelContext::getRuleIds()`. Direct: load the rule tree, build a scope, call `Rule::match(RuleScope $scope)` on the root; containers delegate to children (an `OrRule` whose children all return `false` returns `false`).

## Essential identifiers

- `Shopware\Core\Content\Rule\RuleValidator`
- `Shopware\Core\Framework\Rule\Collector\RuleConditionRegistry`
- `Shopware\Core\Checkout\Cart\CartRuleLoader`, `AbstractRuleLoader`
- `Shopware\Core\Content\Rule\RuleCollection::filterMatchingRules()`
- `Shopware\Core\Content\Flow\Rule\FlowRuleScopeBuilder`
- `AnyRuleLineItemMatcher`, `LineItemScope`
- `SalesChannelContext::getRuleIds()`, `availability_rule_id`

## Gotchas

- Rules are pure functions of the scope, with no global state.
- The `RuleCollection` used for matching is the entity collection in `Shopware\Core\Content\Rule`, not `Shopware\Core\Framework\Rule\RuleCollection`.

## Code check (6.7.13.0)
- confirmed `RuleValidator::getSubscribedEvents()` — listens to `PreWriteValidationEvent` — vendor/shopware/core/Content/Rule/RuleValidator.php:56
- confirmed `RuleConditionRegistry::getRuleInstance()` — resolves condition type to rule — vendor/shopware/core/Framework/Rule/Collector/RuleConditionRegistry.php:47
- confirmed `value` — JSON field on `rule_condition`; tree via `ParentFkField` — vendor/shopware/core/Content/Rule/Aggregate/RuleCondition/RuleConditionDefinition.php:61
- confirmed `AbstractRuleLoader::load()` — returns `RuleCollection` — vendor/shopware/core/Checkout/Cart/AbstractRuleLoader.php:14
- confirmed `RuleCollection::filterMatchingRules()` — matches payload with `CartRuleScope` — vendor/shopware/core/Content/Rule/RuleCollection.php:19
- confirmed `CartRuleLoader::MAX_ITERATION` — value 7 (not stated in docs) — vendor/shopware/core/Checkout/Cart/CartRuleLoader.php:34
- confirmed `setRuleIds` — matching IDs written to context — vendor/shopware/core/Checkout/Cart/CartRuleLoader.php:141
- confirmed `FlowRuleScopeBuilder::build()` — builds `FlowRuleScope` from order — vendor/shopware/core/Content/Flow/Rule/FlowRuleScopeBuilder.php:40
- confirmed `LineItemScope` — built in `AnyRuleLineItemMatcher` — vendor/shopware/core/Checkout/Cart/LineItem/Group/RulesMatcher/AnyRuleLineItemMatcher.php:34
- confirmed `SalesChannelContext::getRuleIds()` — exposes matching rule IDs — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:160
