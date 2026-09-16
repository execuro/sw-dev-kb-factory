---
id: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/handling-media.md
title: Handling media
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/data-handling-processing/handling-media.html
sourceHash: a0b0bee2730d1d0e5913b0cb5cf8dd9e374c1d2a
keywords: ["sw-media-upload-v2", "sw-upload-listener", "sw-media-preview-v2", "media upload", "media preview", "uploadTag", "allowMultiSelect", "media-upload-finish", "media-upload-add", "media-upload-fail", "media-upload-cancel", "Administration media components"]
summary: "Overview of the sw-media-upload-v2, sw-upload-listener and sw-media-preview-v2 Administration components for handling media."
lastBuilt: "2026-09-15"
---
## What it is

This guide describes the Shopware 6 Administration components for handling media: uploading, tracking uploads, and previewing media.

## When to use

Use this when an Administration component needs to let a user upload images, videos or audio files, coordinate with an upload's progress/result, or display an existing media file.

## Key steps / config

Upload media with `sw-media-upload-v2`:

```html
<sw-media-upload-v2
    uploadTag="my-upload-tag"
    :allowMultiSelect="false"
    variant="regular"
    :autoUpload="true"
    label="My image-upload">
</sw-media-upload-v2>
```

Key properties: `source` (used for the internal `sw-media-preview-v2` when not in `allowMultiSelect` mode), `variant` (`regular` or `compact`), `uploadTag` (coordinates with `sw-upload-listener`), `allowMultiSelect`, `label`, `defaultFolder`, `targetFolderId` (backup to `defaultFolder`), `helpText`, `fileAccept` (default `image/*`), `disabled`.

Track uploads by pairing the same `uploadTag` with an `sw-upload-listener`:

```html
<sw-media-upload-v2 uploadTag="my-upload-tag" :allowMultiSelect="false" variant="regular" label="My image-upload"></sw-media-upload-v2>
<sw-upload-listener @media-upload-finish="onUploadFinish" uploadTag="my-upload-tag"></sw-upload-listener>
```

`sw-upload-listener` fires `media-upload-add`, `media-upload-finish`, `media-upload-fail` and `media-upload-cancel` events, matched to the upload component by the shared `uploadTag`.

Preview media (already embedded inside `sw-media-upload-v2`, but usable standalone) with `sw-media-preview-v2`, configured via `source` (id or path), `showControls`, `autoplay`, `hideTooltip` and `mediaIsPrivate` (shows lock symbols).

## Essential identifiers

- `sw-media-upload-v2` — media upload component.
- `sw-upload-listener` — tracks upload progress/result events for a given `uploadTag`.
- `sw-media-preview-v2` — standalone media preview component.
- `uploadTag` — shared identifier coordinating upload and listener components.
