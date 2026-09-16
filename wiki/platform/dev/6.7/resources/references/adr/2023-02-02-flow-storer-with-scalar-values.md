---
id: platform/dev/6.7/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md
title: Flow storer with scalar values
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.html
sourceHash: c29863c405534abe6c4c64a10b4ad3e370dae0de
codeCheckedAgainst: "6.7.13.0"
keywords: ["ScalarValuesAware", "ScalarValuesStorer", "FlowStorer", "FlowEventAware", "StorableFlow", "STORE_VALUES", "getValues", "flow builder", "flow event", "storer", "scalar values", "aware interface"]
summary: "ADR: ScalarValuesAware + ScalarValuesStorer store/restore scalar flow event values generically, replacing per-value Aware interfaces and Storer classes."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record introducing a generic interface, `ScalarValuesAware`, plus one built-in `FlowStorer` implementation, `ScalarValuesStorer`, so flow events can hand simple values (URLs, names, form data) to the flow builder without a dedicated `*Aware` interface and `*Storer` class per value.

## When to use

When writing a flow-capable event that needs to pass scalar or array values into flows, or when replacing old per-value storer/aware pairs.

## Key steps / config

1. Implement `Shopware\Core\Content\Flow\Dispatching\Aware\ScalarValuesAware` on the event next to `FlowEventAware`, returning the values from `getValues()` (`array<string, scalar|array|null>`):

```php
class SomeFlowAwareEvent extends Event implements ScalarValuesAware, FlowEventAware
{
    public function __construct(private readonly string $url, private readonly Context $context) {}
    public function getValues(): array { return ['url' => $this->url]; }
    public static function getAvailableData(): EventDataCollection { /* ... */ }
    public function getName(): string { /* ... */ }
    public function getContext(): Context { return $this->context; }
}
```

2. No storer is needed: `Shopware\Core\Content\Flow\Dispatching\Storer\ScalarValuesStorer` (extends `FlowStorer`) writes `getValues()` into the stored array under `ScalarValuesAware::STORE_VALUES` in `store(FlowEventAware $event, array $stored): array`, and in `restore(StorableFlow $storable): void` calls `$storable->setData($key, $value)` for each entry.
3. A custom storer still extends `FlowStorer` and must implement both abstract methods `store()` and `restore()`.

## Essential identifiers

- `ScalarValuesAware`, `ScalarValuesAware::STORE_VALUES` (value `store_values`), `getValues()`
- `ScalarValuesStorer`, `FlowStorer::store()`, `FlowStorer::restore()`
- `FlowEventAware::getAvailableData()`, `FlowEventAware::getName()`
- `StorableFlow::getStore()`, `StorableFlow::setData()`

## Gotchas

- The ADR's event example implements `ScalarStoreAware`; that name does not exist — the interface is `ScalarValuesAware`.
- The ADR shows `STORE_VALUES = 'scalar_values'`; the installed constant value is `store_values`.
- `ScalarValuesStorer::store()` throws a `RuntimeException` ("Can not store generic values twice.") if the key is already set, and `restore()` returns early when the store key is absent.
- `FlowEventAware` extends `ShopwareEvent`, so the event also needs `getContext()`.

## Version notes

- The ADR deprecated these per-value pairs for removal in v6.6.0.0: ConfirmUrlStorer/ConfirmUrlAware, ContactFormDataStorer/ContactFormDataAware, ContentsStorer/ContentsAware, ContextTokenStorer/ContextTokenAware, DataStorer/DataAware, EmailStorer/EmailAware, MailStorer/MailAware, NameStorer/NameAware, RecipientsStorer/RecipientsAware, ResetUrlStorer/ResetUrlAware, ReviewFormDataStorer/ReviewFormDataAware, ShopNameStorer/ShopNameAware, SubjectStorer/SubjectAware, TemplateDataStorer/TemplateDataAware, UrlStorer/UrlAware.
- In 6.7.13.0 e.g. `ConfirmUrlStorer` and `ContactFormDataStorer` are gone, while a `MailStorer` class and `MailAware` interface still exist; events such as `ReviewFormEvent` implement `ScalarValuesAware`.

## Code check (6.7.13.0)
- confirmed `ScalarValuesAware` — interface in Content/Flow/Dispatching/Aware — vendor/shopware/core/Content/Flow/Dispatching/Aware/ScalarValuesAware.php:10
- corrected `ScalarValuesAware::STORE_VALUES` — docs: `'scalar_values'`; code: `'store_values'` — vendor/shopware/core/Content/Flow/Dispatching/Aware/ScalarValuesAware.php:12
- confirmed `ScalarValuesAware::getValues()` — returns array of scalar/array/null — vendor/shopware/core/Content/Flow/Dispatching/Aware/ScalarValuesAware.php:17
- confirmed `ScalarValuesStorer::store()` — throws on double store — vendor/shopware/core/Content/Flow/Dispatching/Storer/ScalarValuesStorer.php:18
- confirmed `ScalarValuesStorer::restore()` — skips when store key missing — vendor/shopware/core/Content/Flow/Dispatching/Storer/ScalarValuesStorer.php:33
- confirmed `FlowStorer::store()` — abstract, `restore()` abstract at line 19 — vendor/shopware/core/Content/Flow/Dispatching/Storer/FlowStorer.php:17
- confirmed `FlowEventAware::getAvailableData()` — static, `getName()` at line 13 — vendor/shopware/core/Framework/Event/FlowEventAware.php:11
- confirmed `ShopwareEvent::getContext()` — inherited by FlowEventAware — vendor/shopware/core/Framework/Event/ShopwareEvent.php:11
- absent `ScalarStoreAware` — name used in the ADR example; real interface is ScalarValuesAware
- absent `ConfirmUrlStorer` — removed deprecated storer (likewise `ContactFormDataStorer`)
