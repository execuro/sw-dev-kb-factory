---
id: platform/dev/6.6/resources/references/adr/2023-08-27-post-updater.md
title: Post updater
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-08-27-post-updater.html"
sourceHash: "77d51fb2d15fced3ff9db0f5f7113316af9aa654"
keywords: ["PostUpdateIndexer", "EntityIndexer", "IndexerRegistry", "registerIndexer", "MigrationStep", "one-time migration", "post updater", "indexer registration", "EntityIndexingMessage"]
summary: "ADR: new PostUpdateIndexer runs one-time data migrations after an update, without being triggered by the normal indexer process."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record introducing `PostUpdateIndexer`, a way to run one-time data migrations between Shopware versions without hooking into the regular indexer process.

## When to use
Relevant when a data migration must run exactly once after an update (e.g. one-time media path migration) rather than repeatedly on every full reindex or entity-write event.

## Key steps / config
- `PostUpdateIndexer` extends `EntityIndexer`; registration via database migration works the same way as for a normal indexer.
- Unlike a normal `EntityIndexer`, it is not triggered by `IndexerRegistry` on full reindex or entity-written events — it only runs once, after the update process.
- A command is often also provided to re-trigger the migration manually.

```php
class PostUpdateExample extends PostUpdateIndexer
{
    public function getName(): string
    {
        return 'post.update.example';
    }

    public function iterate(?array $offset): ?EntityIndexingMessage
    {
        // fetch ids via iterator, return null when done
    }

    public function handle(EntityIndexingMessage $message): void
    {
        // handle ids
    }
}
```
```php
class MigrationExample extends \Shopware\Core\Framework\Migration\MigrationStep
{
    public function update(Connection $connection): void
    {
        $this->registerIndexer($connection, 'post.update.example');
    }
}
```

## Essential identifiers
- `PostUpdateIndexer`
- `EntityIndexer`
- `IndexerRegistry`
- `registerIndexer`
- `Shopware\Core\Framework\Migration\MigrationStep`
- `EntityIndexingMessage`

## Gotchas
These one-time migrations are excluded from the normal indexer process and cannot be re-triggered by it; developers can safely run computationally intensive one-off migrations without affecting normal indexing performance.
