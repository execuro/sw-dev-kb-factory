---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/legacy/add-custom-document-type.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
  - platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md
sourceHash: bbde92e56080d81dec75daee13007b858157bc49
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/legacy/add-custom-document-type.html
title: Add Custom Document Type
version: "6.7"
versions:
  - "6.7"
keywords: ["AbstractDocumentRenderer", "document.renderer", "RendererResult", "RenderedDocument", "DocumentGenerateOperation", "DocumentFileRendererRegistry", "DocumentConfigLoader", "NumberRangeValueGeneratorInterface", "ImportTranslationsTrait", "document_type", "document_base_config", "number_range_type", "custom document type", "document renderer", "legacy documents"]
summary: "Legacy documents: custom document type via migrations (type, base config, number range) plus an AbstractDocumentRenderer tagged document.renderer."
lastBuilt: 2026-10-21
---
## What it is

Guide for the legacy document system (deprecated, removed in Shopware 6.9; successor is the experimental Document System v2 since 6.7). Adding a custom document type takes three parts: a database entry for the type plus its base configuration, a renderer class, and a number range.

## When to use

When a plugin on the legacy system needs a new document type (technical name e.g. `example`) with its own renderer, Twig template and document numbers.

## Key steps / config

1. **Document type migration** (`MigrationStep`, see [database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)):
   - insert into `document_type` (`id`, `technical_name`, `created_at`);
   - add German/English rows to `document_type_translation` (type FK + `name`) with `Shopware\Core\Migration\Traits\ImportTranslationsTrait::importTranslation($table, $translations, $connection)` and `new Shopware\Core\Migration\Traits\Translations($german, $english)`;
   - insert a `document_base_config` row (`id`, `name`, `global` = 1, `filename_prefix`, `created_at`, plus the type reference and default settings — see Gotchas for the deprecated columns) and a `document_base_config_sales_channel` row (`id`, `document_base_config_id`). Default settings used: `displayPrices`, `displayFooter`, `displayHeader`, `displayLineItems`, `displayLineItemPosition`, `displayPageCount`, `displayCompanyAddress`, `pageOrientation`, `pageSize`, `itemsPerPage`, `companyName`, `taxNumber`, `vatId`, `taxOffice`, `bankName`, `bankIban`, `bankBic`, `placeOfJurisdiction`, `placeOfFulfillment`, `executiveDirector`, `referencedDocumentType`.

```php
class Migration1616677952AddDocumentType extends MigrationStep
{
    use ImportTranslationsTrait;
    public function getCreationTimestamp(): int { return 1616677952; }
    public function update(Connection $connection): void { /* inserts above */ }
}
```

2. **Renderer** extending `Shopware\Core\Checkout\Document\Renderer\AbstractDocumentRenderer`, placed e.g. in `<plugin root>/src/Core/Checkout/Document/Renderer`:

```php
class ExampleDocumentRenderer extends AbstractDocumentRenderer
{
    final public const TYPE = 'example';
    public const DEFAULT_TEMPLATE = '@SwagBasicExample/documents/example_document.html.twig';

    public function supports(): string { return self::TYPE; }

    /** @param array<string, DocumentGenerateOperation> $operations keyed by orderId */
    public function render(array $operations, Context $context, DocumentRendererConfig $rendererConfig): RendererResult { /* ... */ }

    public function getDecorated(): AbstractDocumentRenderer { throw new DecorationPatternException(self::class); }
}
```

   Inside `render()`: load orders by `$operation->getOrderId()`, load settings with `DocumentConfigLoader::load(self::TYPE, $salesChannelId, $context)` and `merge()` the operation's settings, get the number via `NumberRangeValueGeneratorInterface::getValue('document_' . self::TYPE, $context, $salesChannelId, $operation->isPreview())`, build `new RenderedDocument($number, $name, $operation->getFileType(), $settings)`, then `setTemplate()`, `setOrder()`, `setContext()` and `setContent($this->fileRendererRegistry->render($doc))`. Collect results with `RendererResult::addSuccess($orderId, $doc)` / `addError($orderId, $exception)`. Static (manually uploaded) operations, `isStatic()`, skip rendering. Content may also be set manually (e.g. XML or CSV).

3. **Service registration** in `src/Resources/config/services.php` (see [dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)):

