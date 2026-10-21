---
id: platform/hubs/opensearch.md
title: opensearch
summary: Navigation for OpenSearch/Elasticsearch in Shopware - setup, env vars, indexing, PaaS, Advanced Search, language inheritance ADRs.
keywords: ["opensearch", "elasticsearch", "OPENSEARCH_URL", "SHOPWARE_ES_ENABLED", "es:index", "advanced search", "multilingual index", "admin search", "paas", "dal:refresh:index", "ngram", "hosting"]
members: ["platform/dev/6.6/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md", "platform/dev/6.6/products/extensions/advanced-search/installation.md", "platform/dev/6.6/products/paas/shopware-paas/elasticsearch.md", "platform/dev/6.6/resources/guidelines/trouble-shoting.md", "platform/dev/6.6/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md", "platform/dev/6.7/concepts/framework/elasticsearch.md", "platform/dev/6.7/guides/hosting/_index.md", "platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md", "platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md", "platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md", "platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch.md", "platform/dev/6.7/guides/installation/legacy-setups/devenv-options.md", "platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md", "platform/dev/6.7/guides/plugins/plugins/integrations/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md", "platform/dev/6.7/products/extensions/advanced-search/Cross-search.md", "platform/dev/6.7/products/extensions/advanced-search/installation.md", "platform/dev/6.7/products/paas/shopware-paas/elasticsearch.md", "platform/dev/6.7/products/paas/shopware-paas/repository.md", "platform/dev/6.7/products/paas/shopware/guides/opensearch.md", "platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md", "platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md", "platform/func/extensions/advanced-search.md", "platform/func/settings/advanced-search-2-0.md", "platform/func/update-guides/update-guide-shopware-66.md"]
lastBuilt: 2026-10-21
---

# OpenSearch / Elasticsearch

This hub covers the search engine layer of Shopware: the Elasticsearch/OpenSearch bundle, the `OPENSEARCH_URL` and `SHOPWARE_ES_*` environment variables, the `es:*` and `dal:refresh:index` commands, hosting on PaaS, the multilingual index design, and the commercial Advanced Search extension. Come here when a question touches search infrastructure, indexing, or search tuning and you need to pick the right version and deployment target before reading a single page.

Version notes: the 6.6 set is small (setup, PaaS, Advanced Search installation, one troubleshooting entry, one ADR). The 6.7 set is the fuller one. The language inheritance ADR exists in both versions and is a near-duplicate; prefer the version matching the project. Advanced Search is commercial (licensed plan, Commercial plugin); the older Evolve-plan page is superseded by Advanced Search 2.0.

## Developer: 6.7

Concepts and hosting
- [Elasticsearch](platform/dev/6.7/concepts/framework/elasticsearch.md) — how ES is enabled per Criteria state, core classes, env vars, `es:*` commands.
- [Hosting](platform/dev/6.7/guides/hosting/_index.md) — supported stack and php.ini minimums, including optional search.
- [Elasticsearch](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/_index.md) — section overview of setup, config, debugging and performance.
- [Set up Elasticsearch](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md) — cluster basics, .env variables, shards, indexing commands, Admin search.
- [Elasticsearch](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch.md) — `SHOPWARE_ES_THROW_EXCEPTION` fallback and n-gram tuning.
- [Debugging and Troubleshooting Elasticsearch](platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md) — stuck indexing, cluster checks, SQL inspection.

Local environments
- [Additional Devenv Config](platform/dev/6.7/guides/installation/legacy-setups/devenv-options.md) — enabling OpenSearch and other services in devenv.
- [Install with Docker](platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md) — Docker dev setup that can include OpenSearch.

Plugin development
- [Integrations](platform/dev/6.7/guides/plugins/plugins/integrations/_index.md) — hub of plugin integration guides, including Elasticsearch.
- [Elasticsearch](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md) — search relevance tuning keys and analyzer env vars.
- [Add Product Entity Extension to Elasticsearch](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md) — decorate `ElasticsearchProductDefinition` for extension fields.

Advanced Search (commercial)
- [Installation](platform/dev/6.7/products/extensions/advanced-search/installation.md) — requirements for Advanced Search 2.0 and env vars.
- [Cross search](platform/dev/6.7/products/extensions/advanced-search/Cross-search.md) — `cross_search` config to reduce index size.

PaaS
- [Elasticsearch](platform/dev/6.7/products/paas/shopware-paas/elasticsearch.md) — Shopware PaaS: service, relationship, `SHOPWARE_ES_ENABLED`.
- [Repository](platform/dev/6.7/products/paas/shopware-paas/repository.md) — PaaS repository setup, mentions the search service.
- [How to set up OpenSearch](platform/dev/6.7/products/paas/shopware/guides/opensearch.md) — PaaS Native via `services.opensearch.enabled`.

ADRs
- [New language inheritance mechanism for opensearch](platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md) — one multilingual index per entity.
- [Apply OpenSearch globally for admin-api](platform/dev/6.7/resources/references/adr/2026-01-28-apply-opensearch-in-admin-api.md) — `ENABLE_OPENSEARCH_FOR_ADMIN_API` behaviour with MySQL fallback.

## Developer: 6.6

- [Set up Elasticsearch](platform/dev/6.6/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md) — 6.6 counterpart of the 6.7 setup guide.
- [Installation](platform/dev/6.6/products/extensions/advanced-search/installation.md) — Advanced Search 2.0 requirements on 6.6.
- [Elasticsearch](platform/dev/6.6/products/paas/shopware-paas/elasticsearch.md) — 6.6 PaaS enablement.
- [Troubleshooting](platform/dev/6.6/resources/guidelines/trouble-shoting.md) — slow dynamic product groups and cache invalidation fixes.
- [New language inheritance mechanism for opensearch](platform/dev/6.6/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md) — same ADR as in 6.7.

## Merchant

- [Advanced Search](platform/func/extensions/advanced-search.md) — Evolve-plan extension; superseded by Advanced Search 2.0.
- [Advanced Search 2 0](platform/func/settings/advanced-search-2-0.md) — search behaviour, boostings, synonyms, AI Copilot.
- [Update Guide Shopware 66](platform/func/update-guides/update-guide-shopware-66.md) — 6.6 changes, including multilingual indexing.
