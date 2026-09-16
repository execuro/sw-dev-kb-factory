---
id: platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md
title: New language inheritance mechanism for opensearch
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.html
sourceHash: e8bc2d5252fee12b76b605716efa5b7eb209cce8
codeCheckedAgainst: "6.7.13.0"
keywords: ["ES_MULTILINGUAL_INDEX", "es:index", "translated_field_sorting", "numeric_translated_field_sorting", "sw_product", "sw_ngram_analyzer", "multi_match", "painless script", "elasticsearch", "opensearch", "multilingual index", "language fallback", "translated fields"]
summary: "ADR 2023: one OpenSearch index per entity with per-language object fields, fallback multi_match and painless sorting, behind ES_MULTILINGUAL_INDEX."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-04-11, area: Core, Elasticsearch) replacing one Elasticsearch/OpenSearch index per language with a single index per searchable entity, where translated fields hold one sub-field per language and searches fall back across languages.

## When to use

When working on multilingual Storefront search with Elasticsearch/OpenSearch, custom ES field mappings for translated fields, or sorting on translated fields.

## Key steps / config

Problems with per-language indexes: many indexes/shards to manage (costly on cloud), every update written to every language index, no search fallback so default-language data is duplicated into each index.

Decision:
1. Opt in via feature flag `ES_MULTILINGUAL_INDEX`.
2. One index per searchable entity for all languages (e.g. `sw_product`).
3. Each translated field is mapped as an object field keyed by language ID.
4. Search uses `multi_match` over `<translated_field>.<context_lang_id>`, `<translated_field>.<parent_current_lang_id>` and `<translated_field>.<default_lang_id>` as fallback.
5. Sorting uses painless scripts `Framework/Indexing/Scripts/translated_field_sorting.groovy` and `Framework/Indexing/Scripts/numeric_translated_field_sorting.groovy`.
6. New languages or record updates use partial updates instead of replacing whole documents.
7. After activating the feature, reindex with `bin/console es:index`.

New mapping shape (`PUT /sw_product/_mapping`):

```json
{ "mappings": { "properties": {
  "productNumber": { "type": "keyword" },
  "name": { "properties": {
    "en": { "type": "keyword", "fields": {
      "text":  { "type": "text", "analyzer": "sw_english_analyzer" },
      "ngram": { "type": "text", "analyzer": "sw_ngram_analyzer" } } },
    "de": { "...": "same shape, sw_german_analyzer" } } } } } }
```

Sort request shape (`GET /sw_product/_search`):

```json
{ "sort": [ { "_script": { "type": "string",
  "script": { "id": "translated_field_sorting",
    "params": { "field": "name", "languages": ["<context_lang_id>", "<fallback_lang_id>"] } },
  "order": "DESC" } } ] }
```

Adding a language sends `PUT /sw_product/_mapping` adding `name.properties.<new_language_id>` with a `text` sub-field using `<new_language_stop_words_analyzer>` and an `ngram` sub-field using `sw_ngram_analyzer`.

## Essential identifiers

- `ES_MULTILINGUAL_INDEX`
- `sw_product`, `sw_ngram_analyzer`, `sw_english_analyzer`, `sw_german_analyzer`
- `translated_field_sorting`, `numeric_translated_field_sorting`
- `bin/console es:index`

## Gotchas

- The old structure mapped `name` directly as `keyword` with `text`/`ngram` sub-fields in a per-language index; the new structure nests those per language ID.
- The ADR's search example uses `title.de.search`/`title.en.search` field names, which do not match the `text`/`ngram` sub-fields of its own mapping example.
- The Elasticsearch/OpenSearch integration lives in the separate `shopware/elasticsearch` package, which is not installed here, so none of these identifiers could be verified against code.

## Version notes

- From the next major after the ADR, old language-based indexes are no longer used and can be removed from the cluster.

## Code check (6.7.13.0)
- unverified `ES_MULTILINGUAL_INDEX` — shopware/elasticsearch not installed; no match in core, storefront or administration
- unverified `translated_field_sorting` — painless script lives in shopware/elasticsearch, not installed
- unverified `numeric_translated_field_sorting` — painless script lives in shopware/elasticsearch, not installed
- unverified `es:index` — console command in shopware/elasticsearch, not installed
- unverified `sw_ngram_analyzer` — ES analyzer config in shopware/elasticsearch, not installed
