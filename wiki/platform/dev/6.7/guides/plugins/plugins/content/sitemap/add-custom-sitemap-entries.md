---
id: platform/dev/6.7/guides/plugins/plugins/content/sitemap/add-custom-sitemap-entries.md
title: Add Custom Sitemap Entries
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/sitemap/add-custom-sitemap-entries.html
sourceHash: 0e8cc6300404eeeb0c50ba5b61ef28dae088e25f
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractUrlProvider", "shopware.sitemap_url_provider", "shopware.sitemap.custom_urls", "UrlResult", "Url", "getUrls", "getSeoUrls", "DecorationPatternException", "custom sitemap url", "url provider", "sitemap paging", "changefreq"]
summary: Add sitemap URLs in Shopware 6.7 via shopware.sitemap.custom_urls config or a custom AbstractUrlProvider tagged shopware.sitemap_url_provider.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md
  - platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
  - platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md
---
## What it is

How to extend Shopware's built-in sitemap generation (products, categories, core URLs) with your own URLs: static ones through configuration, dynamic ones (custom entities, database content) through a custom URL provider.

## When to use

- Static URLs that rarely change: use `shopware.sitemap.custom_urls`.
- URLs derived from a custom entity or other DB content: implement a URL provider. The source builds on [Adding a custom SEO URL](platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md) (custom entity, technical route `frontend.example.example`, SEO URL template).

## Key steps / config

### Configuration

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

`salesChannelId` is the sales channel the URL is added to. `lastMod` is parsed with format `Y-m-d H:i:s`.

### URL provider

1. Create a class extending `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider` and implement all three abstract methods:

```php
class CustomUrlProvider extends AbstractUrlProvider
{
    public function getDecorated(): AbstractUrlProvider
    { throw new DecorationPatternException(self::class); }
    public function getName(): string { return 'custom'; }
    public function getUrls(SalesChannelContext $context, int $limit, ?int $offset = null): UrlResult
    { /* ... */ }
}
```

2. Register it in the [service container](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) with tag `shopware.sitemap_url_provider` (source passes `service('swag_example.repository')`, `service(Connection::class)`, `service('router')` as args). `getDecorated` throwing `DecorationPatternException` follows the [decoration pattern](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).
3. In `getUrls`: fetch entities with a `Criteria` using `setLimit($limit)` / `setOffset($offset)` — the sitemap is paged, never fetch everything. Return `new UrlResult([], null)` when nothing is found.
4. Look up existing SEO URLs with the inherited protected `getSeoUrls($ids, 'frontend.example.example', $context, $this->connection)`, then `FetchModeHelper::groupUnique()`.
5. Per entity create a `Shopware\Core\Content\Sitemap\Struct\Url` and call `setLastmod()` (use `updatedAt` if available), `setChangefreq()`, `setPriority()` (0–1), `setResource()` (e.g. entity class name), `setIdentifier()` (entity ID), and `setLoc()` — the SEO path (`seo_path_info`) if present, otherwise `RouterInterface::generate(..., UrlGeneratorInterface::ABSOLUTE_PATH)`.
6. Return `new Shopware\Core\Content\Sitemap\Struct\UrlResult($urls, $nextOffset)`.

## Essential identifiers

- `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider` — `getDecorated()`, `getName()`, `getUrls()`, protected `getSeoUrls()`
- `Shopware\Core\Content\Sitemap\Struct\Url`, `Shopware\Core\Content\Sitemap\Struct\UrlResult`
- `shopware.sitemap_url_provider` (service tag)
- `shopware.sitemap.custom_urls` — keys `url`, `salesChannelId`, `changeFreq`, `priority`, `lastMod`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`

## Gotchas

- Always honour `$limit`/`$offset` in `getUrls`.
- Change frequency values per source: `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`. In config, `changeFreq` is an enum without `never` — only `Url::setChangefreq()` in code accepts any string.
- Core's config-based provider does not apply the configured `priority`; such entries keep the `Url` default `0.5`.
- A config entry whose `salesChannelId` is null is included for every sales channel.
- Subclasses of `AbstractUrlProvider` are autoconfigured with the tag, so the explicit tag is redundant with autoconfigure enabled.

## Code check (6.7.15.1)
- confirmed `AbstractUrlProvider::getDecorated()` — abstract, required — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:19
- confirmed `AbstractUrlProvider::getUrls()` — abstract, signature `(SalesChannelContext, int $limit, ?int $offset = null): UrlResult` — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:23
- confirmed `AbstractUrlProvider::getSeoUrls()` — protected helper — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:30
- confirmed `shopware.sitemap_url_provider` — also autoconfigured for AbstractUrlProvider — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:163
- confirmed `custom_urls` — config node with url/lastMod/changeFreq/priority/salesChannelId — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:300
- corrected `changeFreq` — docs: `never` allowed; config enum stops at `yearly` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:305
- corrected `priority` — docs: applied per custom URL; config accepts it but CustomUrlProvider never sets it — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:315
- confirmed `lastMod` — parsed as `Y-m-d H:i:s` — vendor/shopware/core/Content/Sitemap/ConfigHandler/File.php:51
- confirmed `Url::$priority` — default 0.5 — vendor/shopware/core/Content/Sitemap/Struct/Url.php:29
- confirmed `UrlResult` — struct holding urls and nextOffset — vendor/shopware/core/Content/Sitemap/Struct/UrlResult.php:9
