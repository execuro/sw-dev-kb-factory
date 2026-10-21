---
id: platform/func/commercial-features/scene-editor.md
title: Scene Editor
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/commercial-features/scene-editor
sourceHash: 9d32975378ba5e25edb042662d997cad3aa61e7107db9383c11465a21b0aa71d
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["scene editor", "3D scene", "3D objects", "Content > Scene Editor", "render image", "export image", "move tool", "rotate tool", "scale tool", "primitives", "light settings", "beta", "Shopware Commercial", "product images"]
summary: "Scene Editor (beta) under Content > Scene Editor: build 3D scenes from product 3D objects, set lights and cameras, and export rendered images to media."
lastBuilt: 2026-10-20
---
## What it is

The Scene Editor lets you build 3D scenes with your products' 3D models and render images from them. It is found under **Content > Scene Editor** in the Administration and is in beta with limited functionality.

## When to use

When you want to generate product images from 3D models, for example placing products in a staged scene with background, floor and lighting.

## Key steps / config

- **Overview**: lists scenes, with a list view, sorting by Name, Creation date or Modification date, a context menu (Edit, Duplicate, Delete) and **Create new scene**.
- **Create**: name the scene, then the editor opens.
- **3D Objects**: **Add 3D object** (types via dropdown), **Add group**, view selection (for example Free view), Move tool (blue Z, green Y, red X arrows), Rotate tool (rings), Scale tool (uniform by default, per-axis when unlinked), Light Settings (type for scene or object, presets or custom, light colour code, intensity 0-100%), **Export image**, **Save scene** (objects, lighting, camera perspectives).
- **Scene** settings: scene name, background colour, floor colour.
- **Export image to media**: choose a camera (or orbit view), a template or custom resolution with width and height, then **Save Image**; the image goes to the Scene Editor Media folder.
- **Shapes**: platforms and walls via **Add 3D Object** and the **Primitives** tab in Select Media; material properties and colour are editable.

## Gotchas

- Beta status: scope and behaviour may change.

## Version notes

Available to Shopware Rise plan customers (or higher) from Shopware 6.6.8.1; a commercial feature from the Beyond plan and part of the Shopware Commercial extension.
