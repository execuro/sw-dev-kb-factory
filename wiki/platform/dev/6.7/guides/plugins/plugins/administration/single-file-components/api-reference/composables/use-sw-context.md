---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-sw-context.md
sourceHash: 7e555b029a50b8508be7dcb3b672b7cba8876def
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-sw-context.html
title: useSwContext()
version: "6.7"
versions:
  - "6.7"
keywords: ["useSwContext", "SetupContext", "useSwPreviousState", ".override.vue", "emit", "attrs", "slots", "expose", "override events", "component context", "defineEmits", "defineSlots"]
summary: "useSwContext() in .override.vue files returns the overridden component's Vue SetupContext (emit, attrs, slots, expose); never imported."
lastBuilt: 2026-10-21
---
## What it is

`useSwContext()` is a composable that the build provides in every `.override.vue` file; you never import it. It returns the overridden component's Vue `SetupContext`, which carries `emit`, `attrs`, `slots` and `expose`.

```ts
function useSwContext<T = SetupContext>(): T;
```

## When to use

Use it in an override when you need to emit the component's own events or read the slots the component was given. A base component does not need it, because it declares its events with `defineEmits()` and its slots with `defineSlots()`.

## Key steps / config

Call it at the top of the override's `script setup` block, next to `useSwPreviousState()`. Then emit through the returned context:

```ts
const context = useSwContext();
const previousState = useSwPreviousState();

function onSave(): void {
    previousState.onSave();
    context.emit('saved');
}
```

## Essential identifiers

- `useSwContext()`: generic return type, defaults to `SetupContext`
- `context.emit`, `context.attrs`, `context.slots`, `context.expose`
- `useSwPreviousState()`

## Gotchas

- Do not import `useSwContext`; the build injects it into `.override.vue` files only.
- In the installed runtime, when a component instance has no stored setup context, the fallback context provides `attrs`, `slots` and `emit`. Its `expose` only logs "expose is not available in the current context".

## Code check (6.7.15.1)
- unverified `useSwContext` — injected by the build transform, not present in the scanned source roots
- confirmed `SetupContext` — the third argument passed to registered setup overrides — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:513
- confirmed `getComponentContext` — returns the instance setup context or a fallback with attrs/slots/emit and a non-functional expose — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:168
- confirmed `useSwPreviousState` — called without import in an `.override.vue` fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:4
- confirmed `defineEmits` — base component declares events itself — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.vue:16
