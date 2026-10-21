---
id: platform/dev/6.7/guides/plugins/plugins/content/media/add-custom-file-extension.md
title: Add Custom Media File Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/media/add-custom-file-extension.html
sourceHash: 661adca5cf1a3ec4d840927346f6a4d065e5a20a
codeCheckedAgainst: "6.7.15.1"
keywords: ["MediaFileExtensionWhitelistEvent", "TypeDetectorInterface", "shopware.media_type.detector", "shopware.filesystem.allowed_extensions", "shopware.filesystem.private_allowed_extensions", "ImageType", "MediaType", "DefaultTypeDetector", "file extension allowlist", "whitelist", "media upload", "custom file type"]
summary: Allow a new media file extension via MediaFileExtensionWhitelistEvent and map it to a MediaType with a TypeDetectorInterface tagged service.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How a plugin lets the Administration Media module accept an extra file extension, and how it tells Shopware which media type (image, video, document, ...) files with that extension are.

## When to use

When uploads of a file type are rejected because its extension is not in the allowlist, or when an allowed extension is not recognised as the right media type (e.g. a new image format that should get image handling). Prerequisites: [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md), [dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md), [listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md).

## Key steps / config

### 1. Allow the extension

Subscribe to `Shopware\Core\Content\Media\Event\MediaFileExtensionWhitelistEvent`; read the plain array of extensions with `getWhitelist()`, append, write back with `setWhitelist()`:

```php
public static function getSubscribedEvents(): array
{
    return [MediaFileExtensionWhitelistEvent::class => 'addEntryToFileExtensionWhitelist'];
}
public function addEntryToFileExtensionWhitelist(MediaFileExtensionWhitelistEvent $event): void
{
    $whiteList = $event->getWhitelist();
    $whiteList[] = 'img';
    $event->setWhitelist($whiteList);
}
```

### 2. Recognise the type

Implement `Shopware\Core\Content\Media\TypeDetector\TypeDetectorInterface`:

```php
class CustomImageTypeDetector implements TypeDetectorInterface
{
    protected const SUPPORTED_FILE_EXTENSIONS = ['img' => [ImageType::TRANSPARENT]];

    public function detect(MediaFile $mediaFile, ?MediaType $previouslyDetectedType): ?MediaType
    {
        // extension not ours: return $previouslyDetectedType;
        // else: $previouslyDetectedType ??= new ImageType(); addFlags(...); return it
    }
}
```

Register it with the tag `shopware.media_type.detector`:

```php
$services->set(CustomImageTypeDetector::class)
    ->tag('shopware.media_type.detector', ['priority' => 10]);
```

Use `mb_strtolower($mediaFile->getFileExtension())` to compare extensions. Add the appropriate flags (`ImageType::TRANSPARENT`, `ImageType::ANIMATED`, `ImageType::VECTOR_GRAPHIC`).

### Public vs private allowlists

| Allowlist | Parameter |
|---|---|
| Public (URL-accessible media) | `shopware.filesystem.allowed_extensions` |
| Private (e.g. digital downloads, documents) | `shopware.filesystem.private_allowed_extensions` |

The event is dispatched with one of the two lists, depending on whether the upload is private; one subscriber covers both.

### Media types

`Shopware\Core\Content\Media\MediaType\` `ImageType` (thumbnails; flags `transparent`, `animated`, `vectorGraphic`), `VideoType`, `AudioType`, `DocumentType`, `SpatialObjectType` (e.g. GLB), `BinaryType` (fallback).

## Essential identifiers

- `Shopware\Core\Content\Media\Event\MediaFileExtensionWhitelistEvent` (`getWhitelist()`, `setWhitelist()`)
- `Shopware\Core\Content\Media\TypeDetector\TypeDetectorInterface::detect()`
- `shopware.media_type.detector`
- `shopware.filesystem.allowed_extensions`, `shopware.filesystem.private_allowed_extensions`
- `Shopware\Core\Content\Media\MediaType\ImageType`, `Shopware\Core\Content\Media\File\MediaFile`

## Gotchas

- `TypeDetector` passes each tagged detector's result into the next detector as `$previouslyDetectedType`; return it unchanged for extensions you do not handle. Core detectors (`ImageTypeDetector`, `VideoTypeDetector`, etc.) use priority 10, `DefaultTypeDetector` (MIME-type based) priority 0.
- Allowing an extension alone does not make Shopware treat the file as an image/video/document; the type detector is needed for that.
- The source links an event location in `FileSaver.php` from v6.4; in 6.7.15.1 the event is dispatched by `MediaFileExtensionListProvider::getAllowedExtensions()`.
- Browsers do not play all video/audio formats; the Administration warns about formats such as MOV, AVI, WMV, FLAC, AAC, WMA.

## Code check (6.7.15.1)
- confirmed `MediaFileExtensionWhitelistEvent::getWhitelist()` — returns the extension array — vendor/shopware/core/Content/Media/Event/MediaFileExtensionWhitelistEvent.php:50
- confirmed `MediaFileExtensionWhitelistEvent::setWhitelist()` — replaces the extension array — vendor/shopware/core/Content/Media/Event/MediaFileExtensionWhitelistEvent.php:58
- corrected `MediaFileExtensionWhitelistEvent` — docs: dispatched in FileSaver.php (v6.4 link); now dispatched with private or public list — vendor/shopware/core/Content/Media/Upload/MediaFileExtensionListProvider.php:33
- confirmed `TypeDetectorInterface::detect()` — only required member — vendor/shopware/core/Content/Media/TypeDetector/TypeDetectorInterface.php:12
- confirmed `shopware.media_type.detector` — core detectors tagged priority 10 — vendor/shopware/core/Content/DependencyInjection/media.php:364
- confirmed `DefaultTypeDetector` — tagged priority 0 — vendor/shopware/core/Content/DependencyInjection/media.php:366
- confirmed `TypeDetector::detect()` — chains detectors passing previous result — vendor/shopware/core/Content/Media/TypeDetector/TypeDetector.php:25
- confirmed `ImageType::TRANSPARENT` — flag value `transparent` — vendor/shopware/core/Content/Media/MediaType/ImageType.php:11
- confirmed `shopware.filesystem.allowed_extensions` — parameter injected into media services — vendor/shopware/core/Content/DependencyInjection/media.php:483
- confirmed `shopware.filesystem.private_allowed_extensions` — parameter injected into media services — vendor/shopware/core/Content/DependencyInjection/media.php:484
