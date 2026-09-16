---
id: platform/dev/6.7/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md
title: Rule condition field abstraction
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-05-23-rule-condition-field-abstraction.html
sourceHash: 2318312598404de251118baa4ae69f68b567ec78
codeCheckedAgainst: "6.7.13.0"
keywords: ["rule builder", "rule condition", "RuleConfig", "Rule::getConfig()", "shopware.rule.definition", "sw-condition-generic", "sw-condition-generic-line-item", "operatorSet", "entitySelectField", "condition component", "administration", "adr"]
summary: "ADR: rule conditions return a RuleConfig from Rule::getConfig() so the admin renders them via sw-condition-generic instead of a custom Vue component."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2022-05-23, area services-settings) replacing most per-condition Vue components in the Rule Builder with one generic, config-driven component. A rule condition is a `shopware.rule.definition` tagged service plus an administration component; conditions that fit the common scheme now describe their operators and fields in PHP.

## When to use

When adding a new Rule Builder condition in a plugin or core, or when extending one of the old condition-type components in the administration.

## Key steps / config

1. Implement `getConfig()` in the rule condition class (extending `Shopware\Core\Framework\Rule\Rule`, autoconfigured with tag `shopware.rule.definition`) and return a `RuleConfig`. The base implementation returns `null`, meaning no generic config.
2. Define operators and fields with the fluent `RuleConfig` API:

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

   Signatures: `operatorSet(array $operators, bool $addEmptyOperator = false, bool $isMatchAny = false)`, `entitySelectField(string $name, string $entity, bool $multi = false, array $config = [])`, `selectField(string $name, array $options, bool $multi = false, array $config = [])`, `numberField`/`dateTimeField`/`booleanField(string $name, array $config = [])`.
3. The administration requests and stores the configurations; `sw-condition-generic` renders the fields from them.
4. If the condition needs functionality beyond the generic component, it may still register its own custom component.

## Essential identifiers

- `Shopware\Core\Framework\Rule\RuleConfig`
- `Rule::getConfig()`
- `RuleConfig::OPERATOR_SET_STRING`, `RuleConfig::UNIT_DIMENSION`
- service tag `shopware.rule.definition`
- admin components `sw-condition-generic`, `sw-condition-generic-line-item`

## Gotchas

- If you used or extended an original condition component, switch to `sw-condition-generic` or `sw-condition-generic-line-item` and branch on `this.condition.type` for type-specific changes.
- Core ships a PHPStan rule `RuleConditionHasRuleConfigRule` that checks rule conditions for a rule config.

## Version notes

The original condition components are deprecated; in the installed administration they carry `@deprecated tag:v6.8.0 - Will be removed. Use sw-condition-generic instead.`

## Code check (6.7.13.0)
- confirmed `Rule::getConfig()` — returns ?RuleConfig, default null — vendor/shopware/core/Framework/Rule/Rule.php:79
- confirmed `RuleConfig::OPERATOR_SET_STRING` — constant exists — vendor/shopware/core/Framework/Rule/RuleConfig.php:13
- confirmed `RuleConfig::UNIT_DIMENSION` — value 'dimension' — vendor/shopware/core/Framework/Rule/RuleConfig.php:36
- confirmed `RuleConfig::operatorSet()` — (operators, addEmptyOperator, isMatchAny) — vendor/shopware/core/Framework/Rule/RuleConfig.php:63
- confirmed `RuleConfig::entitySelectField()` — (name, entity, multi, config) — vendor/shopware/core/Framework/Rule/RuleConfig.php:78
- confirmed `RuleConfig::selectField()` — (name, options, multi, config) — vendor/shopware/core/Framework/Rule/RuleConfig.php:91
- confirmed `RuleConfig::booleanField()` — (name, config) — vendor/shopware/core/Framework/Rule/RuleConfig.php:145
- confirmed `shopware.rule.definition` — autoconfigured tag for Rule subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:142
- confirmed `sw-condition-generic` — generic condition component — vendor/shopware/administration/Resources/app/administration/src/app/component/rule/condition-type/sw-condition-generic/index.js:14
- confirmed `RuleConditionHasRuleConfigRule` — PHPStan rule registered — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/rules.neon:5
