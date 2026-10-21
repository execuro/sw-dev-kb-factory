---
id: platform/dev/6.7/guides/plugins/apps/content/cms/_index.md
title: CMS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/content/cms/
sourceHash: 116d0708e65a0322f15df8ffef5785238d6cff1e
codeCheckedAgainst: "6.7.15.1"
keywords: ["app cms", "cms block", "cms element", "cms.xml", "shopping experiences", "custom cms block", "administration", "app", "einkaufswelten"]
summary: Overview of extending Shopware CMS (Shopping Experiences) from an app with custom CMS blocks or elements, available in the Administration after install.
lastBuilt: 2026-10-21
---
## What it is

Entry page for extending Shopware's content management (Shopping Experiences) from an app by adding custom CMS blocks or elements. A custom block can hold content such as text, images or HTML and be positioned within a CMS layout. Once the app is installed and activated, the block is available in the Shopware Administration for building store content. In the installed code, app blocks are read from the app's `Resources/cms.xml` on install/update and stored as app CMS blocks.

## Code check (6.7.15.1)
- confirmed `Resources/cms.xml` — read during app install/update to register CMS blocks — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
- confirmed `template` — app CMS block preview template stored with AllowHtml (sanitized by default) — vendor/shopware/core/Framework/App/Aggregate/CmsBlock/AppCmsBlockDefinition.php:63
