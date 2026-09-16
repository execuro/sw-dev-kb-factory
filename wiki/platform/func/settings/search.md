---
id: platform/func/settings/search.md
title: "Search"
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/search"
sourceHash: "8b2b8d7dcf23838f2d5bb94c12af57205f06a5d6d298ae849a875e793ea29ee0"
revision:
  current: true
  range: "6.7.0.0 - 6.7.11.1"
  swMin: "6.7.0.0"
  swMax: "6.7.11.1"
keywords: ["search settings", "preserved_chars", "MySQL search", "Elasticsearch", "Advanced Search", "AI Copilot", "search by context", "search by image", "ranking score", "split search terms", "minimum search term length", "live search", "rebuild search index", "searchable content"]
summary: "Configures product search behavior, searchable content weighting, Advanced Search (Elasticsearch) and AI Copilot under Settings > General > Search."
lastBuilt: "2026-09-15"
---
## What it is

The Search settings page (Settings > General > Search) configures how product search behaves for a sales channel, covering the built-in MySQL search, optional Elasticsearch-based Advanced Search, and the AI Copilot conversational/image search feature.

## When to use

Use this page to tune search behavior (AND/OR term matching, minimum search term length), configure which product/category/manufacturer fields are searchable and how they're weighted, exclude terms from search, rebuild the search index, or enable Advanced Search / AI Copilot for a sales channel.

## Key steps / config

- Special characters in product numbers: by default only a limited set of characters is allowed for the built-in MySQL search (Elasticsearch handles special characters automatically and needs no extra config). The allowed set is defined in `/src/Core/Framework/Resources/config/packages/shopware.yaml` under `preserved_chars`:
```
preserved_chars: ['-', '_', '+', '.', '@']
```
To extend it, create `config/packages/shopware.yaml` and override the setting, e.g.:
```
shopware:
  search:
    preserved_chars: ['-', '_', '+', '.', '@', '/']
```
- Search behavior: choose **and** (all terms must match) or **or** (any term matches) matching; the minimum search term length is 2 characters (shorter terms are ignored), and the maximum is 255 characters.
- Searchable content: per-section configuration (General, Custom fields) lets you toggle whether a field is Searchable, set its Ranking score, and enable Split search terms (splits terms like `PT-64/515` on special characters). Fields include product name/number/description/EAN, manufacturer name/number, category name, custom search terms, meta title/description, property name/value, and product tag.
- Excluded search terms: maintain a list of keywords excluded from search results.
- Live search: use "Rebuild search index" to reindex, and the Sales Channel live search preview to test ranked results for a chosen sales channel without visiting the storefront.
- Advanced Search (Commercial extension, Shopware Evolve plan or higher; included for SaaS customers) is Elasticsearch-based and adds a configurable minimum-match percentage for multi-word queries (e.g. 50% match returns results matching at least two of three terms) and German compound-word splitting (e.g. "Lederjacke" is also indexed as "Jacke").
- AI Copilot (Commercial extension, Shopware Rise plan or higher) adds natural-language "search by context" (max 100 characters, requires a per-sales-channel description) and search-by-image (PNG/JPEG upload, limited to 3 results), configured per sales channel and per language.

## Essential identifiers

- Settings > General > Search
- `preserved_chars` config key (`config/packages/shopware.yaml`, under `shopware.search`)
- Search behavior: **and** / **or** matching, minimum search term length (2), maximum (255)
- Searchable content flags: Searchable, Ranking score, Split search terms
- Advanced Search (Elasticsearch-based, Commercial extension)
- AI Copilot: Search by context, Search by image

## Gotchas

- The `preserved_chars` override only applies to the built-in MySQL search; Elasticsearch installations need no extra configuration for special characters.
- Improved search accuracy (decimal/spacing/product-number normalization) and improved relevance ranking only apply when Elasticsearch is enabled for product search.
- New Shopware projects, and updated installs whose `config/packages/` .yaml files were left at defaults, may contain only a `lock.yaml` file — create `shopware.yaml` yourself before adding these overrides.
- Custom searchable content is limited to custom fields of type number or text field.
- Search by context in AI Copilot is deactivated by default and requires a mandatory Sales Channel description (max 100 characters) before it can be saved.

## Version notes

Advanced Search requires the Commercial extension from the Shopware Evolve plan; SaaS customers get it without extra installation. AI Copilot requires the Commercial extension and at least the Shopware Rise plan.
