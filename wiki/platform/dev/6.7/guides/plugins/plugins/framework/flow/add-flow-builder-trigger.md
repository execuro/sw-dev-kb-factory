---
id: platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md
title: Add Flow Builder Trigger
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.html
sourceHash: f096ef98a9dfd3c3cc412cb9ab5509a33ed33d1a
codeCheckedAgainst: "6.7.13.0"
keywords: ["flow builder trigger", "custom flow event", "FlowEventAware", "CustomerAware", "FlowStorer", "StorableFlow", "IsFlowEventAware", "BusinessEventCollector", "BusinessEventCollectorEvent", "flow.storer", "aware interface", "storer", "ScalarValuesAware"]
summary: Custom Flow Builder trigger - event implementing FlowEventAware plus Aware interfaces, FlowStorer store/restore, registration via BusinessEventCollectorEvent.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/flow-concept.md", "platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md", "platform/dev/6.7/guides/development/troubleshooting/flow-reference.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/add-custom-event.md"]
---
## What it is

How a plugin adds its own event as a Flow Builder trigger (since 6.4.6.0). An event implementing `FlowEventAware` plus Aware interfaces appears in the Administration trigger list and unlocks the actions tied to those interfaces; since 6.5 actions get event data only through `StorableFlow`, filled by `FlowStorer` classes.

## When to use

You dispatch a custom plugin event and want shop owners to attach flows (add/remove tag, send mail, etc.) to it.

## Key steps / config

1. **Event** implementing `Shopware\Core\Framework\Event\FlowEventAware` plus Aware interfaces, e.g. `Shopware\Core\Framework\Event\CustomerAware`:

```php
class ExampleEvent extends Event implements CustomerAware, FlowEventAware
{
    public const EVENT_NAME = 'example.event';
    public function getName(): string { return self::EVENT_NAME; }
    public function getCustomerId(): string { /* ... */ }
    public static function getAvailableData(): EventDataCollection
    { return (new EventDataCollection())->add('customer', new EntityType(CustomerDefinition::class)); }
}
```

2. **Storers**: each Aware interface has a storer whose `store(FlowEventAware $event, array $stored): array` writes ids/values into `$stored` and `restore(StorableFlow $storable): void` reads them back via `hasStore`/`getStore`/`setData`. Core pairs include `CustomerAware`/`Shopware\Core\Content\Flow\Dispatching\Storer\CustomerStorer`, `OrderAware`/`OrderStorer`, `MailAware`/`MailStorer`, `UserAware`/`UserStorer`, `ProductAware`/`ProductStorer`, `CustomerGroupAware`/`CustomerGroupStorer` (all in `Shopware\Core\Framework\Event`), and `Shopware\Core\Content\Flow\Dispatching\Aware\` `ScalarValuesAware`, `CustomerRecoveryAware`, `MessageAware`, `NewsletterRecipientAware`, `OrderTransactionAware`. For plain scalars use `ScalarValuesAware` (`getValues(): array`).

3. **Custom data**: an interface marked `#[IsFlowEventAware]` plus a storer (`FlowStorer` subclasses are autoconfigured with tag `flow.storer`):

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
    public function restore(StorableFlow $storable): void { /* ... */ }
}
```

Actions read data with `$flow->getStore('...')` / `$flow->getData('...')`.

4. **Trigger list**: subscribe to `BusinessEventCollectorEvent::NAME` (`collect.business-events`) with priority `1000`; call `$this->businessEventCollector->define(ExampleEvent::class)`, return if null, else `$event->getCollection()->set($definition->getName(), $definition)`. Register the subscriber with argument `Shopware\Core\Framework\Event\BusinessEventCollector` and tag `kernel.event_subscriber`. Verify under Settings > Flow Builder > Add flow.

## Essential identifiers

- `Shopware\Core\Framework\Event\FlowEventAware`, `Shopware\Core\Framework\Event\IsFlowEventAware`
- `Shopware\Core\Content\Flow\Dispatching\Storer\FlowStorer`, tag `flow.storer`
- `Shopware\Core\Content\Flow\Dispatching\StorableFlow`
- `Shopware\Core\Framework\Event\BusinessEventCollector`, `BusinessEventCollectorEvent`

## Gotchas

- Use a high subscriber priority (docs: 1000) so the event is added before other `BusinessEventCollectorEvent` subscribers.
- `BusinessEventCollector::define()` counts only interfaces carrying `#[IsFlowEventAware]` as awareness; core Aware interfaces do not extend `FlowEventAware`.
- The doc lists `ConfirmUrlAware`, `ContactFormDataAware`, `ContentsAware`, `ContextTokenAware` (with storers) and a `ShopNameAware`/`ShopNameStorer` example; none exist in 6.7.13.0.

## Version notes

- 6.5.0.0: actions use `StorableFlow`; `getAvailableData` no longer delivers data to actions.

## Code check (6.7.13.0)
- absent `Shopware\Core\Content\Flow\Dispatching\Aware\ConfirmUrlAware` — not in installed code
- absent `Shopware\Core\Content\Flow\Dispatching\Storer\ConfirmUrlStorer` — not in installed code
- absent `Shopware\Core\Content\Flow\Dispatching\Aware\ContactFormDataAware` — not in installed code
- absent `Shopware\Core\Content\Flow\Dispatching\Storer\ContactFormDataStorer` — not in installed code
- absent `Shopware\Core\Content\Flow\Dispatching\Aware\ContentsAware` — not in installed code
- absent `Shopware\Core\Content\Flow\Dispatching\Storer\ContentsStorer` — not in installed code
- absent `Shopware\Core\Content\Flow\Dispatching\Aware\ContextTokenAware` — not in installed code
- absent `Shopware\Core\Content\Flow\Dispatching\Storer\ContextTokenStorer` — not in installed code
- absent `Shopware\Core\Framework\Event\ShopNameAware` — not in installed code; no ShopNameStorer either
- corrected `CustomerGroupAware` — docs: Shopware\Core\Content\Flow\Dispatching\Aware\CustomerGroupAware — vendor/shopware/core/Framework/Event/CustomerGroupAware.php:9
