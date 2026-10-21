---
id: platform/dev/6.7/guides/plugins/plugins/content/sitemap/_index.md
title: Sitemap
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/sitemap/
sourceHash: ea2b45e0731146317cf9b5e617d35d6d0a5125af
codeCheckedAgainst: "6.7.15.1"
keywords: ["sitemap", "sitemap.xml", "AbstractUrlProvider", "shopware.sitemap_url_provider", "shopware.sitemap.custom_urls", "shopware.sitemap.excluded_urls", "SitemapQueryEvent", "url provider", "seo", "search engine indexing", "custom sitemap urls", "exclude urls"]
summary: Overview of Shopware 6.7 sitemap extension - add custom URLs, modify or exclude existing entries via plugins and config.
lastBuilt: 2026-10-21
---
## What it is

Entry page for the sitemap guides. Shopware generates a storefront sitemap (products, categories and other core URLs); plugins can add custom sitemap URLs and modify existing entries, so search engines get a structured overview of the storefront content.

## When to use

- You need extra pages, categories, products or custom-entity URLs in the sitemap.
- You need to change metadata of existing entries, exclude specific URLs, or override SEO URL behavior.

## Key steps / config

The subpages cover three tasks:

- Add entries: static URLs via the `shopware.sitemap.custom_urls` config, dynamic ones via a class extending `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider` tagged `shopware.sitemap_url_provider`.
- Modify entries: decorate a core URL provider, or subscribe to `SitemapQueryEvent`.
- Remove entries: `shopware.sitemap.excluded_urls` config.

## Essential identifiers

- `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider`
- `shopware.sitemap_url_provider`
- `shopware.sitemap.custom_urls`, `shopware.sitemap.excluded_urls`
- `Shopware\Core\Content\Sitemap\Event\SitemapQueryEvent`

## Code check (6.7.15.1)
- confirmed `AbstractUrlProvider` — abstract base for sitemap URL providers — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:13
- confirmed `shopware.sitemap_url_provider` — tag collecting core providers — vendor/shopware/core/Content/DependencyInjection/sitemap.php:88
- confirmed `custom_urls` — sitemap config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:300
- confirmed `excluded_urls` — sitemap config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:320
- confirmed `SitemapQueryEvent` — dispatched before provider queries — vendor/shopware/core/Content/Sitemap/Event/SitemapQueryEvent.php:17
