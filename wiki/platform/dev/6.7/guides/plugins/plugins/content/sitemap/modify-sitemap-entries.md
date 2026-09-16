---
id: platform/dev/6.7/guides/plugins/plugins/content/sitemap/modify-sitemap-entries.md
title: Modifying Sitemap Entries
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/sitemap/modify-sitemap-entries.html
sourceHash: 7d6783e10f6b55605f5add17f08088fe82360f07
codeCheckedAgainst: "6.7.13.0"
keywords: ["sitemap", "modify sitemap entries", "ProductUrlProvider", "AbstractUrlProvider", "UrlResult", "SitemapQueryEvent", "sitemap.query.product", "QUERY_EVENT_NAME", "getSeoUrls", "service decoration", "core.sitemap.excludeLinkedProducts", "shopware.sitemap.excluded_urls", "filter sitemap products"]
summary: Modify existing sitemap URLs by decorating a URL provider such as ProductUrlProvider or by altering the provider query through SitemapQueryEvent.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

How a plugin changes sitemap URLs Shopware already generates (e.g. product URLs) instead of adding new ones: decorate a URL provider and rewrite its `UrlResult`, or modify the provider's database query via `SitemapQueryEvent`.

## When to use

- Decoration: adjust metadata (`priority`, `changefreq`, `lastmod`) or drop entries by identifier.
- `SitemapQueryEvent` (recommended): filter by entity data before URLs are generated, add SQL `JOIN`s, stay more update-compatible than copying provider internals.

## Key steps / config

**Decorate a provider** (see [service decoration](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)):

```php
class DecoratedProductUrlProvider extends AbstractUrlProvider
{
    public function __construct(private readonly AbstractUrlProvider $inner) {}
    public function getDecorated(): AbstractUrlProvider { return $this->inner; }
    public function getName(): string { return $this->inner->getName(); }
    public function getUrls(SalesChannelContext $context, int $limit, ?int $offset = null): UrlResult
    {
        $result = $this->inner->getUrls($context, $limit, $offset);
        /* filter/adjust $result->getUrls(): getIdentifier(), setPriority(0.7), setChangefreq('daily') */
        return new UrlResult($urls, $result->getNextOffset());
    }
}
```

Register with `->decorate(ProductUrlProvider::class)` and `->args([service('.inner')])`. Keep `$result->getNextOffset()` so paging continues. Downside: only `Url` structs are available — too late to filter by entity fields (name, manufacturer, custom fields).

**Modify the query** — core providers dispatch `Shopware\Core\Content\Sitemap\Event\SitemapQueryEvent` before executing their query; for products `getName()` equals `ProductUrlProvider::QUERY_EVENT_NAME` (`sitemap.query.product`):

```php
public function onProductSitemapQuery(SitemapQueryEvent $event): void
{
    if ($event->getName() !== ProductUrlProvider::QUERY_EVENT_NAME) { return; }
    $event->query->andWhere('`product`.product_number NOT LIKE :blockedProductNumberPrefix');
    $event->query->setParameter('blockedProductNumberPrefix', 'TEST-%');
}
```

Subscribe via `getSubscribedEvents()` returning `SitemapQueryEvent::class => 'onProductSitemapQuery'`, service tagged `kernel.event_subscriber`. The event also exposes public `limit`, `offset` and `getSalesChannelContext()`.

## Essential identifiers

- `Shopware\Core\Content\Sitemap\Provider\ProductUrlProvider`
- `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider`
- `Shopware\Core\Content\Sitemap\Struct\UrlResult`, `Shopware\Core\Content\Sitemap\Struct\Url`
- `Shopware\Core\Content\Sitemap\Event\SitemapQueryEvent`, `sitemap.query.product`
- `shopware.sitemap.excluded_urls`, `core.sitemap.excludeLinkedProducts`

## Gotchas

- `getSeoUrls` is a protected method on `AbstractUrlProvider`. A decorator that forwards `getUrls()` to the inner service gains nothing by overriding it; changing SEO URL lookup requires implementing the provider logic yourself (less update-compatible).
- `SitemapQueryEvent` is a single event class for all core providers — always check `getName()`.
- `ProductUrlProvider::getDecorated()` throws `DecorationPatternException`; decorators must return their inner service instead.
- Configuration may already suffice: `shopware.sitemap.excluded_urls` (only evaluated by the core product, category and landing page providers) and system config `core.sitemap.excludeLinkedProducts`.

## Code check (6.7.13.0)
- confirmed `ProductUrlProvider::QUERY_EVENT_NAME` — value `sitemap.query.product` — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:30
- confirmed `SitemapQueryEvent` — dispatched by ProductUrlProvider before query — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:165
- confirmed `SitemapQueryEvent::$query` — public readonly QueryBuilder — vendor/shopware/core/Content/Sitemap/Event/SitemapQueryEvent.php:17
- confirmed `SitemapQueryEvent::getName()` — returns technical name — vendor/shopware/core/Content/Sitemap/Event/SitemapQueryEvent.php:25
- confirmed `AbstractUrlProvider::getSeoUrls()` — protected — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:30
- confirmed `AbstractUrlProvider::getDecorated()` — abstract; getName/getUrls abstract at lines 21/23 — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:19
- confirmed `UrlResult::getNextOffset()` — used to continue paging — vendor/shopware/core/Content/Sitemap/Struct/UrlResult.php:28
- confirmed `ProductUrlProvider::getDecorated()` — throws DecorationPatternException — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:50
- confirmed `core.sitemap.excludeLinkedProducts` — read by ProductUrlProvider — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:32
- confirmed `excluded_urls` — sitemap config key constant — vendor/shopware/core/Content/Sitemap/Service/ConfigHandler.php:15
