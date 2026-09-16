---
id: platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/_index.md
title: Advanced Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/advanced-configuration/
sourceHash: 94670d64bbec085f1f364fef716cfcec285cf204
codeCheckedAgainst: "6.7.13.0"
keywords: ["advanced configuration", "administration", "rule assignment", "sw-settings-rule-detail-assignments", "associationEntitiesConfig", "shortcuts", "keyboard shortcuts", "extending webpack", "dynamic product groups", "productStreamConditionService", "allow list", "blacklist", "component override"]
summary: "Section index for advanced Administration plugin customizations: rule assignment config, shortcuts, extending webpack, dynamic product group blacklist."
lastBuilt: 2026-09-15
---
## What it is

Index page of the Administration "Advanced Configuration" section. It groups guides for advanced Administration and build-related plugin customizations that extend or override core behaviour:

- Add Rule Assignment Configuration
- Add Shortcuts
- Extending Webpack
- Modify Blacklist for Dynamic Product Groups

## When to use

When a plugin must go beyond basic plugin setup in the Administration, e.g. adding a custom assignment card to a rule's detail page, registering keyboard shortcuts on a component, changing the Administration build, or changing which product properties are selectable in dynamic product group (product stream) conditions. The topics assume familiarity with the Administration architecture and component overriding (`Component.override`).

## Key steps / config

Anchors in the installed 6.7 Administration for each topic:

- Rule assignment: override the `sw-settings-rule-detail-assignments` component and extend its computed `associationEntitiesConfig`.
- Shortcuts: a component declares a `shortcuts` option, read by the Administration shortcut plugin.
- Dynamic product groups: the `productStreamConditionService` exposes `addToGeneralAllowList`, `addToEntityAllowList`, `removeFromGeneralAllowList` and `removeFromEntityAllowList`.

## Gotchas

- The section title says "Blacklist", but the installed product-stream condition service names its functions "AllowList" (see Code check).

## Code check (6.7.13.0)
- confirmed `associationEntitiesConfig` — computed in rule assignments view — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-rule/view/sw-settings-rule-detail-assignments/index.js:80
- confirmed `shortcuts` — component option read by shortcut plugin — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:166
- confirmed `productStreamConditionService` — registered service provider — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:153
- corrected `addToGeneralAllowList` — docs: "Blacklist" naming — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:306
- confirmed `addToEntityAllowList` — exposed by product stream condition service — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:307
- confirmed `removeFromGeneralAllowList` — exposed by product stream condition service — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:308
- confirmed `removeFromEntityAllowList` — exposed by product stream condition service — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:309
- unverified `webpack` — build tooling lives outside the three checked vendor roots
