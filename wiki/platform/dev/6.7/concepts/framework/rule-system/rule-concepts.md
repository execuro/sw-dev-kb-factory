---
id: platform/dev/6.7/concepts/framework/rule-system/rule-concepts.md
title: Rule concepts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/rule-system/rule-concepts.html
sourceHash: 7de79a8e8a60b0897cae3fe45dad7e1a86a50e4e
codeCheckedAgainst: "6.7.13.0"
keywords: ["Rule", "RuleScope", "CheckoutRuleScope", "CartRuleScope", "FlowRuleScope", "AndRule", "OrRule", "NotRule", "RuleComparison", "RuleConfig", "RuleConstraints", "container rules", "rule operators", "rule condition", "rule builder"]
summary: "Rule building blocks: Rule::match(RuleScope), rule scopes, And/Or/Not container rules, operators, RuleComparison, RuleConfig, RuleConstraints."
lastBuilt: 2026-09-15
---
## What it is

Core concepts of the Shopware rule system: a **rule** is one condition evaluating to `true`/`false` against a **rule scope**; **container rules** combine rules into trees; each rule declares its operators, **rule config** (UI contract) and **rule constraints** (payload validation).

## When to use

When writing a custom rule condition, or reasoning about which data a rule sees and how the Rule Builder renders and validates it.

## Key steps / config

**Rule contract** (`Shopware\Core\Framework\Rule\Rule`): a rule never fetches data itself, gets everything from the scope, returns a boolean and has no side effects.

```php
class MyRule extends Rule
{
    public const RULE_NAME = 'myRule';   // getName() throws if null
    public function match(RuleScope $scope): bool { /* ... */ }
    public function getConstraints(): array { /* ... */ }
    public function getConfig(): ?RuleConfig { /* optional */ }
}
```

**Rule scopes** — abstract `RuleScope` declares `getContext()` and `getSalesChannelContext()`. Specializations:

- `CheckoutRuleScope` — the `SalesChannelContext` (customer, sales channel, currency).
- `CartRuleScope` extends `CheckoutRuleScope` — adds `getCart()`.
- `FlowRuleScope` extends `CartRuleScope` — adds `getOrder()`.

**Container rules** evaluate nothing themselves: `AndRule` (all match), `OrRule` (at least one), `NotRule` (must not match). A rule definition is a tree of container nodes and leaf conditions, e.g. an `OrRule` over `LineItemsInCartCountRule` (`operator: ">="`, `count: 40`) and `GoodsPriceRule` (`operator: ">="`, `amount: 500`).

**Operators** — constants on `Rule`: `=`, `!=`, `<`, `<=`, `>`, `>=`, `empty` (plus `between`). Shared comparison semantics live in static helpers on `RuleComparison` (`numeric()`, `string()`, `uuids()`, `date()` …).

**Rule config** (`RuleConfig`, from `getConfig()`) — the Rule Builder UI contract: `operatorSet(...)` (presets such as `OPERATOR_SET_STRING`, `OPERATOR_SET_NUMBER`) and fields by name/type/extra config (`numberField()`, `stringField()`, `selectField()`, `entitySelectField()`, `dateField()`).

**Rule constraints** (`RuleConstraints`, used in `getConstraints()`) — value constraints (`float()`, `string()`, `uuids()`, `choice()`) and operator constraints (`numericOperators()`, `stringOperators()`), used to validate payloads before evaluation.

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule`, `Rule::match(RuleScope $scope)`, `Rule::getConstraints()`, `Rule::getConfig()`
- `Shopware\Core\Framework\Rule\RuleScope`, `CheckoutRuleScope`, `CartRuleScope`, `FlowRuleScope`
- `AndRule`, `OrRule`, `NotRule`
- `RuleComparison`, `RuleConfig`, `RuleConstraints`

## Gotchas

- A rule only sees what its scope exposes; a cart-based rule needs a `CartRuleScope` (or subclass).
- `getConstraints()` is abstract and mandatory; `getConfig()` is optional (default `null`).

## Code check (6.7.13.0)
- confirmed `Rule::match()` — abstract, takes `RuleScope`, returns bool — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract, required on every rule — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `Rule::getConfig()` — optional, returns `?RuleConfig`, default null — vendor/shopware/core/Framework/Rule/Rule.php:79
- confirmed `RuleScope::getSalesChannelContext()` — abstract scope contract — vendor/shopware/core/Framework/Rule/RuleScope.php:15
- confirmed `CartRuleScope` — extends `CheckoutRuleScope`, `getCart()` — vendor/shopware/core/Checkout/Cart/Rule/CartRuleScope.php:11
- corrected `FlowRuleScope` — docs: "checkout information plus the related order"; code extends `CartRuleScope` — vendor/shopware/core/Content/Flow/Rule/FlowRuleScope.php:12
- confirmed `OrRule::RULE_NAME` — `orContainer`, extends `Container` — vendor/shopware/core/Framework/Rule/Container/OrRule.php:11
- confirmed `Rule::OPERATOR_EMPTY` — operator `empty`; `OPERATOR_BETWEEN` also exists — vendor/shopware/core/Framework/Rule/Rule.php:26
- confirmed `RuleConfig::operatorSet()` — operator set for the admin UI — vendor/shopware/core/Framework/Rule/RuleConfig.php:63
- confirmed `RuleConstraints::numericOperators()` — operator constraint helper — vendor/shopware/core/Framework/Rule/RuleConstraints.php:124
