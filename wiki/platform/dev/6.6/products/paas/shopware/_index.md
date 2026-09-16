---
id: platform/dev/6.6/products/paas/shopware/_index.md
title: Shopware PaaS Native
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/paas/shopware/
sourceHash: f854dc5765af0c4718681f8bac6ec004740cd296
keywords: ["Shopware PaaS Native", "PaaS", "Platform-as-a-Service", "Kubernetes", "AWS", "managed hosting", "infrastructure layer", "platform layer", "self-hosted", "SaaS", "CI/CD", "cloud-native"]
summary: Overview of Shopware PaaS Native, a managed Kubernetes/AWS platform for hosting Shopware, contrasted with self-hosted and SaaS models.
lastBuilt: "2026-09-15"
---
## What it is

Shopware PaaS Native (Platform-as-a-Service) is a fully managed, cloud-native environment dedicated to hosting and developing Shopware applications, built on an opinionated infrastructure so developers can focus on custom development instead of managing scalability or infrastructure.

## When to use

Relevant when deciding between hosting models: self-hosted (full control, high maintenance effort), Shopware PaaS Native (managed infrastructure, high control via opinionated best practices), or SaaS (fully managed by Shopware, limited customization via apps).

## Key steps / config

Shopware PaaS Native's architecture has two layers:

- **Infrastructure Layer** — a Kubernetes-based foundation running on AWS, providing managed servers, storage, networking, and databases that scale automatically.
- **Platform Layer** — a preconfigured environment with integrated best practices and tools that streamline development and deployment.

Comparison of responsibility across models:

| Model | Infrastructure responsibility | Customization control | Setup/maintenance effort |
|---|---|---|---|
| Self-Hosted | Fully managed by the customer | Complete control | High |
| Shopware PaaS Native | Managed by Shopware (customer manages application) | High control with opinionated best practices | Moderate, mostly automated |
| SaaS | Fully managed by Shopware | Limited; customization only via apps | Low |

## Essential identifiers

- `Shopware PaaS Native`
- Infrastructure Layer / Platform Layer (architecture terms)
