---
id: platform/func/tutorials-and-faq/shopware-video-guide.md
title: Shopware Video Guide
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/shopware-video-guide"
sourceHash: "1441e90bd9dd78327af15379bbb019217210324db12ce3101c82de3772cb34b0"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["self-hosted video", "media manager", "video cover", "poster image", "product gallery", "shopping experiences", "url_upload_max_size", "upload_max_filesize", "post_max_size", "video/mp4", "video/webm", "video/ogg"]
summary: "How to upload and use self-hosted videos in the Media Manager: supported formats, size limits, and adding videos to products and CMS pages."
lastBuilt: "2026-09-15"
---

## What it is

A guide to uploading and using self-hosted videos in Shopware's Media Manager, including
supported video formats, size limits, and how to add a video to product media galleries
and storefront CMS content.

## When to use

When a merchant wants to add a self-hosted video (not an embedded external video) to a
product's media gallery or a Shopping Experiences layout, and needs to know which
formats and size limits apply.

## Key steps / config

- **Supported playable formats**: `video/mp4` (`.mp4`), `video/ogg` (`.ogv`/`.ogg`),
  `video/webm` (`.webm`). Other formats (e.g. `.mov`, `.avi`) can be uploaded but may
  show an unsupported-format warning in the Media Manager and may not play in the
  storefront.
- Shopware stores and serves the original file — it does **not** transcode or re-encode
  video, and enforces no codec/resolution requirements; playback depends on the
  customer's browser.
- **Local upload size limits** depend on server/PHP settings, e.g. `upload_max_filesize`,
  `post_max_size`, and any reverse-proxy limits.
- **Upload by URL** (if enabled) is governed by the Shopware setting
  `shopware.media.url_upload_max_size`: `0` means no explicit Shopware limit; any
  non-zero value rejects files above that size.
- **Upload a video**: go to Content > Media, open/create a target folder, upload via
  drag-and-drop or the upload button (or switch to Upload by URL if enabled).
- **Add a cover (poster image)**: select the uploaded video in the Media Manager, choose
  **Set cover image** in the sidebar, select an image file, and save — the storefront
  video player uses this as its poster image.
- **Use in a product gallery**: open Catalogues > Products, select a product, scroll to
  the Media card, add the uploaded video, and save.
- **Use in CMS pages**: in Content > Shopping Experiences, open/create a layout, add an
  element that supports mixed media (e.g. an image gallery), choose the uploaded video,
  and save/assign the layout.

## Essential identifiers

- `shopware.media.url_upload_max_size` (config key for URL-upload size limit)
- `upload_max_filesize`, `post_max_size` (PHP upload limits)
- `video/mp4`, `video/ogg`, `video/webm` (supported MIME types)

## Gotchas

- **Unsupported format warning** — cause: file isn't `video/mp4`/`video/ogg`/`video/webm`;
  fix: re-encode and re-upload.
- **"Payload too large" on upload** — cause: server/proxy limits below the file size;
  fix: raise `upload_max_filesize`/`post_max_size`, or use URL upload if enabled.
- **Transport/timeout errors** — cause: unstable connection or server timeout on large
  uploads; fix: retry on a stable connection, reduce file size, or use URL upload.
- **Cover selection fails** — cause: the selected cover isn't an image, or the target
  media item isn't a video; fix: choose a valid image and confirm the media is a video.
