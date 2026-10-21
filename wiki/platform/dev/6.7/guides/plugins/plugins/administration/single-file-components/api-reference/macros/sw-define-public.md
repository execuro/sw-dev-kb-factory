---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/macros/sw-define-public.md
title: swDefinePublic()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/macros/sw-define-public.html
sourceHash: 898d9d94c46b198524f19db982926c0c282f5b5d
codeCheckedAgainst: "6.7.15.1"
keywords: ["swDefinePublic", "swDefineOverride", "defineExpose", "compile-time macro", "base component", "public api", "override api", "private by default", ".override.vue", "shorthand bindings", "single-file components"]
summary: "swDefinePublic() macro: in an admin base SFC, lists the top-level bindings overrides may replace; mandatory, shorthand-only, no defineExpose()."
lastBuilt: 2026-10-21
---
## What it is

`swDefinePublic()` is a compile-time macro for Administration base single-file components only. It declares which of the file's top-level bindings other extensions may replace. You do not import it, the call itself is removed at build time, and it is mandatory in every base component.

```ts
function swDefinePublic<T extends Record<PropertyKey, unknown>>(bindings: T): void;
```

## When to use

Use it in every base component (not in an override file) to define the component's override contract - including components that expose nothing.

## Key steps / config

A base component is **private by default**. Every top-level binding becomes ordinary component state that its own template can read, and only the names listed in `swDefinePublic()` become part of the override API.

```ts
const props = defineProps<{ name: string }>();
const clicks = ref(0);
const greeting = computed(() => `Hello ${props.name}`);

swDefinePublic({ greeting });
```

Here `greeting` is public: an override can replace it with `swDefineOverride()`. `clicks` and `props` stay private - still readable in this component's own template, but not part of the contract.

For a component that exposes nothing, pass an empty object:

```ts
swDefinePublic({});
```

Rules:

1. **Shorthand bindings only.** The key always equals the local binding name. Renaming (`{ total: count }`), string keys, computed keys and spreads are rejected at build time.
2. **Once, at the top level.** A second top-level call is rejected. A call nested inside a function or block is not recognised as the marker, so the file is treated as having none.
3. **Base files only.** In an `.override.vue` file this macro is rejected; use `swDefineOverride()` there.
4. **No authored `defineExpose()`.** The transform generates the component's `defineExpose()` call from this list, so an authored `defineExpose()` is rejected.
5. **A binding must not share a declared prop's name.**

## Essential identifiers

- `swDefinePublic()`
- `swDefineOverride()` (the counterpart for override files)
- `defineExpose()` (generated, never authored)
- `.override.vue` (override file suffix)

## Gotchas

- Forgetting the call is an error even for components with nothing to expose - write `swDefinePublic({})`.
- Props are always readable through a template ref: the generated `defineExpose()` spreads the component's props (as read-only computeds) in front of the `swDefinePublic()` bindings, so a binding with the same name as a prop would collide - hence rule 5.

## Code check (6.7.15.1)
- confirmed `swDefinePublic` — top-level shorthand call in a base fixture component — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.vue:22
- confirmed `defineExpose()` — generated for base components, spreads props before swDefinePublic() bindings — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:531
- confirmed `getExposedProps()` — returns props as read-only computeds for the generated expose — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:536
- confirmed `swDefineOverride` — counterpart used in an `.override.vue` fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:7
- unverified `swDefinePublic<T extends Record<PropertyKey, unknown>>` — type declaration not found in the scanned src root
- unverified `shorthand-only/once/base-only rules` — enforced by the build transform outside the scanned src root
