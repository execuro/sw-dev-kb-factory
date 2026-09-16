---
id: platform/dev/6.6/guides/plugins/plugins/content/media/prevent-deletion-of-media-files-referenced-in-your-plugins.md
title: Prevent Deletion of Media Files Referenced in your Plugins
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/media/prevent-deletion-of-media-files-referenced-in-your-plugins.html
sourceHash: 9dc1f3be32401415229825e295b7e1e3255697d4
keywords: ["UnusedMediaPurger", "UnusedMediaSearchEvent", "media:delete-unused", "getUnusedIds", "markAsUsed", "kernel.event_subscriber", "media deletion", "unused media", "CMS entities", "media reference"]
summary: "Subscribe to UnusedMediaSearchEvent and call markAsUsed to stop the media:delete-unused command deleting referenced media."
lastBuilt: "2026-09-15"
---
## What it is

This guide (available since Shopware 6.5.1.0) describes how to prevent the CLI `media:delete-unused` command from deleting Media entities that a plugin references without a foreign key, such as Media IDs stored inside a JSON blob.

## When to use

Use this when a plugin stores Media ID references in a way that cannot be resolved via standard foreign keys (e.g. nested JSON configuration, similar to how CMS entities store JSON blobs referencing Media IDs).

## Key steps / config

1. `\Shopware\Core\Content\Media\UnusedMediaPurger` first finds Media entities with no foreign-key references, then dispatches `\Shopware\Core\Content\Media\Event\UnusedMediaSearchEvent` (possibly multiple times, in batches) with the candidate Media IDs.
2. Register a subscriber for `UnusedMediaSearchEvent`; read the candidate IDs via `$event->getUnusedIds()`.
3. Cross-reference the IDs against the plugin's own storage, then call `$event->markAsUsed($usedIds)` (accepts an array of string IDs) to exclude them from deletion.
4. Register the subscriber with the tag `kernel.event_subscriber`:

```xml
<service id="Swag\BasicExample\Subscriber\UnusedMediaSubscriber">
    <tag name="kernel.event_subscriber"/>
</service>
```

## Essential identifiers

- `\Shopware\Core\Content\Media\UnusedMediaPurger`
- `\Shopware\Core\Content\Media\Event\UnusedMediaSearchEvent`
- `getUnusedIds()`, `markAsUsed(array $ids)`
- `kernel.event_subscriber` (service tag)

## Version notes

The prevent-deletion extension point via `UnusedMediaSearchEvent` is available since Shopware 6.5.1.0.
