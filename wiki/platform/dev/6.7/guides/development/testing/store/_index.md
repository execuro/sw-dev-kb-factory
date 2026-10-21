---
id: platform/dev/6.7/guides/development/testing/store/_index.md
title: Extensions for Store
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/
sourceHash: 0a0eed840d78c3a54d0f37dbba4dee741d6e3789
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware store", "store review", "extension review", "quality guidelines", "plugin publication", "app submission", "themes", "not allowed store behaviors", "seo", "cookies and privacy", "uninstall data cleanup", "store review errors"]
summary: Index of Shopware Store review topics for plugins, apps and themes - quality guidelines, integration boundaries, Storefront/SEO/privacy, listing, cleanup.
lastBuilt: 2026-10-21
---
## What it is

Overview of the Shopware Store review and quality section for extension developers (plugins, apps, themes) who distribute through the Shopware Store. It describes what reviewers check during publication and links checklist-style sub-pages.

## When to use

Before submitting an extension to the Store, to align implementation and tests with reviewer expectations. Store review complements your own automated and manual testing; it verifies supported integration boundaries, predictable behaviour for merchants and customers, and listing, security and compliance rules.

## Key steps / config

The section is organised into these review areas (sub-page titles as in the source):

- **Quality guidelines** - "Quality guidelines for Store extensions": non-negotiable quality, security and compliance requirements for every extension regardless of type or size.
- **Scope and integration boundaries** - "Not allowed store behaviors" and "Functionality and integration": no reliance on undocumented core internals, unsafe database or filesystem usage, or API misuse; how to integrate with core, persistence and public APIs.
- **Storefront, SEO and compliance** - "Storefront, performance, and errors", "SEO and structured data", "Cookies and privacy": stable Storefront behaviour, performance, error handling, SEO output, structured data, cookies and consent. Use these as acceptance criteria for themes and Storefront-facing plugins.
- **Listing, lifecycle and code quality** - "Content and translations" (descriptions, media, translations), "Uninstallation and data cleanup" (install/uninstall behaviour), "Code quality" (maintainability), "Common Store review errors" (index of recurring reviewer feedback).
- **FAQ** - submission logistics, timelines and readiness questions.

## Gotchas

- Publication is gated on these rules; they apply to every Store extension independent of type or size.
- Uninstall behaviour, including data cleanup, is part of the review.

## Code check (6.7.15.1)
- unverified `quality guidelines` — Store review policy page; no code identifier to check in the vendor roots
- unverified `not allowed store behaviors` — review policy, not a code contract
