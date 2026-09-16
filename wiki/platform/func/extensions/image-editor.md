---
id: platform/func/extensions/image-editor.md
docType: functional
title: Image Editor
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/image-editor
sourceHash: 057d9c7a23fcf59537a346d792d93ca6dceff7d7e790b2e84c57d814f15c9d13
revision:
  current: true
  range: current
  swMax: null
  swMin: null
keywords: ["image editor", "product image editing", "cut out product", "background removal", "add shadow", "recolor object", "crop object", "add object", "Finegrain API", "Content > Image Editor", "Shopware Intelligence+", "AI image editing", "crop image", "erase object"]
summary: "Admin tool under Content > Image Editor to cut out, place, shadow, recolor and crop product images using the AI-based Finegrain API."
lastBuilt: "2026-09-15"
---
## What it is

The Image Editor is an admin tool under **Content > Image Editor** for editing product images: cutting out objects, placing them on new backgrounds, adding shadows, recoloring, erasing objects, and cropping. It uses the `Finegrain API`, an AI-based image processing service, in the background.

## When to use

Use it when preparing product photography for the shop — for example removing a product from its original background and compositing it onto a new one, changing an object's color, or cropping an image to a specific size or fixed aspect ratio.

## Key steps / config

1. Open **Content > Image Editor**.
2. Add an image via **Open media** (select an already uploaded image) or **Upload image** (upload a new file from your computer).
3. Supported file formats: JPG, PNG, WebP.
4. Use the editing tools at the top right of the window:
   - Add object — place a cut-out object on a background.
   - Crop object — remove the background of an image.
   - Add shadow — add a natural shadow to a cropped object.
   - Recolor object — change the color of an object.
   - Erase object — remove an object from an existing image.
   - Crop — crop the image to a specific size or fixed aspect ratio.
   - Add to background — only available for images with an alpha channel (transparency); insert the object onto a single background color or another image.
5. The **or open a recent image** section lists recently opened/edited images for continued editing.
6. Zoom controls and the current image dimensions in pixels are shown in the lower-left of the editing window.

## Essential identifiers

- Admin path: **Content > Image Editor**
- `Finegrain API` — underlying AI image service
- Supported formats: JPG, PNG, WebP

## Gotchas

A limited number of free requests is available per month; once that quota is exhausted, an active Shopware Intelligence+ subscription is required for additional requests. AI results are not checked manually, so verify the output before using it further.
