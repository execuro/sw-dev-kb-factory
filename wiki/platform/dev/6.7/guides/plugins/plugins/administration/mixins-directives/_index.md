---
id: platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/_index.md
title: Mixins and Directives
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/mixins-directives/
sourceHash: f52fff7eeb08243a7e3679ea271bed4d2da1dbc9
codeCheckedAgainst: "6.7.13.0"
keywords: ["mixins", "directives", "Shopware.Mixin", "Shopware.Directive", "Mixin.register", "Mixin.getByName", "Directive.register", "administration extension", "reuse component logic", "custom dom behavior", "vue"]
summary: "Overview of Administration mixins (shared component behaviour, Shopware.Mixin registry) and directives (custom DOM behaviour, Shopware.Directive registry)."
lastBuilt: 2026-09-15
---
## What it is

Section index for extending the Shopware Administration with Vue-based reuse patterns: mixins share behaviour across multiple components, directives add custom DOM behaviour. The section covers using existing mixins, adding your own mixins, and adding directives.

## When to use

Start here when Administration logic has to be reused across several plugin components (mixin) or when an element needs custom DOM handling such as focusing or tooltips (directive), and pick the matching sub-guide: Using Mixins, Add Mixins, Adding Directives.

## Key steps / config

Both patterns go through registries on the global Shopware object:

- Mixins: `Shopware.Mixin.register(name, mixin)` adds a mixin to the registry; `Shopware.Mixin.getByName(name)` returns it for a component's `mixins: []` array.
- Directives: `Shopware.Directive.register(name, directive)` adds a global directive; `Shopware.Directive.getByName(name)` reads it back. At app start the Vue adapter passes every registry entry to the Vue app as a global directive.

## Essential identifiers

- `Shopware.Mixin.register`, `Shopware.Mixin.getByName`
- `Shopware.Directive.register`, `Shopware.Directive.getByName`

## Code check (6.7.13.0)
- confirmed `Mixin.register` — maps to MixinFactory.register — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:174
- confirmed `Mixin.getByName` — maps to MixinFactory.getByName — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:175
- confirmed `Directive.register` — maps to DirectiveFactory.registerDirective — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:185
- confirmed `Directive.getByName` — maps to DirectiveFactory.getDirectiveByName — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:186
- confirmed `initDirectives` — registers each registry entry via the Vue app's directive() — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:712
