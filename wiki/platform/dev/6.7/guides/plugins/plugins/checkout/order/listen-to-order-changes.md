---
id: platform/dev/6.7/guides/plugins/plugins/checkout/order/listen-to-order-changes.md
title: Listen to Order Changes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/order/listen-to-order-changes.html
sourceHash: b315bacca9009d80a48b9531420f7f33c3404650
codeCheckedAgainst: "6.7.15.1"
keywords: ["OrderEvents", "ORDER_WRITTEN_EVENT", "order.written", "PreWriteValidationEvent", "ChangeSetAware", "requestChangeSet", "getChangeSet", "EntityWrittenEvent", "Defaults::LIVE_VERSION", "changeset", "order changes", "event subscriber", "order version"]
summary: Subscribe to OrderEvents::ORDER_WRITTEN_EVENT and request a changeset via PreWriteValidationEvent to see what changed on an order.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How a plugin reacts to order changes (line items, order states, order fields) with an event subscriber, and how to force the Data Abstraction Layer to compute a changeset so the listener can see old vs. new values.

## When to use

You need to run logic whenever an order is written, and optionally need to know which fields changed. Requires knowing [event subscribers](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md).

## Key steps / config

1. Pick the event from `Shopware\Core\Checkout\Order\OrderEvents`. For general changes to the order itself use `OrderEvents::ORDER_WRITTEN_EVENT` (value `order.written`), which dispatches an `EntityWrittenEvent`.
2. Implement `Symfony\Component\EventDispatcher\EventSubscriberInterface` and subscribe to it; return early unless `$event->getContext()->getVersionId() === Defaults::LIVE_VERSION`.
3. To get a changeset, additionally subscribe to `Shopware\Core\Framework\DataAbstractionLayer\Write\Validation\PreWriteValidationEvent` (triggered **before** the write result set is generated) and request it per command:

```php
public static function getSubscribedEvents(): array {
    return [
        PreWriteValidationEvent::class => 'triggerChangeSet',
        OrderEvents::ORDER_WRITTEN_EVENT => 'onOrderWritten',
    ];
}
public function triggerChangeSet(PreWriteValidationEvent $event): void {
    // skip non-live versions
    foreach ($event->getCommands() as $command) {
        if (!$command instanceof ChangeSetAware) { continue; }
        if ($command->getEntityName() !== OrderDefinition::ENTITY_NAME) { continue; }
        $command->requestChangeSet();
    }
}
```

4. In `onOrderWritten(EntityWrittenEvent $event)`, iterate `$event->getWriteResults()` and call `$result->getChangeSet()` on each result.

## Essential identifiers

- `Shopware\Core\Checkout\Order\OrderEvents::ORDER_WRITTEN_EVENT`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenEvent`
- `Shopware\Core\Framework\DataAbstractionLayer\Write\Validation\PreWriteValidationEvent`
- `Shopware\Core\Framework\DataAbstractionLayer\Write\Command\ChangeSetAware::requestChangeSet()`
- `Shopware\Core\Checkout\Order\OrderDefinition::ENTITY_NAME`
- `Shopware\Core\Defaults::LIVE_VERSION`

## Gotchas

- For performance reasons no changeset is added to the written event by default; without `requestChangeSet()` the changeset is not generated.
- Insert commands are not `ChangeSetAware`-relevant: a new entity has nothing that changed.
- Narrow the changeset request (entity name, version) as much as possible — every requested changeset costs performance.
- The version check matters: editing an order in the Administration creates a draft version that is merged into the live version on save; you usually only want the live version.

## Code check (6.7.15.1)
- confirmed `OrderEvents::ORDER_WRITTEN_EVENT` — constant value `order.written` — vendor/shopware/core/Checkout/Order/OrderEvents.php:11
- confirmed `PreWriteValidationEvent` — class exists in the Write/Validation namespace — vendor/shopware/core/Framework/DataAbstractionLayer/Write/Validation/PreWriteValidationEvent.php:15
- confirmed `PreWriteValidationEvent::getCommands()` — returns the pending write commands — vendor/shopware/core/Framework/DataAbstractionLayer/Write/Validation/PreWriteValidationEvent.php:39
- confirmed `ChangeSetAware::requestChangeSet()` — interface method — vendor/shopware/core/Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:22
- confirmed `WriteCommand::getEntityName()` — available on write commands — vendor/shopware/core/Framework/DataAbstractionLayer/Write/Command/WriteCommand.php:69
- confirmed `EntityWrittenEvent::getWriteResults()` — returns write results — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:163
- confirmed `EntityWriteResult::getChangeSet()` — nullable `ChangeSet` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityWriteResult.php:76
- confirmed `Defaults::LIVE_VERSION` — live version id constant — vendor/shopware/core/Defaults.php:20
- confirmed `OrderDefinition::ENTITY_NAME` — value `order` — vendor/shopware/core/Checkout/Order/OrderDefinition.php:58
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
