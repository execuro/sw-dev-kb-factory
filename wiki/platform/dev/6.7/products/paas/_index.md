---
id: platform/dev/6.7/products/paas/_index.md
title: Shopware PaaS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/
sourceHash: 67924262feaf82d8bb3bedfa17ec0290f2d20879
codeCheckedAgainst: "6.7.15.1"
keywords: ["paas", "shopware paas", "shopware paas native", "platform as a service", "cloud hosting", "aws", "infrastructure as code", "hosting comparison", "managed hosting"]
summary: Compares Shopware PaaS (generic, multi-cloud, infrastructure as code) with Shopware PaaS Native (Shopware-only, managed on AWS).
lastBuilt: 2026-10-21
---
## What it is

Introduction to Shopware's two cloud platform offerings for hosting and developing Shopware projects, and how they differ in specialization and flexibility.

## When to use

When choosing between Shopware PaaS and Shopware PaaS Native for a project, or when you need to know how much of the infrastructure your team is responsible for on each.

## Key steps / config

- **Shopware PaaS**: a generic PaaS provider. It supports various applications and multiple cloud providers, and lets developers define their infrastructure as code. The trade-off: customers manage more of the infrastructure and setup themselves.
- **Shopware PaaS Native**: optimized solely for Shopware, running as a tightly integrated, controlled environment on AWS. Shopware manages all underlying configuration, so developers concentrate on application development; the source cites higher stability as the result of this focus.

The source positions PaaS Native as the unified platform that simplifies the development lifecycle and lets teams ship faster.

## Gotchas

- With Shopware PaaS (not Native), infrastructure definition is the customer's responsibility; with PaaS Native it is not configurable by the customer because Shopware manages it.

## Code check (6.7.15.1)
- unverified `Shopware PaaS` — hosting product; no PaaS-specific code exists in the installed core/storefront/administration packages
- unverified `Shopware PaaS Native` — hosting product on AWS, outside the installed code
