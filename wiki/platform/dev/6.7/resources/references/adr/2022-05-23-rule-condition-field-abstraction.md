---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md
sourceHash: 2318312598404de251118baa4ae69f68b567ec78
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-05-23-rule-condition-field-abstraction.html
title: Rule condition field abstraction
version: "6.7"
versions:
  - "6.7"
keywords: ["rule builder", "rule condition", "RuleConfig", "Rule::getConfig()", "operatorSet", "entitySelectField", "sw-condition-generic", "sw-condition-generic-line-item", "shopware.rule.definition", "api.info.rule-config", "generic condition component", "admin rule component", "adr"]
summary: "ADR: rule conditions describe operators and fields via Rule::getConfig() returning RuleConfig, rendered by the generic sw-condition-generic admin component."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-05-23). A Rule Builder condition consists of a PHP service tagged `shopware.rule.definition` and a matching Vue component in the Administration. Most of those components followed the same pattern, so this record replaces them with one generic component. The condition describes its operators and fields in PHP, and the generic component renders them.

## When to use

- You are adding a custom rule condition and want to avoid writing an administration component for it.
- You maintain an extension that used or extended one of the old per-condition admin components.

## Key steps / config

1. Register the condition class (extends `Shopware\Core\Framework\Rule\Rule`) as a service tagged `shopware.rule.definition`.
2. Override `getConfig()`. The base `Rule::getConfig(): ?RuleConfig` returns `null`, which means no generic config. Return a `Shopware\Core\Framework\Rule\RuleConfig` built with its fluent methods:

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

- `operatorSet(array $operators, bool $addEmptyOperator = false, bool $isMatchAny = false)`. Sets: `OPERATOR_SET_DEFAULT`, `OPERATOR_SET_STRING`, `OPERATOR_SET_NUMBER`, `OPERATOR_SET_DATE`.
- Field builders: `entitySelectField`, `selectField`, `stringField`, `numberField`, `intField`, `dateField`, `dateTimeField`, `booleanField`, `taggedField`, and the generic `field(name, type, config)`.
- Units for `numberField`: `UNIT_DIMENSION`, `UNIT_WEIGHT`, `UNIT_VOLUME`, `UNIT_LENGTH`, `UNIT_TIME`, `UNIT_AGE`.

3. The Administration requests all condition configs from `GET /api/_info/rule-config` (`api.info.rule-config`) and stores them. `sw-condition-generic` then renders the fields for any condition that has a config.
4. If a condition needs behaviour the generic component cannot provide, it can still register its own custom component.

## Essential identifiers

- `Shopware\Core\Framework\Rule\RuleConfig`, `Rule::getConfig()`
- Service tag `shopware.rule.definition`
- Route `api.info.rule-config` (`/api/_info/rule-config`)
- Admin components `sw-condition-generic`, `sw-condition-generic-line-item`; `this.condition.type`

## Gotchas

- The original per-condition components were deprecated for removal in the next major. If you used or extended one, use or extend `sw-condition-generic` or `sw-condition-generic-line-item` instead, and check `this.condition.type` for behaviour specific to one condition type.
- Shopware's PHPStan rule `RuleConditionHasRuleConfigRule` (identifier `shopware.ruleConfig`) reports a rule class that neither implements `getConfig()` nor has its own admin component. It also reports a class that does both.

## Code check (6.7.15.1)
- confirmed `Rule::getConfig()` — base returns `?RuleConfig`, default `null` — vendor/shopware/core/Framework/Rule/Rule.php:79
- confirmed `RuleConfig::operatorSet()` — signature with `$addEmptyOperator`, `$isMatchAny` — vendor/shopware/core/Framework/Rule/RuleConfig.php:63
- confirmed `RuleConfig::entitySelectField()` — entity select field builder — vendor/shopware/core/Framework/Rule/RuleConfig.php:78
- confirmed `RuleConfig::OPERATOR_SET_STRING` — `eq`/`neq` operator set — vendor/shopware/core/Framework/Rule/RuleConfig.php:13
- confirmed `RuleConfig::UNIT_DIMENSION` — unit constant `dimension` — vendor/shopware/core/Framework/Rule/RuleConfig.php:36
- confirmed `RuleConfig::dateTimeField()` — datetime field builder — vendor/shopware/core/Framework/Rule/RuleConfig.php:137
- confirmed `shopware.rule.definition` — tag collected by the rule registry — vendor/shopware/core/Framework/DependencyInjection/rule.php:29
- confirmed `api.info.rule-config` — admin endpoint for condition configs — vendor/shopware/core/Framework/Rule/Api/RuleConfigController.php:32
- confirmed `sw-condition-generic-line-item` — generic line-item condition component — vendor/shopware/administration/Resources/app/administration/src/app/decorator/condition-type-data-provider.decorator.ts:58
- confirmed `RuleConditionHasRuleConfigRule` — PHPStan rule enforcing getConfig or component — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/rules.neon:5
