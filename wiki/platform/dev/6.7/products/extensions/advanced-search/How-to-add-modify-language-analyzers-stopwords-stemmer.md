---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-add-modify-language-analyzers-stopwords-stemmer.md
title: Language analyzers
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-add-modify-language-analyzers-stopwords-stemmer.html
sourceHash: da12858b69ecb288bd85c97236cc775cab3b89eb
codeCheckedAgainst: "6.7.13.0"
keywords: ["language analyzer", "language_analyzer_mapping", "advanced_search", "stopwords", "stemmer", "dictionary_decompounder", "advanced_search_compound_dictionary", "advanced_search_stopword_dictionary", "compound words", "decompounding", "es:index", "multi-language index", "elasticsearch analyzer"]
summary: "Advanced Search: customize Elasticsearch language analyzers, stopword/stemmer filters, language_analyzer_mapping, and compound-word dictionaries."
lastBuilt: 2026-09-15
---
## What it is

Advanced Search (commercial) uses a multi-language Elasticsearch index with the built-in Elasticsearch language analyzers, so language fields get per-language stopwords, stemming and normalization. This page shows how to add or override analyzers and filters, and describes the compound-word decomposition dictionaries.

## When to use

- A language needs a custom analyzer, stopword list or stemmer.
- German (or other) compound nouns should match their parts, e.g. a search for `Jacke` should find `Lederjacke`.

## Key steps / config

1. Override the analyzer parameter in `custom/plugins/SwagCommercial/src/AdvancedSearch/Resources/config/packages/advanced_search.yaml`:

```yaml
advanced_search:
    analysis:
        analyzer:
            sw_your_custom_language_analyzer:
                type: custom
                tokenizer: standard
                filter: ['lowercase', 'my_stopwords_filter', 'my_stemmer_filter']
    filter:
        my_stopwords_filter: { type: 'stop', stopwords: [...] }
        my_stemmer_filter: { type: 'stemmer', language: 'english' }
    language_analyzer_mapping:
        custom_iso: sw_your_custom_language_analyzer
```

2. Map your analyzer to the language ISO code under `language_analyzer_mapping` — the source marks this as important.
3. Compound dictionaries are entities managed via the Admin API:
   - `advanced_search_compound_dictionary` — `wordList` of root words used to split compounds.
   - `advanced_search_stopword_dictionary` — custom `stopwords`, stripped at index and search time.
4. After editing a dictionary run `bin/console es:index` to apply the updated analyzer configuration.

## Essential identifiers

- `advanced_search.analysis.analyzer`, `advanced_search.filter`, `advanced_search.language_analyzer_mapping`
- `dictionary_decompounder` filter
- `sw_<iso>_technical_term_index_analyzer`
- `advanced_search_compound_dictionary`, `advanced_search_stopword_dictionary`
- `bin/console es:index`

## Gotchas

- Decomposition runs at index time only, on the technical-term index analyzer (`sw_<iso>_technical_term_index_analyzer`); search queries are never expanded into parts.
- Stopword dictionary entries apply at both index and search time.
- Dictionary changes take effect only after reindexing with `es:index`.

## Version notes

- `dictionary_decompounder` with a seeded curated German root-word dictionary exists since Commercial 7.12.0.

## Code check (6.7.13.0)
- unverified `advanced_search.language_analyzer_mapping` — config of the commercial extension, not in vendor/shopware core/storefront/administration
- unverified `dictionary_decompounder` — Advanced Search analyzer filter, out of scope
- unverified `sw_<iso>_technical_term_index_analyzer` — defined by the commercial extension, out of scope
- unverified `advanced_search_compound_dictionary` — commercial entity, no match in vendor/shopware/core
- unverified `advanced_search_stopword_dictionary` — commercial entity, no match in vendor/shopware/core
- unverified `es:index` — command lives in the shopware/elasticsearch package, outside the checked roots
