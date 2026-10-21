---
id: platform/func/content/media.md
title: Media
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/content/media
sourceHash: e514f97221c58f2df44ceaa8d048c95ae2682ce2cfe02328851520434be8866a
revision:
  current: true
  range: "6.7.10.0 - 6.7.13.1"
  swMax: "6.7.13.1"
  swMin: "6.7.10.0"
keywords: ["media", "Content > Media", "media:delete-unused", "media:generate-thumbnails", "thumbnails", "media folder", "3D Optimizer", "Model Viewer", "Model Editor", "AI Copilot text to image", "glb", "upload", "alt text", "medien"]
summary: "Media manager under Content > Media: uploads, folders, thumbnail sizes, CLI cleanup, 3D Optimizer, AI text-to-image, Model Viewer and Model Editor."
lastBuilt: 2026-10-20
---
## What it is

The Media module (**Content > Media**) uploads, organises and manages files used in the shop. It also covers folder thumbnail settings, the 3D Optimizer, AI Copilot text-to-image generation and a viewer/editor for 3D models.

## When to use

When uploading or replacing files, organising folders, changing thumbnail sizes, deleting unused media, generating images from text, or inspecting and adjusting 3D models.

## Key steps / config

- **Upload**: the Upload file button, or a public URL via the arrow. Supported types: jpg, jpeg, png, webp, gif, svg, bmp, tiff, tif, eps, webm, mkv, flv, ogv, ogg, mov, mp4, avi, wmv, pdf, aac, mp3, wav, flac, oga, wma, txt, doc, glb.
- **Duplicate file dialog**: Upload and replace, Upload and rename, Use existing file, Skip file (only when uploading more than two files).
- **File actions**: Replace, Download, Move, Copy link, Delete; plus Preview, Meta data (name, alt text, meta title), Tags, Used in.
- **Folders**: Add new folder, Move, Settings, Dissolve (contents move up one level), Delete (removes contents). Settings define default location for media types and thumbnails.
- **Thumbnail settings**: Inherit settings from parent folder, Generate thumbnails for this folder, Keep aspect ratio, Thumbnail quality (1-100), Thumbnail Size list (lock keeps width equal to height). Default sizes are 400x400, 800x800 and 1920x1920.

CLI commands:

```text
media:delete-unused
media:generate-thumbnails
```

Run `media:generate-thumbnails` in the installation main directory after changing thumbnail sizes.

- **3D Optimizer**: per-folder option, visible only with an active Shopware Intelligence+ subscription; optimises uploaded 3D files and generates previews in the background through a RapidPipeline based service.
- **AI Copilot - Text to Image**: from the Rise plan via the Shopware Commercial extension. Enter a description, generate, then save to the AI-generated folder. Output is regenerated each time, one image per description, with a daily request limit.
  - Aspect ratios: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9; resolutions 1K and 2K; defaults 16:9 and 1K. Unsupported formats map to the closest supported ratio.
- **Model Viewer**: shown in the sidebar preview for a 3D file; left mouse rotates, right mouse moves the camera, wheel zooms. **Expand** opens the **Model Editor**, which offers Move, Rotate and Scale tools; changes are saved into the 3D file in the database and persist when the file is downloaded.

## Gotchas

- Deleting a folder removes everything inside; use Dissolve to keep contents.
- Image generation cannot edit an already generated image.

## Version notes

The page documents Shopware 6.7.10.0 to 6.7.13.1. The AI text-to-image feature uses Google's "Nano Banana 2" model.
