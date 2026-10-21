---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/_index.md
sourceHash: 94670d64bbec085f1f364fef716cfcec285cf204
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/advanced-configuration/
title: Advanced Configuration
version: "6.7"
versions:
  - "6.7"
keywords: ["advanced configuration", "administration", "rule assignment configuration", "shortcuts", "keyboard shortcuts", "extending webpack", "webpack", "dynamic product groups", "product stream", "blacklist", "allow list", "build customization"]
summary: Index of advanced Administration plugin guides - rule assignment config, shortcuts, extending webpack, dynamic product group blacklist.
lastBuilt: 2026-10-21
---
## What it is

Section index for advanced Administration and build-related plugin customizations that extend or override core behaviour beyond basic plugin setup.

## When to use

When a plugin needs to change Administration behaviour at a deeper level; the source notes these topics require familiarity with the Administration architecture and component overriding.

## Key steps / config

The section contains four guides:

- Add Rule Assignment Configuration
- Add Shortcuts (keyboard shortcuts for admin components)
- Extending Webpack (build customization)
- Modify Blacklist for Dynamic Product Groups (which properties are selectable in product stream conditions)

## Gotchas

- In 6.7.15.1 the product stream condition service exposes `addToGeneralAllowList`/`addToEntityAllowList`; the "blacklist" wording in the guide title does not match the installed method names.

## Code check (6.7.15.1)
- confirmed `shortcuts` — component option read by the shortcut plugin — vendor/shopware/administration/Resources/app/administration/src/app/plugin/shortcut.plugin.js:175
- confirmed `getRestrictedRules` — rule assignment restrictions in the rule condition service — vendor/shopware/administration/Resources/app/administration/src/app/service/rule-condition.service.ts:639
- confirmed `addToGeneralAllowList` — product stream property list is an allow list — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:329
- confirmed `addToEntityAllowList` — per-entity allow list — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:338
- unverified `webpack` — build tooling is outside the checked package roots
