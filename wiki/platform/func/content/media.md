---
id: platform/func/content/media.md
title: Media
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/content/media
sourceHash: 9a8c55ff954da86a9532a13b455fd2d2dc0c783a5ff8fdd6be2f574a9521c1ed
revision:
  current: true
  range: "6.7.8.0 - 6.7.9.1"
  swMin: "6.7.8.0"
  swMax: "6.7.9.1"
keywords: ["Media Manager", "Content > Media", "media folders", "media:delete-unused", "media:generate-thumbnails", "thumbnail settings", "AI Copilot text to image", "Model Viewer", "Model Editor", "glb 3D model", "upload media", "file already exists"]
summary: "The Media Manager (Content > Media): uploading, organizing, deleting media/folders, thumbnail generation, AI image generation and the 3D Model Viewer/Editor."
lastBuilt: "2026-09-15"
---
## What it is
Describes the Media module under **Content > Media**, used to upload, organize into folders, and manage media files (including 3D models) reused throughout the shop.

## When to use
When uploading/organizing storefront media, generating thumbnails, cleaning up unused files, generating AI images, or reviewing/editing 3D models.

## Key steps / config
Overview: search, Upload file button (or upload via URL using the button's arrow), Presentation and Sort by controls, Generate image (AI-Copilot), Add new folder. Selecting a medium/folder shows information and actions on the right, also reachable via a context menu.

Supported upload file types:

```
jpg, jpeg, png, webp, gif, svg, bmp, tiff, tif, eps, webm, mkv, flv, ogv, ogg, mov, mp4, avi, wmv, pdf, aac, mp3, wav, flac, oga, wma, txt, doc, glb
```

Uploading a duplicate filename offers: Upload and replace, Upload and rename, Use existing file, Skip file (multi-file uploads only).

Media actions: Replace, Download, Move, Copy link, Delete. Meta data panel allows changing name, alt-text, meta-title. Used in shows where the medium is referenced (with links).

Deleting unused media via console:

```
media:delete-unused
```

Folder actions: Move, Settings, Dissolve (removes the folder, moving its contents up one level), Delete. Folder settings: general settings (name, default location for certain media files) and Thumbnails (Inherit settings from parent folder, Generate thumbnails for this folder, Keep aspect ratio, Thumbnail quality 1-100, Thumbnail Size list with Edit list / add sizes). Regenerate thumbnails after a size change via:

```
media:generate-thumbnails
```

Default thumbnail sizes for all uploaded images: 400x400, 800x800, 1920x1920.

AI-Copilot Text to Image (Shopware Rise plan via Shopware Commercial): enter a description, click generate; images are saved to an auto-created AI-generated folder; generation is rate-limited per day; uses Google's "Nano Banana 2". Supported aspect ratios: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9. Supported resolutions: 1K, 2K. Default aspect ratio 16:9, default resolution 1K.

Model Viewer: appears automatically in the sidebar preview when a 3D file is selected; left mouse button rotates, right mouse button pans, scroll wheel zooms. **Expand** opens the Model Editor as a modal, allowing move/rotate/scale of the model with changes saved directly to the 3D file.

## Essential identifiers
- `Content > Media`
- `media:delete-unused`
- `media:generate-thumbnails`
- 3D model format: `.glb`

## Gotchas
The generated AI image is fully regenerated on each generation — no incremental adjustments are possible, and only one image is produced per description, with a daily request limit.
