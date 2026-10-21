---
id: platform/dev/6.7/concepts/commerce/checkout-concept/document/extension-points.md
title: Extension Points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/document/extension-points.html
sourceHash: b19a48e42671f39810d39602c6b4ab3848d0cef3
codeCheckedAgainst: "6.7.15.1"
keywords: ["document extension points", "shopware.document_v2.type", "shopware.document_v2.provider", "shopware.document_v2.renderer", "document-generation", "AbstractDocumentType", "AbstractDocumentDataProvider", "AbstractDocumentRenderer", "template override", "custom document type", "custom document format", "app script hook"]
summary: Document System (v2) extension points - three tagged services (type, provider, renderer), Twig overrides, and the app document-generation script hook.
lastBuilt: 2026-10-20
---
## What it is

Overview of how the experimental Document System (v2) (flag `DOCUMENT_GENERATION_REWORK`) is extended: three tagged Symfony services plus Twig template overrides. There is no service decoration.

## When to use

When a plugin or app needs to change how a document looks, add data to it, change or add a file format, or add a new kind of document.

## Key steps / config

| You want to | Mechanism | Pipeline stage |
|---|---|---|
| Change how a document looks | Override a document template | renderers |
| Add data to an existing document | Enrich document data (`shopware.document_v2.provider`) | data providers |
| Change how a format is produced | Override a built-in renderer (`shopware.document_v2.renderer`) | renderers |
| Output a new file format | Add a document format (`shopware.document_v2.renderer`) | renderers |
| Create a new kind of document | Add a document type (`shopware.document_v2.type`) | render plan |

Base classes expected per tag in the installed code (namespace `Shopware\Core\Checkout\DocumentV2`):
- `shopware.document_v2.type` → `Type\AbstractDocumentType` (`getTechnicalName()`, `getSupportedFormats()`)
- `shopware.document_v2.provider` → `Provider\AbstractDocumentDataProvider` (`getKey()`, `supports()`, `provideRenderingData()`)
- `shopware.document_v2.renderer` → `Renderer\AbstractDocumentRenderer` (`getFormat()`, `getFileExtension()`, `renderToString()`)

**Plugins** register these tagged services and override templates directly.

**Apps** extend declaratively: the manifest registers a document type, Twig templates render it, and the `document-generation` script hook provides the data.

## Essential identifiers

- `shopware.document_v2.type`, `shopware.document_v2.provider`, `shopware.document_v2.renderer`
- `AbstractDocumentType`, `AbstractDocumentDataProvider`, `AbstractDocumentRenderer`
- `document-generation` (app script hook)

## Gotchas

- Apps cannot add custom formats, renderers or typed data providers; those are plugin-only.
- Experimental: the API can change until v2 becomes the default in 6.8.

## Code check (6.7.15.1)
- confirmed `shopware.document_v2.provider` — provider tag maps to AbstractDocumentDataProvider — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:97
- confirmed `shopware.document_v2.renderer` — renderer tag maps to AbstractDocumentRenderer — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:98
- confirmed `shopware.document_v2.type` — type tag maps to AbstractDocumentType — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:99
- confirmed `AbstractDocumentType::getSupportedFormats()` — abstract member — vendor/shopware/core/Checkout/DocumentV2/Type/AbstractDocumentType.php:22
- confirmed `AbstractDocumentDataProvider::supports()` — abstract member — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:32
- confirmed `AbstractDocumentRenderer::renderToString()` — abstract member — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:52
- confirmed `DocumentGenerationHook::HOOK_NAME` — value document-generation — vendor/shopware/core/Checkout/DocumentV2/Event/Hooks/DocumentGenerationHook.php:25
