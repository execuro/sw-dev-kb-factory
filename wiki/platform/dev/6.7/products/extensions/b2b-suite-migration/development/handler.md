---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/handler.md
title: Handlers
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/handler.html
sourceHash: ea9632474175ea97663ece6a5bf5376c1357d683
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite migration", "migration handler", "field transformer", "AbstractFieldTransformer", "b2b.migration.transformer", "FieldTransformerRegistry", "ExtensionDispatcher", "requiredSourceFields", "_transform", "getName", "B2BMigrationFieldTransformerExtension", "xml field mapping", "handler attribute"]
summary: B2B Suite migration handlers - AbstractFieldTransformer classes tagged b2b.migration.transformer, used via the handler attribute in XML field mappings.
lastBuilt: 2026-09-15
---
## What it is

How to create and register handlers (field transformers) that apply custom PHP logic to source data during the migration from B2B Suite to B2B Commercial, before the result is mapped to one or more target fields.

## When to use

When a plain field mapping is not enough: a value must be computed, several source columns combine into one target, or one handler fills several targets.

## Key steps / config

1. Reference the handler by technical name in the `handler` attribute of `<field>`. Shapes: `source` attribute + `target` attribute, `target` only (value generated), or nested `<source>`/`<target>` elements for many-to-one, many-to-many and one-to-many:

```xml
<field source="foo" target="permissions" handler="b2b.employee.employee_status_transformer"/>
<field handler="b2b.employee.employee_status_transformer">
    <source>currency_factor</source>
    <source>auth_id.b2b_store_front_auth.customer_id.customer.sales_channel_id</source>
    <target>state_id</target>
    <target>expiration_date</target>
</field>
```

2. Extend `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\DataTransformer\AbstractFieldTransformer`; inject `Shopware\Core\Framework\Extensions\ExtensionDispatcher` and pass it to the parent constructor:

```php
class StateTransformer extends AbstractFieldTransformer
{
    public function __construct(ExtensionDispatcher $extensions) { parent::__construct($extensions); }
    public function getName(): string { return 'b2b.employee.employee_status_transformer'; }
    protected function requiredSourceFields(): array { return ['foo', 'bar']; }
    protected function _transform(Field $field, array $sourceRecord): mixed { /* ... */ }
}
```

3. `getName()` returns the unique technical name used in the XML; `FieldTransformerRegistry` resolves handlers by it.
4. `requiredSourceFields()` lists the source fields the transformation needs.
5. In `_transform()`, read the single source name with `$field->getSource()` and values from `$sourceRecord` (keys are source field names or relational paths). Return one value for a single target, or an associative array keyed by target field name (e.g. `order_id`, `order_version_id`) for several targets.
6. Register with the tag `b2b.migration.transformer`, preferably lazy:

```php
$services->set(StateTransformer::class)->lazy()
    ->args([service(Shopware\Core\Framework\Extensions\ExtensionDispatcher::class)])
    ->tag('b2b.migration.transformer');
```

7. To extend a handler without modifying it, subscribe to the `B2BMigrationFieldTransformerExtension` extension (extends `Shopware\Core\Framework\Extensions\Extension`), published under the handler's technical name.

## Essential identifiers

- `AbstractFieldTransformer`, `FieldTransformerRegistry`, `Field`
- `b2b.migration.transformer`
- `getName()`, `requiredSourceFields()`, `_transform()`, `Field::getSource()`
- `ExtensionDispatcher`, `B2BMigrationFieldTransformerExtension`

## Gotchas

- The source is inconsistent: prose names `requiredFields` and `transform`, signatures show `requiredSourceFields()` and `_transform()`. The base class is not in the installed core, so this could not be settled.
- For multiple sources the source uses `$field->getSourceElements()` (array of configured source names); it is not in the installed vendor/shopware roots — verify against the Commercial extension.

## Code check (6.7.13.0)
- confirmed `ExtensionDispatcher` — final readonly core class injected into handlers — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:9
- confirmed `ExtensionDispatcher::publish()` — publishes an `Extension` under a name — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `Extension` — abstract base of extension points — vendor/shopware/core/Framework/Extensions/Extension.php:13
- unverified `AbstractFieldTransformer` — Shopware Commercial class, not in vendor/shopware roots
- unverified `b2b.migration.transformer` — tag consumed by the Commercial extension, out of scope
- unverified `FieldTransformerRegistry` — Commercial class, out of scope
- unverified `B2BMigrationFieldTransformerExtension` — Commercial class, out of scope
- unverified `getSourceElements` — Commercial `Field` method, not in vendor/shopware roots
