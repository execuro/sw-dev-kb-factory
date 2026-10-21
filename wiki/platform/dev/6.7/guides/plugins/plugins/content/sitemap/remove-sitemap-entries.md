---
id: platform/dev/6.7/guides/plugins/plugins/content/sitemap/remove-sitemap-entries.md
title: Remove Sitemap Entries
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/sitemap/remove-sitemap-entries.html
sourceHash: 6d5a06a5d6708f1bb100918da20ee30c4503355a
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware.sitemap.excluded_urls", "excluded_urls", "salesChannelId", "resource", "identifier", "Shopware\\Core\\Content\\Product\\ProductEntity", "ProductUrlProvider", "exclude sitemap url", "remove sitemap entry", "hide product from sitemap", "sitemap config"]
summary: Exclude specific URLs from the Shopware 6.7 sitemap with the shopware.sitemap.excluded_urls config (salesChannelId, resource, identifier).
lastBuilt: 2026-10-21
---
## What it is

How to exclude specific records from the generated sitemap using the `shopware.sitemap.excluded_urls` configuration key.

## When to use

You want individual products (or other entities emitted by a sitemap URL provider) to stop appearing in a sales channel's sitemap, without writing a plugin decorator.

## Key steps / config

```yaml
shopware:
    sitemap:
        excluded_urls:
            -   salesChannelId: '98432def39fc4624b33213a56b8c944d'
                resource: 'Shopware\Core\Content\Product\ProductEntity'
                identifier: 'd20e4d60e35e4afdb795c767eee08fec'
```

- `salesChannelId` — ID of the sales channel to exclude the URL from.
- `resource` — fully qualified class name used by the sitemap URL provider, e.g. `Shopware\Core\Content\Product\ProductEntity`.
- `identifier` — entity ID of the record to exclude.

To find matching values, inspect the provider that generates the entries for your entity type.

## Essential identifiers

- `shopware.sitemap.excluded_urls` with keys `salesChannelId`, `resource`, `identifier`
- `Shopware\Core\Content\Product\ProductEntity` (product resource)

## Gotchas

- In the installed code only the product, category and landing page providers read this list; each matches `resource` exactly against its own entity class (`ProductEntity`, `CategoryEntity`, `LandingPageEntity`).
- `salesChannelId` is compared strictly in the product provider, so an entry without it excludes nothing there.

## Code check (6.7.15.1)
- confirmed `excluded_urls` — config node with resource/identifier/salesChannelId — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:320
- confirmed `ProductUrlProvider` — filters by `ProductEntity::class` resource — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:26
- confirmed `salesChannelId` — strict match in product provider — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:191
- confirmed `identifier` — collected as excluded product IDs — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:194
- confirmed `CategoryEntity` — category provider honours exclusions — vendor/shopware/core/Content/Sitemap/Provider/CategoryUrlProvider.php:185
- confirmed `LandingPageEntity` — landing page provider honours exclusions — vendor/shopware/core/Content/Sitemap/Provider/LandingPageUrlProvider.php:156
