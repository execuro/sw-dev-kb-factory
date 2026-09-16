# `dev-20` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-20` · `dev` · `Events` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-12-21` |
| Core version | `6.7.13.0` |

**Query:** How do I add my own condition to the Rule Builder from a plugin so shop owners can select it?

**Expected answer — every fact an answer must contain:**

1. The PHP side is a class extending `Shopware\Core\Framework\Rule\Rule` that implements the two abstract methods `match(RuleScope $scope): bool` and `getConstraints(): array`, and declares a unique `RULE_NAME` constant — `getName()` is not abstract, it returns `static::RULE_NAME` and throws when the constant was not overridden. `getConfig(): ?RuleConfig` is optional and defaults to `null`.  `[code: Framework/Rule/Rule.php:12,45-57,59-82]`
2. Register the class as a service with the tag `shopware.rule.definition`. The tag is consumed as a `tagged_iterator` by `RuleConditionRegistry` (an unknown name throws `InvalidConditionException`) and by `RuleConfigController`, which serves `GET /api/_info/rule-config`.  `[code: Framework/DependencyInjection/rule.xml:6-14]`
3. Administration registration is a separate, mandatory second step — the PHP tag alone does not make the condition selectable. Decorate `ruleConditionDataProviderService` via `Shopware.Application.addServiceProviderDecorator` and call `addCondition(type, { component, label, scopes, group })` with `type` equal to `RULE_NAME`. Returning a `RuleConfig` from `getConfig()` lets you pass the generic component `sw-condition-generic` instead of writing a component that extends `sw-condition-base`.  `[code: (administration) Resources/app/administration/src/app/decorator/condition-type-data-provider.decorator.ts:83-91,953-979]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/rule/add-custom-rules.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `match()` and `getConstraints()` are abstract on `Rule`; `getConfig()` defaults to `null` | `Framework/Rule/Rule.php:59-82` | `abstract public function match(RuleScope $scope): bool;` … `abstract public function getConstraints(): array;` … `public function getConfig(): ?RuleConfig { return null; }` |
| `getName()` is concrete and reads `static::RULE_NAME`, throwing when it is `null` | `Framework/Rule/Rule.php:12,45-57` | `public const RULE_NAME = null;` … `if ($ruleName === null) { throw RuleException::ruleNameNotImplemented(); }` |
| Registration tag used by all 100+ core rules | `Framework/DependencyInjection/rule.xml:12-14` | `<service id="Shopware\Core\Framework\Rule\Container\AndRule"><tag name="shopware.rule.definition"/></service>` |
| The tag is consumed as a `tagged_iterator` by `RuleConditionRegistry` | `Framework/DependencyInjection/rule.xml:6-8` | `<argument type="tagged_iterator" tag="shopware.rule.definition"/>` |
| Unknown condition names are rejected by the registry | `Framework/Rule/Collector/RuleConditionRegistry.php:23-54` | `if (!\array_key_exists($name, $this->rules)) { throw new InvalidConditionException($name); }` |
| The same tag feeds `/api/_info/rule-config`, which supplies operators and fields to the admin | `Framework/Rule/Api/RuleConfigController.php:27-55` | `#[Route(path: '/api/_info/rule-config', …)]` … `$this->config[$rule->getName()] = $config->getData();` |
| The admin keeps its own condition store; conditions are added through `ruleConditionDataProviderService` | `(administration) …/app/decorator/condition-type-data-provider.decorator.ts:953-979` | `ruleConditionService.addCondition(type, condition);` … `Application.addServiceProviderDecorator('ruleConditionDataProviderService', …)` |
| Descriptor shape a plugin must supply | `(administration) …/condition-type-data-provider.decorator.ts:83-91` | `export type ConditionDefinition = { type: string; component: ConditionComponent; label: string; scopes: RuleScope[]; group: RuleGroup; … }` |
| `addCondition()` writes into an in-memory store keyed by type — no server round trip | `(administration) …/app/service/rule-condition.service.ts:292-296` | `this.$store[condition.scriptId ?? type] = condition as Condition;` |
| Rules with a `RuleConfig` are registered with the generic component | `(administration) …/condition-type-data-provider.decorator.ts:57,215-220` | `GENERIC: 'sw-condition-generic',` … `component: COMPONENTS.GENERIC,` |
| Valid scopes for the "Add condition" filter | `(administration) …/condition-type-data-provider.decorator.ts:15-21` | `SCOPES = { GLOBAL: 'global', CART: 'cart', CHECKOUT: 'checkout', LINE_ITEM: 'lineItem', FLOW: 'flow' }` |
| `RuleConfig` fluent API: `operatorSet()`, typed field builders, `getData()` | `Framework/Rule/RuleConfig.php:63-179` | `public function operatorSet(array $operators, …): self` … `public function entitySelectField(string $name, string $entity, …): self` |
| The tag/contract pairing is asserted in static analysis | `DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:120` | `'shopware.rule.definition' => Rule::class,` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Tagging the PHP rule alone makes the condition selectable in the Rule Builder UI | absent | the admin builds its list from the client-side `CONDITIONS` array registered into `ruleConditionDataProviderService`; nothing derives the dropdown from tagged PHP services. `/api/_info/rule-config` only supplies config for types already registered client-side (`…/condition-type-data-provider.decorator.ts:949-979`) |
| `Rule` subclasses must be `final` | absent | core rules carry only a `@final` docblock; `class CustomerNumberRule extends Rule` (`Checkout/Customer/Rule/CustomerNumberRule.php:14-18`). No PHPStan rule enforces it |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A complete real condition — `RULE_NAME`, `match()`, `getConstraints()`, `getConfig()` — the shape a plugin copies | `Checkout/Customer/Rule/CustomerNumberRule.php:18-64` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| A plugin rule with a custom scope was never evaluated from a non-order-aware flow trigger (`FlowExecutor::sequenceRuleMatches()` requires OrderAware) | 6.7.0.1 | closed | https://github.com/shopware/shopware/issues/11511 |
| Switching a rule's condition leaves stale config keys in the payload; the API rejects the write against the condition's own constraints | 6.7.8.2 / 6.6.10.16 | closed | https://github.com/shopware/shopware/issues/16464 |
| Rule builder shows raw snippet keys for several core conditions — the same label wiring a plugin supplies | unclear | closed | https://github.com/shopware/shopware/issues/8412 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which DI tag registers a PHP rule in 6.7? | code lane | `shopware.rule.definition`, consumed as a `tagged_iterator` by `RuleConditionRegistry` |
| Which `Rule` methods are abstract; is `getName()` still an instance method? | code lane | `match()` and `getConstraints()` are abstract; `getName()` is concrete and reads the `RULE_NAME` constant |
| Does `getConfig()` returning a `RuleConfig` avoid a hand-written Vue component? | code lane | Yes — core registers such rules with `component: 'sw-condition-generic'` |
| Is `ruleConditionDataProviderService` still the decorated service, with `addCondition()`? | code lane | Yes; the descriptor is `{ type, component, label, scopes, group }` |
| Does `FlowExecutor::sequenceRuleMatches()` still require an OrderAware event (#11511)? | not settled | Out of scope — the query asks how to add a selectable condition, not how flow triggers evaluate it |
| Must the `label` be a snippet key? | not settled | Left out of the facts; the code lane established only that `label: string` is required |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The class extends `Shopware\Core\Framework\Rule\Rule` | "Our new class has to extend from the abstract class `Shopware\Core\Framework\Rule\Rule`." | `add-custom-rules.md:30` | yes |
| Register in `services.php` and tag `shopware.rule.definition` | "we have to register it in our `services.php` and tag it as `shopware.rule.definition`." | `add-custom-rules.md:109` | yes |
| Required methods are `getName`, `match`, `getConstraints` | "* `getName`: Returns a unique technical name for your rule." | `add-custom-rules.md:105-107` | partly — `match()`/`getConstraints()` are abstract, but `getName()` is not overridden; the class declares `RULE_NAME` |
| Rule fields must be `protected`, not `private` | "The variables to be used in the rule have to be 'protected' and not 'private', otherwise they won't work properly." | `add-custom-rules.md:110` | not checked by the code lane — dropped from the facts |
| Admin side decorates `ruleConditionDataProviderService` and `addCondition` must match the PHP name | "Make sure to match the name we have used in the `getName` method in PHP." | `add-custom-rules.md:162` | yes |
| Returning a `RuleConfig` lets you skip the custom component and template | "This makes it possible to skip the Custom rule component … parts." | `add-custom-rules.md:122` | yes |
| A custom component extends `sw-condition-base` | "our `swag-first-monday` has to extend from the `sw-condition-base` component" | `add-custom-rules.md:255` | not checked by the code lane — retained only as the alternative to `sw-condition-generic` |

Intent context (not a fact in the snippet): the Rule Builder exists so shop owners can define criteria from customer, cart and order data (`rule/index.md:10`), and the docs warn never to run DB queries inside `match()` because it affects store-wide performance (`add-custom-rules.md:113`).

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| `getName` is one of the methods you implement | `getName()` is concrete on `Rule` and returns `static::RULE_NAME`; what a plugin must declare is the `RULE_NAME` constant, and omitting it throws `RuleException::ruleNameNotImplemented()` | `Framework/Rule/Rule.php:12,45-57` |
| Rule variables must be `protected`, not `private` | not examined by the code lane; no code finding supports or refutes it | — |
| Source links on the page are pinned to v6.6.0.0 and the admin examples use the options API | the 6.7 admin decorator is TypeScript with a typed `ConditionDefinition` including a required `group` | `(administration) …/condition-type-data-provider.decorator.ts:83-91` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `The PHP side is a class extending `Shopware\Core\Framework\Rule\Rule` implementing `getName()`, `match(RuleScope $scope): bool` and `getConstraints(): array`; the properties used in matching must be `protected`, not `private`.` | rewritten | Code shows `getName()` is not abstract — the load-bearing requirement is the `RULE_NAME` constant, without which `getName()` throws. The `protected` vs `private` clause is an unconfirmed doc claim the code lane did not examine, so it cannot stand as a fact. |
| `Register that class in `services.php` with the service tag `shopware.rule.definition`.` | kept, extended | Code confirms the tag and adds its two consumers (`RuleConditionRegistry`, `RuleConfigController`), which is what makes the tag load-bearing rather than decorative. |
| `For the Administration, either return a `RuleConfig` from `getConfig()` to get the generic `sw-condition-generic` UI, or decorate `ruleConditionDataProviderService` via `Shopware.Application.addServiceProviderDecorator` and call `addCondition(name, { component, label, scopes })` with a component extending `sw-condition-base`.` | rewritten | The "either/or" is wrong: code shows the admin registration via `addCondition()` is always required — `RuleConfig` only decides whether the component is `sw-condition-generic` or a custom one. The descriptor also requires `group`. |
