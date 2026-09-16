---
id: platform/dev/6.6/guides/plugins/plugins/framework/rule/add-custom-rules.md
title: Add custom rules
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/rule/add-custom-rules.html"
sourceHash: "cc14d6a7b9bfaa96ac175bb4fa9f256a1300db5c"
keywords: ["custom rule", "Rule Builder", "Rule class", "match", "getName", "getConstraints", "RuleScope", "shopware.rule.definition", "RuleConditionService", "addCondition", "sw-condition-base", "context awareness", "awarenessConfiguration", "getRuleIds"]
summary: "Add a custom rule: a PHP Rule class registered as shopware.rule.definition, plus an Administration condition component."
lastBuilt: "2026-09-15"
---
## What it is

A guide on creating custom rules for the Rule Builder, using a worked example rule that
checks whether the current date is the first Monday of the month. It covers both the backend
(PHP) rule logic and the Administration UI needed to manage it.

## When to use

Use this guide when a plugin needs a rule condition that the built-in Rule Builder conditions
do not cover — the shop owner can then combine it with other conditions to react to it, for
example with special prices or dispatch methods.

## Key steps / config

1. Create a class extending `Shopware\Core\Framework\Rule\Rule`, implementing `getName()`
   (a unique technical name), `match(RuleScope $scope): bool` (the actual condition logic),
   and `getConstraints(): array` (the field/type map, e.g. `['isFirstMondayOfTheMonth' =>
   [new Type('bool')]]`). Fields used by the rule must be declared `protected`, not `private`.
2. Register the class in `services.xml` and tag it `shopware.rule.definition`.
3. Optionally provide `getConfig(): RuleConfig` (e.g.
   `(new RuleConfig())->booleanField('isFirstMondayOfTheMonth')`) to render a generic
   `sw-condition-generic` component instead of writing a custom Administration component.
4. To show the rule in the Administration, decorate `ruleConditionDataProviderService`
   (the `RuleConditionService`) and call `addCondition('first_monday', { component,
   label, scopes })`, importing the decorator from a plugin `main.js`.
5. Optionally group conditions with `ruleConditionService.upsertGroup(...)` and a `group`
   property on the condition.
6. Build the custom component (e.g. `swag-first-monday`), extending `sw-condition-base`.
7. Build the component's Twig template, overriding the `sw_condition_value_content` block.

```javascript
Shopware.Application.addServiceProviderDecorator('ruleConditionDataProviderService', (ruleConditionService) => {
    ruleConditionService.addCondition('first_monday', {
        component: 'swag-first-monday',
        label: 'Is first monday of the month',
        scopes: ['global'],
    });
    return ruleConditionService;
});
```

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule`, `Shopware\Core\Framework\Rule\RuleScope`
- `getName()`, `match()`, `getConstraints()`, `getConfig()`
- `shopware.rule.definition` — the DI tag for registering a rule
- `RuleConditionService` (DI id `ruleConditionDataProviderService`) — `addCondition()`,
  `upsertGroup()`, `getAwarenessConfigurationByAssignmentName()`,
  `addAwarenessConfiguration()`
- `sw-condition-base`, `sw-select-rule-create`, `rule-aware-group-key`
- `Shopware\Core\Content\Rule\RuleDefinition` — lists all possible assignment relations
- `Context::getRuleIds()` — returns all currently active rule IDs

## Gotchas

Never execute database queries or other time-consuming operations inside `match()` — it
directly impacts store performance; stick to the rule scope when evaluating a match. A newly
added condition may not be selectable everywhere in the Administration (e.g. inside the
promotion module) because rules are "context-aware" — restrictions are configured via
`addAwarenessConfiguration`'s `notEquals`/`equalsAny` options and a `snippet`.

## Version notes

Rule context-awareness (restricting where a rule with a given condition can be assigned) is
available from version 6.5.0.0 or above.
