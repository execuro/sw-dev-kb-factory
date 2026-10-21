---
id: platform/dev/6.7/guides/plugins/plugins/content/sitemap/modify-sitemap-entries.md
title: Modifying Sitemap Entries
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/sitemap/modify-sitemap-entries.html
sourceHash: 7d6783e10f6b55605f5add17f08088fe82360f07
codeCheckedAgainst: "6.7.15.1"
keywords: ["SitemapQueryEvent", "ProductUrlProvider", "AbstractUrlProvider", "QUERY_EVENT_NAME", "sitemap.query.product", "UrlResult", "getSeoUrls", "shopware.sitemap.excluded_urls", "core.sitemap.excludeLinkedProducts", "decorate url provider", "filter sitemap products", "sitemap priority changefreq"]
summary: Change existing Shopware 6.7 sitemap entries by decorating a URL provider (e.g. ProductUrlProvider) or altering its query via SitemapQueryEvent.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md
---
## What it is

How a plugin changes already existing sitemap URLs (e.g. product URLs) instead of adding new ones. Two approaches: decorate a URL provider and adjust its `UrlResult`, or modify the provider's DB query through `SitemapQueryEvent` (recommended when filtering by entity data).

## When to use

- Adjust `priority`, `changefreq`, `lastmod`, or drop entries by identifier: decorate the provider.
- Filter entities before URLs are generated, add SQL `JOIN`s for entity-based conditions, stay update-compatible: use `SitemapQueryEvent`.
- Prerequisite knowledge: [service decoration](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md) and the URL provider system.

## Key steps / config

### Decorate a URL provider

Decorate e.g. `Shopware\Core\Content\Sitemap\Provider\ProductUrlProvider`; the decorator must implement all three abstract members:

```php
class DecoratedProductUrlProvider extends AbstractUrlProvider
{
    public function __construct(private readonly AbstractUrlProvider $inner) {}
    public function getDecorated(): AbstractUrlProvider { return $this->inner; }
    public function getName(): string { return $this->inner->getName(); }
    public function getUrls(SalesChannelContext $context, int $limit, ?int $offset = null): UrlResult
    { /* filter/adjust $this->inner->getUrls(...)->getUrls(), then */
      /* return new UrlResult($urls, $urlResult->getNextOffset()); */ }
}
```

Register with `->decorate(ProductUrlProvider::class)` and `->args([service('.inner')])`. Inside the loop use `$url->getIdentifier()` to skip entries and `setPriority()` / `setChangefreq()` to adjust them. Keep `getNextOffset()` from the inner result so paging continues.

### Modify the query via `SitemapQueryEvent`

Core providers dispatch `Shopware\Core\Content\Sitemap\Event\SitemapQueryEvent` before executing their query. Subscribe (tag `kernel.event_subscriber`), check the name, then alter the DBAL `QueryBuilder` in the public `$query` property:

```php
public static function getSubscribedEvents(): array
{ return [SitemapQueryEvent::class => 'onProductSitemapQuery']; }

public function onProductSitemapQuery(SitemapQueryEvent $event): void
{
    if ($event->getName() !== ProductUrlProvider::QUERY_EVENT_NAME) { return; }
    $event->query->andWhere('`product`.product_number NOT LIKE :blockedProductNumberPrefix');
    $event->query->setParameter('blockedProductNumberPrefix', 'TEST-%');
}
```

For products the event name is `sitemap.query.product`.

## Essential identifiers

- `Shopware\Core\Content\Sitemap\Provider\ProductUrlProvider`, `ProductUrlProvider::QUERY_EVENT_NAME`
- `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider`
- `Shopware\Core\Content\Sitemap\Event\SitemapQueryEvent` — `getName()`, `$query`
- `Shopware\Core\Content\Sitemap\Struct\UrlResult`, `Shopware\Core\Content\Sitemap\Struct\Url`
- `shopware.sitemap.excluded_urls`, `core.sitemap.excludeLinkedProducts`

## Gotchas

- Decorating only gives you `Url` structs; filtering by entity fields (name, manufacturer, custom fields) is usually too late there — use the event.
- `getSeoUrls` is a protected method on `AbstractUrlProvider`. Overriding it in a decorator that forwards `getUrls()` to the inner service has no effect. Changing SEO URL lookup requires implementing the provider logic in your own service (less update-compatible).
- Simpler needs may be covered by config: remove entries via `shopware.sitemap.excluded_urls` (see the "Remove Sitemap Entries" guide); linked-only product visibility via `core.sitemap.excludeLinkedProducts`.

## Code check (6.7.15.1)
- confirmed `AbstractUrlProvider::getDecorated()` — abstract, decorator must declare — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:19
- confirmed `AbstractUrlProvider::getName()` — abstract — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:21
- confirmed `AbstractUrlProvider::getSeoUrls()` — protected — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:30
- confirmed `ProductUrlProvider::QUERY_EVENT_NAME` — value `sitemap.query.product` — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:30
- confirmed `SitemapQueryEvent` — dispatched before query execution — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:165
- confirmed `SitemapQueryEvent::$query` — public readonly QueryBuilder — vendor/shopware/core/Content/Sitemap/Event/SitemapQueryEvent.php:20
- confirmed `SitemapQueryEvent::getName()` — returns provider query name — vendor/shopware/core/Content/Sitemap/Event/SitemapQueryEvent.php:28
- confirmed `UrlResult::getNextOffset()` — paging offset — vendor/shopware/core/Content/Sitemap/Struct/UrlResult.php:28
- confirmed `core.sitemap.excludeLinkedProducts` — read by ProductUrlProvider — vendor/shopware/core/Content/Sitemap/Provider/ProductUrlProvider.php:32
- confirmed `excluded_urls` — sitemap config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:320
