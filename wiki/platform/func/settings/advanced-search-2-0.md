---
id: platform/func/settings/advanced-search-2-0.md
title: Advanced Search 2 0
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/advanced-search-2-0"
sourceHash: 2b5924d32de12ea7bcb7b291c60509b631cc62cf285c99e267c4e7a1d2f0da30
revision:
  current: true
  range: "6.7.12.0 - 6.7.12.2"
  swMin: "6.7.12.0"
  swMax: "6.7.12.2"
keywords: ["advanced search", "OpenSearch", "preserved_chars", "search behaviour", "search strictness", "boosting", "synonyms", "AI Copilot", "search by image", "shopware commercial", "searchable content", "search terms"]
summary: Documents Advanced Search (OpenSearch-based) configuration — search behaviour, boostings, synonyms, actions and AI Copilot.
lastBuilt: 2026-09-15
---
## What it is

Advanced Search, part of the Commercial extension (Evolve plan and above), runs entirely on OpenSearch since Shopware 6.5.6.0 and is configured under **Settings > General > Search**.

## When to use

Used to fine-tune search matching, boost specific products/categories/manufacturers, define synonyms, create search-term redirects, or enable AI-assisted search (context/image based).

## Key steps / config

Requires an OpenSearch instance and the Commercial extension active. Special characters allowed in product numbers for indexing are set in `preserved_chars` inside `vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml`:

```yaml
preserved_chars: ['-', '_', '+', '.', '@']
```

To extend it, create `config/packages/shopware.yaml` (a `lock.yaml`-only setup requires adding this file) with:

```yaml
shopware:
  search:
    preserved_chars: ['-', '_', '+', '.', '@', '/']
```

**Search behaviour** (per sales channel): when Advanced Search is disabled, choose broad (OR) or exact (AND) search and a minimum search term length; when enabled, choose a search strictness level from **Very loose (OR)** through **Very strict (AND)**.

**Searchable content**: per product/category/manufacturer, configure whether content is **Searchable**, its **Ranking score**, and whether to **Split search terms** on characters like `-` or `/`.

**Boostings** (from Commercial Plugin Version 5.5.0): raise relevance for a **Dynamic product group** or an **Entity** (category/manufacturer) match, each with Name, Boost value, Active, Active from/until.

**Actions**: redirect customers who search specific terms to a product, category, or URL, with Active-from/to windows.

**Synonyms**: two rule types — **Equivalence** (mutually interchangeable terms) and **Explicit Mapping** (search terms mapped to broader match terms).

**AI Copilot** (Shopware Rise plan and above, Commercial extension active): natural-language product search in the storefront, configured per sales channel with a mandatory **Sales channel context** field, an optional **Search by context** toggle, and **Search by image** support (PNG/JPEG uploads, images not saved, results limited to three products).

## Essential identifiers

- `preserved_chars` — config key in `vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml`, overridable in `config/packages/shopware.yaml`
- **Settings > General > Search**
- Search strictness levels: Very loose, Loose, Balanced, Strict, Very strict
- Synonym rules: Equivalence, Explicit Mapping

## Gotchas

New Shopware projects and some updated installations only ship a `lock.yaml` under `config/packages/` — a `shopware.yaml` file must be created manually to override `preserved_chars`. AI Copilot's Sales channel context field is mandatory and cannot be saved empty; context-search keyword entry is limited to 100 characters.

## Version notes

AdvancedSearch has used OpenSearch exclusively since Shopware 6.5.6.0. Boostings require Commercial Plugin Version 5.5.0 or later. AI Copilot requires at least the Shopware Rise plan.
