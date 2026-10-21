---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2023-08-27-post-updater.md
sourceHash: 77d51fb2d15fced3ff9db0f5f7113316af9aa654
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-08-27-post-updater.html
title: Post updater
version: "6.7"
versions:
  - "6.7"
keywords: ["PostUpdateIndexer", "SynchronousPostUpdateIndexer", "post updater", "one-time data migration", "EntityIndexer", "EntityIndexerRegistry", "registerIndexer", "MigrationStep", "EntityIndexingMessage", "indexer", "update process", "RegisteredIndexerSubscriber"]
summary: "ADR: PostUpdateIndexer runs one-time data migrations after a Shopware update; queued via registerIndexer, skipped by normal indexing."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (dated 2023-08-17, area core). One-time data updates between Shopware versions used to be done by extending an indexer and triggering it from a migration, but that logic then ran again on every indexer run, which is critical for some data (the ADR's example: the one-time migration of media path information). The decision adds `PostUpdateIndexer`, an extension of `EntityIndexer` that is only run after the update process and never by a full re-index or an entity-written event.

## When to use

When a migration must transform existing data once, possibly expensively, after an update, without that work becoming part of the regular indexing. The ADR adds that such migrations are often paired with a command to re-trigger them manually.

## Key steps / config

1. Extend `Shopware\Core\Framework\DataAbstractionLayer\Indexing\PostUpdateIndexer`. `update()` is already implemented there as `final` (returns `null`), so the subclass declares the remaining abstract `EntityIndexer` members:

```php
class PostUpdateExample extends PostUpdateIndexer
{
    public function getName(): string { return 'post.update.example'; }
    public function iterate(?array $offset): ?EntityIndexingMessage { /* iterator over ids */ }
    public function handle(EntityIndexingMessage $message): void { /* handle ids */ }
    public function getTotal(): int { /* ... */ }
    public function getDecorated(): EntityIndexer { /* ... */ }
}
```

2. Queue it from a migration with the protected `registerIndexer()` helper, the same way as a regular indexer:

```php
class MigrationExample extends \Shopware\Core\Framework\Migration\MigrationStep
{
    public function getCreationTimestamp(): int { /* ... */ }
    public function update(Connection $connection): void
    {
        $this->registerIndexer($connection, 'post.update.example');
    }
}
```

3. Queued indexers run when `RegisteredIndexerSubscriber` handles `UpdatePostFinishEvent` (also first-run-wizard finish and plugin post install/update/uninstall). A plain `PostUpdateIndexer` is dispatched via the message queue; extend `SynchronousPostUpdateIndexer` instead to have it run synchronously.

## Essential identifiers

- `PostUpdateIndexer`, `SynchronousPostUpdateIndexer`, `EntityIndexer`
- `EntityIndexerRegistry` (`index()` / `sendIndexingMessage()` with `postUpdate` flag)
- `\Shopware\Core\Framework\Migration\MigrationStep`, `registerIndexer()`
- `RegisteredIndexerSubscriber`, `UpdatePostFinishEvent`
- `EntityIndexingMessage`

## Gotchas

- The ADR says the indexer is not triggered via the `IndexerRegistry`; the installed class is `EntityIndexerRegistry`, which skips `PostUpdateIndexer` instances in `refresh()`, in `index()`/`sendIndexingMessage()` unless `postUpdate` is true, and in `getIndexers()`.
- The ADR example omits `getTotal()` and `getDecorated()` and the migration's `getCreationTimestamp()`; all are abstract and must be declared.

## Code check (6.7.15.1)
- confirmed `PostUpdateIndexer` — abstract, extends EntityIndexer — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/PostUpdateIndexer.php:9
- confirmed `PostUpdateIndexer::update()` — final, returns null — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/PostUpdateIndexer.php:11
- confirmed `EntityIndexer::getDecorated()` — abstract, must be declared — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:39
- confirmed `EntityIndexer::getTotal()` — abstract, must be declared — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:37
- corrected `EntityIndexerRegistry` — docs: IndexerRegistry — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:25
- confirmed `PostUpdateIndexer` — skipped in refresh() on entity writes — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:141
- confirmed `PostUpdateIndexer` — index() skips it unless postUpdate — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:87
- confirmed `MigrationStep::registerIndexer()` — protected helper — vendor/shopware/core/Framework/Migration/MigrationStep.php:82
- confirmed `UpdatePostFinishEvent` — triggers runRegisteredIndexers — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/Subscriber/RegisteredIndexerSubscriber.php:37
- confirmed `SynchronousPostUpdateIndexer` — run synchronously via index() — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/Subscriber/RegisteredIndexerSubscriber.php:70
