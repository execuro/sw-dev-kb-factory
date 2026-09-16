---
id: platform/dev/6.7/guides/plugins/plugins/content/sitemap/_index.md
title: Sitemap
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/sitemap/
sourceHash: ea2b45e0731146317cf9b5e617d35d6d0a5125af
codeCheckedAgainst: "6.7.13.0"
keywords: ["sitemap", "sitemap.xml", "AbstractUrlProvider", "shopware.sitemap_url_provider", "SitemapQueryEvent", "shopware.sitemap.custom_urls", "shopware.sitemap.excluded_urls", "sitemap:generate", "shopware.sitemap_generate", "seo", "search engine indexing", "sitemap entries"]
summary: Overview of plugin sitemap extension in Shopware 6.7 - add custom sitemap URLs, modify or exclude existing entries for search engine crawling.
lastBuilt: 2026-09-15
---
## What it is

Landing page for the plugin guides on Shopware's sitemap system. Plugins can extend sitemap generation with custom URLs (pages, categories, products or other content types) and adjust existing entries — change metadata, exclude specific URLs, or override SEO URL behaviour — so the sitemap gives search engines a structured overview of storefront content and keeps it aligned with the project's SEO strategy.

## When to use

When the generated sitemap must contain additional URLs (e.g. for custom entities) or must omit or alter URLs Shopware generates by default. The sub-guides cover adding custom entries, modifying entries, and removing entries.

## Essential identifiers

Extension points present in the installed code (this overview page itself names none):

- `Shopware\Core\Content\Sitemap\Provider\AbstractUrlProvider` — base class for URL providers; subclasses are autoconfigured with tag `shopware.sitemap_url_provider`.
- `Shopware\Core\Content\Sitemap\Event\SitemapQueryEvent` — dispatched by core providers (e.g. products) before their database query, for filtering.
- `shopware.sitemap.custom_urls` / `shopware.sitemap.excluded_urls` — static configuration for adding and excluding URLs.
- `shopware.sitemap.batchsize` (default `100`) and `shopware.sitemap.scheduled_task.enabled` (default `true`).
- `sitemap:generate` — console command; scheduled task name `shopware.sitemap_generate`.

## Code check (6.7.13.0)
- confirmed `AbstractUrlProvider` — abstract provider base class — vendor/shopware/core/Content/Sitemap/Provider/AbstractUrlProvider.php:13
- confirmed `shopware.sitemap_url_provider` — autoconfigured tag for AbstractUrlProvider subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:162
- confirmed `SitemapQueryEvent` — query event class — vendor/shopware/core/Content/Sitemap/Event/SitemapQueryEvent.php:14
- confirmed `custom_urls` — sitemap config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:279
- confirmed `excluded_urls` — sitemap config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:299
- confirmed `batchsize` — default 100 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:310
- confirmed `sitemap:generate` — console command name — vendor/shopware/core/Content/Sitemap/Commands/SitemapGenerateCommand.php:28
- confirmed `shopware.sitemap_generate` — scheduled task name — vendor/shopware/core/Content/Sitemap/ScheduledTask/SitemapGenerateTask.php:14
