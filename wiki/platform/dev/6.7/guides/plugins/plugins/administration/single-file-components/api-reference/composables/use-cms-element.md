---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-cms-element.md
title: useCmsElement()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-cms-element.html
sourceHash: aa4dc9ffd8ef66a32793d054ef394a8fe05220bc
codeCheckedAgainst: "6.7.15.1"
keywords: ["useCmsElement", "cms-element mixin", "setConfigValue", "getConfigValue", "getDemoValue", "defaultConfig", "cmsPage store", "cmsElements", "useCmsState", "shopware:composables", "cms element config", "shopping experiences editor"]
summary: "useCmsElement(): composable for CMS element editor components; resolved config, setConfigValue via cmsPage store, getDemoValue; replaces cms-element mixin."
lastBuilt: 2026-10-21
---
## What it is

`useCmsElement()` is the Administration composable a CMS (Shopping Experiences) element's editor component works against. It replaces the `cms-element` mixin.

## When to use

When writing or migrating a CMS element editor/config component to the Composition API and it needs to read or change the element's config.

## Key steps / config

```ts
import { useCmsElement } from 'shopware:composables';

function useCmsElement(options: {
    element: () => RuntimeSlot;
    defaultConfig?: () => Record<string, unknown> | null;
}): ReturnType<typeof useCmsState> & {
    cmsElements: ComputedRef<Record<string, CmsElementConfig | undefined>>;
    config: ComputedRef<CmsSlotConfig>;
    getConfigValue: (path: string) => unknown;
    setConfigValue: (path: string, value: unknown) => void;
    getDemoValue: (mappingPath: string) => unknown;
};
```

Usage:

```ts
const { config, getConfigValue, setConfigValue } = useCmsElement({
    element: () => props.element,
    defaultConfig: () => props.defaultConfig ?? null,
});
setConfigValue('media.value', mediaId);
```

- `config` is the element's config resolved against the element type's `defaultConfig` and the inherited slot config, recomputed on every read instead of being written back into the element. There is no initialization step and no lifecycle hook needed.
- The element is read-only; `setConfigValue()` goes through the `cmsPage` store, which keeps the rest of the editor in sync.
- Both config functions take a path relative to the element's config: `'media.value'`, not `'config.media.value'`.
- `getDemoValue()` resolves a mapping path against the demo entity the editor previews with.
- Everything `useCmsState()` returns is returned as well, because the mixin composed it.

## Essential identifiers

- `useCmsElement`, options `element`, `defaultConfig`
- `config`, `cmsElements`, `getConfigValue`, `setConfigValue`, `getDemoValue`
- `cmsPage` store, `useCmsState`

## Gotchas

- Do not mutate `props.element.config` directly; use `setConfigValue()`.
- Paths are relative to the config object; prefixing `config.` targets the wrong key.
- Composables are experimental; API may change without deprecation.

## Code check (6.7.15.1)
- confirmed `useCmsElement` — default export taking `UseCmsElementOptions` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-element.ts:37
- confirmed `UseCmsElementOptions` — `element` getter and optional `defaultConfig` getter — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-element.ts:12
- confirmed `UseCmsElementReturn` — useCmsState return plus cmsElements, config and the three functions — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-element.ts:18
- confirmed `config` — computed merging element type defaultConfig, options.defaultConfig and inheritedSlotConfig — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-element.ts:46
- confirmed `setConfigValue` — calls `updateElementConfig` on the `cmsPage` store — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-element.ts:74
- confirmed `getDemoValue` — resolves via `getPropertyByMappingPath` on `currentDemoEntity` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-element.ts:78
- confirmed `...cmsState` — spreads the useCmsState return into the result — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-element.ts:82
- confirmed `cms-element` — the mixin this composable replaces — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/mixin/sw-cms-element.mixin.ts:16
- confirmed `@experimental` — `stableVersion:v6.9.0` annotation on the composable — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-element.ts:4
- unverified `shopware:composables` — virtual module defined by the build tooling, outside the checked vendor roots
