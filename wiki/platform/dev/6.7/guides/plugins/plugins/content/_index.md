---
id: platform/dev/6.7/guides/plugins/plugins/content/_index.md
title: Content
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/
sourceHash: c834005e315a7fd462b62705af49c7c5905b2527
codeCheckedAgainst: "6.7.15.1"
keywords: ["content", "plugin guides", "cms", "shopping experiences", "mail templates", "email management", "seo", "sitemap", "media management", "cms_page", "mail_template", "media"]
summary: Entry point for plugin guides that extend Shopware content features - CMS, email templates, SEO, sitemap generation and media management.
lastBuilt: 2026-10-21
---
## What it is

Section overview for the "Content" plugin guides. Shopware's content feature set covers content management (CMS / Shopping Experiences), email management, SEO optimization, sitemap generation and media management. These ship in the core; plugins extend or customize them to fit specific business needs and content strategies.

## When to use

Start here when a plugin needs to change how shop content is built or delivered: adding CMS blocks/elements, customizing mail templates, influencing SEO URLs, extending the sitemap, or working with media. The child guides cover each area.

## Essential identifiers

The content areas map to core entities and services under `Shopware\Core\Content` in the installed code:

- CMS layouts: entity `cms_page` (`CmsPageDefinition`)
- Email management: entity `mail_template` (`MailTemplateDefinition`)
- Media management: entity `media` (`MediaDefinition`)
- Sitemap generation: `SitemapExporter`

## Code check (6.7.15.1)
- confirmed `CmsPageDefinition::ENTITY_NAME` — CMS layouts are the `cms_page` entity — vendor/shopware/core/Content/Cms/CmsPageDefinition.php:37
- confirmed `MailTemplateDefinition::ENTITY_NAME` — email templates are the `mail_template` entity — vendor/shopware/core/Content/MailTemplate/MailTemplateDefinition.php:31
- confirmed `MediaDefinition::ENTITY_NAME` — media is the `media` entity — vendor/shopware/core/Content/Media/MediaDefinition.php:68
- confirmed `SitemapExporter` — core sitemap generation service — vendor/shopware/core/Content/Sitemap/Service/SitemapExporter.php:21
