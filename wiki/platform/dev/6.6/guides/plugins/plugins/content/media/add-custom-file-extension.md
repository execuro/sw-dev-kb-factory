---
id: platform/dev/6.6/guides/plugins/plugins/content/media/add-custom-file-extension.md
title: Add custom media extension
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/media/add-custom-file-extension.html
sourceHash: ba4a44f79f80d8ff1650880031388b23843cb538
keywords: ["MediaFileExtensionWhitelistEvent", "TypeDetector", "TypeDetectorInterface", "ImageType", "DefaultTypeDetector", "shopware.media_type.detector", "media file extension", "whitelist", "getWhitelist", "setWhitelist", "media upload"]
summary: "Add a new allowed media file extension via MediaFileExtensionWhitelistEvent and recognize it with a custom TypeDetector."
lastBuilt: "2026-09-15"
---
## What it is

This guide explains how to allow uploading a new media file extension in Shopware, and how to make Shopware recognize which media type (image, video, document) that extension belongs to.

## When to use

Use this when the Media module rejects an upload because the file extension is not whitelisted, or when a newly whitelisted extension needs to be classified as a specific media type (e.g. image) instead of falling back to generic detection.

## Key steps / config

1. Whitelist the extension by subscribing to `MediaFileExtensionWhitelistEvent`, reading the current list with `$event->getWhitelist()`, appending the extension, and writing it back with `$event->setWhitelist($whiteList)`.
2. To classify the extension, implement `TypeDetectorInterface` with a `detect(MediaFile $mediaFile, ?MediaType $previouslyDetectedType): ?MediaType` method that checks the file extension and returns/augments a `MediaType` (e.g. `ImageType`), falling back to `$previouslyDetectedType` when the extension does not match.
3. Register the type detector service with the tag `shopware.media_type.detector` (with a `priority` attribute):

```xml
<service id="Swag\BasicExample\Core\Content\Media\TypeDetector\CustomImageTypeDetector">
    <tag name="shopware.media_type.detector" priority="10"/>
</service>
```

## Essential identifiers

- `Shopware\Core\Content\Media\Event\MediaFileExtensionWhitelistEvent`
- `Shopware\Core\Content\Media\TypeDetector\TypeDetectorInterface`
- `Shopware\Core\Content\Media\MediaType\ImageType`
- `shopware.media_type.detector` (service tag)

## Gotchas

Returning `null`/the unchanged `$previouslyDetectedType` when the extension does not match preserves detection results from other detectors (e.g. `DefaultTypeDetector`), which typically inspects the file's MIME type.
