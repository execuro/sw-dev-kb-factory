---
id: platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md
title: New language inheritance mechanism for opensearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.html
sourceHash: e8bc2d5252fee12b76b605716efa5b7eb209cce8
codeCheckedAgainst: "6.7.15.1"
keywords: ["elasticsearch", "opensearch", "multilingual index", "language fallback", "ES_MULTILINGUAL_INDEX", "es:index", "sw_product", "translated_field_sorting", "numeric_translated_field_sorting", "painless script", "multi_match", "sw_ngram_analyzer", "object field mapping"]
summary: "ADR 2023-04-11: one OpenSearch index per entity for all languages; translated fields map as per-language objects, with fallback search and sorting."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-04-11, area Core/Elasticsearch) that replaces "one Elasticsearch/OpenSearch index per language" with a single index per searchable entity (e.g. `sw_product`) covering all languages. Each translated field is mapped as an object whose keys are language IDs, and queries fall back across languages at search time instead of duplicating default-language data into every index.

## When to use

- Understanding the mapping shape of translated fields in the Shopware product search index.
- Writing custom queries or sorting against translated fields in the index.
- Planning a reindex after enabling or upgrading to the multilingual index.

## Key steps / config

Problems with the per-language approach, as stated by the ADR: many indices/shards (each has cluster overhead, especially on cloud); every record update had to be written to every language index; no fallback, so non-translatable data was duplicated in every index.

New mapping criteria:

1. One index per searchable entity for all languages (e.g. `sw_product`).
2. Each translated field is an `object field`; each language ID is a key.
3. Search uses `multi_match` over `<field>.<context_lang_id>`, `<field>.<parent_current_lang_id>` and `<field>.<default_lang_id>` as fallback.
4. Sorting applies the same fallback via painless scripts (`Framework/Indexing/Scripts/translated_field_sorting.groovy`, `numeric_translated_field_sorting.groovy`).
5. Adding a language or updating a record is a partial update rather than a full document replace.

Mapping shape (`PUT /sw_product/_mapping`):

```json
{ "mappings": { "properties": {
    "productNumber": { "type": "keyword" },
    "name": { "properties": {
        "<language_id>": { "type": "keyword", "fields": {
            "text":  { "type": "text", "analyzer": "<language analyzer>" },
            "ngram": { "type": "text", "analyzer": "sw_ngram_analyzer" } } } } } } } }
```

Sorting shape: a `sort` entry with `_script` → `type: "string"`, `script.id: "translated_field_sorting"`, `script.params.field` and `script.params.languages` (context language ID first, then fallback), plus `order`.

When a new language is created, a `PUT /sw_product/_mapping` adds a `<new_language_id>` sub-property to each translated field with that language's stop-words analyzer.

## Essential identifiers

- `sw_product` (index), `sw_ngram_analyzer`
- `translated_field_sorting`, `numeric_translated_field_sorting` (painless sort scripts)
- `bin/console es:index`

## Gotchas

- After the feature is activated, the shop must reindex with `bin/console es:index`.
- Old language-based indices are no longer used from the next major version and can be removed from the cluster.

## Version notes

- The ADR introduced the opt-in feature flag `ES_MULTILINGUAL_INDEX`; per the ADR, from the next major the multilingual index replaces the per-language indices. In 6.7.15.1 no such flag is registered in core.

## Code check (6.7.15.1)
- unverified `ES_MULTILINGUAL_INDEX` — not present in core/storefront/administration; the Elasticsearch package is outside the checked roots
- unverified `translated_field_sorting` — painless script lives in the Elasticsearch package, outside the checked roots
- unverified `numeric_translated_field_sorting` — Elasticsearch package, outside the checked roots
- unverified `es:index` — command defined in the Elasticsearch package, outside the checked roots
- unverified `sw_ngram_analyzer` — Elasticsearch package, outside the checked roots
