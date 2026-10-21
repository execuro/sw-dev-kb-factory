---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/architecture/context-rules-rule-systems.md
sourceHash: 18f4005ce84c7f39d34b526aad10b6e159335d20
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/context-rules-rule-systems.html
title: Rule System Extension Architecture
version: "6.7"
versions:
  - "6.7"
keywords: ["CartRuleScope", "LineItemScope", "CheckoutRuleScope", "RuleScope", "Rule", "match", "custom rule", "rule builder", "rule condition", "rule evaluation", "no database queries", "deterministic rules"]
summary: Mandatory rules for custom rule conditions - no DB queries, no side effects, data only via RuleScope; cart rules must support CartRuleScope and LineItemScope.
lastBuilt: 2026-10-21
---
## What it is

The architectural contract for custom rule (condition) implementations in the rule system. Rules are evaluated synchronously during request handling, so they must be deterministic, fast, and operate only on data already available in the evaluation scope.

## When to use

When writing a custom rule condition for the rule builder, especially a cart- or line-item-related one.

## Key steps / config

Design principles: no database queries during evaluation (all rules run inside the request cycle); rely exclusively on the provided scope; evaluation is predictable and free of side effects.

1. Extend `Shopware\Core\Framework\Rule\Rule` and implement its two abstract members: `match(RuleScope $scope): bool` and `getConstraints(): array`.
2. In `match()`, read data only from the scope object. Do not execute database queries, do not mutate state, keep the logic computation-only.
3. For cart-related rules, support both scope types:
   - `\Shopware\Core\Checkout\Cart\Rule\CartRuleScope` — exposes `getCart()`
   - `\Shopware\Core\Checkout\Cart\Rule\LineItemScope` — exposes `getLineItem()`
   Both extend `Shopware\Core\Checkout\CheckoutRuleScope` (`getSalesChannelContext()`, `getCustomer()`, `getContext()`), which extends `Shopware\Core\Framework\Rule\RuleScope`.

```php
class MyRule extends Rule
{
    public function match(RuleScope $scope): bool
    {
        if ($scope instanceof LineItemScope) { /* check $scope->getLineItem() */ }
        if ($scope instanceof CartRuleScope) { /* check $scope->getCart() */ }
        return false;
    }
    public function getConstraints(): array { /* ... */ }
}
```

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule` (`match()`, `getConstraints()`)
- `Shopware\Core\Framework\Rule\RuleScope`
- `Shopware\Core\Checkout\CheckoutRuleScope`
- `\Shopware\Core\Checkout\Cart\Rule\CartRuleScope`
- `\Shopware\Core\Checkout\Cart\Rule\LineItemScope`

## Gotchas

- Rules may only access data exposed through their scope class; anything not in the scope must be loaded beforehand (e.g. in a cart collector), not inside the rule.
- Side effects or state mutation during evaluation break predictability, since rules may be evaluated repeatedly per request.

## Code check (6.7.15.1)
- confirmed `Rule::match()` — abstract, takes `RuleScope` — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract, must be declared by subclasses — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `RuleScope` — abstract base scope — vendor/shopware/core/Framework/Rule/RuleScope.php:11
- confirmed `CheckoutRuleScope` — extends RuleScope, common base of cart scopes — vendor/shopware/core/Checkout/CheckoutRuleScope.php:12
- confirmed `CartRuleScope` — class in `Shopware\Core\Checkout\Cart\Rule` — vendor/shopware/core/Checkout/Cart/Rule/CartRuleScope.php:11
- confirmed `CartRuleScope::getCart()` — exposes the cart — vendor/shopware/core/Checkout/Cart/Rule/CartRuleScope.php:20
- confirmed `LineItemScope` — class in `Shopware\Core\Checkout\Cart\Rule` — vendor/shopware/core/Checkout/Cart/Rule/LineItemScope.php:11
- confirmed `LineItemScope::getLineItem()` — exposes the line item — vendor/shopware/core/Checkout/Cart/Rule/LineItemScope.php:20
