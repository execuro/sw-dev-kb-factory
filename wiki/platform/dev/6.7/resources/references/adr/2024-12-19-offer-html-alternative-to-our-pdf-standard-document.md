---
id: platform/dev/6.7/resources/references/adr/2024-12-19-offer-html-alternative-to-our-pdf-standard-document.md
title: '"[A11y] Offer HTML alternative to our pdf standard documents"'
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-12-19-offer-html-alternative-to-our-pdf-standard-document.html
sourceHash: fe9cfc4512560338437799fa1cafa99ff7d4f86c
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractDocumentTypeRenderer", "HtmlRenderer", "PdfRenderer", "document_type.renderer", "DocumentFileRendererRegistry", "document_a11y_media_file_id", "a11yDocuments", "frontend.account.order.single.document.a11y", "document_head_meta_protection", "html documents", "accessibility", "a11y", "pdf alternative", "invoice"]
summary: "ADR: Shopware generates accessible HTML documents next to PDFs via AbstractDocumentTypeRenderer, the document_type.renderer tag and a11y media file link."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2024-12-19, area accessibility): because DomPDF cannot produce accessible (tagged) PDFs, Shopware offers HTML versions of standard documents alongside PDFs to meet WCAG.

## When to use

Read this when customising document templates, writing a custom document file renderer, or adapting customised order mail templates to link the HTML (A11y) document.

## Key steps / config

Scope: default types `invoice`, `delivery note`, `credit note`, `cancellation invoice` (extensions adapt their own). Administration: HTML download on order detail, toggle in Document Settings. Storefront order history offers both formats. Mails link to the HTML document (login required) instead of attaching it.

1. **Templates** — document `html.twig` templates get A11y additions (e.g. `tabindex` in block `document_headline`); HTML styles sit in block `document_style_html` of `style_base_html.css.twig`.
2. **Metadata/CSP** — `base.html.twig` block `document_head_meta_protection`:
   ```twig
   {% block document_head_meta_protection %}
       <meta http-equiv="Content-Security-Policy" content="script-src 'none'; base-uri 'self';">
       <meta name="date" content="{{ 'now'|date('c') }}">
   {% endblock %}
   ```
3. **Renderer** — extend `Shopware\Core\Checkout\Document\Service\AbstractDocumentTypeRenderer`, which requires three members:
   ```php
   class HtmlRenderer extends AbstractDocumentTypeRenderer
   {
       public function getContentType(): string { /* 'text/html' */ }
       public function render(RenderedDocument $document): string { /* ... */ }
       public function getDecorated(): AbstractDocumentTypeRenderer { /* ... */ }
   }
   ```
4. **Registration** — tag the service `document_type.renderer` with a `key`; `Shopware\Core\Checkout\Document\Service\DocumentFileRendererRegistry` collects tagged services indexed by `key`:
   ```xml
   <service id="...\HtmlRenderer">
       <tag name="document_type.renderer" key="html"/>
   </service>
   ```
5. **Schema** — column `document_a11y_media_file_id` (`BINARY(16)`) on `document`, mapped in `DocumentDefinition` as `FkField('document_a11y_media_file_id', 'documentA11yMediaFileId', MediaDefinition::class)` with `ApiAware`.
6. **Mail migration** — customised mail templates must loop over `a11yDocuments` and build links with route `frontend.account.order.single.document.a11y` (params `documentId`, `deepLinkCode`, `fileType`), as in the core `invoice_mail` fixtures.

## Essential identifiers

- `AbstractDocumentTypeRenderer`, `HtmlRenderer`, `PdfRenderer`, `DocumentFileRendererRegistry`
- `document_type.renderer` (tag with `key`)
- `document_a11y_media_file_id` / `documentA11yMediaFileId`
- `a11yDocuments`, `frontend.account.order.single.document.a11y`
- `document_head_meta_protection`, `document_style_html`

## Gotchas

- The ADR's abstract class sketch lists only `render()`; the installed base also declares abstract `getContentType()` and `getDecorated()`.
- HTML files are not attached to mails because many providers/virus scanners reject HTML attachments; customised mail templates are not updated automatically.

## Code check (6.7.13.0)
- corrected `AbstractDocumentTypeRenderer::getContentType()` — docs: abstract class declares only render() — vendor/shopware/core/Checkout/Document/Service/AbstractDocumentTypeRenderer.php:11
- confirmed `AbstractDocumentTypeRenderer::render()` — abstract, takes RenderedDocument, returns string — vendor/shopware/core/Checkout/Document/Service/AbstractDocumentTypeRenderer.php:13
- corrected `AbstractDocumentTypeRenderer::getDecorated()` — docs: not mentioned; abstract in installed base — vendor/shopware/core/Checkout/Document/Service/AbstractDocumentTypeRenderer.php:15
- confirmed `HtmlRenderer` — extends AbstractDocumentTypeRenderer, FILE_EXTENSION 'html' — vendor/shopware/core/Checkout/Document/Service/HtmlRenderer.php:16
- confirmed `document_type.renderer` — HtmlRenderer tagged with key="html" — vendor/shopware/core/Checkout/DependencyInjection/document.xml:166
- confirmed `DocumentFileRendererRegistry` — receives tagged_iterator document_type.renderer indexed by key — vendor/shopware/core/Checkout/DependencyInjection/document.xml:169
- confirmed `document_a11y_media_file_id` — FkField documentA11yMediaFileId with ApiAware — vendor/shopware/core/Checkout/Document/DocumentDefinition.php:67
- confirmed `document_head_meta_protection` — CSP and date meta block in base template — vendor/shopware/core/Framework/Resources/views/documents/base.html.twig:46
- confirmed `frontend.account.order.single.document.a11y` — Storefront route name — vendor/shopware/storefront/Controller/DocumentController.php:49
- confirmed `a11yDocuments` — used in invoice_mail de-plain fixture — vendor/shopware/core/Migration/Fixtures/mails/invoice_mail/de-plain.html.twig:7
