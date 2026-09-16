---
id: platform/dev/6.6/guides/plugins/plugins/content/sitemap/modify-sitemap-entries.md
title: Modifying sitemap entries
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/sitemap/modify-sitemap-entries.html
sourceHash: 9c2e09dcdaa12451e144ec7552108e935978c698
keywords: ["ProductUrlProvider", "AbstractUrlProvider", "getSeoUrls", "getUrls", "decorates", "UrlResult", "sitemap decoration", "modify sitemap", "getIdentifier", "sitemap SQL override"]
summary: "Modify existing sitemap entries by decorating a UrlProvider, either adjusting getUrls() or overriding protected getSeoUrls()."
lastBuilt: "2026-09-15"
---
## What it is

This guide covers modifying existing sitemap entries (e.g. product URLs) rather than adding new ones, by decorating the relevant `UrlProvider` such as `Shopware\Core\Content\Sitemap\Provider\ProductUrlProvider`.

## When to use

Use this when the default sitemap entries for an entity (e.g. products) need to be filtered, altered, or removed — for example excluding certain products, or changing how SEO URLs are looked up.

## Key steps / config

1. Decorate the target provider (extends `AbstractUrlProvider`), forwarding `decorates="Shopware\Core\Content\Sitemap\Provider\ProductUrlProvider"` in `services.xml` with the `.inner` argument pattern.
2. **Option A — adjust `getUrls()`**: call the decorated `getUrls($context, $limit, $offset)`, then iterate `$urlResult->getUrls()` to modify or remove `Url` entries (only `getIdentifier()` is reliably available on each `Url`), and return a new `UrlResult($urls, $urlResult->getNextOffset())`.
3. **Option B — override the protected `getSeoUrls(array $ids, string $routeName, SalesChannelContext $context, Connection $connection): array`** method of `AbstractUrlProvider`: copy the original SQL against the `seo_url` table and add custom filtering/joins.

## Essential identifiers

- `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider`
- `Shopware\Core\Content\Sitemap\Provider\ProductUrlProvider`
- `getUrls(SalesChannelContext $context, int $limit, ?int $offset = null): UrlResult`
- `getSeoUrls(array $ids, string $routeName, SalesChannelContext $context, Connection $connection): array`

## Gotchas

Filtering in `getUrls()` gives access to little entity information beyond `getIdentifier()`, and reads all SEO URLs from the database before filtering, which is not ideal for performance. Overriding `getSeoUrls()` is not update-compatible: future core changes/bugfixes to the original method will not apply to the overridden copy.
