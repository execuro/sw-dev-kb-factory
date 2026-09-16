---
id: platform/dev/6.7/guides/plugins/plugins/content/sitemap/add-custom-sitemap-entries.md
title: Add Custom Sitemap Entries
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/sitemap/add-custom-sitemap-entries.html
sourceHash: 0e8cc6300404eeeb0c50ba5b61ef28dae088e25f
codeCheckedAgainst: "6.7.13.0"
keywords: ["sitemap", "custom sitemap url", "shopware.sitemap.custom_urls", "AbstractUrlProvider", "shopware.sitemap_url_provider", "UrlResult", "Url", "getUrls", "getDecorated", "DecorationPatternException", "getSeoUrls", "url provider", "custom entity seo url"]
summary: Add sitemap URLs via shopware.sitemap.custom_urls config or a custom AbstractUrlProvider tagged shopware.sitemap_url_provider returning a UrlResult.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md"]
---
## What it is

Two ways to add your own URLs to Shopware's generated sitemap (which already covers products, categories and other core URLs): static entries via configuration, or a custom URL provider class for dynamic URLs such as custom entity SEO URLs.

## When to use

- Config: static URLs that rarely change.
- URL provider: dynamic URLs based on custom entities or database content. The provider example builds on [Adding a custom SEO URL](platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md) (custom entity, technical route, SEO URL).

## Key steps / config

**Configuration** — `shopware.sitemap.custom_urls`:

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

**URL provider**

1. Extend `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider` and implement all three abstract methods:
   ```php
   class CustomUrlProvider extends AbstractUrlProvider
   {
       public function getDecorated(): AbstractUrlProvider { throw new DecorationPatternException(self::class); }
       public function getName(): string { return 'custom'; }
       public function getUrls(SalesChannelContext $context, int $limit, ?int $offset = null): UrlResult { /* ... */ }
   }
   ```
   `getDecorated` throws `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException` (see [adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)); `getName` is a technical name.
2. In `getUrls`, fetch entities with `Criteria::setLimit($limit)` / `setOffset($offset)` — always honour paging. Return `new UrlResult([], null)` when nothing is found.
3. Look up existing SEO URLs with the inherited protected `getSeoUrls($ids, 'frontend.example.example', $context, $connection)` and `FetchModeHelper::groupUnique()`; fall back to `RouterInterface::generate()` with `UrlGeneratorInterface::ABSOLUTE_PATH` when none exists.
4. Per entity create `Shopware\Core\Content\Sitemap\Struct\Url` and call `setLastmod()` (use `updatedAt`), `setChangefreq()` (`always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`), `setPriority()` (0–1), `setResource()` (e.g. entity class), `setIdentifier()` (ID), `setLoc()` (the SEO URL).
5. Return `new Shopware\Core\Content\Sitemap\Struct\UrlResult($urls, $nextOffset)`.
6. Register in `services.php` (see [dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)) with args repository, `Connection::class`, `router`, and `->tag('shopware.sitemap_url_provider')` — autoconfiguration also adds this tag to `AbstractUrlProvider` subclasses.

## Essential identifiers

- `shopware.sitemap.custom_urls`
- `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider`
- `shopware.sitemap_url_provider`
- `Shopware\Core\Content\Sitemap\Struct\Url`, `Shopware\Core\Content\Sitemap\Struct\UrlResult`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`

## Gotchas

- The exporter keeps calling `getUrls` only while `UrlResult::getNextOffset()` is not `null`. The docs example always passes `null`, so only the first `$limit` entities end up in the sitemap; return the next offset when more entities remain.
- In `custom_urls`, `changeFreq` is an enum node accepting `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly` — `never` is rejected there (it is only a free string on the `Url` struct).
- `Url` priority defaults to `0.5` if `setPriority()` is not called.

## Code check (6.7.13.0)
- confirmed `AbstractUrlProvider::getDecorated()` — abstract, must be implemented — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:19
- confirmed `AbstractUrlProvider::getName()` — abstract — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:21
- confirmed `AbstractUrlProvider::getUrls()` — abstract, signature `(SalesChannelContext, int $limit, ?int $offset = null): UrlResult` — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:23
- confirmed `AbstractUrlProvider::getSeoUrls()` — protected helper — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:30
- confirmed `shopware.sitemap_url_provider` — autoconfigured for subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:162
- confirmed `custom_urls` — config node with url/lastMod/changeFreq/priority/salesChannelId — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:279
- corrected `changeFreq` — docs: `never` is a possible value; config enum omits it — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:284
- confirmed `UrlResult::getNextOffset()` — null ends paging — vendor/shopware/core/Content/Sitemap/Service/SitemapExporter.php:65
- confirmed `Url::setLoc()` — setters for loc/lastmod/changefreq/priority/resource/identifier — vendor/shopware/core/Content/Sitemap/Struct/Url.php:51
- confirmed `DecorationPatternException` — exception class — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:13
