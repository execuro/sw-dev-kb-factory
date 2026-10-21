---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/content/seo/_index.md
sourceHash: 2bc55d4342596e27710bc72b0178918641304b8e
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/seo/
title: SEO
version: "6.7"
versions:
  - "6.7"
keywords: ["seo", "seo url", "robots.txt", "SeoUrlRouteInterface", "RobotsDirectiveParsingEvent", "RobotsUnknownDirectiveEvent", "meta title", "meta description", "search engine optimization", "crawler", "user-agent block", "friendly url"]
summary: Overview of plugin SEO guides in Shopware 6.7, covering custom SEO URLs for pages/entities and extending robots.txt parsing via events.
lastBuilt: 2026-10-21
---
## What it is

This is the entry page for plugin-level SEO topics. It covers two areas:

- **SEO URLs.** Custom SEO URLs for product, category, content and other pages, plus per-page meta titles, descriptions and keywords. The "Add custom SEO URLs" guide covers it. Dynamic routes there implement `Shopware\Core\Content\Seo\SeoUrlRoute\SeoUrlRouteInterface`.
- **Robots configuration.** `robots.txt` support covers the standard directives and user-agent blocks. Plugins extend parsing and generation through events (`RobotsDirectiveParsingEvent`, `RobotsUnknownDirectiveEvent`), as described in the "Extend robots configuration" guide.

## When to use

Start here when a plugin needs to influence how search engines see the shop. Pick the SEO URL guide for URL paths and meta data, or the robots guide to control crawler access.

## Code check (6.7.15.1)
- confirmed `SeoUrlRouteInterface` — interface for dynamic SEO URL routes — vendor/shopware/core/Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:10
- confirmed `RobotsDirectiveParsingEvent` — dispatched after robots.txt parsing — vendor/shopware/storefront/Page/Robots/Event/RobotsDirectiveParsingEvent.php:19
- confirmed `RobotsUnknownDirectiveEvent` — dispatched for unknown directives — vendor/shopware/storefront/Page/Robots/Event/RobotsUnknownDirectiveEvent.php:24
