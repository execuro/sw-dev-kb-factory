---
id: platform/dev/6.6/products/extensions/advanced-search/How-to-add-modify-language-analyzers-stopwords-stemmer.md
title: Language analyzers
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/advanced-search/How-to-add-modify-language-analyzers-stopwords-stemmer.html"
sourceHash: 1647d615052a6309585d57e32b3aac299164551c
keywords: ["language analyzer", "stopwords", "stemmer", "multi-language index", "advanced_search.yaml", "analysis.analyzer", "language_analyzer_mapping", "Elasticsearch analyzer", "SwagCommercial", "tokenizer"]
summary: "How to add or customize Elasticsearch language analyzers, stopwords, and stemmers for the multi-language search index."
lastBuilt: "2026-09-15"
---
## What it is

This page documents adding or customizing Elasticsearch language analyzers (stopwords, stemmers, normalization) introduced with the multi-language index in Advanced Search.

## When to use

Use when language-based search fields need custom analysis behavior per language.

## Key steps / config

Override the `analyzer` parameter in `custom/plugins/SwagCommercial/src/AdvancedSearch/Resources/config/packages/advanced_search.yaml`:

```yaml
advanced_search:
    analysis:
        analyzer:
            sw_your_custom_language_analyzer:
                type: custom
                tokenizer: standard
                filter: [...]
        filter:
            my_stopwords_filter:
                type: 'stop'
                stopwords: [...]
            my_stemmer_filter:
                type: 'stemmer'
                language: 'english'
    language_analyzer_mapping:
        custom_iso: sw_your_custom_language_analyzer
```

The analyzer must be mapped to the language ISO code via `language_analyzer_mapping`.

## Essential identifiers

- `advanced_search.analysis.analyzer`
- `advanced_search.language_analyzer_mapping`
- `custom/plugins/SwagCommercial/src/AdvancedSearch/Resources/config/packages/advanced_search.yaml`
