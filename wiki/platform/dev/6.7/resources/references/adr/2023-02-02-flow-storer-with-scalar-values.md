---
id: platform/dev/6.7/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md
title: Flow storer with scalar values
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.html
sourceHash: c29863c405534abe6c4c64a10b4ad3e370dae0de
codeCheckedAgainst: "6.7.15.1"
keywords: ["ScalarValuesAware", "ScalarValuesStorer", "FlowStorer", "FlowEventAware", "StorableFlow", "STORE_VALUES", "getValues", "flow builder", "flow storer", "scalar values", "aware interface", "adr", "flow data storage"]
summary: "ADR: generic ScalarValuesAware interface plus ScalarValuesStorer store/restore scalar flow event data, replacing per-value Aware/Storer pairs."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-02-02) introducing one generic way to persist simple scalar data of flow events. Instead of one `*Aware` interface plus one `FlowStorer` subclass per value (URL, contents, name, subject, ...), an event implements `ScalarValuesAware` and returns its values from `getValues()`; the generic `ScalarValuesStorer` stores and restores them one to one.

## When to use

- You write a custom flow event (`FlowEventAware`) that must carry simple values (strings, ints, arrays, null) into flow actions, e.g. a URL or a name for a mail template.
- You maintain a plugin that implemented its own storer only to store and restore scalar values.

## Key steps / config

1. Implement `Shopware\Core\Content\Flow\Dispatching\Aware\ScalarValuesAware` on the event, next to `FlowEventAware`, and return the values keyed by the name under which they become available as flow data:

```php
class SomeFlowAwareEvent extends Event implements ScalarValuesAware, FlowEventAware
{
    public function __construct(private readonly string $url) { }
    public static function getAvailableData(): EventDataCollection { /* ... */ }
    public function getName(): string { /* ... */ }
    public function getValues(): array
    {
        return ['url' => $this->url];
    }
}
```

2. Nothing else is needed: `Shopware\Core\Content\Flow\Dispatching\Storer\ScalarValuesStorer` (extends `FlowStorer`) stores `getValues()` under `ScalarValuesAware::STORE_VALUES` in `store()`, and in `restore()` calls `StorableFlow::setData($key, $value)` for every stored entry.

3. A custom storer still extends the abstract `FlowStorer` and must declare both `store(FlowEventAware $event, array $stored): array` and `restore(StorableFlow $storable): void`.

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\Aware\ScalarValuesAware` — constant `STORE_VALUES`, method `getValues(): array`
- `Shopware\Core\Content\Flow\Dispatching\Storer\ScalarValuesStorer`
- `Shopware\Core\Content\Flow\Dispatching\Storer\FlowStorer` — `store()`, `restore()`
- `Shopware\Core\Framework\Event\FlowEventAware` — `getAvailableData()`, `getName()`
- `StorableFlow::getStore()`, `StorableFlow::setData()`

## Gotchas

- The ADR's event snippet implements `ScalarStoreAware` and its consequences list says events move to `ScalarStoreAware`; no such interface exists in the code. The real interface is `ScalarValuesAware`.
- The ADR shows `STORE_VALUES = 'scalar_values'`; the installed constant value is `'store_values'`. Always use the constant, not the literal.
- `ScalarValuesStorer::store()` throws a `RuntimeException` ("Can not store generic values twice.") if the store key is already set, and `restore()` returns early when nothing was stored — the ADR snippet has neither check.
- An event's `FlowEventAware` side still needs `getAvailableData()` and `getName()`; the ADR snippet omits them.

## Version notes

- The ADR deprecated these storer/interface pairs in favour of the scalar approach, to be removed in v6.6.0.0: ConfirmUrlStorer/ConfirmUrlAware, ContactFormDataStorer/ContactFormDataAware, ContentsStorer/ContentsAware, ContextTokenStorer/ContextTokenAware, DataStorer/DataAware, EmailStorer/EmailAware, MailStorer/MailAware, NameStorer/NameAware, RecipientsStorer/RecipientsAware, ResetUrlStorer/ResetUrlAware, ReviewFormDataStorer/ReviewFormDataAware, ShopNameStorer/ShopNameAware, SubjectStorer/SubjectAware, TemplateDataStorer/TemplateDataAware, UrlStorer/UrlAware.
- In 6.7 the listed scalar storers are gone from the storer directory; `MailStorer` (for `MailAware`) still exists. Core events such as `CustomerPasswordChangedEvent` implement `ScalarValuesAware`.

## Code check (6.7.15.1)
- confirmed `ScalarValuesAware` — interface with `getValues(): array` — vendor/shopware/core/Content/Flow/Dispatching/Aware/ScalarValuesAware.php:10
- corrected `STORE_VALUES` — docs: value 'scalar_values'; code: 'store_values' — vendor/shopware/core/Content/Flow/Dispatching/Aware/ScalarValuesAware.php:12
- confirmed `ScalarValuesStorer` — extends FlowStorer — vendor/shopware/core/Content/Flow/Dispatching/Storer/ScalarValuesStorer.php:11
- corrected `store` — docs: plain write; code throws RuntimeException if values already stored — vendor/shopware/core/Content/Flow/Dispatching/Storer/ScalarValuesStorer.php:18
- confirmed `restore` — returns early without stored values, else setData per key — vendor/shopware/core/Content/Flow/Dispatching/Storer/ScalarValuesStorer.php:33
- confirmed `FlowStorer` — abstract base with abstract store() and restore() — vendor/shopware/core/Content/Flow/Dispatching/Storer/FlowStorer.php:10
- confirmed `getAvailableData` — static method required by FlowEventAware — vendor/shopware/core/Framework/Event/FlowEventAware.php:11
- confirmed `getName` — required by FlowEventAware — vendor/shopware/core/Framework/Event/FlowEventAware.php:13
- absent `ScalarStoreAware` — not found in the installed code; the interface is ScalarValuesAware
- absent `ConfirmUrlStorer` — removed, as the ADR planned for 6.6
