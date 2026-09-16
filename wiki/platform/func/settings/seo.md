---
id: platform/func/settings/seo.md
title: Seo
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/seo
sourceHash: 742b15271acb587cab38bd0a86c65ea168b60a1489eee35e5800c7c693d9dede
revision:
  current: true
  range: "6.4.0.0 - 6.4.20.2"
  swMin: "6.4.0.0"
  swMax: "6.4.20.2"
keywords: ["SEO URL templates", "settings SEO", "canonical URL", "seo template variables", "product.translated.name", "category.seoBreadcrumb", "landingPage variables", "dal:refresh:index", "twig filters", "301 redirect", "rebuild seo index"]
summary: How to build Twig-based SEO URL templates per sales channel for products, categories, and landing pages, and rebuild the SEO index.
lastBuilt: 2026-09-15
---
## What it is

The SEO settings define the URL structure (Twig templates) for product detail pages, category pages, and landing pages, using a set of Twig variables and filters, either globally or per sales channel. A canonical URL — the search engine's chosen representative among duplicate/near-duplicate pages, which can live on a different domain — is also explained here.

## When to use

Use this to change how SEO-friendly URLs are built, to shorten or lower-case URL segments, or to rebuild the SEO index after changing a template.

## Key steps / config

- Choose **Sales channel** scope first (a specific channel, or leave empty for "All sales channels").
- Product detail page template uses Twig, e.g.:

```
{{ product.name }}
```

- Multi-level variables (e.g. `{{ product.translated }}`) must be completed manually (e.g. append `.name`); a green check/red X next to the field shows whether the template's variables resolve.
- Truncate a value with slice syntax, e.g. `{{ product.translated.name[:50] }}`.
- Guard optional data with an `if`, e.g.: `{{ product.translated.name }}/{{ product.productNumber }}{% if product.canonicalProductId is not null %}/{{ product.canonicalProductId }}{% endif %}`.
- Landing page and category page templates use the equivalent variable sets, e.g. `{{landingPage.name}}`, `{{ category.translated.name }}`, and category breadcrumbs via a `for` loop: `{% for part in category.seoBreadcrumb %}{{ part }}/{% endfor %}`.
- Twig filters can be piped in, e.g. `{{ product.translated.name|lower }}/{{ product.productNumber }}` or `{% for part in category.seoBreadcrumb %}{{ part|lower }}/{% endfor %}`.
- **Forwarding behavior**: toggles whether canonical URL changes issue an HTTP 301 redirect.
- **Rebuild SEO index** after template changes, via the console command:

```
php bin/console dal:refresh:index
```

## Essential identifiers

CLI command: `php bin/console dal:refresh:index`. Example variables: `product.productNumber`, `product.id`, `product.name`, `product.ean`, `product.manufacturer.name`, `product.metaTitle`, `product.metaDescription`, `product.categoryTree`, `category.seoBreadcrumb`, `category.translated.name`, `landingPage.cmsPageId`, `landingPage.url`.

## Gotchas

- Some available variables are not recommended for use in SEO templates because their values change frequently and negatively affect ranking (the doc lists several but deliberately does not enumerate them all).
- Canonical links for products are configured on the product itself, not via SEO template variables.
