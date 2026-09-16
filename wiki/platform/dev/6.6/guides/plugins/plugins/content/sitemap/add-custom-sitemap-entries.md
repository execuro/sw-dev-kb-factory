---
id: platform/dev/6.6/guides/plugins/plugins/content/sitemap/add-custom-sitemap-entries.md
title: Add custom sitemap entries
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/sitemap/add-custom-sitemap-entries.html
sourceHash: c4c8688d0d24e56ca37b74901ceb1a3b434e440c
keywords: ["shopware.sitemap.custom_urls", "AbstractUrlProvider", "shopware.sitemap_url_provider", "UrlResult", "getUrls", "getName", "getDecorated", "DecorationPatternException", "sitemap URL provider", "changeFreq", "custom sitemap entries"]
summary: "Add sitemap URLs via shopware.sitemap.custom_urls config or by registering a custom AbstractUrlProvider."
lastBuilt: "2026-09-15"
---
## What it is

This guide shows two ways to add custom URLs to Shopware's generated sitemap: a static configuration list, or a dynamic "URL provider" class for custom entities.

## When to use

Use the configuration approach for a small, fixed set of extra URLs. Use a URL provider when URLs must be generated dynamically from a custom entity's data (e.g. one URL per entity, with SEO URL lookup).

## Key steps / config

**Via configuration**, add entries under `shopware.sitemap.custom_urls`:

```yaml
shopware:
    sitemap:
        custom_urls:
            -   url: 'custom-url'
                salesChannelId: '98432def39fc4624b33213a56b8c944d'
                changeFreq: 'weekly'
                priority: 0.5
                lastMod: '2024-09-19 12:19:00'
```

`salesChannelId` is the sales channel the URL is added to.

**Via a URL provider**: create a class extending `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider`, register it with the tag `shopware.sitemap_url_provider`, and implement:
- `getDecorated()`: throw a `DecorationPatternException` (decoration extension point, not implemented here).
- `getName()`: a technical name for the URL set.
- `getUrls(SalesChannelContext $context, int $limit, ?int $offset = null): UrlResult`: fetch entities respecting `$limit`/`$offset` (sitemap paging), build `Shopware\Core\Content\Sitemap\Struct\Url` instances (`lastMod`, `changeFreq`, `priority`, `resource`, `identifier`, `loc`), and return them wrapped in a `UrlResult`.

`changeFreq` accepts `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`; `priority` is between 0 and 1.

## Essential identifiers

- `shopware.sitemap.custom_urls`
- `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider`
- `Shopware\Core\Content\Sitemap\Struct\UrlResult`, `Shopware\Core\Content\Sitemap\Struct\Url`
- `shopware.sitemap_url_provider` (service tag)