```php
$services->set(ExampleDocumentRenderer::class)
    ->args([
        service('order.repository'),
        service(DocumentConfigLoader::class),
        service(NumberRangeValueGeneratorInterface::class),
        service(DocumentFileRendererRegistry::class),
    ])
    ->tag('document.renderer');
```

4. **Template** `<plugin root>/src/Resources/views/documents/example_document.html.twig` starting with `{% sw_extends '@Framework/documents/base.html.twig' %}` and overriding blocks (see [customize templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md)).

5. **Number range migration**: rows in `number_range_type` (`technical_name` = `document_example`, `global` 0), `number_range` (`type_id`, `pattern` `{n}`, `start`), `number_range_sales_channel` (only if a Storefront sales channel exists, looked up via `Defaults::SALES_CHANNEL_TYPE_STOREFRONT`), plus `number_range_translation` (`name`) and `number_range_type_translation` (`type_name`) via `ImportTranslationsTrait`.

## Essential identifiers

- `Shopware\Core\Checkout\Document\Renderer\AbstractDocumentRenderer` — `supports()`, `render()`, `getDecorated()`
- `Shopware\Core\Checkout\Document\Renderer\RendererResult`, `RenderedDocument`, `DocumentRendererConfig`
- `Shopware\Core\Checkout\Document\Struct\DocumentGenerateOperation`
- `Shopware\Core\Checkout\Document\Service\DocumentConfigLoader`, `DocumentFileRendererRegistry`
- `Shopware\Core\System\NumberRange\ValueGenerator\NumberRangeValueGeneratorInterface`
- Service tag `document.renderer`; template `@Framework/documents/base.html.twig`
- Tables `document_type`, `document_type_translation`, `document_base_config`, `document_base_config_sales_channel`, `number_range_type`, `number_range`, `number_range_sales_channel`

## Gotchas

- A document type without a matching renderer shows up in the Administration but does not work.
- `supports()` must return exactly the `technical_name`; the number range type must be named `document_<technical_name>` to match the `getValue()` call.
- The source writes the base config's type reference as `document_type_id` and its settings as a JSON `config` column. In 6.7.15.1 `document_base_config.document_type_id` (still required) and `document_base_config_sales_channel.document_type_id` are deprecated since v6.7.14.0 in favour of `type_name`, and `document_base_config.config` is deprecated since v6.7.11.0; all are removed in v6.9.0.0.
- The source's migration spells the key `diplayLineItemPosition` (typo); `DocumentConfiguration` has both that property and `displayLineItemPosition` — use the latter.
- The source's `services.php` imports the renderer from namespace `...\Document\Render\` while the class lives in `...\Document\Renderer\`; keep them consistent.
- Subclasses of `AbstractDocumentRenderer` are autoconfigured with `document.renderer`, so the explicit tag is redundant but harmless.

## Version notes

- `AbstractDocumentRenderer`, `DocumentConfigLoader` and `DocumentFileRendererRegistry` carry `ExperimentalReplacement` for `v6.9.0` under feature `DOCUMENT_GENERATION_REWORK`; in v2 document types are type classes with data providers and renderers only produce output formats.

## Code check (6.7.15.1)
- confirmed `AbstractDocumentRenderer::supports()` — abstract, returns string — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:29
- confirmed `AbstractDocumentRenderer::render()` — abstract, (array, Context, DocumentRendererConfig): RendererResult — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:34
- confirmed `AbstractDocumentRenderer::getDecorated()` — abstract — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:36
- confirmed `ExperimentalReplacement` — legacy base replaced in v6.9.0 by DocumentV2 renderer — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:21
- confirmed `document.renderer` — collected by DocumentRendererRegistry via tagged_iterator — vendor/shopware/core/Checkout/DependencyInjection/document.php:171
- confirmed `DocumentConfigLoader::load()` — (documentType, salesChannelId, Context) — vendor/shopware/core/Checkout/Document/Service/DocumentConfigLoader.php:57
- confirmed `NumberRangeValueGeneratorInterface::getValue()` — (type, Context, ?salesChannelId, preview) — vendor/shopware/core/System/NumberRange/ValueGenerator/NumberRangeValueGeneratorInterface.php:17
- deprecated `document_type_id` — on document_base_config since v6.7.14.0, replaced by typeName — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:98
- deprecated `config` — document_base_config JSON field since v6.7.11.0 — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:97
- corrected `displayLineItemPosition` — docs: diplayLineItemPosition; both properties exist — vendor/shopware/core/Checkout/Document/DocumentConfiguration.php:55
