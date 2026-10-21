---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/_index.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/directives.md
  - platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md
  - platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/utils.md
sourceHash: 9dcbe8d91c0bdba93e3afeb91712dc5e60bd2fe6
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/administration-reference/
title: Administration Reference
version: "6.7"
versions:
  - "6.7"
keywords: ["administration reference", "admin", "vue", "directives", "mixins", "utils", "Shopware.Utils", "Shopware.Directive", "Shopware.Mixin", "global helpers", "plugin admin extension", "reuse core functionality"]
summary: Index of Administration reference pages for plugins - globally registered Vue directives, shared mixins and Shopware.Utils helper functions.
lastBuilt: 2026-10-21
---
## What it is

Entry page for the Administration reference section. Plugins extend the Vue-based Administration directly; this section lists the core building blocks a plugin can reuse instead of reimplementing them.

## When to use

When building a custom admin module or component, or extending an existing one, and you need to know which globally available directives, mixins or utility functions already exist.

## Key steps / config

The section has three reference pages:

- [Directives](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/directives.md) — Vue directives registered globally via `Shopware.Directive.register()`.
- [Mixins](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md) — shared mixins, registered via `Shopware.Mixin.register()` and pulled into a component with `Shopware.Mixin.getByName('<name>')`.
- [Utils](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/utils.md) — utility functions exposed on the global object as `Shopware.Utils`.

The source states the purpose of these guides: reuse core functionality, follow Administration extension conventions, and build extensions that integrate cleanly into the Admin UI.

## Essential identifiers

- `Shopware.Directive`
- `Shopware.Mixin`
- `Shopware.Utils`

## Code check (6.7.15.1)
- confirmed `Shopware.Utils` — the global object exposes the util service as `Utils` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:223
- confirmed `Shopware.Directive.register()` — core directives register globally, e.g. `autofocus` — vendor/shopware/administration/Resources/app/administration/src/app/directive/autofocus.directive.ts:5
- confirmed `Mixin.getByName()` — mixin factory lookup by registered name; throws if not registered — vendor/shopware/administration/Resources/app/administration/src/core/factory/mixin.factory.ts:53
