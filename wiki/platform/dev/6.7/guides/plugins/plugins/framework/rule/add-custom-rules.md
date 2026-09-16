---
id: platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md
title: Add Custom Rules
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/rule/add-custom-rules.html
sourceHash: e0efe78e7cfc851b9539b955cd16c4c6be55b267
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom rule", "rule builder", "condition", "Shopware\\Core\\Framework\\Rule\\Rule", "RuleScope", "RuleConfig", "shopware.rule.definition", "ruleConditionDataProviderService", "addCondition", "upsertGroup", "addAwarenessConfiguration", "sw-condition-base", "sw-select-rule-create", "rule-aware-group-key", "context awareness"]
summary: Custom Rule Builder condition - PHP class extending Rule (match, getConstraints) tagged shopware.rule.definition, plus admin addCondition and awareness config.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/rule-system/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-rule-assignment-configuration.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md"]
---
## What it is

How a plugin adds a custom Rule Builder condition: a PHP rule class holding the matching logic, plus its Administration integration (condition registration, component and template) and optional "context awareness" restrictions. The example rule `first_monday` matches on the first Monday of the month. Prerequisites: [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md), [Dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md), [Rule system concept](platform/dev/6.7/concepts/framework/rule-system/_index.md).

## When to use

The shop owner needs a rule condition (for prices, promotions, shipping/payment methods) that the built-in conditions do not provide.

## Key steps / config

1. PHP rule class in `<plugin root>/src/Core/Rule`, extending `Shopware\Core\Framework\Rule\Rule`. The two abstract members `match()` and `getConstraints()` are required; the name comes from `getName()`, which the base class resolves from `RULE_NAME` (define the constant or override `getName()`):
   ```php
   class FirstMondayOfTheMonthRule extends Rule
   {
       final public const RULE_NAME = 'first_monday';
       protected bool $isFirstMondayOfTheMonth = false; // protected, not private
       public function match(RuleScope $scope): bool { /* ... */ }
       public function getConstraints(): array
       {
           return ['isFirstMondayOfTheMonth' => [new Type('bool')]];
       }
   }
   ```
   `getConstraints()` maps each field to its constraints (add `NotBlank` to require it). Evaluate only from the scope, e.g. `$scope->getSalesChannelContext()->getCustomer()`.
2. Register the class in the plugin's `services.php` with tag `shopware.rule.definition` (autoconfigured services extending `Rule` get the tag automatically).
3. Optional: override `getConfig(): ?RuleConfig`, e.g. `return (new RuleConfig())->booleanField('isFirstMondayOfTheMonth');` — the Administration then renders the generic `sw-condition-generic` component and steps 5–6 can be skipped.
4. Administration: in `src/Resources/app/administration/src/decorator/rule-condition-service-decoration.js` (imported from `main.js`) decorate the service:
   ```javascript
   Shopware.Application.addServiceProviderDecorator('ruleConditionDataProviderService', (ruleConditionService) => {
       ruleConditionService.upsertGroup('days_of_the_month', { id: 'days_of_the_month', name: 'Days of the month' });
       ruleConditionService.addCondition('first_monday', {
           component: 'swag-first-monday', label: '...', scopes: ['global'], group: 'days_of_the_month',
       });
       return ruleConditionService;
   });
   ```
   The condition type must equal the PHP rule name.
5. Component `swag-first-monday` in `src/core/component/swag-first-monday/index.js`: `Shopware.Component.extend('swag-first-monday', 'sw-condition-base', { template, computed: { selectValues, isFirstMondayOfTheMonth } })`; the getter/setter call `this.ensureValueExist()` and read/write `this.condition.value.isFirstMondayOfTheMonth`.
6. Template `swag-first-monday.html.twig` overrides block `sw_condition_value_content` with an `sw-single-select` bound to `selectValues` and `v-model="isFirstMondayOfTheMonth"`.
7. Context awareness: inside the decorator, `ruleConditionService.getAwarenessConfigurationByAssignmentName('productPrices')` reads the current config; `addAwarenessConfiguration('productPrices', { notEquals: ['first_monday'], equalsAny: [], snippet: 'sw-restricted-rules.restrictedAssignment.productPrices' })` restricts it. Assignment names are the associations of `Shopware\Core\Content\Rule\RuleDefinition`.
8. For your own rule selects use `<sw-select-rule-create rule-aware-group-key="productPrices" @save-rule="...">`, which disables restricted rules automatically.

Active rules of a context: `$context->getRuleIds()`.

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule`, `RuleScope`, `RuleConfig`, `Shopware\Core\Content\Rule\RuleDefinition`
- Tag `shopware.rule.definition`
- `ruleConditionDataProviderService`: `addCondition`, `upsertGroup`, `getAwarenessConfigurationByAssignmentName`, `addAwarenessConfiguration`
- Components `sw-condition-base`, `sw-condition-generic`, `sw-select-rule-create` (prop `rule-aware-group-key`), block `sw_condition_value_content`

## Gotchas

- Never run database queries or other slow operations in `match()`; use only the rule scope.
- Rule properties must be `protected`, not `private`.
- Code, not docs: the source overrides `getName()` returning `'first_monday'`; in 6.7.13.0 the base `getName()` reads `static::RULE_NAME` and throws `RuleException::ruleNameNotImplemented()` if neither is provided. The base constructor calls `getName()`.
- For boolean select values the source advises returning strings.
- Rules with the new condition may be unselectable in some modules (e.g. promotions) because of context awareness.
- Entity multi-select example: `src/app/component/form/select/entity/sw-entity-multi-select`.

## Version notes

- Context awareness is available from 6.5.0.0.

## Code check (6.7.13.0)
- confirmed `Rule::match()` — abstract, required — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract, required — vendor/shopware/core/Framework/Rule/Rule.php:74
- corrected `Rule::getName()` — docs: must be implemented; base reads `RULE_NAME` — vendor/shopware/core/Framework/Rule/Rule.php:48
- confirmed `Rule::getConfig()` — optional `?RuleConfig` — vendor/shopware/core/Framework/Rule/Rule.php:79
- confirmed `RuleConfig::booleanField()` — exists — vendor/shopware/core/Framework/Rule/RuleConfig.php:145
- confirmed `shopware.rule.definition` — autoconfigured for `Rule` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:142
- confirmed `addCondition` — RuleConditionService method — vendor/shopware/administration/Resources/app/administration/src/app/service/rule-condition.service.ts:292
- confirmed `addAwarenessConfiguration` — RuleConditionService method — vendor/shopware/administration/Resources/app/administration/src/app/service/rule-condition.service.ts:603
- confirmed `ruleAwareGroupKey` — prop of sw-select-rule-create — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-select-rule-create/index.js:60
- confirmed `sw_condition_value_content` — block in sw-condition-base — vendor/shopware/administration/Resources/app/administration/src/app/component/rule/sw-condition-base/sw-condition-base.html.twig:19
