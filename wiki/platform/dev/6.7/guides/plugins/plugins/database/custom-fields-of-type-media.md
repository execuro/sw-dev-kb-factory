---
id: platform/dev/6.7/guides/plugins/plugins/database/custom-fields-of-type-media.md
title: Using Custom Fields of Type Media
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/database/custom-fields-of-type-media.html
sourceHash: f8f93428f586df70e20a149636ed17f5f43c7bbf
codeCheckedAgainst: "6.7.13.0"
keywords: ["searchMedia", "MediaExtension", "sw_thumbnails", "MediaCollection", "custom field media", "customFields", "element_product_listing_col", "page_content_blocks", "media id resolve", "twig media", "product image custom field", "thumbnails"]
summary: "Resolve media UUIDs stored in media-type custom fields in Storefront Twig via searchMedia(ids, context.context); batch IDs, avoid calls inside loops."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md"]
---
## What it is

A custom field of type media (created in the Administration or via a plugin) stores only a media UUID on the entity, e.g. `page.product.translated.customFields.xxx`. In Storefront Twig, the UUID is resolved into media entities with the `searchMedia` Twig function, registered in core's Twig extension `MediaExtension`:

```php
public function searchMedia(array $ids, Context $context): MediaCollection
```

Typical use: extra images on the product detail page. For creating custom fields see [Adding custom fields](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md).

## When to use

You have a media custom field (example name `custom_sports_media_id`) on products or other entities and need its URL, alt text or thumbnails in a Storefront template.

## Key steps / config

1. Read the ID, call `searchMedia` with an array of IDs and `context.context`, then pick the entity from the returned collection:

```twig
{% sw_extends '@Storefront/storefront/page/content/product-detail.html.twig' %}
{% block page_content_blocks %}
    {{ parent() }}
    {% set sportsMediaId = page.product.translated.customFields.custom_sports_media_id %}
    {% if sportsMediaId %}
        {% set mediaCollection = searchMedia([sportsMediaId], context.context) %}
        {% set sportsMedia = mediaCollection.get(sportsMediaId) %}
    {% endif %}
{% endblock %}
```

   The 6.7 product detail page template is `page/content/product-detail.html.twig` (CMS-layout driven); pick the block that fits your output.
2. Use `sportsMedia.url`, `sportsMedia.alt`, `sportsMedia.title`.
3. In listings (`@Storefront/storefront/component/product/listing.html.twig`, block `element_product_listing_col`): first loop over `searchResult` and collect IDs with `sportsMediaIds|merge([sportsMediaId])`, call `searchMedia(sportsMediaIds, context.context)` once, then loop again and use `mediaCollection.get(...)`.
4. Output the original image with a plain `img` tag (`src="{{ sportsMedia.url }}"`), or viewport-specific thumbnails with the `sw_thumbnails` tag:

```twig
{% sw_thumbnails 'my-sportsMedia-thumbnails' with { media: sportsMedia } %}
```

## Essential identifiers

- Twig function `searchMedia(ids, context)` returning `MediaCollection`
- Twig tag `sw_thumbnails` (`Shopware\Storefront\Framework\Twig\TokenParser\ThumbnailTokenParser`)
- `page.product.translated.customFields.<name>`, `context.context`
- Blocks `page_content_blocks`, `element_product_listing_col`

## Gotchas

- Each `searchMedia` call runs a repository search (database query); never call it inside a loop — pass all IDs as one array. An empty array returns an empty `MediaCollection` without querying.
- The source's example extends `@Storefront/storefront/page/product-detail/index.html.twig` and block `page_product_detail_media`; neither exists in 6.7.13.0.
- `sw_thumbnails` is a Twig tag, not a function; it includes `@Storefront/storefront/utilities/thumbnail.html.twig` and passes the quoted string as `name`.

## Version notes

- `Shopware\Core\Framework\Adapter\Twig\Extension\MediaExtension` is marked `@deprecated tag:v6.8.0 - reason:becomes-internal`; the PHP class becomes internal in 6.8, the `searchMedia` Twig function itself is not marked deprecated.

## Code check (6.7.13.0)
- confirmed `searchMedia` — TwigFunction registered by MediaExtension — vendor/shopware/core/Framework/Adapter/Twig/Extension/MediaExtension.php:31
- confirmed `MediaExtension::searchMedia()` — signature `(array $ids, Context $context): MediaCollection`; empty array short-circuits — vendor/shopware/core/Framework/Adapter/Twig/Extension/MediaExtension.php:38
- deprecated `MediaExtension` — becomes internal in v6.8.0 — vendor/shopware/core/Framework/Adapter/Twig/Extension/MediaExtension.php:17
- corrected `sw_thumbnails` — docs: Twig function; it is a token parser tag — vendor/shopware/storefront/Framework/Twig/TokenParser/ThumbnailTokenParser.php:41
- corrected `page_content_blocks` — docs: extend page/product-detail/index.html.twig block page_product_detail_media — vendor/shopware/storefront/Resources/views/storefront/page/content/product-detail.html.twig:35
- absent `page_product_detail_media` — block name found nowhere in installed Shopware code
- confirmed `element_product_listing_col` — block in component/product/listing.html.twig — vendor/shopware/storefront/Resources/views/storefront/component/product/listing.html.twig:66
