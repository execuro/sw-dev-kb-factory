---
id: platform/dev/6.7/guides/plugins/plugins/content/media/_index.md
title: Media
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/media/
sourceHash: 8f4001b13251a15264cde70869ac1de128113468
codeCheckedAgainst: "6.7.15.1"
keywords: ["media", "media:delete-unused", "unused media", "file extension", "allowlist", "MediaFileExtensionWhitelistEvent", "shopware.media_type.detector", "media type", "thumbnails", "remote thumbnail generation", "plugin"]
summary: "Index of Shopware 6.7 plugin media guides - protecting media from media:delete-unused, custom file extensions, remote thumbnail generation."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/content/media/prevent-deletion-of-media-files-referenced-in-your-plugins.md", "platform/dev/6.7/guides/plugins/plugins/content/media/add-custom-file-extension.md", "platform/dev/6.7/guides/plugins/plugins/content/media/remote-thumbnail-generation.md"]
---
## What it is

Section index for the guides on extending the Shopware media subsystem from a plugin.

## When to use

Pick the child guide matching the extension point:

- [Prevent Deletion of Media Files Referenced in your Plugins](platform/dev/6.7/guides/plugins/plugins/content/media/prevent-deletion-of-media-files-referenced-in-your-plugins.md) - keep media your plugin references (without foreign keys) from being removed by the `media:delete-unused` command.
- [Add Custom Media File Extension](platform/dev/6.7/guides/plugins/plugins/content/media/add-custom-file-extension.md) - allow additional file extensions (via `MediaFileExtensionWhitelistEvent`) and map them to the correct media type (type detectors tagged `shopware.media_type.detector`).
- [Remote Thumbnail Generation](platform/dev/6.7/guides/plugins/plugins/content/media/remote-thumbnail-generation.md) - use externally generated thumbnails instead of local thumbnail generation.

## Essential identifiers

- `media:delete-unused`
- `Shopware\Core\Content\Media\Event\MediaFileExtensionWhitelistEvent`
- `shopware.media_type.detector`

## Code check (6.7.15.1)
- confirmed `media:delete-unused` — console command name of DeleteNotUsedMediaCommand — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:23
- confirmed `MediaFileExtensionWhitelistEvent` — event class for the extension allowlist — vendor/shopware/core/Content/Media/Event/MediaFileExtensionWhitelistEvent.php:13
- confirmed `shopware.media_type.detector` — tag collected by TypeDetector — vendor/shopware/core/Content/DependencyInjection/media.php:383
