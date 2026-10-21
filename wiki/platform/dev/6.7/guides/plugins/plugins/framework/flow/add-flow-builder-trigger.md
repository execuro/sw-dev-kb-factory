---
id: platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md
title: Add Flow Builder Trigger
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.html
sourceHash: f096ef98a9dfd3c3cc412cb9ab5509a33ed33d1a
codeCheckedAgainst: "6.7.15.1"
keywords: ["FlowEventAware", "CustomerAware", "FlowStorer", "StorableFlow", "IsFlowEventAware", "ScalarValuesAware", "BusinessEventCollector", "BusinessEventCollectorEvent", "flow.storer", "custom flow trigger", "flow builder event", "aware interface", "storer"]
summary: Custom flow trigger - FlowEventAware event with aware interfaces, FlowStorer store/restore, registered via BusinessEventCollectorEvent.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/add-custom-event.md", "platform/dev/6.7/concepts/framework/flow-concept.md", "platform/dev/6.7/guides/development/troubleshooting/flow-reference.md", "platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md"]
---
## What it is

How to make a plugin event appear as a trigger in the Flow Builder, so shop owners can attach actions to it. The event's aware interfaces decide which actions are available and which data is stored for them. Prerequisite: [Add custom event](platform/dev/6.7/guides/plugins/plugins/framework/event/add-custom-event.md); existing triggers/actions: [Flow reference](platform/dev/6.7/guides/development/troubleshooting/flow-reference.md).

## When to use

A plugin dispatches its own event and flows (add/remove tag, send mail, ...) should run when it fires.

## Key steps / config

**Interfaces**: `FlowEventAware` is the base of every trigger (`getName()`, static `getAvailableData()`, `getContext()` via `ShopwareEvent`). Aware interfaces unlock actions: `MailAware`, `OrderAware` (`orderId`), `CustomerAware` (`customerId`), `UserAware` (`userId`), `SalesChannelAware` (`salesChannelId`).

**1. Event**:

```php
class ExampleEvent extends Event implements CustomerAware, FlowEventAware
{
    public const EVENT_NAME = 'example.event';
    public function getName(): string { return self::EVENT_NAME; }
    public function getCustomerId(): string { return $this->customer->getId(); }
    public static function getAvailableData(): EventDataCollection { /* ->add('customer', new EntityType(CustomerDefinition::class)) */ }
    public function getContext(): Context { return $this->context; }
}
```

**2. Storers**: since 6.5 actions receive a `StorableFlow`. Each aware interface has a storer: `store()` writes scalars, `restore()` rebuilds data. Examples: `Shopware\Core\Framework\Event\CustomerAware` -> `Shopware\Core\Content\Flow\Dispatching\Storer\CustomerStorer`; `Shopware\Core\Content\Flow\Dispatching\Aware\ScalarValuesAware` -> `...\Storer\ScalarValuesStorer` (each `getValues()` entry is restored as flow data under its key - use it for plain scalars).

**3. Custom data** - own aware interface plus storer:

```php
#[IsFlowEventAware]
interface CustomExampleDataAware
{
    public const CUSTOM_EXAMPLE_DATA = 'customExampleData';
    public function getCustomExampleData(): string;
}

class CustomExampleDataStorer extends FlowStorer
{
    public function store(FlowEventAware $event, array $stored): array { /* ... */ }
    public function restore(StorableFlow $storable): void { /* $storable->setData(...) */ }
}
```

Core storers carry the DI tag `flow.storer`. Actions read data with `$flow->getStore('...')` / `$flow->getData('...')`.

**4. Trigger list**: a `kernel.event_subscriber` (arg `service(Shopware\Core\Framework\Event\BusinessEventCollector::class)`) listens to `BusinessEventCollectorEvent::NAME => ['onAddExampleEvent', 1000]` - high priority so the event is added before other subscribers - and does `$definition = $this->businessEventCollector->define(ExampleEvent::class)`, then `$event->getCollection()->set($definition->getName(), $definition)`.

## Essential identifiers

- `Shopware\Core\Framework\Event\FlowEventAware`, `Shopware\Core\Framework\Event\IsFlowEventAware`
- `Shopware\Core\Content\Flow\Dispatching\Storer\FlowStorer`, `Shopware\Core\Content\Flow\Dispatching\StorableFlow`
- `Shopware\Core\Framework\Event\BusinessEventCollector`, `BusinessEventCollectorEvent::NAME`

## Gotchas

- Not in 6.7 although the source's table lists them: `ConfirmUrlAware`/`ConfirmUrlStorer`, `ContactFormDataAware`/`ContactFormDataStorer`, `ContentsAware`/`ContentsStorer`, `ContextTokenAware`/`ContextTokenStorer`. The source's `ShopNameAware`/`ShopNameStorer` example is illustrative only - `Shopware\Core\Framework\Event\ShopNameAware` is not in core.
- `CustomerGroupAware` lives in `Shopware\Core\Framework\Event`, not `...\Flow\Dispatching\Aware`.
- Core aware interfaces do not extend `FlowEventAware`; `#[IsFlowEventAware]` marks them. The event itself must implement `FlowEventAware`.
- `BusinessEventCollector::define()` instantiates the event without its constructor before calling `getName()`.

## Version notes

- Custom flow triggers exist since Shopware 6.4.6.0.
- Since 6.5.0.0 actions get `StorableFlow` instead of the original event; `getAvailableData()` no longer supplies data to the Flow Builder.

## Code check (6.7.15.1)
- absent `Shopware\Core\Content\Flow\Dispatching\Aware\ConfirmUrlAware` — not in the 6.7 code index
- absent `Shopware\Core\Content\Flow\Dispatching\Storer\ConfirmUrlStorer` — not in the 6.7 code index
- absent `Shopware\Core\Content\Flow\Dispatching\Aware\ContactFormDataAware` — not in the 6.7 code index
- absent `Shopware\Core\Content\Flow\Dispatching\Storer\ContactFormDataStorer` — not in the 6.7 code index
- absent `Shopware\Core\Content\Flow\Dispatching\Aware\ContentsAware` — not in the 6.7 code index
- absent `Shopware\Core\Content\Flow\Dispatching\Storer\ContentsStorer` — not in the 6.7 code index
- absent `Shopware\Core\Content\Flow\Dispatching\Aware\ContextTokenAware` — not in the 6.7 code index
- absent `Shopware\Core\Content\Flow\Dispatching\Storer\ContextTokenStorer` — not in the 6.7 code index
- absent `Shopware\Core\Framework\Event\ShopNameAware` — not in the 6.7 code index; example-only
- corrected `CustomerGroupAware` — docs: `Shopware\Core\Content\Flow\Dispatching\Aware\CustomerGroupAware`; actually `Shopware\Core\Framework\Event` — vendor/shopware/core/Framework/Event/CustomerGroupAware.php:9
