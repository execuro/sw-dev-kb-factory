---
id: platform/dev/6.7/guides/plugins/plugins/content/_index.md
title: Content
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/
sourceHash: c834005e315a7fd462b62705af49c7c5905b2527
codeCheckedAgainst: "6.7.13.0"
keywords: ["content", "cms", "shopping experiences", "mail templates", "email management", "seo", "seo urls", "sitemap", "sitemap:generate", "media management", "CmsPageDefinition", "MailTemplateDefinition", "MediaDefinition", "plugin guides"]
summary: Overview of Shopware 6.7 content plugin guides - CMS, email templates, SEO, sitemap generation and media management.
lastBuilt: 2026-09-15
---
## What it is

Landing page for the plugin guides in the "Content" area. In Shopware, content covers the capabilities for managing and enhancing shop content: content management (CMS / Shopping Experiences), email management, SEO optimization, sitemap generation, and media management. These functions are part of the core system; plugins can extend or customize them for specific business needs and content strategies.

## When to use

Start here when a plugin task touches shop content rather than checkout or catalogue logic: adding CMS blocks or elements, changing mail templates, adjusting SEO URLs, influencing the generated sitemap, or working with media. The concrete how-tos live in the sub-guides of this section.

## Essential identifiers

In the installed code these areas live under the `Shopware\Core\Content` namespace:

- CMS: `Shopware\Core\Content\Cms\CmsPageDefinition` (entity `cms_page`)
- Email management: `Shopware\Core\Content\MailTemplate\MailTemplateDefinition` (entity `mail_template`)
- SEO: `Shopware\Core\Content\Seo\SeoUrl\SeoUrlDefinition` (entity `seo_url`)
- Sitemap generation: CLI command `sitemap:generate`
- Media management: `Shopware\Core\Content\Media\MediaDefinition` (entity `media`)

## Code check (6.7.13.0)
- confirmed `CmsPageDefinition::ENTITY_NAME` — `cms_page` entity for CMS layouts — vendor/shopware/core/Content/Cms/CmsPageDefinition.php:34
- confirmed `MailTemplateDefinition::ENTITY_NAME` — `mail_template` entity for email management — vendor/shopware/core/Content/MailTemplate/MailTemplateDefinition.php:28
- confirmed `SeoUrlDefinition::ENTITY_NAME` — `seo_url` entity for SEO URLs — vendor/shopware/core/Content/Seo/SeoUrl/SeoUrlDefinition.php:24
- confirmed `sitemap:generate` — sitemap generation command — vendor/shopware/core/Content/Sitemap/Commands/SitemapGenerateCommand.php:28
- confirmed `MediaDefinition::ENTITY_NAME` — `media` entity for media management — vendor/shopware/core/Content/Media/MediaDefinition.php:65
