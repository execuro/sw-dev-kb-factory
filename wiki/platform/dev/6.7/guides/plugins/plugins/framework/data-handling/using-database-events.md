---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/using-database-events.md
sourceHash: 1003a667a16fb0f44186124ecaf65d7eb044773c
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/using-database-events.html
title: Using Database Events
version: "6.7"
versions:
  - "6.7"
keywords: ["database events", "dal events", "EntityWriteEvent", "EntityDeleteEvent", "EntityWrittenEvent", "EntityDeletedEvent", "EntityLoadedEvent", "EntitySearchResultLoadedEvent", "ProductEvents", "product.written", "product.loaded", "kernel.event_subscriber", "entity lifecycle hooks"]
summary: "DAL events: EntityWriteEvent/EntityDeleteEvent with success/error callbacks before writes, and per-entity <entity>.written/.deleted/.loaded events."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

The events the Data Abstraction Layer (DAL) dispatches around write, delete, load and search operations, and how to subscribe to them. Entity events are nested into one container event, so a subscriber is called once per operation rather than once per record.

## When to use

You need to react to entity changes (sync to a CDN or third-party system, capture pre-write state such as an old filename, invalidate data) or post-process loaded/search results.

## Key steps / config

**Generic batch events** (dispatched before a batch of commands is executed, not tied to one entity):

| Event | When |
|---|---|
| `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWriteEvent` | before insert/update/delete commands are written |
| `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityDeleteEvent` | before delete commands are executed |

In the listener, filter by entity name and register callbacks that run after the write succeeded or failed:

```php
public static function getSubscribedEvents(): array
{
    return [EntityWriteEvent::class => 'beforeWrite'];
}
public function beforeWrite(EntityWriteEvent $event): void
{
    $ids = $event->getIds(CmsPageDefinition::ENTITY_NAME);
    $payloads = array_map(fn (WriteCommand $c) => $c->getPayload(),
        $event->getCommandsForEntity(CmsPageDefinition::ENTITY_NAME));
    $event->addSuccess(function () use ($ids) { /* written */ });
    $event->addError(function () use ($ids) { /* failed */ });
}
```

`EntityDeleteEvent` offers `getIds(string $entity)`, `getCommands()`, `addSuccess(\Closure)`, `addError(\Closure)`.

**Per-entity events** (prefix = entity name, here `product`):

| Event name | Class |
|---|---|
| `product.written` | `EntityWrittenEvent` — definition, written data, context, primary keys, errors |
| `product.deleted` | `EntityDeletedEvent` — definition, context, primary keys, errors |
| `product.loaded` | `EntityLoadedEvent` — definition, context, hydrated entities |
| `product.search.result.loaded` | `EntitySearchResultLoadedEvent` — search result with count, criteria, entities |
| `product.aggregation.result.loaded` | `EntityAggregationResultLoadedEvent` — aggregation results, criteria, context |
| `product.id.search.result.loaded` | `EntityIdSearchResultLoadedEvent` — id search result |

All classes live in `Shopware\Core\Framework\DataAbstractionLayer\Event\`. Stock entities ship constants classes, e.g. `Shopware\Core\Content\Product\ProductEvents::PRODUCT_LOADED_EVENT` and `ProductEvents::PRODUCT_WRITTEN_EVENT`; use them as subscriber keys.

Register the subscriber (see [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)):

```php
$services->set(ProductSubscriber::class)->tag('kernel.event_subscriber');
```

## Essential identifiers

- `EntityWriteEvent::getIds()`, `getCommands()`, `getCommandsForEntity()`, `addSuccess()`, `addError()`
- `EntityDeleteEvent`
- `EntityWrittenEvent`, `EntityDeletedEvent`, `EntityLoadedEvent`, `EntitySearchResultLoadedEvent`, `EntityAggregationResultLoadedEvent`, `EntityIdSearchResultLoadedEvent`
- `ProductEvents`, `kernel.event_subscriber`

## Gotchas

- `getIds()` requires the entity name argument on both `EntityWriteEvent` and `EntityDeleteEvent`; the docs' no-argument call `$event->getIds()` to get ids "regardless of type" does not match the installed signature — iterate `getCommands()` instead.
- `EntityDeleteEvent::addSuccess`/`addError` accept only a `\Closure`; `EntityWriteEvent` accepts any `callable`.
- `DeleteCommand`s carry no payload.
- The docs' delete example calls `$this->cache->purge()` without injecting a cache service; inject whatever you use.
- `EntityDeletedEvent` extends `EntityWrittenEvent`.

## Code check (6.7.13.0)
- corrected `EntityWriteEvent::getIds()` — docs: callable without arguments; `string $entity` is required — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWriteEvent.php:85
- confirmed `EntityWriteEvent::getCommandsForEntity()` — filters commands by entity name — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWriteEvent.php:74
- confirmed `EntityWriteEvent::addSuccess()` — accepts callable — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWriteEvent.php:114
- confirmed `EntityDeleteEvent::getIds()` — requires entity name — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityDeleteEvent.php:78
- confirmed `EntityDeleteEvent::addSuccess()` — takes a `\Closure` — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityDeleteEvent.php:109
- confirmed `EntityWrittenEvent` — nested generic event — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:18
- confirmed `EntityDeletedEvent` — extends EntityWrittenEvent — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityDeletedEvent.php:15
- confirmed `EntitySearchResultLoadedEvent` — class exists — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntitySearchResultLoadedEvent.php:17
- confirmed `ProductEvents::PRODUCT_WRITTEN_EVENT` — value `product.written` — vendor/shopware/core/Content/Product/ProductEvents.php:31
- confirmed `ProductEvents::PRODUCT_LOADED_EVENT` — value `product.loaded` — vendor/shopware/core/Content/Product/ProductEvents.php:35
