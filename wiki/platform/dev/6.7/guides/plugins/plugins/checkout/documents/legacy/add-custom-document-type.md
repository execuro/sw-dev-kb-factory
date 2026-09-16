---
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/legacy/add-custom-document-type.md
title: Add Custom Document Type
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/legacy/add-custom-document-type.html
sourceHash: bbde92e56080d81dec75daee13007b858157bc49
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractDocumentRenderer", "document.renderer", "RendererResult", "RenderedDocument", "DocumentFileRendererRegistry", "DocumentConfigLoader", "NumberRangeValueGeneratorInterface", "ImportTranslationsTrait", "document_type", "document_base_config", "number_range_type", "custom document type", "document renderer", "legacy document system"]
summary: Legacy documents - add a custom document type via migrations (type, base config, number range) and an AbstractDocumentRenderer tagged document.renderer.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md"]
---
## What it is

Guide for the legacy document system: adding a custom document type to a plugin — database entries for the type and its base configuration, a renderer class with a Twig template, and a number range for document numbers.

## When to use

When a plugin needs an additional document type (next to invoice, delivery note, etc.) on the legacy document system. For new development the source points to the Document System (v2).

## Key steps / config

1. **Document type migration** (see [database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)): insert into `document_type` (`id`, `technical_name` e.g. `example`, `created_at`), translations into `document_type_translation`, then rows into `document_base_config` and `document_base_config_sales_channel`:

```php
$connection->insert('document_base_config', [
    'id' => ..., 'name' => self::TYPE, 'global' => 1,
    'filename_prefix' => self::TYPE . '_',
    'document_type_id' => $documentTypeId,
    'config' => json_encode($defaultConfig, \JSON_THROW_ON_ERROR),
    'created_at' => ...,
]);
```

   Translations use `Shopware\Core\Migration\Traits\ImportTranslationsTrait` (`importTranslation($table, $translations, $connection)`) with `new Shopware\Core\Migration\Traits\Translations($german, $english)`, each array including the ID column.

2. **Renderer** extending `Shopware\Core\Checkout\Document\Renderer\AbstractDocumentRenderer`:

```php
class ExampleDocumentRenderer extends AbstractDocumentRenderer
{
    public const DEFAULT_TEMPLATE = '@SwagBasicExample/documents/example_document.html.twig';
    final public const TYPE = 'example';

    public function supports(): string { return self::TYPE; }

    public function render(array $operations, Context $context, DocumentRendererConfig $rendererConfig): RendererResult
    { /* per order: load config, build RenderedDocument, addSuccess/addError */ }

    public function getDecorated(): AbstractDocumentRenderer
    { throw new DecorationPatternException(self::class); }
}
```

   In `render`: load config with `DocumentConfigLoader::load(self::TYPE, $salesChannelId, $context)` and merge `$operation->getConfig()`; get the number via `NumberRangeValueGeneratorInterface::getValue('document_' . self::TYPE, $context, $salesChannelId, $operation->isPreview())`; build `new RenderedDocument($number, $config->buildName(), $operation->getFileType(), $config->jsonSerialize())`, call `setTemplate()`, `setOrder()`, `setContext()`, then `setContent($this->fileRendererRegistry->render($doc))` (or set XML/CSV content manually). Collect with `RendererResult::addSuccess()` / `addError()`; static (uploaded) operations skip rendering.

3. **Service registration** in `src/Resources/config/services.php`:

```php
$services->set(ExampleDocumentRenderer::class)
    ->args([service('order.repository'), service(DocumentConfigLoader::class),
        service(NumberRangeValueGeneratorInterface::class), service(DocumentFileRendererRegistry::class)])
    ->tag('document.renderer');
```

4. **Template** `<plugin root>/src/Resources/views/documents/example_document.html.twig` beginning with `{% sw_extends '@Framework/documents/base.html.twig' %}`, overriding blocks (see [customizing templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md)).

5. **Number range migration**: `number_range_type` (`technical_name` `document_example`, `global` 0), `number_range` (`type_id`, `pattern` `{n}`, `start` 10000), `number_range_sales_channel` (only if a storefront sales channel exists, via `Defaults::SALES_CHANNEL_TYPE_STOREFRONT`), plus `number_range_translation` (`name`) and `number_range_type_translation` (`type_name`).

## Essential identifiers

- `Shopware\Core\Checkout\Document\Renderer\AbstractDocumentRenderer`
- `Shopware\Core\Checkout\Document\Renderer\RendererResult`, `RenderedDocument`, `DocumentRendererConfig`
- `Shopware\Core\Checkout\Document\Struct\DocumentGenerateOperation`
- `Shopware\Core\Checkout\Document\Service\DocumentConfigLoader`, `DocumentFileRendererRegistry`
- `Shopware\Core\System\NumberRange\ValueGenerator\NumberRangeValueGeneratorInterface`
- DI tag `document.renderer`

## Gotchas

- A document type without a renderer appears in the Administration but does not work; without a number range no document numbers are generated.
- The number range type technical name must equal the `'document_' . <type>` string passed to `getValue`.
- The source's service snippets import `...\Core\Checkout\Document\Render\ExampleDocumentRenderer` (`Render`), while the class is declared in `...\Document\Renderer` — use the real namespace.
- `importTranslation` is `protected` on the trait; call it from within the migration.

## Version notes

- The legacy document system is deprecated and will be removed with Shopware 6.9; Document System (v2) is experimental since 6.7. In 6.7.13.0 v2 sits behind the `DOCUMENT_GENERATION_REWORK` feature flag (default `false`), and `AbstractDocumentRenderer` has no `@deprecated` annotation yet.

## Code check (6.7.13.0)
- confirmed `AbstractDocumentRenderer::supports()` — abstract; `render()` line 26, `getDecorated()` line 28 — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:21
- confirmed `document.renderer` — autoconfigured for AbstractDocumentRenderer subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:126
- confirmed `DocumentConfigLoader::load()` — `(string $documentType, string $salesChannelId, Context $context)` — vendor/shopware/core/Checkout/Document/Service/DocumentConfigLoader.php:51
- confirmed `DocumentFileRendererRegistry::render()` — takes RenderedDocument, returns string — vendor/shopware/core/Checkout/Document/Service/DocumentFileRendererRegistry.php:21
- confirmed `RenderedDocument::setTemplate()` — setter exists — vendor/shopware/core/Checkout/Document/Renderer/RenderedDocument.php:126
- confirmed `RendererResult::addSuccess()` — `addError()` at line 26 — vendor/shopware/core/Checkout/Document/Renderer/RendererResult.php:21
- confirmed `NumberRangeValueGeneratorInterface::getValue()` — `(string $type, Context, ?string $salesChannelId, bool $preview = false)` — vendor/shopware/core/System/NumberRange/ValueGenerator/NumberRangeValueGeneratorInterface.php:17
- confirmed `ImportTranslationsTrait::importTranslation()` — protected — vendor/shopware/core/Migration/Traits/ImportTranslationsTrait.php:13
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, `update()` at line 33 — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `DOCUMENT_GENERATION_REWORK` — experimental flag, default false — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
