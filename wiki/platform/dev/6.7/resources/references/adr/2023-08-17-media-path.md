---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2023-08-17-media-path.md
sourceHash: 3acd3f1d73247d8a91fe9d1404164a95d7d47b1a
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-08-17-media-path.html
title: Media path rewrite
version: "6.7"
versions: ["6.7"]
keywords: ["media path", "media url", "AbstractMediaUrlGenerator", "AbstractMediaPathStrategy", "UrlParams", "UrlParams::fromMedia", "UrlParams::fromThumbnail", "MediaEntity::$path", "MediaUrlLoader", "media.loaded", "cache buster", "path strategy", "thumbnail url", "cdn"]
summary: "ADR: media/thumbnail paths are stored on the entity at upload; URLs come from AbstractMediaUrlGenerator::generate() with UrlParams, no DAL entity needed."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2023-08-17, area core) that replaces the old pathname-strategy/URL-generator pair for media files. The relative file path is now stored on the media and thumbnail entity at upload time, and absolute URLs are built by a new, entity-independent URL generator.

## When to use

Read this when you generate media or thumbnail URLs in a plugin, write a custom media path strategy, sync media to external storage (e.g. S3/CDN) without uploading through Shopware, or migrate pre-6.6 code that used the old media URL generator.

## Key steps / config

Problems with the old design: strategy and URL generator depended on the DAL and needed fully loaded entities; uploads had to go through Shopware so file system and URL structures matched; changing the strategy after uploads broke URLs (files were never moved); the "uploaded-at" cache buster in the path changed the URL whenever a file was replaced, breaking URLs embedded statically in the CMS.

Decision, as implemented:

- The file path is saved on the media entity (`MediaEntity::$path`) and the thumbnail (`MediaThumbnailEntity::$path`) on upload, so URL generation no longer consults a possibly changed strategy.
- The path can be set/changed via API and written directly when creating the entity — files can be synced with external storage and only the path is adjusted.
- Paths are generated from location structs (`MediaLocationStruct`, `ThumbnailLocationStruct`, built by `MediaLocationBuilder`) by a strategy extending `Shopware\Core\Content\Media\Core\Application\AbstractMediaPathStrategy` (abstract `name()`; `generate(array $locations)` returns id to path such as `media/0a/test.jpg`).
- URLs come from `Shopware\Core\Content\Media\Core\Application\AbstractMediaUrlGenerator::generate(array $paths)` with `Shopware\Core\Content\Media\Core\Params\UrlParams` values indexed by id; the result is a flat id to absolute URL map for media and thumbnails alike.
- Cache busting moved to a query parameter with the entity's updated-at timestamp (`?ts=`), so the path stays stable when the file is replaced; metadata changes also change the URL.

```php
$relative = $media->getPath();
$params = [];
foreach ($collection as $media) {
    $params[$media->getId()] = UrlParams::fromMedia($media);
    foreach ($media->getThumbnails() as $thumbnail) {
        $params[$thumbnail->getId()] = UrlParams::fromThumbnail($thumbnail);
    }
}
$urls = $this->generator->generate($params); // AbstractMediaUrlGenerator
```

`MediaUrlLoader::loaded()` applies the generated URLs to loaded entities; it can be triggered via the `media.loaded` event.

## Essential identifiers

- `Shopware\Core\Content\Media\Core\Application\AbstractMediaUrlGenerator`
- `Shopware\Core\Content\Media\Core\Application\AbstractMediaPathStrategy`
- `Shopware\Core\Content\Media\Core\Params\UrlParams` (`fromMedia()`, `fromThumbnail()`)
- `MediaEntity::$path`, `MediaThumbnailEntity::$path`, `getPath()`
- `MediaLocationBuilder`, `MediaUrlLoader`, `media.loaded`

## Gotchas

- `UrlParams::fromMedia()`/`fromThumbnail()` read only `path`, `updatedAt`/`createdAt` (and `mimeType` for media) from any `Entity` — partial entity loading is enough.
- The ADR's batch example passes `$paths` to `generate()` after filling `$params`, and its thumbnail example calls `UrlParams::fromMedia($media)`; use the array you built and `fromThumbnail()` for thumbnails.

## Version notes

- Before 6.6.0 the old URL generator (old strategy) was used; from 6.6.0 URLs are built from `MediaEntity::$path`. Project-specific strategies had to be migrated by 6.6.0.
- The old `UrlGeneratorInterface` and `PathnameStrategyInterface` are gone in 6.7, as is the transitional `BCStrategy` the ADR promised; the ADR's `Feature::isActive('v6.6.0.0')` branching is only relevant to 6.5 code.

## Code check (6.7.15.1)
- absent `Shopware\Core\Content\Media\Pathname\PathnameStrategy\PathnameStrategyInterface` — old strategy interface removed
- absent `Shopware\Core\Content\Media\Pathname\UrlGeneratorInterface` — old URL generator interface removed
- absent `BCStrategy` — BC strategy promised by the ADR not found in the installed code
- confirmed `AbstractMediaUrlGenerator::generate()` — abstract, id-indexed `UrlParams` to absolute URLs — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaUrlGenerator.php:27
- confirmed `UrlParams::fromMedia()` — builds params from any entity's `path`/`updatedAt` — vendor/shopware/core/Content/Media/Core/Params/UrlParams.php:21
- confirmed `UrlParams::fromThumbnail()` — thumbnail variant — vendor/shopware/core/Content/Media/Core/Params/UrlParams.php:32
- confirmed `AbstractMediaPathStrategy::name()` — abstract unique strategy name — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaPathStrategy.php:66
- confirmed `MediaEntity::$path` — stored relative path — vendor/shopware/core/Content/Media/MediaEntity.php:115
- confirmed `MediaUrlLoader::loaded()` — assigns generated URLs, usable via `media.loaded` — vendor/shopware/core/Content/Media/Core/Application/MediaUrlLoader.php:38
- confirmed `?ts=` — default generator appends the updated-at timestamp as query parameter — vendor/shopware/core/Content/Media/Infrastructure/Path/MediaUrlGenerator.php:37
