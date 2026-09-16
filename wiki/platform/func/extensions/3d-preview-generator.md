---
id: platform/func/extensions/3d-preview-generator.md
title: 3d Preview Generator
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/3d-preview-generator
sourceHash: f6e4634b9245e97887e9f7284217b6540ac75daeb31c0d2eedf5fedad6152c2f
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["3D Preview Generator", ".glb", "glb file", "preview image", "media manager", "gallery slider", "Shopware Intelligence+", "AWS", "rendering service", "service registry", "product detail page", "product listing"]
summary: "Shopware service that auto-generates static preview images for uploaded .glb 3D files, shown in the storefront and media manager."
lastBuilt: "2026-09-15"
---

## What it is

The 3D Preview Generator is a Shopware service that automatically creates a static preview image for `.glb` 3D files, so 3D content displays as visually as other media types in the storefront and the admin media manager.

## When to use

When merchants upload 3D product models (`.glb`) and want a static preview shown in the product listing, on the product detail page gallery, or in the media manager, without manual configuration.

## Key steps / config

- Requires an active Shopware Intelligence+ subscription.
- Upload a `.glb` file — directly on the product or via the media manager — and preview generation starts automatically in the background; no configuration is required.
- The preview appears in the Media Manager and, in the storefront, e.g. on the product detail page's gallery slider thumbnails.
- Technical flow: the `.glb` file is temporarily transmitted to a secure rendering service running in a protected AWS cloud environment (end-to-end encryption, strict access restrictions), rendered into a static 2D preview image, then transferred back and saved into Shopware's media.
- On updating an existing installation, previews are **not** automatically generated for existing `.glb` files. To create them: re-upload the file (media manager or product), or trigger generation manually via a custom script or plugin (e.g. a Symfony command or repository service call).

## Essential identifiers

`.glb` file format, Shopware Intelligence+ subscription, service registry (data-processing consent)

## Gotchas

- Without re-upload or a manual trigger, existing 3D files remain visible without a preview in both storefront and admin after an update.
- Depending on system configuration, consent to data processing by Shopware services may be required first, granted via the service registry.
- The function is active by default and currently offers no additional settings.
