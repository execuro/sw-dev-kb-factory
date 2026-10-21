---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-media-sidebar-modal.md
title: useMediaSidebarModal()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-media-sidebar-modal.html
sourceHash: 80277e2840dcc5558b9b8eca77d8353ba8f25944
codeCheckedAgainst: "6.7.15.1"
keywords: ["useMediaSidebarModal", "shopware:composables", "media-sidebar-modal-mixin", "openModalDelete", "deleteSelectedItems", "onItemsDelete", "onFolderItemsDissolve", "onItemsMove", "media.editor", "media.deleter", "media sidebar modals", "composable"]
summary: "Admin composable useMediaSidebarModal(): open/close state of media sidebar modals (replace, delete, folder settings, dissolve, move), ACL-guarded."
lastBuilt: 2026-10-21
---
## What it is

`useMediaSidebarModal()` is the Administration composable holding the open/close state of the media sidebar's modals — replace, delete, folder settings, folder dissolve and move. Each modal gets a `show*` ref and an `open*`/`close*` pair. It replaces the `media-sidebar-modal-mixin`.

## When to use

Building a media sidebar or quickinfo panel in a Composition API component that opens these media modals and reacts when items are deleted, folders dissolved or items moved.

## Key steps / config

1. Pass three callbacks (where the mixin emitted events):

```ts
const { showModalDelete, openModalDelete, deleteSelectedItems } = useMediaSidebarModal({
    onItemsDelete: (ids) => { /* ... */ },
    onFolderItemsDissolve: (ids) => { /* ... */ },
    onItemsMove: (ids) => { /* ... */ },
});
```

2. Use the refs `showModalReplace`, `showModalDelete`, `showFolderSettings`, `showFolderDissolve`, `showModalMove` to render the modals, and `openModalReplace`/`closeModalReplace`, `openModalDelete`/`closeModalDelete`, `openFolderSettings`/`closeFolderSettings`, `openFolderDissolve`/`closeFolderDissolve`, `openModalMove`/`closeModalMove` to toggle them.
3. Wire the modal results to `deleteSelectedItems(ids)`, `onFolderDissolved(ids)` and `onFolderMoved(ids)`. Each closes its modal, then calls `onItemsDelete`, `onFolderItemsDissolve` or `onItemsMove` respectively on the next tick.

## Essential identifiers

- `useMediaSidebarModal`, `UseMediaSidebarModalOptions`
- `onItemsDelete`, `onFolderItemsDissolve`, `onItemsMove`
- `deleteSelectedItems`, `onFolderDissolved`, `onFolderMoved`
- ACL privileges `media.editor`, `media.deleter`
- `media-sidebar-modal-mixin`

## Gotchas

- Opening is ACL-guarded: `media.editor` for replace, dissolve and move; `media.deleter` for delete. Without the privilege the `open*` call does nothing. `openFolderSettings()` is not guarded. ACL is resolved via `Shopware.Service('acl')`, so no inject is needed.
- The callbacks fire a tick after the modal closes on purpose: the modal is torn down by the same flag flip, and the caller usually reloads the list the modal was rendered into.
- In 6.7.15.1 the file is marked `@private` and `@experimental stableVersion:v6.9.0`.

## Code check (6.7.15.1)
- confirmed `useMediaSidebarModal` — default export, returns the documented refs and functions — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-sidebar-modal.ts:34
- confirmed `UseMediaSidebarModalOptions` — three required callbacks — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-sidebar-modal.ts:14
- confirmed `media.editor` — guards `openModalReplace()` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-sidebar-modal.ts:65
- confirmed `media.deleter` — guards `openModalDelete()` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-sidebar-modal.ts:77
- confirmed `openFolderSettings()` — no ACL check — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-sidebar-modal.ts:88
- confirmed `deleteSelectedItems()` — closes delete modal, calls `onItemsDelete` in `nextTick` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-sidebar-modal.ts:120
- confirmed `@experimental` — experimental, stableVersion v6.9.0 — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-media-sidebar-modal.ts:4
- confirmed `media-sidebar-modal-mixin` — mixin name of the Options API predecessor — vendor/shopware/administration/Resources/app/administration/src/module/sw-media/mixin/media-sidebar-modal.mixin.js:6
- unverified `shopware:composables` — import alias not defined inside the administration `src` tree; build-level alias, out of scope
