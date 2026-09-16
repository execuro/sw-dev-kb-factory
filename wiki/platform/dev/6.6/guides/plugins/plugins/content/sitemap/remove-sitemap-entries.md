---
id: platform/dev/6.6/guides/plugins/plugins/content/sitemap/remove-sitemap-entries.md
title: Remove sitemap entries
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/sitemap/remove-sitemap-entries.html
sourceHash: 4b19b405be9019d89813720a1ff49214276c4620
keywords: ["shopware.sitemap.excluded_urls", "sitemap exclusion", "remove sitemap entry", "salesChannelId", "resource", "identifier", "ProductEntity", "sitemap configuration"]
summary: "Exclude a specific entity's URL from the sitemap via shopware.sitemap.excluded_urls configuration."
lastBuilt: "2026-09-15"
---
## What it is

This short guide covers removing a specific URL from the sitemap using the configuration setting `shopware.sitemap.excluded_urls`.

## When to use

Use this when a single entity's URL (e.g. one product) needs to be excluded from the sitemap for a given sales channel, without writing custom code.

## Key steps / config

```yaml
shopware:
    sitemap:
        excluded_urls:
            -   salesChannelId: '98432def39fc4624b33213a56b8c944d'
                resource: 'Shopware\Core\Content\Product\ProductEntity'
                identifier: 'd20e4d60e35e4afdb795c767eee08fec'
```

- `salesChannelId`: the sales channel to exclude the URL from.
- `resource`: the full class name of the entity to exclude, e.g. `Shopware\Core\Content\Product\ProductEntity`.
- `identifier`: the ID of the specific entity whose URL should be excluded.

## Essential identifiers

- `shopware.sitemap.excluded_urls`
