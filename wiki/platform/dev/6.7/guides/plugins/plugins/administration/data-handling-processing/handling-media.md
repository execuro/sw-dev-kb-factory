---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/handling-media.md
sourceHash: d5e54ffe425df5a9818b40690ce6db4432663f02
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/handling-media.html
title: Handling Media
version: "6.7"
versions:
  - "6.7"
keywords: ["sw-media-upload-v2", "sw-upload-listener", "sw-media-preview-v2", "uploadTag", "media-upload-finish", "media-upload-add", "media-upload-fail", "media-upload-cancel", "autoUpload", "file upload", "image upload", "media preview", "administration media"]
summary: "Admin media components: sw-media-upload-v2 props, sw-upload-listener upload events via shared uploadTag, and sw-media-preview-v2 preview options."
lastBuilt: 2026-10-21
---
## What it is

Reference for the three Administration components used to upload, track and preview media in a plugin: `sw-media-upload-v2` (upload UI for images, videos, audio and other files), `sw-upload-listener` (turns upload-store events into Vue events) and `sw-media-preview-v2` (renders a preview of a media item).

## When to use

When a custom Administration module or component must let the user upload files, react to finished/failed uploads, or display an existing media entity.

## Key steps / config

1. Place `sw-media-upload-v2` and a `sw-upload-listener` in the template with the **same** `uploadTag` so they communicate. Auto-uploading is a prop of the listener, not of the upload component:

```html
<sw-media-upload-v2
    uploadTag="my-upload-tag"
    :allowMultiSelect="false"
    variant="regular"
    label="My image-upload">
</sw-media-upload-v2>
<sw-upload-listener
    @media-upload-finish="onUploadFinish"
    uploadTag="my-upload-tag"
    :autoUpload="true">
</sw-upload-listener>
```

2. `sw-media-upload-v2` props:

| Prop | Meaning |
|---|---|
| `uploadTag` | Required; pairs the component with `sw-upload-listener` |
| `source` | Source for the embedded `sw-media-preview-v2` when not in `allowMultiSelect` mode |
| `variant` | `regular` (default), `compact` or `small` |
| `allowMultiSelect` | Multiple files at once (default `true`) |
| `label` / `helpText` | Header text / header help text |
| `defaultFolder` | Path where the file is put |
| `targetFolderId` | Fallback to `defaultFolder` |
| `fileAccept` | Accept attribute of the `<input>`; default `*/*`, use `image/*` for images only |
| `disabled` | Disables the whole component |

3. Listen on `sw-upload-listener` events: `media-upload-add` (upload added), `media-upload-finish` (upload finished), `media-upload-fail` (upload failed), `media-upload-cancel` (upload canceled).

4. Preview media separately with `sw-media-preview-v2` (already embedded inside `sw-media-upload-v2`):

```html
<sw-media-preview-v2 :source="mediaId"></sw-media-preview-v2>
```

Props: `source` (required; media id or path), `showControls` (video/audio controls), `autoplay`, `hideTooltip` (hide filename tooltip), `mediaIsPrivate` (shows lock symbols).

## Essential identifiers

- `sw-media-upload-v2`, `sw-upload-listener`, `sw-media-preview-v2`
- Props: `uploadTag`, `allowMultiSelect`, `variant`, `defaultFolder`, `targetFolderId`, `fileAccept`, `autoUpload` (listener)
- Events: `media-upload-add`, `media-upload-finish`, `media-upload-fail`, `media-upload-cancel`

## Gotchas

- The `uploadTag` must be identical on `sw-media-upload-v2` and `sw-upload-listener`, otherwise no events arrive.
- The docs sample sets `:autoUpload="true"` on `sw-media-upload-v2`; that component declares no such prop. In 6.7 `autoUpload` is a `sw-upload-listener` prop (default `false`); when true, the listener runs the uploads itself on `media-upload-add` instead of emitting that event.
- `allowMultiSelect` defaults to `true`; set it to `false` explicitly for a single-file upload.

## Code check (6.7.15.1)
- confirmed `uploadTag` — required String prop of sw-media-upload-v2 — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-upload-v2/index.js:62
- confirmed `variant` — validValues compact/regular/small, default regular — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-upload-v2/index.js:52
- confirmed `allowMultiSelect` — Boolean prop, default true — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-upload-v2/index.js:67
- confirmed `fileAccept` — default `*/*` — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-upload-v2/index.js:118
- confirmed `targetFolderId` — String prop, default null — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-upload-v2/index.js:100
- corrected `autoUpload` — docs: prop of sw-media-upload-v2; actually a sw-upload-listener prop, default false — vendor/shopware/administration/Resources/app/administration/src/app/component/utils/sw-upload-listener/index.js:59
- confirmed `UPLOAD_ADDED` — emits `media-upload-add` — vendor/shopware/administration/Resources/app/administration/src/core/service/api/media.api.service.js:9
- confirmed `UPLOAD_FINISHED` — emits `media-upload-finish`; fail/cancel follow at lines 12–13 — vendor/shopware/administration/Resources/app/administration/src/core/service/api/media.api.service.js:11
- confirmed `source` — required prop of sw-media-preview-v2 — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-preview-v2/index.js:66
- confirmed `mediaIsPrivate` — prop of sw-media-preview-v2, next to `hideTooltip` — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-preview-v2/index.js:100
