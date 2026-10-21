---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/development/testing/store/seo-and-structured-data.md
relatedPages:
  - platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md
sourceHash: e055a8f771533e53d83b7d96b3a77937a0c28efc
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/seo-and-structured-data.html
title: SEO and structured data
version: "6.7"
versions:
  - "6.7"
keywords: ["seo", "structured data", "rich snippets", "schema.org", "json-ld", "sitemap.xml", "canonical", "X-Robots-Tag", "noindex", "alt text", "lighthouse", "store review"]
summary: Store review SEO rules - sitemap.xml and canonicals for extension URLs, valid schema.org snippets, X-Robots-Tag noindex on XHR routes.
lastBuilt: 2026-10-21
---
## What it is

Shopware Store requirements for how an extension affects Storefront SEO, structured data (schema.org rich snippets) and indexing, plus the validation tools reviewers expect you to run.

## When to use

When an extension adds public Storefront URLs, changes product/category/home templates, or adds XHR routes, and before Store submission.

## Key steps / config

General markup rules:

- Keep Storefront HTML structure clean and streamlined.
- Inline CSS and `!important` are not permitted where they break maintainability or override core semantics (see [Storefront, performance, and errors](platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md)).
- Public frontend URLs created by the extension must appear in `sitemap.xml` with valid canonical tags, unique meta descriptions and `title` tags (via Administration or snippets).
- All images need meaningful `alt` text (or media manager defaults); links need meaningful `title` attributes where appropriate.
- Do not use `<h1>`–`<h6>` for non-content chrome in templates served with `<meta name="robots" content="index,follow">`; use e.g. `<span class="h2">` for visual hierarchy.
- Do not break the SEO, structured data or canonical logic Shopware provides.

Rich snippets (required when the extension changes products or product pages): schema.org structured data must stay valid, existing rich snippets must not break, and new/changed content must be marked up — on product, category and home templates as relevant.

XHR and non-indexable routes: XHR requests must work without errors; set the response header `X-Robots-Tag: noindex, nofollow` on URLs that must not be indexed.

External links: use `target="_blank"` together with `rel="noopener"`.

Checks:

- Run Google Lighthouse before and after activating the extension: no new console errors, no significant SEO-category regressions when markup is touched.
- Use Schema Markup Validator and Google Rich Results Test on home, category and product detail pages. Cover available/unavailable products, no reviews, single/multiple reviews, varied ratings, out-of-stock, future release dates, and attributes (EAN, MPN, dimensions, weight). Watch for duplicate structured data.

## Essential identifiers

- `sitemap.xml` (route `frontend.sitemap.xml`)
- `X-Robots-Tag: noindex, nofollow`
- `<meta name="robots" content="index,follow">`
- `rel="noopener"`, `target="_blank"`

## Gotchas

- In 6.7 the core Storefront emits structured data as JSON-LD (`application/ld+json`) from templates under `storefront/layout/structured-data/`; an extension adding its own product markup risks the duplicate structured data the reviewers check for.

## Code check (6.7.15.1)
- confirmed `frontend.sitemap.xml` — Storefront route serving `/sitemap.xml` — vendor/shopware/storefront/Controller/SitemapController.php:33
- confirmed `layout_head_canonical` — Twig block rendering the canonical link from `page.metaInformation.canonical` — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:126
- confirmed `layout_head_meta_tags_robots` — Twig block for the robots meta tag content — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:28
- confirmed `application/ld+json` — core product structured data is JSON-LD — vendor/shopware/storefront/Resources/views/storefront/layout/structured-data/json-ld-product.html.twig:405
- confirmed `application/ld+json` — core organization structured data template — vendor/shopware/storefront/Resources/views/storefront/layout/structured-data/json-ld-organization.html.twig:24
- unverified `X-Robots-Tag` — standard HTTP header the extension sets itself; no core code emits it
