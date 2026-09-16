---
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/_index.md
title: Documents
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/
sourceHash: 52421b0b81580b3995118a5633f900890592d292
codeCheckedAgainst: "6.7.13.0"
keywords: ["documents", "document system v2", "legacy document system", "DOCUMENT_GENERATION_REWORK", "AbstractDocumentRenderer", "document.renderer", "document generation", "invoice", "delivery note", "feature flag"]
summary: Entry page for plugin document guides - choose between the reworked Document System (v2) for new work and the legacy system removed in 6.9.
lastBuilt: 2026-09-15
---
## What it is

Overview page for the checkout document guides. Shopware is moving from the legacy document system to the reworked Document System (v2); the page splits the guides into two groups:

- **Document System (v2)** — the reworked system, recommended for new development.
- **Legacy document system** — deprecated, removed in Shopware 6.9.

## When to use

When a plugin generates or customizes order documents (e.g. adding a document type or renderer) and you need to decide which document system's guides apply to the targeted Shopware version.

## Essential identifiers

- `DOCUMENT_GENERATION_REWORK` — the 6.7.13.0 feature flag that enables the new document generation implementation and its accompanying Administration UI changes.
- `Shopware\Core\Checkout\Document\Renderer\AbstractDocumentRenderer` and the DI tag `document.renderer` — the renderer contract used by the legacy guides.

## Gotchas

- In the installed core the v2 flag is marked experimental and defaults to `false`, so v2 behaviour is not active unless the flag is enabled.
- The legacy renderer base class carries no `@deprecated` annotation in 6.7.13.0, even though the docs declare the legacy system deprecated.

## Version notes

- Legacy document system: deprecated, removed with Shopware 6.9.
- Document System (v2): the successor; experimental in 6.7.

## Code check (6.7.13.0)
- confirmed `DOCUMENT_GENERATION_REWORK` — major, toggleable, default false, described as experimental — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `DOCUMENT_GENERATION_REWORK` — read by the document settings Administration page — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-document/page/sw-settings-document-detail/sw-settings-document-detail.html.twig:49
- confirmed `AbstractDocumentRenderer` — legacy renderer base, no deprecation annotation — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:19
- confirmed `document.renderer` — autoconfigured tag for renderers — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:126
