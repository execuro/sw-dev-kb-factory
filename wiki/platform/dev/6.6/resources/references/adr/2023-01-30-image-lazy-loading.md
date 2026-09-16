---
id: platform/dev/6.6/resources/references/adr/2023-01-30-image-lazy-loading.md
title: Add native lazy loading for images to the storefront
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-01-30-image-lazy-loading.html"
sourceHash: "fe67bf81124a88890b36ee403760557dca1f206d"
keywords: ["lazy loading", "loading attribute", "thumbnail component", "sw_thumbnails", "storefront images", "native lazy loading", "above-the-fold", "CMS image element", "product box", "line item image", "main menu flyout", "thumbnail.html.twig"]
summary: "ADR adopting native `loading=\"lazy\"` on storefront thumbnails instead of a JavaScript lazysizes-style solution."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents the decision to use the browser-native `loading="lazy"` HTML attribute on storefront images/thumbnails instead of adding a third-party JavaScript lazy-loading library such as "lazysizes".

## When to use
Relevant when working with the storefront thumbnail component or any area that renders `Resources/views/storefront/utilities/thumbnail.html.twig`, and when deciding whether a given image area should load eagerly or lazily.

## Key steps / config
- The thumbnail component accepts a `loading` attribute; by default it uses `loading="eager"` (equivalent to not setting the attribute at all), so existing extensions using their own JS lazy-loading are unaffected.
- To activate lazy loading for a usage of the component, pass `loading: 'lazy'` in the `attributes` map:

```diff
{% sw_thumbnails 'my-thumbnail' with {
    media: category.media,
    attributes: {
        'class': 'my-css-class'
+        'loading': 'lazy'
    }
} %}
```

- Areas switched to `loading="lazy"`: main menu flyout category preview images, product box/listing and slider images (including cross-selling), CMS image elements, and line item images (e.g. cart page).
- Areas deliberately left without `loading="lazy"`: the product detail page image gallery (already "above-the-fold" and uses its own JS zoom lazy loading), and CMS image sliders (lazy loading can make the next slide appear too late).

## Essential identifiers
- `loading="lazy"` / `loading="eager"` HTML attribute
- `Resources/views/storefront/utilities/thumbnail.html.twig`
- `sw_thumbnails` Twig function/attributes map

## Gotchas
Applying `loading="lazy"` indiscriminately is avoided: content that is likely "above-the-fold" (e.g. the product gallery) should not be lazy-loaded, and heuristics like "only lazy-load after the 8th product" were rejected because viewport/layout changes (portrait monitors, mobile) make them unreliable.
