---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md
title: Working with Media and Thumbnails
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/use-media-thumbnails.html
sourceHash: cc5802e50aee708f1151242ebbf2b48c4df65226
codeCheckedAgainst: "6.7.13.0"
keywords: ["media", "thumbnails", "images", "responsive images", "srcset", "searchMedia", "sw_thumbnails", "MediaCollection", "thumbnail.html.twig", "lazy loading", "custom field media", "element_product_listing_col"]
summary: Load media entities by ID in Storefront Twig with searchMedia and render responsive img/srcset markup with the sw_thumbnails tag.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md"]
---
## What it is

Two Storefront Twig helpers for media: the `searchMedia` function, which loads media entities for a list of media IDs (e.g. IDs stored in custom fields), and the `sw_thumbnails` tag, which renders an `img` element with `srcset`/`sizes` built from the media's generated thumbnails.

## When to use

You store only a media ID (for example in a custom field such as `custom_sports_media_id`) and need to display the image, or you want responsive image markup without hand-writing `srcset`.

## Key steps / config

### searchMedia

Twig call: `searchMedia(ids, context.context)`, taking an array of media IDs and a `Context` and returning a `MediaCollection`. It runs a database query, so collect IDs first and call it once, never inside a loop. Listing pattern (extend `@Storefront/storefront/component/product/listing.html.twig`):

```twig
{% block element_product_listing_col %}
    {% set sportsMediaIds = [] %}
    {% for product in searchResult %}
        {% set sportsMediaIds = sportsMediaIds|merge([product.translated.customFields.custom_sports_media_id]) %}
    {% endfor %}
    {% set mediaCollection = searchMedia(sportsMediaIds, context.context) %}
    {% for product in searchResult %}
        {% set sportsMedia = mediaCollection.get(product.translated.customFields.custom_sports_media_id) %}
    {% endfor %}
{% endblock %}
```

### sw_thumbnails

`media` (the whole media entity) is required, and so is the name string after the tag (it is passed as the `name` variable, not rendered as a CSS class):

```twig
{% sw_thumbnails 'my-thumbnails' with {
    media: cover,
    sizes: { 'xs': '501px', 'sm': '315px', 'md': '427px', 'lg': '333px', 'xl': '284px' },
    attributes: { 'class': 'my-custom-class', 'alt': '...', 'title': '...', 'loading': 'lazy' }
} %}
```

- `sizes`: per-breakpoint image width used to build the `sizes` attribute. A `default` entry overrides all breakpoints and is emitted alone (e.g. `sizes="100px"`). Only Bootstrap breakpoint keys work; custom media queries do not.
- `attributes`: extra HTML attributes. `alt`/`title` fall back to the media's translated values when not given.
- `loading: 'lazy'`: enables native lazy loading. Consider it when many thumbnails are outside the initial viewport or inside a container hidden with `display: none`.

The tag includes `@Storefront/storefront/utilities/thumbnail.html.twig`, which also reads `load`, `loadOriginalImage`, `autoColumnSizes` and `columns`.

## Essential identifiers

- Twig function `searchMedia`
- Twig tag `sw_thumbnails` (`Shopware\Storefront\Framework\Twig\TokenParser\ThumbnailTokenParser`)
- `@Storefront/storefront/utilities/thumbnail.html.twig`
- Parameters `media`, `sizes`, `attributes`

## Gotchas

- The PHP class behind `searchMedia`, `Shopware\Core\Framework\Adapter\Twig\Extension\MediaExtension`, is marked `@deprecated tag:v6.8.0` (becomes internal); use the Twig function, do not depend on the class.
- The source's product-detail example extends `@Storefront/storefront/page/product-detail/index.html.twig` block `page_product_detail_media`; neither exists in the installed Storefront (only `page/product-detail/meta.html.twig` remains there), so pick a current block for product detail pages.
- Without `loading` in `attributes`, the utility sets `loading="eager"`.
- The source's sample output uses `max-width`/`min-width` pairs and lists the original image in `srcset`; the installed template builds `(min-width: <breakpoint>px) <size>` entries from `theme_config('breakpoint.*')` (including `xxl`) plus a `vw` fallback, and adds the original image only when `loadOriginalImage` is true.
- The source says missing `sizes` fall back to the global `shopware.theme.breakpoint`; the installed template reads the theme config breakpoints instead.

## Code check (6.7.13.0)
- confirmed `searchMedia` — Twig function registered — vendor/shopware/core/Framework/Adapter/Twig/Extension/MediaExtension.php:31
- deprecated `MediaExtension` — becomes internal in v6.8.0 — vendor/shopware/core/Framework/Adapter/Twig/Extension/MediaExtension.php:17
- confirmed `sw_thumbnails` — tag name of token parser — vendor/shopware/storefront/Framework/Twig/TokenParser/ThumbnailTokenParser.php:41
- confirmed `name` — tag string passed as variable name — vendor/shopware/storefront/Framework/Twig/TokenParser/ThumbnailTokenParser.php:33
- confirmed `element_product_listing_col` — block in listing template — vendor/shopware/storefront/Resources/views/storefront/component/product/listing.html.twig:66
- confirmed `default` — sizes['default'] emitted as sole sizes value — vendor/shopware/storefront/Resources/views/storefront/utilities/thumbnail.html.twig:112
- corrected `loading` — docs: lazy loading disabled by default; template defaults it to eager — vendor/shopware/storefront/Resources/views/storefront/utilities/thumbnail.html.twig:35
- corrected `loadOriginalImage` — docs: original image always in srcset; only added when true — vendor/shopware/storefront/Resources/views/storefront/utilities/thumbnail.html.twig:69
- corrected `breakpoint.xs` — docs: fallback from global shopware.theme.breakpoint; template uses theme_config breakpoints — vendor/shopware/storefront/Resources/views/storefront/utilities/thumbnail.html.twig:91
- absent `page_product_detail_media` — block not found in installed code
