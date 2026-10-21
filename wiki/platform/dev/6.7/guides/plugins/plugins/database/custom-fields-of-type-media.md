---
id: platform/dev/6.7/guides/plugins/plugins/database/custom-fields-of-type-media.md
title: Using Custom Fields of Type Media
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/database/custom-fields-of-type-media.html
sourceHash: f8f93428f586df70e20a149636ed17f5f43c7bbf
codeCheckedAgainst: "6.7.15.1"
keywords: ["searchMedia", "MediaExtension", "MediaCollection", "sw_thumbnails", "customFields", "media custom field", "custom field of type media", "media uuid", "element_product_listing_col", "storefront twig", "product images", "thumbnails"]
summary: Resolve media custom field IDs in Storefront Twig with searchMedia(), batching IDs outside loops; render via img tag or sw_thumbnails.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md"]
---
## What it is

A custom field of type media (created in the Administration or by a plugin, see [Adding custom fields](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md)) stores only the media UUID on the entity. This page shows how to turn that UUID into a media entity in Storefront Twig and render it, e.g. extra images on the product detail page.

## When to use

- You render a media custom field (product, category, ...) in a Storefront template.
- You need media for several products in a listing without one query per product.

## Key steps / config

1. Read the UUID: on the product detail page it is `page.product.translated.customFields.<field_name>`; in a listing loop `product.translated.customFields.<field_name>`.
2. Resolve it with the Twig function `searchMedia(ids, context)`, backed by `Shopware\Core\Framework\Adapter\Twig\Extension\MediaExtension::searchMedia(array $ids, Context $context): MediaCollection`. Pass `context.context` and an **array** of IDs, then pick one entity with `.get(id)`.

```twig
{% sw_extends '@Storefront/storefront/page/content/product-detail.html.twig' %}
{% block page_content %}
    {% set sportsMediaId = page.product.translated.customFields.custom_sports_media_id %}
    {% if sportsMediaId %}
        {% set mediaCollection = searchMedia([sportsMediaId], context.context) %}
        {% set sportsMedia = mediaCollection.get(sportsMediaId) %}
    {% endif %}
    {{ parent() }}
{% endblock %}
```

3. In a listing (`@Storefront/storefront/component/product/listing.html.twig`, block `element_product_listing_col`): loop over `searchResult` once to collect IDs with `sportsMediaIds|merge([sportsMediaId])`, call `searchMedia(sportsMediaIds, context.context)` once, then loop again and use `mediaCollection.get(sportsMediaId)` per product.
4. Render: use `sportsMedia.url`, `sportsMedia.alt`, `sportsMedia.title`, e.g. `<img src="{{ sportsMedia.url }}" alt="{{ sportsMedia.alt }}">` for the original image, or viewport-specific thumbnails:

```twig
{% sw_thumbnails 'my-sportsMedia-thumbnails' with {
    media: sportsMedia
} %}
```

## Essential identifiers

- `searchMedia` (Twig function) / `MediaExtension::searchMedia()`
- `MediaCollection`, `.get(id)`
- `page.product.translated.customFields.<name>`
- `sw_thumbnails` (Twig tag)
- `element_product_listing_col`, `page_content` (Storefront blocks)

## Gotchas

- `searchMedia` runs a repository search on every call — never call it inside a `for` loop; collect IDs and resolve them in one call.
- The docs example extends `@Storefront/storefront/page/product-detail/index.html.twig` and block `page_product_detail_media`; neither exists in 6.7.15.1. The product detail page is CMS-based and rendered by `page/content/product-detail.html.twig`.
- Overriding a block without `{{ parent() }}` replaces the core content of that block.
- An empty ID array returns an empty `MediaCollection` without a query.

## Code check (6.7.15.1)
- confirmed `searchMedia` — registered as a Twig function — vendor/shopware/core/Framework/Adapter/Twig/Extension/MediaExtension.php:30
- confirmed `MediaExtension::searchMedia()` — signature `(array $ids, Context $context): MediaCollection` — vendor/shopware/core/Framework/Adapter/Twig/Extension/MediaExtension.php:37
- confirmed `MediaCollection` — returned empty for `[]` without querying — vendor/shopware/core/Framework/Adapter/Twig/Extension/MediaExtension.php:40
- confirmed `sw_thumbnails` — Twig tag provided by ThumbnailTokenParser — vendor/shopware/storefront/Framework/Twig/TokenParser/ThumbnailTokenParser.php:41
- confirmed `element_product_listing_col` — block in component/product/listing.html.twig — vendor/shopware/storefront/Resources/views/storefront/component/product/listing.html.twig:66
- corrected `page_content` — docs: block page_product_detail_media in page/product-detail/index.html.twig — vendor/shopware/storefront/Resources/views/storefront/page/content/product-detail.html.twig:9
- absent `page_product_detail_media` — no such block in the installed code
- absent `@Storefront/storefront/page/product-detail/index.html.twig` — template does not exist; only page/product-detail/meta.html.twig remains
