---
id: platform/dev/6.6/resources/references/adr/2024-09-26-native-block-system.md
title: Native Block System in Shopware
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-09-26-native-block-system.html
sourceHash: 502001dff708f43e41187215f804c7ad57e1d8c5
keywords: ["sw-block", "sw-block-parent", "TwigJs", "Vue.js", "Block Context", "extends attribute", "administration", "block system", "component overriding", "slot", "Vue components", "template inheritance"]
summary: "ADR replacing TwigJs block overriding in Administration with Vue.js sw-block/sw-block-parent components for dynamic content extension."
lastBuilt: 2026-09-15
---
## What it is

This ADR documents the decision to migrate the Administration's block-based template overriding system from TwigJs to a native Vue.js component approach using `sw-block` and `sw-block-parent`.

## When to use

When a plugin or extension needs to override or extend predefined content blocks inside Administration Vue.js components, instead of relying on the previous TwigJs inheritance mechanism.

## Key steps / config

- `sw-block` defines a block with default content.
- An overriding component extends that block using the `extends` attribute.
- `sw-block-parent` lets the overriding component inject the original block's content into the extended block, enabling partial content overrides.
- The Block Context manages the relationship between the original and overriding blocks.

## Essential identifiers

- `sw-block`
- `sw-block-parent`
- `extends` attribute

## Gotchas

- Inserted blocks may interfere with existing `v-if`, `v-else`, and `v-else-if` conditions by placing content between them, breaking their logic flow.
- Blocks can disrupt the parent-child slot relationship if a block is inserted between a child slot and its parent, breaking the intended slot composition.
- Migration requires refactoring existing TwigJs blocks and adjusting the development workflow, which may temporarily disrupt developers while they learn the new system.
