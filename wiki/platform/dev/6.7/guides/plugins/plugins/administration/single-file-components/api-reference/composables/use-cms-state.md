---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-cms-state.md
title: useCmsState()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-cms-state.html
sourceHash: d6e0f3eaa2ffec8a902e7b8923146870ee504af9
codeCheckedAgainst: "6.7.15.1"
keywords: ["useCmsState", "cms-state mixin", "selectedBlock", "selectedSection", "currentDeviceView", "contentEntity", "inheritedSlotConfig", "getSlotConfigForLanguage", "cmsPage store", "shopware:composables", "cms editor state", "slot config"]
summary: "useCmsState(): CMS editor state composable with writable selectedBlock/selectedSection, device view, content entity and inherited slot config."
lastBuilt: 2026-10-21
---
## What it is

`useCmsState()` is the Administration composable exposing the CMS editor state a block, section or config panel works against: what is selected, which device view is previewed, and which entity the layout is edited on. It replaces the `cms-state` mixin.

## When to use

When a Composition API component in the CMS editor needs the current selection, device view, the owning category/product/landing page, or its slot config.

## Key steps / config

```ts
import { useCmsState } from 'shopware:composables';

function useCmsState(): {
    cmsPageState: ComputedRef<CmsPageStore>;
    selectedBlock: WritableComputedRef<Entity<'cms_block'> | null>;
    selectedSection: WritableComputedRef<Entity<'cms_section'> | null>;
    currentDeviceView: ComputedRef<string>;
    isSystemDefaultLanguage: ComputedRef<boolean>;
    category / product / landingPage: ComputedRef<ContentEntity<...> | null>;
    contentEntity: ComputedRef<ContentEntity | null>;
    inheritedSlotConfig: ComputedRef<SlotConfigMap | null>;
    getSlotConfigForLanguage: (languageId?: string | null) => SlotConfigMap | null;
};
```

- `selectedBlock` and `selectedSection` are writable; assigning one selects it, the same as the store action:

```ts
const { selectedBlock, currentDeviceView } = useCmsState();
selectedBlock.value = props.block;
```

- `contentEntity` resolves to the category, product or landing page the layout belongs to, decided by the current route. `category`, `product` and `landingPage` are also returned individually; each reads `null` instead of throwing when its detail module is not loaded.
- `inheritedSlotConfig` is the parent language's slot config merged field by field with the current language's, so a partly translated layout inherits the rest instead of shadowing it.

## Essential identifiers

- `useCmsState`
- `cmsPageState`, `selectedBlock`, `selectedSection`, `currentDeviceView`, `isSystemDefaultLanguage`
- `category`, `product`, `landingPage`, `contentEntity`
- `inheritedSlotConfig`, `getSlotConfigForLanguage`

## Gotchas

- `contentEntity` depends on the route; outside category, landing page or product routes it is `null`.
- Composables are experimental; API may change without deprecation.

## Code check (6.7.15.1)
- confirmed `useCmsState` — default export, `@experimental stableVersion:v6.9.0` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-state.ts:37
- confirmed `selectedBlock` — writable computed; setter calls `setSelectedBlock` on the cmsPage store — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-state.ts:54
- confirmed `selectedSection` — writable computed; setter calls `setSelectedSection` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-state.ts:59
- confirmed `currentDeviceView` — reads `currentCmsDeviceView` from the store — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-state.ts:64
- confirmed `category` — reads `swCategoryDetail`, returns null on throw — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-state.ts:69
- confirmed `contentEntity` — chosen by route name prefix `sw.category.landingPageDetail`, `sw.category.`, `sw.product.` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-state.ts:93
- confirmed `getSlotConfigForLanguage` — current language reads `slotConfig`, others read the translation — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-state.ts:111
- confirmed `inheritedSlotConfig` — merges parent and current slot config field by field — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-cms-state.ts:127
- confirmed `cms-state` — the mixin this composable replaces — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/mixin/sw-cms-state.mixin.ts:27
- unverified `shopware:composables` — virtual module defined by the build tooling, outside the checked vendor roots
