---
id: platform/dev/6.7/products/paas/shopware/_index.md
title: Shopware PaaS Native
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/
sourceHash: dc2207c7320bc2ee17423d8ec44963735b19733f
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware paas native", "paas", "platform-as-a-service", "managed hosting", "cloud hosting", "kubernetes", "aws", "infrastructure layer", "platform layer", "self-hosted vs saas", "ci/cd", "hosting models"]
summary: "Shopware PaaS Native: managed Kubernetes/AWS hosting for Shopware; infrastructure and platform layers; comparison with self-hosted and SaaS."
lastBuilt: 2026-09-15
---
## What it is

Shopware PaaS Native (Platform-as-a-Service) is a fully managed, cloud-native environment for hosting and developing Shopware applications. It uses an opinionated infrastructure so developers work on custom code while Shopware manages scaling and infrastructure.

## When to use

When choosing a hosting model for a Shopware project and weighing control over customization against infrastructure effort, or as the entry point to the PaaS Native section (CLI, applications, CDN, composable frontends).

## Key steps / config

Key technical features stated by the source:

- **Kubernetes on AWS**: managed servers, storage, networking and databases that scale automatically with application demand.
- **Developer tools and workflows**: preconfigured tooling integrating with the CLI and APIs for deployment, testing and monitoring.
- **Build and deployment pipelines**: a ready-to-use CI/CD environment, so no complex infrastructure configuration has to be managed.

Architecture has two layers:

1. **Infrastructure layer** – Kubernetes and AWS resources that scale per project needs.
2. **Platform layer** – a preconfigured environment with integrated best practices and tools for developing and deploying Shopware applications.

Hosting model comparison:

| Model | Infrastructure responsibility | Customization control | Setup/maintenance effort | Ideal use case |
|---|---|---|---|---|
| Self-Hosted | Customer | Complete | High | Full control, advanced custom setups |
| Shopware PaaS Native | Shopware (customer manages application) | High, with opinionated best practices | Moderate, most infra tasks automated | Balance of control and managed scalability |
| SaaS | Shopware | Limited; only through apps | Low | Ease of use, minimal setup |

## Gotchas

- On PaaS Native the customer still owns the application itself; only the infrastructure is managed by Shopware.
- Customization on SaaS is possible only through apps, whereas PaaS Native allows full application code within its opinionated setup.

## Code check (6.7.13.0)
- unverified `Shopware PaaS Native` — hosting platform product; its infrastructure is not part of the installed vendor/shopware code
- unverified `Kubernetes` — PaaS infrastructure layer, outside vendor/shopware scope
