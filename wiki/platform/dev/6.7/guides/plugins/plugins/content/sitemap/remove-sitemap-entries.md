---
id: platform/dev/6.7/guides/plugins/plugins/content/sitemap/remove-sitemap-entries.md
title: Remove Sitemap Entries
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/sitemap/remove-sitemap-entries.html
sourceHash: 6d5a06a5d6708f1bb100918da20ee30c4503355a
codeCheckedAgainst: "6.7.13.0"
keywords: ["sitemap", "remove sitemap entries", "exclude url from sitemap", "shopware.sitemap.excluded_urls", "excluded_urls", "salesChannelId", "resource", "identifier", "Shopware\\Core\\Content\\Product\\ProductEntity", "ProductUrlProvider", "CategoryUrlProvider", "LandingPageUrlProvider"]
summary: Exclude URLs from the Shopware sitemap with shopware.sitemap.excluded_urls entries of salesChannelId, resource entity class and identifier.
lastBuilt: 2026-09-15
---
## What it is

Configuration-based removal of specific URLs from the generated sitemap using the `shopware.sitemap.excluded_urls` key.

## When to use

When individual products (or other entities) must not appear in a sales channel's sitemap and no code is wanted.

## Key steps / config

Add entries under `shopware.sitemap.excluded_urls`:

```yaml
shopware:
    sitemap:
        excluded_urls:
            -   salesChannelId: '98432def39fc4624b33213a56b8c944d'
                resource: 'Shopware\Core\Content\Product\ProductEntity'
                identifier: 'd20e4d60e35e4afdb795c767eee08fec'
```

- `salesChannelId` — ID of the sales channel the URL is excluded from.
- `resource` — fully qualified class name used by the sitemap URL provider, e.g. `Shopware\Core\Content\Product\ProductEntity`.
- `identifier` — entity ID of the record to exclude.

To find matching values, inspect the provider that generates the sitemap entries for the entity type.

## Essential identifiers

- `shopware.sitemap.excluded_urls` (child keys `salesChannelId`, `resource`, `identifier`)
- `Shopware\Core\Content\Product\ProductEntity`
- Providers that honour the list: `Shopware\Core\Content\Sitemap\Provider\ProductUrlProvider`, `Shopware\Core\Content\Sitemap\Provider\CategoryUrlProvider`, `Shopware\Core\Content\Sitemap\Provider\LandingPageUrlProvider`

## Gotchas

- Only the core product, category and landing page providers read `excluded_urls`; each keeps entries whose `resource` equals its own entity class (`ProductEntity`, `CategoryEntity`, `LandingPageEntity`). Custom URL providers and `custom_urls` entries are not filtered by it.
- Matching is strict string comparison: `resource` must be the exact class name and `salesChannelId` must equal the sales channel ID; an entry without a matching `salesChannelId` has no effect.

## Code check (6.7.13.0)
- confirmed `excluded_urls` — config node with resource/identifier/salesChannelId — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:299
- confirmed `ConfigHandler::EXCLUDED_URLS_KEY` — key constant `excluded_urls` — vendor/shopware/core/Content/Sitemap/Service/ConfigHandler.php:15
- confirmed `ProductUrlProvider::getExcludedProductIds()` — filters by `ProductEntity::class` and salesChannelId, returns identifiers — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:177
- confirmed `ProductEntity` — resource comparison in product provider — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:187
- confirmed `CategoryEntity` — resource comparison in category provider — vendor/shopware/core/Content/Sitemap/Provider/CategoryUrlProvider.php:185
- confirmed `LandingPageEntity` — resource comparison in landing page provider — vendor/shopware/core/Content/Sitemap/Provider/LandingPageUrlProvider.php:156
