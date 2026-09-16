---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/development/testing/store/seo-and-structured-data.md
sourceHash: e055a8f771533e53d83b7d96b3a77937a0c28efc
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/seo-and-structured-data.html
title: SEO and structured data
version: "6.7"
versions:
  - "6.7"
keywords: ["seo", "structured data", "rich snippets", "schema.org", "X-Robots-Tag", "sitemap.xml", "canonical", "meta robots", "noopener", "lighthouse", "store review", "json-ld"]
summary: "Store review SEO rules: sitemap, canonical and meta tags, alt/title attributes, valid schema.org rich snippets, X-Robots-Tag, Lighthouse checks."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md"]
---
## What it is

The Shopware Store review checklist for SEO and structured data: what an extension that touches Storefront markup, products, or public URLs must keep intact to pass review.

## When to use

Before submitting a plugin or app to the Shopware Store when it adds public frontend URLs, changes product/category/home templates, adds XHR routes, or otherwise alters Storefront HTML.

## Key steps / config

General markup rules:

- Keep Storefront HTML clean; no inline CSS or `!important` that breaks maintainability or overrides core semantics (see [Storefront, performance, and errors](platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md)).
- Public frontend URLs created by the extension must appear in `sitemap.xml` (core route `frontend.sitemap.xml`) with valid canonical tags, unique meta descriptions and `title` tags (via Administration or snippets).
- All images need meaningful `alt` text (or media manager defaults); links need meaningful `title` attributes where appropriate.
- Do not use `<h1>`–`<h6>` for non-content chrome in templates served with `<meta name="robots" content="index,follow">`; use e.g. `<span class="h2">` for visual hierarchy.
- Do not break the SEO, structured data, or canonical logic Shopware provides. In core, the canonical link is rendered in the `layout_head_canonical` block and the robots meta in `layout_head_meta_tags_robots` (both in `@Storefront/storefront/layout/meta.html.twig`); override blocks rather than replacing them.

Rich snippets (home, listing, product) — required when the extension changes products or product pages:

- schema.org structured data must stay valid; existing rich snippets must not break; new or changed content must be marked up correctly.

XHR and non-indexable routes:

- XHR and similar requests must work without errors.
- Set response header `X-Robots-Tag: noindex, nofollow` on URLs that must not be indexed. Core controllers do this with `$response->headers->set('x-robots-tag', 'noindex')`; page loaders can set the meta tag via `MetaInformation::setRobots('noindex,follow')`.

External links: use `target="_blank"` together with `rel="noopener"`.

Checks to run:

- Google Lighthouse before and after activating the extension: no new console errors, no significant regressions in the SEO category.
- Schema Markup Validator and Google Rich Results Test on home, category and product detail pages. Cover available/unavailable products, products without reviews, single and multiple reviews, varied ratings, out-of-stock, future release dates, and product attributes (EAN, MPN, dimensions, weight). Watch for duplicate structured data.

## Essential identifiers

- `sitemap.xml` / `frontend.sitemap.xml`
- `X-Robots-Tag: noindex, nofollow`
- `<meta name="robots" content="index,follow">`
- `layout_head_canonical`, `layout_head_meta_tags_robots`, `layout_head_json_ld`
- `MetaInformation::setRobots()`
- `rel="noopener"`, `target="_blank"`

## Gotchas

- Duplicate structured data is a common failure: in 6.7 the Storefront emits either legacy microdata or JSON-LD depending on the `JSON_LD_DATA` feature flag (default off). An extension adding its own markup must not duplicate whichever variant is active.

## Code check (6.7.13.0)
- confirmed `frontend.sitemap.xml` — core route for `/sitemap.xml` — vendor/shopware/storefront/Controller/SitemapController.php:33
- confirmed `layout_head_canonical` — renders `<link rel="canonical">` from `page.metaInformation.canonical` — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:126
- confirmed `layout_head_meta_tags_robots` — robots meta content from `metaInformation.robots` — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:28
- confirmed `x-robots-tag` — core controllers set it on non-indexable responses — vendor/shopware/storefront/Controller/CmsController.php:75
- confirmed `setRobots` — `MetaInformation::setRobots(string $robots)` — vendor/shopware/storefront/Page/MetaInformation.php:104
- confirmed `layout_head_json_ld` — JSON-LD blocks included only when `JSON_LD_DATA` is active — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:100
- confirmed `JSON_LD_DATA` — feature flag, default false, replaces microdata with JSON-LD — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:94
- unverified `Rich Results Test` — external Google tool, not in vendor code
