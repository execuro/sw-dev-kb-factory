---
id: platform/dev/6.7/concepts/framework/rule-system/rule-evaluation.md
title: Rule evaluation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/rule-system/rule-evaluation.html
sourceHash: d2178aac1a7a6af29403271b3f1adbd16c1a1ab2
codeCheckedAgainst: "6.7.15.1"
keywords: ["rule builder", "rule evaluation", "rule_condition", "RuleValidator", "RuleConditionRegistry", "CartRuleLoader", "AbstractRuleLoader", "RuleCollection::filterMatchingRules", "FlowRuleScopeBuilder", "LineItemScope", "SalesChannelContext::getRuleIds", "availability_rule_id", "matching rules"]
summary: "Rule lifecycle: Rule Builder tree stored as rule/rule_condition, validated by RuleValidator, matched by CartRuleLoader into SalesChannelContext rule IDs."
lastBuilt: 2026-10-20
---
## What it is

The lifecycle of a rule from the Rule Builder to a runtime decision: storage as `rule` / `rule_condition` records, write-time validation, scope construction, upfront matching for checkout, and the two ways features consume rules (ID filtering or direct `match()`).

## When to use

When you need to know where a rule is validated, which class builds the scope for a domain, why matching rule IDs appear on the context, or how to evaluate a stored rule tree yourself.

## Key steps / config

1. **Store the tree.** The Rule Builder tree maps to one `rule` entity plus `rule_condition` records for container and leaf nodes. Tree edges are parent references between `rule_condition` records (`parent_id`); each record has a required `type` (a rule's `RULE_NAME`, mapped to a class extending `Rule`) and a JSON `value` with operator, thresholds, IDs:

```
rule_condition { id, ruleId, parentId, type: "orContainer", value: {} }
rule_condition { id, ruleId, parentId: <or-id>, type: "cartGoodsPrice", value: { operator: ">=", amount: ... } }
```

2. **Validate.** `RuleValidator` is an event subscriber on `PreWriteValidationEvent`; it inspects commands for the `rule_condition` entity, resolves `type` via `RuleConditionRegistry::getRuleInstance()`, and checks the payload against the rule's constraints. Wrong fields, types or operators reject the write.
3. **Build a scope.** Rules evaluate only against a provided `RuleScope`:
   - Cart / checkout: `CartRuleLoader` (main entry point) builds `CartRuleScope`.
   - Flows: `FlowRuleScopeBuilder` builds `FlowRuleScope`, reconstructing a cart from an order and running data collectors.
   - Line items: `AnyRuleLineItemMatcher` builds `LineItemScope` per item.
4. **Match upfront (checkout).** `CartRuleLoader` loads candidates through `AbstractRuleLoader`, narrows them to context-relevant rules, then loops: `RuleCollection::filterMatchingRules($cart, $context)` evaluates each rule payload with a `CartRuleScope`, IDs are set on the context, the cart is recalculated, and the loop repeats while the cart or the matching set changes (capped by `MAX_ITERATION = 7`). Result: a self-consistent (cart, matching rule IDs) pair.
5. **Consume.**
   - ID-based: entities such as `shipping_method`, `payment_method`, `tax_provider` carry `availability_rule_id`; an item is allowed if that ID is in `SalesChannelContext::getRuleIds()`.
   - Direct: load the rule tree, build the scope you need, call `Rule::match(RuleScope $scope)` on the root. Containers delegate to children; an `OrRule` whose children all return `false` returns `false`.

## Essential identifiers

- `rule`, `rule_condition` (`type`, `value`, `parent_id`)
- `RuleValidator`, `RuleConditionRegistry`
- `RuleScope`, `CheckoutRuleScope`, `CartRuleScope`, `FlowRuleScope`, `LineItemScope`
- `CartRuleLoader`, `AbstractRuleLoader`, `FlowRuleScopeBuilder`, `AnyRuleLineItemMatcher`
- `RuleCollection::filterMatchingRules()` (`Shopware\Core\Content\Rule\RuleCollection`)
- `SalesChannelContext::getRuleIds()`, `availability_rule_id`
- `Rule::match()`

## Gotchas

- Rules are pure functions of their scope; they do not read global state, so a rule that needs order data only works in scopes that carry it.
- Matching rule IDs on the context can change cart processors (promotions, shipping), which is why `CartRuleLoader` iterates; the iteration count is capped, so oscillating rule/cart combinations stop after the limit instead of converging.

## Code check (6.7.15.1)
- confirmed `RuleValidator` — subscribes to PreWriteValidationEvent — vendor/shopware/core/Content/Rule/RuleValidator.php:37
- confirmed `rule_condition` — entity name of RuleConditionDefinition — vendor/shopware/core/Content/Rule/Aggregate/RuleCondition/RuleConditionDefinition.php:29
- confirmed `rule_condition.value` — JsonField storing the condition config — vendor/shopware/core/Content/Rule/Aggregate/RuleCondition/RuleConditionDefinition.php:64
- confirmed `RuleConditionRegistry::getRuleInstance()` — resolves type name to rule — vendor/shopware/core/Framework/Rule/Collector/RuleConditionRegistry.php:47
- confirmed `RuleCollection::filterMatchingRules()` — evaluates payload with CartRuleScope — vendor/shopware/core/Content/Rule/RuleCollection.php:19
- confirmed `CartRuleLoader::MAX_ITERATION` — recalculation loop capped at 7 — vendor/shopware/core/Checkout/Cart/CartRuleLoader.php:34
- confirmed `AbstractRuleLoader` — injected into CartRuleLoader — vendor/shopware/core/Checkout/Cart/CartRuleLoader.php:51
- confirmed `FlowRuleScopeBuilder` — builds FlowRuleScope from an order — vendor/shopware/core/Content/Flow/Rule/FlowRuleScopeBuilder.php:18
- confirmed `LineItemScope` — built per item by AnyRuleLineItemMatcher — vendor/shopware/core/Checkout/Cart/LineItem/Group/RulesMatcher/AnyRuleLineItemMatcher.php:34
- confirmed `SalesChannelContext::getRuleIds()` — matching rule IDs on the context — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:160
