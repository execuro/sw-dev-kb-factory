---
id: platform/dev/6.7/guides/plugins/plugins/content/cms/_index.md
title: CMS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/
sourceHash: 8bdc4b4b72c585bdc06415f6f68a03d68ab026d4
codeCheckedAgainst: "6.7.13.0"
keywords: ["cms", "shopping experiences", "cms blocks", "cms elements", "layouts", "cmsService", "registerCmsBlock", "registerCmsElement", "CmsBlockDefinition", "CmsSlotDefinition", "admin sdk", "content elements", "page builder"]
summary: Overview of Shopware 6.7 CMS plugin guides - pages built from reusable blocks holding content elements, extendable via plugins and the Admin SDK.
lastBuilt: 2026-09-15
---
## What it is

Landing page for the CMS (Shopping Experiences) plugin guides. Shopware CMS creates and manages content using **blocks** and **elements**:

- Blocks are reusable sections of content that can be placed on multiple pages; their appearance and layout can be customized.
- Inside blocks, content elements such as text, images, videos and sliders are added and configured.
- Elements can be fed with data, such as product information, categories, or dynamic content from APIs.

The CMS core functions can also be accessed and managed through the Shopware Admin SDK, which gives developers tools and APIs for more advanced customization of CMS functionality.

## When to use

Start here when a plugin needs to add its own layout units (blocks) or content primitives (elements) to the Shopping Experiences layout designer, or needs to fill elements with dynamic data. The sub-guides cover adding a CMS block and adding a CMS element.

## Essential identifiers

Confirmed in the installed code (not named in this overview page itself):

- Administration service `cmsService` with `registerCmsBlock()` and `registerCmsElement()` — the registration entry points used by the block and element guides.
- Entities `cms_block` (`Shopware\Core\Content\Cms\Aggregate\CmsBlock\CmsBlockDefinition`) and `cms_slot` (`Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotDefinition`) — the stored block and element (slot) data.

## Code check (6.7.13.0)
- confirmed `cmsService` — administration service provider for CMS registration — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:575
- confirmed `CmsService.registerCmsBlock()` — registers a block, requires `name` and `component` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:177
- confirmed `CmsService.registerCmsElement()` — registers an element, requires `name` and `component` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:155
- confirmed `CmsBlockDefinition::ENTITY_NAME` — `cms_block` entity — vendor/shopware/core/Content/Cms/Aggregate/CmsBlock/CmsBlockDefinition.php:31
- confirmed `CmsSlotDefinition::ENTITY_NAME` — `cms_slot` entity — vendor/shopware/core/Content/Cms/Aggregate/CmsSlot/CmsSlotDefinition.php:29
- unverified `Shopware Admin SDK` — separate package, outside the three vendor roots
