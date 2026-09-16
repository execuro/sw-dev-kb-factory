---
id: platform/dev/6.7/guides/plugins/plugins/content/media/remote-thumbnail-generation.md
title: Remote Thumbnail Generation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/media/remote-thumbnail-generation.html
sourceHash: cce496135395b9cfb73eb87b694ed4e9c815d0c1
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware.media.remote_thumbnails.enable", "shopware.media.remote_thumbnails.pattern", "ResolveRemoteThumbnailUrlExtension", "remote_thumbnail_url.resolve", "RemoteThumbnailLoader", "media:delete-local-thumbnails", "shopware.cdn.fastly.api_key", "remote thumbnails", "cdn thumbnails", "image resizing proxy", "fastly purge", "thumbnail generation disabled"]
summary: Disable local thumbnail generation and build CDN thumbnail URLs from a pattern; side effects, URL extension hook and Fastly media purge.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md"]
---
## What it is

Configuration that turns off Shopware's filesystem thumbnail generation and synthesizes thumbnail URLs at request time from a pattern, so an external CDN/image service renders the thumbnails. Also covers the media-cache Fastly purge settings.

## When to use

- Offloading thumbnail rendering to a CDN or image-resizing proxy.
- Plugin code that calls thumbnail services, which behave differently once the feature is on.
- Rewriting or signing generated thumbnail URLs.

## Key steps / config

1. Configure `config/packages/shopware.yaml`:

```yaml
shopware:
  media:
    remote_thumbnails:
      enable: true   # default false
      pattern: '{mediaUrl}/{mediaPath}?width={width}&ts={mediaUpdatedAt}'   # default
```

2. Pattern variables: `mediaUrl` (public filesystem base URL, `shopware.filesystem.public`; empty when the media `path` is already absolute), `mediaPath` (e.g. `media/ab/cd/file.jpg`), `width`/`height` (from the folder's assigned `media_thumbnail_size` entries), `mediaUpdatedAt` (Unix timestamp of `updatedAt`, else `createdAt`, else empty — cache-buster).
3. Thumbnail URLs are produced only for public media in folders with assigned thumbnail sizes; a folder without sizes yields an empty thumbnail collection.
4. After switching an existing shop, run `bin/console media:delete-local-thumbnails` (only works while the feature is enabled; clears `media_thumbnail` rows, files and `media.thumbnails_ro`).
5. To customize URLs, subscribe to `ResolveRemoteThumbnailUrlExtension` (name `remote_thumbnail_url.resolve`) via the extension event mechanism: rewrite the URL, return `null` to skip a thumbnail, or inspect the `mediaEntity` property.
6. Fastly media invalidation (separate from `shopware.http_cache.reverse_proxy.fastly`, see [Reverse HTTP cache](platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md)):

```yaml
shopware:
  cdn:
    fastly:
      api_key: '%env(FASTLY_API_KEY)%'
      soft_purge: false
      max_parallel_invalidations: 2
```

A non-empty `api_key` (default `''`) activates purging; `BanMediaUrl` resolves affected URLs and `FastlyMediaReverseProxy` sends one purge request per URL; failures are logged at `critical`.

## Essential identifiers

- `shopware.media.remote_thumbnails.enable`, `shopware.media.remote_thumbnails.pattern`
- `Shopware\Core\Content\Media\Extension\ResolveRemoteThumbnailUrlExtension`
- `RemoteThumbnailLoader`, `MediaUrlLoader`, `MediaException::thumbnailGenerationDisabled()`
- `bin/console media:delete-local-thumbnails`, `bin/console media:generate-thumbnails`
- `shopware.cdn.fastly.api_key`, `shopware.cdn.fastly.soft_purge`, `shopware.cdn.fastly.max_parallel_invalidations`

## Gotchas

- `ThumbnailService` `generate()`, `updateThumbnails()`, `deleteThumbnails()` throw `MediaException::thumbnailGenerationDisabled()` (HTTP 400, code `CONTENT__MEDIA_THUMBNAIL_GENERATION_DISABLED`).
- Thumbnail message handlers ignore their messages, `MediaIndexer` early-returns (`media.thumbnails_ro` not maintained), `FileSaver` dispatches no `GenerateThumbnailsMessage`, `MediaDeletionSubscriber` skips thumbnail cleanup.
- `media:generate-thumbnails` returns `Command::FAILURE` ("Remote thumbnails are enabled. Skipping thumbnail generation.").
- Private media keeps its signed local URL.
- Synthesized `MediaThumbnailEntity` objects get a random UUID per request — do not rely on or join against `media_thumbnail.id`.
- `MediaUrlLoader` and `RemoteThumbnailLoader` are `@final`.
- The docs describe `shopware.media.remote_thumbnails.fallback_sizes` for folders without sizes; it does not exist in 6.7.13.0.
- `ResolveRemoteThumbnailUrlExtension::$mediaPath` and `$mediaUpdatedAt` are deprecated for v6.8.0; read from `mediaEntity`.

## Version notes

- Remote thumbnails since 6.6.4.0; `{mediaUpdatedAt}` since 6.6.5.0; `media:delete-local-thumbnails` since 6.6.6.0.
- `ResolveRemoteThumbnailUrlExtension` and indexer skip since 6.7.1.0; returning `null` since 6.7.3.0.

## Code check (6.7.13.0)
- absent `shopware.media.remote_thumbnails.fallback_sizes` — not defined in the media config tree or anywhere in installed code
- confirmed `remote_thumbnails.enable` — default false in core yaml — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:416
- confirmed `remote_thumbnails.pattern` — default matches docs — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:417
- confirmed `RemoteThumbnailLoader::load()` — folder without sizes yields empty collection — vendor/shopware/core/Content/Media/Core/Application/RemoteThumbnailLoader.php:55
- confirmed `ResolveRemoteThumbnailUrlExtension::NAME` — `remote_thumbnail_url.resolve` — vendor/shopware/core/Content/Media/Extension/ResolveRemoteThumbnailUrlExtension.php:20
- deprecated `ResolveRemoteThumbnailUrlExtension::$mediaPath` — removed in v6.8.0 — vendor/shopware/core/Content/Media/Extension/ResolveRemoteThumbnailUrlExtension.php:30
- corrected `MediaException::MEDIA_THUMBNAIL_GENERATION_DISABLED` — docs: error code MEDIA_THUMBNAIL_GENERATION_DISABLED — vendor/shopware/core/Content/Media/MediaException.php:64
- confirmed `media:delete-local-thumbnails` — command exists, requires feature enabled — vendor/shopware/core/Content/Media/Commands/DeleteThumbnailsCommand.php:17
- confirmed `media:generate-thumbnails` — returns FAILURE when enabled — vendor/shopware/core/Content/Media/Commands/GenerateThumbnailsCommand.php:27
- confirmed `fastly.api_key` — default empty string — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:204
