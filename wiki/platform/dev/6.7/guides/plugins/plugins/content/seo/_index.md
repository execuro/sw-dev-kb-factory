---
id: platform/dev/6.7/guides/plugins/plugins/content/seo/_index.md
title: SEO
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/seo/
sourceHash: 2bc55d4342596e27710bc72b0178918641304b8e
codeCheckedAgainst: "6.7.13.0"
keywords: ["seo", "seo urls", "robots.txt", "search engine optimization", "meta tags", "crawler", "SeoUrlRouteInterface", "shopware.seo_url.route", "RobotsDirectiveParsingEvent", "RobotsUnknownDirectiveEvent", "RobotsPageLoadedEvent", "seo plugin guides"]
summary: Overview of plugin-level SEO extension points in Shopware 6.7 - custom SEO URLs for routes and entities, and robots.txt parsing/generation events.
lastBuilt: 2026-09-15
---
## What it is

Section overview for SEO topics in plugin development. It points to two guides: adding custom SEO URLs, and extending the `robots.txt` configuration.

## When to use

- You need readable, translatable URLs for product, category, content or custom pages, or want to customize meta titles, descriptions and keywords per page.
- You need to change how crawlers interact with the shop through `robots.txt` (standard directives, user-agent blocks) by hooking into its parsing and generation.

## Key steps / config

- **SEO URLs** — covered in the "Add custom SEO URLs" guide: static SEO URLs are inserted into `seo_url` for a controller route; dynamic SEO URLs for entities use a class implementing `Shopware\Core\Content\Seo\SeoUrlRoute\SeoUrlRouteInterface`, registered with the tag `shopware.seo_url.route`.
- **Robots configuration** — covered in the "Extend robots configuration" guide. The installed storefront ships events in `Shopware\Storefront\Page\Robots` for extension: `RobotsDirectiveParsingEvent`, `RobotsUnknownDirectiveEvent` and `RobotsPageLoadedEvent`.

## Essential identifiers

- `Shopware\Core\Content\Seo\SeoUrlRoute\SeoUrlRouteInterface`
- Tag `shopware.seo_url.route`
- `Shopware\Storefront\Page\Robots\Event\RobotsDirectiveParsingEvent`
- `Shopware\Storefront\Page\Robots\Event\RobotsUnknownDirectiveEvent`
- `Shopware\Storefront\Page\Robots\RobotsPageLoadedEvent`

## Code check (6.7.13.0)
- confirmed `SeoUrlRouteInterface` — interface for dynamic SEO URL routes — vendor/shopware/core/Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:11
- confirmed `shopware.seo_url.route` — tagged_iterator consumed by SeoUrlRouteRegistry — vendor/shopware/core/Framework/DependencyInjection/seo.xml:45
- confirmed `RobotsDirectiveParsingEvent` — robots.txt parsing event — vendor/shopware/storefront/Page/Robots/Event/RobotsDirectiveParsingEvent.php:19
- confirmed `RobotsUnknownDirectiveEvent` — unknown directive event — vendor/shopware/storefront/Page/Robots/Event/RobotsUnknownDirectiveEvent.php:22
- confirmed `RobotsPageLoadedEvent` — robots page loaded event — vendor/shopware/storefront/Page/Robots/RobotsPageLoadedEvent.php:12
