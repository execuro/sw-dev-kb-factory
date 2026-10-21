---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md
title: Adding Data Indexer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-indexer.html
sourceHash: 3cd68f20a1caaa5f18eda6a7b5af61af6a6114cd
codeCheckedAgainst: "6.7.15.1"
keywords: ["EntityIndexer", "EntityIndexingMessage", "shopware.entity_indexer", "EntityIndexerRegistry::DISABLE_INDEXING", "dal:refresh:index", "EntityWrittenContainerEvent", "IteratorFactory", "CustomerIndexerEvent", "DecorationPatternException", "forceQueue", "data indexer", "indexing", "precalculated data"]
summary: "Custom DAL EntityIndexer: six required methods, shopware.entity_indexer tag, forceQueue, DISABLE_INDEXING, core indexer events."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/message-queue.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md", "platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

A data indexer precomputes expensive derived data whenever the DAL writes an entity, so reads stay cheap (core example: the `cheapest_price` column of products). This page shows how to add an indexer for your own or existing entities, and how to hook into the events core indexers dispatch instead. Indexers can hand their work to the [message queue](platform/dev/6.7/guides/hosting/infrastructure/message-queue.md).

## When to use

- You have a custom entity (see [Adding custom complex data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md)) with derived values that are expensive to compute on read.
- To react to changes of existing core entities, prefer subscribing to the indexer event that core already dispatches (e.g. `CustomerIndexerEvent`) over writing another indexer.

## Key steps / config

1. Extend `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer`. All six abstract members are mandatory:

```php
class ExampleIndexer extends EntityIndexer
{
    public function getName(): string { return 'swag.basic.example.indexer'; }
    public function iterate(?array $offset): ?EntityIndexingMessage { /* IteratorFactory->createIterator(...)->fetch() */ }
    public function update(EntityWrittenContainerEvent $event): ?EntityIndexingMessage { /* $event->getPrimaryKeys(CustomerDefinition::ENTITY_NAME) */ }
    public function handle(EntityIndexingMessage $message): void { /* write via Connection */ }
    public function getTotal(): int { /* iterator->fetchCount() */ }
    public function getDecorated(): EntityIndexer { throw new DecorationPatternException(static::class); }
}
```

2. Register the service with `->tag('shopware.entity_indexer')`; the guide injects `service(IteratorFactory::class)`, `service('customer.repository')`, `service(Connection::class)`. Core also autoconfigures this tag for every `EntityIndexer` subclass.
3. Member roles:
   - `getName()`: unique name; `EntityIndexerRegistry` uses it to route messages to the indexer.
   - `getTotal()`: record count, used for progress output of `bin/console dal:refresh:index`.
   - `iterate()`: full reindex (`dal:refresh:index` or the Administration "update indexes" action). Use `Shopware\Core\Framework\DataAbstractionLayer\Dbal\Common\IteratorFactory` with the offset to batch ids; return `null` when done.
   - `update()`: called on DAL writes; return `new EntityIndexingMessage(array_values($ids), null, $event->getContext())`, or `null` if nothing matches. Filter as tightly as possible (the event can be filtered by changed columns). Also usable for data that must change synchronously.
   - `handle()`: processes messages from `iterate`/`update`. Write with the DBAL `Connection`, not the DAL.
4. Async handling: messages from `update()` are handled synchronously by default. Pass `forceQueue: true` (4th constructor argument of `EntityIndexingMessage`) to push them onto the message queue.
5. DAL writes inside an indexer re-trigger `EntityWrittenContainerEvent` and can loop forever. If you must use the DAL, add the context state `EntityIndexerRegistry::DISABLE_INDEXING` (`$context->addState(...)`) before returning the message.
6. Event alternative: register an `EventSubscriberInterface` (tag `kernel.event_subscriber`) on e.g. `CustomerIndexerEvent`, read `getIds()`, and batch inserts with `Shopware\Core\Framework\DataAbstractionLayer\Doctrine\MultiInsertQueryQueue` (`addInsert()` then `execute()`).

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer`
- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexingMessage` (`$forceQueue`)
- `EntityIndexerRegistry::DISABLE_INDEXING`
- `shopware.entity_indexer` tag
- `bin/console dal:refresh:index`
- `EntityWrittenContainerEvent::getPrimaryKeys()`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`
- `Shopware\Core\Checkout\Customer\Event\CustomerIndexerEvent`
- Core indexers that dispatch events: `CustomerIndexer`, `CategoryIndexer`, `LandingPageIndexer`, `ProductIndexer`, `ProductStreamIndexer`, `PromotionIndexer`, `RuleIndexer`, `MediaIndexer`, `MediaFolderIndexer`, `MediaFolderConfigurationIndexer`, `SalesChannelIndexer`

## Gotchas

- Writing through the DAL in `handle()` or in an indexer-event subscriber dispatches new written events and causes an infinite loop; use the `Connection` directly (also faster). See the ADR [when to use plain SQL or the DAL](platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md).
- A non-decorating indexer must still implement `getDecorated()` and throw `DecorationPatternException`.
- In 6.7.15.1 `EntityIndexingMessage` has a fifth constructor argument, `isFullIndexing` (default `false`), that the guide does not mention.

## Code check (6.7.15.1)
- confirmed `EntityIndexer` — abstract base with abstract getName/iterate/update/handle/getTotal/getDecorated — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9
- confirmed `EntityIndexer::getDecorated()` — abstract, so every indexer must declare it — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:39
- confirmed `EntityIndexingMessage::$forceQueue` — 4th constructor parameter, default false — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:31
- confirmed `EntityIndexingMessage::$isFullIndexing` — additional 5th parameter, default false — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:32
- confirmed `EntityIndexerRegistry::DISABLE_INDEXING` — context state value 'disable-indexing' — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:32
- confirmed `forceQueue()` — registry queues a message when the queue state or forceQueue is set — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:286
- confirmed `shopware.entity_indexer` — tag, also autoconfigured for EntityIndexer subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:119
- confirmed `dal:refresh:index` — console command name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:23
- confirmed `CustomerIndexerEvent` — dispatched in CustomerIndexer::handle() — vendor/shopware/core/Checkout/Customer/DataAbstractionLayer/CustomerIndexer.php:105
- confirmed `IteratorFactory` — class exists at the documented namespace — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/Common/IteratorFactory.php:17
