---
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/02-conceptual-structure.md
title: Conceptual Structure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/02-conceptual-structure.html
sourceHash: 72816c55b8ebc0d11cc8fd676bd63a5e79db398b
codeCheckedAgainst: "6.7.13.0"
keywords: ["documentation guidelines", "conceptual outline", "docs structure", "concepts", "products", "guides", "resources", "how-to", "tutorials", "cross-references"]
summary: "Shopware docs are split into Concepts, Products, Guides and Resources; purpose of each section and how Guides cross-reference Concepts."
lastBuilt: 2026-09-15
---
## What it is

Documentation guideline describing the four top-level sections of the Shopware developer docs (Concepts, Products, Guides, Resources) and what kind of content belongs in each.

## When to use

When deciding where a new documentation article belongs, or how deep and in which style (explain vs. show) it should be written.

## Key steps / config

- **Concepts** — core concepts of Shopware and how the platform is organized; an entry point that **explains** rather than **shows** how things work.
- **Products** — topics specific to a single Shopware product; each product serves as an entry point to other sections. Example: the catalog in the Community Edition and in all commercial plans is technically the same.
- **Guides** — how-tos, examples, cookbooks and tutorials. Unlike Concepts, Guides show code, give concrete examples and provide step-by-step instructions.
- **Resources** — structured documentation for API references, code references, testing references, tooling, links, SDKs and libraries, plus contribution and publishing guidelines.

Cross-referencing: Guides refer back to the Concepts section for related topics. Example from the source: "How to create a custom cart processor" may use terms from "Concepts > Commerce > Checkout > Cart" and relate to "Concepts > Framework > Rules".

## Gotchas

- Do not put code-heavy step-by-step material into Concepts; it belongs in Guides, with a link back to the concept.

## Code check (6.7.13.0)
- unverified `Concepts > Commerce > Checkout > Cart` — documentation navigation path, not an identifier in vendor/shopware code
- unverified `Concepts > Framework > Rules` — documentation navigation path, not an identifier in vendor/shopware code
