---
id: platform/dev/6.7/guides/plugins/plugins/checkout/order/listen-to-order-changes.md
title: Listen to Order Changes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/order/listen-to-order-changes.html
sourceHash: b315bacca9009d80a48b9531420f7f33c3404650
codeCheckedAgainst: "6.7.13.0"
keywords: ["OrderEvents", "ORDER_WRITTEN_EVENT", "EntityWrittenEvent", "PreWriteValidationEvent", "ChangeSetAware", "requestChangeSet", "getChangeSet", "Defaults::LIVE_VERSION", "order changes", "changeset", "event subscriber", "order written", "version id"]
summary: React to order writes via OrderEvents::ORDER_WRITTEN_EVENT and force a DAL changeset by calling requestChangeSet() in a PreWriteValidationEvent listener.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How a plugin reacts to order changes (changed line items, changed order states) with an event subscriber, and how to obtain the changeset of the write operation, which Shopware does not generate by default for performance reasons.

## When to use

When plugin code must run after an order is written and, optionally, needs to know which fields changed. Builds on the plugin base guide and on [event subscribers](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md).

## Key steps / config

1. Pick the event from `Shopware\Core\Checkout\Order\OrderEvents`; for general order changes use `OrderEvents::ORDER_WRITTEN_EVENT` (`order.written`), which delivers an `EntityWrittenEvent`.
2. To get a changeset, also subscribe to `Shopware\Core\Framework\DataAbstractionLayer\Write\Validation\PreWriteValidationEvent` (fired **before** the write result set is generated). For each command in `getCommands()`: skip it unless it is `ChangeSetAware`, skip it unless `getEntityName()` equals `OrderDefinition::ENTITY_NAME`, then call `requestChangeSet()`.
3. In the written listener, iterate `getWriteResults()` and read `$result->getChangeSet()`.
4. In both listeners return early unless `$event->getContext()->getVersionId() === Defaults::LIVE_VERSION`.

```php
class ListenToOrderChanges implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            PreWriteValidationEvent::class => 'triggerChangeSet',
            OrderEvents::ORDER_WRITTEN_EVENT => 'onOrderWritten',
        ];
    }
    // triggerChangeSet(PreWriteValidationEvent $event): void — $command->requestChangeSet()
    // onOrderWritten(EntityWrittenEvent $event): void — $result->getChangeSet()
}
```

## Essential identifiers

- `Shopware\Core\Checkout\Order\OrderEvents` / `OrderEvents::ORDER_WRITTEN_EVENT`
- `Shopware\Core\Checkout\Order\OrderDefinition` / `OrderDefinition::ENTITY_NAME`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenEvent`
- `Shopware\Core\Framework\DataAbstractionLayer\Write\Validation\PreWriteValidationEvent`
- `Shopware\Core\Framework\DataAbstractionLayer\Write\Command\ChangeSetAware`
- `Shopware\Core\Defaults` / `Defaults::LIVE_VERSION`
- `Symfony\Component\EventDispatcher\EventSubscriberInterface`

## Gotchas

- The changeset is not added to the written event automatically; without the `PreWriteValidationEvent` listener `getChangeSet()` yields nothing.
- Insert commands cannot produce a changeset (a whole new entity is created), hence the `ChangeSetAware` check.
- Requesting changesets costs performance — narrow the entity (and further conditions) as much as possible.
- Editing an order in the Administration creates a draft version that is merged into the live version on save; check the version id so you only react to the live version.

## Code check (6.7.13.0)
- confirmed `OrderEvents::ORDER_WRITTEN_EVENT` — value `order.written` — vendor/shopware/core/Checkout/Order/OrderEvents.php:11
- confirmed `OrderDefinition::ENTITY_NAME` — value `order` — vendor/shopware/core/Checkout/Order/OrderDefinition.php:58
- confirmed `PreWriteValidationEvent::getCommands()` — returns the write commands — vendor/shopware/core/Framework/DataAbstractionLayer/Write/Validation/PreWriteValidationEvent.php:39
- confirmed `ChangeSetAware::requestChangeSet()` — interface method — vendor/shopware/core/Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:22
- confirmed `WriteCommand::getEntityName()` — available on commands — vendor/shopware/core/Framework/DataAbstractionLayer/Write/Command/WriteCommand.php:69
- confirmed `EntityWrittenEvent::getWriteResults()` — returns write results — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:162
- confirmed `EntityWriteResult::getChangeSet()` — returns `?ChangeSet` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityWriteResult.php:76
- confirmed `Defaults::LIVE_VERSION` — constant exists — vendor/shopware/core/Defaults.php:20
