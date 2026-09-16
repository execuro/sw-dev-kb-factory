---
id: platform/dev/6.6/guides/plugins/plugins/storefront/use-media-thumbnails.md
title: Working with media and thumbnails
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/use-media-thumbnails.html
sourceHash: 50056bbcb6b370810670f86916bc8e51b3cbebff
keywords: ["searchMedia", "sw_thumbnails", "MediaCollection", "media entity", "thumbnails", "srcset", "sizes attribute", "lazy loading", "custom fields media", "storefront images", "breakpoints", "shopware.theme.breakpoint"]
summary: How to fetch media by ID with searchMedia and render responsive images with the sw_thumbnails Twig function.
lastBuilt: 2026-09-15
---

## What it is

Documents two Storefront tools for working with media/images in Twig: the `searchMedia` PHP function (exposed to Twig) for looking up media entities by ID, and the `sw_thumbnails` Twig function for rendering responsive `img`/`srcset` markup.

## When to use

When a plugin needs to display media referenced only by ID (e.g. via a custom field) in the Storefront, or needs responsive thumbnail images without hand-writing `img`/`srcset` HTML.

## Key steps / config

`searchMedia` signature:

```php
public function searchMedia (array $ids, Context $context): MediaCollection { ... }
```

Fetch a single custom-field media ID and dump it:

```twig
{% set mediaCollection = searchMedia([sportsMediaId], context.context) %}
{% set sportsMedia = mediaCollection.get(sportsMediaId) %}
```

Batch-fetch IDs for a listing (single query instead of per-product):

```twig
{% set mediaCollection = searchMedia(sportsMediaIds, context.context) %}
```

Minimal `sw_thumbnails` usage (required params: a label string and `media`):

```twig
{% sw_thumbnails 'my-thumbnails' with {
    media: cover
} %}
```

Optional params: `sizes` (per Bootstrap viewport, or a `default` override), `attributes` (e.g. `class`, `alt`, `title`, `loading: 'lazy'`).

## Essential identifiers

- `searchMedia(array $ids, Context $context): MediaCollection`
- `sw_thumbnails` Twig function
- `sw_thumbnails` parameters: `media`, `sizes`, `attributes`, `default`
- Global fallback config: `shopware.theme.breakpoint`

## Gotchas

- `searchMedia` performs a database query — never call it inside a loop; batch all needed IDs into one call instead.
- `sizes` only works with Bootstrap viewport keys (`xs`, `sm`, `md`, `lg`, `xl`); custom media queries are not supported.
- Lazy loading (`attributes: { loading: 'lazy' }`) is disabled by default on `sw_thumbnail` elements; enable it for images outside the initial viewport or hidden via `display: none`.
