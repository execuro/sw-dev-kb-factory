---
id: platform/dev/6.7/concepts/commerce/content/_index.md
title: Content
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/content/
sourceHash: c9910cbae167bf28d246f92ed08a60ab85131176
codeCheckedAgainst: "6.7.15.1"
keywords: ["content", "cms", "Shopping Experiences", "Page Builder", "layouts", "cms_page", "sw-cms", "cookie consent", "Cookie Consent Management", "gdpr", "privacy"]
summary: Shopware 6.7 content concepts - Shopping Experiences CMS layouts built in the Admin Page Builder, and cookie consent management.
lastBuilt: 2026-10-21
---
## What it is

The entry page for Shopware's content concepts. Shopware 6 ships an integrated content management system based on layouts, called *Shopping Experiences*. Layouts are composed and managed with a tool in the Admin panel referred to as the *Page Builder*.

Beyond content management, the section also covers *Cookie Consent Management*: features that help support GDPR compliance by handling customer privacy preferences and cookie handling transparently.

## When to use

Start here when you need to find the concept pages on CMS layouts (Shopping Experiences / Page Builder) or on cookie consent and privacy handling in the Storefront and Store API.

## Essential identifiers

- Shopping Experiences (CMS), Page Builder (Admin module `sw-cms`)
- Cookie Consent Management

## Code check (6.7.15.1)
- confirmed `CmsPageDefinition` — entity definition behind Shopping Experiences layouts — vendor/shopware/core/Content/Cms/CmsPageDefinition.php:35
- confirmed `CmsSectionDefinition` — layout section entity — vendor/shopware/core/Content/Cms/Aggregate/CmsSection/CmsSectionDefinition.php:33
- confirmed `CmsBlockDefinition` — layout block entity — vendor/shopware/core/Content/Cms/Aggregate/CmsBlock/CmsBlockDefinition.php:32
- confirmed `CmsSlotDefinition` — layout slot entity — vendor/shopware/core/Content/Cms/Aggregate/CmsSlot/CmsSlotDefinition.php:30
- confirmed `sw-cms` — Admin module implementing the Page Builder — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/index.ts:39
- confirmed `CookieProvider` — core service collecting cookie groups for consent management — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:28
