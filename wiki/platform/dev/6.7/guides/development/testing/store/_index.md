---
id: platform/dev/6.7/guides/development/testing/store/_index.md
title: Extensions for Store
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/
sourceHash: 0a0eed840d78c3a54d0f37dbba4dee741d6e3789
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware store", "store review", "extension publication", "quality guidelines", "store submission", "plugins", "apps", "themes", "code review", "compliance", "uninstall cleanup", "seo"]
summary: "Overview of Shopware Store review for plugins, apps and themes: quality rules, integration boundaries, storefront/SEO/privacy, listing and code quality."
lastBuilt: 2026-09-15
---
## What it is

Landing page of the "Shopware Store review and quality" section for extension developers (plugins, apps, themes) who distribute through the Shopware Store. It explains what reviewers check during publication and groups the detailed checklist pages by topic.

## When to use

Before submitting an extension to the Store, to find the page that covers a given review area, or to turn review expectations into acceptance criteria and tests.

## Key steps / config

Store review complements your own automated and manual testing. It checks that the extension stays within supported integration boundaries, behaves predictably for merchants and customers, and meets listing, security and compliance rules. The section is organised as:

- **Quality guidelines** — non-negotiable quality, security and compliance requirements for every Store extension, regardless of type or size.
- **Scope and integration boundaries** — "Not allowed store behaviors" and "Functionality and integration": no reliance on undocumented core internals, unsafe database/filesystem usage or API misuse.
- **Storefront, SEO and compliance** — "Storefront, performance, and errors", "SEO and structured data", "Cookies and privacy" (consent handling).
- **Listing, lifecycle and code quality** — "Content and translations" (descriptions, media, translations), "Uninstallation and data cleanup", "Code quality", and "Common Store review errors" (index of recurring review feedback).
- **FAQ** — submission logistics, timelines and readiness questions.

## Code check (6.7.13.0)
- unverified `Store review` — overview page lists review policy topics only; no code identifiers or normative code claims to check in vendor/shopware
