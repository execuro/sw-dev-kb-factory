---
id: platform/dev/6.7/resources/references/adr/2023-08-27-post-updater.md
title: Post updater
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-08-27-post-updater.html
sourceHash: 77d51fb2d15fced3ff9db0f5f7113316af9aa654
codeCheckedAgainst: "6.7.13.0"
keywords: ["PostUpdateIndexer", "SynchronousPostUpdateIndexer", "EntityIndexer", "EntityIndexingMessage", "registerIndexer", "MigrationStep", "EntityIndexerRegistry", "post update", "one-time data migration", "indexer", "update process", "IteratorFactory"]
summary: "ADR: PostUpdateIndexer runs one-time data migrations only after updates or plugin lifecycle, queued from a migration, never on re-index or entity writes."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (area `core`) introducing `PostUpdateIndexer`: an `EntityIndexer` variant for one-time, computationally heavy data migrations that run after the update process instead of on every indexing run.

## When to use

Use it when a Shopware or plugin update must transform existing data once (the ADR's example is the one-time media path migration) and running that logic as a regular indexer would re-execute it on every full re-index or entity write, which can break data.

## Key steps / config

Previously, one-time data updates were implemented by extending an indexer and triggering it from a migration, so the logic ran again whenever the indexer ran.

1. Extend `Shopware\Core\Framework\DataAbstractionLayer\Indexing\PostUpdateIndexer`. It extends `EntityIndexer` and declares `update(EntityWrittenContainerEvent $event)` as `final` returning `null`, so you implement the remaining abstract members: `getName()`, `iterate()`, `handle()`, `getTotal()`, `getDecorated()`.
2. Register it as an indexer service (same as any `EntityIndexer`) and queue it from a migration with `MigrationStep::registerIndexer()`.
3. Optionally provide a CLI command that re-triggers the migration manually.

```php
class PostUpdateExample extends PostUpdateIndexer
{
    public function getName(): string { return 'post.update.example'; }
    public function iterate(?array $offset): ?EntityIndexingMessage
    { /* $this->iteratorFactory->createIterator('my_entity', $offset) ... */ }
    public function handle(EntityIndexingMessage $message): void { /* handle ids */ }
    public function getTotal(): int { /* ... */ }
    public function getDecorated(): EntityIndexer { throw new DecorationPatternException(self::class); }
}
```

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

How it runs in 6.7.13.0: `EntityIndexerRegistry::index()` skips post-update indexers unless called with `$postUpdate = true`, and `refresh()` (entity written) always skips them. `RegisteredIndexerSubscriber::runRegisteredIndexers()` executes queued indexers on `UpdatePostFinishEvent`, `FirstRunWizardFinishedEvent` and plugin post install/update/uninstall events — via the queue, or synchronously if the indexer extends `SynchronousPostUpdateIndexer`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\PostUpdateIndexer`
- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\SynchronousPostUpdateIndexer`
- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer`
- `EntityIndexingMessage`
- `\Shopware\Core\Framework\Migration\MigrationStep::registerIndexer()`
- `RegisteredIndexerSubscriber`, `EntityIndexerRegistry`

## Gotchas

- The ADR's example omits `getTotal()` and `getDecorated()`; both are abstract in `EntityIndexer` and must be implemented, and a migration class also needs `getCreationTimestamp()`.
- You cannot override `update()` — it is `final` in `PostUpdateIndexer`, so entity writes never trigger these indexers.

## Code check (6.7.13.0)
- confirmed `PostUpdateIndexer` — abstract class extending `EntityIndexer` — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/PostUpdateIndexer.php:9
- corrected `PostUpdateIndexer::update()` — docs: implement like an EntityIndexer; code makes `update()` final returning null — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/PostUpdateIndexer.php:11
- corrected `EntityIndexer::getTotal()` — docs: example omits it; abstract, required — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:37
- corrected `EntityIndexer::getDecorated()` — docs: example omits it; abstract, required — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:39
- confirmed `MigrationStep::registerIndexer()` — protected helper queuing an indexer by name — vendor/shopware/core/Framework/Migration/MigrationStep.php:82
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, required on every migration — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, required on every migration — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `EntityIndexerRegistry::index()` — skips post update indexers unless `$postUpdate` is true — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:82
- confirmed `EntityIndexerRegistry::refresh()` — always skips post update indexers on entity written events — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:120
- confirmed `SynchronousPostUpdateIndexer` — run synchronously after update — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/Subscriber/RegisteredIndexerSubscriber.php:70
