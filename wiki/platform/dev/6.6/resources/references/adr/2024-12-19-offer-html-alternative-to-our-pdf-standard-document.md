---
id: platform/dev/6.6/resources/references/adr/2024-12-19-offer-html-alternative-to-our-pdf-standard-document.md
title: '"[A11y] Offer HTML alternative to our pdf standard documents"'
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-12-19-offer-html-alternative-to-our-pdf-standard-document.html
sourceHash: fe9cfc4512560338437799fa1cafa99ff7d4f86c
keywords: ["AbstractDocumentTypeRenderer", "HtmlRenderer", "PdfRenderer", "document_type.renderer", "DocumentFileRendererRegistry", "document_a11y_media_file_id", "DocumentDefinition", "html.twig", "Content-Security-Policy", "WCAG", "accessibility", "invoice"]
summary: "ADR adding HTML document alternatives to PDF invoices via AbstractDocumentTypeRenderer/HtmlRenderer for WCAG accessibility compliance."
lastBuilt: 2026-09-15
---
## What it is

This ADR decides to offer HTML alternatives alongside PDF documents (invoice, delivery note, credit note, cancellation invoice) so Shopware's document solution meets WCAG accessibility requirements, since the DomPDF-based PDF generation does not.

## When to use

When a document renderer, order/document settings, or email delivery flow needs to account for an HTML A11y version of a standard document in addition to the PDF version.

## Key steps / config

- Introduce an abstract class for multi-format rendering, `src/Core/Checkout/Document/Service/AbstractDocumentTypeRenderer`:

```php
abstract class AbstractDocumentTypeRenderer
{
    abstract public function render(RenderedDocument $document): string;
}

class HtmlRenderer extends AbstractDocumentTypeRenderer { /* ... */ }
class PdfRenderer extends AbstractDocumentTypeRenderer {}
```

- Register the renderer with the service tag `document_type.renderer` so `Shopware\Core\Checkout\Document\Service\DocumentFileRendererRegistry` recognizes it:

```xml
<service id="...\HtmlRenderer">
    <tag name="document_type.renderer" key="html"/>
</service>
```

- Add a new column `document_a11y_media_file_id` (`BINARY(16)`) to the `document` table, and an `FkField('document_a11y_media_file_id', 'documentA11yMediaFileId', MediaDefinition::class)` in `src/Core/Checkout/Document/DocumentDefinition.php`.
- Adjust `html.twig` templates (e.g. `src/Core/Framework/Resources/views/documents/invoice.html.twig`) to add `tabindex` and A11y-friendly CSS, and add a `document_head_meta_protection` Twig block with a `Content-Security-Policy` meta tag.

## Essential identifiers

- `Shopware\Core\Checkout\Document\Service\AbstractDocumentTypeRenderer`
- `Shopware\Core\Checkout\Document\Service\DocumentFileRendererRegistry`
- `document_type.renderer` (service tag)
- `document_a11y_media_file_id`
- `src/Core/Framework/Resources/views/documents/invoice.html.twig`
- `src/Core/Framework/Resources/views/documents/base.html.twig`

## Gotchas

The HTML document cannot be attached directly to the notification email because many mail providers block HTML attachments (virus-scanner concerns); instead the email links to the document, requiring the customer to log in to view it.
