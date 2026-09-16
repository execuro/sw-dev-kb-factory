---
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/handling-media.md
title: Handling Media
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/handling-media.html
sourceHash: 24e479d6bad45b2cb3a0154aeabe6738dc971a94
codeCheckedAgainst: "6.7.13.0"
keywords: ["media", "file upload", "image upload", "sw-media-upload-v2", "sw-upload-listener", "sw-media-preview-v2", "uploadTag", "media-upload-finish", "media-upload-add", "media-upload-fail", "media-upload-cancel", "autoUpload", "media preview", "administration components"]
summary: Admin media components sw-media-upload-v2, sw-upload-listener (events linked by uploadTag) and sw-media-preview-v2, with their props and events.
lastBuilt: 2026-09-15
---
## What it is

The Administration ships components for media handling: `sw-media-upload-v2` to upload images, videos, audio and other files, `sw-upload-listener` to react to upload progress, and `sw-media-preview-v2` to preview a media item.

## When to use

A plugin's Administration module needs a file/image upload field, needs to act when an upload finishes (e.g. store the media id on an entity), or needs to show a media thumbnail/player.

## Key steps / config

Pair an upload component with a listener using the same `uploadTag`:

```html
<sw-media-upload-v2
    uploadTag="my-upload-tag"
    :allowMultiSelect="false"
    variant="regular"
    label="My image-upload">
</sw-media-upload-v2>
<sw-upload-listener
    uploadTag="my-upload-tag"
    :autoUpload="true"
    @media-upload-finish="onUploadFinish">
</sw-upload-listener>
```

`sw-media-upload-v2` props (installed defaults):

| Prop | Meaning |
|---|---|
| `uploadTag` | required; links to `sw-upload-listener` |
| `source` | media used for the internal `sw-media-preview-v2` when not multi-select |
| `variant` | `regular` (default), `compact`, `small` |
| `allowMultiSelect` | multiple files at once; default `true` |
| `label` / `helpText` | header text / help text |
| `defaultFolder` / `targetFolderId` | target folder; `targetFolderId` is the fallback |
| `fileAccept` | accept attribute of the file input; default `*/*` |
| `disabled` | disables the component |

`sw-upload-listener` props: `uploadTag` (required), `autoUpload` (default `false`; when `true`, added uploads are run immediately instead of emitting `media-upload-add`). Events: `media-upload-add`, `media-upload-finish`, `media-upload-fail`, `media-upload-cancel`.

`sw-media-preview-v2` props: `source` (required; media id or path), `showControls` (default `false`), `autoplay` (default `false`), `hideTooltip` (default `true`), `mediaIsPrivate` (default `false`, shows lock symbols).

## Essential identifiers

- `sw-media-upload-v2`, `sw-upload-listener`, `sw-media-preview-v2`
- `uploadTag`, `autoUpload`, `fileAccept`, `targetFolderId`, `defaultFolder`
- `media-upload-add`, `media-upload-finish`, `media-upload-fail`, `media-upload-cancel`

## Gotchas

- `uploadTag` must be identical on the upload component and the listener, or no events arrive.
- The docs put `:autoUpload="true"` on `sw-media-upload-v2`; the installed upload component has no `autoUpload` prop — it belongs on `sw-upload-listener`.
- The docs state `fileAccept` defaults to `image/*`; the installed default is `*/*`, so set it explicitly to restrict to images.
- `allowMultiSelect` defaults to `true`; pass `false` for a single file.

## Version notes

- `sw-upload-listener` notification helpers `updateSuccessNotification` / `showErrorNotification` are `@deprecated tag:v6.8.0`, to be replaced by centralized upload state in `sw-upload-status`.

## Code check (6.7.13.0)
- confirmed `uploadTag` — required String prop on the upload component — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-upload-v2/index.js:76
- corrected `variant` — docs: only `regular`/`compact`; valid values also include `small` — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-upload-v2/index.js:58
- confirmed `allowMultiSelect` — Boolean prop, default true — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-upload-v2/index.js:81
- corrected `fileAccept` — docs: standard is `image/*`; default is `*/*` — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-upload-v2/index.js:132
- corrected `autoUpload` — docs: prop of sw-media-upload-v2; declared only on sw-upload-listener, default false — vendor/shopware/administration/Resources/app/administration/src/app/component/utils/sw-upload-listener/index.js:64
- confirmed `disabled` — Boolean prop, default false — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-upload-v2/index.js:156
- confirmed `UPLOAD_FINISHED` — emitted as `media-upload-finish` (also add/fail/cancel) — vendor/shopware/administration/Resources/app/administration/src/core/service/api/media.api.service.js:11
- confirmed `hideTooltip` — preview Boolean prop, default true — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-preview-v2/index.js:100
- confirmed `mediaIsPrivate` — preview Boolean prop, default false — vendor/shopware/administration/Resources/app/administration/src/app/component/media/sw-media-preview-v2/index.js:106
- deprecated `updateSuccessNotification` — listener helper deprecated for v6.8.0 — vendor/shopware/administration/Resources/app/administration/src/app/component/utils/sw-upload-listener/index.js:155
