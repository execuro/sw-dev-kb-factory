---
id: platform/dev/6.7/resources/references/adr/2023-01-30-image-lazy-loading.md
title: Add native lazy loading for images to the storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-01-30-image-lazy-loading.html
sourceHash: fe67bf81124a88890b36ee403760557dca1f206d
codeCheckedAgainst: "6.7.15.1"
keywords: ["loading lazy", "loading eager", "sw_thumbnails", "thumbnail.html.twig", "lazy loading", "native lazy loading", "image performance", "storefront images", "thumbnail component", "above the fold", "lazysizes", "adr"]
summary: "ADR: storefront thumbnail component accepts a loading attribute (default eager); product boxes, flyouts, CMS images and line items pass lazy."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-01-30) adding native browser lazy loading (`loading="lazy"`) to storefront images, without extra JavaScript. Previously storefront images and thumbnails had no lazy loading at all unless a third-party extension added something like "lazysizes".

## When to use

- You render images through the storefront thumbnail component and want them to load only when they enter the viewport.
- You wonder why some storefront images are lazy and others are not, or you ship a JavaScript lazy-loading extension that uses the thumbnail component.

## Key steps / config

The thumbnail component `Resources/views/storefront/utilities/thumbnail.html.twig` (used via the `sw_thumbnails` Twig tag) sets `loading: 'eager'` when the caller passes no `loading` attribute — the browser default, same as omitting the attribute. To lazy-load, pass `loading` with value `lazy` in `attributes`:

```twig
{% sw_thumbnails 'my-thumbnail' with {
    media: category.media,
    attributes: {
        'class': 'my-css-class',
        'loading': 'lazy'
    }
} %}
```

Areas where core passes `loading: 'lazy'` to reduce initial network load:

- Main menu flyout — category preview images load only when the flyout opens (`layout/navbar/content.html.twig`).
- Product boxes — product images in listings and horizontally scrolling product sliders such as cross-selling (`component/product/card/box-standard.html.twig`).
- CMS image elements — only images that enter the viewport while scrolling (`element/cms-element-image.html.twig`).
- Line item images, e.g. on the cart page (`component/line-item/element/image.html.twig`).

## Essential identifiers

- `sw_thumbnails` — Twig tag rendering the thumbnail component
- `Resources/views/storefront/utilities/thumbnail.html.twig`
- `attributes.loading` — `'lazy'` or `'eager'` (default)

## Gotchas

- The default is deliberately not `lazy`, to avoid unexpected behaviour for extensions that already combine the thumbnail component with a JavaScript lazy-loading solution.
- Core does not add `loading="lazy"` everywhere: images likely "above the fold" should not be lazy-loaded, and in dynamic CMS content the position of a generic image component cannot be known. Heuristics like "lazy after the 8th product" break with portrait monitors or mobile viewports. As a trade-off, all product boxes are lazy, including some that render above the fold.
- The ADR excludes the product detail image gallery (likely above the fold; already uses JavaScript lazy loading for zoom) and CMS image sliders (the next image could appear too late). In 6.7 the image gallery template does lazy-load every slide except the first one — see Code check.

## Code check (6.7.15.1)
- confirmed `loading` — thumbnail component merges loading 'eager' when none is passed — vendor/shopware/storefront/Resources/views/storefront/utilities/thumbnail.html.twig:35
- confirmed `sw_thumbnails` — Twig tag name returned by ThumbnailTokenParser — vendor/shopware/storefront/Framework/Twig/TokenParser/ThumbnailTokenParser.php:41
- confirmed `loading` — navbar flyout category images lazy — vendor/shopware/storefront/Resources/views/storefront/layout/navbar/content.html.twig:78
- confirmed `loading` — product box images lazy — vendor/shopware/storefront/Resources/views/storefront/component/product/card/box-standard.html.twig:67
- confirmed `loading` — CMS image element lazy — vendor/shopware/storefront/Resources/views/storefront/element/cms-element-image.html.twig:53
- confirmed `loading` — line item images lazy — vendor/shopware/storefront/Resources/views/storefront/component/line-item/element/image.html.twig:19
- corrected `loading` — docs: gallery/sliders without lazy; code lazy-loads all gallery slides except the first — vendor/shopware/storefront/Resources/views/storefront/element/cms-element-image-gallery.html.twig:342
