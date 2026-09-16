---
docType: developer
id: platform/dev/6.6/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md
sourceHash: 0d68c71d989c59ed7b63bc62763efbceaf4115c5
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.html
title: Add Flow Builder trigger
version: "6.6"
versions:
  - "6.6"
keywords: ["flow builder trigger", "FlowEventAware", "CustomerAware", "OrderAware", "MailAware", "UserAware", "SalesChannelAware", "StorableFlow", "FlowStorer", "BusinessEventCollector", "custom event", "getAvailableData"]
summary: "How to create a custom event/trigger implementing Aware interfaces so it appears in the Flow Builder trigger list."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/framework/flow/add-flow-builder-action.md"]
---
## What it is
This guide explains how to add a custom flow trigger (event) that becomes selectable in the Administration's Flow Builder module, available starting with Shopware 6.4.6.0.

## When to use
When a plugin needs the shop owner to be able to react (via Flow Builder actions) to a new business event, not just the events Shopware ships with.

## Key steps / config
1. Create an event class implementing one or more Aware interfaces, e.g. `Shopware\Core\Framework\Event\CustomerAware` and `Shopware\Core\Framework\Event\FlowEventAware`:
```php
class ExampleEvent extends Event implements CustomerAware, FlowEventAware
{
    public const EVENT_NAME = 'example.event';
    public function getName(): string { return self::EVENT_NAME; }
    public function getCustomerId(): string { ... }
    public static function getAvailableData(): EventDataCollection { ... }
    public function getContext(): Context { ... }
}
```
2. From Shopware 6.5.0.0, the original event object is deprecated for Flow Builder purposes; data is instead stored via `FlowStorer` classes into `StorableFlow`, and `getAvailableData()` is no longer used for that path. Each Aware interface has a matching Storer, e.g. `Shopware\Core\Framework\Event\CustomerAware` → `Shopware\Core\Content\Flow\Dispatching\Storer\CustomerStorer`.
3. For custom data not covered by existing Aware interfaces, define your own Aware interface plus a `FlowStorer` subclass implementing `store(FlowEventAware $event, array $stored): array` and `restore(StorableFlow $storable): void`.
4. In actions, read stored/derived data via `$flow->getStore($key)` and `$flow->getData($key)`.
5. Register the event in the trigger list via a subscriber to `BusinessEventCollectorEvent::NAME`, calling `BusinessEventCollector::define(ExampleEvent::class)` and `$collection->set($definition->getName(), $definition)`; use a higher subscriber priority (e.g. `1000`) so the event is registered before other subscribers run.
6. Register the subscriber in `services.xml` tagged `kernel.event_subscriber`.

## Essential identifiers
- `Shopware\Core\Framework\Event\FlowEventAware`, `MailAware`, `OrderAware`, `CustomerAware`, `UserAware`, `SalesChannelAware`
- `Shopware\Core\Content\Flow\Dispatching\StorableFlow`, `Shopware\Core\Content\Flow\Dispatching\Storer\FlowStorer`
- `Shopware\Core\Framework\Event\BusinessEventCollector`, `BusinessEventCollectorEvent`
- `getStore()`, `getData()`, `getAvailableData()`

## Gotchas
- From 6.5.0.0, `getAvailableData()` no longer feeds Flow Builder data — use `FlowStorer`/`StorableFlow` instead.
- The registering subscriber needs a high enough priority on `BusinessEventCollectorEvent` or the event may miss awareness/actions.

## Version notes
Custom flow triggers require Shopware 6.4.6.0+; the `FlowStorer`/`StorableFlow` data model applies from 6.5.0.0.
