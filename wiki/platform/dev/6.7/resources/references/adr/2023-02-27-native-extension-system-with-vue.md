---
id: platform/dev/6.7/resources/references/adr/2023-02-27-native-extension-system-with-vue.md
title: Native extension system with vue
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-27-native-extension-system-with-vue.html
sourceHash: e9a78325d144b5ad91a092a1dc7746db73922191
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-block", "sw-block-parent", "Component Factory", "Shopware.Component.register", "Twig.JS", "Composition API", "vue 3", "native vue extension system", "admin plugin system", "component override", "adr", "administration extensibility"]
summary: "ADR 2023: Shopware evaluated a native Vue 3 sw-block/Composition API extension system for the admin and kept the Component Factory with Twig.JS."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-02-27, area: administration) about replacing the Administration's plugin extension system — the Component Factory, which builds Vue components at runtime from Shopware base components and compiles Twig.JS templates in the browser — with a system built only on native Vue 3 tools. The decision was **not** to switch.

## When to use

Read this when you wonder why Administration components are still registered and extended through the Component Factory with Twig.JS templates instead of single-file Vue components, or when evaluating block-based template overriding in the admin.

## Key steps / config

Problems with the Component Factory named in the ADR:
- Vue tooling (template linting, static analysis) cannot be used without custom modifications, because everything is wrapped in factories and generated at runtime.
- Upgrading Vue is hard; components cannot be precompiled, so performance suffers.

Evaluated approach (rejected):
1. Template part: a native Vue component `sw-block` replaces Twig.JS blocks; plugins extend or overwrite an `sw-block` by name.
2. Script part: Composition API, with a hook point before the component returns its data and methods so plugins can modify or inject anything.

```html
<sw-block name="sw-hello-world">
  <div>Hello World</div>
</sw-block>
```

Why it was rejected:
- Merging data was hard because the Vue compiler optimizes many parts of a component.
- Passing all component data to the block system (full plugin access to original data) was not feasible.
- Solving both would require internal Vue logic, which is not update-safe.

Decision: keep the current Component Factory plugin system for the administration until Vue offers new possibilities that solve these problems.

## Essential identifiers

- `sw-block` (proposed native block component name)
- Component Factory / `Shopware.Component.register` (current registration mechanism)
- Twig.JS (runtime template engine of the admin)
- Composition API (proposed script extension approach)

## Gotchas

- This ADR records a rejected design; it does not describe a supported plugin API. Plugins keep extending admin components through the Component Factory.

## Version notes

- The installed 6.7.13.0 Administration does contain an `sw-block` global component (docblock marked `@private`) with `name`/`extends` usage plus an `sw-block-parent` component, and factory code that reconstructs Twig blocks as `<sw-block name="...">` templates. Being `@private`, it is not a public extension API; the ADR's decision text itself is unchanged.

## Code check (6.7.13.0)
- confirmed `sw-block` — registered as a global admin component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:109
- confirmed `sw-block-parent` — registered as a global admin component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:106
- confirmed `sw-block` — component docblock is marked `@private` (not public API) — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:24
- confirmed `sw-block` — Twig blocks are reconstructed as native block templates by the factory — vendor/shopware/administration/Resources/app/administration/src/core/factory/reconstruct-twig-template.ts:66
- confirmed `sw-block` — async component factory references native block mounting — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:617
- confirmed `Shopware.Component.register` — components still registered via the component factory — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:109
- unverified `Twig.JS` — third-party library, outside the checked vendor/shopware roots
