---
id: platform/hubs/opensearch.md
title: opensearch
summary: "OpenSearch/Elasticsearch setup, hosting, DAL indexing, Advanced Search, PaaS wiring and troubleshooting across 6.6/6.7."
keywords: ["opensearch", "elasticsearch", "advanced search", "search indexing", "es:index", "hosting infrastructure", "paas", "admin api search", "multilingual index", "docker setup", "troubleshooting", "adr"]
members: ["platform/dev/6.6/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md", "platform/dev/6.6/products/extensions/advanced-search/installation.md", "platform/dev/6.6/products/paas/shopware-paas/elasticsearch.md", "platform/dev/6.6/resources/guidelines/trouble-shoting.md", "platform/dev/6.6/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md", "platform/dev/6.7/concepts/framework/elasticsearch.md", "platform/dev/6.7/guides/hosting/_index.md", "platform/dev/6.7/guides/hosting/infrastructure/_index.md", "platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md", "platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md", "platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md", "platform/dev/6.7/products/extensions/advanced-search/Cross-search.md", "platform/dev/6.7/products/extensions/advanced-search/How-to-define-your-custom-Elasticsearch-definition.md", "platform/dev/6.7/products/extensions/advanced-search/_index.md", "platform/dev/6.7/products/extensions/advanced-search/installation.md", "platform/dev/6.7/products/paas/shopware-paas/elasticsearch.md", "platform/dev/6.7/products/paas/shopware/guides/opensearch.md", "platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md", "platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md", "platform/func/extensions/advanced-search.md", "platform/func/settings/advanced-search-2-0.md", "platform/func/update-guides/update-guide-shopware-66.md"]
lastBuilt: 2026-09-15
---

Come here for anything involving OpenSearch/Elasticsearch in Shopware: enabling and configuring the search server, how the DAL routes searches to it, the Advanced Search commercial module built on it, hosting/infrastructure requirements, PaaS wiring, and known troubleshooting/design decisions. Prefer this hub over grepping when you need to trace a `SHOPWARE_ES_*` env var, an `es:*` console command, or decide which of several near-duplicate setup pages applies to your Shopware version.

### Developer — 6.6

- [Set up Elasticsearch](platform/dev/6.6/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md) — cluster basics, `.env` variables, shard/replica config, indexing commands, admin search setup.
- [Installation](platform/dev/6.6/products/extensions/advanced-search/installation.md) — Advanced Search 2.0 requirements: Commercial plan, running OpenSearch, enabled Elasticsearch bundle, on-prem env vars. Near-duplicate of the 6.7 Advanced Search installation page below (same requirements, different version tree).
- [Elasticsearch](platform/dev/6.6/products/paas/shopware-paas/elasticsearch.md) — enable OpenSearch on Shopware PaaS via service declaration, relationship, `SHOPWARE_ES_ENABLED`. Near-duplicate of the 6.7 PaaS elasticsearch page below.
- [Troubleshooting](platform/dev/6.6/resources/guidelines/trouble-shoting.md) — fixes for slow dynamic product groups and overly frequent cache invalidation.
- [New language inheritance mechanism for opensearch](platform/dev/6.6/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md) — ADR: one multilingual index per entity with object-field mapping and `multi_match` fallback. Identical ADR is also filed under 6.7 (below).

### Developer — 6.7

- [Elasticsearch](platform/dev/6.7/concepts/framework/elasticsearch.md) — how DAL searches route to Elasticsearch/OpenSearch: `Criteria::STATE_ELASTICSEARCH_AWARE`, `ElasticsearchDefinition`, `ProductElasticsearchDefinition`, `ElasticsearchEntitySearcher`/`Aggregator`, `es:index`/`es:reset`.
- [Hosting](platform/dev/6.7/guides/hosting/_index.md) — recommended stack and minimum versions, including OpenSearch, for 6.7.
- [Infrastructure](platform/dev/6.7/guides/hosting/infrastructure/_index.md) — infrastructure overview covering Elasticsearch alongside DB cluster, filesystem, queue, rate limiter, reverse proxy.
- [Elasticsearch](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md) — index page for the Elasticsearch/OpenSearch hosting guides (setup, config, debugging, indexing, performance).
- [Install with Docker](platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md) — `ghcr.io/shopware/docker-dev` local dev setup (`make up`/`make setup`), which provisions OpenSearch among other services.
- [Elasticsearch](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md) — product search relevance tuning: `core.search.minScore`, `dis_max` tie breaker, analyzer env vars, single-hit redirect.
- [Advanced Search](platform/dev/6.7/products/extensions/advanced-search/_index.md) — overview of the Commercial Advanced Search module (5.5.0+, Evolve/Beyond plans).
- [Installation](platform/dev/6.7/products/extensions/advanced-search/installation.md) — Advanced Search 2.0 requirements; near-duplicate of the 6.6 version above.
- [Cross search](platform/dev/6.7/products/extensions/advanced-search/Cross-search.md) — experimental `advanced_search.cross_search` config for searching across associations via another entity's index.
- [Define a Custom Elasticsearch Definition](platform/dev/6.7/products/extensions/advanced-search/How-to-define-your-custom-Elasticsearch-definition.md) — building a custom `AbstractElasticsearchDefinition` tagged `shopware.es.definition`.
- [Elasticsearch](platform/dev/6.7/products/paas/shopware-paas/elasticsearch.md) — enabling OpenSearch on Shopware PaaS/Upsun via `.platform/services.yaml` relationships; near-duplicate of the 6.6 version above.
- [How to set up OpenSearch](platform/dev/6.7/products/paas/shopware/guides/opensearch.md) — PaaS Native: `services.opensearch.enabled`, then reindex with `dal:refresh:index --use-queue`.
- [New language inheritance mechanism for opensearch](platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md) — same ADR content as the 6.6 copy above.
- [Apply OpenSearch globally for admin-api](platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md) — ADR: behind `ENABLE_OPENSEARCH_FOR_ADMIN_API`, Admin API DAL searches on admin-indexed entities go to OpenSearch, falling back to MySQL.

### Merchant

- [Advanced Search](platform/func/extensions/advanced-search.md) — Evolve-plan Elasticsearch search extension (field indexing/boosting, synonyms, console commands); superseded by Advanced Search 2.0 below.
- [Advanced Search 2 0](platform/func/settings/advanced-search-2-0.md) — OpenSearch-based Advanced Search configuration: behaviour, boostings, synonyms, actions, AI Copilot.
- [Update Guide Shopware 66](platform/func/update-guides/update-guide-shopware-66.md) — 6.6 release notes; mentions multilingual OpenSearch/Elasticsearch indexing among other stack changes.
