---
id: platform/dev/6.7/guides/plugins/plugins/content/media/add-custom-file-extension.md
title: Add Custom Media File Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/media/add-custom-file-extension.html
sourceHash: 661adca5cf1a3ec4d840927346f6a4d065e5a20a
codeCheckedAgainst: "6.7.13.0"
keywords: ["MediaFileExtensionWhitelistEvent", "TypeDetectorInterface", "shopware.media_type.detector", "shopware.filesystem.allowed_extensions", "shopware.filesystem.private_allowed_extensions", "ImageType", "MediaType", "DefaultTypeDetector", "file extension allowlist", "media upload", "custom file type", "type detector"]
summary: Allow new media upload extensions via MediaFileExtensionWhitelistEvent and map them to a MediaType with a tagged TypeDetectorInterface service.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How a plugin extends the set of file extensions the Administration Media module accepts for upload, and how it tells Shopware which media type (image, video, document, ...) a new extension represents.

## When to use

- An upload of a file type (e.g. `.img`) is rejected because its extension is not on the allowlist.
- A newly allowed extension should be handled as an image (thumbnails, flags) or another specific media type instead of a generic binary.

## Key steps / config

1. **Allow the extension.** Register an event subscriber (tag `kernel.event_subscriber`) for `Shopware\Core\Content\Media\Event\MediaFileExtensionWhitelistEvent`. Read the current list with `getWhitelist()` (plain array of extensions), append yours, write it back with `setWhitelist()`:

```php
public function addEntryToFileExtensionWhitelist(MediaFileExtensionWhitelistEvent $event): void
{
    $whiteList = $event->getWhitelist();
    $whiteList[] = 'img';
    $event->setWhitelist($whiteList);
}
```

2. **Detect the type.** Implement `Shopware\Core\Content\Media\TypeDetector\TypeDetectorInterface` — its only member is `detect()`. Return `$previouslyDetectedType` unchanged for extensions you do not handle; otherwise return (or create) the matching `MediaType` and add flags:

```php
class CustomImageTypeDetector implements TypeDetectorInterface
{
    public function detect(MediaFile $mediaFile, ?MediaType $previouslyDetectedType): ?MediaType
    {
        if (mb_strtolower($mediaFile->getFileExtension()) !== 'img') {
            return $previouslyDetectedType;
        }
        $previouslyDetectedType ??= new ImageType();
        return $previouslyDetectedType->addFlags([ImageType::TRANSPARENT]);
    }
}
```

3. **Register the detector** with tag `shopware.media_type.detector` (the guide uses `['priority' => 10]`, the same priority the core Image/Video/Audio/Document/SpatialObject detectors use; `DefaultTypeDetector` sits at `0`).

### Public vs private allowlists

| Allowlist | Config parameter |
|---|---|
| Public (URL-accessible media) | `shopware.filesystem.allowed_extensions` |
| Private (digital downloads, documents) | `shopware.filesystem.private_allowed_extensions` |

The event is dispatched with the list matching the upload context, so one subscriber covers both.

### Media types

`ImageType` (flags `transparent`, `animated`, `vectorGraphic`), `VideoType`, `AudioType`, `DocumentType`, `SpatialObjectType`, `BinaryType` (fallback) — all in `Shopware\Core\Content\Media\MediaType`.

## Essential identifiers

- `Shopware\Core\Content\Media\Event\MediaFileExtensionWhitelistEvent` — `getWhitelist()`, `setWhitelist()`
- `Shopware\Core\Content\Media\TypeDetector\TypeDetectorInterface::detect()`
- Tag `shopware.media_type.detector`
- `Shopware\Core\Content\Media\MediaType\ImageType::TRANSPARENT`
- `shopware.filesystem.allowed_extensions`, `shopware.filesystem.private_allowed_extensions`

## Gotchas

- Adding an extension to the allowlist alone does not make Shopware recognise its type; without a detector the result depends on MIME-type analysis by `DefaultTypeDetector`.
- Browsers do not play every video/audio format; the Administration warns about e.g. MOV, AVI, WMV, FLAC, AAC, WMA.
- In 6.7.13.0 the event is constructed with a `Context`; not passing one is deprecated for v6.8.0 (relevant only if you dispatch the event yourself).

## Code check (6.7.13.0)
- confirmed `MediaFileExtensionWhitelistEvent::getWhitelist()` — returns the extension array — vendor/shopware/core/Content/Media/Event/MediaFileExtensionWhitelistEvent.php:50
- confirmed `MediaFileExtensionWhitelistEvent::setWhitelist()` — replaces the array — vendor/shopware/core/Content/Media/Event/MediaFileExtensionWhitelistEvent.php:58
- confirmed `MediaFileExtensionWhitelistEvent` — dispatched with private or public list plus Context — vendor/shopware/core/Content/Media/Upload/MediaFileExtensionListProvider.php:33
- confirmed `TypeDetectorInterface::detect()` — single required member, signature matches docs — vendor/shopware/core/Content/Media/TypeDetector/TypeDetectorInterface.php:12
- confirmed `shopware.media_type.detector` — tagged_iterator consumed by TypeDetector — vendor/shopware/core/Content/DependencyInjection/media.xml:267
- confirmed `DefaultTypeDetector` — registered with priority 0, others at 10 — vendor/shopware/core/Content/DependencyInjection/media.xml:246
- confirmed `shopware.filesystem.allowed_extensions` — default public list — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:194
- confirmed `shopware.filesystem.private_allowed_extensions` — default private list — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:195
- confirmed `ImageType::TRANSPARENT` — flag constant `transparent` — vendor/shopware/core/Content/Media/MediaType/ImageType.php:11
- confirmed `MediaType::addFlags()` — adds flags, returns self — vendor/shopware/core/Content/Media/MediaType/MediaType.php:40
