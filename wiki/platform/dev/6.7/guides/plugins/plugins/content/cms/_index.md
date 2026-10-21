---
id: platform/dev/6.7/guides/plugins/plugins/content/cms/_index.md
title: CMS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/
sourceHash: 8bdc4b4b72c585bdc06415f6f68a03d68ab026d4
codeCheckedAgainst: "6.7.15.1"
keywords: ["cms", "shopping experiences", "cms block", "cms element", "cms slot", "cms_page", "cms_block", "cms_slot", "registerCmsBlock", "registerCmsElement", "admin sdk", "content elements", "layouts"]
summary: Overview of extending the Shopware CMS from plugins - reusable blocks, configurable content elements, data for elements, Admin SDK access.
lastBuilt: 2026-10-21
---
## What it is

Entry page for the plugin guides on Shopware's CMS (Shopping Experiences). Shopware CMS creates and manages content using blocks and elements. Blocks are reusable sections of content that can be placed on multiple pages; inside blocks, content elements such as text, images, videos or sliders are added and configured.

## When to use

When a plugin needs to add its own CMS blocks or content elements, change their appearance or layout, or feed data into content elements - for example product information, categories, or dynamic content loaded from APIs.

## Key steps / config

What a CMS plugin can do, per the source:

- Add and organize CMS blocks - reusable content sections - and customize their appearance and layout.
- Add and configure content elements (text, images, videos, sliders and more) inside those blocks.
- Provide data for content elements, such as product information, categories, or dynamic content from APIs.
- Access and manage the CMS core functions through the Shopware Admin SDK, which offers tools and APIs for more advanced customization.

In the installed code, the Administration side registers blocks and elements on the `cmsService` via `registerCmsBlock(config)` and `registerCmsElement(config)`; both return `false` and register nothing unless `config.name` and `config.component` are set. On the data side, layouts are stored as the entities `cms_page`, `cms_section`, `cms_block` and `cms_slot` (a slot holds one element).

## Essential identifiers

- CMS blocks, CMS elements
- `registerCmsBlock`, `registerCmsElement` (Administration `cmsService`)
- Entities `cms_page`, `cms_block`, `cms_slot`
- Shopware Admin SDK

## Code check (6.7.15.1)
- confirmed `registerCmsElement` — requires `name` and `component`, else returns false — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:155
- confirmed `registerCmsBlock` — requires `name` and `component`, else returns false — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:177
- confirmed `cms_page` — CmsPageDefinition entity name — vendor/shopware/core/Content/Cms/CmsPageDefinition.php:37
- confirmed `cms_block` — CmsBlockDefinition entity name — vendor/shopware/core/Content/Cms/Aggregate/CmsBlock/CmsBlockDefinition.php:34
- confirmed `cms_slot` — CmsSlotDefinition entity name — vendor/shopware/core/Content/Cms/Aggregate/CmsSlot/CmsSlotDefinition.php:32
- unverified `Admin SDK` — separate npm package, outside the checked vendor roots
