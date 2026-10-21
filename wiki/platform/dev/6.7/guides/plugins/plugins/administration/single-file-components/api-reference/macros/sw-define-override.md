---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/macros/sw-define-override.md
title: swDefineOverride()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/macros/sw-define-override.html
sourceHash: 706c6cd86cb513ab0e8be7a5ab26888720b6997a
codeCheckedAgainst: "6.7.15.1"
keywords: ["swDefineOverride", "useSwPreviousState", "useSwProps", "swDefinePublic", "sw-block", ".override.vue", "override file", "compile-time macro", "component override", "script setup", "administration", "override order"]
summary: "swDefineOverride() is the mandatory compile-time macro in admin .override.vue files declaring which bindings of the overridden component it replaces."
lastBuilt: 2026-10-21
---
## What it is

`swDefineOverride()` is a compile-time macro for Administration override files only. It declares which bindings of the component being overridden this file replaces. It is not imported, the call is removed at build time, and it is mandatory in every `.override.vue` file.

```ts
function swDefineOverride<T extends Record<PropertyKey, unknown>>(bindings: T): void;
```

## When to use

When writing an `.override.vue` file that replaces or extends state (a `computed`, a `ref` or a function) of an existing Administration component, or that only contributes markup through `sw-block`.

## Key steps / config

1. Read the original binding through `useSwPreviousState()` to build on it instead of discarding it:

   ```ts
   const previousState = useSwPreviousState();
   const greeting = computed(() => `${previousState.greeting.value}!`);

   swDefineOverride({ greeting });
   ```

2. Each listed name replaces the binding of that name in the overridden component. A name the component does not have is added as new state.
3. Values must be a `ref`, a `computed` or a function. A `reactive()` object is merged into the original and must keep all of its keys (nested). Any other value (plain string, number) is ignored with a console error.
4. For a markup-only override (via `sw-block`), pass an empty object: `swDefineOverride({});`

## Essential identifiers

- `swDefineOverride`
- `useSwPreviousState()` — read the original bindings
- `useSwProps()` — read props
- `sw-block` — markup contribution
- `.override.vue` — file type where the macro is required

## Gotchas

- **Props cannot be overridden.** A name that is one of the component's props is rejected with a console error; read props with `useSwProps()`.
- **Shorthand bindings only.** Key equals the local binding name; renaming, string keys, computed keys and spreads are rejected at build time.
- **Once, at the top level.** A second top-level call is rejected; a nested call is not recognised as the marker, so the file is treated as having none.
- **Override files only.** In a base component the macro is rejected; use `swDefinePublic()` there.
- **Order:** several overrides may target one component. They apply in registration order and each sees the result of the ones before it, so they compose.

## Code check (6.7.15.1)
- confirmed `swDefineOverride` — top-level shorthand call in an override SFC fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:7
- confirmed `useSwPreviousState` — used to read the original binding before overriding — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:4
- confirmed `overrideComponentSetup()` — runtime pushes each override onto the per-component list in registration order — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:52
- confirmed `createExtendableSetup()` — overrides applied in list order via `registeredOverrides.forEach` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:257
- confirmed `Cannot override props` — prop-named key skipped with console error — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:399
- confirmed `checkNestedStructure` — reactive override must keep all original keys, then is merged — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:432
- confirmed `No handling declared for` — non-ref/computed/function values ignored with console error — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:452
- confirmed `New property from override` — unknown names are added as new state — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:415
- unverified `useSwProps` — declared outside the administration src root (build/type layer)
- unverified `shorthand bindings only` — build-time transform not under the administration src root
