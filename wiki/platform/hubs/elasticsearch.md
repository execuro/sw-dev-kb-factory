---
id: platform/hubs/elasticsearch.md
title: elasticsearch
summary: Elasticsearch/OpenSearch in Shopware: concepts, hosting, PaaS, Advanced Search, ADRs and merchant search settings across 6.6 and 6.7.
keywords: ["elasticsearch", "opensearch", "advanced search", "es:index", "SHOPWARE_ES_ENABLED", "multilingual index", "cross search", "search hosting", "paas opensearch", "search settings", "ElasticsearchDefinition"]
members: ["platform/dev/6.6/concepts/framework/elasticsearch.md", "platform/dev/6.6/guides/hosting/infrastructure/_index.md", "platform/dev/6.6/guides/hosting/infrastructure/elasticsearch/_index.md", "platform/dev/6.6/guides/hosting/performance/performance-tweaks.md", "platform/dev/6.6/guides/plugins/plugins/elasticsearch/_index.md", "platform/dev/6.6/products/extensions/advanced-search/Cross-search.md", "platform/dev/6.6/products/extensions/advanced-search/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/product-search.md", "platform/dev/6.6/products/paas/shopware-paas/elasticsearch.md", "platform/dev/6.6/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md", "platform/dev/6.7/concepts/framework/elasticsearch.md", "platform/dev/6.7/guides/hosting/_index.md", "platform/dev/6.7/guides/hosting/infrastructure/_index.md", "platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md", "platform/dev/6.7/products/extensions/advanced-search/Cross-search.md", "platform/dev/6.7/products/extensions/advanced-search/How-to-modify-completion.md", "platform/dev/6.7/products/extensions/advanced-search/_index.md", "platform/dev/6.7/products/extensions/advanced-search/installation.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/product-search.md", "platform/dev/6.7/products/paas/shopware-paas/elasticsearch.md", "platform/dev/6.7/products/paas/shopware/guides/opensearch.md", "platform/dev/6.7/resources/guidelines/code/platform-domains.md", "platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md", "platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md", "platform/func/extensions/advanced-search.md", "platform/func/features/advanced-search.md", "platform/func/settings/search.md", "platform/func/tutorials-and-faq/performance-tips.md", "platform/func/update-guides/update-guide-shopware-66.md"]
lastBuilt: 2026-10-21
---

# Elasticsearch

This hub covers Shopware's Elasticsearch/OpenSearch integration: the core concept (enabling it per Criteria, `ElasticsearchDefinition`, `ElasticsearchEntitySearcher`, `es:*` console commands), hosting and PaaS setup, the Commercial Advanced Search extension, related ADRs, and the merchant-facing search settings. Come here when a question spans several of these (for example env vars plus indexing commands plus plugin extension) instead of grepping individual pages.

## Developer: 6.7

- [Elasticsearch](platform/dev/6.7/concepts/framework/elasticsearch.md) — core concept, key classes, env vars and `es:*` commands.
- [Hosting](platform/dev/6.7/guides/hosting/_index.md) — supported stack and requirements including optional search.
- [Infrastructure](platform/dev/6.7/guides/hosting/infrastructure/_index.md) — hosting infrastructure overview incl. Elasticsearch.
- [Elasticsearch](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md) — setup, configuration, debugging, indexing and performance.
- [Integrations](platform/dev/6.7/guides/plugins/plugins/integrations/_index.md) — plugin integration guides, including Elasticsearch entity extensions.
- [Elasticsearch](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md) — search tuning keys (`core.search.minScore`, `elasticsearch.search`) and analyzer env vars.
- [Advanced Search](platform/dev/6.7/products/extensions/advanced-search/_index.md) — Commercial feature overview (since Commercial 5.5.0).
- [Installation](platform/dev/6.7/products/extensions/advanced-search/installation.md) — Advanced Search 2.0 requirements and `SHOPWARE_ES_*` variables.
- [Cross search](platform/dev/6.7/products/extensions/advanced-search/Cross-search.md) — `cross_search` config to search via associations.
- [Completion](platform/dev/6.7/products/extensions/advanced-search/How-to-modify-completion.md) — add completion keywords to a custom definition.
- [Product Search](platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/product-search.md) — B2B Suite autocompletion; variants filter with Elasticsearch.
- [Elasticsearch](platform/dev/6.7/products/paas/shopware-paas/elasticsearch.md) — enabling the search service on PaaS.
- [How to set up OpenSearch](platform/dev/6.7/products/paas/shopware/guides/opensearch.md) — PaaS Native setup via `services.opensearch.enabled`.
- [Platform Domains](platform/dev/6.7/resources/guidelines/code/platform-domains.md) — allowed dependencies between Core, Administration, Storefront and Elasticsearch.
- [New language inheritance mechanism for opensearch](platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md) — ADR: one multilingual index per entity.
- [Apply OpenSearch globally for admin-api](platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md) — ADR: Admin API searches behind `ENABLE_OPENSEARCH_FOR_ADMIN_API`.

## Developer: 6.6

The 6.6 pages mirror many 6.7 ones (near-duplicates by topic); prefer 6.7 unless working on 6.6.

- [Elasticsearch](platform/dev/6.6/concepts/framework/elasticsearch.md) — 6.6 concept page.
- [Infrastructure](platform/dev/6.6/guides/hosting/infrastructure/_index.md) — hosting infrastructure index.
- [Elasticsearch](platform/dev/6.6/guides/hosting/infrastructure/elasticsearch/_index.md) — hosting guides index.
- [Performance Tweaks](platform/dev/6.6/guides/hosting/performance/performance-tweaks.md) — config keys and env vars incl. `SHOPWARE_ES_THROW_EXCEPTION`.
- [Elasticsearch](platform/dev/6.6/guides/plugins/plugins/elasticsearch/_index.md) — extending entity fields into the search engine.
- [Advanced Search](platform/dev/6.6/products/extensions/advanced-search/_index.md) — Commercial feature (Evolve/Beyond plans).
- [Cross search](platform/dev/6.6/products/extensions/advanced-search/Cross-search.md) — experimental cross-index association search.
- [Product Search](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/product-search.md) — B2B Suite product search plugin.
- [Elasticsearch](platform/dev/6.6/products/paas/shopware-paas/elasticsearch.md) — OpenSearch on Shopware PaaS.
- [New language inheritance mechanism for opensearch](platform/dev/6.6/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md) — same ADR as the 6.7 copy.

## Merchant

- [Advanced Search](platform/func/extensions/advanced-search.md) — Evolve-plan extension: field indexing, boosting, synonyms; superseded by Advanced Search 2.0.
- [Advanced Search](platform/func/features/advanced-search.md) — feature summary of the Elasticsearch-based storefront search.
- [Search](platform/func/settings/search.md) — Settings > General > Search: weighting, Advanced Search, AI Copilot.
- [Performance Tips](platform/func/tutorials-and-faq/performance-tips.md) — recommended stack, MySQL tuning, Admin Worker vs CLI Worker.
- [Update Guide Shopware 66](platform/func/update-guides/update-guide-shopware-66.md) — 6.6 changes, including OpenSearch and multilingual indexing.
