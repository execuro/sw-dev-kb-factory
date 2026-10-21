---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/handler.md
title: Handlers
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/handler.html
sourceHash: ea9632474175ea97663ece6a5bf5376c1357d683
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractFieldTransformer", "b2b.migration.transformer", "ExtensionDispatcher", "FieldTransformerRegistry", "B2BMigrationFieldTransformerExtension", "requiredSourceFields", "_transform", "getName", "handler attribute", "field transformer", "b2b suite migration", "b2b commercial"]
summary: "B2B Suite migration handlers: AbstractFieldTransformer classes tagged b2b.migration.transformer, named in the XML handler attribute."
lastBuilt: 2026-10-21
---
## What it is

Handlers are PHP classes used by the B2B Suite to B2B Commercial migration to apply custom logic to source data before it is written to target field(s). A handler is referenced from the XML mapping via the `handler` attribute of a `<field>` element; the attribute value is the handler's technical name.

## When to use

When a plain `source` to `target` field mapping is not enough: values must be computed, several source columns combine into one target, one source feeds several targets, or a target value is generated with no source at all.

## Key steps / config

1. Reference the handler in the mapping XML. Supported shapes:

```xml
<field source="foo" target="permissions" handler="b2b.employee.employee_status_transformer"/>
<field target="permissions" handler="b2b.employee.employee_status_transformer"/>
<field target="quote_number" handler="...">
    <source>currency_factor</source>
    <source>auth_id.b2b_store_front_auth.customer_id.customer.sales_channel_id</source>
</field>
<field handler="...">
    <source>list_id</source><source>mode</source>
    <target>order_id</target><target>order_version_id</target>
</field>
```

   Source elements may be relational paths (dot-separated, as above).

2. Implement a class extending `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\DataTransformer\AbstractFieldTransformer`. Its constructor injects `Shopware\Core\Framework\Extensions\ExtensionDispatcher` and passes it to `parent::__construct($extensions)`.
3. Implement `getName(): string` returning the unique technical name used in the XML (e.g. `'b2b.employee.employee_status_transformer'`); `FieldTransformerRegistry` resolves handlers by this name.
4. Implement `protected function requiredSourceFields(): array` listing the source fields needed, e.g. `['foo', 'bar']`.
5. Implement the transformation, `protected function _transform(Field $field, array $sourceRecord): mixed`:
   - `$field->getSource()` returns the single source field name; `$field->getSourceElements()` returns the array of source names for multiple sources.
   - `$sourceRecord` holds the current record, keyed by source field name or relational path (e.g. `$sourceRecord[$field->getSource()]`).
   - Return a single value for one target, or an associative array keyed by target field name for several targets.
6. Register the service lazily with the tag:

```php
$services->set(Shopware\Commercial\B2B\B2BSuiteMigration\Components\QuoteManagement\DataTransformer\QuoteComment\StateTransformer::class)
    ->lazy()
    ->args([service(Shopware\Core\Framework\Extensions\ExtensionDispatcher::class)])
    ->tag('b2b.migration.transformer');
```

## Essential identifiers

- `AbstractFieldTransformer` (B2B Commercial), `FieldTransformerRegistry`, `Field`
- service tag `b2b.migration.transformer`
- `getName()`, `requiredSourceFields()`, `_transform()`
- `ExtensionDispatcher`, `Shopware\Core\Framework\Extensions\Extension`
- `B2BMigrationFieldTransformerExtension` — extension published under the handler's technical name

## Gotchas

- The source is inconsistent: prose says `requiredFields` while the code uses `requiredSourceFields()`, and the signature section names `_transform` while the examples show a public `transform(Field $field, array $sourceRecord)`. Check the installed B2B Commercial base class before choosing.
- Marking the service `lazy` is the stated best practice so handlers load only when used.
- To change a handler's behavior without editing it, subscribe to the `B2BMigrationFieldTransformerExtension` (an `Extension` subclass) published with the handler's technical name.

## Code check (6.7.15.1)
- confirmed `ExtensionDispatcher` — final readonly class in core, the constructor dependency handlers receive — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:9
- confirmed `ExtensionDispatcher::publish()` — dispatches pre/post/error events around the extended operation — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `Extension` — abstract base class that B2BMigrationFieldTransformerExtension extends — vendor/shopware/core/Framework/Extensions/Extension.php:13
- unverified `AbstractFieldTransformer` — B2B Commercial class, not in vendor/shopware core/storefront/administration
- unverified `b2b.migration.transformer` — tag defined by B2B Commercial, out of scope
- unverified `FieldTransformerRegistry` — B2B Commercial class, out of scope
- unverified `B2BMigrationFieldTransformerExtension` — B2B Commercial class, out of scope
