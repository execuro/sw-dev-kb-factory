---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-video-cover.md
title: useVideoCover()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-video-cover.html
sourceHash: a11aadcedc6385e54d50379f927165f61069aee6
codeCheckedAgainst: "6.7.15.1"
keywords: ["useVideoCover", "shopware:composables", "video-cover mixin", "video poster image", "video cover", "onCoverSelectionChange", "persistCoverMedia", "removeVideoCover", "openCoverSelectionModal", "media.editor", "sw-media-library-item-updated", "coverMediaId", "admin composable"]
summary: "Admin composable useVideoCover() assigns and removes the poster (cover) image of a video media item; replaces the video-cover mixin."
lastBuilt: 2026-10-21
---
## What it is

`useVideoCover()` is an Administration composable, imported from `shopware:composables`, that assigns and removes the poster image (cover) of a video media item. It replaces the `video-cover` mixin.

## When to use

Use it in a Composition API media component that shows a video media item and lets the user pick, change or remove its cover image.

## Key steps / config

Signature (as installed):

```ts
function useVideoCover(options: { item: () => VideoCoverMedia | null | undefined }): {
    showCoverSelectionModal: Ref<boolean>;
    isVideoMedia: ComputedRef<boolean>;
    hasVideoCover: ComputedRef<boolean>;
    openCoverSelectionModal: () => void;
    closeCoverSelectionModal: () => void;
    onCoverSelectionChange: (selection: VideoCoverMedia[]) => Promise<void>;
    persistCoverMedia: (coverMediaId: string | null) => Promise<void>;
    removeVideoCover: () => Promise<void>;
    isImage: (media?: VideoCoverMedia | null) => boolean;
    isVideo: (item?: VideoCoverMedia | null) => boolean;
    getCoverMediaId: (item?: VideoCoverMedia | null) => string | null;
};
```

Usage:

```ts
import { useVideoCover } from 'shopware:composables';
const { isVideoMedia, hasVideoCover, openCoverSelectionModal, removeVideoCover } = useVideoCover({
    item: () => props.item,
});
```

1. Pass `item` as a getter so the media item stays reactive, and so the `isLoading` flag written during a save lands on the entity the caller passed in.
2. Bind `showCoverSelectionModal` to the media selection modal; `openCoverSelectionModal()` only opens it when the user has the `media.editor` privilege.
3. Wire the modal's selection to `onCoverSelectionChange()`: it closes the modal, takes the first selected item, shows an error notification unless it is an image, and otherwise calls `persistCoverMedia()` with its id.
4. `removeVideoCover()` calls `persistCoverMedia(null)`.
5. `persistCoverMedia()` does nothing unless the item is a video with an id; it calls `mediaService.assignVideoCover()` and toggles `item.isLoading` around the request.

## Essential identifiers

- `useVideoCover` (from `shopware:composables`), option `item`
- `isVideoMedia`, `hasVideoCover`, `showCoverSelectionModal`
- `onCoverSelectionChange()`, `persistCoverMedia()`, `removeVideoCover()`, `getCoverMediaId()`
- privilege `media.editor`, event `sw-media-library-item-updated`
- replaced mixin: `video-cover`

## Gotchas

- Both writes (assign and remove) notify on success and on failure. On success they also emit `sw-media-library-item-updated` on the event bus with the item id, so an open media library refreshes.
- `isImage()`/`isVideo()` check `mediaType.name` (`IMAGE`/`VIDEO`) first and fall back to the `mimeType` prefix; `hasVideoCover` reads `metaData.video.coverMediaId`.
- Notifications come from `useNotification`, not from the host component, so overriding a host's notification helper does not change these messages.

## Version notes

In 6.7.15.1 the composable is marked `@experimental` with stable version v6.9.0. The `video-cover` mixin stays in place for Options API components.

## Code check (6.7.15.1)
- confirmed `useVideoCover()` — exported composable with the documented return shape — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-video-cover.ts:41
- confirmed `UseVideoCoverOptions` — `item` option is a getter — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-video-cover.ts:26
- confirmed `openCoverSelectionModal()` — guarded by `media.editor` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-video-cover.ts:86
- confirmed `persistCoverMedia()` — calls `mediaService.assignVideoCover` and sets `isLoading` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-video-cover.ts:48
- confirmed `sw-media-library-item-updated` — emitted on success — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-video-cover.ts:115
- confirmed `onCoverSelectionChange()` — first selection, image-only, error notification otherwise — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-video-cover.ts:125
- confirmed `removeVideoCover()` — persists a null cover — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-video-cover.ts:141
- confirmed `video-cover` — mixin still registered — vendor/shopware/administration/Resources/app/administration/src/module/sw-media/mixin/video-cover.mixin.js:6
- unverified `shopware:composables` — import alias defined in build tooling outside the scanned src root
