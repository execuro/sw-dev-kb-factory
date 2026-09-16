---
id: platform/func/extensions/immersive-elements.md
docType: functional
title: "We will explain the **3D Model Journey** block in detail below, as it is somewhat more complex."
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/immersive-elements
sourceHash: e44c92a590f2bb1b3e2437d36acc994e40af4ed3b124fe6e303ef17173c0a0af
revision:
  current: true
  range: current
  swMax: null
  swMin: null
keywords: ["Immersive Elements", "Instorier", "Shopping Experiences", "Cylinder Gallery", "Depth Gallery", "Exploded View", "3D Model Journey", "Slide Behind Gallery", "VR Cinema", "hotspot", "Edit Lighting", "glb file", "Shopware Rise plan", "Extensions > My extensions", "augmented reality"]
summary: "Extension with six interactive 3D/immersive Shopping Experiences blocks (galleries, Exploded View, 3D Model Journey, VR Cinema), built with Instorier."
lastBuilt: "2026-09-15"
---
## What it is

Immersive Elements is an app, developed with Instorier, that adds interactive 3D/immersive blocks to Shopware's Shopping Experiences. It ships five (listed as six) components for galleries, exploded product views, 3D model tours and VR-style presentations, and is fully optimized for mobile, desktop and spatial devices.

## When to use

Use it to build more engaging landing, product or category pages in Shopping Experiences with 3D visuals, product tours, or interactive galleries instead of static images.

## Key steps / config

1. Requires at least the Shopware Rise plan on the shop domain; install/download under **Extensions > My extensions** while logged in with your Shopware Account.
2. Activate the extension using the switch on the left after installation.
3. Without a Shopware plan, the extension can be bought in the Shopware Store for a monthly fee of €49.
4. The blocks appear in the "Commerce" section of the block area in Shopping Experiences:
   - Immersive Elements - Cylinder Gallery: images displayed in an auto-playing 360° slider, speed/direction adjustable by mouse.
   - Immersive Elements - Depth Gallery: parallax effect via mouse movement/scroll.
   - Immersive Elements - Exploded View: interactive step-by-step exploded view of a 3D model; paid, €49/month in-app purchase, purchased via the block configuration's **"Buy"** button.
   - Immersive Elements - 3D Model Journey: animated tour around a 3D product with optional hotspots and text.
   - Immersive Elements - Slide Behind Gallery: content changes horizontally for added depth.
   - Immersive Elements - VR Cinema: 3D/VR cinema experience; supports webp video.
5. For best display, choose **Full width** as the "Size Mode" in Shopping Experiences, and place Immersive Elements blocks directly one after another without other elements in between.

**3D Model Journey configuration:** open the block's gear icon to reach element settings — upload a `.glb` file for the 3D model, optionally an `.mp3` audio track, set a Background color, and add extra `.jpg`/`.png`/`.webp` images via **Add media** (shown in the 360° view when interactivity is on). In **Content**, add snapshots to a section (e.g. front/side/top view, each with its own lighting), add hotspots via **Add Hotspot**, edit lighting via **Edit Lighting**, and save the camera position with **Save camera**. **Enable interactivity** lets customers rotate the model freely. **Layout Type** offers "Title" (with Title Tag H1/H2/H3, Lead, Body text, font sizes, Text color) or an image layout, plus **Button text**/**Button link**.

**Exploded View configuration:** upload the `.glb` model and import/export config via JSON in Settings; define **Views** (animation steps), use **Hierarchy** to show/hide and group components, add **Annotations** with links, and adjust **Scene** (explosion strength, background, lighting, "Enable Interactivity", "Auto-play until user interaction").

## Essential identifiers

- Admin path: **Extensions > My extensions**
- Block category: "Commerce" section of Shopping Experiences blocks
- File types: `.glb` (3D model), `.mp3` (audio), `.jpg`/`.png`/`.webp` (images)
- Blocks: Cylinder Gallery, Depth Gallery, Exploded View, 3D Model Journey, Slide Behind Gallery, VR Cinema

## Gotchas

Exploded View is a paid in-app purchase (€49/month), bought directly from the block configuration in Shopping Experiences. The hierarchy's structure and level of detail depend entirely on how the source 3D model file was prepared. An interactive learning path for this topic is available in the Community Hub.
