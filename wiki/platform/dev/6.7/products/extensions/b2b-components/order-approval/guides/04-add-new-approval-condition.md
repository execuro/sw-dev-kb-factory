---
id: platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md
title: How to add a new approval condition
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.html
sourceHash: 7813915ad1bd503dd9c173ac8e97114e33101a84
codeCheckedAgainst: "6.7.13.0"
keywords: ["approval rule condition", "order approval", "shopware.approval_rule.definition", "Rule", "RuleConfig", "RuleScope", "CartRuleScope", "rule-condition", "approval-rule-conditions", "app script", "manifest.xml", "custom condition", "b2b"]
summary: "B2B approval rule conditions: plugin Rule tagged shopware.approval_rule.definition, or app rule-condition with an approval-rule-conditions script."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md", "platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md"]
---
## What it is

How to add a custom condition for B2B Order Approval rules (Shopware Commercial), either from a plugin (a PHP `Rule` class tagged for approval rules) or from an app (a manifest `rule-condition` plus a Twig app script).

## When to use

The built-in approval rule conditions do not cover a criterion you need on the Storefront Approval Rule detail/create page.

## Key steps / config

### Plugin

1. Write a rule as in [Add custom rule](platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md): extend `Shopware\Core\Framework\Rule\Rule`, set `RULE_NAME`, implement `match()` and `getConstraints()`, optionally override `getConfig()`.

```php
class CartAmountRule extends Rule
{
    final public const RULE_NAME = 'totalCartAmount';
    protected float $amount;

    public function match(RuleScope $scope): bool { /* return false unless $scope instanceof CartRuleScope; compare cart total */ }
    public function getConstraints(): array { /* 'amount' => [...], 'operator' => [...] */ }
    public function getConfig(): RuleConfig
    {
        return (new RuleConfig())->operatorSet(RuleConfig::OPERATOR_SET_NUMBER)->numberField('amount');
    }
}
```

2. Register it in `services.php` with the approval tag:

```php
$services->set(YourPluginNameSpace\CartAmountRule::class)
    ->public()
    ->tag('shopware.approval_rule.definition');
```

### App (Commercial plugin 6.4.0+)

- Define the condition in `manifest.xml` (`identifier`, `name`, `group`, `script`, `constraints`); `name` is translatable and shown in the condition selection.
- Scripts must live in `Resources/scripts/approval-rule-conditions/`; the `script` value must include the `/approval-rule-conditions/` prefix.
- `constraints` fields render `operator` and value fields; value fields support `float`, `int`, `text`, `single-select`, `multi-select`.

```xml
<rule-condition>
    <identifier>cart_currency_rule_script</identifier>
    <name>Cart currency</name>
    <group>cart</group>
    <constraints>
        <single-select name="operator">...</single-select>
        <multi-select name="isoCode">...</multi-select>
    </constraints>
</rule-condition>
```

```twig
{% if scope.cart is not defined %}
    {% return false %}
{% endif %}
{% return compare(operator, scope.cart.price.totalPrice, amount) %}
```

Constraint field names (e.g. `amount`, `firstName`, `taxStatus`, `isoCode`) become Twig variables in the script.

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule`, `RULE_NAME`, `match()`, `getConstraints()`, `getConfig()`
- `Shopware\Core\Framework\Rule\RuleConfig`, `RuleConfig::OPERATOR_SET_NUMBER`, `numberField()`
- `Shopware\Core\Framework\Rule\RuleScope`, `CartRuleScope`
- `shopware.approval_rule.definition`
- `Resources/scripts/approval-rule-conditions`

## Gotchas

- The source example uses `RuleComparison::numeric()` and `RuleConstraints::float()` / `RuleConstraints::numericOperators(false)`; both helper classes are marked `@deprecated tag:v6.8.0 - reason:becomes-final` in 6.7.13.0 (still callable, but must not be extended).
- `Rule::getName()` throws if `RULE_NAME` is not set.
- In core, every `Rule` subclass is autoconfigured with the `shopware.rule.definition` tag; the approval tag `shopware.approval_rule.definition` is added explicitly and comes from the Commercial plugin.
- App approval conditions are not supported before Commercial plugin 6.4.0.

## Version notes

- Approval rule conditions for apps: introduced in Commercial plugin 6.4.0.

## Code check (6.7.13.0)
- deprecated `Shopware\Core\Framework\Rule\RuleComparison` — @deprecated tag:v6.8.0 becomes-final — vendor/shopware/core/Framework/Rule/RuleComparison.php:13
- deprecated `Shopware\Core\Framework\Rule\RuleConstraints` — @deprecated tag:v6.8.0 becomes-final — vendor/shopware/core/Framework/Rule/RuleConstraints.php:19
- confirmed `Rule::match()` — abstract, must be implemented — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract, must be implemented — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `Rule::getConfig()` — optional override returning ?RuleConfig — vendor/shopware/core/Framework/Rule/Rule.php:79
- confirmed `RULE_NAME` — defaults to null; getName() throws when unset — vendor/shopware/core/Framework/Rule/Rule.php:12
- confirmed `RuleConfig::OPERATOR_SET_NUMBER` — constant exists — vendor/shopware/core/Framework/Rule/RuleConfig.php:15
- confirmed `RuleConfig::numberField()` — builder method exists — vendor/shopware/core/Framework/Rule/RuleConfig.php:111
- confirmed `CartRuleScope` — extends CheckoutRuleScope — vendor/shopware/core/Checkout/Cart/Rule/CartRuleScope.php:11
- unverified `shopware.approval_rule.definition` — Commercial plugin tag, not in installed vendor/shopware roots
