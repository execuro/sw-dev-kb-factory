---
id: platform/dev/6.6/resources/references/adr/2022-02-21-rule-scripting-in-apps.md
title: Rule Scripting in apps
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-02-21-rule-scripting-in-apps.html
sourceHash: cf1ea8fa4867ec7e80eaf5174e1ab3b27415810f
keywords: ["ScriptRule", "app_script_condition", "AppScriptConditionDefinition", "RuleConditionDefinition", "RulePayloadUpdater", "rule-conditions manifest", "sw-condition-script", "rule builder", "RuleScope match", "Twig macro evaluate", "custom rule condition"]
summary: ADR letting apps define custom rule conditions via a generic ScriptRule backed by the app_script_condition entity, manifest constraints, and Twig scripts.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record introducing app-defined rule conditions: instead of hard-coding each condition as a PHP class and Vue component, apps store a Twig script and validation constraints in a new `app_script_condition` entity, evaluated through a generic `ScriptRule`.

## When to use
Relevant when an app needs to add a custom condition to the Shopware rule builder without shipping a PHP `Rule` subclass and matching administration component.

## Key steps / config
`AppScriptConditionDefinition` (entity `app_script_condition`) stores fields including `name`, `active`, `group`, `script`, `constraints` (JSON), `app_id` (FK to `AppDefinition`), and a `conditions` association to `RuleConditionDefinition`. `RuleConditionDefinition` gains a nullable `script_id` FK/association to `AppScriptConditionDefinition`.

`ScriptRule extends Rule` is the generic condition implementation, with `script`, `constraints` and `values` properties. It evaluates via a Twig macro so `return` statements work inside app scripts:

```php
class ScriptRule extends Rule
{
    public function match(RuleScope $scope): bool { /* ... */ }
    public function getConstraints(): array { /* ... */ }
    public function setConstraints(array $constraints): void { /* ... */ }
    public function getName(): string { return 'scriptRule'; }
}
```

`RulePayloadUpdater` is updated to join `app_script_condition` and assign `script`/`values` onto `ScriptRule` instances when building the rule payload; an indexer for `app_script_condition` must call `RulePayloadUpdater` for every affected rule.

Manifest shape for defining a condition (constraints follow the same schema as config/custom fields):

```xml
<rule-conditions>
    <rule-condition>
        <name>My custom rule condition</name>
        <group>customer</group>
        <constraints>
            <single-select name="operator">...</single-select>
            <multi-entity-select name="customerGroupIds">...</multi-entity-select>
        </constraints>
    </rule-condition>
</rule-conditions>
```

Example condition script (`ExampleApp/scripts/rule-conditions/customer-group-rule-script.twig`):

```twig
{% if scope.salesChannelContext.customer is not defined %}
    {% return false %}
{% endif %}
{% if operator == "=" %}
    {% return scope.salesChannelContext.customer.groupId in customerGroupIds %}
{% endif %}
```

In the administration, a single generic Vue component `sw-condition-script` (extending `sw-condition-base`) renders and validates fields dynamically from the condition's `constraints`.

## Essential identifiers
- `AppScriptConditionDefinition` (`app_script_condition`)
- `ScriptRule::match()` / `getConstraints()` / `setConstraints()` / `getName()`
- `RuleConditionDefinition::script_id`
- `RulePayloadUpdater`
- `sw-condition-script`

## Gotchas
- `ScriptRule::setConstraints()` maps constraint type names (`notBlank`, `arrayOfUuid`, `arrayOfType`, `choice`, `type`) to Symfony Validator constraint classes via a fixed `CONSTRAINT_MAPPING` — unmapped type names will fail.
- The condition-evaluation macro trick is needed because plain Twig `return` statements are not output outside of a macro.

## Version notes
This ADR builds directly on the earlier App Scripts ADR (Twig sandbox, script storage) and extends it specifically to rule conditions; it also notes this groundwork could later enable rule scripting from within the administration itself.
