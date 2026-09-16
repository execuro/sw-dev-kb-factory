---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-data-indexer.md
title: Adding Data Indexer
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/add-data-indexer.html
sourceHash: bd53d3936e6b7d2730d7f85d2a4ca3ea33002414
keywords: ["EntityIndexer", "EntityIndexingMessage", "shopware.entity_indexer", "getName", "iterate", "update", "handle", "EntityWrittenContainerEvent", "IteratorFactory", "EntityIndexerRegistry", "DISABLE_INDEXING", "dal:refresh:index", "CustomerIndexerEvent"]
summary: "Create an EntityIndexer to precompute expensive values on entity write, or subscribe to an existing indexer's dispatched event."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md"]
---
## What it is

Guide for adding a custom `EntityIndexer` to precompute recurring, expensive calculations (e.g. cheapest price) when entities are written, instead of recalculating on every read, and for reacting to existing indexers' events.

## When to use

When a value is expensive to calculate on read and can instead be recalculated once whenever the underlying entity changes, optionally via the message queue.

## Key steps / config

Create a class extending `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer` implementing:

- `getName(): string` — unique indexer name (e.g. `'swag.basic.example.indexer'`), used by `EntityIndexerRegistry` to route messages.
- `iterate($offset): ?EntityIndexingMessage` — for a full reindex (triggered by `bin/console dal:refresh:index` or the Administration), uses `IteratorFactory::createIterator()` to page through IDs.
- `update(EntityWrittenContainerEvent $event): ?EntityIndexingMessage` — reacts to DAL writes via `$event->getPrimaryKeys(CustomerDefinition::ENTITY_NAME)`.
- `handle(EntityIndexingMessage $message): void` — processes the message, e.g. via direct `Connection::executeStatement()` calls.

Register with the `shopware.entity_indexer` tag:

```xml
<service id="Swag\BasicExample\Core\Framework\DataAbstractionLayer\Indexing\ExampleIndexer">
    <argument type="service" id="Shopware\Core\Framework\DataAbstractionLayer\Dbal\Common\IteratorFactory"/>
    <argument type="service" id="customer.repository"/>
    <argument type="service" id="Doctrine\DBAL\Connection" />
    <tag name="shopware.entity_indexer"/>
</service>
```

Messages from `update()` are handled synchronously by default; passing `true` for `EntityIndexingMessage`'s fourth `$forceQueue` parameter routes them through the message queue asynchronously.

To use the DAL (instead of `Connection`) inside `handle()`/`update()` without triggering re-indexing recursion, add `$context->addState(EntityIndexerRegistry::DISABLE_INDEXING)`.

Alternative: subscribe to an existing indexer's dispatched event (e.g. `CustomerIndexerEvent`) instead of writing a new indexer, tagged `kernel.event_subscriber`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer`
- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexingMessage`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenContainerEvent`
- `Shopware\Core\Framework\DataAbstractionLayer\Dbal\Common\IteratorFactory`
- `EntityIndexerRegistry::DISABLE_INDEXING`
- `shopware.entity_indexer` tag
- CLI: `bin/console dal:refresh:index`
- Existing indexers: `CustomerIndexer`, `CategoryIndexer`, `LandingPageIndexer`, `ProductIndexer`, `ProductStreamIndexer`, `PromotionIndexer`, `RuleIndexer`, `MediaIndexer`, `MediaFolderIndexer`, `MediaFolderConfigurationIndexer`, `SalesChannelIndexer`, `BreadcrumpIndexer`

## Gotchas

Writing via the DAL inside an indexer's `handle()`/`update()` re-triggers `EntityWrittenContainerEvent` and can cause an infinite loop; use `Connection` directly instead, which is also faster. See the linked ADR for when to use plain SQL vs. the DAL.

## Version notes

Prefer subscribing to an existing indexer's dispatched event over writing a new indexer when reacting to changes on entities that already have one.
