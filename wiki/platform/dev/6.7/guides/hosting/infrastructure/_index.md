---
id: platform/dev/6.7/guides/hosting/infrastructure/_index.md
title: Infrastructure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/
sourceHash: 013a72d1dabcb3c2accd2f6bbe74d6d375cc3ed4
codeCheckedAgainst: "6.7.13.0"
keywords: ["infrastructure", "hosting", "elasticsearch", "opensearch", "database cluster", "filesystem", "media files", "message queue", "rate limiter", "reverse proxy", "https proxy", "http cache"]
summary: "Overview of Shopware hosting infrastructure: Elasticsearch, database cluster, filesystem, message queue, rate limiter and reverse HTTPS proxy."
lastBuilt: 2026-09-15
---
## What it is

Entry page for the hosting infrastructure section. Shopware hosting infrastructure consists of:

- Elasticsearch/OpenSearch for advanced search
- a database cluster for data storage
- a filesystem for media files
- a message queue for asynchronous communication
- a rate limiter for request management
- a reverse HTTPS proxy for secure communication

Each component is described in its own sub-page of this section.

## Code check (6.7.13.0)
- confirmed `filesystem` — core config for private/public/temp filesystems — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:176
- confirmed `rate_limiter` — core API rate limiter config — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:237
- confirmed `reverse_proxy` — HTTP cache reverse proxy config, disabled by default — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:12
- confirmed `transports` — admin worker consumes webhook/async/low_priority queues — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:392
- unverified `elasticsearch` — search integration lives in the Elasticsearch package, outside the checked roots
