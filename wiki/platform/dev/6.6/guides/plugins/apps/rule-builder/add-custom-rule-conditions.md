---
id: platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md
title: Add custom rule conditions
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.html
sourceHash: 79cbee4dc7cf132a9bcffc1dca747397794dc829
keywords: ["rule-condition", "manifest.xml", "compare helper", "RuleScope", "LineItemScope", "SalesChannelContext", "twig scripts", "identifier", "constraints", "custom fields", "App Scripts", "single-select", "multi-entity-select"]
summary: "Defines app rule conditions in manifest.xml with twig-based logic scripts and the compare() helper for the Rule Builder."
lastBuilt: "2026-09-15"
---
## What it is
This guide covers introducing custom conditions for the Rule Builder from an app, defined with fields rendered in the Administration and logic written as sandboxed twig scripts. Introduced in Shopware 6.4.12.0.

## When to use
Use when an app needs a Rule Builder condition not covered by core conditions, e.g. matching on custom line item or customer data.

## Key steps / config
Define conditions in `manifest.xml` via `<<< @/docs/snippets/config/app/rule-conditions.xml`, with required fields:
- `identifier`: unique technical name, must not change after creation.
- `name`: translatable display name shown in the Administration's condition selection.
- `script`: filename of the twig script, placed under `Resources/scripts/rule-conditions` in the app root.

Optional `constraints` (a collection of custom fields) supply parameters into the script; each field's `name` becomes the variable exposed in the script.

Scripts must return a boolean. Use the `compare(operator, value, comparable)` helper, where `operator` must be one of `=`, `!=`, `>`, `>=`, `<`, `<=`, `empty`. If `value`/`comparable` is an array, only `=`/`!=` apply, matching whether the value occurs in the array.

```twig
// Resources/scripts/rule-conditions/custom-condition.twig
{% if scope.salesChannelContext.customer is not defined %}
    {% return false %}
{% endif %}
{% return compare(operator, scope.salesChannelContext.customer.firstName, firstName) %}
```

Within the script, `scope` is a `RuleScope` instance exposing `SalesChannelContext` and, depending on scope, the current cart via `scope.cart`.

```text
└── DemoApp
    ├── Resources
    │   └── scripts
    │       ├── rule-conditions
    │       │   └── custom-condition.twig
    │       └── ...
    └── manifest.xml
```

## Essential identifiers
- `rule-condition` (manifest element with `identifier`, `name`, `script`, `group`)
- `compare(operator, value, comparable)`
- `RuleScope`, `LineItemScope`
- `scope.salesChannelContext`, `scope.cart`, `scope.lineItem`
- `scope.getCurrentTime()`

## Gotchas
Anything returned that is not a boolean from the script may lead to unexpected behavior. Constraint field `name` values should be variable-friendly and unique within a condition since they become script variables.

## Version notes
App rule conditions require Shopware 6.4.12.0 or later; not supported in earlier versions.
