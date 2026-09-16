---
id: platform/dev/6.7/resources/references/adr/2022-02-21-rule-scripting-in-apps.md
title: Rule Scripting in apps
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-02-21-rule-scripting-in-apps.html
sourceHash: cf1ea8fa4867ec7e80eaf5174e1ab3b27415810f
codeCheckedAgainst: "6.7.13.0"
keywords: ["ScriptRule", "AppScriptConditionDefinition", "app_script_condition", "RulePayloadUpdater", "sw-condition-script", "rule-conditions", "scriptRule", "rule builder", "custom rule condition", "app scripts", "twig rule script", "adr"]
summary: ADR 2022-02-21 - apps define custom rule conditions as Twig scripts stored in app_script_condition and evaluated by the generic ScriptRule.
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record: instead of hard-coding every rule condition as a PHP class plus an admin Vue component, apps can ship their own rule conditions. A generic rule, `ScriptRule`, evaluates app-provided Twig scripts (Twig gives a secure PHP sandbox and direct object access). Scripts and their parameter constraints are stored in the database entity `app_script_condition` and loaded when a rule's payload is built or a rule is validated.

## When to use

- You build an app that needs a rule builder condition Shopware does not provide.
- You debug why an app rule condition is not matched, validated, or rendered in the administration rule builder.

## Key steps / config

1. **Declare the condition in the app manifest.** Parameters use the same field schema as config/custom fields; they become both the validation constraints and the admin input fields. The installed manifest XSD allows `identifier`, `name`, `group`, a `script` element and `constraints` inside each `rule-condition`.
   ```xml
   <rule-conditions>
       <rule-condition>
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
2. **Write the Twig script.** Condition parameters (e.g. `operator`, `customerGroupIds`) and `scope` are available as variables; use `{% return %}` to return a boolean:
   ```twig
   {% if scope.salesChannelContext.customer is not defined %}
       {% return false %}
   {% endif %}
   {% return scope.salesChannelContext.customer.groupId in customerGroupIds %}
   ```
3. **Storage.** `AppScriptConditionDefinition` (`ENTITY_NAME = 'app_script_condition'`) holds `name` (translated), `active`, `group`, `script`, `constraints` (JSON) and `appId`. `rule_condition` gets an `FkField('script_id', 'scriptId', AppScriptConditionDefinition::class)`; the many-to-one association on `RuleConditionDefinition` is named `appScriptCondition`.
4. **Evaluation.** `ScriptRule` (`RULE_NAME = 'scriptRule'`) has `script`, `constraints` and `values` properties. `match(RuleScope $scope)` wraps the script in a Twig macro so return values can be captured and output, passes `scope` plus `values` as context, and converts the rendered result to a boolean. `getConstraints()` returns the constraints; `setConstraints()` receives the constraint objects.
5. **Payload.** `RulePayloadUpdater` joins `app_script_condition` (only `active = 1`) and assigns the script and values to `ScriptRule` instances; an indexer keeps payloads current when scripts change, e.g. on app lifecycle events.
6. **Administration.** One generic component, `sw-condition-script`, builds its fields dynamically from the script's constraints.

## Essential identifiers

- `Shopware\Core\Framework\Rule\ScriptRule`, `ScriptRule::RULE_NAME` (`scriptRule`)
- `AppScriptConditionDefinition`, entity `app_script_condition`
- `RuleConditionDefinition` field `script_id` / association `appScriptCondition`
- `RulePayloadUpdater`, `RuleValidator`
- Manifest `rule-conditions` / `rule-condition`
- Admin component `sw-condition-script`

## Gotchas

- The ADR draft maps constraint names through a `CONSTRAINT_MAPPING` constant in `ScriptRule::setConstraints()`; the installed `ScriptRule` has no such constant and stores the given constraint list directly.
- The ADR diff names the association `script`; the installed code names it `appScriptCondition`.
- Inactive scripts are ignored when building payloads.
- Twig helper functions such as `comparison.compare(...)` are only mentioned as a possible future addition.

## Code check (6.7.13.0)
- confirmed `ScriptRule` — extends Rule — vendor/shopware/core/Framework/Rule/ScriptRule.php:24
- confirmed `ScriptRule::RULE_NAME` — value `scriptRule` — vendor/shopware/core/Framework/Rule/ScriptRule.php:26
- confirmed `ScriptRule::match()` — `match(RuleScope $scope): bool` — vendor/shopware/core/Framework/Rule/ScriptRule.php:53
- corrected `ScriptRule::setConstraints()` — docs: maps names via CONSTRAINT_MAPPING; code assigns the list directly — vendor/shopware/core/Framework/Rule/ScriptRule.php:99
- confirmed `AppScriptConditionDefinition::ENTITY_NAME` — `app_script_condition` — vendor/shopware/core/Framework/App/Aggregate/AppScriptCondition/AppScriptConditionDefinition.php:34
- corrected `appScriptCondition` — docs: association named `script` — vendor/shopware/core/Content/Rule/Aggregate/RuleCondition/RuleConditionDefinition.php:64
- confirmed `app_script_condition` — payload query joins active scripts — vendor/shopware/core/Content/Rule/DataAbstractionLayer/RulePayloadUpdater.php:56
- confirmed `rule-condition` — manifest XSD type with identifier, name, group, script, constraints — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:593
- confirmed `sw-condition-script` — admin condition component — vendor/shopware/administration/Resources/app/administration/src/app/component/rule/condition-type/sw-condition-script/index.js:13
