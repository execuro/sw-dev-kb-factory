---
id: platform/dev/6.6/resources/references/adr/2023-08-17-media-path.md
title: Media path rewrite
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-08-17-media-path.html"
sourceHash: "3acd3f1d73247d8a91fe9d1404164a95d7d47b1a"
keywords: ["media path", "PathnameStrategyInterface", "UrlGeneratorInterface", "AbstractMediaUrlGenerator", "MediaEntity::$path", "cache busting", "UrlParams", "BCStrategy", "Feature::isActive", "media.loaded"]
summary: "ADR: media file paths are now stored directly on MediaEntity, generated via a DAL-independent AbstractMediaUrlGenerator instead of per-request strategy lookups."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record reworking how media file paths and URLs are generated, storing the path directly on the media entity instead of recomputing it from a configurable strategy on every load.

## When to use
Relevant when working with media URL generation, custom `PathnameStrategyInterface` implementations, or migrating code that calls `UrlGeneratorInterface`.

## Key steps / config
- The file path is now saved directly on the media entity (and thumbnail) at upload time, avoiding a strategy lookup at URL-generation time.
- The file path can be changed via the API and written directly on entity creation, enabling sync with external storage.
- New location structs (created via a service) generate the path without a DAL dependency.
- A new service generates URLs without needing fully loaded entities.
- New cache-busting uses the media entity's updated-at timestamp as a query parameter instead of embedding it in the path.

Old interfaces being replaced:
```php
interface UrlGeneratorInterface {
    public function getAbsoluteMediaUrl(MediaEntity $media): string;
    public function getRelativeMediaUrl(MediaEntity $media): string;
}
interface PathnameStrategyInterface {
    public function getName(): string;
    public function generatePathHash(MediaEntity $media, ?MediaThumbnailEntity $thumbnail = null): ?string;
}
```
New usage: `$this->generator->generate([UrlParams::fromMedia($media)])`, returning a flat id-to-url list; relative path is read via `$media->getPath()`.

## Essential identifiers
- `Shopware\Core\Content\Media\Pathname\PathnameStrategyInterface`
- `Shopware\Core\Content\Media\Pathname\UrlGeneratorInterface`
- `Shopware\Core\Content\Media\Core\Application\AbstractMediaUrlGenerator`
- `Shopware\Core\Content\Media\Core\Params\UrlParams`
- `MediaEntity::$path`
- `BCStrategy`
- `Feature::isActive('v6.6.0.0')`

## Gotchas
Until 6.6.0 the old URL generator (based on the configured strategy) is still used; from 6.6.0 the new generator based on `MediaEntity::$path` takes over. Project-specific strategies must be migrated to the new pattern by 6.6.0; a `BCStrategy` converts the new format to the old one. An entity-loaded subscriber keeps `MediaEntity::$path` populated at runtime for forward compatibility during the transition.

## Version notes
The switch to `MediaEntity::$path`-based URL generation happens at 6.6.0; code can branch on `Feature::isActive('v6.6.0.0')` during the transition period.
