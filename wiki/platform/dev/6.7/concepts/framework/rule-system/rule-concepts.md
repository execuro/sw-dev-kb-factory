---
id: platform/dev/6.7/concepts/framework/rule-system/rule-concepts.md
title: Rule concepts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/rule-system/rule-concepts.html
sourceHash: 7de79a8e8a60b0897cae3fe45dad7e1a86a50e4e
codeCheckedAgainst: "6.7.15.1"
keywords: ["rule builder", "conditions", "Rule", "RuleScope", "CheckoutRuleScope", "CartRuleScope", "FlowRuleScope", "AndRule", "OrRule", "NotRule", "RuleConfig", "RuleConstraints", "RuleComparison", "container rules", "rule operators"]
summary: "Rule system building blocks: Rule::match() against a RuleScope, container rules (AndRule/OrRule/NotRule), operators, RuleConfig UI contract, RuleConstraints."
lastBuilt: 2026-10-20
---
## What it is

The conceptual model of the Shopware rule system: a **rule** is a single condition that evaluates to `true` or `false` against a **rule scope**, rules are combined into trees by **container rules**, and each rule declares its admin UI contract (`RuleConfig`) and its validation (`RuleConstraints`).

## When to use

Read this before writing a custom rule condition, consuming rules in a feature, or debugging why a Rule Builder condition matches or fails.

## Key steps / config

- **Rule contract** (`Shopware\Core\Framework\Rule\Rule`, abstract): a rule receives all data through the scope, never fetches data itself, returns a boolean and has no side effects. Subclasses declare:
  - `public const RULE_NAME` — unique API name (a `null` value throws on `getName()`);
  - `match(RuleScope $scope): bool`;
  - `getConstraints(): array` — `propertyName => list<Constraint>`;
  - optionally `getConfig(): ?RuleConfig` (base returns `null`).
- **Scopes** (`Shopware\Core\Framework\Rule\RuleScope`, abstract) expose `getContext()`, `getSalesChannelContext()` and `getCurrentTime()`. Specialisations:
  - `CheckoutRuleScope` — wraps the `SalesChannelContext` (customer, sales channel, currency);
  - `CartRuleScope` extends `CheckoutRuleScope`, adds `getCart()`;
  - `FlowRuleScope` extends `CartRuleScope`, adds `getOrder()` (so it carries cart and order).
- **Container rules** (`Shopware\Core\Framework\Rule\Container\*`) evaluate no condition of their own: `AndRule` (all match), `OrRule` (at least one), `NotRule` (must not match). The code also ships `XorRule` and `MatchAllLineItemsRule`. Leaf nodes are concrete conditions.
- Example tree from the source:

```
OrRule  rules: [lineItemCount, cartPrice]
├─ LineItemsInCartCountRule  operator ">="  count 40
└─ GoodsPriceRule            operator ">="  amount 500
```

- **Operators** are constants on `Rule`: `=`, `!=`, `<`, `<=`, `>`, `>=`, `empty`, plus `between`. Shared comparison semantics live in `RuleComparison` (`numeric()`, `string()`, `stringArray()`, `uuids()`, `date()`, `datetime()`).
- **Rule config** (`RuleConfig`) is the UI contract: `operatorSet()` picks valid operators (predefined sets `OPERATOR_SET_STRING`, `OPERATOR_SET_NUMBER`, `OPERATOR_SET_DATE`, `OPERATOR_SET_DEFAULT`), and field builders (`numberField()`, `stringField()`, `selectField()`, `entitySelectField()`, `dateTimeField()`, `field()`) describe each field by name, type and extra config (options, unit, placeholder).
- **Rule constraints** (`RuleConstraints`) validate payloads before evaluation: value helpers (`float()`, `int()`, `string()`, `uuids()`, `choice()`, `bool()`) and operator helpers (`numericOperators()`, `stringOperators()`, `uuidOperators()`) restrict allowed operators, e.g. equality-only.

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule`, `Rule::match()`, `Rule::getConstraints()`, `Rule::getConfig()`
- `Shopware\Core\Framework\Rule\RuleScope`
- `Shopware\Core\Checkout\CheckoutRuleScope`, `Shopware\Core\Checkout\Cart\Rule\CartRuleScope`, `Shopware\Core\Content\Flow\Rule\FlowRuleScope`
- `AndRule`, `OrRule`, `NotRule` (`Shopware\Core\Framework\Rule\Container`)
- `RuleConfig`, `RuleConstraints`, `RuleComparison`

## Gotchas

- Rules depend only on what the scope exposes; a rule written for `CartRuleScope` data must check the scope type, since checkout-only scopes have no cart.
- The source describes `FlowRuleScope` as "checkout information plus the related order"; in code it extends `CartRuleScope`, so a cart is available too.

## Code check (6.7.15.1)
- confirmed `Rule::match()` — abstract, `match(RuleScope $scope): bool` — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract, returns property-to-constraints map — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `Rule::getConfig()` — optional, base returns null — vendor/shopware/core/Framework/Rule/Rule.php:79
- confirmed `Rule::OPERATOR_EMPTY` — operator value `empty` — vendor/shopware/core/Framework/Rule/Rule.php:26
- confirmed `RuleScope::getSalesChannelContext()` — abstract scope contract — vendor/shopware/core/Framework/Rule/RuleScope.php:15
- confirmed `FlowRuleScope` — extends CartRuleScope, adds order — vendor/shopware/core/Content/Flow/Rule/FlowRuleScope.php:12
- confirmed `OrRule` — container, RULE_NAME `orContainer` — vendor/shopware/core/Framework/Rule/Container/OrRule.php:11
- confirmed `RuleConfig::operatorSet()` — declares valid operators for the UI — vendor/shopware/core/Framework/Rule/RuleConfig.php:63
- confirmed `RuleConstraints::numericOperators()` — operator constraint helper — vendor/shopware/core/Framework/Rule/RuleConstraints.php:123
- confirmed `RuleComparison::numeric()` — shared numeric comparison — vendor/shopware/core/Framework/Rule/RuleComparison.php:15
