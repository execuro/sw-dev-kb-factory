---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-sw-props.md
title: useSwProps()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-sw-props.html
sourceHash: 9bb11a55f0f05f9fe6c5fcc5cbd7d3b4e90263fd
codeCheckedAgainst: "6.7.15.1"
keywords: ["useSwProps", "swDefineOverride", "defineProps", ".override.vue", "props", "read-only props", "component override", "admin sfc", "override prop", "console error"]
summary: useSwProps() returns the read-only props of the overridden admin component in a .override.vue file; props cannot be overridden.
lastBuilt: 2026-10-21
---
## What it is

`useSwProps()` is a build-provided function in every `.override.vue` file (never imported). It returns the props the overridden component was given.

```ts
function useSwProps<T extends Record<PropertyKey, any>>(): T;
```

## When to use

When an override needs to derive a value from the component's props. A base component does not need it: it declares its own props with `defineProps()`.

## Key steps / config

```ts
const props = useSwProps();

const label = computed(() => `Editing ${props.name}`);
```

To change what a prop-derived value produces, override the binding that derives it, not the prop.

## Essential identifiers

- `useSwProps()`
- `swDefineOverride()` — rejects prop names
- `defineProps()` — base-component equivalent

## Gotchas

- Props are read only: they come from whoever renders the component. Returning a prop name from `swDefineOverride()` is skipped with a console error (`Cannot override props`).
- A base setup that returns a prop name as a binding also logs an error and the binding is removed.

## Code check (6.7.15.1)
- unverified `useSwProps` — injected by the admin build transform, which is outside the scanned admin `src` root
- confirmed `swDefineOverride` — used by override fixture to return bindings — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:7
- confirmed `Cannot override props` — override keys matching a prop are skipped with console.error — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:399
- confirmed `returned a prop` — base setup returning a prop logs an error and deletes it — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:313
