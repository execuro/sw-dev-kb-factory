---
id: platform/dev/6.6/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md
title: How to add a new approval condition
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.html
sourceHash: 4471a1411aa99b85a5431a6511602697de92e43a
keywords: ["approval condition", "order approval", "shopware.approval_rule.definition", "CartAmountRule", "RuleConfig", "rule-conditions manifest", "approval-rule-conditions", "app scripts", "custom rule condition", "manifest.xml", "single-select", "multi-select"]
summary: "Add a custom order-approval condition via a plugin Rule class tagged shopware.approval_rule.definition, or via an app's rule-conditions manifest and script."
lastBuilt: "2026-09-15"
relatedPages:
  - "platform/dev/6.6/guides/plugins/plugins/framework/rule/add-custom-rules.md"
  - "platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md"
---
## What it is

The order approval component ships a set of built-in conditions for approval rules. This page covers adding a new condition either from a plugin or from an app, since neither ships an extension point for the other.

## When to use

Use this when the default approval rule conditions are not enough and you need a custom condition, available either as a plugin `Rule` class or (since Commercial plugin 6.4.0) an app-based rule-builder condition with App Scripts logic.

## Key steps / config

Plugin approach — extend `Rule` following [Add custom rule](platform/dev/6.6/guides/plugins/plugins/framework/rule/add-custom-rules.md), then register the service tagged `shopware.approval_rule.definition`:

```xml
<service id="YourPluginNameSpace\CartAmountRule" public="true">
   <tag name="shopware.approval_rule.definition"/>
</service>
```

App approach — follows [Add custom rule conditions](platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md). The condition is declared in the app's `manifest.xml` (`identifier`, `name`, `script`), and its logic lives in a Twig script under `Resources/scripts/approval-rule-conditions/` (the `script` path in the manifest must include the `/approval-rule-conditions/` prefix):

```text
DemoApp/
  Resources/scripts/approval-rule-conditions/custom-condition.twig
  manifest.xml
```

The manifest's `constraints` tag fields render as `operators`/`value` inputs; value fields support `float`, `int`, `text`, `single-select`, `multi-select`. Example script:

```twig
{% if scope.cart is not defined %}
    {% return false %}
{% endif %}
{% return compare(operator, scope.cart.price.totalPrice, amount) %}
```

## Essential identifiers

- `shopware.approval_rule.definition` (service tag, plugin approach)
- `RuleConfig`, `RuleConstraints`, `RuleComparison`, `RuleScope`, `CartRuleScope`
- `Resources/scripts/approval-rule-conditions/` (app script directory)
- `manifest.xml` `<rule-condition>` element with `identifier`, `name`, `group`, `constraints`

## Gotchas

Approval rule conditions for apps were introduced in Commercial plugin 6.4.0 and are not supported in earlier versions.
