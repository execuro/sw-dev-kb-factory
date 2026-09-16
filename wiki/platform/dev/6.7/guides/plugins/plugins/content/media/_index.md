---
id: platform/dev/6.7/guides/plugins/plugins/content/media/_index.md
title: Media
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/media/
sourceHash: 8f4001b13251a15264cde70869ac1de128113468
codeCheckedAgainst: "6.7.13.0"
keywords: ["media", "media:delete-unused", "UnusedMediaSearchEvent", "MediaFileExtensionWhitelistEvent", "shopware.filesystem.allowed_extensions", "shopware.media.remote_thumbnails", "shopware.media_type.detector", "file extension", "thumbnails", "unused media cleanup", "media plugin extension"]
summary: "Index of plugin guides extending Shopware media - protecting media from media:delete-unused, custom file extensions, remote thumbnail generation."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/content/media/prevent-deletion-of-media-files-referenced-in-your-plugins.md", "platform/dev/6.7/guides/plugins/plugins/content/media/add-custom-file-extension.md", "platform/dev/6.7/guides/plugins/plugins/content/media/remote-thumbnail-generation.md"]
---
## What it is

Section overview for the Shopware media subsystem from a plugin developer's perspective. The media subsystem can be extended by plugins in several ways; this page lists the guides for the common extension points.

## When to use

Start here when a plugin stores references to media, needs to upload file types Shopware does not accept by default, or should use thumbnails generated outside Shopware.

## Key steps / config

Pick the guide matching the task:

- [Prevent Deletion of Media Files Referenced in your Plugins](platform/dev/6.7/guides/plugins/plugins/content/media/prevent-deletion-of-media-files-referenced-in-your-plugins.md) — keep media referenced by your plugin from being removed by the `media:delete-unused` command when the reference is not a foreign key. The installed core dispatches `UnusedMediaSearchEvent` during that search.
- [Add Custom Media File Extension](platform/dev/6.7/guides/plugins/plugins/content/media/add-custom-file-extension.md) — allow additional file extensions and map them to the correct media type. In the installed core, allowed extensions come from `shopware.filesystem.allowed_extensions` and can be changed via `MediaFileExtensionWhitelistEvent`; media type detectors are tagged `shopware.media_type.detector`.
- [Remote Thumbnail Generation](platform/dev/6.7/guides/plugins/plugins/content/media/remote-thumbnail-generation.md) — use externally generated thumbnails instead of local thumbnail generation, configured under `shopware.media.remote_thumbnails` (`enable`, `pattern`).

## Essential identifiers

- `media:delete-unused`
- `Shopware\Core\Content\Media\Event\UnusedMediaSearchEvent`
- `Shopware\Core\Content\Media\Event\MediaFileExtensionWhitelistEvent`
- `shopware.filesystem.allowed_extensions`
- `shopware.media.remote_thumbnails.enable`, `shopware.media.remote_thumbnails.pattern`
- `shopware.media_type.detector`

## Code check (6.7.13.0)
- confirmed `media:delete-unused` — console command name — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:22
- confirmed `UnusedMediaSearchEvent` — event class exists — vendor/shopware/core/Content/Media/Event/UnusedMediaSearchEvent.php:13
- confirmed `MediaFileExtensionWhitelistEvent` — event class exists — vendor/shopware/core/Content/Media/Event/MediaFileExtensionWhitelistEvent.php:13
- confirmed `shopware.filesystem.allowed_extensions` — parameter injected into media services — vendor/shopware/core/Content/DependencyInjection/media.xml:359
- confirmed `shopware.media.remote_thumbnails.enable` — parameter injected into media services — vendor/shopware/core/Content/DependencyInjection/media.xml:58
- confirmed `shopware.media.remote_thumbnails.pattern` — parameter injected into media path services — vendor/shopware/core/Content/DependencyInjection/media_path.xml:22
- confirmed `shopware.media_type.detector` — tag on core type detectors — vendor/shopware/core/Content/DependencyInjection/media.xml:243
