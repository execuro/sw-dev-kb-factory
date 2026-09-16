---
id: platform/func/commercial-features/scene-editor.md
title: Scene Editor
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/commercial-features/scene-editor
sourceHash: 5984585772a365dd3eff289c98cc8d2ed3b09c3f688adbfebad8d2cbafc5a96c
revision:
  current: true
  range: "current"
  swMin: null
  swMax: null
keywords: ["Scene Editor", "3D scene", "Content > Scene Editor", "Insider Previews", "Shopware Rise plan", "export image", "3D object", "product image rendering", "Move Rotate Scale tools", "beta feature"]
summary: "Scene Editor (beta) lets Rise-plan customers compose 3D scenes with products and render product images, accessible under Content > Scene Editor."
lastBuilt: "2026-09-15"
---
## What it is
The Scene Editor lets merchants build 3D scenes with their products and render product images from them, available under **Content > Scene Editor**.

## When to use
When generating product photography-style images from existing 3D models instead of traditional photo shoots.

## Key steps / config
Overview lists existing scenes with a list view, sort-by (Name/Creation date/Modification date) dropdown, and a per-scene context menu (Edit, Duplicate, Delete); create new scenes via **Create new scene**.

Scene Editor controls: Add 3D object, Add group, View selection, Move tool (arrows: blue = Z axis, green = Y axis, red = X axis), Rotate tool (rings: red = tilt forward/back, blue = tilt left/right, green = rotate on own axis, yellow outer ring = rotate from camera), Scale tool (green = height, red = width, blue = depth), Light Settings (type, presets, light colour e.g. `#ffffff`, light intensity 0-100%), Export image, Save scene.

Scene tab: Scene name, Background colour, Floor colour. Export image to media: choose camera, resolution, width, height, then **Save Image** stores it in the Scene Editor Media folder. Shapes (platforms/walls) are added via Add 3D Object > Primitives tab.

## Essential identifiers
- `Content > Scene Editor`

## Gotchas
Requires activation via the Insider Previews module for versions between 6.6.8.1 and 6.6.10.5; available to Shopware Rise plan (or higher) customers from 6.6.8.1 onward. This is a beta feature — functionality is limited and behaviour may still change.

## Version notes
Scene Editor is available from Shopware 6.6.8.1 onward for Rise plan customers; between 6.6.8.1 and 6.6.10.5 it must be enabled via Insider Previews first.
