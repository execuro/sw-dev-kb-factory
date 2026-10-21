---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/content/media/prevent-deletion-of-media-files-referenced-in-your-plugins.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
  - platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md
sourceHash: 279d4c8a7ea17960680b251797da3fa22997dc39
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/media/prevent-deletion-of-media-files-referenced-in-your-plugins.html
title: Prevent Deletion of Media Files Referenced in Plugins
version: "6.7"
versions:
  - "6.7"
keywords: ["UnusedMediaSearchEvent", "UnusedMediaPurger", "media:delete-unused", "markAsUsed", "getUnusedIds", "kernel.event_subscriber", "unused media", "delete unused media", "media cleanup", "media references", "json media ids", "dry-run"]
summary: Subscribe to UnusedMediaSearchEvent and call markAsUsed() so media:delete-unused keeps media your plugin references without foreign keys.
lastBuilt: 2026-10-21
---
## What it is

The `media:delete-unused` CLI command deletes media entities and files that no other entity references via foreign keys. References stored without foreign keys (for example media IDs inside JSON blobs, as CMS entities do) are invisible to that check. `\Shopware\Core\Content\Media\Event\UnusedMediaSearchEvent` is the extension point that lets a plugin mark such media as used so it is not deleted.

## When to use

Your plugin stores references to media entities in a way the foreign-key check cannot see (JSON config, external storage), and you need those media to survive `media:delete-unused`.

## Key steps / config

1. `\Shopware\Core\Content\Media\UnusedMediaPurger` finds media not referenced via foreign keys, then dispatches `UnusedMediaSearchEvent` with the candidate IDs. It works in batches, so the event can fire many times in one run.
2. Write a subscriber for `UnusedMediaSearchEvent`:

```php
class UnusedMediaSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [UnusedMediaSearchEvent::class => 'removeUsedMedia'];
    }

    public function removeUsedMedia(UnusedMediaSearchEvent $event): void
    {
        $ids = $event->getUnusedIds();          // list<string> scheduled for deletion
        $event->markAsUsed($this->getUsedMediaIds($ids)); // array of string IDs to keep
    }
}
```

3. In `getUsedMediaIds`, check your own storage for the candidate IDs. For relational storage, query directly instead of loading entities. The source's example injects `\Doctrine\DBAL\Connection` and uses MySQL `JSON_EXTRACT(slider_config, "$.images")` with `JSON_OVERLAPS(..., JSON_ARRAY(?))` on `my_slider_table`, binding the IDs with `ArrayParameterType::STRING` via `fetchFirstColumn`, then `json_decode`s and merges the results.
4. Register the subscriber with the `kernel.event_subscriber` tag in `src/Resources/config/services.php`:

```php
$services->set(UnusedMediaSubscriber::class)
    ->tag('kernel.event_subscriber');
```

5. Before deleting in production, inspect candidates with `media:delete-unused --dry-run`, or export them with `media:delete-unused --report`.

## Essential identifiers

- `\Shopware\Core\Content\Media\Event\UnusedMediaSearchEvent`, with `getUnusedIds()`, `markAsUsed(array $ids)` and `getContext()`
- `\Shopware\Core\Content\Media\UnusedMediaPurger`
- CLI: `media:delete-unused`, options `--dry-run`, `--report`, `--folder-entity`, `--limit`, `--offset`, `--grace-period-days`
- DI tag: `kernel.event_subscriber`

## Gotchas

- `markAsUsed()` removes the given IDs from the event's ID list. Media still on the list after all subscribers have run are deleted.
- Because the event fires once per batch, each call only sees that batch's IDs. Do not assume you get the full candidate set at once.
- `--report` and `--dry-run` cannot be combined. The command fails with an error if you pass both.
- Unless `--grace-period-days` says otherwise, media uploaded in the last 20 days are excluded.

## Version notes

- Preventing deletion this way is possible since Shopware 6.5.1.0.
- In 6.7, building `UnusedMediaSearchEvent` without a `Context` is deprecated, and the context becomes required in v6.8.0. `getNullableContext()` is deprecated in favour of `getContext()`.

## Code check (6.7.15.1)
- confirmed `UnusedMediaSearchEvent` — event class in Content\Media\Event — vendor/shopware/core/Content/Media/Event/UnusedMediaSearchEvent.php:13
- confirmed `UnusedMediaSearchEvent::markAsUsed()` — takes array of string IDs and removes them from the list — vendor/shopware/core/Content/Media/Event/UnusedMediaSearchEvent.php:52
- confirmed `UnusedMediaSearchEvent::getUnusedIds()` — returns list of candidate IDs — vendor/shopware/core/Content/Media/Event/UnusedMediaSearchEvent.php:60
- deprecated `UnusedMediaSearchEvent::getNullableContext()` — deprecated for v6.8.0, use getContext() — vendor/shopware/core/Content/Media/Event/UnusedMediaSearchEvent.php:40
- confirmed `UnusedMediaPurger` — service that dispatches the event per batch — vendor/shopware/core/Content/Media/UnusedMediaPurger.php:32
- confirmed `media:delete-unused` — command name — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:23
- confirmed `dry-run` — option exists; cannot be combined with report — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:47
- confirmed `report` — option exists — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:48
- confirmed `grace-period-days` — default 20 days — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:46
- unverified `kernel.event_subscriber` — Symfony DI tag, vendor/symfony out of scope
