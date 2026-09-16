---
id: platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md
title: Rule Builder
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/rule-builder/
sourceHash: 4d392cd757fe784e0f0d747a803935972835dfda
codeCheckedAgainst: "6.7.13.0"
keywords: ["rule builder", "app rule conditions", "rule-conditions", "custom rules", "rule-condition", "app_script_condition", "AppScriptConditionHook", "apps", "conditions", "promotions"]
summary: Overview of extending the Rule Builder from apps with custom rule conditions (manifest-declared, Twig-scripted), available since Shopware 6.4.12.0.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/rule-system/_index.md", "platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md"]
---
## What it is

Section index for app-side Rule Builder extensions. Apps can add their own custom rules (conditions) to the [Rule Builder](platform/dev/6.7/concepts/framework/rule-system/_index.md), so business-specific conditions can drive things like customized promotions, targeted discounts or product recommendations.

## When to use

When an app, rather than a plugin, needs to introduce conditions to the Rule Builder. The full how-to (manifest fields, constraints, script variables, `compare` helper) lives on [Add Custom Rule Conditions](platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md).

## Key steps / config

1. Declare each condition in the app's `manifest.xml` under `<rule-conditions>` / `<rule-condition>` (identifier, name, optional group, script, optional constraints).
2. Put the condition logic as Twig scripts in `Resources/scripts/rule-conditions/` inside the app root.
3. Install or update the app: each condition is stored as an `app_script_condition` entity together with its script content; at evaluation the script runs under the `rule-conditions` hook (`AppScriptConditionHook`).

## Essential identifiers

- `rule-conditions`, `rule-condition` (manifest elements)
- `Resources/scripts/rule-conditions` (script directory)
- `app_script_condition` (entity), `AppScriptConditionHook` (hook `rule-conditions`)

## Gotchas

- Deactivating the app sets its stored conditions inactive; activating it re-enables them.
- Conditions are matched by identifier on update, so renaming an identifier creates a new condition and removes the old one.

## Version notes

Apps can add custom rule conditions starting with Shopware 6.4.12.0.

## Code check (6.7.13.0)
- confirmed `rule-conditions` — manifest element declared in XSD — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:121
- confirmed `rule-condition` — condition complex type — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:593
- confirmed `AppScriptConditionHook::getName()` — hook name `rule-conditions` — vendor/shopware/core/Framework/App/Event/Hooks/AppScriptConditionHook.php:19
- confirmed `app_script_condition` — entity storing app conditions — vendor/shopware/core/Framework/App/Aggregate/AppScriptCondition/AppScriptConditionDefinition.php:34
- confirmed `RuleConditionLifecycleHandler::CONDITION_SCRIPT_DIR` — `/rule-conditions/` script directory — vendor/shopware/core/Framework/App/Lifecycle/Handler/RuleConditionLifecycleHandler.php:39
- confirmed `RuleConditionLifecycleHandler::deactivate()` — sets app conditions inactive — vendor/shopware/core/Framework/App/Lifecycle/Handler/RuleConditionLifecycleHandler.php:75
- confirmed `identifier` — existing conditions matched by identifier, others deleted — vendor/shopware/core/Framework/App/Lifecycle/Handler/RuleConditionLifecycleHandler.php:110
- unverified `6.4.12.0` — introduction version not checkable in installed code
