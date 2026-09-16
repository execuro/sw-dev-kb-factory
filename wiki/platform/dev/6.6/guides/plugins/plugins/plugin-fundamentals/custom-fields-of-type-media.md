---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/custom-fields-of-type-media.md
title: Using custom fields of type media
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceHash: 1e5d8f7927491d740c8fdb1f3ad37c05d2b04288
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/custom-fields-of-type-media.html
keywords: ["custom field", "media", "searchMedia", "MediaExtension", "MediaCollection", "sw_extends", "sw_thumbnails", "customFields", "product-detail.html.twig", "listing.html.twig", "twig function"]
summary: "Resolve media-type custom field UUIDs to MediaEntity objects in Twig via the searchMedia function, batched to avoid per-loop queries."
lastBuilt: "2026-09-15"
---
## What it is

A guide on resolving a custom field of type media (stored as a media UUID on `customFields`) into a usable media object in storefront Twig templates.

## When to use

Use this after adding a media-type custom field to an entity (e.g. a product) when the storefront template needs to display that media, such as an extra image on the product detail page.

## Key steps / config

1. The custom field value on an entity, e.g. `page.product.translated.customFields.custom_sports_media_id`, holds the media UUID.
2. Resolve it with the Twig-exposed `searchMedia` function:

```php
// platform/src/Core/Framework/Adapter/Twig/Extension/MediaExtension.php
public function searchMedia(array $ids, Context $context): MediaCollection { ... }
```

3. Example usage extending a storefront block:

```twig
{% sw_extends '@Storefront/storefront/page/product-detail/index.html.twig' %}
{% block page_product_detail_media %}
    {% set sportsMediaId = page.product.translated.customFields.custom_sports_media_id %}
    {% set mediaCollection = searchMedia([sportsMediaId], context.context) %}
    {% set sportsMedia = mediaCollection.get(sportsMediaId) %}
{% endblock %}
```

4. In a listing loop, collect all IDs first and call `searchMedia` once with the full array, rather than once per iteration.
5. Display the resolved media with a plain `<img>` tag using `sportsMedia.url`/`sportsMedia.alt`, or with the `sw_thumbnails` Twig function for viewport-specific images.

## Essential identifiers

- `searchMedia(array $ids, Context $context): MediaCollection`
- `Shopware\Core\Content\Media\MediaEntity`
- `sw_extends`, `sw_thumbnails`

## Gotchas

`searchMedia` queries the database on every invocation, so it must not be called inside a loop — pass an array of all needed IDs at once instead.
