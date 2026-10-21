---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md
  - platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md
sourceHash: 7813915ad1bd503dd9c173ac8e97114e33101a84
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.html
title: How to add a new approval condition
version: "6.7"
versions:
  - "6.7"
keywords: ["approval rule condition", "order approval", "b2b components", "shopware.approval_rule.definition", "Rule", "RuleConfig", "RuleConstraints", "RuleComparison", "CartRuleScope", "approval-rule-conditions", "rule-condition", "manifest.xml", "app script", "custom condition"]
summary: "Add a B2B order approval condition: a plugin Rule tagged shopware.approval_rule.definition, or an app rule-condition plus Twig script."
lastBuilt: 2026-10-21
---
## What it is

How to extend the B2B Components order approval feature with your own condition for approval rules, either from a plugin (a PHP `Rule` subclass registered with a dedicated tag) or from an app (a `rule-condition` in `manifest.xml` plus a Twig app script).

## When to use

The built-in approval conditions do not cover a criterion you need on the Storefront Approval Rule detail/create page (for example cart total, customer first name, cart tax status, cart currency).

## Key steps / config

### Plugin

1. Write a rule class as for any custom rule (see [Add custom rule](platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md)). It extends `Shopware\Core\Framework\Rule\Rule`, overrides `RULE_NAME`, and implements the abstract `match()` and `getConstraints()`; `getConfig()` is optional.

```php
class CartAmountRule extends Rule
{
    final public const RULE_NAME = 'totalCartAmount';
    public function match(RuleScope $scope): bool { /* CartRuleScope + RuleComparison::numeric(...) */ }
    public function getConstraints(): array { /* 'amount' => RuleConstraints::float(), 'operator' => RuleConstraints::numericOperators(false) */ }
    public function getConfig(): RuleConfig { /* operatorSet(RuleConfig::OPERATOR_SET_NUMBER)->numberField('amount') */ }
}
```

2. Register it in `services.php` and tag it `shopware.approval_rule.definition`:

```php
$services->set(YourPluginNameSpace\CartAmountRule::class)
    ->public()
    ->tag('shopware.approval_rule.definition');
```

### App (Commercial plugin 6.4.0+)

1. Declare the condition in `manifest.xml` under `rule-conditions` > `rule-condition` with `identifier`, a translatable `name`, `group`, a `script` element and `constraints`. The `script` value is the path of the Twig file and must include the `/approval-rule-conditions/` prefix (for example `/approval-rule-conditions/custom-condition.twig`); it sits between `group` and `constraints` in the skeleton below.
2. Put the script file in `Resources/scripts/approval-rule-conditions/` in the app root; the file name is free but must match the `script` value.

```xml
<rule-condition>
    <identifier>...</identifier>
    <name>...</name>
    <group>cart</group>
    <constraints>
        <single-select name="operator">...</single-select>
        <float name="amount">...</float>
    </constraints>
</rule-condition>
```

3. The script returns a boolean; the constraint field names (`operator`, `amount`, ...) are available as variables:

```twig
{% if scope.cart is not defined %}
    {% return false %}
{% endif %}
{% return compare(operator, scope.cart.price.totalPrice, amount) %}
```

Other source examples: `scope.salesChannelContext.customer.firstName` with a `text` field, `scope.cart.price.taxStatus` with a `single-select` (`net`/`gross`), `scope.salesChannelContext.currency.isoCode` with a `multi-select`.

## Essential identifiers

- `shopware.approval_rule.definition` (DI tag)
- `Shopware\Core\Framework\Rule\Rule`, `RuleScope`, `RuleComparison`, `RuleConstraints`, `RuleConfig`, `CartRuleScope`
- `Resources/scripts/approval-rule-conditions`
- manifest elements `rule-conditions`, `rule-condition`, `identifier`, `name`, `group`, `script`, `constraints`

## Gotchas

- App value fields support only `float`, `int`, `text`, `single-select` and `multi-select`.
- App approval conditions require Commercial plugin 6.4.0 or later.
- Approval-rule scripts live in `approval-rule-conditions`, not in the Rule Builder's `rule-conditions` script folder.
- `Rule::getName()` throws when `RULE_NAME` is not overridden (the base value is `null`).
- The tag `shopware.approval_rule.definition` belongs to the commercial plugin, not to the core.

## Code check (6.7.15.1)
- confirmed `Rule::match()` — abstract, must be implemented — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract, must be implemented — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `Rule::getConfig()` — optional, base returns null — vendor/shopware/core/Framework/Rule/Rule.php:79
- confirmed `Rule::RULE_NAME` — base null, getName() throws if not set — vendor/shopware/core/Framework/Rule/Rule.php:12
- confirmed `RuleComparison::numeric()` — takes item value, rule value, operator — vendor/shopware/core/Framework/Rule/RuleComparison.php:15
- confirmed `RuleConstraints::numericOperators()` — accepts an `$emptyAllowed` bool — vendor/shopware/core/Framework/Rule/RuleConstraints.php:123
- confirmed `RuleConfig::OPERATOR_SET_NUMBER` — constant exists — vendor/shopware/core/Framework/Rule/RuleConfig.php:15
- confirmed `CartRuleScope::getCart()` — returns the Cart — vendor/shopware/core/Checkout/Cart/Rule/CartRuleScope.php:20
- confirmed `rule-condition` — manifest type with a string script element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:606
- unverified `shopware.approval_rule.definition` — commercial B2B plugin tag, not in core/storefront/administration
