---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md
sourceHash: cc5802e50aee708f1151242ebbf2b48c4df65226
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/use-media-thumbnails.html
title: Working with Media and Thumbnails
version: "6.7"
versions:
  - "6.7"
keywords: ["searchMedia", "sw_thumbnails", "MediaCollection", "MediaExtension", "thumbnail.html.twig", "element_product_listing_col", "srcset", "sizes", "lazy loading", "media id to image", "responsive images", "theme breakpoint"]
summary: Resolve media IDs to MediaCollection with the searchMedia Twig function and render responsive img/srcset markup with the sw_thumbnails tag.
lastBuilt: 2026-10-21
---
## What it is

Two Storefront Twig helpers for media: the `searchMedia` function, which loads media entities for a list of media IDs (e.g. stored in a custom field), and the `sw_thumbnails` tag, which renders an `img` with `src`, `srcset` and `sizes` from the media's generated thumbnails.

## When to use

You have a media ID (often in a custom field such as `custom_sports_media_id`) and need to display the image in a Storefront template, or you want responsive thumbnail markup without hand-writing `srcset`.

## Key steps / config

### searchMedia

Signature: `searchMedia(array $ids, Context $context): MediaCollection`. Pass all IDs at once, then pick entries with `.get(id)`:

```twig
{% set ids = [] %}
{% for product in searchResult %}
    {% set ids = ids|merge([product.translated.customFields.custom_sports_media_id]) %}
{% endfor %}
{% set mediaCollection = searchMedia(ids, context.context) %}
{% set sportsMedia = mediaCollection.get(someId) %}
```

The source applies this inside `element_product_listing_col` of `@Storefront/storefront/component/product/listing.html.twig`.

### sw_thumbnails

Minimal form — the name string and `media` (whole media entity) are required; everything else is optional. The name string does not render a CSS class.

```twig
{% sw_thumbnails 'my-thumbnails' with {
    media: cover,
    sizes: { 'xs': '501px', 'sm': '315px', 'md': '427px', 'lg': '333px', 'xl': '284px' },
    attributes: { 'class': 'my-custom-class', 'alt': '...', 'title': '...', 'loading': 'lazy' }
} %}
```

- `sizes`: maps Bootstrap viewport keys to the image width used per media query, producing a `sizes` attribute built from `(min-width: <breakpoint>px)` entries plus a `vw` fallback.
- `sizes.default`: if present, all other keys are ignored and the output is `sizes="<default>"` (e.g. `'default': '100px'`).
- `attributes`: arbitrary extra `img` attributes; `'loading': 'lazy'` enables native lazy loading.
- The tag renders `@Storefront/storefront/utilities/thumbnail.html.twig`, which also reads `load`, `loadOriginalImage`, `autoColumnSizes` and `columns`.

## Essential identifiers

- Twig function `searchMedia` (`Shopware\Core\Framework\Adapter\Twig\Extension\MediaExtension::searchMedia()`), returns `MediaCollection`
- Twig tag `sw_thumbnails` (Storefront `ThumbnailTokenParser`)
- Template `storefront/utilities/thumbnail.html.twig`
- Parameters `media`, `sizes`, `sizes.default`, `attributes`

## Gotchas

- `searchMedia` runs a database query per call — never call it inside a loop; collect IDs and fetch once.
- `sizes` keys only work with the theme's Bootstrap breakpoints; custom media queries are not supported. The installed template iterates `xs`, `sm`, `md`, `lg`, `xl` and `xxl`, read via `theme_config('breakpoint.<key>')` (the docs refer to "global `shopware.theme.breakpoint`").
- Automatic `sizes` are only computed when `columns` is passed and `autoColumnSizes` is not false; with neither `sizes` nor `columns` no `sizes` attribute is emitted.
- If no `loading` attribute is given, the template sets `loading="eager"`. Consider `lazy` for thumbnails outside the initial viewport or inside a `display: none` container.
- `alt`/`title` fall back to `media.translated.alt` / `media.translated.title` when not set in `attributes`.
- The source's single-image example extends `@Storefront/storefront/page/product-detail/index.html.twig` block `page_product_detail_media`; neither exists in 6.7 (product detail is CMS-layout based), so apply the pattern to a template/block that exists.

## Code check (6.7.15.1)
- confirmed `searchMedia` — registered as Twig function — vendor/shopware/core/Framework/Adapter/Twig/Extension/MediaExtension.php:30
- confirmed `MediaExtension::searchMedia()` — takes array of IDs and Context, returns MediaCollection — vendor/shopware/core/Framework/Adapter/Twig/Extension/MediaExtension.php:37
- confirmed `sw_thumbnails` — token parser tag name — vendor/shopware/storefront/Framework/Twig/TokenParser/ThumbnailTokenParser.php:41
- corrected `sizes` — docs: fallback from global shopware.theme.breakpoint; code computes from theme_config breakpoints only when columns set — vendor/shopware/storefront/Resources/views/storefront/utilities/thumbnail.html.twig:40
- confirmed `default` — sizes default overrides all media queries — vendor/shopware/storefront/Resources/views/storefront/utilities/thumbnail.html.twig:112
- corrected `xxl` — docs: only xs–xl; template also uses breakpoint.xxl — vendor/shopware/storefront/Resources/views/storefront/utilities/thumbnail.html.twig:96
- confirmed `loading` — defaults to eager when not set in attributes — vendor/shopware/storefront/Resources/views/storefront/utilities/thumbnail.html.twig:35
- confirmed `element_product_listing_col` — block in product listing template — vendor/shopware/storefront/Resources/views/storefront/component/product/listing.html.twig:66
- absent `page_product_detail_media` — block not found in installed code; product-detail/index.html.twig no longer exists
