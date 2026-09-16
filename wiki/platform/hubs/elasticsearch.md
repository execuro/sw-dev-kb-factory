---
id: platform/hubs/elasticsearch.md
title: elasticsearch
summary: "Elasticsearch/OpenSearch integration: enabling search, hosting setup, tuning, PaaS, Advanced Search plugin, and admin-API search."
keywords: ["elasticsearch", "opensearch", "criteria elasticsearchaware", "advanced search", "cross search", "es:index", "hosting infrastructure", "paas", "performance tuning", "admin api search", "platform domains", "search settings"]
members: ["platform/dev/6.6/concepts/framework/elasticsearch.md", "platform/dev/6.6/guides/hosting/infrastructure/_index.md", "platform/dev/6.6/guides/hosting/infrastructure/elasticsearch/_index.md", "platform/dev/6.6/guides/hosting/performance/performance-tweaks.md", "platform/dev/6.6/guides/plugins/plugins/elasticsearch/_index.md", "platform/dev/6.6/products/extensions/advanced-search/Cross-search.md", "platform/dev/6.6/products/extensions/advanced-search/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/product-search.md", "platform/dev/6.6/products/paas/shopware-paas/elasticsearch.md", "platform/dev/6.6/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md", "platform/dev/6.7/concepts/framework/elasticsearch.md", "platform/dev/6.7/guides/hosting/infrastructure/_index.md", "platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md", "platform/dev/6.7/products/extensions/advanced-search/Cross-search.md", "platform/dev/6.7/products/extensions/advanced-search/How-to-define-your-custom-Elasticsearch-definition.md", "platform/dev/6.7/products/extensions/advanced-search/_index.md", "platform/dev/6.7/products/extensions/advanced-search/installation.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/product-search.md", "platform/dev/6.7/products/paas/shopware-paas/elasticsearch.md", "platform/dev/6.7/products/paas/shopware/guides/opensearch.md", "platform/dev/6.7/resources/guidelines/code/platform-domains.md", "platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md", "platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md", "platform/func/extensions/advanced-search.md", "platform/func/features/advanced-search.md", "platform/func/settings/search.md", "platform/func/tutorials-and-faq/performance-tips.md", "platform/func/update-guides/update-guide-shopware-66.md"]
lastBuilt: "2026-09-15"
---

## What this covers

Shopware's Elasticsearch/OpenSearch integration: how DAL searches opt in to Elasticsearch instead of MySQL, the core classes involved (`ElasticsearchDefinition`, `ElasticsearchEntitySearcher`, `CriteriaParser`, etc.), hosting/PaaS setup, `es:*` console commands and env vars, performance tuning, extending indexed entity fields, the commercial Advanced Search module (including its experimental Cross Search), and the newer OpenSearch-backed Admin API search. Come here instead of grepping directly when deciding whether a search hits Elasticsearch or MySQL, wiring up a hosting/PaaS environment, or extending what's indexed.

Note: `platform/dev/6.6/products/extensions/advanced-search/Cross-search.md` and `platform/dev/6.6/products/extensions/advanced-search/_index.md` are near-duplicates of their `6.7` counterparts (identical `sourceHash`); the 6.7 pages additionally carry a code-check section.

### Core concept & criteria opt-in

