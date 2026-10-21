---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2022-02-21-rule-scripting-in-apps.md
sourceHash: cf1ea8fa4867ec7e80eaf5174e1ab3b27415810f
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-02-21-rule-scripting-in-apps.html
title: Rule Scripting in apps
version: "6.7"
versions:
  - "6.7"
keywords: ["rule scripting", "app rule condition", "custom rule condition", "ScriptRule", "AppScriptConditionDefinition", "app_script_condition", "rule-conditions", "RulePayloadUpdater", "sw-condition-script", "rule builder", "twig macro", "app scripts", "constraints"]
summary: "ADR: apps define custom rule conditions as Twig scripts stored in app_script_condition and evaluated by the generic ScriptRule."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-02-21, area services-settings). Rule conditions used to be hard-coded as PHP classes plus Vue components in the administration. The ADR introduces a generic script rule so apps can ship their own rule conditions: the condition logic is a Twig script (Twig provides a secure PHP sandbox and direct object access), stored in the database and fetched when a rule's payload is built or a rule is validated.

## When to use

When an app needs a rule condition that the rule builder does not offer, or when debugging how app-provided conditions are stored, indexed into the rule payload, evaluated and rendered in the administration.

## Key steps / config

1. **Declare the condition in the app manifest** under `rule-conditions`. Per the installed manifest schema each `rule-condition` takes `identifier`, `name` (translatable), `group`, a script element pointing at the Twig file, and `constraints`. Constraints use the same field syntax as config or custom fields and also drive the parameter fields shown in the rule builder:

```xml
<rule-conditions>
    <rule-condition>
        <identifier>...</identifier>
        <name>My custom rule condition</name>
        <group>customer</group>
        <constraints>
            <single-select name="operator">...</single-select>
            <multi-entity-select name="customerGroupIds">
                <entity>customer_group</entity>
            </multi-entity-select>
        </constraints>
    </rule-condition>
</rule-conditions>
```

2. **Write the Twig rule script** (the ADR's example lives at `ExampleApp/scripts/rule-conditions/customer-group-rule-script.twig`). Condition parameters are Twig variables; `scope` is the rule scope; the script returns a boolean:

```twig
{% if scope.salesChannelContext.customer is not defined %}
    {% return false %}
{% endif %}
{% if operator == "=" %}
    {% return scope.salesChannelContext.customer.groupId in customerGroupIds %}
{% else %}
    {% return scope.salesChannelContext.customer.groupId not in customerGroupIds %}
{% endif %}
```

3. **Storage.** Each condition is an `app_script_condition` entity (`AppScriptConditionDefinition`) with fields `id`, `identifier`, translated `name`, `active`, `group`, `script`, `constraints`, `config` and `appId`, plus a `ruleConditions` one-to-many association. `rule_condition` gets a nullable `script_id` foreign key to it.
4. **Evaluation.** Every app condition is a `ScriptRule` (rule name `scriptRule`). Its `match()` wraps the app script in a Twig `evaluate` macro so `return` works, renders it with `scope` plus the user-entered `values` as context, and casts the output with `FILTER_VALIDATE_BOOLEAN`. `getConstraints()`/`setConstraints()` carry the validation constraints.
5. **Payload.** `RulePayloadUpdater` left-joins `app_script_condition` (active only) and, for a `ScriptRule`, assigns `script`, `lastModified`, `identifier` and `values` (decoded from the condition `value`). An indexer on `app_script_condition` is meant to re-run the payload update for every rule using a changed script, e.g. on app lifecycle events.
6. **Administration.** A single component, `sw-condition-script`, renders all script conditions; its fields and types are built from the script's constraints.

## Essential identifiers

- `Shopware\Core\Framework\Rule\ScriptRule`, `ScriptRule::RULE_NAME` (`scriptRule`)
- `AppScriptConditionDefinition`, entity `app_script_condition`
- `RulePayloadUpdater`, `rule_condition.script_id`
- Manifest elements `rule-conditions` / `rule-condition` / `constraints`
- Admin component `sw-condition-script`

## Gotchas

- The ADR's `ScriptRule` draft (with a `CONSTRAINT_MAPPING` array turning JSON constraint names like `notBlank`, `arrayOfUuid`, `choice` into constraint objects inside `setConstraints`) is not what ships: the installed `setConstraints()` stores already-built constraint objects, and `constraints` is a write-protected blob field rather than a JSON field.
- The ADR's draft association is named `conditions`; the installed definition calls it `ruleConditions`.
- The ADR's manifest sample omits `identifier` and the script element and misspells the parameter as `cusstomerGroupIds` while the script uses `customerGroupIds` — names must match.
- A `comparison.compare(...)` Twig helper is only floated as a possible future addition.

## Code check (6.7.15.1)
- confirmed `ScriptRule` — generic `Rule` subclass for app conditions — vendor/shopware/core/Framework/Rule/ScriptRule.php:24
- confirmed `ScriptRule::RULE_NAME` — value `scriptRule` — vendor/shopware/core/Framework/Rule/ScriptRule.php:26
- confirmed `ScriptRule::match()` — wraps script in an `evaluate` macro — vendor/shopware/core/Framework/Rule/ScriptRule.php:53
- corrected `ScriptRule::setConstraints()` — docs: maps JSON names via CONSTRAINT_MAPPING; code assigns given constraints — vendor/shopware/core/Framework/Rule/ScriptRule.php:99
- confirmed `AppScriptConditionDefinition::ENTITY_NAME` — `app_script_condition` — vendor/shopware/core/Framework/App/Aggregate/AppScriptCondition/AppScriptConditionDefinition.php:34
- corrected `constraints` — docs: JsonField; code: write-protected BlobField — vendor/shopware/core/Framework/App/Aggregate/AppScriptCondition/AppScriptConditionDefinition.php:70
- corrected `ruleConditions` — docs: association `conditions` — vendor/shopware/core/Framework/App/Aggregate/AppScriptCondition/AppScriptConditionDefinition.php:74
- confirmed `app_script_condition` — payload query joins only active rows — vendor/shopware/core/Content/Rule/DataAbstractionLayer/RulePayloadUpdater.php:56
- confirmed `ScriptRule` — payload assigns script, lastModified, identifier, values — vendor/shopware/core/Content/Rule/DataAbstractionLayer/RulePayloadUpdater.php:140
- corrected `rule-condition` — docs sample lacks `identifier`/script; schema has both — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:608
