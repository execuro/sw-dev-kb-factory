---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-sw-previous-state.md
title: useSwPreviousState()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-sw-previous-state.html
sourceHash: cf1e76f679ea1ff5b9aede5a9e671bd83ef48cf8
codeCheckedAgainst: "6.7.15.1"
keywords: ["useSwPreviousState", "swDefinePublic", "swDefineOverride", ".override.vue", "this.$super", "previous state", "original method", "override chain", "refs", "options api", "admin sfc", "component override"]
summary: useSwPreviousState() returns the overridden admin component's exposed state (refs and methods) in a .override.vue file; the composition-API $super.
lastBuilt: 2026-10-21
---
## What it is

`useSwPreviousState()` is a build-provided function in every `.override.vue` file (never imported). It returns the state of the component being overridden.

```ts
function useSwPreviousState<T extends Record<PropertyKey, any>>(): T;
```

## When to use

When an override needs to read the original component's values or call the original implementation of a method — the equivalent of `this.$super()` in the Options API — so it builds on behaviour instead of discarding it.

## Key steps / config

What it contains:

- For a component still on the Options API: its `data`, `computed`, `methods` and `props`.
- For a migrated component: the names it passed to `swDefinePublic()`.

Values are refs, methods are plain functions. Read a value with `.value` in script; templates unwrap it like any ref.

```ts
const previousState = useSwPreviousState();

previousState.product.value;   // read a value
previousState.save();          // run the original implementation
const name = previousState.product.value?.name;
```

Return replacement bindings with `swDefineOverride()`:

```ts
const count = computed(() => previousState.count.value + 1);
swDefineOverride({ count });
```

With several overrides, each sees the state as the ones registered before it left it, so a chain composes:

```ts
const greeting = computed(() => `${previousState.greeting.value} and again`);
```

## Essential identifiers

- `useSwPreviousState()`
- `swDefinePublic()` — what a migrated base component exposes
- `swDefineOverride()` — what an override returns
- `this.$super()` — Options API equivalent

## Gotchas

- In the extension runtime, only public setup values sit at the top level of the previous-state object; private setup values are grouped under `_private`.

## Code check (6.7.15.1)
- confirmed `useSwPreviousState` — called without import in an override fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:4
- confirmed `swDefineOverride` — override returns its bindings through it — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:7
- confirmed `swDefinePublic` — base component declares its public bindings — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.vue:22
- confirmed `createPreviousStateForOverride` — builds each override's snapshot, private values under `_private` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:222
- confirmed `applyOverrides` — applies registered overrides in order, each on the state left by earlier ones — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:366
