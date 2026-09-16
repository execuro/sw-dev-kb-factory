---
id: platform/dev/6.6/guides/plugins/plugins/content/media/remote-thumbnail-generation.md
title: Remote Thumbnail Generation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/media/remote-thumbnail-generation.html"
sourceHash: 5f78e38aca90cee55c6f59dff8c3225082928738
keywords: ["remote thumbnails", "CDN", "thumbnail generation", "shopware.media.remote_thumbnails", "media configuration", "mediaUrl", "mediaPath", "shopware.yaml", "performance", "scalability", "thumbnail pattern"]
summary: "Configures external CDN-generated thumbnails via shopware.media.remote_thumbnails, disabling filesystem thumbnail generation."
lastBuilt: 2026-09-15
---
## What it is
Describes how to disable Shopware's filesystem thumbnail generation and instead have an external CDN service generate and deliver thumbnail images, available since Shopware 6.6.4.0.

## When to use
Use remote thumbnails when you want performance and scalability benefits by offloading thumbnail generation to an external CDN, instead of having Shopware generate thumbnail images and thumbnail database records itself.

## Key steps / config
1. Adjust `config/packages/shopware.yaml`:
```yaml
shopware:
  media:
    remote_thumbnails:
      enable: true
      pattern: '{mediaUrl}/{mediaPath}?width={width}&ts={mediaUpdatedAt}'
```
2. `shopware.media.remote_thumbnails.enable` — set to `true` to enable remote thumbnails.
3. `shopware.media.remote_thumbnails.pattern` — the URL pattern used to build remote thumbnail URLs; replace with your own pattern.
4. The pattern supports these variables: `mediaUrl` (base URL of the media file), `mediaPath` (media file path relative to `mediaUrl`), `width` (thumbnail width), `height` (thumbnail height), `mediaUpdatedAt` (timestamp of the last media change).
5. With the default pattern `{mediaUrl}/{mediaPath}?width={width}&ts={mediaUpdatedAt}`, a generated thumbnail URL looks like `https://yourshop.example/abc/123/456.jpg?width=80&ts=1718954838`.
6. Once configured, Shopware automatically uses the pattern to build thumbnail URLs pointing at the external CDN service, which must be able to handle the URL pattern and generate/deliver the matching thumbnail.

## Essential identifiers
- `shopware.media.remote_thumbnails.enable`
- `shopware.media.remote_thumbnails.pattern`
- `config/packages/shopware.yaml`

## Gotchas
The external CDN service is fully responsible for interpreting the URL pattern and generating the appropriate thumbnails based on the provided parameters — Shopware no longer generates thumbnail files or thumbnail records in the database when this is enabled.

## Version notes
This feature is available starting with Shopware version 6.6.4.0.
