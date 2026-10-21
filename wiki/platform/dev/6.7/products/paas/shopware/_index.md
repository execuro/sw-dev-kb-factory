---
id: platform/dev/6.7/products/paas/shopware/_index.md
title: Shopware PaaS Native
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/
sourceHash: dc2207c7320bc2ee17423d8ec44963735b19733f
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware paas native", "paas", "platform-as-a-service", "managed hosting", "kubernetes", "aws", "ci/cd", "infrastructure layer", "platform layer", "self-hosted", "saas", "hosting comparison", "cloud hosting"]
summary: Overview of Shopware PaaS Native, managed Kubernetes/AWS hosting for Shopware, its two-layer architecture, and how it compares to self-hosted and SaaS.
lastBuilt: 2026-10-21
---
## What it is

Shopware PaaS Native (Platform-as-a-Service) is a fully managed, cloud-native environment for hosting and developing Shopware applications. Shopware runs the infrastructure on an opinionated, preconfigured setup, so developers work on custom code and do not manage scaling or servers. This page introduces the offering. It defines no APIs, config keys or commands.

## When to use

When you choose a hosting model for a Shopware project and need to know where PaaS Native sits between self-hosting and SaaS, or what Shopware manages versus what the customer manages.

## Key steps / config

Key technical features described by the source:

- **Kubernetes on AWS.** Managed servers, storage, networking and databases scale automatically with application demand. High availability needs no manual intervention.
- **Developer tools and workflows.** Preconfigured tooling and standardised workflows for Shopware development. They integrate with the CLI, APIs and other development resources for deployment, testing and monitoring.
- **Build and deployment pipelines.** A ready-to-use CI/CD environment, so projects do not have to maintain complex infrastructure configuration themselves.

Architecture, in two layers:

1. **Infrastructure layer**: a cloud foundation on Kubernetes and AWS. Resources scale with project needs.
2. **Platform layer**: a preconfigured environment with integrated best practices and tools for developing and deploying Shopware applications. It gives every project a consistent, managed setup.

Comparison of hosting models:

| Aspect | Self-Hosted | Shopware PaaS Native | SaaS |
|---|---|---|---|
| Infrastructure responsibility | Customer | Shopware (customer manages the application) | Shopware |
| Control over customization | Complete | High, with opinionated best practices | Limited; only through apps |
| Setup and maintenance effort | High | Moderate; most infrastructure tasks automated | Low |
| Ideal use case | Full control, advanced custom setups | Balance of control and managed scalability | Ease of use, minimal setup |

## Gotchas

- With PaaS Native, Shopware manages the infrastructure, but the customer stays responsible for the application itself.
- On SaaS, the only way to customise is through apps. PaaS Native allows deeper customisation within its opinionated setup.

## Code check (6.7.15.1)
- unverified `Shopware PaaS Native` — hosting product overview; the page names no core classes, config keys or commands to check in the core packages
- unverified `Kubernetes/AWS infrastructure` — hosting infrastructure claim, outside the core packages
