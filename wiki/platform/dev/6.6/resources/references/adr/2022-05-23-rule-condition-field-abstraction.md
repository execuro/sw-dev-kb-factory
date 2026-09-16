---
id: "platform/dev/6.6/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md"
title: "Rule condition field abstraction"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-05-23-rule-condition-field-abstraction.html"
sourceHash: "2318312598404de251118baa4ae69f68b567ec78"
keywords: ["RuleConfig", "getConfig", "Rule::getConfig", "sw-condition-generic", "sw-condition-generic-line-item", "shopware.rule.definition", "rule builder", "rule condition", "administration", "Vue component", "operatorSet", "entitySelectField"]
summary: "ADR: Rule Builder conditions can implement Rule::getConfig() returning RuleConfig to use a generic Vue component instead of a custom one."
lastBuilt: "2026-09-15"
---
## What it is
ADR to reduce the number of custom Vue components for Rule Builder conditions by introducing a single generic, abstracted condition component driven by configuration.

## When to use
When adding a new Rule Builder condition whose fields fit common patterns (select, boolean, number, date, entity) and don't need bespoke administration UI behavior.

## Key steps / config
- Conditions consist of a `shopware.rule.definition` tagged service plus a Vue component; many of these components follow a common scheme.
- A rule condition can implement a new method `getConfig(): RuleConfig`, describing the operator set and fields for the generic component to render.

```php
public function getConfig(): RuleConfig
{
    return (new RuleConfig())
        ->operatorSet(RuleConfig::OPERATOR_SET_STRING, false, true)
        ->entitySelectField('customerGroupIds', CustomerGroupDefinition::ENTITY_NAME, true)
        ->selectField('customSelect', ['foo', 'bar', 'baz'])
        ->numberField('amount', ['unit' => RuleConfig::UNIT_DIMENSION])
        ->booleanField('active')
        ->dateTimeField('creationDate');
}
```
- The administration requests and stores the per-condition configuration, then renders it with the generic condition component.
- Conditions needing functionality beyond the generic component may still register and use their own custom component, as before.

## Essential identifiers
`RuleConfig`, `Rule::getConfig()`, `shopware.rule.definition`, `sw-condition-generic`, `sw-condition-generic-line-item`.

## Gotchas
Original per-condition components are deprecated and scheduled for removal in the next major release; extenders of those components should switch to `sw-condition-generic`/`sw-condition-generic-line-item` and branch on `this.condition.type`.
