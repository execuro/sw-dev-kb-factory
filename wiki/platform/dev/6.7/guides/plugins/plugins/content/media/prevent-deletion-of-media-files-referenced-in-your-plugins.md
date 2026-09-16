---
id: platform/dev/6.7/guides/plugins/plugins/content/media/prevent-deletion-of-media-files-referenced-in-your-plugins.md
title: Prevent Deletion of Media Files Referenced in Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/media/prevent-deletion-of-media-files-referenced-in-your-plugins.html
sourceHash: 279d4c8a7ea17960680b251797da3fa22997dc39
codeCheckedAgainst: "6.7.13.0"
keywords: ["UnusedMediaSearchEvent", "UnusedMediaPurger", "media:delete-unused", "markAsUsed", "getUnusedIds", "kernel.event_subscriber", "unused media", "media cleanup", "orphaned media", "prevent media deletion", "json media references", "Doctrine\\DBAL\\Connection"]
summary: Keep plugin-referenced media from media:delete-unused by subscribing to UnusedMediaSearchEvent and calling markAsUsed() for IDs still in use.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

The extension point that lets a plugin protect media it references without foreign keys (e.g. media IDs inside JSON config) from being removed by the `media:delete-unused` CLI command.

## When to use

Your extension stores media IDs in a place the DAL cannot resolve via foreign keys — a JSON blob, nested config, an external store — and those media must survive the unused-media purge. Core CMS entities have the same problem, which is why the event exists.

## Key steps / config

How the purge works: `\Shopware\Core\Content\Media\UnusedMediaPurger` finds media with no foreign-key references, then dispatches `\Shopware\Core\Content\Media\Event\UnusedMediaSearchEvent` with the candidate IDs. Subscribers remove IDs from that list; the remaining IDs are deleted. This runs in batches, so the event can fire many times per run.

1. Create a subscriber for `UnusedMediaSearchEvent`:

```php
public static function getSubscribedEvents(): array
{
    return [UnusedMediaSearchEvent::class => 'removeUsedMedia'];
}

public function removeUsedMedia(UnusedMediaSearchEvent $event): void
{
    $idsToBeDeleted = $event->getUnusedIds();
    $event->markAsUsed($this->getUsedMediaIds($idsToBeDeleted));
}
```

2. In `getUsedMediaIds()`, check your own storage for the candidate IDs and return those still referenced. `markAsUsed()` takes an array of string IDs. For relational storage prefer a direct SQL query over loading entities, e.g. with an injected `\Doctrine\DBAL\Connection`, using `JSON_EXTRACT(slider_config, "$.images")` combined with `JSON_OVERLAPS(..., JSON_ARRAY(?))` and `ArrayParameterType::STRING` for the ID list.
3. Register the subscriber with tag `kernel.event_subscriber`:

```php
$services->set(UnusedMediaSubscriber::class)
    ->tag('kernel.event_subscriber');
```

4. Inspect candidates before a production run with `media:delete-unused --dry-run`, or get a machine-readable list with `media:delete-unused --report`.

## Essential identifiers

- `\Shopware\Core\Content\Media\Event\UnusedMediaSearchEvent` — `getUnusedIds()`, `markAsUsed(array $ids)`
- `\Shopware\Core\Content\Media\UnusedMediaPurger`
- CLI `media:delete-unused` (`--dry-run`, `--report`)
- Tag `kernel.event_subscriber`

## Gotchas

- Only IDs from the current batch are in `getUnusedIds()`; do not assume the full candidate set in one call.
- `--dry-run` and `--report` cannot be combined; the command errors out.
- The command also has a `--grace-period-days` option (default `20`) that skips recently uploaded media.

## Version notes

- Preventing media deletion via this event is possible since Shopware 6.5.1.0.

## Code check (6.7.13.0)
- confirmed `UnusedMediaSearchEvent::getUnusedIds()` — returns list of candidate IDs — vendor/shopware/core/Content/Media/Event/UnusedMediaSearchEvent.php:60
- confirmed `UnusedMediaSearchEvent::markAsUsed()` — removes given string IDs from the list — vendor/shopware/core/Content/Media/Event/UnusedMediaSearchEvent.php:52
- confirmed `UnusedMediaSearchEvent` — dispatched by the purger per batch — vendor/shopware/core/Content/Media/UnusedMediaPurger.php:217
- confirmed `UnusedMediaPurger` — service class — vendor/shopware/core/Content/Media/UnusedMediaPurger.php:32
- confirmed `UnusedMediaPurger::deleteNotUsedMedia()` — deletion entry point — vendor/shopware/core/Content/Media/UnusedMediaPurger.php:95
- confirmed `media:delete-unused` — command name — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:22
- confirmed `--dry-run` — option exists, not combinable with report — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:59
- confirmed `--report` — option exists — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:59
- confirmed `grace-period-days` — default 20 — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:46
- unverified `kernel.event_subscriber` — Symfony tag, vendor/symfony out of scope
