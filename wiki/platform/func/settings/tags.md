---
id: platform/func/settings/tags.md
title: Tags
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/tags
sourceHash: e1dce1a24492ead619f2e96c54f5e6ca913adcf012054470c94d759503c26b12
revision:
  current: true
  range: "current"
  swMin: null
  swMax: null
keywords: ["tags", "tag overview", "add tag", "show duplicate tags only", "show unassigned tags only", "rule builder", "flow builder", "dynamic product groups", "assignments", "keywords for entities"]
summary: "Overview page for creating and managing keyword tags on products, categories, media, customers, orders and other entities."
lastBuilt: "2026-09-15"
---

## What it is

Tags let merchants store keywords on products, categories, media, customers, orders, shipping methods, newsletter recipients, landing pages, or rules, usable for example in Rule Builder conditions.

## When to use

Use it to label entities for filtering, discount targeting, dynamic product groups, or Flow Builder traceability.

## Key steps / config

- **Add tag** creates a new tag with a name; the second **Assignments** tab lets you assign the tag to entities (e.g. open the "Products" folder and select products via search).
- Search bar finds any tag; filters include "Show duplicate tags only" (tags with the same name occurring more than once) and "Show unassigned tags only" (tags with no assignment), plus filtering by assigned entity type (e.g. Products).
- Table columns: **Tag** (alphabetically sorted) and **Assignments** (all entities the tag is applied to); the row's context menu edits, duplicates, or deletes a tag.

## Essential identifiers

- Filters: "Show duplicate tags only", "Show unassigned tags only"
- Table columns: Tag, Assignments

## Gotchas

Tags can be used to make products filterable for the Rule Builder, build dynamic product groups, restrict discount campaigns to tagged customers, or make Flow Builder components more traceable.
