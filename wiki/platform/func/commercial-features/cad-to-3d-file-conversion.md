---
id: platform/func/commercial-features/cad-to-3d-file-conversion.md
title: Cad To 3d File Conversion
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/commercial-features/cad-to-3d-file-conversion
sourceHash: 70b9da8532f15d7aa2c67ac72696158da50d9bd0721be757b5373820672d5872
revision:
  current: true
  range: "current"
  swMin: null
  swMax: null
keywords: ["CAD to 3D conversion", "GLB conversion", "RapidPipeline API", "Media Manager", "STEP file", "Shopware Intelligence+", "Convert to 3D model", "3D asset generation"]
summary: "Converts uploaded CAD STEP files into web-optimized GLB 3D models in the Media Manager via a background RapidPipeline API service."
lastBuilt: "2026-09-15"
---
## What it is
The CAD to 3D service converts CAD files into web-compatible GLB 3D models directly inside the Media Manager for use across the storefront.

## When to use
When you have CAD source files and want ready-to-use lightweight 3D models without external conversion tools.

## Key steps / config
1. Open the Media Manager under Content > Media.
2. Upload a CAD file in STEP format, or select an existing one.
3. Start the conversion via **Convert to 3D model** in the sidebar or the file's context menu.
4. An information view shows conversion progress; the window can be closed while it runs.
5. A notification appears on completion; the converted file is saved automatically in a newly created folder.

## Essential identifiers
- Supported input format: `.STEP`
- Maximum file size: 2 GB
- Conversion backend: RapidPipeline API

## Gotchas
The conversion produces clean, lightweight geometry only — materials, textures and lighting are not included, and advanced/non-geometric data (animations, rigs) is not supported and is ignored. A limited number of free conversions is available per month; beyond that quota an active Shopware Intelligence+ subscription is required.
