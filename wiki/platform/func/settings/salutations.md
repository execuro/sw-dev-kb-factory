---
id: platform/func/settings/salutations.md
title: "Salutations"
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/salutations"
sourceHash: "4ea48bf514649bd58d1f28dd257039b48830fe917126004b35f6987714678e26"
revision:
  current: true
  range: "6.5.0.0 - 6.6.10.10"
  swMin: "6.5.0.0"
  swMax: "6.6.10.10"
keywords: ["salutation", "salutations", "technical name", "letter salutation", "Settings > Customer", "customer title", "form of address", "not_specified", "undefined", "create salutation", "edit salutation", "delete salutation"]
summary: "Salutations settings page (Settings > Customer > Salutations) for viewing, creating, editing and deleting customer salutations and their technical names."
lastBuilt: "2026-09-15"
---
## What it is

The Salutations settings page (Settings > Customer > Salutations in the Shopware Administration) lists every salutation available in the shop and lets merchants view, create, edit, and delete them.

## When to use

Use this page when you need to add a new salutation option for customers (e.g. a title or form of address) beyond the ones Shopware ships with by default, or when you need to rename or adjust an existing one.

## Key steps / config

- Open the overview: Settings > Customer > Salutations. It shows all salutations already stored in the shop.
- Create a new salutation: select "add a salutation" in the overview; a new page opens with three fields — a technical name, the name of the salutation, and a letter salutation.
- Edit an existing salutation: open the row's context menu > Edit; you can change the technical name, the salutation, and the letter salutation.
- Delete an existing salutation: also available from the overview.
- By default, Shopware stores a set of standard salutations plus their corresponding letter salutations. Two additional technical salutations, `not_specified` and `undefined`, are always present in the standard system.

## Essential identifiers

- Settings > Customer > Salutations
- Technical name (mandatory field)
- Default technical names: `not_specified`, `undefined`

## Gotchas

The technical name field is mandatory and must not be empty — Shopware requires it to complete an order, which is why the two placeholder salutations `not_specified` and `undefined` exist in the standard system. The technical name is also a unique identifier used to reference the salutation elsewhere, e.g. in e-mails.
