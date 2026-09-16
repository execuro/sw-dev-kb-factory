---
id: platform/dev/6.7/guides/plugins/plugins/architecture/context-rules-rule-systems.md
title: Rule System Extension Architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/context-rules-rule-systems.html
sourceHash: 18f4005ce84c7f39d34b526aad10b6e159335d20
codeCheckedAgainst: "6.7.13.0"
keywords: ["rule system", "custom rule", "rule builder", "CartRuleScope", "LineItemScope", "RuleScope", "CheckoutRuleScope", "Rule::match", "shopware.rule.definition", "rule evaluation", "no database queries", "deterministic rules"]
summary: "Custom rule contract: deterministic, no side effects or DB queries, data only via RuleScope; cart rules support CartRuleScope and LineItemScope."
lastBuilt: 2026-09-15
---
## What it is

The architectural contract for plugins adding custom rule implementations. Rules are evaluated synchronously during request handling, so they must be deterministic, performant, and operate only on data already available in the evaluation context (the rule scope).

## When to use

Implementing or reviewing a custom rule (e.g. a cart or line item condition for the rule builder), especially when deciding where the data the rule inspects comes from.

## Key steps / config

Design principles: no database queries during rule evaluation (all rules are evaluated within the request cycle); rely exclusively on the provided evaluation scope; evaluation must be predictable and free of side effects.

1. Extend `Shopware\Core\Framework\Rule\Rule` and implement both abstract members: `match(RuleScope $scope): bool` and `getConstraints(): array`. The rule's API name comes from the `RULE_NAME` constant (read by `getName()`). Core rules are registered with the `shopware.rule.definition` service tag.
2. Inside `match()`, read data only through the scope object. `RuleScope` (`Shopware\Core\Framework\Rule\RuleScope`) exposes `getContext()` and `getSalesChannelContext()`.
3. Cart-related rules must support both scope types:
   - `\Shopware\Core\Checkout\Cart\Rule\CartRuleScope` — `getCart(): Cart`
   - `\Shopware\Core\Checkout\Cart\Rule\LineItemScope` — `getLineItem(): LineItem`
   Both extend `Shopware\Core\Checkout\CheckoutRuleScope`.
4. Keep logic lightweight and computation-only: never execute database queries inside rule classes and do not mutate state during evaluation.

```php
class MyCartRule extends Rule
{
    public const RULE_NAME = '...';
    public function match(RuleScope $scope): bool { /* CartRuleScope / LineItemScope */ }
    public function getConstraints(): array { /* ... */ }
}
```

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule::match()`, `Rule::getConstraints()`, `Rule::RULE_NAME`
- `Shopware\Core\Framework\Rule\RuleScope`
- `Shopware\Core\Checkout\Cart\Rule\CartRuleScope`
- `Shopware\Core\Checkout\Cart\Rule\LineItemScope`
- `Shopware\Core\Checkout\CheckoutRuleScope`
- `shopware.rule.definition`

## Gotchas

- Rules may only access data exposed through their respective scope classes; any data a rule needs must already be in the evaluation context, not loaded by the rule.
- `getName()` throws when a rule does not define `RULE_NAME`.

## Code check (6.7.13.0)
- confirmed `Rule::match()` — abstract, takes RuleScope, returns bool — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract member every rule declares — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `Rule::RULE_NAME` — getName() throws if the constant is null — vendor/shopware/core/Framework/Rule/Rule.php:12
- confirmed `RuleScope` — abstract with getContext()/getSalesChannelContext() — vendor/shopware/core/Framework/Rule/RuleScope.php:11
- confirmed `CartRuleScope` — extends CheckoutRuleScope — vendor/shopware/core/Checkout/Cart/Rule/CartRuleScope.php:11
- confirmed `CartRuleScope::getCart()` — exposes the cart — vendor/shopware/core/Checkout/Cart/Rule/CartRuleScope.php:20
- confirmed `LineItemScope` — extends CheckoutRuleScope — vendor/shopware/core/Checkout/Cart/Rule/LineItemScope.php:11
- confirmed `LineItemScope::getLineItem()` — exposes the line item — vendor/shopware/core/Checkout/Cart/Rule/LineItemScope.php:20
- confirmed `CheckoutRuleScope` — extends RuleScope — vendor/shopware/core/Checkout/CheckoutRuleScope.php:12
- confirmed `shopware.rule.definition` — service tag on core rule classes — vendor/shopware/core/Checkout/DependencyInjection/rule.xml:8
