---
id: platform/dev/6.6/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md
title: Flow storer with scalar values
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.html"
sourceHash: "c29863c405534abe6c4c64a10b4ad3e370dae0de"
keywords: ["FlowStorer", "ScalarValuesAware", "ScalarValuesStorer", "FlowEventAware", "StorableFlow", "flow events", "scalar values", "STORE_VALUES", "flow builder", "Aware interface deprecation", "event storer"]
summary: "ADR introducing a generic `ScalarValuesAware`/`ScalarValuesStorer` pair replacing many single-purpose flow `*Aware`/`*Storer` classes."
lastBuilt: "2026-09-15"
---
## What it is
This ADR introduces a generic `ScalarValuesAware` interface and a matching `ScalarValuesStorer` implementation to replace the many single-purpose `FlowStorer` implementations that previously existed just to store and restore simple scalar values on flow events.

## When to use
Relevant when implementing a new flow event that needs to expose simple scalar data to the Flow Builder, or when maintaining/migrating code that currently uses one of the older `*Aware`/`*Storer` pairs listed below.

## Key steps / config
An event implements `ScalarValuesAware` and returns its data from `getValues()`:

```php
interface ScalarValuesAware
{
    public const STORE_VALUES = 'scalar_values';
    /** @return array<string, scalar|null|array> */
    public function getValues(): array;
}
```

```php
class SomeFlowAwareEvent extends Event implements ScalarStoreAware, FlowEventAware
{
    public function __construct(private readonly string $url) { }
    public function getValues(): array
    {
        return ['url' => $this->url];
    }
}
```

The generic `ScalarValuesStorer` (extends `FlowStorer`) stores the values under `ScalarValuesAware::STORE_VALUES` and restores them onto the `StorableFlow` via `setData()`.

The following storer/interface pairs are deprecated in favor of this mechanism: `ConfirmUrlStorer`/`ConfirmUrlAware`, `ContactFormDataStorer`/`ContactFormDataAware`, `ContentsStorer`/`ContentsAware`, `ContextTokenStorer`/`ContextTokenAware`, `DataStorer`/`DataAware`, `EmailStorer`/`EmailAware`, `MailStorer`/`MailAware`, `NameStorer`/`NameAware`, `RecipientsStorer`/`RecipientsAware`, `ResetUrlStorer`/`ResetUrlAware`, `ReviewFormDataStorer`/`ReviewFormDataAware`, `ShopNameStorer`/`ShopNameAware`, `SubjectStorer`/`SubjectAware`, `TemplateDataStorer`/`TemplateDataAware`, `UrlStorer`/`UrlAware`.

## Essential identifiers
- `ScalarValuesAware` (interface, constant `STORE_VALUES`)
- `ScalarValuesStorer` (extends `FlowStorer`)
- `StorableFlow::getStore()` / `StorableFlow::setData()`

## Gotchas
The deprecated `*Aware`/`*Storer` classes remain usable until removal in `v6.6.0.0`; both mechanisms must stay compatible with each other until then, so new code should target `ScalarValuesAware` directly rather than adding another single-purpose storer.
