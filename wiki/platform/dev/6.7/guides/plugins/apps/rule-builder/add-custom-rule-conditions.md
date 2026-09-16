---
id: platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md
title: Add Custom Rule Conditions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/rule-builder/add-custom-rule-conditions.html
sourceHash: 2fff11735ea3a737e6107a20aa368161b9833f7b
codeCheckedAgainst: "6.7.13.0"
keywords: ["rule-conditions", "rule-condition", "rule builder", "custom condition", "app rule condition", "RuleScope", "LineItemScope", "compare", "getCurrentTime", "constraints", "twig script", "manifest.xml"]
summary: App rule conditions for the Rule Builder via rule-condition in manifest.xml, constraint fields and boolean Twig scripts with the compare helper.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/rule-system/_index.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md", "platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md"]
---
## What it is

Apps can add custom conditions to the [Rule Builder](platform/dev/6.7/concepts/framework/rule-system/_index.md): each condition is declared in `manifest.xml` with Administration fields (constraints) and its logic is a sandboxed Twig script, using the same approach as [App Scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md). Supported since Shopware 6.4.12.0.

## When to use

An app needs rule logic that the built-in conditions do not cover (customer attributes, line-item checks, date rules) for use in rules for pricing, shipping, promotions, flows, etc.

## Key steps / config

1. Declare conditions inside `rule-conditions` in `manifest.xml` (skeleton; the script file element is described below):

```xml
<rule-conditions>
  <rule-condition>
    <identifier>line_item_condition</identifier>
    <name>Custom product multi select</name>
    <group>item</group>
    <constraints>
      <single-select name="operator">...</single-select>
      <multi-entity-select name="productIds"><entity>product</entity><required>true</required></multi-entity-select>
    </constraints>
  </rule-condition>
</rule-conditions>
```

   - Required: `identifier` (technical name unique within the app; used to match existing conditions on update, do not change it), `name` (translatable, shown in the condition selection), and the `script` element holding the file name with extension, e.g. `custom-condition.twig`.
   - Optional: `group` (e.g. `item`, `misc`) and `constraints` — a collection of [custom fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md); a field's `name` attribute becomes the script variable with its value. Fields may be `required`.
2. Place scripts in `Resources/scripts/rule-conditions/` of the app.
3. Script rules: the `scope` variable is a `RuleScope` (gives `salesChannelContext`, the cart in cart scopes, `lineItem` in `LineItemScope`, `getCurrentTime()`); constraint values are extra variables. The script must return a boolean via `{% return ... %}`.
4. Helper `compare(operator, value, comparable)`; operator one of `=`, `!=`, `>`, `>=`, `<`, `<=`, `empty`.

```twig
{% if scope.salesChannelContext.customer is not defined %}
    {% return false %}
{% endif %}
{% return compare(operator, scope.salesChannelContext.customer.firstName, firstName) %}
```

## Essential identifiers

- `rule-conditions`, `rule-condition`, `identifier`, `name`, `group`, `constraints`
- `Resources/scripts/rule-conditions`
- `scope`, `RuleScope`, `LineItemScope`, `getCurrentTime()`
- `compare(operator, value, comparable)`

## Gotchas

- Returning anything but a boolean may lead to unexpected behavior.
- With an array `comparable`, use only `=`/`!=` (matches if at least one value occurs in the other array). For other operators the installed code silently compares against the first array element only.
- Use variable-friendly, unique constraint names per condition.
- The stored condition identifier is prefixed with the app name (`app\<AppName>_<identifier>`), so identifiers only need to be unique within the app.

## Version notes

- App rule conditions exist since Shopware 6.4.12.0; not supported before.

## Code check (6.7.13.0)
- confirmed `rule-condition` — manifest schema element under rule-conditions — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:590
- confirmed `group` — optional group element in rule-condition — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:597
- confirmed `CONDITION_SCRIPT_DIR` — scripts read from Resources/scripts/rule-conditions — vendor/shopware/core/Framework/App/Lifecycle/Handler/RuleConditionLifecycleHandler.php:39
- confirmed `identifier` — persisted as app\<AppName>_<identifier> — vendor/shopware/core/Framework/App/Lifecycle/Handler/RuleConditionLifecycleHandler.php:101
- confirmed `ScriptRule::match()` — exposes scope plus constraint values as variables — vendor/shopware/core/Framework/Rule/ScriptRule.php:56
- confirmed `RuleScope` — abstract scope class — vendor/shopware/core/Framework/Rule/RuleScope.php:11
- confirmed `RuleScope::getCurrentTime()` — returns DateTimeImmutable — vendor/shopware/core/Framework/Rule/RuleScope.php:17
- confirmed `LineItemScope` — extends CheckoutRuleScope — vendor/shopware/core/Checkout/Cart/Rule/LineItemScope.php:11
- confirmed `compare` — Twig function registered by ComparisonExtension — vendor/shopware/core/Framework/Adapter/Twig/Extension/ComparisonExtension.php:21
- corrected `ComparisonExtension::compare()` — docs: arrays only for = and != ; code falls back to the first array element for other operators — vendor/shopware/core/Framework/Adapter/Twig/Extension/ComparisonExtension.php:25
