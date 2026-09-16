---
id: platform/dev/6.6/guides/plugins/plugins/content/seo/add-custom-seo-url.md
title: Add custom SEO URLs
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/seo/add-custom-seo-url.html
sourceHash: 84b9fbdb1df03e0d6f74eaaa1c7a5aa86f551a15
keywords: ["SeoUrlRouteInterface", "SeoUrlRouteConfig", "SeoUrlMapping", "SeoUrlUpdater", "SeoUrlPersister", "seo_url", "seo_url_template", "shopware.seo_url.route", "ImportTranslationsTrait", "static SEO URL", "dynamic SEO URL", "is_deleted", "is_canonical"]
summary: "Add static SEO URLs via plugin migrations, or dynamic SEO URLs via SeoUrlRouteInterface/SeoUrlUpdater/SeoUrlPersister."
lastBuilt: "2026-09-15"
---
## What it is

This guide explains how to define custom SEO URLs, both static (fixed URLs for a controller route) and dynamic (URLs generated/updated as custom entities or other content change), instead of relying only on Shopware's built-in product/category SEO URLs.

## When to use

Use this when a plugin exposes its own storefront routes or custom entities and needs translatable, search-friendly URLs (`seo_url` table entries) that Shopware's default SEO generation does not cover, including keeping URLs in sync as entities are written or deleted.

## Key steps / config

**Static SEO URLs** (fixed route, e.g. `/example`): add a plugin migration using `Shopware\Core\Migration\Traits\ImportTranslationsTrait` and its `importTranslation('seo_url', new Translations($deArray, $enArray), $connection)` helper. Each translation array needs keys:

```
id, sales_channel_id, foreign_key, route_name, path_info, is_canonical, is_modified, is_deleted, seo_path_info
```

**Dynamic SEO URLs for entities**: implement `Shopware\Core\Content\Seo\SeoUrlRoute\SeoUrlRouteInterface` with three methods:
- `getConfig(): SeoUrlRouteConfig` — returns the entity definition, route name, and default SEO path template.
- `prepareCriteria(Criteria $criteria): void` — narrows/extends the entities fetched for SEO URL generation.
- `getMapping(Entity $entity, ?SalesChannelEntity $salesChannel): SeoUrlMapping` — supplies the template variables.

Register the route class with the tag `shopware.seo_url.route`. On the entity's `written`/`.deleted` DAL events, call `Shopware\Core\Content\Seo\SeoUrlUpdater::update($routeName, $ids)`. Add a `seo_url_template` row (`route_name`, `entity_name`, `template`) via migration so `SeoUrlUpdater` knows the route.

**Dynamic SEO URLs for non-entity content**: use `Shopware\Core\Content\Seo\SeoUrlPersister::updateSeoUrls($context, $routeName, $foreignKeys, $urls)` to write/update rows, and call it again with an empty `$urls` array to mark entries `is_deleted`.

A context for a specific language can be built as `new Context($source, $ruleIds, $currencyId, [$languageId])` and passed to `updateSeoUrls`.

## Essential identifiers

- `Shopware\Core\Content\Seo\SeoUrlRoute\SeoUrlRouteInterface`, `SeoUrlRouteConfig`, `SeoUrlMapping`
- `Shopware\Core\Content\Seo\SeoUrlUpdater::update()`
- `Shopware\Core\Content\Seo\SeoUrlPersister::updateSeoUrls()`
- `shopware.seo_url.route` (service tag)
- `seo_url`, `seo_url_template` (tables)
- `Shopware\Core\Migration\Traits\ImportTranslationsTrait`, `Translations`

## Gotchas

A German SEO URL is only reachable if a German domain is configured for the sales channel. Deleting content does not remove the `seo_url` row — it only sets `is_deleted = 1`, so the controller must still check the content still exists. When writing dynamic entries, always pass the current `$limit`/`$offset`-aware IDs and use `getMapping` only for the entity type the route is configured for.
