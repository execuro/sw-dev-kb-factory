---
id: platform/func/extensions/image-editor.md
title: Image Editor
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/image-editor
sourceHash: 0f5736e293e9bf103d37dbd4f8657697b852f1122f831b25bdbdb3eb9843c735
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["image editor", "Content > Image Editor", "crop object", "add shadow", "recolor object", "erase object", "add to background", "Finegrain API", "Intelligence+", "AI image editing", "background removal", "bildeditor"]
summary: "AI Image Editor under Content > Image Editor: cut out objects, add shadows, recolor, erase, crop and set backgrounds; discontinued after October 31, 2026."
lastBuilt: 2026-10-20
---
## What it is

The Image Editor is an AI-assisted tool in the Administration (**Content > Image Editor**) for editing product images: cutting out products and merging them into backgrounds with matching light and shadow.

## When to use

When preparing product images, for example removing a background, placing a product on a new background, recolouring or erasing an object.

## Key steps / config

- Add an image through **Open media** (from media management) or **Upload image**. Supported formats: JPG, PNG, WebP. Recently edited images appear under "or open a recent image".
- Tools: Add object (place a cut-out on a background), Crop object (remove the background, PNG output), Add shadow, Recolor object, Erase object, Crop (size or fixed aspect ratio), Add to background (only for images with an alpha channel; background is a single colour or an image).
- View settings: zoom (+ and -) and current dimensions in pixels.
- Example: cut out shoes with Crop object, then place them with Add object in Image mode on a new background; for recolouring, select the object with the selection frame and choose the new colour.

## Gotchas

- The Image Editor is no longer available after October 31, 2026.
- Uses the Finegrain API (AI); results are not checked manually and can contain errors.
- A limited number of free requests exists per month; further requests need an active Shopware Intelligence+ subscription.
