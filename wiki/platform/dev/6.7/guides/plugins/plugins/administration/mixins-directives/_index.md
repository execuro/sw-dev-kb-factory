---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/_index.md
sourceHash: f52fff7eeb08243a7e3679ea271bed4d2da1dbc9
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/mixins-directives/
title: Mixins and Directives
version: "6.7"
versions:
  - "6.7"
keywords: ["mixins", "directives", "Shopware.Mixin", "Shopware.Directive", "Mixin.register", "Mixin.getByName", "Directive.register", "administration", "reuse logic", "custom DOM behavior", "vue patterns"]
summary: Overview of Administration mixins (shared component behavior) and directives (custom DOM behavior) and the guides for using, adding and registering them.
lastBuilt: 2026-10-21
---
## What it is

Section overview for extending the Shopware Administration with Vue-based patterns: mixins share behavior across multiple components, directives add custom DOM behavior. The section contains three guides: Using Mixins, Add Mixins, and Adding Directives.

## When to use

You want to reuse logic between several Administration components of your plugin (mixin), or attach behavior directly to DOM elements in templates (directive), and need to find the matching guide.

## Key steps / config

- Mixins are kept in a registry on the global object: `Shopware.Mixin.register(name, mixin)` adds one, `Shopware.Mixin.getByName(name)` fetches it for a component's `mixins` array.
- Directives are kept in a registry as well: `Shopware.Directive.register(name, directive)` registers one globally; `Shopware.Directive.getByName(name)` returns it.

## Essential identifiers

- `Shopware.Mixin.register`, `Shopware.Mixin.getByName`
- `Shopware.Directive.register`, `Shopware.Directive.getByName`

## Code check (6.7.15.1)
- confirmed `Shopware.Mixin` — object with register/getByName — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:186
- confirmed `Mixin.register` — maps to MixinFactory.register — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:187
- confirmed `Mixin.getByName` — maps to MixinFactory.getByName — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:188
- confirmed `Shopware.Directive` — object with register/getByName/getDirectiveRegistry — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:197
- confirmed `Directive.register` — maps to DirectiveFactory.registerDirective — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:198
