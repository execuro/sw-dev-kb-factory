---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/content/media/remote-thumbnail-generation.md
relatedPages:
  - platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md
sourceHash: cce496135395b9cfb73eb87b694ed4e9c815d0c1
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/media/remote-thumbnail-generation.html
title: Remote Thumbnail Generation
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware.media.remote_thumbnails.enable", "remote_thumbnails.pattern", "fallback_sizes", "RemoteThumbnailLoader", "ResolveRemoteThumbnailUrlExtension", "remote_thumbnail_url.resolve", "media:delete-local-thumbnails", "shopware.cdn.fastly.api_key", "thumbnailGenerationDisabled", "cdn thumbnails", "external image resizing", "fastly purge"]
summary: shopware.media.remote_thumbnails config builds thumbnail URLs from a CDN pattern instead of local files; side effects, cleanup command, Fastly purge.
lastBuilt: 2026-10-21
---
## What it is

Remote thumbnails switch off Shopware's filesystem thumbnail generation. Instead, thumbnail URLs are built at request time from a URL pattern, and an external CDN or image service generates and serves the images. No thumbnail files or `media_thumbnail` rows are created.

## When to use

You want a CDN or image-resizing service to handle thumbnails, for performance or scalability. Also read this if your plugin calls thumbnail APIs directly and must behave correctly when the feature is on.

## Key steps / config

`config/packages/shopware.yaml`:

```yaml
shopware:
  media:
    remote_thumbnails:
      enable: true
      pattern: '{mediaUrl}/{mediaPath}?width={width}&ts={mediaUpdatedAt}'
      fallback_sizes:
        - { width: 320, height: 320 }
```

- `shopware.media.remote_thumbnails.enable` (bool, default `false`) is the master switch.
- `shopware.media.remote_thumbnails.pattern` (string). Its default is the pattern shown above.
- `shopware.media.remote_thumbnails.fallback_sizes` (default `[]`) applies to folders that have thumbnails enabled but no assigned sizes. Each entry needs a `width` and `height` of at least 1. Folder sizes take precedence over fallback sizes. Turning **Create thumbnails** off for a folder disables both.
- Pattern variables:
  - `mediaUrl`: the public filesystem base URL. It is empty when the media `path` is already absolute.
  - `mediaPath`: e.g. `media/ab/cd/file.jpg`.
  - `width` and `height`: from the folder's `media_thumbnail_size` or a fallback size.
  - `mediaUpdatedAt`: Unix timestamp of `updatedAt`, falling back to `createdAt`.
- When moving an existing shop to remote thumbnails, run `bin/console media:delete-local-thumbnails`. It only runs while the feature is enabled. It deletes all `media_thumbnail` rows and their files and clears `media.thumbnails_ro`.
- To customise URLs, subscribe to `ResolveRemoteThumbnailUrlExtension` (name `remote_thumbnail_url.resolve`). A subscriber can rewrite or sign the URL, return `null` to skip a thumbnail, or inspect the `MediaEntity`.
- Fastly media purge, configured under `shopware.cdn.fastly`:
  - `api_key` (default `''`): a non-empty value is what activates purging.
  - `soft_purge` (default `false`): sent as the `fastly-soft-purge` header.
  - `max_parallel_invalidations` (default `2`).
  - `BanMediaUrl` resolves the affected URLs and `FastlyMediaReverseProxy` sends the purge requests.

## Essential identifiers

- Config: `shopware.media.remote_thumbnails.enable`, `.pattern`, `.fallback_sizes`, `shopware.cdn.fastly.api_key`, `.soft_purge`, `.max_parallel_invalidations`
- `MediaException::thumbnailGenerationDisabled()` (HTTP 400)
- `RemoteThumbnailLoader`, `MediaUrlLoader`, `ResolveRemoteThumbnailUrlExtension`
- CLI: `media:generate-thumbnails`, `media:delete-local-thumbnails`, `dal:refresh:index media.indexer`

## Gotchas

When the feature is enabled:
- `ThumbnailService::generate()`, `updateThumbnails()` and `deleteThumbnails()` throw `MediaException::thumbnailGenerationDisabled()`. Guard custom callers.
- `GenerateThumbnailsHandler` and `UpdateThumbnailsHandler` consume their messages but do nothing.
- `MediaIndexer` returns early, so `media.thumbnails_ro` is not maintained.
- `media:generate-thumbnails` fails with "Remote thumbnails are enabled. Skipping thumbnail generation."
- `FileSaver` no longer dispatches `GenerateThumbnailsMessage`. `MediaDeletionSubscriber` skips thumbnail cleanup.
- Synthesized `MediaThumbnailEntity` objects get a new random UUID on every request. Never rely on `media_thumbnail.id` or join against it.
- Private media keeps its signed local URL and is never served remotely.
- `MediaUrlLoader` and `RemoteThumbnailLoader` are `@final`. Extend through the extension point instead of modifying them.
- `shopware.cdn.fastly` (media purge) is separate from `shopware.http_cache.reverse_proxy.fastly` (storefront HTTP cache). See [Reverse HTTP cache](platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md).

## Version notes

- 6.6.4.0: remote thumbnails introduced.
- 6.6.5.0: the `{mediaUpdatedAt}` variable added.
- 6.6.6.0: `media:delete-local-thumbnails` added.
- 6.7.1.0: `ResolveRemoteThumbnailUrlExtension` added, and the indexer stops maintaining `thumbnails_ro` while the feature is on.
- 6.7.3.0: returning `null` from the extension skips the thumbnail.

## Code check (6.7.15.1)
- confirmed `remote_thumbnails.pattern` — default '{mediaUrl}/{mediaPath}?width={width}&ts={mediaUpdatedAt}' — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:366
- confirmed `remote_thumbnails.fallback_sizes` — default [], width/height required, min 1 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:367
- confirmed `remote_thumbnails.enable` — default false — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:454
- confirmed `fastly.api_key` — default '' under shopware.cdn — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:216
- confirmed `fastly.max_parallel_invalidations` — default 2 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:218
- corrected `MEDIA_THUMBNAIL_GENERATION_DISABLED` — docs: error code MEDIA_THUMBNAIL_GENERATION_DISABLED; actual value is CONTENT__MEDIA_THUMBNAIL_GENERATION_DISABLED — vendor/shopware/core/Content/Media/MediaException.php:64
- confirmed `MediaException::thumbnailGenerationDisabled()` — HTTP 400 — vendor/shopware/core/Content/Media/MediaException.php:477
- confirmed `remote_thumbnail_url.resolve` — ResolveRemoteThumbnailUrlExtension::NAME — vendor/shopware/core/Content/Media/Extension/ResolveRemoteThumbnailUrlExtension.php:20
- confirmed `media:delete-local-thumbnails` — command name — vendor/shopware/core/Content/Media/Commands/DeleteThumbnailsCommand.php:20
- confirmed `RemoteThumbnailLoader` — class exists — vendor/shopware/core/Content/Media/Core/Application/RemoteThumbnailLoader.php:27
