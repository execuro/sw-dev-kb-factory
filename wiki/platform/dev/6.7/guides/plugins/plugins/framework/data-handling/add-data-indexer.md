---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md
title: Adding Data Indexer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-indexer.html
sourceHash: 21fdde45c4fae9be6f64008aec2edcff881f9ea3
codeCheckedAgainst: "6.7.13.0"
keywords: ["EntityIndexer", "EntityIndexingMessage", "shopware.entity_indexer", "EntityIndexerRegistry::DISABLE_INDEXING", "IteratorFactory", "EntityWrittenContainerEvent", "CustomerIndexerEvent", "MultiInsertQueryQueue", "dal:refresh:index", "data indexer", "indexing", "forceQueue", "precomputed data"]
summary: Custom DAL EntityIndexer (getName, iterate, update, handle, getTotal, getDecorated), shopware.entity_indexer tag, async forceQueue, and indexer events.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/message-queue.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md", "platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

Data indexers precompute expensive values whenever entities are written through the DAL (e.g. the product `cheapest_price` column), so reads stay cheap. A plugin can add its own indexer by extending `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer`, or react to the events core indexers already dispatch. Indexing work can run via the [message queue](platform/dev/6.7/guides/hosting/infrastructure/message-queue.md).

## When to use

- You need to maintain derived/denormalised data for your own entity (see [Adding custom complex data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md)) or an existing one.
- For changes to existing core entities, prefer subscribing to the existing indexer events instead of writing a new indexer.

## Key steps / config

1. Create a class extending `EntityIndexer`. The installed base class declares six abstract methods; all must be implemented:

```php
class ExampleIndexer extends EntityIndexer
{
    public function getName(): string { return 'swag.basic.example.indexer'; }
    public function iterate(?array $offset): ?EntityIndexingMessage { /* IteratorFactory->createIterator(..., $offset)->fetch() */ }
    public function update(EntityWrittenContainerEvent $event): ?EntityIndexingMessage { /* $event->getPrimaryKeys(CustomerDefinition::ENTITY_NAME) */ }
    public function handle(EntityIndexingMessage $message): void { /* $message->getData(); write via Connection */ }
    public function getTotal(): int { /* iterator->fetchCount() */ }
    public function getDecorated(): EntityIndexer { throw new DecorationPatternException(static::class); }
}
```

2. Register the service with its dependencies (`Shopware\Core\Framework\DataAbstractionLayer\Dbal\Common\IteratorFactory`, e.g. `customer.repository`, `Doctrine\DBAL\Connection`) and tag it `shopware.entity_indexer`. With autoconfiguration enabled, subclasses of `EntityIndexer` receive this tag automatically.
3. Method roles:
   - `getName()` — unique name; used by `EntityIndexerRegistry` to route messages.
   - `iterate()` — full reindex (`bin/console dal:refresh:index` or the Administration's index refresh); returns `new EntityIndexingMessage(array_values($ids), $iterator->getOffset())` or `null` when done.
   - `update()` — called on DAL writes; filter the event's primary keys as tightly as possible; also usable for synchronous updates.
   - `handle()` — processes messages from `iterate`/`update`; write with the `Connection` directly rather than the DAL.
   - `getTotal()` / `getDecorated()` — record count for progress, and the decoration hook (core indexers throw `DecorationPatternException`).
4. Async handling: `update()` messages are handled synchronously by default. Constructor is `EntityIndexingMessage($data, $offset = null, $context = null, $forceQueue = false, $isFullIndexing = false)`; pass `forceQueue: true` to process via the message queue.
5. To use the DAL inside an indexer without retriggering indexing: `$context->addState(EntityIndexerRegistry::DISABLE_INDEXING);`.

### Using existing indexer events

Core indexers such as `CustomerIndexer`, `CategoryIndexer`, `LandingPageIndexer`, `ProductIndexer`, `ProductStreamIndexer`, `PromotionIndexer`, `RuleIndexer`, `MediaIndexer`, `MediaFolderIndexer`, `MediaFolderConfigurationIndexer`, `SalesChannelIndexer` dispatch events in `handle()`. Subscribe (tag `kernel.event_subscriber`) to e.g. `Shopware\Core\Checkout\Customer\Event\CustomerIndexerEvent`, read `getIds()`, and batch writes with `Shopware\Core\Framework\DataAbstractionLayer\Doctrine\MultiInsertQueryQueue` (`addInsert('log_entry', [...])`, then `execute()`).

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer`
- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexingMessage`
- `EntityIndexerRegistry::DISABLE_INDEXING`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenContainerEvent`
- `Shopware\Core\Framework\DataAbstractionLayer\Dbal\Common\IteratorFactory`
- `shopware.entity_indexer` tag, `dal:refresh:index`
- `CustomerIndexerEvent`, `MultiInsertQueryQueue`

## Gotchas

- Writing through the DAL in `handle()` or an indexer-event subscriber emits `EntityWrittenContainerEvent` again and can loop forever — use `Connection` (also faster) or `DISABLE_INDEXING`. See the ADR [when to use plain SQL or the DAL](platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md).
- The docs' example only implements `getName`, `iterate($offset)`, `update`, `handle`; the installed base class also requires `getTotal()` and `getDecorated()`, and `iterate` is typed `?array $offset`.
- The docs list a `BreadcrumpIndexer`; no such class exists in the installed code.

## Code check (6.7.13.0)
- corrected `EntityIndexer::iterate()` — docs: untyped `iterate($offset)`; signature is `iterate(?array $offset)` — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:23
- corrected `EntityIndexer::getTotal()` — docs: not mentioned; abstract, required — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:37
- corrected `EntityIndexer::getDecorated()` — docs: not mentioned; abstract, required — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:39
- confirmed `EntityIndexer::getName()` — abstract — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:15
- confirmed `EntityIndexingMessage::$forceQueue` — 4th ctor param, default false — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:31
- confirmed `shopware.entity_indexer` — autoconfigured for EntityIndexer subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:118
- confirmed `EntityIndexerRegistry::DISABLE_INDEXING` — context state 'disable-indexing' — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:31
- confirmed `dal:refresh:index` — RefreshIndexCommand name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:22
- confirmed `CustomerIndexerEvent` — exists — vendor/shopware/core/Checkout/Customer/Event/CustomerIndexerEvent.php:10
- absent `BreadcrumpIndexer` — no class of this name in the installed code
