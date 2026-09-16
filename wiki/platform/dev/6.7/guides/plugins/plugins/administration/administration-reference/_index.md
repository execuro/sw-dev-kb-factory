---
id: platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/_index.md
title: Administration Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/administration-reference/
sourceHash: 9dcbe8d91c0bdba93e3afeb91712dc5e60bd2fe6
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration reference", "directives", "mixins", "utils", "vue directives", "vue mixins", "utility functions", "Shopware.Directive", "Shopware.Mixin", "Shopware.Utils", "admin extension conventions", "global Shopware object"]
summary: "Index of Administration reference pages for plugins: globally registered Vue directives, shared mixins, and utility functions on the Shopware object"
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/directives.md", "platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/utils.md"]
---
## What it is

Index of the reference pages for core Administration building blocks that plugins reuse when they integrate into the Vue-based Administration: directives, mixins and utility functions.

## When to use

When building custom Administration modules or components, or extending existing ones, and you want to reuse core functionality instead of reimplementing it, follow Administration extension conventions, and integrate cleanly into the Admin UI.

## Key steps / config

The reference is split into three pages:

- [Directives](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/directives.md) — globally registered Vue directives. In the installed code they are registered through `Shopware.Directive.register(...)`, e.g. `tooltip`, `autofocus`, `draggable`, `droppable`, `responsive`.
- [Mixins](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md) — shared Vue mixins used across the Administration. Core mixins are registered with `Shopware.Mixin.register(...)` and retrieved in a component via `Shopware.Mixin.getByName('<name>')`.
- [Utils](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/utils.md) — global utility functions exposed as `Shopware.Utils`.

## Essential identifiers

- `Shopware.Directive.register`, `Shopware.Directive.getByName`
- `Shopware.Mixin.register`, `Shopware.Mixin.getByName`
- `Shopware.Utils`

## Code check (6.7.13.0)
- confirmed `Shopware.Directive` — register/getByName/getDirectiveRegistry — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:184
- confirmed `Shopware.Mixin` — register/getByName — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:173
- confirmed `Shopware.Utils` — global utils object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:210
- confirmed `tooltip` — core directive registration — vendor/shopware/administration/Resources/app/administration/src/app/directive/tooltip.directive.ts:580
- confirmed `autofocus` — core directive registration — vendor/shopware/administration/Resources/app/administration/src/app/directive/autofocus.directive.ts:5
- confirmed `draggable` — core directive registration (also `droppable`) — vendor/shopware/administration/Resources/app/administration/src/app/directive/dragdrop.directive.ts:440
- confirmed `responsive` — core directive registration — vendor/shopware/administration/Resources/app/administration/src/app/directive/responsive.directive.ts:22
- confirmed `Mixin.register` — core mixins registered via the factory — vendor/shopware/administration/Resources/app/administration/src/app/mixin/listing.mixin.ts:19
