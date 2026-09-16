---
id: platform/dev/6.6/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md
title: New language inheritance mechanism for opensearch
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.html"
sourceHash: "e8bc2d5252fee12b76b605716efa5b7eb209cce8"
keywords: ["opensearch", "elasticsearch", "multilingual search", "language inheritance", "ES_MULTILINGUAL_INDEX", "sw_product", "object field", "multi_match", "painless script", "translated_field_sorting", "es:index", "fallback language"]
summary: "ADR: opensearch/ES switches to one multilingual index per entity using object-field mapping with language-id keys and multi_match fallback."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record describing a new multilingual Elasticsearch/OpenSearch indexing strategy: instead of one index per language, each searchable entity gets a single index covering all languages.

## When to use
Relevant when working on Shopware's Elasticsearch/OpenSearch product search indexing, multi-language shops, or debugging search relevance/sorting across languages.

## Key steps / config
- New feature flag `ES_MULTILINGUAL_INDEX` opts in to the new behavior.
- Each translated field is mapped as an `object field`, keyed by `language_id`.
- Searching uses multi-match across `<translated_field>.<context_lang_id>`, `<translated_field>.<parent_current_lang_id>`, and `<translated_field>.<default_lang_id>` as fallback.
- Sorting uses painless scripts `Framework/Indexing/Scripts/translated_field_sorting.groovy` and `Framework/Indexing/Scripts/numeric_translated_field_sorting.groovy`.
- New/updated language records trigger a partial document update rather than a full replace.

New mapping shape (`PUT /sw_product/_mapping`):
```json
{
    "mappings": {
        "properties": {
            "name": {
                "properties": {
                    "en": { "type": "keyword", "fields": { "text": {}, "ngram": {} } },
                    "de": { "type": "keyword", "fields": { "text": {}, "ngram": {} } }
                }
            }
        }
    }
}
```

## Essential identifiers
- `ES_MULTILINGUAL_INDEX` feature flag
- `sw_product` index
- `Framework/Indexing/Scripts/translated_field_sorting.groovy`
- `Framework/Indexing/Scripts/numeric_translated_field_sorting.groovy`
- `bin/console es:index`

## Gotchas
When a new language is added, a mapping update request is required to add the new language key. From the next major version, old per-language indexes are no longer used and can be removed from the ES cluster. When the feature is activated, the shop must reindex using `bin/console es:index` on the next update.
