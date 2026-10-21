---
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/_index.md
title: v2
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/v2/
sourceHash: d850cc3a24f4f9ca16043a1a3b27b361897611a2
codeCheckedAgainst: "6.7.15.1"
keywords: ["document system v2", "DOCUMENT_GENERATION_REWORK", "DocumentV2", "document type", "format renderer", "document data provider", "document template", "invoice pdf", "experimental feature flag", "plugin documents"]
summary: "Index of the experimental Document System v2 guides (DOCUMENT_GENERATION_REWORK): document types, format renderers, data and template overrides."
lastBuilt: 2026-10-21
---
## What it is

Entry page for the plugin-developer guides on the reworked Document System (v2), the experimental document generation implemented under the `Shopware\Core\Checkout\DocumentV2` namespace. It is activated with the `DOCUMENT_GENERATION_REWORK` feature flag; its API can change until it becomes the default with Shopware 6.8.

## When to use

When a plugin needs to extend document generation in the v2 system: add a new kind of document, output a new file format, replace a built-in renderer, add data to existing documents, or override document Twig templates.

## Key steps / config

Prerequisites: a running plugin and the `DOCUMENT_GENERATION_REWORK` feature flag enabled for testing.

The guides in this section cover three tasks:

1. **Add a document type** - a type class (extends `AbstractDocumentType`), a data provider (extends `AbstractDocumentDataProvider`), a Twig template, and the number range that numbers the documents.
2. **Add a format renderer** - output a new file format (extends `AbstractDocumentRenderer`), or replace a built-in renderer through tag priority.
3. **Customize document data and templates** - add data to documents you did not create (extra data providers for an existing type) and override the Twig templates under `@Framework/documents/` that render them.

## Essential identifiers

- `DOCUMENT_GENERATION_REWORK` (feature flag)
- `Shopware\Core\Checkout\DocumentV2\Type\AbstractDocumentType`
- `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`
- `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`

## Version notes

- Shopware 6.7: experimental, behind `DOCUMENT_GENERATION_REWORK` (default off); the API can still change.
- Shopware 6.8: planned to become the default document system; the v2 classes carry `@experimental stableVersion:v6.8.0`.

## Code check (6.7.15.1)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag defined with `default: false`, described as experimental — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `AbstractDocumentType` — abstract readonly base for v2 document types, experimental until v6.8.0 — vendor/shopware/core/Checkout/DocumentV2/Type/AbstractDocumentType.php:13
- confirmed `AbstractDocumentDataProvider` — abstract readonly base for v2 data providers — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:22
- confirmed `AbstractDocumentRenderer` — abstract readonly base for v2 format renderers — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:23
