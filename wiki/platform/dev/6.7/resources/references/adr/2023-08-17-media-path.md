---
id: platform/dev/6.7/resources/references/adr/2023-08-17-media-path.md
title: Media path rewrite
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-08-17-media-path.html
sourceHash: 3acd3f1d73247d8a91fe9d1404164a95d7d47b1a
codeCheckedAgainst: "6.7.13.0"
keywords: ["media path", "media url", "AbstractMediaUrlGenerator", "UrlParams", "AbstractMediaPathStrategy", "MediaEntity::$path", "MediaLocationBuilder", "MediaPathUpdater", "path strategy", "cache busting", "thumbnail url", "external storage"]
summary: "ADR: media/thumbnail path stored on the entity at upload; URLs built without DAL via AbstractMediaUrlGenerator and UrlParams, with ?ts= cache busting."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (area `core`, 2023-08-17) replacing entity-bound pathname strategies and URL generators with a stored file path on media and thumbnail entities plus a DAL-independent URL generator.

## When to use

Read this when generating media or thumbnail URLs in PHP, writing a custom media path strategy, importing media whose files already live on external storage (e.g. an S3 CDN), or migrating code that used the pre-6.6 URL generator.

## Key steps / config

Problems with the old design: strategy and URL generator required fully loaded DAL entities; uploads had to go through Shopware so file-system folders and URLs matched; changing the strategy after uploads broke URLs (files are never moved); the "uploaded-at" cache buster in the path changed the path on file replacement, breaking URLs statically embedded in CMS content.

Decisions:

1. The relative file path is saved on the media entity (and thumbnail) at upload time — URL generation no longer consults the strategy.
2. The path can be written via API or set when creating the entity, so files synchronised with external storage only need the entity path adjusted.
3. Path generation uses location structs (built by a service) instead of entities. In 6.7.13.0: `Shopware\Core\Content\Media\Core\Application\MediaLocationBuilder` builds locations, `MediaPathUpdater` writes paths, and strategies extend `Shopware\Core\Content\Media\Core\Application\AbstractMediaPathStrategy` (abstract `name(): string`; `generate(array $locations)` returns id => path such as `media/0a/test.jpg`).
4. URLs come from `Shopware\Core\Content\Media\Core\Application\AbstractMediaUrlGenerator::generate(array $paths): array`, fed with `Shopware\Core\Content\Media\Core\Params\UrlParams` — no fully loaded entities needed; batch calls return a flat `{id} => {url}` list for media and thumbnails.
5. New cache busting: the entity's updated-at timestamp is appended as a query parameter (`?ts=<timestamp>`), so the path stays stable when the file is replaced.

Usage after the change:

```php
$relative = $media->getPath();            // also $thumbnail->getPath()
$params = [
    $media->getId() => UrlParams::fromMedia($media),
    $thumbnail->getId() => UrlParams::fromThumbnail($thumbnail),
];
$urls = $this->generator->generate($params); // AbstractMediaUrlGenerator
```

## Essential identifiers

- `Shopware\Core\Content\Media\Core\Application\AbstractMediaUrlGenerator`
- `Shopware\Core\Content\Media\Core\Params\UrlParams` (`fromMedia()`, `fromThumbnail()`)
- `Shopware\Core\Content\Media\Core\Application\AbstractMediaPathStrategy`
- `Shopware\Core\Content\Media\Core\Application\MediaLocationBuilder`, `MediaPathUpdater`
- `MediaEntity::$path`, `MediaThumbnailEntity::$path`

## Gotchas

- The old `Shopware\Core\Content\Media\Pathname\PathnameStrategy\PathnameStrategyInterface` and `Shopware\Core\Content\Media\Pathname\UrlGeneratorInterface` (with `getRelativeMediaUrl()`, `getAbsoluteThumbnailUrl()` etc.) are not in the installed code — migrate to `AbstractMediaUrlGenerator` / `AbstractMediaPathStrategy`.
- The source's batch example passes `$paths` to `generate()` after building `$params`; pass the array of `UrlParams` you built.
- Path strategies still include the upload timestamp as a path segment (`cacheBuster()` uses `uploadedAt`); only URL cache busting moved to `?ts=`.

## Version notes

- Before 6.6.0 the old URL generator and strategy were used; an entity-loaded subscriber filled `MediaEntity::$path` at runtime for forward compatibility, and code could branch on `Feature::isActive('v6.6.0.0')`.
- From 6.6.0 URLs are generated from `MediaEntity::$path`; project-specific strategies had to be migrated by 6.6.0. The ADR promised a `BCStrategy` converting new to old format; it is not present in 6.7.13.0.

## Code check (6.7.13.0)
- absent `Shopware\Core\Content\Media\Pathname\PathnameStrategy\PathnameStrategyInterface` — removed; replaced by `AbstractMediaPathStrategy`
- absent `Shopware\Core\Content\Media\Pathname\UrlGeneratorInterface` — removed; replaced by `AbstractMediaUrlGenerator`
- absent `BCStrategy` — not found in installed core or storefront
- confirmed `AbstractMediaUrlGenerator::generate()` — abstract, takes array of params, returns URLs — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaUrlGenerator.php:27
- confirmed `UrlParams::fromMedia()` — static factory, also `fromThumbnail()` at line 32 — vendor/shopware/core/Content/Media/Core/Params/UrlParams.php:21
- confirmed `MediaEntity::$path` — nullable stored path property — vendor/shopware/core/Content/Media/MediaEntity.php:115
- confirmed `MediaThumbnailEntity::$path` — thumbnail stores its own path — vendor/shopware/core/Content/Media/Aggregate/MediaThumbnail/MediaThumbnailEntity.php:19
- confirmed `AbstractMediaPathStrategy::name()` — only abstract member of the strategy base — vendor/shopware/core/Content/Media/Core/Application/AbstractMediaPathStrategy.php:58
- confirmed `?ts=` — updated-at timestamp appended as query parameter — vendor/shopware/core/Content/Media/Infrastructure/Path/MediaUrlGenerator.php:37
- confirmed `MediaLocationBuilder` — interface for building location structs — vendor/shopware/core/Content/Media/Core/Application/MediaLocationBuilder.php:13
