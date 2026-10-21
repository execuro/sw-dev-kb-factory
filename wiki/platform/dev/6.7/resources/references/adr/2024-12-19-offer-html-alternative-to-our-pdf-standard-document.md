---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2024-12-19-offer-html-alternative-to-our-pdf-standard-document.md
sourceHash: fe9cfc4512560338437799fa1cafa99ff7d4f86c
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-12-19-offer-html-alternative-to-our-pdf-standard-document.html
title: '"[A11y] Offer HTML alternative to our pdf standard documents"'
version: "6.7"
versions:
  - "6.7"
keywords: ["AbstractDocumentTypeRenderer", "HtmlRenderer", "PdfRenderer", "DocumentFileRendererRegistry", "document_type.renderer", "document_head_meta_protection", "frontend.account.order.single.document.a11y", "a11yDocuments", "accessibility", "a11y", "html documents", "pdf documents", "wcag", "invoice"]
summary: "ADR: accessible HTML versions of standard PDF documents, rendered by AbstractDocumentTypeRenderer services tagged document_type.renderer."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2024-12-19, area accessibility) to provide HTML versions of documents alongside PDFs so documents meet WCAG accessibility requirements. The PDF library DomPDF cannot produce accessible (tagged) PDFs, and few PHP tools can; HTML is naturally structured for assistive technology, and the ADR notes that many organisations already moved from PDF to HTML for this reason.

## When to use

You customise document rendering or document templates, add a new output format, ship custom document types in an extension, or maintain customised mail templates that should link to HTML documents.

## Key steps / config

Affected areas: all default document types (`invoice`, `delivery note`, `credit note`, `cancellation invoice`; extensions must adapt themselves), the Administration order detail page (download HTML alongside PDF) and document settings (toggle HTML generation), Storefront order history (HTML and PDF), Flow Builder "Generate documents" (follows the document settings), and email delivery (a link to the HTML document instead of an attachment; the customer must log in).

1. **Templates**: adapt the `html.twig` document templates for A11y (e.g. `tabindex`, CSS in block `document_style_html` of `style_base_html.css.twig`). `base.html.twig` gains block `document_head_meta_protection`, holding a Content-Security-Policy meta tag (`script-src 'none'; base-uri 'self';`) and a `date` meta tag fingerprinting the generation time.
2. **Renderer**: a file-format renderer extends `Shopware\Core\Checkout\Document\Service\AbstractDocumentTypeRenderer`, which in the installed code declares three abstract methods:

```php
class MyRenderer extends AbstractDocumentTypeRenderer
{
    public function getContentType(): string { /* ... */ }
    public function render(RenderedDocument $document): string { /* ... */ }
    public function getDecorated(): AbstractDocumentTypeRenderer { /* ... */ }
}
```

   Core ships `HtmlRenderer` (`FILE_EXTENSION = 'html'`, `FILE_CONTENT_TYPE = 'text/html'`) and `PdfRenderer`. `HtmlRenderer` sets content type, file extension and content on the `RenderedDocument`, and returns an empty string when the document config's `fileTypes` does not contain `html`.
3. **Service registration**: tag the renderer `document_type.renderer` with a `key`, so `Shopware\Core\Checkout\Document\Service\DocumentFileRendererRegistry` collects it:

```xml
<service id="...\HtmlRenderer">
    <tag name="document_type.renderer" key="html"/>
</service>
```

4. **Mail templates**: customised templates must be migrated by hand; loop over `a11yDocuments` and build links with `rawUrl('frontend.account.order.single.document.a11y', { documentId, deepLinkCode, fileType }, salesChannel.domains|first.url)`.

## Essential identifiers

- `Shopware\Core\Checkout\Document\Service\AbstractDocumentTypeRenderer`
- `Shopware\Core\Checkout\Document\Service\HtmlRenderer`, `PdfRenderer`
- `Shopware\Core\Checkout\Document\Service\DocumentFileRendererRegistry`
- service tag `document_type.renderer` (attribute `key`: `pdf`, `html`)
- Twig block `document_head_meta_protection`
- Storefront route `frontend.account.order.single.document.a11y`; mail variable `a11yDocuments`

## Gotchas

- HTML files are not attached to emails because many mail providers and virus scanners block HTML attachments; a login-protected link is used instead.
- Extensions providing their own document types must add HTML support themselves.

## Version notes

- The ADR adds column `document_a11y_media_file_id` (`BINARY(16)`) to `document` and the field `documentA11yMediaFileId` on `DocumentDefinition`. Both still exist in 6.7.15.1 but are deprecated since v6.7.14.0 (removal in v6.9.0.0) in favour of the `documentFiles` association.
- `AbstractDocumentTypeRenderer`, `HtmlRenderer` and `PdfRenderer` carry an experimental replacement marker for v6.9.0 (feature `DOCUMENT_GENERATION_REWORK`): DocumentV2's `AbstractDocumentRenderer` ships its own HTML, PDF and ZUGFeRD renderers.

## Code check (6.7.15.1)
- confirmed `AbstractDocumentTypeRenderer::getContentType()` — abstract, not shown in the ADR snippet — vendor/shopware/core/Checkout/Document/Service/AbstractDocumentTypeRenderer.php:19
- confirmed `AbstractDocumentTypeRenderer::render()` — abstract, takes RenderedDocument — vendor/shopware/core/Checkout/Document/Service/AbstractDocumentTypeRenderer.php:21
- confirmed `AbstractDocumentTypeRenderer::getDecorated()` — abstract, not shown in the ADR snippet — vendor/shopware/core/Checkout/Document/Service/AbstractDocumentTypeRenderer.php:23
- confirmed `HtmlRenderer::FILE_CONTENT_TYPE` — text/html — vendor/shopware/core/Checkout/Document/Service/HtmlRenderer.php:28
- confirmed `document_type.renderer` — HtmlRenderer tagged with key html — vendor/shopware/core/Checkout/DependencyInjection/document.php:231
- confirmed `DocumentFileRendererRegistry` — collects tagged renderers by key — vendor/shopware/core/Checkout/DependencyInjection/document.php:235
- deprecated `document_a11y_media_file_id` — deprecated v6.7.14.0, replaced by documentFiles — vendor/shopware/core/Checkout/Document/DocumentDefinition.php:83
- confirmed `document_head_meta_protection` — block in base.html.twig — vendor/shopware/core/Framework/Resources/views/documents/base.html.twig:46
- confirmed `frontend.account.order.single.document.a11y` — Storefront route name — vendor/shopware/storefront/Controller/DocumentController.php:49
- confirmed `a11yDocuments` — loop variable in shipped mail templates — vendor/shopware/core/Migration/Fixtures/mails/order_delivery.state.cancelled/de-html.html.twig:13
