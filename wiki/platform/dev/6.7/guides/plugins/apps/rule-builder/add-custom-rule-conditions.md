---
id: platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md
title: Add Custom Rule Conditions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/rule-builder/add-custom-rule-conditions.html
sourceHash: 2fff11735ea3a737e6107a20aa368161b9833f7b
codeCheckedAgainst: "6.7.15.1"
keywords: ["rule builder", "rule-conditions", "rule-condition", "custom condition", "app rule condition", "manifest.xml", "RuleScope", "LineItemScope", "compare", "getCurrentTime", "constraints", "twig script"]
summary: "Custom Rule Builder conditions for apps: manifest.xml rule-condition plus a Twig script in Resources/scripts/rule-conditions."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/concepts/framework/rule-system/_index.md
  - platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md
  - platform/dev/6.7/resources/references/app-reference/manifest-reference.md
  - platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md
---
## What it is

Apps can add their own conditions to the [Rule Builder](platform/dev/6.7/concepts/framework/rule-system/_index.md). A condition is declared in the app's `manifest.xml` with optional Administration fields; its logic is a sandboxed Twig script with the same syntax and debugging options as [App Scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md).

## When to use

When an app needs rule logic the built-in conditions lack, e.g. customer data, specific cart products, or a calendar date.

## Key steps / config

1. Declare the condition inside `<rule-conditions>` in `manifest.xml` (see [Manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md)):

```xml
<rule-condition>
    <identifier>line_item_condition</identifier>
    <name>Custom product multi select</name>
    <group>item</group>
    <constraints>
        <single-select name="operator">...</single-select>
        <multi-entity-select name="productIds">...</multi-entity-select>
    </constraints>
</rule-condition>
```

   Required: `identifier` (unique within the app, used to match conditions on app update, do not change it), `name` (translatable, shown in the condition selection), and a `script` element with the script's file name and extension (e.g. `line-item-condition.twig`). `group` (e.g. `item`, `misc`) is optional.
2. Optional `constraints` are a list of [custom fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md); fields may be `required`. Each field's `name` attribute becomes the script variable, so use variable-friendly names unique per condition.
3. Place the script in `Resources/scripts/rule-conditions/` in the app root; the file name is free but must equal the manifest's `script` value.
4. In the script use `scope` (a `RuleScope` giving the `SalesChannelContext` and, in a cart scope, the cart) plus the constraint variables, and return a boolean:

```twig
{% if scope.lineItem is defined %}
    {% return compare(operator, scope.lineItem.referenceId, productIds) %}
{% endif %}
{% if scope.cart is not defined %}
    {% return false %}
{% endif %}
{% for lineItem in scope.cart.lineItems.getFlat() %}
    {% if compare(operator, lineItem.referenceId, productIds) %}{% return true %}{% endif %}
{% endfor %}
{% return false %}
```

5. `compare(operator, value, comparable)` supports `=`, `!=`, `>`, `>=`, `<`, `<=`, `empty`. With an array on either side, use only `=`/`!=`; it returns `true` if at least one value occurs in the other array. `scope.getCurrentTime()` returns the current time, e.g. for date conditions using `date_modify`.

## Essential identifiers

- `<rule-conditions>`, `<rule-condition>`, `identifier`, `name`, `group`, `constraints`
- `Resources/scripts/rule-conditions`
- `RuleScope`, `LineItemScope`, `compare()`, `scope.getCurrentTime()`

## Gotchas

- Return only booleans; anything else may lead to unexpected behavior (the code casts the rendered output with a boolean filter).
- The docs' line-item example reads a bare `lineItem.referenceId` in the `LineItemScope` branch, but the script context holds only `scope` and the constraint values; use `scope.lineItem`.
- For `>`, `>=`, `<`, `<=` an array `comparable` is reduced to its first element.

## Version notes

- App rule conditions were introduced in Shopware 6.4.12.0.

## Code check (6.7.15.1)
- confirmed `rule-condition` — allows identifier, name, group, script, constraints — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:606
- confirmed `group` — element of a rule condition — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:610
- confirmed `rule-conditions` — script directory read on app install — vendor/shopware/core/Framework/App/Lifecycle/Handler/RuleConditionLifecycleHandler.php:40
- confirmed `ScriptRule::match()` — context is `scope` plus constraint values — vendor/shopware/core/Framework/Rule/ScriptRule.php:53
- confirmed `compare` — Twig function registered for scripts — vendor/shopware/core/Framework/Adapter/Twig/Extension/ComparisonExtension.php:21
- confirmed `ComparisonExtension::compare()` — arrays matched by intersection for `=`/`!=` — vendor/shopware/core/Framework/Adapter/Twig/Extension/ComparisonExtension.php:25
- confirmed `RuleScope::getCurrentTime()` — returns the current time — vendor/shopware/core/Framework/Rule/RuleScope.php:17
- confirmed `LineItemScope::getLineItem()` — line-item scope accessor — vendor/shopware/core/Checkout/Cart/Rule/LineItemScope.php:20
- confirmed `CartRuleScope::getCart()` — cart scope accessor — vendor/shopware/core/Checkout/Cart/Rule/CartRuleScope.php:20
