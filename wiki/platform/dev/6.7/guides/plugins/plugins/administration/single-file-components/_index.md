---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/_index.md
sourceHash: 1c9e0a27564acd731f20a0822988dae21cece3b6
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/
title: Single File Components
version: "6.7"
versions:
  - "6.7"
keywords: ["single file components", "sfc", ".vue", "native vue", "composition api", "composables", "component factory", "options api", "twigjs blocks", "sw-block", "sw-block-parent", "swDefinePublic", "swDefineOverride", "administration extension"]
summary: Overview of writing Administration components and overrides as native Vue Single File Components instead of component factory plus TwigJS blocks.
lastBuilt: 2026-10-21
---
## What it is

The entry page for writing Administration components as native Vue 3 Single File Components (`.vue` files) using the `script setup` syntax, the Composition API and composables. Traditionally, Administration components are registered through the component factory with an Options API configuration and a separate template whose TwigJS blocks act as extension points. Shopware is moving towards native Vue so that the extension system follows standard Vue 3 patterns and tooling and needs fewer Shopware-specific abstractions.

## When to use

Read this page when you start building or extending Administration components in a plugin with SFCs rather than `Component.register`/`Component.override` and Twig blocks. It also tells you which pages in this section to read next.

## Key steps / config

The section is organised as:

- **Tutorial**: five chapters that build one plugin, from an empty directory to a working override. The finished plugin warns a merchant on the product detail page when a product's profit margin is too low.
- **API reference**: the macros (`swDefinePublic`, `swDefineOverride`), the composables, and the two block components (`sw-block`, `sw-block-parent`) in one place.
- **Troubleshooting**: the build errors and console messages you are most likely to meet, with their fixes.
- **Roadmap**: what works today and what is still coming. It also names the channel for feedback on what you tried to extend and where the system got in your way.
- **Internals**: what the build does to your file, and what the block components do at runtime.

## Essential identifiers

- `.vue` Single File Components with a `script setup` block
- `swDefinePublic`, `swDefineOverride` (compile-time macros)
- `sw-block`, `sw-block-parent` (extension-point components)

## Code check (6.7.15.1)
- confirmed `sw-block` — registered as a global Administration component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:113
- confirmed `sw-block-parent` — registered as a global Administration component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:110
- confirmed `swDefinePublic` — macro used in a base `.vue` component fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.vue:22
- confirmed `swDefineOverride` — macro used in an `.override.vue` fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:7
- confirmed `getScriptSetupDataScope` — runtime of the composition extension system for setup-based components — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:28
