---
id: platform/dev/6.6/resources/guidelines/documentation-guidelines/02-conceptual-structure.md
title: Conceptual Structure
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/documentation-guidelines/02-conceptual-structure.html
sourceHash: 72816c55b8ebc0d11cc8fd676bd63a5e79db398b
keywords: ["conceptual structure", "documentation guidelines", "concepts", "products", "guides", "resources", "documentation sections", "cross-references", "writing guidelines", "content structure"]
summary: "Explains Shopware's documentation structure: Concepts, Products, Guides, and Resources sections, each with a different focus."
lastBuilt: 2026-09-15
---
## What it is

This page describes the conceptual structure used across Shopware's documentation: articles are organized into four sections — Concepts, Products, Guides, and Resources — each giving a different level of detail, abstraction, and focus.

## When to use

Use when deciding which section a new documentation page belongs in, or when adding cross-references between a Guide and the related Concepts topics.

## Key steps / config

- **Concepts** articulates the core concepts of Shopware. It is an entry point to learn how the platform is organized, and it explains rather than shows how things work.
- **Products** deals with topics specific to a single Shopware product. Every product shares at least some aspect and serves as an entry point to other sections — for example, the catalog used in the Community Edition and in all commercial plans is technically the same.
- **Guides** is home to how-to's, examples, cookbooks, and tutorials. In contrast to Concepts articles, Guides show code, give concrete examples, and provide step-by-step instructions. Guides should refer back to the Concepts section for related topics: for example, "How to create a custom cart processor" might use terms explained in "Concepts > Commerce > Checkout > Cart" and also relate to "Concepts > Framework > Rules". A clear structure lets writers create these cross-references and keeps the documentation readable.
- **Resources** contains structured documentation for API references, code references, testing references, tooling, links, SDKs, libraries, etc., and also includes guidelines for contribution and publishing.

## Essential identifiers

`Concepts`, `Products`, `Guides`, `Resources`
