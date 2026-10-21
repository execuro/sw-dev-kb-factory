---
id: platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md
title: Add Custom Rules
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/rule/add-custom-rules.html
sourceHash: 2f56b30c0124b4cd550511a4afa25f693ddd9960
codeCheckedAgainst: "6.7.15.1"
keywords: ["Rule", "RuleScope", "RuleConfig", "shopware.rule.definition", "ruleConditionDataProviderService", "addCondition", "upsertGroup", "addAwarenessConfiguration", "sw-condition-base", "sw-condition-generic", "sw-select-rule-create", "rule builder", "custom condition", "context awareness"]
summary: Custom Rule Builder condition - PHP Rule subclass tagged shopware.rule.definition, registered in the admin via ruleConditionDataProviderService.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/rule-system/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-rule-assignment-configuration.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How a plugin adds its own Rule Builder condition: a PHP class extending `Shopware\Core\Framework\Rule\Rule` that evaluates the condition, registered in the DI container, plus an Administration integration so shop owners can configure it. The worked example is `FirstMondayOfTheMonthRule` (`first_monday`), matching on the first Monday of each month. Background: [Rule system](platform/dev/6.7/concepts/framework/rule-system/_index.md).

## When to use

You need rules (for prices, shipping methods, promotions, flows) to react to a condition Shopware does not ship.

## Key steps / config

1. PHP rule class in `<plugin root>/src/Core/Rule`, extending `Shopware\Core\Framework\Rule\Rule`. It must implement the abstract `match()` and `getConstraints()`; `getName()` returns the unique technical name (the base implementation reads a `RULE_NAME` constant, so either override `getName()` or set that constant):

   ```php
   class FirstMondayOfTheMonthRule extends Rule
   {
       protected bool $isFirstMondayOfTheMonth;
       public function __construct() { parent::__construct(); $this->isFirstMondayOfTheMonth = false; }
       public function getName(): string { return 'first_monday'; }
       public function match(RuleScope $scope): bool { /* ... */ }
       public function getConstraints(): array
       {
           return ['isFirstMondayOfTheMonth' => [new Type('bool')]];
       }
   }
   ```

   The constructor only sets the default expected value; the value configured in the Administration overwrites it at runtime. Return `NotBlank` in `getConstraints()` to make a field required.

2. Register the class as a service and tag it `shopware.rule.definition`.

3. Optional: override `getConfig(): ?RuleConfig`, e.g. `return (new RuleConfig())->booleanField('isFirstMondayOfTheMonth');`. The Administration then renders the generic `sw-condition-generic` component and steps 5–6 can be skipped.

4. Administration: in `<plugin root>/src/Resources/app/administration/src/decorator/rule-condition-service-decoration.js` decorate the service and import that file from `src/main.js`:

   ```javascript
   Shopware.Application.addServiceProviderDecorator('ruleConditionDataProviderService', (ruleConditionService) => {
       ruleConditionService.upsertGroup('days_of_the_month', { id: 'days_of_the_month', name: 'Days of the month' });
       ruleConditionService.addCondition('first_monday', {
           component: 'swag-first-monday',
           label: 'Is first monday of the month',
           scopes: ['global'],
           group: 'days_of_the_month',
       });
       return ruleConditionService;
   });
   ```

   The condition name must equal the PHP `getName()` value.

5. Component `swag-first-monday` (`src/core/component/swag-first-monday/index.js`): `Shopware.Component.extend('swag-first-monday', 'sw-condition-base', { template, computed: { selectValues, isFirstMondayOfTheMonth } })`; the getter/setter call `this.ensureValueExist()` and read/write `this.condition.value.isFirstMondayOfTheMonth`.

6. Template `swag-first-monday.html.twig` overrides block `sw_condition_value_content` with an `sw-single-select` bound via `:options="selectValues"` and `v-model:value="isFirstMondayOfTheMonth"`.

7. Context awareness (restrict where rules containing the condition may be assigned):

   ```javascript
   ruleConditionService.addAwarenessConfiguration('productPrices', {
       notEquals: ['first_monday'],
       equalsAny: [],
       snippet: 'sw-restricted-rules.restrictedAssignment.productPrices',
   });
   ```

   Existing config: `getAwarenessConfigurationByAssignmentName('productPrices')`. Assignment names are the rule associations in `Shopware\Core\Content\Rule\RuleDefinition`. For new rule selects use `sw-select-rule-create` with `rule-aware-group-key="productPrices"`.

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule` — `match(RuleScope $scope): bool`, `getConstraints(): array`, `getName(): string`, `getConfig(): ?RuleConfig`
- `Shopware\Core\Framework\Rule\RuleScope` — `$scope->getSalesChannelContext()`
- `shopware.rule.definition` (service tag)
- `$context->getRuleIds()` — IDs of active rules
- `ruleConditionDataProviderService` — `addCondition`, `upsertGroup`, `addAwarenessConfiguration`, `getAwarenessConfigurationByAssignmentName`
- Admin components: `sw-condition-base`, `sw-condition-generic`, `sw-select-rule-create`; block `sw_condition_value_content`
- `Shopware\Core\Content\Rule\RuleDefinition`

## Gotchas

- Rule properties used as condition values must be `protected`, not `private`.
- Never run database queries or other slow work in `match()`; evaluate only from the `RuleScope` (e.g. `$scope->getSalesChannelContext()->getCustomer()`).
- With boolean values in `selectValues`, the docs advise returning strings.
- Rules are context-aware (since 6.5.0.0): rules containing your condition may be disabled in places like the promotion module because of awareness configuration. `notEquals` lists conditions that must not occur; `equalsAny` requires at least one listed condition.
- For entity-based multi-select values, see `sw-entity-multi-select` under `src/app/component/form/select/entity/` in the Administration.

## Code check (6.7.15.1)
- confirmed `Rule::match()` — abstract, `(RuleScope $scope): bool` — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract, returns constraint lists per property — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `Rule::getName()` — default throws unless `RULE_NAME` is set — vendor/shopware/core/Framework/Rule/Rule.php:48
- confirmed `Rule::getConfig()` — returns `?RuleConfig`, null by default — vendor/shopware/core/Framework/Rule/Rule.php:79
- confirmed `RuleConfig::booleanField()` — vendor/shopware/core/Framework/Rule/RuleConfig.php:145
- confirmed `shopware.rule.definition` — tag on core rules — vendor/shopware/core/Checkout/DependencyInjection/rule.php:103
- confirmed `ruleConditionDataProviderService` — registered service provider — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:155
- confirmed `addAwarenessConfiguration` — `(assignmentName, configuration)` with `notEquals`/`equalsAny`/`snippet` — vendor/shopware/administration/Resources/app/administration/src/app/service/rule-condition.service.ts:556
- confirmed `sw_condition_value_content` — block in `sw-condition-base` template — vendor/shopware/administration/Resources/app/administration/src/app/component/rule/sw-condition-base/sw-condition-base.html.twig:19
- confirmed `ruleAwareGroupKey` — prop of `sw-select-rule-create` — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-select-rule-create/index.js:52
