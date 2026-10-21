---
id: platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md
title: Rule Builder
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/rule-builder/
sourceHash: 4d392cd757fe784e0f0d747a803935972835dfda
codeCheckedAgainst: "6.7.15.1"
keywords: ["rule builder", "rule-conditions", "rule-condition", "ScriptRule", "app rule conditions", "custom rule", "conditions", "app system", "manifest.xml", "promotions", "rule system"]
summary: Overview - apps can add custom Rule Builder conditions (since 6.4.12.0) via rule-conditions in manifest.xml, evaluated by ScriptRule.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md", "platform/dev/6.7/concepts/framework/rule-system/_index.md"]
---
## What it is

Section index for extending the Rule Builder from an app. Apps can register their own rule conditions, which then become selectable in the Administration's Rule Builder alongside the core conditions and can drive things like promotions, discounts or product recommendations.

## When to use

You build an app (not a plugin) and need a business-specific condition in the Rule Builder. The how-to is in platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md; the underlying rule concept is in platform/dev/6.7/concepts/framework/rule-system/_index.md.

## Key steps / config

- Declare conditions under `<rule-conditions>` / `<rule-condition>` in the app's `manifest.xml`.
- Each condition's logic is a Twig script, evaluated at runtime by the core `ScriptRule` (rule name `scriptRule`).

## Essential identifiers

- `<rule-conditions>`, `<rule-condition>` (manifest elements)
- `ScriptRule`

## Version notes

- App rule conditions exist since Shopware 6.4.12.0.

## Code check (6.7.15.1)
- confirmed `rule-conditions` — manifest element for app conditions — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:121
- confirmed `rule-condition` — condition type with identifier/name/group/script/constraints — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:606
- confirmed `ScriptRule::RULE_NAME` — `scriptRule` evaluates app condition scripts — vendor/shopware/core/Framework/Rule/ScriptRule.php:26
- unverified `6.4.12.0` — introduction version is a historical claim, not checkable against 6.7 code
