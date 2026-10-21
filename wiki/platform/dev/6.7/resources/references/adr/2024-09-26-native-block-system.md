---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2024-09-26-native-block-system.md
sourceHash: 502001dff708f43e41187215f804c7ad57e1d8c5
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-09-26-native-block-system.html
title: Native Block System in Shopware
version: "6.7"
versions:
  - "6.7"
keywords: ["sw-block", "sw-block-parent", "extends", "native block system", "twigjs blocks", "vue blocks", "block override", "block extension", "administration", "template inheritance", "useBlockContext", "vue slots"]
summary: "ADR: Administration replaces TwigJs template blocks with Vue components sw-block and sw-block-parent for overriding and extending component content."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2024-09-26, area administration) to migrate the Administration's template block system from TwigJs inheritance to a native Vue.js approach built on two components, `sw-block` and `sw-block-parent`. Today plugin developers override or extend predefined TwigJs blocks; the new components offer the same override/extend model inside Vue's templating and reactivity system.

## When to use

You build or maintain Administration components or plugins that override or extend core component templates, and need to understand how the Vue-based block mechanism works and what it may break compared to TwigJs blocks. The ADR's rationale: a uniform Vue.js frontend stack (no switching between TwigJs and Vue), a controlled public API per component so internals can change without breaking extensions, extension via native Vue slots, better performance for dynamic content updates than TwigJs rendering, and composability of blocks with other Vue components.

## Key steps / config

Architecture as described in the ADR and implemented in the installed Administration:

1. `sw-block` with a `name` prop defines a block with default content (an extension point). The `data` prop passes data into the block content.
2. An overriding component uses `sw-block` with the `extends` attribute naming the target block; its default slot replaces the block content.
3. Inside the overriding block, `sw-block-parent` injects the original (parent) block content, enabling partial overrides — extending instead of replacing. Multiple extensions of the same block stack.
4. A Block Context manages the relationship between blocks (implemented by the `useBlockContext` composable: `addBlock`, `removeBlock`, `getBlocks`).

Skeletal usage (from the component's own docblock):

```html
<sw-block name="block-name" :data="$dataScope">
    <div>Default content</div>
</sw-block>

<sw-block extends="block-name">
    <sw-block-parent />
    <div>Block content extension</div>
</sw-block>
```

## Essential identifiers

- `sw-block` — props `name`, `extends`, `data`
- `sw-block-parent` — renders the parent block's content
- `useBlockContext` — block registry composable
- Both are registered globally via `Shopware.Component.register`

## Gotchas

Negative consequences the ADR states:

- Migration complexity: existing TwigJs blocks must be refactored and the development workflow adjusted.
- Component structure breakage: inserting blocks may interfere with `v-if` / `v-else` / `v-else-if` chains, because a block can sit between the conditional elements.
- Slot usage breakage: a block inserted between a child slot and its parent can break the intended slot composition.

From the installed code: `sw-block` without `extends` throws if `name` is missing, and changing `name` after mount is unsupported (a development-mode warning is logged). Both components are marked `@private`. Legacy TwigJs block overrides are bridged into `sw-block` through shim slots, stacked between the default content and native `extends` overrides.

## Code check (6.7.15.1)
- confirmed `sw-block` — globally registered component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:113
- confirmed `sw-block-parent` — globally registered component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:110
- confirmed `name` — sw-block prop naming the block — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:74
- confirmed `extends` — sw-block prop naming the block to override — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:77
- confirmed `data` — sw-block prop passed into block content — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:80
- confirmed `useBlockContext` — provides addBlock/removeBlock/getBlocks — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:86
- confirmed `addBlock` — extending block registers its default slot under the extends name — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:92
- confirmed `getBlocks` — default, shim and native blocks combined, last one rendered — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:157
- confirmed `parentsInjectionKey` — sw-block-parent injects and pops its parent slot — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block-parent/index.ts:18
