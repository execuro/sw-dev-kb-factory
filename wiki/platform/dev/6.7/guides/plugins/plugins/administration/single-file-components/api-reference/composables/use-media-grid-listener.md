---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-media-grid-listener.md
title: useMediaGridListener()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-media-grid-listener.html
sourceHash: 08475bb68465d1797f3240a97d4b30bc6edf2cac
codeCheckedAgainst: "6.7.15.1"
keywords: ["useMediaGridListener", "shopware:composables", "media-grid-listener mixin", "sw-media-media-item", "mediaItemSelectionHandler", "selectableItems", "onFolderChange", "selectedItems", "isItemSelected", "media selection", "shift range select", "composable"]
summary: "Admin composable useMediaGridListener(): turns sw-media-media-item click/selection events into a selection with ctrl/cmd toggle and shift ranges."
lastBuilt: 2026-10-21
---
## What it is

`useMediaGridListener()` is the Administration composable that turns the click and selection events of `sw-media-media-item` into a selection, with `ctrl`/`cmd` toggling and `shift` ranges. It replaces the `media-grid-listener` mixin.

## When to use

Building a media grid in a Composition API component that needs multi-select behaviour (single click, modifier toggle, range select, folder navigation) without using the mixin.

## Key steps / config

1. Call it with two options:
   - `selectableItems: () => MediaGridItem[]` — the items in the order the grid renders them; `shift` ranges are resolved against this order.
   - `onFolderChange: (folderId: string) => void` — called when a folder is opened (the mixin emitted an event instead).
2. Bind `mediaItemSelectionHandler` with `v-on` on each item:

```vue
<sw-media-media-item
    v-for="item in items"
    :key="item.id"
    :item="item"
    :selected="isItemSelected(item)"
    v-on="mediaItemSelectionHandler"
/>
```

The handler map wires `media-item-click` and `media-item-play` to `handleMediaItemClicked`, `media-item-selection-add` to `handleMediaGridItemSelected`, and `media-item-selection-remove` to `handleMediaGridItemUnselected`.

Returned: `selectedItems`, `listSelectionStartItem` (both `ShallowRef`), `mediaItemSelectionHandler`, `isListSelect` (computed), `isItemSelected()`, `showItemSelected()`, `clearSelection()`, `navigateToFolder()`, `showDetails()` (single-select of one item), and the three `handle*` handlers.

## Essential identifiers

- `useMediaGridListener`, `UseMediaGridListenerOptions`, `MediaGridItem`, `MediaGridItemEvent`
- `mediaItemSelectionHandler`, `selectedItems`, `isItemSelected`, `clearSelection`, `showDetails`
- `sw-media-media-item`, `media-grid-listener` mixin

## Gotchas

- `selectedItems` is a `shallowRef` on purpose: selection is tracked by item identity, and a deep ref would return reactive proxies that no longer compare equal to the items you passed in.
- A plain click on an item whose `getEntityName()` is `media_folder` calls `onFolderChange` with the item's `id`.
- In 6.7.15.1 the file is marked `@private` and `@experimental stableVersion:v6.9.0`.

## Code check (6.7.15.1)
- confirmed `useMediaGridListener` — default export, returns the documented members — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-grid-listener.ts:45
- confirmed `UseMediaGridListenerOptions` — `selectableItems` and `onFolderChange` both required — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-grid-listener.ts:26
- confirmed `selectedItems` — created with `shallowRef` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-grid-listener.ts:61
- confirmed `mediaItemSelectionHandler` — maps the four `media-item-*` events to handlers — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-grid-listener.ts:197
- confirmed `handleMediaItemClicked()` — shift → range, ctrl/meta → toggle, else single select — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-grid-listener.ts:170
- confirmed `@experimental` — experimental, stableVersion v6.9.0 — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-grid-listener.ts:4
- confirmed `media-grid-listener` — mixin name of the Options API predecessor — vendor/shopware/administration/Resources/app/administration/src/module/sw-media/mixin/media-grid-listener.mixin.js:12
- unverified `shopware:composables` — import alias not defined inside the administration `src` tree; build-level alias, out of scope
