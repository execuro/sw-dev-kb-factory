---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-add-modify-language-analyzers-stopwords-stemmer.md
title: Language analyzers
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-add-modify-language-analyzers-stopwords-stemmer.html
sourceHash: da12858b69ecb288bd85c97236cc775cab3b89eb
codeCheckedAgainst: "6.7.15.1"
keywords: ["language analyzer", "language_analyzer_mapping", "advanced_search", "stopwords", "stemmer", "dictionary_decompounder", "compound words", "advanced_search_compound_dictionary", "advanced_search_stopword_dictionary", "es:index", "elasticsearch analysis", "multi-language index", "decompounding"]
summary: "Advanced Search: add/override Elasticsearch language analyzers, stopword and stemmer filters, language_analyzer_mapping, and compound-word dictionaries."
lastBuilt: 2026-10-21
---
## What it is

How the commercial Advanced Search extension configures per-language Elasticsearch analysis for its multi-language index: built-in language analyzers (stopwords, stemmers, normalization), custom analyzers/filters, and compound-word decomposition via editable dictionaries.

## When to use

When search results for a language need different stopwords, stemming or analyzers than the built-in defaults, or when closed compound nouns (e.g. German `Lederjacke`, `Akkubohrer`) should be matched by their parts (`Jacke`).

## Key steps / config

1. Override the analyzer parameter in `custom/plugins/SwagCommercial/src/AdvancedSearch/Resources/config/packages/advanced_search.yaml`.
2. Define the analyzer under `analysis.analyzer`, its filters under `filter`, and map it to a language ISO code under `language_analyzer_mapping`:

```yaml
advanced_search:
    analysis:
        analyzer:
            sw_your_custom_language_analyzer:
                type: custom
                tokenizer: standard
                filter: ['lowercase', 'my_stopwords_filter', 'my_stemmer_filter']
    filter:
        my_stopwords_filter: { type: 'stop', stopwords: ['foo', 'bar'] }
        my_stemmer_filter: { type: 'stemmer', language: 'english' }
    language_analyzer_mapping:
        custom_iso: sw_your_custom_language_analyzer
```

3. Compound words: manage dictionaries through the Admin API entities `advanced_search_compound_dictionary` (field `wordList` of root words) and `advanced_search_stopword_dictionary` (field `stopwords`).
4. After editing a dictionary, run `bin/console es:index` so the updated analyzer configuration reaches the index.

## Essential identifiers

- `advanced_search.analysis.analyzer`, `advanced_search.filter`, `advanced_search.language_analyzer_mapping`
- `dictionary_decompounder` filter
- `sw_<iso>_technical_term_index_analyzer`
- `advanced_search_compound_dictionary` (`wordList`), `advanced_search_stopword_dictionary` (`stopwords`)
- `bin/console es:index`

## Gotchas

- A custom analyzer has no effect unless it is mapped to a language ISO code in `language_analyzer_mapping`.
- Decomposition runs at index time only, on the technical-term index analyzer `sw_<iso>_technical_term_index_analyzer`; search queries are never expanded into parts.
- Custom stopwords are stripped at both index and search time.
- Dictionary edits require a reindex (`es:index`).

## Version notes

- The `dictionary_decompounder` filter with a seeded German root-word dictionary ships since Commercial 7.12.0.

## Code check (6.7.15.1)
- unverified `advanced_search.language_analyzer_mapping` — SwagCommercial config tree, outside core/storefront/administration roots
- unverified `dictionary_decompounder` — Advanced Search analysis filter, defined in SwagCommercial, out of scope
- unverified `sw_<iso>_technical_term_index_analyzer` — SwagCommercial analyzer name, out of scope
- unverified `advanced_search_compound_dictionary` — SwagCommercial entity, not in the installed core roots
- unverified `advanced_search_stopword_dictionary` — SwagCommercial entity, not in the installed core roots
- unverified `es:index` — command lives in the shopware/elasticsearch package, outside the checked roots