- [Elasticsearch](platform/dev/6.6/concepts/framework/elasticsearch.md) — 6.6: enabling ES via `Context::STATE_ELASTICSEARCH_AWARE`, core ES classes, `es:*` commands.
- [Elasticsearch](platform/dev/6.7/concepts/framework/elasticsearch.md) — 6.7: same concept, corrected to `Criteria::STATE_ELASTICSEARCH_AWARE` (code-checked; the 6.6 page's `Context` constant does not exist in 6.7.13.0), plus which core routes opt in by default.

### Hosting infrastructure & PaaS

- [Infrastructure](platform/dev/6.6/guides/hosting/infrastructure/_index.md) — 6.6 index of hosting components (Elasticsearch, DB cluster, filesystem, queue, rate limiter, proxy).
- [Infrastructure](platform/dev/6.7/guides/hosting/infrastructure/_index.md) — 6.7 equivalent index.
- [Elasticsearch](platform/dev/6.6/guides/hosting/infrastructure/elasticsearch/_index.md) — 6.6 landing page for setup/config/debug/performance sub-guides.
- [Elasticsearch](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md) — 6.7 equivalent landing page.
- [Performance Tweaks](platform/dev/6.6/guides/hosting/performance/performance-tweaks.md) — production tuning config, including `SHOPWARE_ES_THROW_EXCEPTION` to disable silent MySQL fallback.
- [Elasticsearch](platform/dev/6.6/products/paas/shopware-paas/elasticsearch.md) — enabling OpenSearch as a PaaS service via `.platform/services.yaml`, relationship, and `SHOPWARE_ES_ENABLED`.
- [Elasticsearch](platform/dev/6.7/products/paas/shopware-paas/elasticsearch.md) — 6.7 equivalent, code-checked against installed env-var defaults.
- [How to set up OpenSearch](platform/dev/6.7/products/paas/shopware/guides/opensearch.md) — PaaS Native: `services.opensearch.enabled`, then `bin/console dal:refresh:index --use-queue`.

### Extending indexed entity fields

- [Elasticsearch](platform/dev/6.6/guides/plugins/plugins/elasticsearch/_index.md) — 6.6 index page for extending entity fields into the ES engine.
- [Integrations](platform/dev/6.7/guides/plugins/plugins/integrations/_index.md) — 6.7 index grouping Redis/Elasticsearch/ERP integration guides.
- [Elasticsearch](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md) — 6.7 search-relevance tuning: `core.search.minScore`, `dismax_tie_breaker`, analyzer env vars, single-hit redirect.
- [Add Product Entity Extension to Elasticsearch](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md) — decorating `ElasticsearchProductDefinition` to index custom product fields.
- [New language inheritance mechanism for opensearch](platform/dev/6.6/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md) — 6.6 ADR: `ES_MULTILINGUAL_INDEX`, one multilingual index per entity.
- [New language inheritance mechanism for opensearch](platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md) — same ADR, 6.7 build (code-checked, identifiers unverified — package not installed).
- [Apply OpenSearch globally for admin-api](platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md) — ADR: `ENABLE_OPENSEARCH_FOR_ADMIN_API` routes Admin API listing searches to OpenSearch.
- [Platform Domains](platform/dev/6.7/resources/guidelines/code/platform-domains.md) — coding guideline: `Elasticsearch` domain may depend only on `Core`, enforced via `RestrictNamespacesRule`.

### Commercial Advanced Search & Cross Search

- [Cross search](platform/dev/6.6/products/extensions/advanced-search/Cross-search.md) / [Cross search](platform/dev/6.7/products/extensions/advanced-search/Cross-search.md) — experimental `advanced_search.cross_search` config to search associations via another entity's index.
- [Advanced Search](platform/dev/6.6/products/extensions/advanced-search/_index.md) / [Advanced Search](platform/dev/6.7/products/extensions/advanced-search/_index.md) — Commercial plugin module (Evolve/Beyond plans) built on Elasticsearch.
- [Define a Custom Elasticsearch Definition](platform/dev/6.7/products/extensions/advanced-search/How-to-define-your-custom-Elasticsearch-definition.md) — writing a custom `AbstractElasticsearchDefinition` for the multilingual index.
- [Installation](platform/dev/6.7/products/extensions/advanced-search/installation.md) — Advanced Search 2.0 on-prem prerequisites and env vars.
- [Advanced Search](platform/func/extensions/advanced-search.md) — merchant-facing extension doc (versions 6.5-6.7): boosting, synonyms, indexing commands; superseded by Advanced Search 2.0.
- [Advanced Search](platform/func/features/advanced-search.md) — short merchant feature summary.
- [Search](platform/func/settings/search.md) — merchant Settings > General > Search page, including Advanced Search and AI Copilot options.

### B2B Suite & storefront product search

- [Product Search](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/product-search.md) / [Product Search](platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/product-search.md) — B2B Suite autocomplete input; with Elasticsearch, enable the variants filter to show all variants.

### Merchant / operational

- [Performance Tips](platform/func/tutorials-and-faq/performance-tips.md) — general tuning tips mentioning Elasticsearch/OpenSearch as an advanced option.
- [Update Guide Shopware 66](platform/func/update-guides/update-guide-shopware-66.md) — 6.6 release notes covering the switch to multilingual ES/OpenSearch indexes.
