---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/using-database-events.md
title: Using Database Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/using-database-events.html
sourceHash: 1003a667a16fb0f44186124ecaf65d7eb044773c
codeCheckedAgainst: "6.7.15.1"
keywords: ["EntityWriteEvent", "EntityDeleteEvent", "EntityWrittenEvent", "EntityLoadedEvent", "EntitySearchResultLoadedEvent", "ProductEvents", "product.written", "product.loaded", "kernel.event_subscriber", "dal events", "entity events", "before write hook"]
summary: DAL events - EntityWriteEvent/EntityDeleteEvent with success/error callbacks, and per-entity events like product.written, product.loaded via ProductEvents.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

The events the Data Abstraction Layer (DAL) dispatches around entity operations: two generic pre-write events for command batches, plus per-entity events (`<entity>.written`, `<entity>.loaded`, ...). Events are nested into one container event, so a subscriber is called once per operation rather than per entity.

## When to use

Hooking into writes or deletes of any entity (e.g. sync images to a CDN, clean up a third-party system using data captured before deletion), or reacting after entities were written, deleted, loaded or searched.

## Key steps / config

Generic events (dispatched before a batch of commands is executed):

| Event | When |
|---|---|
| `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWriteEvent` | before insert/update/delete commands are written |
| `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityDeleteEvent` | before delete commands are executed |

Subscriber skeleton:

```php
public static function getSubscribedEvents()
{
    return [EntityWriteEvent::class => 'beforeWrite'];
}

public function beforeWrite(EntityWriteEvent $event)
{
    $ids = $event->getIds(CmsPageDefinition::ENTITY_NAME);
    $payloads = array_map(fn (WriteCommand $c) => $c->getPayload(),
        $event->getCommandsForEntity(CmsPageDefinition::ENTITY_NAME));
    $event->addSuccess(function () use ($ids) { /* written */ });
    $event->addError(function () use ($ids) { /* failed */ });
}
```

- `getIds(string $entity)` requires the entity name; for all commands regardless of type iterate `getCommands()`.
- `EntityWriteEvent::addSuccess`/`addError` accept any `callable`; `EntityDeleteEvent::addSuccess`/`addError` accept a `\Closure`.
- `DeleteCommand`s carry no payload.

Per-entity events (prefix = entity name, here `product`):

| Event | Class |
|---|---|
| `product.written` | `EntityWrittenEvent` |
| `product.deleted` | `EntityDeletedEvent` |
| `product.loaded` | `EntityLoadedEvent` |
| `product.search.result.loaded` | `EntitySearchResultLoadedEvent` |
| `product.aggregation.result.loaded` | `EntityAggregationResultLoadedEvent` |
| `product.id.search.result.loaded` | `EntityIdSearchResultLoadedEvent` |

Use the entity's constants class, e.g. `ProductEvents::PRODUCT_LOADED_EVENT`, `ProductEvents::PRODUCT_WRITTEN_EVENT`. Register the subscriber with the `kernel.event_subscriber` tag:

```php
$services->set(ProductSubscriber::class)
    ->tag('kernel.event_subscriber');
```

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWriteEvent`, `EntityDeleteEvent`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenEvent`, `EntityDeletedEvent`, `EntityLoadedEvent`, `EntitySearchResultLoadedEvent`, `EntityAggregationResultLoadedEvent`, `EntityIdSearchResultLoadedEvent`
- `Shopware\Core\Content\Product\ProductEvents`
- `Shopware\Core\Framework\DataAbstractionLayer\Write\Command\WriteCommand`
- `kernel.event_subscriber`

## Gotchas

- The source example calls `$event->getIds()` without an argument; in the installed code the `$entity` parameter is mandatory.
- `EntityWriteEvent` is the place to capture the before-state (e.g. old filename) — `product.written` fires after storage.

## Code check (6.7.15.1)
- corrected `EntityWriteEvent::getIds()` — docs: callable with no argument to get all ids; signature is `getIds(string $entity)` — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWriteEvent.php:85
- confirmed `EntityWriteEvent::getCommandsForEntity()` — filters commands by entity name — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWriteEvent.php:74
- confirmed `EntityWriteEvent::addSuccess()` — accepts `callable` — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWriteEvent.php:114
- confirmed `EntityDeleteEvent::addSuccess()` — accepts `\Closure` — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityDeleteEvent.php:109
- confirmed `EntityDeleteEvent::getIds()` — requires `string $entity` — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityDeleteEvent.php:78
- confirmed `ProductEvents::PRODUCT_WRITTEN_EVENT` — `product.written` — vendor/shopware/core/Content/Product/ProductEvents.php:31
- confirmed `ProductEvents::PRODUCT_LOADED_EVENT` — `product.loaded` — vendor/shopware/core/Content/Product/ProductEvents.php:35
- confirmed `EntityDeletedEvent` — extends `EntityWrittenEvent` — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityDeletedEvent.php:17
- confirmed `EntitySearchResultLoadedEvent` — nested generic event — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntitySearchResultLoadedEvent.php:19
- confirmed `EntityIdSearchResultLoadedEvent` — nested generic event — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityIdSearchResultLoadedEvent.php:16
