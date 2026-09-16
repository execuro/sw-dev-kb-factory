---
id: platform/dev/6.7/resources/references/adr/2023-01-30-image-lazy-loading.md
title: Add native lazy loading for images to the storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-01-30-image-lazy-loading.html
sourceHash: fe67bf81124a88890b36ee403760557dca1f206d
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw_thumbnails", "thumbnail.html.twig", "loading", "loading lazy", "loading eager", "lazy loading", "native lazy loading", "image performance", "thumbnail component", "above-the-fold", "fetchpriority", "storefront images"]
summary: "ADR 2023-01-30: sw_thumbnails accepts a loading attribute for image lazy loading; default eager; lazy in flyout, product boxes, CMS images, line items."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-01-30, area storefront) adding browser-native image lazy loading (`loading="lazy"`) to the Storefront thumbnail component instead of a JavaScript solution such as lazysizes.

## When to use

When rendering images with `sw_thumbnails` in a theme or plugin and deciding whether they should load lazily, or when checking why some Storefront images load late.

## Key steps / config

The thumbnail component `Resources/views/storefront/utilities/thumbnail.html.twig` sets `loading: 'eager'` if the `attributes` passed in contain no `loading` key. Eager is the browser default (same as omitting the attribute); it stays the default so extensions that use a JavaScript lazy-loading solution are not affected.

To activate lazy loading, pass `loading` with value `lazy` in `attributes`:

```twig
{% sw_thumbnails 'my-thumbnail' with {
    media: category.media,
    attributes: {
        'class': 'my-css-class',
        'loading': 'lazy'
    }
} %}
```

Core templates that pass `loading: 'lazy'`:

- Main menu flyout: category preview images load when the flyout opens.
- Product boxes: images load when they enter the viewport; also affects horizontally scrolling product sliders (e.g. cross-selling).
- CMS image element: images load when scrolled into view (in 6.7 only if the element's `fetchPriorityHigh` config is not set; otherwise `fetchpriority: 'high'`).
- Line item images (e.g. cart page).

## Essential identifiers

- `sw_thumbnails` (Twig tag)
- `Resources/views/storefront/utilities/thumbnail.html.twig`
- `attributes.loading` with `'lazy'` / `'eager'`

## Gotchas

- Do not set `loading="lazy"` on everything: images likely above the fold should not be lazy. Storefront content is dynamic, so positions cannot be predicted; heuristics like "lazy after the 8th product" break on portrait or mobile viewports. Shopware accepts that some product boxes above the fold are lazy.
- A JavaScript solution would contradict native lazy loading.
- ADR-listed exclusions: product detail image gallery (above the fold, already uses JavaScript lazy loading for zoom) and CMS image sliders (images can appear too late when sliding).

## Version notes

- In 6.7.13.0 the CMS image gallery slider does pass `loading: 'lazy'` to every slide except the first, and can set `fetchpriority: 'high'` on the first; the ADR listed the gallery as excluded.

## Code check (6.7.13.0)
- confirmed `sw_thumbnails` — Twig tag name of the thumbnail token parser — vendor/shopware/storefront/Framework/Twig/TokenParser/ThumbnailTokenParser.php:41
- confirmed `attributes.loading` — defaults to eager when not defined — vendor/shopware/storefront/Resources/views/storefront/utilities/thumbnail.html.twig:34
- confirmed `loading: 'lazy'` — main menu flyout category images — vendor/shopware/storefront/Resources/views/storefront/layout/navbar/content.html.twig:78
- confirmed `loading: 'lazy'` — product box images — vendor/shopware/storefront/Resources/views/storefront/component/product/card/box-standard.html.twig:67
- confirmed `loading: 'lazy'` — line item images — vendor/shopware/storefront/Resources/views/storefront/component/line-item/element/image.html.twig:19
- corrected `'loading': 'lazy'` — docs: CMS image elements always lazy; code: only without fetchPriorityHigh — vendor/shopware/storefront/Resources/views/storefront/element/cms-element-image.html.twig:53
- corrected `loading: 'lazy'` — docs: gallery has no lazy loading; code: lazy on all slides except the first — vendor/shopware/storefront/Resources/views/storefront/element/cms-element-image-gallery.html.twig:342
