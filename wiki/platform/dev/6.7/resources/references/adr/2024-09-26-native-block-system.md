---
id: platform/dev/6.7/resources/references/adr/2024-09-26-native-block-system.md
title: Native Block System in Shopware
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-09-26-native-block-system.html
sourceHash: 502001dff708f43e41187215f804c7ad57e1d8c5
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-block", "sw-block-parent", "native block system", "twigjs blocks", "vue blocks", "block override", "extends attribute", "useBlockContext", "administration extensibility", "adr", "component template extension", "parent block content"]
summary: "ADR: Administration replaces TwigJs template blocks with Vue components sw-block and sw-block-parent for overriding and extending component content."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2024-09-26, area administration) to migrate the Administration's TwigJs-based template block system to a native Vue.js block system built on two components: `sw-block` and `sw-block-parent`.

## When to use

Read this when you work on Administration component templates and need to understand why block overriding/extension moves from TwigJs `{% block %}` inheritance to Vue components, and what structural risks the new approach brings (conditionals, slots).

## Key steps / config

Architecture described by the ADR (and present in the installed Administration):

1. `sw-block` defines a named block with default content.
2. An overriding component declares another `sw-block` with the `extends` attribute naming the block to override; its content replaces the default.
3. `sw-block-parent` placed inside the extending block injects the original (parent) block content, enabling partial overrides.
4. A Block Context manages the relationship between blocks (installed as the `useBlockContext` composable).

Skeletal usage, matching the component's own docblock:

```html
<sw-block name="block-name" :data="$dataScope">
    <div>Default content</div>
</sw-block>

<sw-block extends="block-name">
    <sw-block-parent />
    <div>Block content extension</div>
</sw-block>
```

The installed `sw-block` accepts the props `name`, `extends` and `data` (data passed to block content).

## Essential identifiers

- `sw-block` — block definition / override component
- `sw-block-parent` — renders the parent block's content inside an extension
- `extends` — attribute on `sw-block` selecting the block to override
- `useBlockContext` — composable holding block registrations

## Gotchas

- Inserting blocks can break `v-if` / `v-else` / `v-else-if` chains, because a block can place content between the conditional siblings.
- Blocks can disrupt parent-child slot relationships when a block sits between a child slot and its parent.
- Existing TwigJs blocks require refactoring; the ADR lists migration complexity as a negative consequence.
- In the installed code both components are annotated `@private`, so treat them as internal API rather than a stable plugin contract.

## Version notes

Decision dated 2024-09-26. In 6.7.13.0 the components live under `src/app/component/structure/sw-block-override/`, and the TwigJs template reconstruction converts `{% parent %}` into `<sw-block-parent />`.

## Code check (6.7.13.0)
- confirmed `sw-block` — registered as a global Administration component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:109
- confirmed `sw-block-parent` — registered as a global Administration component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:106
- confirmed `extends` — declared as a String prop on sw-block — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:76
- confirmed `useBlockContext` — block context composable used by sw-block — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-block-context.ts:39
- confirmed `@private` — sw-block docblock marks the component private — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:22
- confirmed `sw-block-parent` — renders parent block content, also marked @private — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block-parent/index.ts:8
- confirmed `<sw-block-parent />` — TwigJs parent call is reconstructed into this element — vendor/shopware/administration/Resources/app/administration/src/core/factory/reconstruct-twig-template.ts:61
