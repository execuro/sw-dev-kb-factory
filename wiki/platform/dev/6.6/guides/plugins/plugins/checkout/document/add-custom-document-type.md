---
id: platform/dev/6.6/guides/plugins/plugins/checkout/document/add-custom-document-type.md
title: Add custom document type
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/document/add-custom-document-type.html"
sourceHash: "c8d49c6b70940040efb431144bcc792a874d0d0e"
keywords: ["document type", "document_type", "document_type_translation", "AbstractDocumentRenderer", "DocumentGenerateOperation", "document_type.renderer", "number_range", "number_range_type", "ImportTranslationsTrait", "document.renderer", "document_base_config", "MigrationStep"]
summary: "How to add a custom document type via plugin migration, a document renderer implementing AbstractDocumentRenderer, and a matching number range."
lastBuilt: "2026-09-15"
---
## What it is
Guide for adding an entirely new custom document type to a plugin: registering the type in the database, providing a renderer for it, and configuring a number range so documents of that type get numbered.

## When to use
Use when a plugin needs a document type that doesn't exist in Shopware core (e.g. a new kind of generated PDF/HTML document tied to orders), beyond configuring an existing type.

## Key steps / config
1. Add a migration inserting a row into `document_type` (`id`, `technical_name`) and matching translations into `document_type_translation`, using `Shopware\Core\Migration\Traits\ImportTranslationsTrait::importTranslation` with a `Shopware\Core\Migration\Traits\Translations` instance. Also insert default config into `document_base_config` and `document_base_config_sales_channel`.
2. Create a renderer implementing `Shopware\Core\Checkout\Document\Renderer\AbstractDocumentRenderer` with three required methods:
   - `getDecorated(): AbstractDocumentRenderer` — throws `DecorationPatternException` if undecorated.
   - `supports(): string` — returns the type's `technical_name`.
   - `render(array $operations, Context $context, DocumentRendererConfig $rendererConfig): RendererResult` — receives `DocumentGenerateOperation[]`, resolves orders, builds `RenderedDocument` instances (via `DocumentFileRendererRegistry::render()` or manual content), and returns a `RendererResult`.
3. Register the renderer in `services.xml` tagged `document.renderer`. File-extension renderers (e.g. PDF) extending `AbstractDocumentTypeRenderer` are registered with tag `document_type.renderer` and a `key` attribute for the extension:
```xml
<service id="Shopware\Core\Checkout\Document\Service\PdfRenderer">
    <tag name="document_type.renderer" key="pdf"/>
</service>
```
4. Add a Twig template at `<plugin root>/src/Resources/views/documents/<name>.html.twig` extending `@Framework/documents/base.html.twig`.
5. Add a migration for a number range: insert into `number_range_type`, `number_range`, `number_range_sales_channel`, plus translations in `number_range_translation` and `number_range_type_translation` (again via `ImportTranslationsTrait`).

## Essential identifiers
- `Shopware\Core\Checkout\Document\Renderer\AbstractDocumentRenderer`
- `Shopware\Core\Checkout\Document\Renderer\RendererResult` / `RenderedDocument` / `DocumentRendererConfig`
- `Shopware\Core\Checkout\Document\Struct\DocumentGenerateOperation`
- `Shopware\Core\Checkout\Document\Service\DocumentFileRendererRegistry`
- `Shopware\Core\System\NumberRange\ValueGenerator\NumberRangeValueGeneratorInterface`
- Tags: `document.renderer`, `document_type.renderer`
- Tables: `document_type`, `document_type_translation`, `document_base_config`, `document_base_config_sales_channel`, `number_range`, `number_range_type`, `number_range_sales_channel`, `number_range_translation`, `number_range_type_translation`

## Gotchas
Every new document type requires its own `AbstractDocumentRenderer`, otherwise the type appears in Administration but does not work. Make sure to check for an existing Storefront sales channel before inserting `number_range_sales_channel`/`document_base_config_sales_channel` rows, since none may exist.
