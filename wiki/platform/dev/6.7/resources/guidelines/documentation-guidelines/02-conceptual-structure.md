---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/02-conceptual-structure.md
sourceHash: 72816c55b8ebc0d11cc8fd676bd63a5e79db398b
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/02-conceptual-structure.html
title: Conceptual Structure
version: "6.7"
versions:
  - "6.7"
keywords: ["conceptual structure", "documentation outline", "concepts", "products", "guides", "resources", "how-to", "tutorials", "cookbooks", "cross-references", "docs sections", "documentation guidelines"]
summary: "How Shopware developer docs are split into Concepts, Products, Guides and Resources, what each section contains, and how to cross-reference them."
lastBuilt: 2026-10-21
---
## What it is

Part of the Shopware documentation guidelines describing the conceptual outline of the developer documentation. The docs are divided into four top-level sections — Concepts, Products, Guides, and Resources — each offering a different level of detail, abstraction, and focus, with writing guidelines established per section.

## When to use

When deciding where a new documentation article belongs, what kind of content (explanation versus code and step-by-step instructions) it should contain, or how it should link to related articles in other sections.

## Key steps / config

Place content in the section that matches its purpose:

- **Concepts** — the core concepts of Shopware and the entry point for learning how the platform is organized. Articles here **explain** rather than **show** how things work.
- **Products** — topics specific to a single Shopware product. Every product shares at least some aspects with others and acts as an entry point to the other sections; for example, the catalog used in the Community Edition and in all commercial plans is technically the same.
- **Guides** — all how-tos, examples, cookbooks, and tutorials. Unlike Concepts articles, Guides show code, give concrete examples, and provide step-by-step instructions.
- **Resources** — structured documentation such as API references, code references, testing references, tooling, links, SDKs, and libraries, plus guidelines for contribution and publishing.

Cross-reference from Guides back to Concepts for related topics. The guide's example: an article on "How to create a custom cart processor" may use terms explained in "Concepts > Commerce > Checkout > Cart" and relate to topics in "Concepts > Framework > Rules". A clear structure makes these cross-references possible and keeps the documentation readable.

## Gotchas

- Do not mix explanation-only content into Guides or step-by-step code into Concepts; the split between explaining and showing is the defining difference between the two sections.

## Code check (6.7.15.1)
- unverified `Concepts` — documentation section name, not a code identifier in the vendor/shopware roots
- unverified `Guides` — documentation section name, no normative code claim to check
- unverified `Resources` — documentation section name, no normative code claim to check
