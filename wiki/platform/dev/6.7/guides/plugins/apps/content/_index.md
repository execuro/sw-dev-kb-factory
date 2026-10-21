---
id: platform/dev/6.7/guides/plugins/apps/content/_index.md
title: Content
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/content/
sourceHash: a8fcb63c22227e01a8c8f3d47ff4955e7021217d
codeCheckedAgainst: "6.7.15.1"
keywords: ["app content", "content", "cms", "shopping experiences", "layouts", "categories", "content visibility", "cms.xml", "apps"]
summary: Overview of app guides for store content - assigning content to categories, creating layouts and controlling content visibility by conditions.
lastBuilt: 2026-10-21
---
## What it is

Entry page for the app guides on content. With apps you can assign content to specific categories, create layouts, and control content visibility based on various conditions. The section's sub-guides (e.g. CMS) cover the details; for apps, custom CMS blocks are shipped in a `Resources/cms.xml` file of the app.

## Code check (6.7.15.1)
- confirmed `Resources/cms.xml` — app CMS extensions are read from this file during app lifecycle — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
