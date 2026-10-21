---
id: platform/func/extensions/3d-preview-generator.md
title: 3d Preview Generator
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/3d-preview-generator
sourceHash: ceaeaccb579de668fca4e59b1f8375b59aa9288e3fb964ca8885508c7f59891d
revision:
  current: true
  range: "6.7.1.0 - 6.7.13.1"
  swMax: "6.7.13.1"
  swMin: "6.7.1.0"
keywords: ["3D Pipeline", "3D Pipeline Service", "3D optimization", "preview generation", "RapidPipeline", "glb", "Shopware Intelligence+", "media folder", "3D viewer", "3D files", "preview image", "3D preview generator"]
summary: "3D Pipeline Service: optimizes uploaded 3D files and creates previews per media folder; needs Intelligence+ and 6.7.14.0 or later."
lastBuilt: 2026-10-20
---
## What it is

The 3D Pipeline is a Shopware service that optimizes 3D files for web use and generates preview images. When enabled for a media folder, uploaded 3D files are processed in the background by a service based on RapidPipeline. Previews can appear in product listings, product detail pages and the Media Manager.

## When to use

When 3D files (for example `.glb`) should load faster in the storefront 3D viewer and need preview images without manual work.

## Key steps / config

- The option is only visible with an active Shopware Intelligence+ subscription.
- Enable or disable it with the "3D optimization" option in the settings of the media folder.
- Example workflow: upload a `.glb` under Content > Media, the service optimizes it and generates a preview, a notification appears when ready, the preview shows in the Media Manager and, for example, in product detail gallery thumbnails.

## Gotchas

- Preview images are not generated retroactively for existing `.glb` files after an update. Re-upload the file (Media Manager or in the product), or trigger generation with a custom script or plugin, for example a Symfony command or a repository service call. Without this, existing 3D files stay visible without a preview.
- Files are processed by the third party RapidPipeline, which does not store or otherwise use them.

## Version notes

The 3D Pipeline is compatible with Shopware 6.7.14.0 and later.
