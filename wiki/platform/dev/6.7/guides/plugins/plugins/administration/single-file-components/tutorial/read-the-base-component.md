---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/read-the-base-component.md
title: 3. Read the component you extend
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/tutorial/read-the-base-component.html
sourceHash: f8a77a9854bc17afffa79c1897cbe3b3d2e7526d
codeCheckedAgainst: "6.7.15.1"
keywords: ["useSwPreviousState", "useSwProps", "useSwContext", "previousState", "sw-product-detail-base", "this.$super", "override state", "read base component", "sfc override", "composables", "product margin", "Shopware.Component.override"]
summary: SFC tutorial chapter 3 - read the overridden component's state via useSwPreviousState(); companions useSwProps() and useSwContext().
lastBuilt: 2026-10-21
---
## What it is

Chapter 3 of the Administration Single File Component (SFC) tutorial: the banner from chapter 2 shows the product's actual margin, computed from the state of the overridden component `sw-product-detail-base` (its `product`).

## When to use

When an `.override.vue` needs data the overridden component already holds (computed values, refs, functions), its props, or its setup context.

## Key steps / config

1. In the override's setup code, call `useSwPreviousState()` to get the overridden component's state. Refs are **not** unwrapped: read `previousState.product.value`, not `previousState.product`.
2. Compute the derived value (here: the margin from the product's price and purchase price) with an ordinary Vue `computed` and render it in the banner.
3. Strings stay hardcoded in this chapter; chapter 4 moves them into snippet files.
4. Checkpoint: reload a product with a purchase price; editing the purchase price updates the percentage.

Composables available only inside an override:

| Composable | Returns |
|---|---|
| `useSwPreviousState()` | State of the overridden component; refs not unwrapped |
| `useSwProps()` | Props that component was given, read only |
| `useSwContext()` | Its Vue setup context: `emit`, `attrs`, `slots`, `expose` |

## Essential identifiers

- `useSwPreviousState()`, `useSwProps()`, `useSwContext()`
- `previousState.<name>.value` (replaces `this.<name>` in an Options API override)
- `sw-product-detail-base` and its `product` computed

## Gotchas

- All three composables exist only inside an override, not in a standalone component.
- Mapping from the legacy pattern: `this.<name>` becomes `previousState.<name>.value`, and the `Shopware.Component.override('sw-product-detail-base', { computed: { … } })` config becomes plain setup code.

## Version notes

- The tutorial targets 6.7.16.0+ / `trunk`. In 6.7.15.1 the runtime that builds the previous-state snapshot and passes state, props and context to each override is present; the composable macros themselves are compiled by build tooling outside the checked roots.

## Code check (6.7.15.1)
- confirmed `useSwPreviousState` — used by the bundled override fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:4
- confirmed `createPreviousStateForOverride` — builds the previous-state snapshot passed to each override — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:222
- confirmed `override` — called with previous state, props and setup context — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:381
- confirmed `syncRef` — returned refs are 2-way synced with the original ref, not unwrapped — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:413
- confirmed `product` — computed on `sw-product-detail-base` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/view/sw-product-detail-base/index.js:36
- unverified `useSwProps` — no definition in administration/src; provided by the SFC compile step outside the checked roots
- unverified `useSwContext` — no definition in administration/src; provided by the SFC compile step outside the checked roots
