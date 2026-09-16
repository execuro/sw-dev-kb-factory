---
id: platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md
title: Differentiator cluster for Shopware plugins or apps
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/testing/Differentiator-Clusters.html
sourceHash: a6964b82b4df822431cba13fd6e0d3a501efd7fd
keywords: ["differentiator cluster", "Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4", "Store release criteria", "Admin SDK", "Rule Builder", "Dynamic Product Stream", "Flow Builder", "custom fields", "headless solution"]
summary: "The four differentiator-cluster criteria a Shopware plugin or app must meet to be released to the Store."
lastBuilt: "2026-09-15"
---
## What it is
Defines the "differentiator clusters" a Shopware plugin or app must satisfy to be released to the Shopware Store — criteria for having a meaningful, non-duplicate use case or integration.

## When to use
When preparing a plugin or app for Store submission and needing to justify why it is not a duplicate of an existing extension.

## Key steps / config
Four cluster variations, at least one of which the extension must fulfill:
- Cluster 1: offers a meaningful use case not replicated by comparable plugins/apps, plus a meaningful integration not implemented by the comparison extension.
- Cluster 2: offers a meaningful use case not replicated elsewhere, and works sensibly with Shopware standards rather than a custom technical approach.
- Cluster 3: app-system based, offering a meaningful integration not implemented in the comparison plugins.
- Cluster 4: app-system based, offering a meaningful use case not replicated by comparable plugins.

Examples of "meaningful use of the Shopware standard": using custom fields instead of own tables, using the Admin SDK instead of own modules, offering a headless solution, offering a reasonable/compliant API connection, and precisely adapting to the Shopware admin UI without disturbing its styling.

Examples of "meaningful use cases not represented elsewhere": automatic customer/partner emails, combining the extension's function with variants, linking the function with advanced pricing, and offering different configurations per sales channel.

Examples of "Shopware integrations": meaningful integration of the Rule Builder, the Dynamic Product Stream, the Shopware webhook integration, or the Flow Builder into the plugin/app.

## Essential identifiers
- Cluster 1 / Cluster 2 / Cluster 3 / Cluster 4 (differentiator clusters)
- Admin SDK
- Rule Builder
- Dynamic Product Stream
- Flow Builder
