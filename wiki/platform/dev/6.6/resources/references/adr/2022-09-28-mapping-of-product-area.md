---
id: platform/dev/6.6/resources/references/adr/2022-09-28-mapping-of-product-area.md
title: Mapping of product area
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-09-28-mapping-of-product-area.html"
sourceHash: ebbdb3fdabb93488c3c27a78fc2a80cb228d39b1
keywords: ["@package annotation", "product area", "team mapping", "platform repository", "rufus", "commercial", "admin", "storefront", "core", "checkout", "content", "services-settings"]
summary: "Documents the @package <area> annotation added to platform/rufus/commercial source files to map code to owning teams."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting the `@package <area>` annotation Shopware adds to source files so each file can be mapped to the team/area that owns it, including for automatic error-to-area mapping in the SaaS application.

## When to use

Relevant when adding a new file to the `platform`, `rufus` or `commercial` repositories and needing to know which `@package` annotation to add, or when investigating how errors get automatically routed to a team.

## Key steps / config

- Context: with many teams working on different parts of the Shopware 6 platform, a clear mapping from source code to team/area was needed both for ticket triage and for automatically mapping errors reported in the SaaS application to the right area.
- Decision: add a `@package <area>` annotation (a PHP-doc or JavaScript comment) to every file in the `src` and `tests` directories of the `platform`, `rufus` and `commercial` repositories.
- The defined areas are: `admin`, `storefront`, `core`, `inventory`, `checkout`, `content`, `customer-order`, `services-settings`, `buyers-experience`.
- Consequence: a PHP-doc/JavaScript comment with `@package <area>` is added to any affected file.

## Essential identifiers

- `@package <area>` annotation

## Gotchas

The annotation applies uniformly across three repositories (`platform`, `rufus`, `commercial`), not just the open-source platform repository, so files outside each repository's `src`/`tests` directories are not covered by this rule.
