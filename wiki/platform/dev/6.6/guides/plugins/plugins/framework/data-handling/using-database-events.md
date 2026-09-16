---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/using-database-events.md
title: Using database events
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/using-database-events.html
sourceHash: 2c6278da9495e0d4acedab71e4e04a5e1f2f9823
keywords: ["database events", "EntityWriteEvent", "EntityDeleteEvent", "EntityWrittenEvent", "EntityDeletedEvent", "EntityLoadedEvent", "EntitySearchResultLoadedEvent", "EntityAggregationResultLoadedEvent", "EntityIdSearchResultLoadedEvent", "addSuccess", "addError", "ProductEvents", "kernel.event_subscriber", "getSubscribedEvents"]
summary: "Lists Shopware's DAL entity events (write/delete plus per-entity written/deleted/loaded events) and how to subscribe to them."
lastBuilt: "2026-09-15"
---
## What it is
Documents the events the Data Abstraction Layer dispatches during write/delete/search operations, both generic batch events and per-entity events.

## When to use
Use when a plugin needs to react to entities being written, deleted, loaded, or searched — e.g. to sync data to an external system.

## Key steps / config
- Two generic batch events, dispatched once per batch of commands rather than per entity:
  - `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWriteEvent` — before a batch of commands is written (insert/update/delete). Provides `getIds()`, `getIds(EntityDefinition::ENTITY_NAME)`, `getCommands()`, `getCommandsForEntity()`, and `addSuccess()`/`addError()` callback registration.
  - `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityDeleteEvent` — before a batch of deletes; also supports `addSuccess()`/`addError()`.
- Per-entity events (dot-notation, `entity_name` = e.g. `product`):

| Event | Description |
|---|---|
| `product.written` | After data written to storage — refers to `EntityWrittenEvent` |
| `product.deleted` | After data deleted — refers to `EntityDeletedEvent` |
| `product.loaded` | After data hydrated — refers to `EntityLoadedEvent` |
| `product.search.result.loaded` | After search returned data — refers to `EntitySearchResultLoadedEvent` |
| `product.aggregation.result.loaded` | After aggregations loaded — refers to `EntityAggregationResultLoadedEvent` |
| `product.id.search.result.loaded` | After ID-only search finished — refers to `EntityIdSearchResultLoadedEvent` |

- Stock entities have an events class of constants (e.g. `ProductEvents::PRODUCT_LOADED_EVENT`, `ProductEvents::PRODUCT_WRITTEN_EVENT`) for use in `getSubscribedEvents()`.
- Register a subscriber implementing `EventSubscriberInterface` with the `kernel.event_subscriber` tag in `services.xml`.

## Essential identifiers
- `EntityWriteEvent`, `EntityDeleteEvent`
- `EntityWrittenEvent`, `EntityDeletedEvent`, `EntityLoadedEvent`, `EntitySearchResultLoadedEvent`, `EntityAggregationResultLoadedEvent`, `EntityIdSearchResultLoadedEvent`
- `ProductEvents`, `kernel.event_subscriber`
- `addSuccess()`, `addError()`

## Gotchas
- All entity events for a given operation are nested into one container event, so a subscriber is called once per batch (e.g. per search request), not once per individual event type instance.
- `EntityWriteEvent` is useful when the "before" state of the entity is needed (e.g. the old filename), since it fires before persistence.
