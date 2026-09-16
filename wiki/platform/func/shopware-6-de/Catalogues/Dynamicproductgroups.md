---
id: platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md
title: Dynamicproductgroups
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-de/Catalogues/Dynamicproductgroups
sourceHash: 169a9ca1238b30cf2368f4e6fd30d1ec876de4f89e78e82bd1ed7559607c4298
revision:
  current: true
  range: "6.4.12.0 - 6.7.12.2"
  swMin: "6.4.12.0"
  swMax: "6.7.12.2"
keywords: ["dynamic product groups", "rule builder", "product group conditions", "AND OR condition", "sub-condition", "operator is equal to", "custom field condition", "delivery time condition", "keep matching variants grouped", "shopping experiences product slider", "Catalogues > Dynamic product groups"]
summary: "Rule-based product groups (Catalogues > Dynamic product groups) usable in categories, product comparison, and Shopping Experiences sliders."
lastBuilt: "2026-09-15"
---

## What it is

Dynamic product groups, under **Catalogues > Dynamic product groups**, are groups of products formed by dynamic rules that can be surfaced at different points in a shop.

## When to use

Use it to build automatically-maintained product sets (e.g. sale items, manufacturer-specific lists) for dynamic categories, product comparison feeds, or Shopping Experiences product sliders.

## Key steps / config

- Overview lists name, description, last-change date, and status (a group is invalid if it relies on rules from a deactivated plugin); context menu edits/duplicates/deletes, **create product group** adds a new one.
- **General information**: Name (required), Description (optional), "Keep matching variants grouped" (when enabled, variants stay under a shared main product in categories/cross-selling/CMS product sliders; when disabled, variants display individually), and "Save and duplicate" from the Save dropdown.
- **Conditions**: pick a property and a condition; combine further conditions with **AND** or **OR**; nest conditions with **SUB-CONDITION** (item must meet the main condition and the sub-condition); the condition's context menu inserts a new condition before/after; **Preview** shows matching products live.
- **Operators** for multi-value properties (products, categories, manufacturers, tags, properties): "Is equal to", "Is not equal to", "Is equal to any of", "Is not equal to any of", "Is equal to all of", "Is not equal to all of".
- Custom fields and product "delivery time" can also be used as conditions; removing a delivery time used in a condition breaks that condition.

## Essential identifiers

- Menu path: **Catalogues > Dynamic product groups**
- Operators: Is equal to, Is not equal to, Is equal to any of, Is not equal to any of, Is equal to all of, Is not equal to all of
- Setting: "Keep matching variants grouped"

## Gotchas

If a delivery time used in a condition is later removed, the condition remains but no longer functions correctly. To combine several AND-linked value selections, use "Is equal to all of" / "Is not equal to all of" rather than chaining multiple AND conditions on the same property.
